(() => {
  const CFG = window.BOOZ_CONFIG;
  const CLAVE_PROGRESO = "booz-progreso";
  const CLAVE_RESPUESTAS = "booz-respuestas";
  const CLAVE_TEMA = "booz-tema";
  const CLAVE_MASTER = "booz-master";
  const LOGO_POR_DEFECTO = "img/logo.jpg";
  const NOMBRE_DIFICULTAD = { facil: "Fácil", media: "Media", dificil: "Difícil" };
  const LETRAS_OPCION = "ABCDEFGHIJKLMNOP";
  const CIRCUNFERENCIA = 2 * Math.PI * 15;
  const SEPARADOR = `<svg viewBox="0 0 24 24"><path d="m9 6 6 6-6 6"/></svg>`;
  const CHEVRON = `<svg viewBox="0 0 24 24" class="chev"><path d="m6 9 6 6 6-6"/></svg>`;

  const ICONOS = {
    check: `<svg viewBox="0 0 24 24"><circle class="circulo" cx="12" cy="12" r="9"/><path class="tilde" d="m8 12 3 3 5-6"/></svg>`,
    estrella: `<svg viewBox="0 0 24 24"><path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.2l1-6.2L3 9.6l6.2-.9z"/></svg>`,
    expandir: `<svg viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-7 7M10 20H4v-6M4 20l7-7"/></svg>`,
    imagen: `<svg viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m21 16-5-5-9 9"/></svg>`,
    micro: `<svg viewBox="0 0 24 24"><rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>`,
    lapiz: `<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/><path d="m13 7 4 4"/></svg>`,
    fx: `<svg viewBox="0 0 24 24"><path d="M9 20c2 0 2-3 2.5-8S13 4 15 4M8 10h7M15 13l5 6M20 13l-5 6"/></svg>`,
    lista: `<svg viewBox="0 0 24 24"><path d="M10 6h10M10 12h10M10 18h10M4 6l1 1 2-2M4 12l1 1 2-2M4 18l1 1 2-2"/></svg>`,
    enviar: `<svg viewBox="0 0 24 24"><path d="M3 20.5 21 12 3 3.5l2.5 8.5zM5.5 12H13"/></svg>`,
    editar: `<svg viewBox="0 0 24 24"><path d="M4 20h4L19 9l-4-4L4 16z"/></svg>`,
    borrar: `<svg viewBox="0 0 24 24"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/></svg>`,
    duplicar: `<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>`,
    arriba: `<svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg>`,
    abajo: `<svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg>`
  };

  /* ================= Estado ================= */
  let datos = null;            // documento completo: { ajustes, temas, preguntas }
  let remotoVacio = false;     // Supabase aún no tiene contenido
  let passwordMaster = leerSesion();
  let ruta = { tipo: "temas", id: null };
  let listaBase = [];
  let preguntasVisibles = [];

  const filtros = { estado: "todas", paper: "", dificultad: "" };
  const temasAbiertos = new Set();
  const progreso = cargarProgreso();
  const respuestas = cargar(CLAVE_RESPUESTAS, {});

  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => raiz.querySelectorAll(sel);

  /* ================= Almacenamiento local (progreso del estudiante) ================= */
  function cargar(clave, porDefecto) {
    try { return JSON.parse(localStorage.getItem(clave)) || porDefecto; } catch { return porDefecto; }
  }

  function guardar(clave, valor) {
    try {
      localStorage.setItem(clave, JSON.stringify(valor));
    } catch {
      aviso("No se pudo guardar: el almacenamiento del navegador está lleno o desactivado.");
    }
  }

  function leerSesion() {
    try { return sessionStorage.getItem(CLAVE_MASTER); } catch { return null; }
  }

  function cargarProgreso() {
    const d = cargar(CLAVE_PROGRESO, {});
    return {
      completadas: new Set(d.completadas || []),
      favoritas: new Set(d.favoritas || []),
      tarjetas: new Set(d.tarjetas || []),
      puntos: d.puntos || {}
    };
  }

  function guardarProgreso() {
    guardar(CLAVE_PROGRESO, {
      completadas: [...progreso.completadas],
      favoritas: [...progreso.favoritas],
      tarjetas: [...progreso.tarjetas],
      puntos: progreso.puntos
    });
  }

  function respuestaDe(id, i) {
    respuestas[id] ??= {};
    respuestas[id][i] ??= { texto: "", imagenes: [] };
    respuestas[id][i].imagenes ??= [];
    return respuestas[id][i];
  }

  let temporizadorGuardado;
  function guardarRespuestas() {
    clearTimeout(temporizadorGuardado);
    temporizadorGuardado = setTimeout(() => guardar(CLAVE_RESPUESTAS, respuestas), 400);
  }

  /* ================= Utilidades ================= */
  const normalizar = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const escapar = (s) => String(s ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  // Texto del autor: se escapa siempre y los saltos de línea se respetan; KaTeX dibuja las fórmulas.
  const texto = (s) => escapar(s).replace(/\n/g, "<br>");
  const clonar = (o) => JSON.parse(JSON.stringify(o));
  const uid = (prefijo) => `${prefijo}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const urlSegura = (u) => (typeof u === "string" && (/^https:\/\//.test(u) || /^img\/[\w.-]+$/.test(u)) ? u : "");
  const colorValido = (c) => (/^#[0-9a-f]{6}$/i.test(c || "") ? c : null);

  const plural = (n, palabra) => `${n} ${palabra}${n === 1 ? "" : "s"}`;
  const puntosTotales = (p) => p.partes.reduce((s, parte) => s + (Number(parte.puntos) || 0), 0);
  const hechas = (lista) => lista.filter((p) => progreso.completadas.has(p.id)).length;
  const temasOrdenados = () => [...datos.temas].sort((a, b) => a.numero - b.numero);
  const buscarTema = (id) => datos.temas.find((t) => t.id === id);
  const buscarPregunta = (id) => datos.preguntas.find((p) => p.id === id);
  const nombreSubtema = (s) => `${s.codigo} ${s.nombre}`;
  const preguntasDeSubtema = (id) => datos.preguntas.filter((p) => p.subtema === id);

  function buscarSubtema(id) {
    for (const tema of datos.temas) {
      const subtema = tema.subtemas.find((s) => s.id === id);
      if (subtema) return { tema, subtema };
    }
    return null;
  }

  // Orden natural del número del subtema: 1.1, 1.2, …, 1.9, 1.10
  function ordenarIndice(subtemas) {
    return [...subtemas].sort((a, b) =>
      String(a.codigo).localeCompare(String(b.codigo), undefined, { numeric: true }));
  }

  function siguienteCodigo(tema) {
    const mayor = Math.max(0, ...tema.subtemas.map((s) => Number(String(s.codigo).split(".")[1]) || 0));
    return `${tema.numero}.${mayor + 1}`;
  }

  function preguntasDeTema(tema) {
    return ordenarIndice(tema.subtemas).flatMap((s) => preguntasDeSubtema(s.id));
  }

  function renderizarMatematicas(elemento) {
    if (typeof renderMathInElement !== "function") return;
    renderMathInElement(elemento, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ],
      throwOnError: false
    });
  }

  function anillo(completadas, total) {
    const fraccion = total ? completadas / total : 0;
    return `
      <svg class="anillo" viewBox="0 0 36 36" aria-hidden="true">
        <circle class="fondo" cx="18" cy="18" r="15"/>
        <circle class="valor" cx="18" cy="18" r="15"
          stroke-dasharray="${CIRCUNFERENCIA}" stroke-dashoffset="${CIRCUNFERENCIA * (1 - fraccion)}"/>
      </svg>`;
  }

  let temporizadorAviso;
  function aviso(mensaje) {
    const el = $("#aviso");
    el.textContent = mensaje;
    el.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => el.classList.remove("visible"), 3500);
  }

  /* ================= Datos: carga y validación ================= */
  function datosValidos(d) {
    return d && typeof d === "object" && Array.isArray(d.temas) && Array.isArray(d.preguntas);
  }

  // Completa campos que falten para que el resto del código pueda confiar en la estructura
  function normalizarDatos(d) {
    d.ajustes = {
      sitio: "BOOZ IB",
      materia: "Matemáticas: Aplicaciones e Interpretación (AI)",
      materiaCorta: "Matemáticas AI",
      logo: LOGO_POR_DEFECTO,
      acento: "#0b84c6",
      ...(d.ajustes || {})
    };
    d.temas.forEach((t) => {
      t.id ??= uid("t");
      t.numero = Number(t.numero) || 0;
      t.subtemas = Array.isArray(t.subtemas) ? t.subtemas : [];
      t.subtemas.forEach((s) => { s.id ??= uid("s"); });
    });
    ["apuntes", "tarjetas", "formularios", "examenes"].forEach((coleccion) => {
      d[coleccion] = Array.isArray(d[coleccion]) ? d[coleccion] : [];
      d[coleccion].forEach((x) => { x.id ??= uid(coleccion[0]); });
    });
    d.formularios.forEach((f) => { f.entradas = Array.isArray(f.entradas) ? f.entradas : []; });
    d.examenes.forEach((ex) => { ex.preguntas = Array.isArray(ex.preguntas) ? ex.preguntas : []; });
    d.preguntas.forEach((p) => {
      p.id ??= uid("q");
      p.partes = Array.isArray(p.partes) && p.partes.length ? p.partes : [{ tipo: "abierta", texto: "", puntos: 1, solucion: "" }];
      p.partes.forEach((parte) => {
        parte.tipo = parte.tipo === "multiple" ? "multiple" : "abierta";
        parte.puntos = Number(parte.puntos) || 0;
        if (parte.tipo === "multiple") {
          parte.opciones = Array.isArray(parte.opciones) ? parte.opciones : [];
          parte.correcta = Number(parte.correcta) || 0;
        }
      });
    });
    return d;
  }

  async function cargarDatos() {
    try {
      const r = await fetch(`${CFG.supabaseUrl}/rest/v1/booz_contenido?id=eq.banco&select=datos`, {
        headers: { apikey: CFG.supabaseKey }
      });
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      const filas = await r.json();
      if (filas.length && datosValidos(filas[0].datos)) {
        datos = filas[0].datos;
      } else {
        datos = clonar(window.DATOS_RESPALDO);
        remotoVacio = true;
      }
    } catch (e) {
      console.warn("No se pudo leer Supabase; se usa la copia local.", e);
      datos = clonar(window.DATOS_RESPALDO);
      $("#avisoRespaldo").classList.remove("oculto");
    }
    normalizarDatos(datos);
  }

  /* ================= Servidor (solo MASTER) ================= */
  async function llamarAdmin(accion, extra = {}) {
    let r;
    try {
      r = await fetch(`${CFG.supabaseUrl}/functions/v1/${CFG.funcionAdmin}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: CFG.supabaseKey },
        body: JSON.stringify({ password: passwordMaster, accion, ...extra })
      });
    } catch {
      throw new Error("No hay conexión con el servidor");
    }
    let cuerpo = {};
    try { cuerpo = await r.json(); } catch { /* respuesta vacía */ }
    if (r.status === 401) {
      const error = new Error(cuerpo.error || "Contraseña incorrecta");
      error.noAutorizado = true;
      throw error;
    }
    if (!r.ok) throw new Error(cuerpo.error || `Error del servidor (${r.status})`);
    return cuerpo;
  }

  let colaGuardado = Promise.resolve();
  function publicar(mensaje = "Cambios guardados") {
    colaGuardado = colaGuardado.then(async () => {
      estadoGuardado("Guardando…");
      try {
        await llamarAdmin("guardar", { datos });
        remotoVacio = false;
        $("#avisoRespaldo").classList.add("oculto");
        $("#btnReintentar").classList.add("oculto");
        estadoGuardado(`Guardado a las ${new Date().toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" })} ✓`);
        aviso(mensaje);
      } catch (e) {
        estadoGuardado(`⚠ No se guardó: ${e.message}`, true);
        $("#btnReintentar").classList.remove("oculto");
        if (e.noAutorizado) {
          salirMaster();
          aviso("Tu sesión MASTER no es válida. Vuelve a entrar; tus cambios siguen en pantalla.");
        }
      }
    });
    return colaGuardado;
  }

  function estadoGuardado(mensaje, error = false) {
    const el = $("#estadoGuardado");
    el.textContent = mensaje;
    el.classList.toggle("error", error);
  }

  // Quita referencias a temas o preguntas que ya no existen
  function limpiarReferencias() {
    const preguntas = new Set(datos.preguntas.map((p) => p.id));
    datos.examenes.forEach((ex) => { ex.preguntas = ex.preguntas.filter((id) => preguntas.has(id)); });
    const temas = new Set(datos.temas.map((t) => t.id));
    ["apuntes", "tarjetas", "formularios"].forEach((coleccion) =>
      datos[coleccion].forEach((x) => { if (x.tema && !temas.has(x.tema)) x.tema = ""; }));
  }

  // Tras cualquier modificación: se redibuja todo y se guarda en Supabase
  function aplicarCambios(mensaje) {
    limpiarReferencias();
    renderizarTodo();
    publicar(mensaje);
  }

  function renderizarTodo() {
    aplicarAjustes();
    refrescarIndicadores();
    enrutar({ mantenerScroll: true });
  }

  /* ================= Ajustes visuales ================= */
  function aplicarAjustes() {
    const a = datos.ajustes;
    const logo = urlSegura(a.logo) || LOGO_POR_DEFECTO;
    document.title = `${a.sitio} · Banco de preguntas`;
    $("#nombreSitio").textContent = a.sitio;
    $("#materiaCorta").textContent = a.materiaCorta;
    $$(".logo-sitio").forEach((img) => { img.src = logo; });
    $("#favicon").href = logo;
    const acento = colorValido(a.acento);
    if (acento) document.documentElement.style.setProperty("--acento", acento);
  }

  /* ================= Rutas ================= */
  // #/            → lista de temas
  // #/s/<id>      → preguntas de un subtema
  // #/t/<id>      → todas las preguntas de un tema
  // #/pronto/Algo → sección en construcción
  function enrutar({ mantenerScroll = false } = {}) {
    if (!datos) return;
    if (!mantenerScroll) {
      cerrarExpandida();
      detenerDictado();
      document.body.classList.remove("menu-abierto");
    }
    const [, tipo, ...resto] = decodeURIComponent(location.hash).split("/");
    const valor = resto.join("/");

    if (tipo !== "examen") detenerReloj();
    $("#cabeceraExamen").classList.add("oculto");
    $("#vistaPreguntas .filtros").classList.remove("oculto");
    $("#accionesPreguntas").classList.remove("oculto");

    if (tipo === "s" && buscarSubtema(valor)) return vistaSubtema(valor, mantenerScroll);
    if (tipo === "t" && buscarTema(valor)) return vistaTema(valor, mantenerScroll);
    if (tipo === "examen" && datos.examenes.some((ex) => ex.id === valor)) return vistaExamen(valor, mantenerScroll);
    if (SECCIONES[tipo]) return vistaSeccion(tipo, mantenerScroll);
    if (tipo === "pronto" && valor) return vistaProximamente(valor);
    vistaTemas(mantenerScroll);
  }

  function mostrar(idVista, seccion, mantenerScroll) {
    ["vistaTemas", "vistaPreguntas", "vistaSeccion", "vistaProximamente"].forEach((id) =>
      $(`#${id}`).classList.toggle("oculta", id !== idVista));
    $$("[data-seccion]").forEach((el) => el.classList.toggle("activo", el.dataset.seccion === seccion));
    if (!mantenerScroll) window.scrollTo({ top: 0 });
  }

  function pintarCabecera(miga, titulo, subtitulo = "") {
    const materia = escapar(datos.ajustes.materia);
    const partes = [`<a href="#/">IB</a>`];
    if (miga) partes.push(`<a href="#/">${materia}</a>`, `<span>${escapar(miga)}</span>`);
    else partes.push(`<span>${materia}</span>`);
    $("#migas").innerHTML = partes.join(SEPARADOR);
    $("#tituloHero").innerHTML = escapar(titulo) + (subtitulo ? `<small>${escapar(subtitulo)}</small>` : "");
  }

  function vistaTemas(mantenerScroll) {
    ruta = { tipo: "temas", id: null };
    pintarCabecera(null, datos.ajustes.materia);
    renderizarAcordeon();
    mostrar("vistaTemas", "banco", mantenerScroll);
  }

  function vistaSubtema(id, mantenerScroll) {
    ruta = { tipo: "s", id };
    const nombre = nombreSubtema(buscarSubtema(id).subtema);
    pintarCabecera(nombre, nombre, "Banco de preguntas");
    $("#btnEditarSubtemaActual").classList.remove("oculto");
    mostrar("vistaPreguntas", "banco", mantenerScroll);
    renderizarPreguntas(preguntasDeSubtema(id));
  }

  function vistaTema(id, mantenerScroll) {
    ruta = { tipo: "t", id };
    const tema = buscarTema(id);
    const nombre = `Tema ${tema.numero}: ${tema.nombre}`;
    pintarCabecera(nombre, nombre, "Banco de preguntas");
    $("#btnEditarSubtemaActual").classList.add("oculto");
    mostrar("vistaPreguntas", "banco", mantenerScroll);
    renderizarPreguntas(preguntasDeTema(tema));
  }

  function vistaProximamente(nombre) {
    ruta = { tipo: "pronto", id: nombre };
    pintarCabecera(nombre, nombre);
    $("#tituloProximamente").textContent = `${nombre}: próximamente`;
    mostrar("vistaProximamente", nombre);
  }

  /* ================= Acordeón de temas ================= */
  // Botón de administración con icono y texto corto (la primera palabra del título)
  const botonAdmin = (accion, id, icono, titulo, peligro = false) =>
    `<button type="button" class="mini-btn con-texto ${peligro ? "peligro" : ""}" data-admin="${accion}" data-id="${escapar(id)}" title="${titulo}">${icono}<span>${titulo.split(" ")[0]}</span></button>`;

  function renderizarAcordeon() {
    const temas = temasOrdenados();
    if (!temas.length) {
      $("#acordeon").innerHTML = `<li class="cargando">Todavía no hay temas.${document.body.classList.contains("master") ? " Crea el primero con «+ Nuevo tema»." : ""}</li>`;
      return;
    }

    $("#acordeon").innerHTML = temas.map((tema) => {
      const delTema = preguntasDeTema(tema);
      const abierto = temasAbiertos.has(tema.id);

      const filas = ordenarIndice(tema.subtemas).map((s) => {
        const lista = preguntasDeSubtema(s.id);
        const cuenta = lista.length ? `${hechas(lista)}/${lista.length}` : "Próximamente";
        return `
          <li>
            <a class="subtema-fila ${lista.length ? "" : "vacio-sub"}" href="#/s/${encodeURIComponent(s.id)}">
              ${anillo(hechas(lista), lista.length)}
              <span class="subtema-nombre">${escapar(nombreSubtema(s))}</span>
              <span class="subtema-cuenta">${cuenta}</span>
            </a>
            <span class="admin-btns solo-master">
              ${botonAdmin("editar-subtema", s.id, ICONOS.editar, "Editar subtema")}
              ${botonAdmin("borrar-subtema", s.id, ICONOS.borrar, "Eliminar subtema", true)}
            </span>
          </li>`;
      }).join("");

      return `
        <li class="tema-item ${abierto ? "abierto" : ""}" data-tema="${escapar(tema.id)}">
          <div class="tema-fila">
            <button class="tema-cabecera" aria-expanded="${abierto}">
              ${anillo(hechas(delTema), delTema.length)}
              <span class="tema-info">
                <span class="tema-nombre">${escapar(tema.nombre)}</span>
                <span class="tema-meta">${plural(tema.subtemas.length, "subtema")} · ${plural(delTema.length, "pregunta")}</span>
              </span>
              ${CHEVRON}
            </button>
            <span class="admin-btns solo-master">
              ${botonAdmin("editar-tema", tema.id, ICONOS.editar, "Editar tema")}
              ${botonAdmin("borrar-tema", tema.id, ICONOS.borrar, "Eliminar tema", true)}
            </span>
          </div>
          <ul class="subtemas">
            ${filas}
            <li><a class="practicar-todo" href="#/t/${encodeURIComponent(tema.id)}">Practicar todo el tema →</a></li>
            <li class="solo-master"><button type="button" class="btn-agregar" data-admin="nuevo-subtema" data-id="${escapar(tema.id)}">+ Nuevo subtema</button></li>
          </ul>
        </li>`;
    }).join("");
  }

  $("#acordeon").addEventListener("click", (e) => {
    const admin = e.target.closest("[data-admin]");
    if (admin) {
      e.preventDefault();
      const id = admin.dataset.id;
      switch (admin.dataset.admin) {
        case "editar-tema": return abrirEditorTema(id);
        case "borrar-tema": return borrarTema(id);
        case "nuevo-subtema": return abrirEditorSubtema(null, id);
        case "editar-subtema": return abrirEditorSubtema(id);
        case "borrar-subtema": return borrarSubtema(id);
      }
      return;
    }
    const cabecera = e.target.closest(".tema-cabecera");
    if (!cabecera) return;
    const item = cabecera.closest(".tema-item");
    const abierto = item.classList.toggle("abierto");
    cabecera.setAttribute("aria-expanded", abierto);
    abierto ? temasAbiertos.add(item.dataset.tema) : temasAbiertos.delete(item.dataset.tema);
  });

  /* ================= Lista de preguntas ================= */
  function pasaFiltros(p) {
    if (filtros.paper && String(p.paper) !== filtros.paper) return false;
    if (filtros.dificultad && p.dificultad !== filtros.dificultad) return false;
    if (filtros.estado === "pendientes" && progreso.completadas.has(p.id)) return false;
    if (filtros.estado === "completadas" && !progreso.completadas.has(p.id)) return false;
    if (filtros.estado === "favoritas" && !progreso.favoritas.has(p.id)) return false;
    return true;
  }

  function renderizarPreguntas(lista = listaBase) {
    listaBase = lista;
    preguntasVisibles = ruta.tipo === "examen" ? lista : lista.filter(pasaFiltros);
    const contenedor = $("#listaPreguntas");

    if (!lista.length) {
      const master = document.body.classList.contains("master");
      contenedor.innerHTML = `
        <div class="vacio">
          <img src="${escapar(urlSegura(datos.ajustes.logo) || LOGO_POR_DEFECTO)}" alt="" class="vacio-logo">
          <h3>Aún no hay preguntas aquí</h3>
          <p>${master ? "Pulsa «+ Nueva pregunta» para crear la primera." : "Este subtema todavía no tiene preguntas. ¡Vuelve pronto!"}</p>
          <a class="btn" href="#/">Volver a los temas</a>
        </div>`;
      return;
    }
    if (!preguntasVisibles.length) {
      contenedor.innerHTML = `<div class="vacio"><h3>Sin resultados</h3><p>Ninguna pregunta coincide con estos filtros.</p></div>`;
      return;
    }

    contenedor.innerHTML = preguntasVisibles.map((p, i) => tarjeta(p, i + 1)).join("");
    prepararTarjetas(contenedor);
  }

  function prepararTarjetas(contenedor) {
    renderizarMatematicas(contenedor);
    prepararGraficos(contenedor);
    $$(".respuesta-caja", contenedor).forEach((caja) => {
      ajustarAltura($("textarea", caja));
      actualizarVistaPrevia(caja);
    });
  }

  function redibujarTarjeta(tarjetaEl) {
    const p = buscarPregunta(tarjetaEl.dataset.id);
    if (!p) return;
    const plantilla = document.createElement("template");
    plantilla.innerHTML = tarjeta(p, Number(tarjetaEl.dataset.numero)).trim();
    const nueva = plantilla.content.firstElementChild;
    tarjetaEl.replaceWith(nueva);
    prepararTarjetas(nueva);
  }

  function puntajeHtml(p) {
    const obtenidos = progreso.puntos[p.id];
    if (!obtenidos || !Object.keys(obtenidos).length) return "";
    const suma = Object.values(obtenidos).reduce((a, b) => a + b, 0);
    return `<span class="puntaje">Puntuación: ${suma}/${puntosTotales(p)}</span>`;
  }

  function parteAbiertaHtml(p, parte, i) {
    const r = respuestaDe(p.id, i);
    const nota = progreso.puntos[p.id]?.[i];
    const botonesNota = Array.from({ length: parte.puntos + 1 }, (_, n) =>
      `<button class="nota ${nota === n ? "activa" : ""}" data-nota="${n}">${n}</button>`).join("");
    const activa = r.texto || r.imagenes.length;

    return `
      <div class="respuesta-caja ${activa ? "activa" : ""}">
        <textarea rows="1" placeholder="Escribe tu respuesta aquí…" aria-label="Respuesta del apartado ${i + 1}">${escapar(r.texto)}</textarea>
        <div class="vista-previa"></div>
        <div class="adjuntos">${adjuntosHtml(r)}</div>
        <div class="herramientas">
          <button class="herr" data-herr="imagen">${ICONOS.imagen}Añadir<input type="file" accept="image/*"></button>
          <button class="herr" data-herr="voz" title="Dictar respuesta">${ICONOS.micro}<span>Dictar</span></button>
          <button class="herr" data-herr="dibujar">${ICONOS.lapiz}Dibujar</button>
          <button class="herr" data-herr="mate">${ICONOS.fx}Fórmula</button>
        </div>
        <div class="caja-pie">
          <button class="herr" data-herr="esquema">${ICONOS.lista}Esquema de calificación</button>
          <button class="btn-autoeval" data-herr="autoevaluar">Autoevaluar ✦</button>
        </div>
        <div class="esquema"><strong>Esquema de calificación</strong>${texto(parte.solucion) || "Sin esquema para este apartado."}</div>
        <div class="autoeval">
          <p>Compara tu respuesta con el esquema. ¿Cuántos puntos obtuviste?</p>
          <div class="notas">${botonesNota}</div>
        </div>
      </div>`;
  }

  function parteMultipleHtml(p, parte, i) {
    const seleccion = respuestas[p.id]?.[i]?.seleccion;
    const respondida = Number.isInteger(seleccion);
    const acierto = respondida && seleccion === parte.correcta;

    const opciones = parte.opciones.map((op, k) => {
      let estado = "";
      if (respondida && k === parte.correcta) estado = "correcta";
      else if (respondida && k === seleccion) estado = "incorrecta";
      return `
        <li>
          <button type="button" class="opcion ${estado}" data-opcion="${k}" ${respondida ? "disabled" : ""}>
            <span class="letra">${LETRAS_OPCION[k]}</span><span>${texto(op)}</span>
          </button>
        </li>`;
    }).join("");

    const resultado = respondida ? `
      <div class="resultado-opcion ${acierto ? "bien" : "mal"}">
        ${acierto ? "✓ ¡Correcto!" : `✗ Incorrecto. La respuesta correcta es la ${LETRAS_OPCION[parte.correcta]}.`}
        <button type="button" class="link-btn" data-reintentar>Volver a intentar</button>
      </div>
      ${parte.solucion ? `<div class="esquema visible"><strong>Explicación</strong>${texto(parte.solucion)}</div>` : ""}` : "";

    return `<ol class="opciones">${opciones}</ol>${resultado}`;
  }

  // Apartado escrito con respuesta correcta definida: se corrige solo
  function parteAutoHtml(p, parte, i, vistaPrevia) {
    const r = vistaPrevia ? {} : (respuestas[p.id]?.[i] || {});
    const resultado = r.auto;
    const bloqueado = vistaPrevia || Boolean(resultado);
    const correctaVisible = resultado && (resultado.correcta || resultado.vista);
    const palabraPuntos = parte.puntos === 1 ? "punto" : "puntos";

    let mensaje = "";
    if (resultado?.correcta) {
      mensaje = `
        <div class="resultado-opcion bien">✓ ¡Correcto! +${parte.puntos} ${palabraPuntos}
          <button type="button" class="link-btn" data-reintentar-auto>Responder otra vez</button>
        </div>`;
    } else if (resultado) {
      mensaje = `
        <div class="resultado-opcion mal">✗ Tu respuesta no es correcta.
          <button type="button" class="link-btn" data-reintentar-auto>Intentar otra vez</button>
          ${resultado.vista ? "" : `<button type="button" class="link-btn" data-ver-respuesta>Ver la respuesta</button>`}
        </div>`;
    }

    return `
      <div class="auto-respuesta ${resultado ? (resultado.correcta ? "correcta" : "incorrecta") : ""}">
        <label class="auto-etiqueta">Tu respuesta</label>
        <div class="auto-fila">
          <input type="text" class="input-auto" value="${escapar(r.borrador ?? "")}" placeholder="Escribe solo el resultado" ${bloqueado ? "disabled" : ""} aria-label="Respuesta del apartado ${i + 1}">
          <button type="button" class="accion" data-formula-auto title="Escribir con el editor de fórmulas" ${bloqueado ? "disabled" : ""}>ƒ(x)</button>
          <button type="button" class="accion principal" data-comprobar ${bloqueado ? "disabled" : ""}>Comprobar</button>
        </div>
        <div class="vista-previa auto-previa"></div>
        ${resultado ? "" : `<small class="ayuda">Ejemplos: 4 · 2/3 · x = 5 · (0, 1). Si hay varias respuestas, sepáralas con punto y coma: 2; 3</small>`}
        ${mensaje}
        <div class="esquema ${correctaVisible ? "visible" : ""}">
          <strong>Respuesta correcta: ${texto(parte.respuestas.find((x) => String(x).trim()))}</strong>
          ${texto(parte.solucion)}
        </div>
      </div>`;
  }

  function tarjeta(p, numero, { vistaPrevia = false } = {}) {
    const hecha = progreso.completadas.has(p.id);
    const favorita = progreso.favoritas.has(p.id);
    const imagen = urlSegura(p.imagen);

    const partes = p.partes.map((parte, i) => `
      <li class="parte" data-i="${i}">
        <div class="parte-texto">
          <span class="parte-num">${i + 1}.</span>
          <div>${texto(parte.texto)}</div>
          <span class="parte-puntos">[${parte.puntos}]</span>
        </div>
        ${graficoHtml(parte.grafico, vistaPrevia ? null : `q|${p.id}|${i}`)}
        ${parte.tipo === "multiple" ? parteMultipleHtml(p, parte, i)
          : tieneCorreccionAutomatica(parte) ? parteAutoHtml(p, parte, i, vistaPrevia)
          : vistaPrevia ? "" : parteAbiertaHtml(p, parte, i)}
      </li>`).join("");

    const solucion = p.partes.map((parte, i) => {
      const contenido = parte.tipo === "multiple"
        ? `Alternativa ${LETRAS_OPCION[parte.correcta] ?? "?"}${parte.solucion ? `. ${texto(parte.solucion)}` : ""}`
        : tieneCorreccionAutomatica(parte)
          ? `Respuesta: ${texto(parte.respuestas.find((r) => String(r).trim()))}${parte.solucion ? `. ${texto(parte.solucion)}` : ""}`
          : texto(parte.solucion);
      return `<li><strong>${i + 1}.</strong>${contenido}</li>`;
    }).join("");

    const admin = vistaPrevia ? "" : `
      <div class="pregunta-admin solo-master">
        <span class="etiqueta-admin">Opciones de esta pregunta:</span>
        ${botonAdmin("editar-pregunta", p.id, `${ICONOS.editar}`, "Editar pregunta")}
        ${botonAdmin("duplicar-pregunta", p.id, ICONOS.duplicar, "Duplicar pregunta")}
        ${botonAdmin("subir-pregunta", p.id, ICONOS.arriba, "Subir pregunta")}
        ${botonAdmin("bajar-pregunta", p.id, ICONOS.abajo, "Bajar pregunta")}
        ${botonAdmin("borrar-pregunta", p.id, ICONOS.borrar, "Eliminar pregunta", true)}
      </div>`;

    return `
      <article class="pregunta" id="p-${escapar(p.id)}" data-id="${escapar(p.id)}" data-numero="${numero}">
        ${admin}
        <header class="pregunta-head">
          <h3>Pregunta ${numero}</h3>
          <span class="chip ${escapar(p.dificultad)}">${NOMBRE_DIFICULTAD[p.dificultad] || ""}</span>
          ${p.paper ? `<span class="chip">Prueba ${escapar(p.paper)}</span>` : ""}
          <span class="chip">${puntosTotales(p)} ${puntosTotales(p) === 1 ? "punto" : "puntos"}</span>
          ${puntajeHtml(p)}
          <div class="head-acciones">
            <button class="btn-redondo check ${hecha ? "on" : ""}" data-accion="hecha" title="Marcar como completada" aria-pressed="${hecha}">${ICONOS.check}</button>
            <button class="btn-redondo fav ${favorita ? "on" : ""}" data-accion="favorita" title="Favorita" aria-pressed="${favorita}">${ICONOS.estrella}</button>
            <button class="btn-redondo" data-accion="expandir" title="Ampliar">${ICONOS.expandir}</button>
            <button class="btn-respuesta" data-accion="respuesta">Respuesta</button>
          </div>
        </header>
        <p class="intro">${texto(p.enunciado)}</p>
        ${imagen ? `<img class="imagen-enunciado" src="${escapar(imagen)}" alt="Imagen del enunciado">` : ""}
        ${graficoHtml(p.grafico, vistaPrevia ? null : `q|${p.id}|q`)}
        <ol class="partes">${partes}</ol>
        <div class="solucion-completa">
          <h4>Solución completa (${puntosTotales(p)} puntos)</h4>
          <ol>${solucion}</ol>
        </div>
        <div class="asistente">
          <div class="mensajes"></div>
          <form class="asistente-entrada">
            <img src="${escapar(urlSegura(datos.ajustes.logo) || LOGO_POR_DEFECTO)}" alt="Asistente" class="asistente-avatar">
            <input type="text" placeholder="Pregúntame lo que quieras…" aria-label="Pregunta al asistente">
            <button class="btn-enviar" type="submit" aria-label="Enviar">${ICONOS.enviar}</button>
          </form>
        </div>
      </article>`;
  }

  function adjuntosHtml(r) {
    return r.imagenes.map((src, k) => `
      <div class="adjunto">
        <img src="${escapar(src)}" alt="Imagen adjunta ${k + 1}">
        <button data-quitar="${k}" aria-label="Quitar imagen">✕</button>
      </div>`).join("");
  }

  function ajustarAltura(area) {
    area.style.height = "auto";
    area.style.height = `${area.scrollHeight}px`;
  }

  function actualizarVistaPrevia(caja) {
    const valor = $("textarea", caja).value;
    const previa = $(".vista-previa", caja);
    const tieneMates = /\$[^$]+\$/.test(valor);
    previa.classList.toggle("visible", tieneMates);
    if (tieneMates) {
      previa.textContent = valor;
      renderizarMatematicas(previa);
    }
  }

  function contexto(el) {
    const tarjetaEl = el.closest(".pregunta");
    const parteEl = el.closest(".parte");
    const id = tarjetaEl.dataset.id;
    return {
      tarjetaEl,
      parteEl,
      id,
      pregunta: buscarPregunta(id),
      i: parteEl ? Number(parteEl.dataset.i) : null
    };
  }

  function refrescarIndicadores() {
    const total = datos.preguntas.length;
    const completas = hechas(datos.preguntas);
    $("#barraProgreso").style.width = `${total ? (completas / total) * 100 : 0}%`;
    $("#textoProgreso").textContent = `${completas}/${total}`;
  }

  /* ================= Corrección automática de respuestas escritas ================= */
  const FUNCIONES_MATE = {
    sqrt: Math.sqrt, raiz: Math.sqrt, abs: Math.abs, ln: Math.log, log: Math.log10,
    sen: Math.sin, sin: Math.sin, cos: Math.cos, tan: Math.tan
  };
  const NOMBRES_FUNCIONES = Object.keys(FUNCIONES_MATE).sort((a, b) => b.length - a.length);

  // Pasa texto o LaTeX sencillo a una expresión que el analizador entiende
  function normalizarRespuesta(entrada) {
    let s = String(entrada ?? "").replace(/\$/g, "").replace(/\\left|\\right/g, "");
    let antes;
    do {
      antes = s;
      s = s.replace(/\\[dt]?frac\{([^{}]*)\}\{([^{}]*)\}/g, "($1)/($2)")
        .replace(/\\sqrt\[([^\]]*)\]\{([^{}]*)\}/g, "($2)^(1/($1))")
        .replace(/\\sqrt\{([^{}]*)\}/g, "sqrt($1)")
        .replace(/\^\{([^{}]*)\}/g, "^($1)");
    } while (s !== antes);
    return s
      .replace(/\\(cdot|times)/g, "*").replace(/\\div/g, "/")
      .replace(/\\([a-zA-Z]+)/g, "$1").replace(/\\./g, "")
      .replace(/[{]/g, "(").replace(/[}]/g, ")").replace(/_/g, "")
      .replace(/[·×]/g, "*").replace(/÷/g, "/").replace(/[−–]/g, "-")
      .replace(/π/g, "pi").replace(/√/g, "sqrt").replace(/²/g, "^2").replace(/³/g, "^3")
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/(\d),(\d)/g, "$1.$2")
      .replace(/\.$/, "");
  }

  function tokenizar(s) {
    const tokens = [];
    let i = 0;
    while (i < s.length) {
      const c = s[i];
      if (/[0-9.]/.test(c)) {
        const numero = s.slice(i).match(/^(\d+\.?\d*|\.\d+)/);
        if (!numero) return null;
        tokens.push({ t: "num", v: parseFloat(numero[0]) });
        i += numero[0].length;
      } else if (/[a-z]/.test(c)) {
        const palabra = s.slice(i).match(/^[a-z]+/)[0];
        // Separa funciones, pi y variables de una letra ("2xy" = 2·x·y)
        for (let j = 0; j < palabra.length;) {
          const resto = palabra.slice(j);
          const funcion = NOMBRES_FUNCIONES.find((n) => resto.startsWith(n));
          if (funcion) { tokens.push({ t: "fn", v: funcion }); j += funcion.length; }
          else if (resto.startsWith("pi")) { tokens.push({ t: "num", v: Math.PI }); j += 2; }
          else { tokens.push({ t: "var", v: resto[0] }); j += 1; }
        }
        i += palabra.length;
      } else if ("+-*/^()".includes(c)) {
        tokens.push({ t: c });
        i += 1;
      } else if (c === "[" || c === "]") {
        tokens.push({ t: c === "[" ? "(" : ")" });
        i += 1;
      } else {
        return null;
      }
    }
    return tokens;
  }

  // Convierte una expresión en una función de las variables (o null si no se entiende)
  function compilar(s) {
    const tokens = tokenizar(s);
    if (!tokens?.length) return null;
    let pos = 0;
    const ver = () => tokens[pos];
    const tomar = () => tokens[pos++];
    const empiezaFactor = (t) => t && ["num", "var", "fn", "("].includes(t.t);

    function expresion() {
      let izq = termino();
      while (ver() && (ver().t === "+" || ver().t === "-")) {
        const op = tomar().t;
        const a = izq;
        const b = termino();
        izq = op === "+" ? (v) => a(v) + b(v) : (v) => a(v) - b(v);
      }
      return izq;
    }
    function termino() {
      let izq = unario();
      for (;;) {
        const t = ver();
        const a = izq;
        if (t && (t.t === "*" || t.t === "/")) {
          tomar();
          const b = unario();
          izq = t.t === "*" ? (v) => a(v) * b(v) : (v) => a(v) / b(v);
        } else if (empiezaFactor(t)) {
          const b = potencia(); // multiplicación implícita: 2x, 3(x+1)
          izq = (v) => a(v) * b(v);
        } else {
          return izq;
        }
      }
    }
    function unario() {
      if (ver()?.t === "-") { tomar(); const a = unario(); return (v) => -a(v); }
      if (ver()?.t === "+") { tomar(); return unario(); }
      return potencia();
    }
    function potencia() {
      const base = primario();
      if (ver()?.t === "^") { tomar(); const exp = unario(); return (v) => Math.pow(base(v), exp(v)); }
      return base;
    }
    function primario() {
      const t = tomar();
      if (!t) throw new Error("fin");
      if (t.t === "num") return () => t.v;
      if (t.t === "var") return (v) => (t.v in v ? v[t.v] : NaN);
      if (t.t === "fn") {
        const f = FUNCIONES_MATE[t.v];
        const arg = ver()?.t === "(" ? primario() : potencia();
        return (v) => f(arg(v));
      }
      if (t.t === "(") {
        const e = expresion();
        if (tomar()?.t !== ")") throw new Error("paréntesis");
        return e;
      }
      throw new Error("símbolo");
    }
    try {
      const f = expresion();
      return pos === tokens.length ? f : null;
    } catch {
      return null;
    }
  }

  // Valores de prueba para comparar expresiones con variables
  const VALORES_PRUEBA = [1.37, 2.91, -0.73].map((base) =>
    Object.fromEntries("abcdefghijklmnopqrstuvwxyz".split("").map((l, k) => [l, base + k * 0.17])));

  // Quita "x =", "y =" o "f(x) =" del principio: "x = 4" vale lo mismo que "4"
  const quitarAsignacion = (s) => {
    const partes = s.split("=");
    return partes.length === 2 && /^[a-z](\([a-z]\))?$/.test(partes[0]) ? partes[1] : s;
  };

  function igualesUno(esperadaTexto, dadaTexto) {
    const e = quitarAsignacion(normalizarRespuesta(esperadaTexto));
    const d = quitarAsignacion(normalizarRespuesta(dadaTexto));
    if (!e || !d) return false;
    if (e === d) return true;

    const conIgual = (x) => x.split("=").length === 2;
    if (conIgual(e) !== conIgual(d)) return false;

    if (conIgual(e)) {
      // Ecuaciones equivalentes: (izq − der) proporcionales en todos los valores de prueba
      const [l1, r1] = e.split("=");
      const [l2, r2] = d.split("=");
      const f1 = compilar(`(${l1})-(${r1})`);
      const f2 = compilar(`(${l2})-(${r2})`);
      if (!f1 || !f2) return false;
      const razones = VALORES_PRUEBA.map((v) => f2(v) / f1(v));
      return razones.every((r) => Number.isFinite(r) && r !== 0 && Math.abs(r - razones[0]) <= 1e-7 * Math.abs(razones[0]));
    }

    const fe = compilar(e);
    const fd = compilar(d);
    if (!fe || !fd) return false;
    const ve = fe({});
    if (Number.isFinite(ve)) {
      // Número: se acepta con la precisión que escribió el profesor (2.30 → ±0.005)
      const vd = fd({});
      const decimales = e.match(/^-?\d+\.(\d+)$/)?.[1].length;
      const tolerancia = decimales ? 0.5 * 10 ** -decimales : 1e-9 * Math.max(1, Math.abs(ve));
      return Number.isFinite(vd) && Math.abs(ve - vd) <= tolerancia + 1e-12;
    }
    // Expresión con variables: deben valer lo mismo en todos los valores de prueba
    return VALORES_PRUEBA.every((v) => {
      const a = fe(v);
      const b = fd(v);
      return Number.isFinite(a) && Number.isFinite(b) && Math.abs(a - b) <= 1e-7 * Math.max(1, Math.abs(a));
    });
  }

  // Separa varias respuestas: "2; 3", "2, 3" o "2 y 3" (sin romper "(0, 1)" ni "2,5")
  function dividirLista(s) {
    const texto = String(s ?? "").replace(/\$/g, "").replace(/\s+(y|o)\s+/gi, ";");
    const piezas = [];
    let actual = "";
    let profundidad = 0;
    for (let k = 0; k < texto.length; k++) {
      const c = texto[k];
      if ("([{".includes(c)) profundidad++;
      if (")]}".includes(c)) profundidad--;
      const separa = profundidad === 0 && (c === ";" || (c === "," && /\s/.test(texto[k + 1] || "")));
      if (separa) { piezas.push(actual); actual = ""; } else { actual += c; }
    }
    piezas.push(actual);
    return piezas.map((p) => p.trim()).filter(Boolean);
  }

  function coincideLista(esperadas, dadas) {
    if (esperadas.length !== dadas.length) return false;
    const usadas = new Set();
    return esperadas.every((e) => {
      const k = dadas.findIndex((d, j) => !usadas.has(j) && igualesUno(e, d));
      if (k < 0) return false;
      usadas.add(k);
      return true;
    });
  }

  function coincide(esperada, dada) {
    const listaEsperada = dividirLista(esperada);
    if (coincideLista(listaEsperada, dividirLista(dada))) return true;
    // Respuesta con palabras ("Luis tiene 12 años"): se comparan solo los números
    const soloNumeros = listaEsperada.every((e) => Number.isFinite(compilar(quitarAsignacion(normalizarRespuesta(e)))?.({})));
    if (!soloNumeros) return false;
    const numeros = (String(dada).match(/-?\d+(?:[.,]\d+)?/g) || []).map((n) => n.replace(",", "."));
    return coincideLista(listaEsperada, numeros);
  }

  const respuestaCorrecta = (aceptadas, dada) => aceptadas.some((a) => coincide(a, dada));
  const tieneCorreccionAutomatica = (parte) =>
    parte.tipo === "abierta" && Array.isArray(parte.respuestas) && parte.respuestas.some((r) => String(r).trim());

  /* ----- Clics dentro de las tarjetas ----- */
  $("#listaPreguntas").addEventListener("click", (e) => {
    const admin = e.target.closest("[data-admin]");
    const accion = e.target.closest("[data-accion]");
    const herr = e.target.closest("[data-herr]");
    const nota = e.target.closest("[data-nota]");
    const quitar = e.target.closest("[data-quitar]");
    const opcion = e.target.closest("[data-opcion]");
    const reintentar = e.target.closest("[data-reintentar]");
    const comprobar = e.target.closest("[data-comprobar]");
    const reintentarAuto = e.target.closest("[data-reintentar-auto]");
    const verRespuesta = e.target.closest("[data-ver-respuesta]");
    const formulaAuto = e.target.closest("[data-formula-auto]");

    if (comprobar) return comprobarRespuesta(comprobar);
    if (formulaAuto) return abrirEditorMate($(".input-auto", formulaAuto.closest(".parte")));
    if (reintentarAuto || verRespuesta) {
      const { tarjetaEl, id, i } = contexto(reintentarAuto || verRespuesta);
      const r = respuestaDe(id, i);
      if (verRespuesta) {
        r.auto.vista = true;
      } else {
        delete r.auto;
        if (progreso.puntos[id]) delete progreso.puntos[id][i];
        guardarProgreso();
      }
      guardarRespuestas();
      redibujarTarjeta(tarjetaEl);
      return;
    }

    if (admin) {
      const id = admin.dataset.id;
      switch (admin.dataset.admin) {
        case "editar-pregunta": return abrirEditorPregunta(id);
        case "duplicar-pregunta": return duplicarPregunta(id);
        case "subir-pregunta": return moverPregunta(id, -1);
        case "bajar-pregunta": return moverPregunta(id, 1);
        case "borrar-pregunta": return borrarPregunta(id);
      }
      return;
    }

    if (e.target.tagName === "TEXTAREA") {
      e.target.closest(".respuesta-caja").classList.add("activa");
      return;
    }

    if (opcion) {
      const { tarjetaEl, pregunta, id, i } = contexto(opcion);
      const parte = pregunta.partes[i];
      const k = Number(opcion.dataset.opcion);
      respuestaDe(id, i).seleccion = k;
      progreso.puntos[id] ??= {};
      progreso.puntos[id][i] = k === parte.correcta ? parte.puntos : 0;
      guardarRespuestas();
      guardarProgreso();
      redibujarTarjeta(tarjetaEl);
      return;
    }

    if (reintentar) {
      const { tarjetaEl, id, i } = contexto(reintentar);
      delete respuestaDe(id, i).seleccion;
      if (progreso.puntos[id]) delete progreso.puntos[id][i];
      guardarRespuestas();
      guardarProgreso();
      redibujarTarjeta(tarjetaEl);
      return;
    }

    if (accion) {
      const { tarjetaEl, id } = contexto(accion);
      switch (accion.dataset.accion) {
        case "hecha": {
          const on = !progreso.completadas.has(id);
          on ? progreso.completadas.add(id) : progreso.completadas.delete(id);
          accion.classList.toggle("on", on);
          accion.setAttribute("aria-pressed", on);
          guardarProgreso();
          refrescarIndicadores();
          if (on) aviso("¡Pregunta marcada como completada!");
          break;
        }
        case "favorita": {
          const on = !progreso.favoritas.has(id);
          on ? progreso.favoritas.add(id) : progreso.favoritas.delete(id);
          accion.classList.toggle("on", on);
          accion.setAttribute("aria-pressed", on);
          guardarProgreso();
          break;
        }
        case "expandir":
          tarjetaEl.classList.contains("expandida") ? cerrarExpandida() : abrirExpandida(tarjetaEl);
          break;
        case "respuesta": {
          const visible = $(".solucion-completa", tarjetaEl).classList.toggle("visible");
          accion.textContent = visible ? "Ocultar" : "Respuesta";
          break;
        }
      }
      return;
    }

    if (herr) {
      const ctx = contexto(herr);
      const caja = herr.closest(".respuesta-caja");
      switch (herr.dataset.herr) {
        case "imagen":
          if (e.target.tagName !== "INPUT") $("input[type=file]", herr).click();
          break;
        case "voz":
          alternarDictado(herr, $("textarea", caja));
          break;
        case "dibujar":
          abrirDibujo(ctx);
          break;
        case "mate":
          abrirEditorMate($("textarea", caja));
          break;
        case "esquema":
          $(".esquema", caja).classList.toggle("visible");
          break;
        case "autoevaluar":
          $(".autoeval", caja).classList.toggle("visible");
          $(".esquema", caja).classList.add("visible");
          break;
      }
      return;
    }

    if (nota) {
      const { pregunta, id, i, tarjetaEl } = contexto(nota);
      progreso.puntos[id] ??= {};
      progreso.puntos[id][i] = Number(nota.dataset.nota);
      $$(".nota", nota.parentElement).forEach((b) => b.classList.toggle("activa", b === nota));
      guardarProgreso();
      $(".puntaje", tarjetaEl)?.remove();
      $(".head-acciones", tarjetaEl).insertAdjacentHTML("beforebegin", puntajeHtml(pregunta));
      return;
    }

    if (quitar) {
      const { id, i, parteEl } = contexto(quitar);
      const r = respuestaDe(id, i);
      r.imagenes.splice(Number(quitar.dataset.quitar), 1);
      $(".adjuntos", parteEl).innerHTML = adjuntosHtml(r);
      guardarRespuestas();
    }
  });

  function comprobarRespuesta(boton) {
    const { tarjetaEl, pregunta, id, i, parteEl } = contexto(boton);
    const parte = pregunta.partes[i];
    const input = $(".input-auto", parteEl);
    const valor = input.value.trim();
    if (!valor) {
      aviso("Escribe tu respuesta antes de comprobar.");
      input.focus();
      return;
    }
    const correcta = respuestaCorrecta(parte.respuestas, valor);
    const r = respuestaDe(id, i);
    r.borrador = valor;
    r.auto = { correcta };
    progreso.puntos[id] ??= {};
    progreso.puntos[id][i] = correcta ? parte.puntos : 0;
    guardarRespuestas();
    guardarProgreso();
    redibujarTarjeta(tarjetaEl);
  }

  // Enter en la casilla de respuesta = Comprobar
  $("#listaPreguntas").addEventListener("keydown", (e) => {
    if (e.key !== "Enter" || !e.target.classList.contains("input-auto")) return;
    e.preventDefault();
    comprobarRespuesta(e.target);
  });

  /* ----- Escritura de respuestas ----- */
  $("#listaPreguntas").addEventListener("input", (e) => {
    if (e.target.classList.contains("input-auto")) {
      const { id, i, parteEl } = contexto(e.target);
      respuestaDe(id, i).borrador = e.target.value;
      guardarRespuestas();
      // Vista previa si escribió una fórmula con el editor ($…$)
      const previa = $(".auto-previa", parteEl);
      const tieneMates = /\$[^$]+\$/.test(e.target.value);
      previa.classList.toggle("visible", tieneMates);
      if (tieneMates) {
        previa.textContent = e.target.value;
        renderizarMatematicas(previa);
      }
      return;
    }
    if (e.target.tagName !== "TEXTAREA") return;
    const { id, i } = contexto(e.target);
    respuestaDe(id, i).texto = e.target.value;
    ajustarAltura(e.target);
    actualizarVistaPrevia(e.target.closest(".respuesta-caja"));
    guardarRespuestas();
  });

  $("#listaPreguntas").addEventListener("focusin", (e) => {
    const caja = e.target.closest(".respuesta-caja");
    if (caja) caja.classList.add("activa");
  });

  $("#listaPreguntas").addEventListener("focusout", (e) => {
    const caja = e.target.closest(".respuesta-caja");
    if (!caja || caja.contains(e.relatedTarget)) return;
    const vacia = !$("textarea", caja).value.trim() && !$(".adjunto", caja);
    const abiertos = $(".esquema.visible, .autoeval.visible", caja);
    if (vacia && !abiertos && !$(".grabando", caja)) caja.classList.remove("activa");
  });

  /* ----- Imágenes del estudiante (se guardan solo en su navegador) ----- */
  $("#listaPreguntas").addEventListener("change", (e) => {
    if (e.target.type !== "file" || !e.target.files.length) return;
    const { id, i, parteEl } = contexto(e.target);
    const archivo = e.target.files[0];
    e.target.value = "";
    reducirImagen(archivo).then((src) => {
      respuestaDe(id, i).imagenes.push(src);
      $(".adjuntos", parteEl).innerHTML = adjuntosHtml(respuestaDe(id, i));
      $(".respuesta-caja", parteEl).classList.add("activa");
      guardarRespuestas();
    }).catch(() => aviso("No se pudo leer la imagen."));
  });

  // Reduce las fotos grandes (JPEG) para que ocupen poco
  function reducirImagen(archivo, maximo = 1000) {
    return new Promise((resolver, rechazar) => {
      const lector = new FileReader();
      lector.onerror = rechazar;
      lector.onload = () => {
        const img = new Image();
        img.onerror = rechazar;
        img.onload = () => {
          const escala = Math.min(1, maximo / Math.max(img.width, img.height));
          const lienzoTmp = document.createElement("canvas");
          lienzoTmp.width = Math.round(img.width * escala);
          lienzoTmp.height = Math.round(img.height * escala);
          const ctx = lienzoTmp.getContext("2d");
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, lienzoTmp.width, lienzoTmp.height);
          ctx.drawImage(img, 0, 0, lienzoTmp.width, lienzoTmp.height);
          resolver(lienzoTmp.toDataURL("image/jpeg", 0.85));
        };
        img.src = lector.result;
      };
      lector.readAsDataURL(archivo);
    });
  }

  /* ----- Asistente ----- */
  $("#listaPreguntas").addEventListener("submit", (e) => {
    e.preventDefault();
    const entrada = $("input", e.target);
    const consulta = entrada.value.trim();
    if (!consulta) return;
    const { tarjetaEl, pregunta } = contexto(e.target);
    const mensajes = $(".mensajes", tarjetaEl);

    const usuario = document.createElement("div");
    usuario.className = "mensaje usuario";
    usuario.textContent = consulta;
    mensajes.append(usuario);

    const bot = document.createElement("div");
    bot.className = "mensaje bot";
    bot.innerHTML = responderAsistente(pregunta, consulta);
    mensajes.append(bot);
    renderizarMatematicas(bot);
    entrada.value = "";
  });

  function responderAsistente(p, consulta) {
    const q = normalizar(consulta);
    if (/pista|ayuda|ayudame|empiezo|empezar|no se|atasc|como (lo )?(hago|resuelvo)|formula/.test(q)) {
      return p.pista ? `💡 <strong>Pista:</strong> ${texto(p.pista)}` : "Esta pregunta no tiene pista. Revisa el esquema de calificación del primer apartado.";
    }
    if (/solucion|respuesta|resultado|resuelve/.test(q)) {
      return "Inténtalo primero 😉. Cuando termines, abre «Esquema de calificación» en cada apartado o pulsa <strong>Respuesta</strong> para ver la solución completa.";
    }
    if (/punto|marca|vale|nota/.test(q)) {
      const detalle = p.partes.map((parte, i) => `apartado ${i + 1}: ${parte.puntos}`).join(", ");
      return `Esta pregunta vale <strong>${puntosTotales(p)} puntos</strong> (${detalle}).`;
    }
    if (/calculadora|gdc/.test(q)) {
      return "En Matemáticas AI puedes usar la calculadora gráfica en todas las pruebas. Úsala para comprobar tus cálculos.";
    }
    if (/hola|buenas|hey/.test(q)) {
      return `¡Hola! Soy el asistente de ${escapar(datos.ajustes.sitio)}. Escribe «pista» si te atascas, «puntos» para ver cuánto vale la pregunta o «solución» para saber cómo ver la respuesta.`;
    }
    return "Funciono sin conexión, así que solo entiendo algunas peticiones: prueba con «pista», «puntos», «calculadora» o «solución».";
  }

  /* ----- Ampliar tarjeta ----- */
  function abrirExpandida(tarjetaEl) {
    cerrarExpandida();
    tarjetaEl.classList.add("expandida");
    $("#fondoExpandido").classList.add("visible");
    document.body.style.overflow = "hidden";
  }

  function cerrarExpandida() {
    $$(".pregunta.expandida").forEach((el) => el.classList.remove("expandida"));
    $("#fondoExpandido").classList.remove("visible");
    document.body.style.overflow = "";
  }

  $("#fondoExpandido").addEventListener("click", cerrarExpandida);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$("dialog[open]")) cerrarExpandida();
  });

  /* ================= Secciones: apuntes, tarjetas, fórmulas y exámenes ================= */
  const SECCIONES = {
    todo: { titulo: "Todo el contenido" },
    apuntes: {
      titulo: "Apuntes", tipo: "apunte", coleccion: "apuntes", nuevo: "+ Nuevo apunte",
      ayuda: "Explicaciones de teoría con fórmulas, imágenes y gráficos."
    },
    tarjetas: {
      titulo: "Tarjetas de memoria", tipo: "tarjeta", coleccion: "tarjetas", nuevo: "+ Nueva tarjeta",
      ayuda: "Tarjetas de repaso: la pregunta por delante y la respuesta por detrás."
    },
    formulas: {
      titulo: "Hojas de fórmulas", tipo: "formulario", coleccion: "formularios", nuevo: "+ Nueva hoja de fórmulas",
      ayuda: "Resúmenes con las fórmulas más importantes de cada tema."
    },
    examenes: {
      titulo: "Exámenes de práctica", tipo: "examen", coleccion: "examenes", nuevo: "+ Nuevo examen",
      ayuda: "Junta preguntas del banco en un examen con tiempo límite."
    }
  };
  const filtroTemaSeccion = {};
  const esMaster = () => document.body.classList.contains("master");
  const parrafos = (s) => String(s ?? "").split(/\n\s*\n/).filter((p) => p.trim())
    .map((p) => `<p>${texto(p.trim())}</p>`).join("");
  const filtrarPorTema = (lista, clave) =>
    filtroTemaSeccion[clave] ? lista.filter((x) => x.tema === filtroTemaSeccion[clave]) : lista;

  function chipTema(id) {
    const t = buscarTema(id);
    return t
      ? `<span class="chip-tema" style="background:${colorValido(t.color) || "#4f46e5"}">${t.numero}. ${escapar(t.nombre)}</span>`
      : `<span class="chip-tema general">General</span>`;
  }

  const botonesContenido = (tipo, id) => `
    <span class="admin-btns solo-master">
      <button type="button" class="mini-btn con-texto" data-editar-contenido="${tipo}" data-id="${escapar(id)}">${ICONOS.editar}<span>Editar</span></button>
      <button type="button" class="mini-btn con-texto peligro" data-borrar-contenido="${tipo}" data-id="${escapar(id)}">${ICONOS.borrar}<span>Eliminar</span></button>
    </span>`;

  const vacioSeccion = (titulo) => `
    <div class="vacio">
      <h3>${titulo}</h3>
      <p>${esMaster() ? "Pulsa el botón de arriba para crear el primero." : "Vuelve pronto: aquí aparecerá contenido nuevo."}</p>
    </div>`;

  function vistaSeccion(clave, mantenerScroll) {
    ruta = { tipo: clave, id: null };
    const s = SECCIONES[clave];
    pintarCabecera(s.titulo, s.titulo);

    $("#accionesSeccion").innerHTML = s.tipo
      ? `<button type="button" class="btn-agregar" data-nuevo="${s.tipo}">${s.nuevo}</button><span class="texto-suave">${s.ayuda}</span>`
      : "";

    const conFiltro = ["apuntes", "tarjetas", "formulas"].includes(clave) && datos.temas.length;
    $("#filtroTemaSeccion").innerHTML = conFiltro ? `
      <label class="campo">
        <span>Tema</span>
        <select data-seccion-filtro="${clave}">
          <option value="">Todos los temas</option>
          ${temasOrdenados().map((t) => `<option value="${escapar(t.id)}" ${filtroTemaSeccion[clave] === t.id ? "selected" : ""}>${t.numero}. ${escapar(t.nombre)}</option>`).join("")}
        </select>
      </label>` : "";

    const render = { todo: renderTodo, apuntes: renderApuntes, tarjetas: renderTarjetas, formulas: renderFormulas, examenes: renderExamenes }[clave];
    const contenedor = $("#contenidoSeccion");
    contenedor.innerHTML = render();
    renderizarMatematicas(contenedor);
    mostrar("vistaSeccion", clave, mantenerScroll);
    prepararGraficos();
  }

  function renderTodo() {
    const secciones = [
      { href: "#/", icono: "❓", titulo: "Banco de preguntas", n: datos.preguntas.length, texto: "Practica pregunta por pregunta, tema por tema." },
      { href: "#/apuntes", icono: "📘", titulo: "Apuntes", n: datos.apuntes.length, texto: SECCIONES.apuntes.ayuda },
      { href: "#/tarjetas", icono: "🃏", titulo: "Tarjetas de memoria", n: datos.tarjetas.length, texto: SECCIONES.tarjetas.ayuda },
      { href: "#/formulas", icono: "📐", titulo: "Hojas de fórmulas", n: datos.formularios.length, texto: SECCIONES.formulas.ayuda },
      { href: "#/examenes", icono: "📝", titulo: "Exámenes de práctica", n: datos.examenes.length, texto: SECCIONES.examenes.ayuda }
    ];
    return `<div class="resumen-secciones">${secciones.map((s) => `
      <a class="resumen-tarjeta" href="${s.href}">
        <span class="resumen-icono">${s.icono}</span>
        <strong>${s.titulo}</strong>
        <span class="resumen-n">${s.n}</span>
        <span class="texto-suave">${s.texto}</span>
      </a>`).join("")}</div>`;
  }

  function renderApuntes() {
    const lista = filtrarPorTema(datos.apuntes, "apuntes");
    if (!lista.length) return vacioSeccion("Aún no hay apuntes");
    return lista.map((a) => `
      <article class="contenido-tarjeta">
        <header class="contenido-cabecera">
          ${chipTema(a.tema)}
          <h3>${escapar(a.titulo)}</h3>
          ${botonesContenido("apunte", a.id)}
        </header>
        <div class="apunte-texto">${parrafos(a.contenido)}</div>
        ${urlSegura(a.imagen) ? `<img class="imagen-enunciado" src="${escapar(urlSegura(a.imagen))}" alt="Imagen del apunte">` : ""}
        ${graficoHtml(a.grafico, `a|${a.id}`)}
      </article>`).join("");
  }

  function renderTarjetas() {
    const lista = filtrarPorTema(datos.tarjetas, "tarjetas");
    if (!lista.length) return vacioSeccion("Aún no hay tarjetas de memoria");
    const sabidas = lista.filter((t) => progreso.tarjetas.has(t.id)).length;
    return `
      <p class="progreso-tarjetas">Te sabes <strong>${sabidas}</strong> de <strong>${lista.length}</strong> tarjetas. Toca una tarjeta para darle la vuelta.</p>
      <div class="flashcards">
        ${lista.map((t) => {
          const sabida = progreso.tarjetas.has(t.id);
          return `
          <div class="flashcard ${sabida ? "sabida" : ""}" data-id="${escapar(t.id)}">
            <div class="flashcard-cara" data-voltear role="button" tabindex="0" aria-label="Dar la vuelta a la tarjeta">
              <span class="flashcard-etiqueta frente">Pregunta · toca para ver la respuesta</span>
              <span class="flashcard-etiqueta reverso">Respuesta</span>
              <div class="flashcard-texto frente">${texto(t.frente)}</div>
              <div class="flashcard-texto reverso">${texto(t.reverso)}</div>
            </div>
            <div class="flashcard-pie">
              ${chipTema(t.tema)}
              <button type="button" class="link-btn" data-sabida>${sabida ? "✓ Ya me la sé" : "Marcar como aprendida"}</button>
            </div>
            ${botonesContenido("tarjeta", t.id)}
          </div>`;
        }).join("")}
      </div>`;
  }

  function renderFormulas() {
    const lista = filtrarPorTema(datos.formularios, "formulas");
    if (!lista.length) return vacioSeccion("Aún no hay hojas de fórmulas");
    return lista.map((f) => `
      <article class="contenido-tarjeta">
        <header class="contenido-cabecera">
          ${chipTema(f.tema)}
          <h3>${escapar(f.titulo)}</h3>
          ${botonesContenido("formulario", f.id)}
        </header>
        <div class="tabla-formulas">
          ${f.entradas.map((e) => `
            <div class="fila-formula">
              <div class="f-nombre">${texto(e.nombre)}</div>
              <div class="f-formula">${texto(e.formula)}</div>
              ${e.nota ? `<div class="f-nota">${texto(e.nota)}</div>` : ""}
            </div>`).join("")}
        </div>
      </article>`).join("");
  }

  function renderExamenes() {
    if (!datos.examenes.length) return vacioSeccion("Aún no hay exámenes de práctica");
    return datos.examenes.map((ex) => {
      const preguntas = ex.preguntas.map(buscarPregunta).filter(Boolean);
      const total = preguntas.reduce((s, p) => s + puntosTotales(p), 0);
      const minutos = Number(ex.minutos);
      return `
        <article class="contenido-tarjeta examen-item">
          <header class="contenido-cabecera">
            <h3>${escapar(ex.titulo)}</h3>
            ${botonesContenido("examen", ex.id)}
          </header>
          ${ex.descripcion ? `<p>${texto(ex.descripcion)}</p>` : ""}
          <p class="examen-meta">📝 ${preguntas.length} preguntas · ⭐ ${total} puntos · ⏱ ${minutos ? `${minutos} minutos` : "sin límite de tiempo"}</p>
          ${preguntas.length ? `<a class="btn primario" href="#/examen/${encodeURIComponent(ex.id)}">Empezar examen</a>` : `<p class="texto-suave">Este examen aún no tiene preguntas.</p>`}
        </article>`;
    }).join("");
  }

  $("#vistaSeccion").addEventListener("click", (e) => {
    const nuevo = e.target.closest("[data-nuevo]");
    const editar = e.target.closest("[data-editar-contenido]");
    const borrar = e.target.closest("[data-borrar-contenido]");
    const voltear = e.target.closest("[data-voltear]");
    const sabida = e.target.closest("[data-sabida]");
    if (nuevo) return abrirEditorContenido(nuevo.dataset.nuevo);
    if (editar) return abrirEditorContenido(editar.dataset.editarContenido, editar.dataset.id);
    if (borrar) return borrarContenido(borrar.dataset.borrarContenido, borrar.dataset.id);
    if (voltear) return voltear.closest(".flashcard").classList.toggle("volteada");
    if (sabida) {
      const id = sabida.closest(".flashcard").dataset.id;
      progreso.tarjetas.has(id) ? progreso.tarjetas.delete(id) : progreso.tarjetas.add(id);
      guardarProgreso();
      vistaSeccion("tarjetas", true);
    }
  });

  $("#vistaSeccion").addEventListener("keydown", (e) => {
    if ((e.key === "Enter" || e.key === " ") && e.target.matches("[data-voltear]")) {
      e.preventDefault();
      e.target.closest(".flashcard").classList.toggle("volteada");
    }
  });

  $("#vistaSeccion").addEventListener("change", (e) => {
    const clave = e.target.dataset.seccionFiltro;
    if (!clave) return;
    filtroTemaSeccion[clave] = e.target.value;
    vistaSeccion(clave, true);
  });

  /* ----- Modo examen ----- */
  const relojes = {}; // id del examen → momento de inicio (ms)
  let intervaloReloj = null;

  const tiempoAgotado = (ex) => Number(ex.minutos) > 0 && relojes[ex.id] &&
    Date.now() >= relojes[ex.id] + Number(ex.minutos) * 60000;

  function vistaExamen(id, mantenerScroll) {
    ruta = { tipo: "examen", id };
    const ex = datos.examenes.find((x) => x.id === id);
    const preguntas = ex.preguntas.map(buscarPregunta).filter(Boolean);
    const total = preguntas.reduce((s, p) => s + puntosTotales(p), 0);

    pintarCabecera(ex.titulo, ex.titulo, "Examen de práctica");
    $("#vistaPreguntas .filtros").classList.add("oculto");
    $("#accionesPreguntas").classList.add("oculto");
    const cabecera = $("#cabeceraExamen");
    cabecera.classList.remove("oculto");
    cabecera.innerHTML = `
      ${ex.descripcion ? `<p>${texto(ex.descripcion)}</p>` : ""}
      <div class="examen-barra">
        <span class="reloj" id="relojExamen">${Number(ex.minutos) ? "⏱ --:--" : "⏱ Sin límite de tiempo"}</span>
        <span>${preguntas.length} preguntas · ${total} puntos</span>
        <button type="button" class="accion principal" id="btnTerminarExamen">Terminar y ver mi nota</button>
        <button type="button" class="accion" id="btnReiniciarExamen">Empezar de nuevo</button>
      </div>
      <div class="resultado-examen oculto" id="resultadoExamen"></div>
      <p class="texto-suave">Las preguntas con alternativas se corrigen solas. En las abiertas, compara tu respuesta con el esquema y usa «Autoevaluar».</p>`;
    renderizarMatematicas(cabecera);

    if (!relojes[id] || (!mantenerScroll && tiempoAgotado(ex))) relojes[id] = Date.now();
    mostrar("vistaPreguntas", "examenes", mantenerScroll);
    renderizarPreguntas(preguntas);
    iniciarReloj(ex);
  }

  function iniciarReloj(ex) {
    detenerReloj();
    const minutos = Number(ex.minutos);
    if (!minutos) return;
    const actualizar = () => {
      const el = $("#relojExamen");
      const restante = Math.max(0, relojes[ex.id] + minutos * 60000 - Date.now());
      if (el) {
        const m = Math.floor(restante / 60000);
        const s = Math.floor((restante % 60000) / 1000);
        el.textContent = `⏱ Te quedan ${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        el.classList.toggle("urgente", restante < 60000);
      }
      if (restante === 0) {
        detenerReloj();
        aviso("¡Se acabó el tiempo!");
        terminarExamen(ex);
      }
    };
    actualizar();
    intervaloReloj = setInterval(actualizar, 1000);
  }

  function detenerReloj() {
    clearInterval(intervaloReloj);
    intervaloReloj = null;
  }

  function terminarExamen(ex) {
    detenerReloj();
    const preguntas = ex.preguntas.map(buscarPregunta).filter(Boolean);
    const total = preguntas.reduce((s, p) => s + puntosTotales(p), 0);
    const obtenidos = preguntas.reduce((s, p) =>
      s + Object.values(progreso.puntos[p.id] || {}).reduce((a, b) => a + b, 0), 0);
    const pendientes = preguntas.reduce((n, p) =>
      n + p.partes.filter((_, i) => progreso.puntos[p.id]?.[i] === undefined).length, 0);
    const porcentaje = total ? Math.round((obtenidos / total) * 100) : 0;

    const el = $("#resultadoExamen");
    el.innerHTML = `
      <strong>Tu nota: ${obtenidos} de ${total} puntos (${porcentaje}%)</strong>
      ${pendientes ? `<span>Hay ${pendientes} apartados sin responder o sin autoevaluar: cuentan como 0.</span>` : ""}
      <span>Debajo de cada pregunta ya puedes ver la solución completa.</span>`;
    el.classList.remove("oculto");
    $$("#listaPreguntas .solucion-completa").forEach((s) => s.classList.add("visible"));
    $$("#listaPreguntas [data-accion='respuesta']").forEach((b) => { b.textContent = "Ocultar"; });
    el.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function reiniciarExamen(ex) {
    if (!confirm("¿Empezar el examen de nuevo? Se borrarán tus respuestas a estas preguntas.")) return;
    ex.preguntas.forEach((id) => {
      delete progreso.puntos[id];
      delete respuestas[id];
    });
    guardarProgreso();
    guardar(CLAVE_RESPUESTAS, respuestas);
    relojes[ex.id] = Date.now();
    vistaExamen(ex.id, false);
  }

  $("#cabeceraExamen").addEventListener("click", (e) => {
    const ex = datos.examenes.find((x) => x.id === ruta.id);
    if (!ex) return;
    if (e.target.closest("#btnTerminarExamen")) terminarExamen(ex);
    if (e.target.closest("#btnReiniciarExamen")) reiniciarExamen(ex);
  });

  /* ----- Editor de apuntes, tarjetas, hojas de fórmulas y exámenes ----- */
  const TIPOS_CONTENIDO = {
    apunte: {
      coleccion: "apuntes", prefijo: "a", titulos: ["Nuevo apunte", "Editar apunte"], campos: [
        { clave: "titulo", etiqueta: "Título", tipo: "texto", requerido: true, ejemplo: "¿Qué es una ecuación?" },
        { clave: "tema", etiqueta: "Tema", tipo: "tema" },
        {
          clave: "contenido", etiqueta: "Explicación", tipo: "mate", filas: 10, requerido: true,
          ayuda: "Deja una línea en blanco para empezar un párrafo nuevo. Usa «ƒ(x) Fórmula» para escribir ecuaciones."
        },
        { clave: "imagen", etiqueta: "Imagen (opcional)", tipo: "imagen" },
        { clave: "grafico", etiqueta: "Gráfico GeoGebra (opcional)", tipo: "grafico" }
      ]
    },
    tarjeta: {
      coleccion: "tarjetas", prefijo: "c", titulos: ["Nueva tarjeta", "Editar tarjeta"], campos: [
        { clave: "tema", etiqueta: "Tema", tipo: "tema" },
        { clave: "frente", etiqueta: "Frente: la pregunta", tipo: "mate", filas: 3, requerido: true, ejemplo: "¿Cuánto es $2^3$?" },
        { clave: "reverso", etiqueta: "Reverso: la respuesta", tipo: "mate", filas: 3, requerido: true, ejemplo: "$2^3 = 8$" }
      ]
    },
    formulario: {
      coleccion: "formularios", prefijo: "f", titulos: ["Nueva hoja de fórmulas", "Editar hoja de fórmulas"], campos: [
        { clave: "titulo", etiqueta: "Título", tipo: "texto", requerido: true, ejemplo: "Fórmulas de geometría" },
        { clave: "tema", etiqueta: "Tema", tipo: "tema" },
        { clave: "entradas", etiqueta: "Fórmulas", tipo: "entradas" }
      ]
    },
    examen: {
      coleccion: "examenes", prefijo: "e", titulos: ["Nuevo examen", "Editar examen"], campos: [
        { clave: "titulo", etiqueta: "Título", tipo: "texto", requerido: true, ejemplo: "Examen de práctica 1" },
        { clave: "descripcion", etiqueta: "Descripción (opcional)", tipo: "area", filas: 2 },
        { clave: "minutos", etiqueta: "Tiempo en minutos (0 = sin límite)", tipo: "numero" },
        { clave: "preguntas", etiqueta: "Marca las preguntas que tendrá el examen", tipo: "preguntas" }
      ]
    }
  };

  const dlgContenido = $("#dlgContenido");
  const contenido = { tipo: null, id: null, valores: null };
  const campoDe = (clave) => TIPOS_CONTENIDO[contenido.tipo].campos.find((c) => c.clave === clave);

  function valoresIniciales(tipo) {
    const tema = filtroTemaSeccion[ruta.tipo] || "";
    switch (tipo) {
      case "apunte": return { titulo: "", tema, contenido: "", imagen: "", grafico: null };
      case "tarjeta": return { tema, frente: "", reverso: "" };
      case "formulario": return { titulo: "", tema, entradas: [{ nombre: "", formula: "", nota: "" }] };
      default: return { titulo: "", descripcion: "", minutos: 30, preguntas: [] };
    }
  }

  function abrirEditorContenido(tipo, id = null) {
    const def = TIPOS_CONTENIDO[tipo];
    const existente = id ? datos[def.coleccion].find((x) => x.id === id) : null;
    contenido.tipo = tipo;
    contenido.id = existente ? id : null;
    contenido.valores = existente ? clonar(existente) : valoresIniciales(tipo);
    $("#tituloDlgContenido").textContent = def.titulos[existente ? 1 : 0];
    $("#errorContenido").textContent = "";
    $("#camposContenido").innerHTML = def.campos
      .map((c) => `<div class="campo-contenido" data-contenedor="${c.clave}">${campoHtml(c)}</div>`).join("");
    dlgContenido.showModal();
    $("#camposContenido input[type='text'], #camposContenido textarea")?.focus();
  }

  function redibujarCampo(clave) {
    $(`#camposContenido [data-contenedor="${clave}"]`).innerHTML = campoHtml(campoDe(clave));
  }

  const resumenPregunta = (p) => {
    const sub = buscarSubtema(p.subtema)?.subtema;
    const plano = p.enunciado.replace(/\$+/g, "").replace(/\\[a-zA-Z]+/g, " ").replace(/[{}\\]/g, "").replace(/\s+/g, " ").trim();
    return `${sub ? `${sub.codigo} · ` : ""}${plano.slice(0, 90)}${plano.length > 90 ? "…" : ""}`;
  };

  function campoHtml(c) {
    const v = contenido.valores[c.clave];
    const ejemplo = c.ejemplo ? `placeholder="${escapar(`Ejemplo: ${c.ejemplo}`)}"` : "";
    switch (c.tipo) {
      case "texto":
        return `<label class="form-campo"><span>${c.etiqueta}</span><input type="text" data-clave="${c.clave}" value="${escapar(v)}" ${ejemplo} maxlength="200"></label>`;
      case "area":
        return `<label class="form-campo"><span>${c.etiqueta}</span><textarea data-clave="${c.clave}" rows="${c.filas || 3}">${escapar(v)}</textarea></label>`;
      case "numero":
        return `<label class="form-campo"><span>${c.etiqueta}</span><input type="number" min="0" max="600" data-clave="${c.clave}" value="${Number(v) || 0}"></label>`;
      case "mate":
        return `
          <div class="form-campo">
            <span class="etiqueta-con-boton">${c.etiqueta}<button type="button" class="accion mini" data-formula-para="${c.clave}">ƒ(x) Fórmula</button></span>
            <textarea data-clave="${c.clave}" rows="${c.filas || 3}" ${ejemplo}>${escapar(v)}</textarea>
            ${c.ayuda ? `<small class="ayuda">${c.ayuda}</small>` : ""}
          </div>`;
      case "tema":
        return `
          <label class="form-campo"><span>${c.etiqueta}</span>
            <select data-clave="${c.clave}">
              <option value="">General (sin tema)</option>
              ${temasOrdenados().map((t) => `<option value="${escapar(t.id)}" ${t.id === v ? "selected" : ""}>${t.numero}. ${escapar(t.nombre)}</option>`).join("")}
            </select>
          </label>`;
      case "imagen": {
        const url = urlSegura(v);
        return `
          <div class="form-campo"><span>${c.etiqueta}</span>
            <div class="imagen-campo">
              ${url ? `<img src="${escapar(url)}" alt="">` : ""}
              <button type="button" class="accion" data-imagen-para="${c.clave}">${url ? "Cambiar imagen" : "Subir imagen"}</button>
              ${url ? `<button type="button" class="accion" data-quitar-para="${c.clave}">Quitar</button>` : ""}
            </div>
          </div>`;
      }
      case "grafico": {
        const png = urlSegura(v?.png);
        return `
          <div class="form-campo"><span>${c.etiqueta}</span>
            <div class="imagen-campo">
              ${png ? `<img src="${escapar(png)}" alt="">` : ""}
              <button type="button" class="accion" data-grafico-para="${c.clave}">📈 ${v ? "Editar gráfico" : "Añadir gráfico"}</button>
              ${v ? `<button type="button" class="accion" data-quitar-para="${c.clave}">Quitar</button>` : ""}
            </div>
          </div>`;
      }
      case "entradas":
        return `
          <div class="form-campo"><span>${c.etiqueta}</span>
            <small class="ayuda">Cada fila es una fórmula: su nombre, la fórmula (pulsa ƒ(x) para escribirla) y una nota opcional.</small>
            ${v.map((e, k) => `
              <div class="entrada-editor" data-k="${k}">
                <input type="text" data-entrada="nombre" value="${escapar(e.nombre)}" placeholder="Nombre, p. ej. Área del círculo">
                <div class="entrada-formula">
                  <input type="text" data-entrada="formula" value="${escapar(e.formula)}" placeholder="Fórmula">
                  <button type="button" class="accion mini" data-formula-entrada="${k}">ƒ(x)</button>
                </div>
                <input type="text" data-entrada="nota" value="${escapar(e.nota)}" placeholder="Nota (opcional)">
                <button type="button" class="mini-btn peligro" data-quitar-entrada="${k}" title="Quitar esta fórmula" ${v.length <= 1 ? "disabled" : ""}>✕</button>
              </div>`).join("")}
            <button type="button" class="accion" data-agregar-entrada>+ Añadir otra fórmula</button>
          </div>`;
      case "preguntas": {
        if (!datos.preguntas.length) return `<p class="texto-suave">Primero crea preguntas en el banco de preguntas.</p>`;
        const elegidas = new Set(v);
        return `
          <div class="form-campo"><span>${c.etiqueta} <small id="cuentaElegidas">(${elegidas.size} elegidas)</small></span>
            <div class="lista-elegir">
              ${temasOrdenados().map((t) => {
                const ps = preguntasDeTema(t);
                if (!ps.length) return "";
                return `<p class="grupo-elegir">${t.numero}. ${escapar(t.nombre)}</p>` + ps.map((p) => `
                  <label class="check-pregunta">
                    <input type="checkbox" data-pregunta="${escapar(p.id)}" ${elegidas.has(p.id) ? "checked" : ""}>
                    <span>${escapar(resumenPregunta(p))}</span>
                  </label>`).join("");
              }).join("")}
            </div>
          </div>`;
      }
      default:
        return "";
    }
  }

  $("#camposContenido").addEventListener("input", (e) => {
    const v = contenido.valores;
    const el = e.target;
    if (el.dataset.clave) {
      v[el.dataset.clave] = el.type === "number" ? Math.max(0, Number(el.value) || 0) : el.value;
    } else if (el.dataset.entrada) {
      v.entradas[Number(el.closest(".entrada-editor").dataset.k)][el.dataset.entrada] = el.value;
    } else if (el.dataset.pregunta) {
      const marcadas = new Set([...$$("#camposContenido [data-pregunta]:checked")].map((x) => x.dataset.pregunta));
      // Se guardan en el orden del banco de preguntas
      v.preguntas = temasOrdenados().flatMap(preguntasDeTema).map((p) => p.id).filter((id) => marcadas.has(id));
      $("#cuentaElegidas").textContent = `(${v.preguntas.length} elegidas)`;
    }
  });

  $("#camposContenido").addEventListener("click", (e) => {
    const v = contenido.valores;
    const formula = e.target.closest("[data-formula-para]");
    const formulaEntrada = e.target.closest("[data-formula-entrada]");
    const imagen = e.target.closest("[data-imagen-para]");
    const quitar = e.target.closest("[data-quitar-para]");
    const grafico = e.target.closest("[data-grafico-para]");
    const quitarEntrada = e.target.closest("[data-quitar-entrada]");

    if (formula) return abrirEditorMate($(`#camposContenido [data-clave="${formula.dataset.formulaPara}"]`));
    if (formulaEntrada) {
      return abrirEditorMate($(`#camposContenido .entrada-editor[data-k="${formulaEntrada.dataset.formulaEntrada}"] [data-entrada="formula"]`));
    }
    if (imagen) {
      $("#inputImagenContenido").dataset.para = imagen.dataset.imagenPara;
      return $("#inputImagenContenido").click();
    }
    if (quitar) {
      const clave = quitar.dataset.quitarPara;
      v[clave] = clave === "grafico" ? null : "";
      return redibujarCampo(clave);
    }
    if (grafico) {
      const clave = grafico.dataset.graficoPara;
      return abrirEditorGrafico({ actual: v[clave], guardar: (g) => { v[clave] = g; redibujarCampo(clave); } });
    }
    if (e.target.closest("[data-agregar-entrada]")) {
      v.entradas.push({ nombre: "", formula: "", nota: "" });
      redibujarCampo("entradas");
      $("#camposContenido .entrada-editor:last-of-type input").focus();
      return;
    }
    if (quitarEntrada) {
      v.entradas.splice(Number(quitarEntrada.dataset.quitarEntrada), 1);
      redibujarCampo("entradas");
    }
  });

  $("#inputImagenContenido").addEventListener("change", async (e) => {
    const archivo = e.target.files[0];
    const clave = e.target.dataset.para;
    e.target.value = "";
    if (!archivo) return;
    aviso("Subiendo imagen…");
    try {
      contenido.valores[clave] = await subirImagen(archivo);
      redibujarCampo(clave);
      aviso("Imagen subida.");
    } catch (err) {
      aviso(`No se pudo subir la imagen: ${err.message}`);
    }
  });

  function validarContenido(v) {
    for (const c of TIPOS_CONTENIDO[contenido.tipo].campos) {
      if (["texto", "area", "mate"].includes(c.tipo)) v[c.clave] = String(v[c.clave] ?? "").trim();
      if (c.requerido && !v[c.clave]) return `Completa el campo «${c.etiqueta}».`;
    }
    if (contenido.tipo === "formulario") {
      v.entradas = v.entradas
        .map((e) => ({ nombre: e.nombre.trim(), formula: e.formula.trim(), nota: e.nota.trim() }))
        .filter((e) => e.nombre || e.formula);
      if (!v.entradas.length) {
        v.entradas = [{ nombre: "", formula: "", nota: "" }];
        redibujarCampo("entradas");
        return "Añade al menos una fórmula.";
      }
    }
    if (contenido.tipo === "examen" && !v.preguntas.length) return "Marca al menos una pregunta para el examen.";
    return null;
  }

  $("#formContenido").addEventListener("submit", (e) => {
    e.preventDefault();
    const def = TIPOS_CONTENIDO[contenido.tipo];
    const v = contenido.valores;
    const error = validarContenido(v);
    $("#errorContenido").textContent = error || "";
    if (error) return;

    const coleccion = datos[def.coleccion];
    if (contenido.id) {
      coleccion[coleccion.findIndex((x) => x.id === contenido.id)] = { ...v, id: contenido.id };
    } else {
      coleccion.push({ ...v, id: uid(def.prefijo) });
    }
    dlgContenido.close();
    aplicarCambios("Cambios guardados");
  });

  function borrarContenido(tipo, id) {
    const def = TIPOS_CONTENIDO[tipo];
    if (!confirm(`¿Eliminar este elemento de «${SECCIONES[Object.keys(SECCIONES).find((k) => SECCIONES[k].tipo === tipo)].titulo}»?\n\nPodrás recuperarlo desde Ajustes → Versiones anteriores.`)) return;
    datos[def.coleccion] = datos[def.coleccion].filter((x) => x.id !== id);
    aplicarCambios("Eliminado");
  }

  /* ================= Modo MASTER ================= */
  function entrarMaster() {
    document.body.classList.add("master");
    $("#btnMaster span").textContent = "MASTER activo";
    estadoGuardado("Los cambios se guardan en línea al instante.");
    renderizarTodo();
    if (remotoVacio) publicar("Contenido inicial publicado en el servidor");
  }

  function salirMaster() {
    passwordMaster = null;
    try { sessionStorage.removeItem(CLAVE_MASTER); } catch { /* sin almacenamiento */ }
    document.body.classList.remove("master");
    $("#btnMaster span").textContent = "Modo MASTER";
    renderizarTodo();
  }

  $("#btnMaster").addEventListener("click", () => {
    if (document.body.classList.contains("master")) return abrirAjustes();
    $("#inputPassword").value = "";
    $("#errorLogin").textContent = "";
    $("#dlgLogin").showModal();
    $("#inputPassword").focus();
  });

  $("#formLogin").addEventListener("submit", async (e) => {
    e.preventDefault();
    const boton = $("#btnEntrar");
    passwordMaster = $("#inputPassword").value;
    boton.disabled = true;
    boton.textContent = "Comprobando…";
    $("#errorLogin").textContent = "";
    try {
      await llamarAdmin("verificar");
      try { sessionStorage.setItem(CLAVE_MASTER, passwordMaster); } catch { /* sin almacenamiento */ }
      $("#dlgLogin").close();
      entrarMaster();
      aviso("Modo MASTER activado");
    } catch (err) {
      passwordMaster = null;
      $("#errorLogin").textContent = err.noAutorizado ? "Contraseña incorrecta." : err.message;
    } finally {
      boton.disabled = false;
      boton.textContent = "Entrar";
    }
  });

  $("#btnSalirMaster").addEventListener("click", () => {
    salirMaster();
    aviso("Has salido del modo MASTER");
  });
  $("#btnReintentar").addEventListener("click", () => publicar("Cambios guardados"));
  $("#btnAjustes").addEventListener("click", () => abrirAjustes());

  async function subirImagen(archivo, maximo = 1600) {
    const dataUrl = await reducirImagen(archivo, maximo);
    const { url } = await llamarAdmin("subir_imagen", { tipo: "image/jpeg", base64: dataUrl.split(",")[1] });
    return url;
  }

  /* ----- Temas ----- */
  let temaEditando = null;

  function abrirEditorTema(id = null) {
    temaEditando = id;
    const tema = id ? buscarTema(id) : null;
    const siguiente = Math.max(0, ...datos.temas.map((t) => t.numero)) + 1;
    $("#tituloDlgTema").textContent = tema ? "Editar tema" : "Nuevo tema";
    $("#temaNumero").value = tema ? tema.numero : siguiente;
    $("#temaNombre").value = tema ? tema.nombre : "";
    $("#temaColor").value = colorValido(tema?.color) || "#4f46e5";
    $("#dlgTema").showModal();
    $("#temaNombre").focus();
  }

  $("#formTema").addEventListener("submit", (e) => {
    e.preventDefault();
    const valores = {
      numero: Number($("#temaNumero").value) || 0,
      nombre: $("#temaNombre").value.trim(),
      color: $("#temaColor").value
    };
    if (!valores.nombre) return;
    if (temaEditando) {
      Object.assign(buscarTema(temaEditando), valores);
    } else {
      const nuevo = { id: uid("t"), ...valores, subtemas: [] };
      datos.temas.push(nuevo);
      temasAbiertos.add(nuevo.id);
    }
    $("#dlgTema").close();
    aplicarCambios(temaEditando ? "Tema actualizado" : "Tema creado");
  });

  function borrarTema(id) {
    const tema = buscarTema(id);
    const ids = new Set(tema.subtemas.map((s) => s.id));
    const n = datos.preguntas.filter((p) => ids.has(p.subtema)).length;
    if (!confirm(`¿Eliminar el tema «${tema.nombre}»?\n\nTambién se eliminarán sus ${tema.subtemas.length} subtemas y ${n} preguntas.\nPodrás recuperarlo desde Ajustes → Versiones anteriores.`)) return;
    datos.temas = datos.temas.filter((t) => t.id !== id);
    datos.preguntas = datos.preguntas.filter((p) => !ids.has(p.subtema));
    if (ruta.id === id || ids.has(ruta.id)) location.hash = "#/";
    aplicarCambios("Tema eliminado");
  }

  $("#btnNuevoTema").addEventListener("click", () => abrirEditorTema());

  /* ----- Subtemas ----- */
  let subtemaEditando = null;

  function abrirEditorSubtema(id = null, temaId = null) {
    subtemaEditando = id;
    const encontrado = id ? buscarSubtema(id) : null;
    const s = encontrado?.subtema;
    const temaActual = encontrado?.tema.id || temaId || temasOrdenados()[0]?.id;
    if (!temaActual) return aviso("Primero crea un tema.");

    $("#tituloDlgSubtema").textContent = s ? "Editar subtema" : "Nuevo subtema";
    $("#subtemaTema").innerHTML = temasOrdenados().map((t) =>
      `<option value="${escapar(t.id)}" ${t.id === temaActual ? "selected" : ""}>${t.numero}. ${escapar(t.nombre)}</option>`).join("");
    $("#subtemaCodigo").value = s ? s.codigo : siguienteCodigo(buscarTema(temaActual));
    $("#subtemaCodigo").dataset.manual = s ? "1" : "";
    $("#subtemaNombre").value = s ? s.nombre : "";
    $("#dlgSubtema").showModal();
    $("#subtemaNombre").focus();
  }

  // Al cambiar de tema en un subtema nuevo, el número se recalcula solo
  $("#subtemaTema").addEventListener("change", () => {
    if (!$("#subtemaCodigo").dataset.manual) $("#subtemaCodigo").value = siguienteCodigo(buscarTema($("#subtemaTema").value));
  });
  $("#subtemaCodigo").addEventListener("input", () => { $("#subtemaCodigo").dataset.manual = "1"; });

  $("#formSubtema").addEventListener("submit", (e) => {
    e.preventDefault();
    const destino = buscarTema($("#subtemaTema").value);
    const valores = {
      codigo: $("#subtemaCodigo").value.trim() || siguienteCodigo(destino),
      nombre: $("#subtemaNombre").value.trim()
    };
    if (!destino || !valores.codigo || !valores.nombre) return;

    if (subtemaEditando) {
      const { tema, subtema } = buscarSubtema(subtemaEditando);
      Object.assign(subtema, valores);
      if (tema.id !== destino.id) {
        tema.subtemas = tema.subtemas.filter((s) => s.id !== subtema.id);
        destino.subtemas.push(subtema);
      }
    } else {
      destino.subtemas.push({ id: uid("s"), ...valores });
    }
    temasAbiertos.add(destino.id);
    $("#dlgSubtema").close();
    aplicarCambios(subtemaEditando ? "Subtema actualizado" : "Subtema creado");
  });

  function borrarSubtema(id) {
    const { tema, subtema } = buscarSubtema(id);
    const n = preguntasDeSubtema(id).length;
    if (!confirm(`¿Eliminar el subtema «${nombreSubtema(subtema)}»?\n\nTambién se eliminarán sus ${n} preguntas.\nPodrás recuperarlo desde Ajustes → Versiones anteriores.`)) return;
    tema.subtemas = tema.subtemas.filter((s) => s.id !== id);
    datos.preguntas = datos.preguntas.filter((p) => p.subtema !== id);
    if (ruta.id === id) location.hash = "#/";
    aplicarCambios("Subtema eliminado");
  }

  $("#btnEditarSubtemaActual").addEventListener("click", () => {
    if (ruta.tipo === "s") abrirEditorSubtema(ruta.id);
  });

  /* ----- Preguntas ----- */
  const editor = { id: null, imagen: "", grafico: null, partes: [] };
  let campoActivo = null; // último campo de texto del editor donde estaba el cursor
  const parteVacia = (tipo) => tipo === "multiple"
    ? { tipo, texto: "", puntos: 1, opciones: ["", "", "", ""], correcta: 0, solucion: "" }
    : { tipo, texto: "", puntos: 2, respuestas: [""], solucion: "" };

  function opcionesSubtemas(seleccionado) {
    return temasOrdenados().map((t) => `
      <optgroup label="${t.numero}. ${escapar(t.nombre)}">
        ${ordenarIndice(t.subtemas).map((s) =>
          `<option value="${escapar(s.id)}" ${s.id === seleccionado ? "selected" : ""}>${escapar(nombreSubtema(s))}</option>`).join("")}
      </optgroup>`).join("");
  }

  function abrirEditorPregunta(id = null) {
    const existente = id ? buscarPregunta(id) : null;
    let subtemaId = existente?.subtema;
    if (!subtemaId) {
      if (ruta.tipo === "s") subtemaId = ruta.id;
      else if (ruta.tipo === "t") subtemaId = ordenarIndice(buscarTema(ruta.id).subtemas)[0]?.id;
      subtemaId ??= temasOrdenados().flatMap((t) => t.subtemas)[0]?.id;
    }
    if (!subtemaId) return aviso("Primero crea un tema y un subtema.");

    const p = existente ? clonar(existente) : {
      paper: null, dificultad: "facil",
      enunciado: "", imagen: "", pista: "", partes: [parteVacia("abierta")]
    };

    editor.id = id;
    editor.imagen = p.imagen || "";
    editor.grafico = p.grafico || null;
    editor.partes = p.partes;
    campoActivo = null;

    $("#tituloDlgPregunta").textContent = existente ? `Editar pregunta (${id})` : "Nueva pregunta";
    $("#preguntaSubtema").innerHTML = opcionesSubtemas(subtemaId);
    $("#preguntaPaper").value = p.paper ? String(p.paper) : "";
    $("#preguntaDificultad").value = p.dificultad;
    $("#preguntaEnunciado").value = p.enunciado;
    $("#preguntaPista").value = p.pista || "";
    $("#errorPregunta").textContent = "";
    mostrarImagenEditor();
    mostrarGraficoEditor();
    renderizarPartesEditor();
    actualizarVistaPreviaEditor();
    $("#dlgPregunta").showModal();
    $("#preguntaEnunciado").focus();
  }

  function mostrarImagenEditor() {
    const url = urlSegura(editor.imagen);
    $("#preguntaImagenVista").classList.toggle("oculto", !url);
    $("#btnQuitarImagenPregunta").classList.toggle("oculto", !url);
    if (url) $("#preguntaImagenVista").src = url;
  }

  function mostrarGraficoEditor() {
    const png = urlSegura(editor.grafico?.png);
    const vista = $("#preguntaGraficoVista");
    vista.classList.toggle("oculto", !png);
    if (png) vista.src = png;
    $("[data-grafico='pregunta']").textContent = editor.grafico ? "📈 Editar gráfico" : "📈 Añadir gráfico";
    $("[data-quitar-grafico='pregunta']").classList.toggle("oculto", !editor.grafico);
  }

  function renderizarPartesEditor() {
    $("#partesEditor").innerHTML = editor.partes.map((parte, i) => {
      const multiple = parte.tipo === "multiple";
      const opciones = multiple ? `
        <label>Alternativas (marca la correcta)</label>
        ${parte.opciones.map((op, k) => `
          <div class="opcion-editor">
            <input type="radio" name="correcta-${i}" data-campo="correcta" value="${k}" ${k === parte.correcta ? "checked" : ""} aria-label="Marcar ${LETRAS_OPCION[k]} como correcta">
            <span class="letra">${LETRAS_OPCION[k]}</span>
            <input type="text" data-campo="opcion" data-k="${k}" value="${escapar(op)}" placeholder="Texto de la alternativa ${LETRAS_OPCION[k]}">
            <button type="button" class="mini-btn peligro" data-parte="quitar-opcion" data-k="${k}" title="Quitar alternativa" ${parte.opciones.length <= 2 ? "disabled" : ""}>✕</button>
          </div>`).join("")}
        <button type="button" class="accion" data-parte="agregar-opcion" ${parte.opciones.length >= LETRAS_OPCION.length ? "disabled" : ""}>+ Alternativa</button>` : "";

      const listaRespuestas = parte.respuestas?.length ? parte.respuestas : [""];
      const respuestasHtml = multiple ? "" : `
        <div class="respuestas-editor">
          <label>✅ Respuesta correcta <small>(para que se corrija sola)</small></label>
          ${listaRespuestas.map((resp, k) => `
            <div class="opcion-editor">
              <input type="text" data-campo="respuesta" data-k="${k}" value="${escapar(resp)}" placeholder="${k === 0 ? "Ejemplo: 4" : "Otra forma válida, ej.: x = 4"}">
              <button type="button" class="mini-btn" data-parte="formula-respuesta" data-k="${k}" title="Escribir con el editor de fórmulas">ƒ(x)</button>
              <button type="button" class="mini-btn peligro" data-parte="quitar-respuesta" data-k="${k}" title="Quitar" ${listaRespuestas.length <= 1 ? "disabled" : ""}>✕</button>
            </div>`).join("")}
          <button type="button" class="accion" data-parte="agregar-respuesta">+ Otra forma válida de escribirla</button>
          <small class="ayuda">La corrección acepta formas equivalentes: si escribes <b>4</b>, también vale «x = 4», «8/2» o «4,0»; si escribes <b>2x+3</b>, vale «3+2x». Si hay varias soluciones, sepáralas con punto y coma (<b>-2; 3</b>). Déjala vacía si prefieres que el estudiante se autocalifique (por ejemplo, en una demostración).</small>
        </div>`;

      return `
        <div class="parte-editor" data-i="${i}">
          <div class="parte-editor-top">
            <strong>Apartado ${i + 1}</strong>
            <select data-campo="tipo" aria-label="Tipo de apartado">
              <option value="abierta" ${multiple ? "" : "selected"}>Respuesta abierta</option>
              <option value="multiple" ${multiple ? "selected" : ""}>Alternativas</option>
            </select>
            <input type="number" min="0" max="99" data-campo="puntos" value="${parte.puntos}" aria-label="Puntos"> pts
            <button type="button" class="mini-btn" data-parte="subir" title="Subir" ${i === 0 ? "disabled" : ""}>${ICONOS.arriba}</button>
            <button type="button" class="mini-btn" data-parte="bajar" title="Bajar" ${i === editor.partes.length - 1 ? "disabled" : ""}>${ICONOS.abajo}</button>
            <button type="button" class="mini-btn peligro" data-parte="borrar" title="Eliminar apartado" ${editor.partes.length <= 1 ? "disabled" : ""}>${ICONOS.borrar}</button>
          </div>
          <label>Texto del apartado</label>
          <textarea data-campo="texto" rows="2">${escapar(parte.texto)}</textarea>
          <div class="parte-grafico">
            ${urlSegura(parte.grafico?.png) ? `<img src="${escapar(urlSegura(parte.grafico.png))}" alt="Vista del gráfico">` : ""}
            <button type="button" class="accion" data-parte="grafico">📈 ${parte.grafico ? "Editar gráfico" : "Añadir gráfico"}</button>
            ${parte.grafico ? `<button type="button" class="accion" data-parte="quitar-grafico">Quitar gráfico</button>` : ""}
          </div>
          ${opciones}
          ${respuestasHtml}
          <label>${multiple ? "Explicación de la respuesta (opcional)" : "Solución paso a paso (se muestra después de responder)"}</label>
          <textarea data-campo="solucion" rows="2">${escapar(parte.solucion)}</textarea>
        </div>`;
    }).join("");
    $("#totalPuntosEditor").textContent = `Total: ${editor.partes.reduce((s, p) => s + (Number(p.puntos) || 0), 0)} puntos`;
  }

  function leerEditor() {
    return {
      id: editor.id || "vista-previa",
      subtema: $("#preguntaSubtema").value,
      paper: Number($("#preguntaPaper").value) || null,
      dificultad: $("#preguntaDificultad").value,
      enunciado: $("#preguntaEnunciado").value.trim(),
      imagen: urlSegura(editor.imagen),
      ...(editor.grafico ? { grafico: editor.grafico } : {}),
      pista: $("#preguntaPista").value.trim(),
      partes: editor.partes.map((parte) => {
        const limpia = {
          tipo: parte.tipo,
          texto: parte.texto.trim(),
          puntos: Math.max(0, Number(parte.puntos) || 0),
          solucion: (parte.solucion || "").trim()
        };
        if (parte.tipo === "multiple") {
          limpia.opciones = parte.opciones.map((op) => op.trim());
          limpia.correcta = parte.correcta;
        } else {
          const aceptadas = (parte.respuestas || []).map((r) => String(r).trim()).filter(Boolean);
          if (aceptadas.length) limpia.respuestas = aceptadas;
        }
        if (parte.grafico) limpia.grafico = parte.grafico;
        return limpia;
      })
    };
  }

  let temporizadorVista;
  function actualizarVistaPreviaEditor() {
    clearTimeout(temporizadorVista);
    temporizadorVista = setTimeout(() => {
      const contenedor = $("#vistaPreviaPregunta");
      contenedor.innerHTML = tarjeta(leerEditor(), 1, { vistaPrevia: true });
      renderizarMatematicas(contenedor);
    }, 250);
  }

  $("#partesEditor").addEventListener("input", (e) => {
    const bloque = e.target.closest(".parte-editor");
    if (!bloque) return;
    const parte = editor.partes[Number(bloque.dataset.i)];
    const campo = e.target.dataset.campo;

    if (campo === "tipo") {
      const nueva = parteVacia(e.target.value);
      nueva.texto = parte.texto;
      nueva.puntos = parte.puntos;
      nueva.solucion = parte.solucion;
      if (parte.grafico) nueva.grafico = parte.grafico;
      if (nueva.tipo === "abierta" && parte.respuestas?.length) nueva.respuestas = parte.respuestas;
      editor.partes[Number(bloque.dataset.i)] = nueva;
      renderizarPartesEditor();
    } else if (campo === "opcion") {
      parte.opciones[Number(e.target.dataset.k)] = e.target.value;
    } else if (campo === "respuesta") {
      parte.respuestas ??= [""];
      parte.respuestas[Number(e.target.dataset.k)] = e.target.value;
    } else if (campo === "correcta") {
      parte.correcta = Number(e.target.value);
    } else if (campo === "puntos") {
      parte.puntos = Number(e.target.value) || 0;
      $("#totalPuntosEditor").textContent = `Total: ${editor.partes.reduce((s, p) => s + (Number(p.puntos) || 0), 0)} puntos`;
    } else if (campo) {
      parte[campo] = e.target.value;
    }
    actualizarVistaPreviaEditor();
  });

  $("#partesEditor").addEventListener("click", (e) => {
    const boton = e.target.closest("[data-parte]");
    if (!boton) return;
    const i = Number(boton.closest(".parte-editor").dataset.i);
    const parte = editor.partes[i];
    switch (boton.dataset.parte) {
      case "subir":
        [editor.partes[i - 1], editor.partes[i]] = [editor.partes[i], editor.partes[i - 1]];
        break;
      case "bajar":
        [editor.partes[i + 1], editor.partes[i]] = [editor.partes[i], editor.partes[i + 1]];
        break;
      case "borrar":
        if (!confirm(`¿Eliminar el apartado ${i + 1}?`)) return;
        editor.partes.splice(i, 1);
        break;
      case "agregar-opcion":
        parte.opciones.push("");
        break;
      case "agregar-respuesta":
        parte.respuestas = [...(parte.respuestas?.length ? parte.respuestas : [""]), ""];
        break;
      case "quitar-respuesta":
        parte.respuestas.splice(Number(boton.dataset.k), 1);
        break;
      case "formula-respuesta":
        return abrirEditorMate($(`[data-campo="respuesta"][data-k="${boton.dataset.k}"]`, boton.closest(".parte-editor")));
      case "grafico":
        return abrirEditorGrafico({
          actual: parte.grafico,
          guardar: (g) => {
            parte.grafico = g;
            renderizarPartesEditor();
            actualizarVistaPreviaEditor();
          }
        });
      case "quitar-grafico":
        if (!confirm(`¿Quitar el gráfico del apartado ${i + 1}?`)) return;
        delete parte.grafico;
        break;
      case "quitar-opcion": {
        const k = Number(boton.dataset.k);
        parte.opciones.splice(k, 1);
        if (parte.correcta === k) parte.correcta = 0;
        else if (parte.correcta > k) parte.correcta -= 1;
        break;
      }
    }
    renderizarPartesEditor();
    actualizarVistaPreviaEditor();
  });

  $$("[data-agregar-parte]").forEach((b) => b.addEventListener("click", () => {
    editor.partes.push(parteVacia(b.dataset.agregarParte));
    renderizarPartesEditor();
    actualizarVistaPreviaEditor();
    $("#partesEditor .parte-editor:last-child textarea").focus();
  }));

  ["#preguntaSubtema", "#preguntaPaper", "#preguntaDificultad", "#preguntaEnunciado", "#preguntaPista"]
    .forEach((sel) => $(sel).addEventListener("input", actualizarVistaPreviaEditor));

  $("#btnSubirImagenPregunta").addEventListener("click", () => $("#inputImagenPregunta").click());
  $("#btnQuitarImagenPregunta").addEventListener("click", () => {
    editor.imagen = "";
    mostrarImagenEditor();
    actualizarVistaPreviaEditor();
  });
  $("#inputImagenPregunta").addEventListener("change", async (e) => {
    const archivo = e.target.files[0];
    e.target.value = "";
    if (!archivo) return;
    const boton = $("#btnSubirImagenPregunta");
    boton.disabled = true;
    boton.textContent = "Subiendo…";
    try {
      editor.imagen = await subirImagen(archivo);
      mostrarImagenEditor();
      actualizarVistaPreviaEditor();
    } catch (err) {
      aviso(`No se pudo subir la imagen: ${err.message}`);
    } finally {
      boton.disabled = false;
      boton.textContent = "Subir imagen";
    }
  });

  $("#formPregunta").addEventListener("submit", (e) => {
    e.preventDefault();
    const p = leerEditor();
    const error = validarPregunta(p);
    $("#errorPregunta").textContent = error || "";
    if (error) return;

    if (editor.id) {
      p.id = editor.id;
      const indice = datos.preguntas.findIndex((x) => x.id === editor.id);
      datos.preguntas[indice] = p;
    } else {
      p.id = uid("q");
      datos.preguntas.push(p);
    }
    $("#dlgPregunta").close();

    const visible = (ruta.tipo === "s" && ruta.id === p.subtema) ||
      (ruta.tipo === "t" && buscarSubtema(p.subtema)?.tema.id === ruta.id);
    if (!visible) location.hash = `#/s/${encodeURIComponent(p.subtema)}`;
    aplicarCambios(editor.id ? "Pregunta actualizada" : "Pregunta creada");
  });

  function validarPregunta(p) {
    if (!buscarSubtema(p.subtema)) return "Elige un subtema.";
    if (!p.enunciado) return "Escribe el enunciado de la pregunta.";
    for (const [i, parte] of p.partes.entries()) {
      if (!parte.texto) return `Escribe el texto del apartado ${i + 1}.`;
      if (parte.tipo === "multiple") {
        if (parte.opciones.length < 2) return `El apartado ${i + 1} necesita al menos 2 alternativas.`;
        if (parte.opciones.some((op) => !op)) return `Completa todas las alternativas del apartado ${i + 1} o elimina las vacías.`;
        if (!(parte.correcta >= 0 && parte.correcta < parte.opciones.length)) return `Marca la alternativa correcta del apartado ${i + 1}.`;
      }
    }
    return null;
  }

  function duplicarPregunta(id) {
    const indice = datos.preguntas.findIndex((p) => p.id === id);
    const copia = { ...clonar(datos.preguntas[indice]), id: uid("q") };
    datos.preguntas.splice(indice + 1, 0, copia);
    aplicarCambios("Pregunta duplicada");
  }

  function moverPregunta(id, direccion) {
    const p = buscarPregunta(id);
    const hermanas = datos.preguntas
      .map((x, i) => ({ x, i }))
      .filter(({ x }) => x.subtema === p.subtema);
    const pos = hermanas.findIndex(({ x }) => x.id === id);
    const destino = hermanas[pos + direccion];
    if (!destino) return aviso(direccion < 0 ? "Ya es la primera del subtema." : "Ya es la última del subtema.");
    const origen = hermanas[pos].i;
    [datos.preguntas[origen], datos.preguntas[destino.i]] = [datos.preguntas[destino.i], datos.preguntas[origen]];
    aplicarCambios("Orden actualizado");
  }

  function borrarPregunta(id) {
    if (!confirm(`¿Eliminar la pregunta ${id}?\n\nPodrás recuperarla desde Ajustes → Versiones anteriores.`)) return;
    datos.preguntas = datos.preguntas.filter((p) => p.id !== id);
    aplicarCambios("Pregunta eliminada");
  }

  $("#btnNuevaPregunta").addEventListener("click", () => abrirEditorPregunta());

  /* ----- Herramientas matemáticas del editor ----- */
  const PLANTILLAS_MATE = {
    formula: "",
    fraccion: "\\frac{\\placeholder{}}{\\placeholder{}}",
    raiz: "\\sqrt{\\placeholder{}}",
    matriz: "\\begin{pmatrix}\\placeholder{} & \\placeholder{}\\\\ \\placeholder{} & \\placeholder{}\\end{pmatrix}"
  };

  $("#formPregunta").addEventListener("focusin", (e) => {
    if (e.target.matches("textarea, input[type='text']")) campoActivo = e.target;
  });

  $$("[data-mate]").forEach((boton) => boton.addEventListener("click", () => {
    if (!campoActivo || !campoActivo.isConnected) campoActivo = $("#preguntaEnunciado");
    abrirEditorMate(campoActivo, PLANTILLAS_MATE[boton.dataset.mate]);
  }));

  /* ----- Gráficos GeoGebra del editor ----- */
  const dlgGrafico = $("#dlgGrafico");
  // objetivo = { actual: gráfico existente o null, guardar: (gráfico) => void }
  let graficoObjetivo = null;
  let apiGeoGebra = null;

  async function abrirEditorGrafico(objetivo) {
    graficoObjetivo = objetivo;
    const actual = objetivo.actual;
    $("#graficoApp").value = actual?.app || "graphing";
    $("#graficoApp").disabled = Boolean(actual);
    $("#graficoAlto").value = actual?.alto || 420;
    $("#graficoInteractivo").checked = Boolean(actual?.interactivo);
    dlgGrafico.showModal();
    await montarEditorGrafico(actual?.base64 || "");
  }

  async function montarEditorGrafico(base64) {
    const contenedor = $("#ggbEditor");
    apiGeoGebra = null;
    contenedor.innerHTML = `<p class="texto-suave">Cargando GeoGebra…</p>`;
    try {
      apiGeoGebra = await crearApplet(contenedor, {
        app: $("#graficoApp").value, base64,
        ancho: contenedor.clientWidth, alto: Math.min(560, window.innerHeight - 300), editable: true
      });
    } catch (err) {
      contenedor.innerHTML = `<p class="error-form">${escapar(err.message)}</p>`;
    }
  }

  $("#graficoApp").addEventListener("change", () => montarEditorGrafico(""));

  function cerrarEditorGrafico() {
    apiGeoGebra = null;
    $("#ggbEditor").innerHTML = "";
    if (dlgGrafico.open) dlgGrafico.close();
  }

  // Cubre también el cierre con Esc o con los botones de cancelar
  dlgGrafico.addEventListener("close", () => {
    apiGeoGebra = null;
    $("#ggbEditor").innerHTML = "";
  });

  $("#btnGuardarGrafico").addEventListener("click", async () => {
    if (!apiGeoGebra) return aviso("GeoGebra aún no ha terminado de cargar.");
    const boton = $("#btnGuardarGrafico");
    boton.disabled = true;
    boton.textContent = "Guardando…";
    try {
      const base64 = await new Promise((resolver) => apiGeoGebra.getBase64(resolver));
      // Imagen del gráfico: vista previa en el editor y respaldo si GeoGebra no carga
      let png = "";
      try {
        ({ url: png } = await llamarAdmin("subir_imagen", { tipo: "image/png", base64: apiGeoGebra.getPNGBase64(1, false, 96) }));
      } catch (err) {
        aviso(`El gráfico se guardará sin imagen de respaldo: ${err.message}`);
      }
      const grafico = {
        app: $("#graficoApp").value,
        base64,
        png,
        alto: Math.min(900, Math.max(200, Number($("#graficoAlto").value) || 420)),
        interactivo: $("#graficoInteractivo").checked
      };
      graficoObjetivo.guardar(grafico);
      cerrarEditorGrafico();
      aviso("Gráfico listo. No olvides pulsar «Guardar» para publicarlo.");
    } catch (err) {
      aviso(`No se pudo guardar el gráfico: ${err.message}`);
    } finally {
      boton.disabled = false;
      boton.textContent = "Guardar gráfico";
    }
  });

  $("[data-grafico='pregunta']").addEventListener("click", () => abrirEditorGrafico({
    actual: editor.grafico,
    guardar: (g) => {
      editor.grafico = g;
      mostrarGraficoEditor();
      actualizarVistaPreviaEditor();
    }
  }));
  $("[data-quitar-grafico='pregunta']").addEventListener("click", () => {
    if (!confirm("¿Quitar el gráfico del enunciado?")) return;
    editor.grafico = null;
    mostrarGraficoEditor();
    actualizarVistaPreviaEditor();
  });

  /* ----- Ajustes, copias de seguridad y versiones ----- */
  let logoEditando = "";

  function abrirAjustes() {
    const a = datos.ajustes;
    $("#ajusteSitio").value = a.sitio;
    $("#ajusteMateria").value = a.materia;
    $("#ajusteMateriaCorta").value = a.materiaCorta;
    $("#ajusteAcento").value = colorValido(a.acento) || "#0b84c6";
    logoEditando = urlSegura(a.logo) || LOGO_POR_DEFECTO;
    $("#ajusteLogoVista").src = logoEditando;
    $("#passwordNueva").value = "";
    $("#passwordRepetida").value = "";
    $("#errorPassword").textContent = "";
    $("#dlgAjustes").showModal();
    cargarVersiones();
  }

  $("#formAjustes").addEventListener("submit", (e) => {
    e.preventDefault();
    Object.assign(datos.ajustes, {
      sitio: $("#ajusteSitio").value.trim() || "BOOZ IB",
      materia: $("#ajusteMateria").value.trim(),
      materiaCorta: $("#ajusteMateriaCorta").value.trim(),
      acento: $("#ajusteAcento").value,
      logo: logoEditando
    });
    $("#dlgAjustes").close();
    aplicarCambios("Ajustes guardados");
  });

  $("#btnSubirLogo").addEventListener("click", () => $("#inputLogo").click());
  $("#inputLogo").addEventListener("change", async (e) => {
    const archivo = e.target.files[0];
    e.target.value = "";
    if (!archivo) return;
    const boton = $("#btnSubirLogo");
    boton.disabled = true;
    boton.textContent = "Subiendo…";
    try {
      logoEditando = await subirImagen(archivo, 512);
      $("#ajusteLogoVista").src = logoEditando;
      aviso("Logo subido. Pulsa «Guardar ajustes» para aplicarlo.");
    } catch (err) {
      aviso(`No se pudo subir el logo: ${err.message}`);
    } finally {
      boton.disabled = false;
      boton.textContent = "Cambiar logo";
    }
  });

  $("#btnCambiarPassword").addEventListener("click", async () => {
    const nueva = $("#passwordNueva").value;
    const error = $("#errorPassword");
    if (nueva.length < 4) return void (error.textContent = "La contraseña debe tener al menos 4 caracteres.");
    if (nueva !== $("#passwordRepetida").value) return void (error.textContent = "Las dos contraseñas no coinciden.");

    const boton = $("#btnCambiarPassword");
    boton.disabled = true;
    error.textContent = "";
    try {
      await llamarAdmin("cambiar_password", { nueva });
      passwordMaster = nueva;
      try { sessionStorage.setItem(CLAVE_MASTER, nueva); } catch { /* sin almacenamiento */ }
      $("#passwordNueva").value = "";
      $("#passwordRepetida").value = "";
      aviso("Contraseña cambiada. Úsala la próxima vez que entres.");
    } catch (err) {
      error.textContent = err.message;
      if (err.noAutorizado) salirMaster();
    } finally {
      boton.disabled = false;
    }
  });

  function descargar(nombre, contenido, tipo) {
    const url = URL.createObjectURL(new Blob([contenido], { type: tipo }));
    const enlace = Object.assign(document.createElement("a"), { href: url, download: nombre });
    document.body.append(enlace);
    enlace.click();
    enlace.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  $("#btnExportar").addEventListener("click", () => {
    const fecha = new Date().toISOString().slice(0, 10);
    descargar(`booz-banco-${fecha}.json`, JSON.stringify(datos, null, 2), "application/json");
  });

  $("#btnExportarRespaldo").addEventListener("click", () => {
    descargar("datos-respaldo.js",
      "/* Copia de respaldo del banco de preguntas: se usa solo si no hay conexión con Supabase.\n" +
      " * Para actualizarla, en modo MASTER usa Ajustes → Descargar datos-respaldo.js y reemplaza este archivo. */\n" +
      `window.DATOS_RESPALDO = ${JSON.stringify(datos, null, 1)};\n`, "text/javascript");
  });

  $("#btnImportar").addEventListener("click", () => $("#inputImportar").click());
  $("#inputImportar").addEventListener("change", async (e) => {
    const archivo = e.target.files[0];
    e.target.value = "";
    if (!archivo) return;
    try {
      const importado = JSON.parse(await archivo.text());
      if (!datosValidos(importado)) throw new Error("El archivo no tiene el formato del banco de preguntas.");
      if (!confirm(`Se reemplazará TODO el contenido actual por el del archivo (${importado.temas.length} temas, ${importado.preguntas.length} preguntas). ¿Continuar?`)) return;
      datos = normalizarDatos(importado);
      $("#dlgAjustes").close();
      aplicarCambios("Contenido importado");
    } catch (err) {
      aviso(`No se pudo importar: ${err.message}`);
    }
  });

  async function cargarVersiones() {
    const lista = $("#listaVersiones");
    lista.innerHTML = `<li class="texto-suave">Cargando…</li>`;
    try {
      const { versiones } = await llamarAdmin("historial");
      lista.innerHTML = versiones.length
        ? versiones.map((v) => `
            <li>
              <span>${new Date(v.creado).toLocaleString("es", { dateStyle: "medium", timeStyle: "short" })}</span>
              <button type="button" class="accion" data-version="${Number(v.id)}">Restaurar</button>
            </li>`).join("")
        : `<li class="texto-suave">Aún no hay versiones anteriores.</li>`;
    } catch (err) {
      lista.innerHTML = `<li class="texto-suave">No se pudieron cargar: ${escapar(err.message)}</li>`;
    }
  }

  $("#listaVersiones").addEventListener("click", async (e) => {
    const boton = e.target.closest("[data-version]");
    if (!boton) return;
    if (!confirm("¿Restaurar esta versión? El contenido actual se guardará también como versión anterior.")) return;
    boton.disabled = true;
    try {
      const respuesta = await llamarAdmin("restaurar", { version: Number(boton.dataset.version) });
      datos = normalizarDatos(respuesta.datos);
      $("#dlgAjustes").close();
      renderizarTodo();
      aviso("Versión restaurada");
    } catch (err) {
      aviso(`No se pudo restaurar: ${err.message}`);
      boton.disabled = false;
    }
  });

  /* ================= Dictado por voz ================= */
  const Reconocimiento = window.SpeechRecognition || window.webkitSpeechRecognition;
  let dictado = null;

  function alternarDictado(boton, area) {
    if (!Reconocimiento) {
      aviso("Tu navegador no permite dictar. Prueba con Google Chrome o Microsoft Edge.");
      return;
    }
    const mismoBoton = dictado?.boton === boton;
    detenerDictado();
    if (mismoBoton) return;

    const rec = new Reconocimiento();
    rec.lang = "es-ES";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (ev) => {
      for (let k = ev.resultIndex; k < ev.results.length; k++) {
        if (!ev.results[k].isFinal) continue;
        const frase = ev.results[k][0].transcript.trim();
        area.value = area.value ? `${area.value.trimEnd()} ${frase}` : frase;
        area.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };
    rec.onerror = (ev) => {
      if (ev.error === "not-allowed") aviso("Permite el acceso al micrófono para dictar.");
      detenerDictado();
    };
    rec.onend = () => { if (dictado?.rec === rec) detenerDictado(); };

    dictado = { rec, boton };
    boton.classList.add("grabando");
    $("span", boton).textContent = "Detener";
    rec.start();
    aviso("Escuchando… habla con claridad.");
  }

  function detenerDictado() {
    if (!dictado) return;
    const { rec, boton } = dictado;
    dictado = null;
    boton.classList.remove("grabando");
    const etiqueta = $("span", boton);
    if (etiqueta) etiqueta.textContent = "Dictar";
    try { rec.stop(); } catch { /* ya detenido */ }
  }

  /* ================= Diálogo de dibujo ================= */
  const dlgDibujo = $("#dlgDibujo");
  const lienzo = $("#lienzo");
  const pincel = lienzo.getContext("2d");
  const dibujo = { destino: null, color: "#14182b", borrador: false, historial: [], trazando: false };

  function limpiarLienzo() {
    pincel.fillStyle = "#fff";
    pincel.fillRect(0, 0, lienzo.width, lienzo.height);
  }

  function abrirDibujo(ctx) {
    dibujo.destino = ctx;
    dibujo.historial = [];
    limpiarLienzo();
    dlgDibujo.showModal();
  }

  function puntoEn(e) {
    const r = lienzo.getBoundingClientRect();
    return {
      x: (e.clientX - r.left) * (lienzo.width / r.width),
      y: (e.clientY - r.top) * (lienzo.height / r.height)
    };
  }

  lienzo.addEventListener("pointerdown", (e) => {
    dibujo.historial.push(pincel.getImageData(0, 0, lienzo.width, lienzo.height));
    if (dibujo.historial.length > 30) dibujo.historial.shift();
    dibujo.trazando = true;
    lienzo.setPointerCapture(e.pointerId);
    const { x, y } = puntoEn(e);
    pincel.beginPath();
    pincel.moveTo(x, y);
    pincel.lineTo(x + 0.01, y + 0.01);
    trazar();
  });

  lienzo.addEventListener("pointermove", (e) => {
    if (!dibujo.trazando) return;
    const { x, y } = puntoEn(e);
    pincel.lineTo(x, y);
    trazar();
  });

  ["pointerup", "pointercancel"].forEach((tipo) =>
    lienzo.addEventListener(tipo, () => { dibujo.trazando = false; }));

  function trazar() {
    const grosor = Number($("#grosor").value);
    pincel.lineCap = "round";
    pincel.lineJoin = "round";
    pincel.strokeStyle = dibujo.borrador ? "#fff" : dibujo.color;
    pincel.lineWidth = dibujo.borrador ? grosor * 5 : grosor;
    pincel.stroke();
  }

  $("#colores").addEventListener("click", (e) => {
    const boton = e.target.closest(".color");
    if (!boton) return;
    dibujo.color = boton.dataset.color;
    dibujo.borrador = false;
    $("#btnBorrador").classList.remove("activo");
    $$(".color").forEach((b) => b.classList.toggle("activo", b === boton));
  });

  $("#btnBorrador").addEventListener("click", (e) => {
    dibujo.borrador = !dibujo.borrador;
    e.currentTarget.classList.toggle("activo", dibujo.borrador);
  });

  $("#btnDeshacer").addEventListener("click", () => {
    const anterior = dibujo.historial.pop();
    if (anterior) pincel.putImageData(anterior, 0, 0);
  });

  $("#btnLimpiarLienzo").addEventListener("click", () => {
    dibujo.historial.push(pincel.getImageData(0, 0, lienzo.width, lienzo.height));
    limpiarLienzo();
  });

  $("#btnGuardarDibujo").addEventListener("click", () => {
    const { id, i } = dibujo.destino;
    const r = respuestaDe(id, i);
    r.imagenes.push(lienzo.toDataURL("image/jpeg", 0.85));
    guardarRespuestas();
    const parteEl = $(`.pregunta[data-id="${CSS.escape(id)}"] .parte[data-i="${i}"]`);
    if (parteEl) {
      $(".adjuntos", parteEl).innerHTML = adjuntosHtml(r);
      $(".respuesta-caja", parteEl).classList.add("activa");
    }
    dlgDibujo.close();
  });

  /* ================= Diálogo de fórmulas (editor visual MathLive) ================= */
  const dlgMate = $("#dlgMate");
  const campoFormula = $("#campoFormula");
  const entradaLatex = $("#entradaLatex");
  let areaDestino = null;
  const mathLiveListo = () => Boolean(window.customElements?.get("math-field"));

  // Abre el editor de fórmulas e inserta el resultado en "area" (textarea o input de texto)
  function abrirEditorMate(area, latexInicial = "") {
    areaDestino = area;
    $("#formulaBloque").checked = false;
    entradaLatex.value = latexInicial;
    dlgMate.showModal();

    if (mathLiveListo()) {
      campoFormula.hidden = false;
      $("#btnTeclado").hidden = false;
      campoFormula.value = latexInicial;
      campoFormula.focus();
    } else {
      // Sin conexión con la librería: queda el campo de LaTeX
      campoFormula.hidden = true;
      $("#btnTeclado").hidden = true;
      $(".latex-avanzado").open = true;
      entradaLatex.focus();
    }
  }

  campoFormula.addEventListener("input", () => { entradaLatex.value = campoFormula.value; });
  entradaLatex.addEventListener("input", () => {
    if (mathLiveListo()) campoFormula.value = entradaLatex.value;
  });

  // Plantillas (#atajos) y teclado de símbolos (#tecladoSimbolos)
  dlgMate.addEventListener("click", (e) => {
    const boton = e.target.closest("[data-latex]");
    if (!boton) return;
    if (mathLiveListo()) {
      campoFormula.executeCommand(["insert", boton.dataset.latex, { focus: true, selectionMode: "placeholder" }]);
      entradaLatex.value = campoFormula.value;
    } else {
      const limpio = boton.dataset.latex.replace(/#[?@]/g, "");
      const { selectionStart: ini, selectionEnd: fin, value } = entradaLatex;
      entradaLatex.value = value.slice(0, ini) + limpio + value.slice(fin);
      entradaLatex.focus();
    }
  });

  $("#btnTeclado").addEventListener("click", (e) => {
    const visible = $("#tecladoSimbolos").classList.toggle("oculto") === false;
    e.currentTarget.setAttribute("aria-expanded", visible);
    e.currentTarget.textContent = visible ? "⌨ Menos símbolos" : "⌨ Más símbolos";
    campoFormula.focus();
  });

  $("#btnInsertarLatex").addEventListener("click", () => {
    const codigo = (mathLiveListo() ? campoFormula.value : entradaLatex.value).trim();
    if (codigo && areaDestino) {
      const insercion = $("#formulaBloque").checked ? `$$${codigo}$$` : `$${codigo}$`;
      const { selectionStart: ini, selectionEnd: fin, value } = areaDestino;
      areaDestino.value = value.slice(0, ini) + insercion + value.slice(fin);
      areaDestino.dispatchEvent(new Event("input", { bubbles: true }));
      areaDestino.closest(".respuesta-caja")?.classList.add("activa");
      const posicion = ini + insercion.length;
      areaDestino.focus();
      areaDestino.setSelectionRange(posicion, posicion);
    }
    dlgMate.close();
  });

  /* ================= Gráficos GeoGebra ================= */
  let promesaGeoGebra = null;
  let contadorApplets = 0;

  function cargarGeoGebra() {
    if (window.GGBApplet) return Promise.resolve();
    promesaGeoGebra ??= new Promise((resolver, rechazar) => {
      const script = document.createElement("script");
      script.src = "https://www.geogebra.org/apps/deployggb.js";
      script.onload = resolver;
      script.onerror = () => {
        promesaGeoGebra = null;
        script.remove();
        rechazar(new Error("No se pudo cargar GeoGebra. Revisa tu conexión a internet."));
      };
      document.head.append(script);
    });
    return promesaGeoGebra;
  }

  // Inserta un applet de GeoGebra en "contenedor" y devuelve su API cuando está listo
  async function crearApplet(contenedor, { app, base64, ancho, alto, editable, interactivo }) {
    await cargarGeoGebra();
    const id = `ggb-${++contadorApplets}`;
    contenedor.innerHTML = `<div id="${id}"></div>`;
    return new Promise((resolver, rechazar) => {
      const limite = setTimeout(() => rechazar(new Error("GeoGebra tardó demasiado en cargar.")), 45000);
      const parametros = {
        appName: app || "graphing",
        width: Math.max(280, Math.floor(ancho)),
        height: alto,
        language: "es",
        showMenuBar: false,
        showToolBar: editable,
        showAlgebraInput: editable || interactivo,
        showResetIcon: !editable,
        showZoomButtons: true,
        showFullscreenButton: true,
        enableShiftDragZoom: true,
        enableRightClick: editable,
        enableLabelDrags: editable,
        borderColor: "#e4e7ef",
        preventFocus: !editable,
        appletOnLoad: (api) => {
          clearTimeout(limite);
          // Si el estudiante no puede editar, se muestra solo la vista gráfica
          // (el panel de álgebra ocuparía espacio y podría revelar la solución)
          if (!editable && !interactivo) {
            try { api.setPerspective(app === "3d" ? "T" : "G"); } catch { /* perspectiva no disponible */ }
          }
          resolver(api);
        }
      };
      if (base64) parametros.ggbBase64 = base64;
      new window.GGBApplet(parametros, true).inject(id);
    });
  }

  function graficoHtml(g, ref) {
    if (!g?.base64) return "";
    const png = urlSegura(g.png);
    const alto = Number(g.alto) || 420;
    const contenido = png
      ? `<img class="grafico-png" src="${escapar(png)}" alt="Gráfico de la pregunta">`
      : `<p class="texto-suave">📈 Gráfico GeoGebra</p>`;
    return ref
      ? `<div class="grafico" data-ref="${escapar(ref)}" style="min-height:${alto}px">${contenido}</div>`
      : `<div class="grafico">${contenido}</div>`;
  }

  // Los applets son pesados: se crean solo cuando su tarjeta se acerca a la pantalla
  function revisarGraficosPendientes() {
    $$(".grafico[data-ref]:not([data-montando])").forEach((el) => {
      const { top, bottom } = el.getBoundingClientRect();
      if (el.offsetParent !== null && top < window.innerHeight + 300 && bottom > -300) montarGrafico(el);
    });
  }

  let temporizadorGraficos;
  const programarRevisionGraficos = () => {
    clearTimeout(temporizadorGraficos);
    temporizadorGraficos = setTimeout(revisarGraficosPendientes, 120);
  };
  window.addEventListener("scroll", programarRevisionGraficos, { passive: true });
  window.addEventListener("resize", programarRevisionGraficos);

  function prepararGraficos() {
    programarRevisionGraficos();
  }

  // Referencias: "q|<pregunta>|q" (enunciado), "q|<pregunta>|<apartado>", "a|<apunte>"
  function graficoPorRef(ref) {
    const [tipo, id, clave] = ref.split("|");
    if (tipo === "a") return datos.apuntes.find((a) => a.id === id)?.grafico;
    const p = buscarPregunta(id);
    return clave === "q" ? p?.grafico : p?.partes[Number(clave)]?.grafico;
  }

  async function montarGrafico(el) {
    if (el.dataset.montando) return;
    el.dataset.montando = "1";
    const g = graficoPorRef(el.dataset.ref);
    if (!g?.base64 || !el.isConnected) return;
    const respaldo = el.innerHTML;
    try {
      await crearApplet(el, {
        app: g.app, base64: g.base64, ancho: el.clientWidth,
        alto: Number(g.alto) || 420, editable: false, interactivo: Boolean(g.interactivo)
      });
      el.classList.add("cargado");
    } catch {
      el.innerHTML = `${respaldo}<p class="texto-suave">No se pudo abrir GeoGebra; se muestra una imagen del gráfico.</p>`;
    }
  }

  $$("[data-cerrar]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));

  /* ================= Filtros ================= */
  [["#fEstado", "estado"], ["#fPaper", "paper"], ["#fDificultad", "dificultad"]]
    .forEach(([sel, clave]) => {
      $(sel).addEventListener("change", (e) => {
        filtros[clave] = e.target.value;
        renderizarPreguntas();
      });
    });

  /* ================= Barra lateral, tema y reinicio ================= */
  $("#btnColapsar").addEventListener("click", () => document.body.classList.add("contraida"));
  $("#btnMenu").addEventListener("click", () => {
    if (document.body.classList.contains("contraida")) document.body.classList.remove("contraida");
    else document.body.classList.toggle("menu-abierto");
  });
  $("#overlay").addEventListener("click", () => document.body.classList.remove("menu-abierto"));

  try {
    const guardado = localStorage.getItem(CLAVE_TEMA);
    if (guardado) document.documentElement.dataset.theme = guardado;
  } catch { /* sin almacenamiento */ }

  $("#btnTema").addEventListener("click", () => {
    const actual = document.documentElement.dataset.theme
      || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    const nuevo = actual === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = nuevo;
    try { localStorage.setItem(CLAVE_TEMA, nuevo); } catch { /* sin almacenamiento */ }
  });

  $("#btnReiniciar").addEventListener("click", () => {
    if (!confirm("¿Borrar tu progreso, tus favoritas y todas tus respuestas guardadas en este navegador?")) return;
    progreso.completadas.clear();
    progreso.favoritas.clear();
    progreso.puntos = {};
    Object.keys(respuestas).forEach((k) => delete respuestas[k]);
    guardarProgreso();
    guardar(CLAVE_RESPUESTAS, respuestas);
    renderizarTodo();
  });

  /* ================= Inicio ================= */
  async function iniciar() {
    await cargarDatos();
    aplicarAjustes();
    refrescarIndicadores();
    enrutar();
    window.addEventListener("hashchange", () => enrutar());

    if (passwordMaster) {
      try {
        await llamarAdmin("verificar");
        entrarMaster();
      } catch {
        salirMaster();
      }
    }
  }

  iniciar();
})();
