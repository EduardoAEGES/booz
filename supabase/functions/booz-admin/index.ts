// Edge Function "booz-admin": única vía de escritura del banco de preguntas BOOZ IB.
// La contraseña MASTER se guarda como hash PBKDF2 en la tabla booz_admin (sin acceso
// público) y se puede cambiar desde la web con la acción "cambiar_password".
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
const ID_CONTENIDO = "banco";
const BUCKET = "booz-imagenes";
const MAX_DATOS = 5 * 1024 * 1024;
const MAX_IMAGEN = 3 * 1024 * 1024;
const TIPOS_IMAGEN: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};
const VERSIONES_GUARDADAS = 40;
const ITERACIONES = 100_000;
const MIN_PASSWORD = 4;

const responder = (cuerpo: unknown, estado = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

const aHex = (bytes: Uint8Array) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
const deHex = (hex: string) => new Uint8Array(hex.match(/../g)!.map((h) => parseInt(h, 16)));

async function pbkdf2(password: string, sal: Uint8Array, iteraciones: number) {
  const clave = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: sal, iterations: iteraciones }, clave, 256);
  return new Uint8Array(bits);
}

// Formato guardado: pbkdf2$<iteraciones>$<sal hex>$<hash hex>
async function crearHash(password: string) {
  const sal = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERACIONES}$${aHex(sal)}$${aHex(await pbkdf2(password, sal, ITERACIONES))}`;
}

// Comparación en tiempo constante para no filtrar información por el tiempo de respuesta
async function contrasenaValida(sb: SupabaseClient, recibida: unknown) {
  if (typeof recibida !== "string" || !recibida) return false;
  const { data } = await sb.from("booz_admin").select("password_hash").eq("id", 1).maybeSingle();
  const partes = data?.password_hash?.split("$");
  if (!partes || partes.length !== 4 || partes[0] !== "pbkdf2") return false;

  const esperado = deHex(partes[3]);
  const calculado = await pbkdf2(recibida, deHex(partes[2]), Number(partes[1]));
  let diferencia = esperado.length ^ calculado.length;
  for (let i = 0; i < esperado.length; i++) diferencia |= esperado[i] ^ calculado[i];
  return diferencia === 0;
}

function datosValidos(datos: any) {
  return datos && typeof datos === "object" && !Array.isArray(datos) &&
    Array.isArray(datos.temas) && Array.isArray(datos.preguntas) &&
    typeof datos.ajustes === "object";
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return responder({ error: "Método no permitido" }, 405);

  let cuerpo: any;
  try {
    cuerpo = await req.json();
  } catch {
    return responder({ error: "Solicitud inválida" }, 400);
  }

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  if (!(await contrasenaValida(sb, cuerpo?.password))) {
    await new Promise((r) => setTimeout(r, 1000)); // frena los intentos repetidos
    return responder({ error: "Contraseña incorrecta" }, 401);
  }

  try {
    switch (cuerpo.accion) {
      case "verificar":
        return responder({ ok: true });

      case "cambiar_password": {
        const { nueva } = cuerpo;
        if (typeof nueva !== "string" || nueva.length < MIN_PASSWORD || nueva.length > 200) {
          return responder({ error: `La nueva contraseña debe tener al menos ${MIN_PASSWORD} caracteres` }, 400);
        }
        const { error } = await sb.from("booz_admin")
          .update({ password_hash: await crearHash(nueva), actualizado: new Date().toISOString() })
          .eq("id", 1);
        if (error) throw error;
        return responder({ ok: true });
      }

      case "guardar": {
        const { datos } = cuerpo;
        if (!datosValidos(datos)) return responder({ error: "Formato de datos inválido" }, 400);
        if (JSON.stringify(datos).length > MAX_DATOS) return responder({ error: "Los datos son demasiado grandes" }, 413);

        const { data: actual } = await sb.from("booz_contenido").select("datos").eq("id", ID_CONTENIDO).maybeSingle();
        if (actual) await sb.from("booz_historial").insert({ datos: actual.datos });

        const { error } = await sb.from("booz_contenido")
          .upsert({ id: ID_CONTENIDO, datos, actualizado: new Date().toISOString() });
        if (error) throw error;

        // Conserva solo las últimas versiones
        const { data: viejas } = await sb.from("booz_historial").select("id")
          .order("id", { ascending: false }).range(VERSIONES_GUARDADAS, VERSIONES_GUARDADAS + 200);
        if (viejas?.length) await sb.from("booz_historial").delete().in("id", viejas.map((v) => v.id));
        return responder({ ok: true });
      }

      case "historial": {
        const { data, error } = await sb.from("booz_historial").select("id, creado")
          .order("id", { ascending: false }).limit(VERSIONES_GUARDADAS);
        if (error) throw error;
        return responder({ versiones: data });
      }

      case "restaurar": {
        const id = Number(cuerpo.version);
        if (!Number.isInteger(id)) return responder({ error: "Versión inválida" }, 400);
        const { data: version, error } = await sb.from("booz_historial").select("datos").eq("id", id).single();
        if (error || !version) return responder({ error: "Versión no encontrada" }, 404);

        const { data: actual } = await sb.from("booz_contenido").select("datos").eq("id", ID_CONTENIDO).maybeSingle();
        if (actual) await sb.from("booz_historial").insert({ datos: actual.datos });
        const { error: errorGuardar } = await sb.from("booz_contenido")
          .upsert({ id: ID_CONTENIDO, datos: version.datos, actualizado: new Date().toISOString() });
        if (errorGuardar) throw errorGuardar;
        return responder({ ok: true, datos: version.datos });
      }

      case "subir_imagen": {
        const { tipo, base64 } = cuerpo;
        const extension = TIPOS_IMAGEN[tipo];
        if (!extension || typeof base64 !== "string") return responder({ error: "Formato de imagen no permitido" }, 400);
        const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
        if (bytes.length > MAX_IMAGEN) return responder({ error: "La imagen supera los 3 MB" }, 413);

        const ruta = `${crypto.randomUUID()}.${extension}`;
        const { error } = await sb.storage.from(BUCKET).upload(ruta, bytes, { contentType: tipo });
        if (error) throw error;
        const { data } = sb.storage.from(BUCKET).getPublicUrl(ruta);
        return responder({ url: data.publicUrl });
      }

      default:
        return responder({ error: "Acción desconocida" }, 400);
    }
  } catch (e) {
    console.error(e);
    return responder({ error: "Error del servidor" }, 500);
  }
});
