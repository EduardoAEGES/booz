// Edge Function "booz-admin": única vía de escritura del banco de preguntas BOOZ IB.
// La contraseña MASTER se guarda como secreto ADMIN_PASSWORD y nunca llega al navegador.
import { createClient } from "npm:@supabase/supabase-js@2";

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

const responder = (cuerpo: unknown, estado = 200) =>
  new Response(JSON.stringify(cuerpo), {
    status: estado,
    headers: { ...CORS, "Content-Type": "application/json" },
  });

async function resumen(texto: string) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(texto)));
}

// Comparación en tiempo constante para no filtrar información por el tiempo de respuesta
async function contrasenaValida(recibida: unknown) {
  const esperada = Deno.env.get("ADMIN_PASSWORD");
  if (!esperada || typeof recibida !== "string") return false;
  const [a, b] = await Promise.all([resumen(recibida), resumen(esperada)]);
  let diferencia = 0;
  for (let i = 0; i < a.length; i++) diferencia |= a[i] ^ b[i];
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

  if (!(await contrasenaValida(cuerpo?.password))) {
    await new Promise((r) => setTimeout(r, 1000)); // frena los intentos repetidos
    return responder({ error: "Contraseña incorrecta" }, 401);
  }

  const sb = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    switch (cuerpo.accion) {
      case "verificar":
        return responder({ ok: true });

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
