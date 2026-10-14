(() => {
  const CLAVE_PROGRESO = "booz-progreso";
  const CLAVE_RESPUESTAS = "booz-respuestas";
  const CLAVE_TEMA = "booz-tema";
  const MATERIA = "Matemáticas: Aplicaciones e Interpretación (AI)";
  const NOMBRE_NIVEL = { SL: "NM", HL: "NS" };
  const NOMBRE_DIFICULTAD = { facil: "Fácil", media: "Media", dificil: "Difícil" };
  const TIPO_PRUEBA = { 1: "Respuesta corta", 2: "Respuesta larga", 3: "Respuesta larga" };
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
    enviar: `<svg viewBox="0 0 24 24"><path d="M3 20.5 21 12 3 3.5l2.5 8.5zM5.5 12H13"/></svg>`
  };

  const filtros = { estado: "todas", paper: "", nivel: "", dificultad: "" };
  const temasAbiertos = new Set();
  const progreso = cargarProgreso();
  const respuestas = cargar(CLAVE_RESPUESTAS, {});
  let preguntasVisibles = [];

  const $ = (sel, raiz = document) => raiz.querySelector(sel);
  const $$ = (sel, raiz = document) => raiz.querySelectorAll(sel);

  /* ================= Almacenamiento local ================= */
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

  function cargarProgreso() {
    const datos = cargar(CLAVE_PROGRESO, {});
    return {
      completadas: new Set(datos.completadas || []),
      favoritas: new Set(datos.favoritas || []),
      puntos: datos.puntos || {}
    };
  }

  function guardarProgreso() {
    guardar(CLAVE_PROGRESO, {
      completadas: [...progreso.completadas],
      favoritas: [...progreso.favoritas],
      puntos: progreso.puntos
    });
  }

  function respuestaDe(codigo, i) {
    respuestas[codigo] ??= {};
    respuestas[codigo][i] ??= { texto: "", imagenes: [] };
    return respuestas[codigo][i];
  }

  let temporizadorGuardado;
  function guardarRespuestas() {
    clearTimeout(temporizadorGuardado);
    temporizadorGuardado = setTimeout(() => guardar(CLAVE_RESPUESTAS, respuestas), 400);
  }

  /* ================= Utilidades ================= */
  const normalizar = (texto) => texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  const escapar = (texto) => texto.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  const puntosTotales = (p) => p.partes.reduce((suma, parte) => suma + parte.puntos, 0);
  const hechas = (lista) => lista.filter((p) => progreso.completadas.has(p.codigo)).length;
  const temaDeSubtema = (codigo) => Number(codigo.split(".")[0]);
  const infoSubtema = (codigo) => TEMAS[temaDeSubtema(codigo)]?.subtemas.find((s) => s.codigo === codigo);
  const nombreSubtema = (s) => `${NOMBRE_NIVEL[s.nivel]} ${s.codigo}—${s.nombre}`;
  const preguntasDeSubtema = (codigo) => PREGUNTAS.filter((p) => p.subtema === codigo);
  const preguntasDeTema = (tema) => PREGUNTAS.filter((p) => temaDeSubtema(p.subtema) === tema);
  const ordenCodigo = (a, b) => a.localeCompare(b, undefined, { numeric: true });

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
  function aviso(texto) {
    const el = $("#aviso");
    el.textContent = texto;
    el.classList.add("visible");
    clearTimeout(temporizadorAviso);
    temporizadorAviso = setTimeout(() => el.classList.remove("visible"), 3200);
  }

  /* ================= Rutas ================= */
  // #/            → lista de temas
  // #/s/1.10      → preguntas de un subtema
  // #/t/1         → todas las preguntas de un tema
  // #/pronto/Algo → sección en construcción
  function enrutar() {
    cerrarExpandida();
    detenerDictado();
    document.body.classList.remove("menu-abierto");
    const [, tipo, valor] = decodeURIComponent(location.hash).split("/");

    if (tipo === "s" && infoSubtema(valor)) return vistaSubtema(valor);
    if (tipo === "t" && TEMAS[valor]) return vistaTema(Number(valor));
    if (tipo === "pronto" && valor) return vistaProximamente(valor);
    vistaTemas();
  }

  function mostrar(idVista, seccion) {
    ["vistaTemas", "vistaPreguntas", "vistaProximamente"].forEach((id) =>
      $(`#${id}`).classList.toggle("oculta", id !== idVista));
    $$("[data-seccion]").forEach((el) => el.classList.toggle("activo", el.dataset.seccion === seccion));
    window.scrollTo({ top: 0 });
  }

  function pintarCabecera(miga, titulo) {
    const partes = [`<a href="#/">IB</a>`];
    if (miga) partes.push(`<a href="#/">${MATERIA}</a>`, `<span>${miga}</span>`);
    else partes.push(`<span>${MATERIA}</span>`);
    $("#migas").innerHTML = partes.join(SEPARADOR);
    $("#tituloHero").innerHTML = titulo;
  }

  function vistaTemas() {
    pintarCabecera(null, MATERIA);
    renderizarAcordeon();
    mostrar("vistaTemas", "banco");
  }

  function vistaSubtema(codigo) {
    const nombre = nombreSubtema(infoSubtema(codigo));
    pintarCabecera(nombre, `${nombre}<small>Banco de preguntas</small>`);
    mostrar("vistaPreguntas", "banco");
    renderizarPreguntas(preguntasDeSubtema(codigo));
  }

  function vistaTema(tema) {
    const nombre = `Tema ${tema}: ${TEMAS[tema].nombre}`;
    pintarCabecera(nombre, `${nombre}<small>Banco de preguntas</small>`);
    mostrar("vistaPreguntas", "banco");
    const lista = preguntasDeTema(tema).sort((a, b) => ordenCodigo(a.subtema, b.subtema));
    renderizarPreguntas(lista);
  }

  function vistaProximamente(nombre) {
    pintarCabecera(escapar(nombre), escapar(nombre));
    $("#tituloProximamente").textContent = `${nombre}: próximamente`;
    mostrar("vistaProximamente", nombre);
  }

  /* ================= Acordeón de temas ================= */
  // Orden del índice: primero NS (HL) y luego NM (SL); dentro de cada nivel,
  // orden alfabético del código (1.10, 1.11, …, 1.9), como en el índice de referencia.
  function ordenarIndice(subtemas) {
    return [...subtemas].sort((a, b) =>
      a.nivel === b.nivel ? a.codigo.localeCompare(b.codigo) : a.nivel === "HL" ? -1 : 1);
  }

  function renderizarAcordeon() {
    $("#acordeon").innerHTML = Object.entries(TEMAS).map(([num, tema]) => {
      const n = Number(num);
      const delTema = preguntasDeTema(n);

      const filas = ordenarIndice(tema.subtemas).map((s) => {
        const lista = preguntasDeSubtema(s.codigo);
        const cuenta = lista.length
          ? `${hechas(lista)}/${lista.length}`
          : "Próximamente";
        return `
          <li>
            <a class="subtema-fila ${lista.length ? "" : "vacio-sub"}" href="#/s/${s.codigo}">
              ${anillo(hechas(lista), lista.length)}
              <span class="subtema-nombre">${nombreSubtema(s)}</span>
              <span class="subtema-cuenta">${cuenta}</span>
            </a>
          </li>`;
      }).join("");

      return `
        <li class="tema-item ${temasAbiertos.has(n) ? "abierto" : ""}" data-tema="${n}">
          <button class="tema-cabecera" aria-expanded="${temasAbiertos.has(n)}">
            ${anillo(hechas(delTema), delTema.length)}
            <span class="tema-info">
              <span class="tema-nombre">${tema.nombre}</span>
              <span class="tema-meta">${tema.subtemas.length} subtemas · ${delTema.length} preguntas</span>
            </span>
            ${CHEVRON}
          </button>
          <ul class="subtemas">
            ${filas}
            <li><a class="practicar-todo" href="#/t/${n}">Practicar todo el tema →</a></li>
          </ul>
        </li>`;
    }).join("");
  }

  $("#acordeon").addEventListener("click", (e) => {
    const cabecera = e.target.closest(".tema-cabecera");
    if (!cabecera) return;
    const item = cabecera.closest(".tema-item");
    const n = Number(item.dataset.tema);
    const abierto = item.classList.toggle("abierto");
    cabecera.setAttribute("aria-expanded", abierto);
    abierto ? temasAbiertos.add(n) : temasAbiertos.delete(n);
  });

  /* ================= Lista de preguntas ================= */
  let listaBase = [];

  function pasaFiltros(p) {
    if (filtros.paper && String(p.paper) !== filtros.paper) return false;
    if (filtros.nivel && p.nivel !== filtros.nivel) return false;
    if (filtros.dificultad && p.dificultad !== filtros.dificultad) return false;
    if (filtros.estado === "pendientes" && progreso.completadas.has(p.codigo)) return false;
    if (filtros.estado === "completadas" && !progreso.completadas.has(p.codigo)) return false;
    if (filtros.estado === "favoritas" && !progreso.favoritas.has(p.codigo)) return false;
    return true;
  }

  function renderizarPreguntas(lista = listaBase) {
    listaBase = lista;
    preguntasVisibles = lista.filter(pasaFiltros);
    const contenedor = $("#listaPreguntas");

    if (!lista.length) {
      contenedor.innerHTML = `
        <div class="vacio">
          <img src="img/logo.jpg" alt="" class="vacio-logo">
          <h3>Aún no hay preguntas aquí</h3>
          <p>Este subtema todavía no tiene preguntas. Añádelas en <code>js/preguntas.js</code>.</p>
          <a class="btn" href="#/">Volver a los temas</a>
        </div>`;
      return;
    }
    if (!preguntasVisibles.length) {
      contenedor.innerHTML = `<div class="vacio"><h3>Sin resultados</h3><p>Ninguna pregunta coincide con estos filtros.</p></div>`;
      return;
    }

    contenedor.innerHTML = preguntasVisibles.map((p, i) => tarjeta(p, i + 1)).join("");
    renderizarMatematicas(contenedor);
    $$(".respuesta-caja", contenedor).forEach((caja) => {
      const area = $("textarea", caja);
      ajustarAltura(area);
      actualizarVistaPrevia(caja);
    });
  }

  function puntajeHtml(p) {
    const obtenidos = progreso.puntos[p.codigo];
    if (!obtenidos || !Object.keys(obtenidos).length) return "";
    const suma = Object.values(obtenidos).reduce((a, b) => a + b, 0);
    return `<span class="puntaje">Autoevaluación: ${suma}/${puntosTotales(p)}</span>`;
  }

  function tarjeta(p, numero) {
    const hecha = progreso.completadas.has(p.codigo);
    const favorita = progreso.favoritas.has(p.codigo);

    const partes = p.partes.map((parte, i) => {
      const r = respuestaDe(p.codigo, i);
      const nota = progreso.puntos[p.codigo]?.[i];
      const botonesNota = Array.from({ length: parte.puntos + 1 }, (_, n) =>
        `<button class="nota ${nota === n ? "activa" : ""}" data-nota="${n}">${n}</button>`).join("");
      const activa = r.texto || r.imagenes.length;

      return `
        <li class="parte" data-i="${i}">
          <div class="parte-texto">
            <span class="parte-num">${i + 1}.</span>
            <div>${parte.texto}</div>
            <span class="parte-puntos">[${parte.puntos}]</span>
          </div>
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
            <div class="esquema"><strong>Esquema de calificación</strong>${p.solucion[i] ?? ""}</div>
            <div class="autoeval">
              <p>Compara tu respuesta con el esquema. ¿Cuántos puntos obtuviste?</p>
              <div class="notas">${botonesNota}</div>
            </div>
          </div>
        </li>`;
    }).join("");

    const solucion = p.solucion.map((s, i) => `<li><strong>${i + 1}.</strong>${s}</li>`).join("");

    return `
      <article class="pregunta" id="p-${p.codigo}" data-codigo="${p.codigo}">
        <header class="pregunta-head">
          <h3>Pregunta ${numero}</h3>
          <span class="chip">${p.nivel}</span>
          <span class="chip">Prueba ${p.paper}</span>
          <span class="chip">${TIPO_PRUEBA[p.paper]}</span>
          <span class="chip ${p.dificultad}">${NOMBRE_DIFICULTAD[p.dificultad]}</span>
          ${puntajeHtml(p)}
          <div class="head-acciones">
            <button class="btn-redondo check ${hecha ? "on" : ""}" data-accion="hecha" title="Marcar como completada" aria-pressed="${hecha}">${ICONOS.check}</button>
            <button class="btn-redondo fav ${favorita ? "on" : ""}" data-accion="favorita" title="Favorita" aria-pressed="${favorita}">${ICONOS.estrella}</button>
            <button class="btn-redondo" data-accion="expandir" title="Ampliar">${ICONOS.expandir}</button>
            <button class="btn-respuesta" data-accion="respuesta">Respuesta</button>
          </div>
        </header>
        <p class="intro">${p.enunciado}</p>
        <ol class="partes">${partes}</ol>
        <div class="solucion-completa">
          <h4>Solución completa (${puntosTotales(p)} puntos)</h4>
          <ol>${solucion}</ol>
        </div>
        <div class="asistente">
          <div class="mensajes"></div>
          <form class="asistente-entrada">
            <img src="img/logo.jpg" alt="Asistente BOOZ" class="asistente-avatar">
            <input type="text" placeholder="Pregúntame lo que quieras…" aria-label="Pregunta al asistente">
            <button class="btn-enviar" type="submit" aria-label="Enviar">${ICONOS.enviar}</button>
          </form>
        </div>
      </article>`;
  }

  function adjuntosHtml(r) {
    return r.imagenes.map((src, k) => `
      <div class="adjunto">
        <img src="${src}" alt="Imagen adjunta ${k + 1}">
        <button data-quitar="${k}" aria-label="Quitar imagen">✕</button>
      </div>`).join("");
  }

  function ajustarAltura(area) {
    area.style.height = "auto";
    area.style.height = `${area.scrollHeight}px`;
  }

  function actualizarVistaPrevia(caja) {
    const texto = $("textarea", caja).value;
    const previa = $(".vista-previa", caja);
    const tieneMates = /\$[^$]+\$/.test(texto);
    previa.classList.toggle("visible", tieneMates);
    if (tieneMates) {
      previa.textContent = texto;
      renderizarMatematicas(previa);
    }
  }

  function contexto(el) {
    const tarjetaEl = el.closest(".pregunta");
    const parteEl = el.closest(".parte");
    const codigo = tarjetaEl.dataset.codigo;
    return {
      tarjetaEl,
      parteEl,
      codigo,
      pregunta: PREGUNTAS.find((p) => p.codigo === codigo),
      i: parteEl ? Number(parteEl.dataset.i) : null
    };
  }

  function refrescarIndicadores() {
    const total = PREGUNTAS.length;
    const completas = hechas(PREGUNTAS);
    $("#barraProgreso").style.width = `${total ? (completas / total) * 100 : 0}%`;
    $("#textoProgreso").textContent = `${completas}/${total}`;
  }

  /* ----- Clics dentro de las tarjetas ----- */
  $("#listaPreguntas").addEventListener("click", (e) => {
    const accion = e.target.closest("[data-accion]");
    const herr = e.target.closest("[data-herr]");
    const nota = e.target.closest("[data-nota]");
    const quitar = e.target.closest("[data-quitar]");

    if (e.target.tagName === "TEXTAREA") {
      e.target.closest(".respuesta-caja").classList.add("activa");
      return;
    }

    if (accion) {
      const { tarjetaEl, codigo } = contexto(accion);
      switch (accion.dataset.accion) {
        case "hecha": {
          const on = !progreso.completadas.has(codigo);
          on ? progreso.completadas.add(codigo) : progreso.completadas.delete(codigo);
          accion.classList.toggle("on", on);
          accion.setAttribute("aria-pressed", on);
          guardarProgreso();
          refrescarIndicadores();
          if (on) aviso("¡Pregunta marcada como completada!");
          break;
        }
        case "favorita": {
          const on = !progreso.favoritas.has(codigo);
          on ? progreso.favoritas.add(codigo) : progreso.favoritas.delete(codigo);
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
      const { pregunta, codigo, i, tarjetaEl } = contexto(nota);
      const valor = Number(nota.dataset.nota);
      progreso.puntos[codigo] ??= {};
      progreso.puntos[codigo][i] = valor;
      $$(".nota", nota.parentElement).forEach((b) => b.classList.toggle("activa", b === nota));
      guardarProgreso();
      $(".puntaje", tarjetaEl)?.remove();
      $(".head-acciones", tarjetaEl).insertAdjacentHTML("beforebegin", puntajeHtml(pregunta));
      return;
    }

    if (quitar) {
      const { codigo, i, parteEl } = contexto(quitar);
      const r = respuestaDe(codigo, i);
      r.imagenes.splice(Number(quitar.dataset.quitar), 1);
      $(".adjuntos", parteEl).innerHTML = adjuntosHtml(r);
      guardarRespuestas();
    }
  });

  /* ----- Escritura de respuestas ----- */
  $("#listaPreguntas").addEventListener("input", (e) => {
    if (e.target.tagName !== "TEXTAREA") return;
    const { codigo, i } = contexto(e.target);
    respuestaDe(codigo, i).texto = e.target.value;
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

  /* ----- Subir imágenes ----- */
  $("#listaPreguntas").addEventListener("change", (e) => {
    if (e.target.type !== "file" || !e.target.files.length) return;
    const { codigo, i, parteEl } = contexto(e.target);
    const archivo = e.target.files[0];
    e.target.value = "";
    reducirImagen(archivo).then((src) => {
      respuestaDe(codigo, i).imagenes.push(src);
      $(".adjuntos", parteEl).innerHTML = adjuntosHtml(respuestaDe(codigo, i));
      $(".respuesta-caja", parteEl).classList.add("activa");
      guardarRespuestas();
    }).catch(() => aviso("No se pudo leer la imagen."));
  });

  // Reduce las fotos grandes para que quepan en el almacenamiento local
  function reducirImagen(archivo, maximo = 1000) {
    return new Promise((resolver, rechazar) => {
      const lector = new FileReader();
      lector.onerror = rechazar;
      lector.onload = () => {
        const img = new Image();
        img.onerror = rechazar;
        img.onload = () => {
          const escala = Math.min(1, maximo / Math.max(img.width, img.height));
          const lienzo = document.createElement("canvas");
          lienzo.width = Math.round(img.width * escala);
          lienzo.height = Math.round(img.height * escala);
          const ctx = lienzo.getContext("2d");
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, lienzo.width, lienzo.height);
          ctx.drawImage(img, 0, 0, lienzo.width, lienzo.height);
          resolver(lienzo.toDataURL("image/jpeg", 0.8));
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
    const texto = entrada.value.trim();
    if (!texto) return;
    const { tarjetaEl, pregunta } = contexto(e.target);
    const mensajes = $(".mensajes", tarjetaEl);

    const usuario = document.createElement("div");
    usuario.className = "mensaje usuario";
    usuario.textContent = texto;
    mensajes.append(usuario);

    const bot = document.createElement("div");
    bot.className = "mensaje bot";
    bot.innerHTML = responderAsistente(pregunta, texto);
    mensajes.append(bot);
    renderizarMatematicas(bot);
    entrada.value = "";
  });

  function responderAsistente(p, texto) {
    const q = normalizar(texto);
    if (/pista|ayuda|ayudame|empiezo|empezar|no se|atasc|como (lo )?(hago|resuelvo)|formula/.test(q)) {
      return p.pista ? `💡 <strong>Pista:</strong> ${p.pista}` : "Esta pregunta no tiene pista. Revisa el esquema de calificación del primer apartado.";
    }
    if (/solucion|respuesta|resultado|resuelve/.test(q)) {
      return "Inténtalo primero 😉. Cuando termines, abre «Esquema de calificación» en cada apartado o pulsa <strong>Respuesta</strong> para ver la solución completa.";
    }
    if (/punto|marca|vale|nota/.test(q)) {
      const detalle = p.partes.map((parte, i) => `apartado ${i + 1}: ${parte.puntos}`).join(", ");
      return `Esta pregunta vale <strong>${puntosTotales(p)} puntos</strong> (${detalle}).`;
    }
    if (/calculadora|gdc/.test(q)) {
      return p.paper === 1 && p.nivel === "SL"
        ? "En Matemáticas AI puedes usar la calculadora gráfica en todas las pruebas. Úsala para comprobar tus cálculos."
        : "Sí, puedes usar la calculadora gráfica. En las pruebas 2 y 3 es imprescindible para los cálculos estadísticos y gráficos.";
    }
    if (/hola|buenas|hey/.test(q)) {
      return "¡Hola! Soy el asistente de BOOZ IB. Escribe «pista» si te atascas, «puntos» para ver cuánto vale la pregunta o «solución» para saber cómo ver la respuesta.";
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
    $("span", boton).textContent = "Dictar";
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
    const { codigo, i } = dibujo.destino;
    const r = respuestaDe(codigo, i);
    r.imagenes.push(lienzo.toDataURL("image/jpeg", 0.85));
    guardarRespuestas();
    const parteEl = $(`#p-${codigo} .parte[data-i="${i}"]`);
    if (parteEl) {
      $(".adjuntos", parteEl).innerHTML = adjuntosHtml(r);
      $(".respuesta-caja", parteEl).classList.add("activa");
    }
    dlgDibujo.close();
  });

  /* ================= Diálogo de fórmulas ================= */
  const dlgMate = $("#dlgMate");
  const entradaLatex = $("#entradaLatex");
  let areaDestino = null;

  function abrirEditorMate(area) {
    areaDestino = area;
    entradaLatex.value = "";
    previsualizarLatex();
    dlgMate.showModal();
    entradaLatex.focus();
  }

  function previsualizarLatex() {
    const vista = $("#vistaLatex");
    const codigo = entradaLatex.value.trim();
    if (!codigo || typeof katex === "undefined") {
      vista.textContent = "Vista previa";
      return;
    }
    katex.render(codigo, vista, { throwOnError: false, displayMode: true });
  }

  entradaLatex.addEventListener("input", previsualizarLatex);

  $("#atajos").addEventListener("click", (e) => {
    const boton = e.target.closest("[data-latex]");
    if (!boton) return;
    const { selectionStart: ini, selectionEnd: fin, value } = entradaLatex;
    entradaLatex.value = value.slice(0, ini) + boton.dataset.latex + value.slice(fin);
    entradaLatex.focus();
    entradaLatex.selectionStart = entradaLatex.selectionEnd = ini + boton.dataset.latex.length;
    previsualizarLatex();
  });

  $("#btnInsertarLatex").addEventListener("click", () => {
    const codigo = entradaLatex.value.trim();
    if (codigo && areaDestino) {
      const { selectionStart: ini, selectionEnd: fin, value } = areaDestino;
      const insercion = `$${codigo}$`;
      areaDestino.value = value.slice(0, ini) + insercion + value.slice(fin);
      areaDestino.dispatchEvent(new Event("input", { bubbles: true }));
      areaDestino.closest(".respuesta-caja").classList.add("activa");
    }
    dlgMate.close();
  });

  $$("[data-cerrar]").forEach((b) => b.addEventListener("click", () => b.closest("dialog").close()));

  /* ================= Filtros ================= */
  [["#fEstado", "estado"], ["#fPaper", "paper"], ["#fNivel", "nivel"], ["#fDificultad", "dificultad"]]
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
    if (!confirm("¿Borrar tu progreso, tus favoritas y todas tus respuestas guardadas?")) return;
    progreso.completadas.clear();
    progreso.favoritas.clear();
    progreso.puntos = {};
    Object.keys(respuestas).forEach((k) => delete respuestas[k]);
    guardarProgreso();
    guardar(CLAVE_RESPUESTAS, respuestas);
    refrescarIndicadores();
    enrutar();
  });

  /* ================= Inicio ================= */
  window.addEventListener("hashchange", enrutar);
  refrescarIndicadores();
  enrutar();
})();
