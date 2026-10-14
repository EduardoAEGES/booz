(() => {
  const CLAVE_PROGRESO = "booz-progreso";
  const CLAVE_TEMA = "booz-tema";
  const ORDEN_DIFICULTAD = { facil: 1, media: 2, dificil: 3 };
  const NOMBRE_DIFICULTAD = { facil: "Fácil", media: "Media", dificil: "Difícil" };
  const NOMBRE_NIVEL = { SL: "NM", HL: "NS" };
  const CIRCUNFERENCIA = 2 * Math.PI * 15;
  const LETRAS = "abcdefghij";
  const CHEVRON = `<svg viewBox="0 0 24 24" class="chev"><path d="m6 9 6 6 6-6"/></svg>`;

  const filtros = {
    niveles: new Set(),
    papers: new Set(),
    dificultades: new Set(),
    estado: "todas",
    busqueda: "",
    orden: "codigo"
  };

  // Qué se está viendo: tema y (opcionalmente) subtema seleccionados
  const seleccion = { tema: null, subtema: null };
  const temasAbiertos = new Set();
  const solucionesAbiertas = new Set();
  const progreso = cargarProgreso();

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  /* ---------- Almacenamiento local ---------- */
  function cargarProgreso() {
    try {
      const datos = JSON.parse(localStorage.getItem(CLAVE_PROGRESO)) || {};
      return {
        completadas: new Set(datos.completadas || []),
        favoritas: new Set(datos.favoritas || [])
      };
    } catch {
      return { completadas: new Set(), favoritas: new Set() };
    }
  }

  function guardarProgreso() {
    try {
      localStorage.setItem(CLAVE_PROGRESO, JSON.stringify({
        completadas: [...progreso.completadas],
        favoritas: [...progreso.favoritas]
      }));
    } catch { /* almacenamiento no disponible */ }
  }

  /* ---------- Utilidades ---------- */
  const normalizar = (texto) =>
    texto.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  const puntosTotales = (p) => p.partes.reduce((suma, parte) => suma + parte.puntos, 0);
  const hechas = (lista) => lista.filter((p) => progreso.completadas.has(p.codigo)).length;
  const preguntasDe = (tema, subtema) =>
    PREGUNTAS.filter((p) => p.tema === tema && (!subtema || p.subtema === subtema));

  function textoBuscable(p) {
    return normalizar([
      p.codigo, p.subtema, p.enunciado, ...p.partes.map((parte) => parte.texto)
    ].join(" "));
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
      <svg class="anillo" viewBox="0 0 36 36" aria-label="${completadas} de ${total} completadas">
        <circle class="fondo" cx="18" cy="18" r="15"/>
        <circle class="valor" cx="18" cy="18" r="15"
          stroke-dasharray="${CIRCUNFERENCIA}" stroke-dashoffset="${CIRCUNFERENCIA * (1 - fraccion)}"/>
      </svg>`;
  }

  /* ---------- Navegación entre vistas ---------- */
  function mostrarVista(vista, nombre) {
    $("#vistaTemas").classList.toggle("oculta", vista !== "temas");
    $("#vistaPreguntas").classList.toggle("oculta", vista !== "preguntas");
    $("#vistaProximamente").classList.toggle("oculta", vista !== "proximamente");

    const esBanco = vista !== "proximamente";
    $$(".tab, .nav-item[data-vista]").forEach((el) => {
      const activo = esBanco ? el.dataset.vista === "banco" : el.dataset.nombre === nombre;
      el.classList.toggle("activo", activo);
    });

    if (vista === "proximamente") {
      $("#tituloProximamente").textContent = `${nombre}: próximamente`;
      $("#migaActual").textContent = nombre;
    } else {
      $("#migaActual").textContent = "Banco de preguntas";
    }
    document.body.classList.remove("menu-abierto");
  }

  function abrirPreguntas(tema, subtema = null) {
    seleccion.tema = tema;
    seleccion.subtema = subtema;
    const info = TEMAS[tema];
    $("#temaBadge").textContent = `Tema ${tema} · ${info.nombre}`;
    $("#temaBadge").style.background = info.color;
    $("#tituloPreguntas").textContent = subtema || "Todas las preguntas del tema";
    filtros.busqueda = "";
    $("#busqueda").value = "";
    mostrarVista("preguntas");
    renderizarPreguntas();
    window.scrollTo({ top: 0 });
  }

  /* ---------- Vista de temas (acordeón) ---------- */
  function renderizarAcordeon() {
    $("#acordeon").innerHTML = Object.entries(TEMAS).map(([num, tema]) => {
      const n = Number(num);
      const delTema = preguntasDe(n);

      const filas = tema.subtemas.map((subtema) => {
        const lista = preguntasDe(n, subtema);
        const completas = hechas(lista);
        const cuenta = lista.length
          ? `${completas}/${lista.length} ${lista.length === 1 ? "pregunta" : "preguntas"}`
          : "Próximamente";
        return `
          <li>
            <button class="subtema-fila" data-tema="${n}" data-subtema="${subtema}" ${lista.length ? "" : "disabled"}>
              <span class="subtema-nombre">${subtema}</span>
              <span class="subtema-cuenta ${lista.length && completas === lista.length ? "completo" : ""}">${cuenta}</span>
              ${lista.length ? CHEVRON : ""}
            </button>
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
            <li><button class="practicar-todo" data-tema="${n}">Practicar todo el tema →</button></li>
          </ul>
        </li>`;
    }).join("");
  }

  /* ---------- Vista de preguntas ---------- */
  function preguntasFiltradas() {
    const consulta = normalizar(filtros.busqueda.trim());
    const lista = preguntasDe(seleccion.tema, seleccion.subtema).filter((p) => {
      if (filtros.niveles.size && !filtros.niveles.has(p.nivel)) return false;
      if (filtros.papers.size && !filtros.papers.has(String(p.paper))) return false;
      if (filtros.dificultades.size && !filtros.dificultades.has(p.dificultad)) return false;
      if (filtros.estado === "pendientes" && progreso.completadas.has(p.codigo)) return false;
      if (filtros.estado === "completadas" && !progreso.completadas.has(p.codigo)) return false;
      if (filtros.estado === "favoritas" && !progreso.favoritas.has(p.codigo)) return false;
      if (consulta && !textoBuscable(p).includes(consulta)) return false;
      return true;
    });

    const comparadores = {
      codigo: (a, b) => a.codigo.localeCompare(b.codigo),
      dificultad: (a, b) => ORDEN_DIFICULTAD[a.dificultad] - ORDEN_DIFICULTAD[b.dificultad] || a.codigo.localeCompare(b.codigo),
      puntos: (a, b) => puntosTotales(b) - puntosTotales(a) || a.codigo.localeCompare(b.codigo)
    };
    return lista.sort(comparadores[filtros.orden]);
  }

  function tarjetaPregunta(p) {
    const hecha = progreso.completadas.has(p.codigo);
    const favorita = progreso.favoritas.has(p.codigo);
    const abierta = solucionesAbiertas.has(p.codigo);

    const partes = p.partes.map((parte, i) => `
      <li>
        <span class="parte-letra">(${LETRAS[i]})</span>
        <span>${parte.texto}</span>
        <span class="parte-puntos">[${parte.puntos}]</span>
      </li>`).join("");

    const solucion = p.solucion.map((s, i) => `<li><strong>(${LETRAS[i]})</strong>${s}</li>`).join("");

    return `
      <article class="pregunta ${hecha ? "completada" : ""}" id="p-${p.codigo}" data-codigo="${p.codigo}">
        <header class="pregunta-head">
          <span class="codigo">${p.codigo}</span>
          <span class="etiqueta">${NOMBRE_NIVEL[p.nivel]} (${p.nivel})</span>
          <span class="etiqueta">Prueba ${p.paper}</span>
          <span class="etiqueta ${p.dificultad}">${NOMBRE_DIFICULTAD[p.dificultad]}</span>
          <span class="puntos-total">${puntosTotales(p)} puntos</span>
        </header>
        <div class="pregunta-body">
          <p class="subtema">${p.subtema}</p>
          <p class="enunciado">${p.enunciado}</p>
          <ol class="partes">${partes}</ol>
        </div>
        <div class="solucion ${abierta ? "visible" : ""}">
          <h4>Esquema de calificación</h4>
          <ol>${solucion}</ol>
        </div>
        <footer class="pregunta-acciones">
          <button class="accion principal" data-accion="solucion">${abierta ? "Ocultar solución" : "Ver solución"}</button>
          <button class="accion ${hecha ? "on-hecha" : ""}" data-accion="hecha">${hecha ? "✓ Completada" : "Marcar como hecha"}</button>
          <button class="accion ${favorita ? "on-fav" : ""}" data-accion="favorita">${favorita ? "★" : "☆"} Favorita</button>
        </footer>
      </article>`;
  }

  function renderizarPreguntas() {
    if (seleccion.tema === null) return;
    const lista = preguntasFiltradas();
    const total = preguntasDe(seleccion.tema, seleccion.subtema).length;
    const contenedor = $("#listaPreguntas");

    contenedor.innerHTML = lista.length
      ? lista.map(tarjetaPregunta).join("")
      : `<div class="vacio"><h3>Sin resultados</h3><p>No hay preguntas que coincidan con estos filtros.</p></div>`;

    $("#contador").textContent = `Mostrando ${lista.length} de ${total} preguntas`;
    $("#btnExpandir").textContent = lista.length && lista.every((p) => solucionesAbiertas.has(p.codigo))
      ? "Ocultar todas las soluciones"
      : "Mostrar todas las soluciones";

    renderizarMatematicas(contenedor);
  }

  function actualizarProgreso() {
    const total = PREGUNTAS.length;
    const completas = hechas(PREGUNTAS);
    $("#barraProgreso").style.width = `${total ? (completas / total) * 100 : 0}%`;
    $("#textoProgreso").textContent = `${completas}/${total}`;
  }

  function refrescarTodo() {
    renderizarAcordeon();
    renderizarPreguntas();
    actualizarProgreso();
  }

  /* ---------- Eventos: acordeón ---------- */
  $("#acordeon").addEventListener("click", (e) => {
    const cabecera = e.target.closest(".tema-cabecera");
    if (cabecera) {
      const item = cabecera.closest(".tema-item");
      const n = Number(item.dataset.tema);
      const abierto = item.classList.toggle("abierto");
      cabecera.setAttribute("aria-expanded", abierto);
      abierto ? temasAbiertos.add(n) : temasAbiertos.delete(n);
      return;
    }
    const fila = e.target.closest(".subtema-fila:not(:disabled)");
    if (fila) return abrirPreguntas(Number(fila.dataset.tema), fila.dataset.subtema);

    const todo = e.target.closest(".practicar-todo");
    if (todo) abrirPreguntas(Number(todo.dataset.tema));
  });

  $("#btnVolver").addEventListener("click", () => {
    mostrarVista("temas");
    renderizarAcordeon();
  });

  /* ---------- Eventos: navegación ---------- */
  $$(".tab, .nav-item[data-vista]").forEach((el) => {
    el.addEventListener("click", (e) => {
      e.preventDefault();
      if (el.dataset.vista === "banco") {
        mostrarVista("temas");
        renderizarAcordeon();
      } else {
        mostrarVista("proximamente", el.dataset.nombre);
      }
    });
  });

  $("#btnIrBanco").addEventListener("click", () => mostrarVista("temas"));
  $("#migaMateria").addEventListener("click", (e) => { e.preventDefault(); mostrarVista("temas"); });

  /* ---------- Eventos: filtros ---------- */
  $$(".chips").forEach((grupo) => {
    grupo.addEventListener("click", (e) => {
      const boton = e.target.closest(".chip-toggle");
      if (!boton) return;
      const conjunto = filtros[grupo.dataset.filtro];
      const valor = boton.dataset.valor;
      conjunto.has(valor) ? conjunto.delete(valor) : conjunto.add(valor);
      boton.classList.toggle("activo");
      renderizarPreguntas();
    });
  });

  $("#filtroEstado").addEventListener("click", (e) => {
    const boton = e.target.closest("button");
    if (!boton) return;
    filtros.estado = boton.dataset.valor;
    $$("#filtroEstado button").forEach((b) => b.classList.toggle("activo", b === boton));
    renderizarPreguntas();
  });

  let temporizador;
  $("#busqueda").addEventListener("input", (e) => {
    clearTimeout(temporizador);
    temporizador = setTimeout(() => {
      filtros.busqueda = e.target.value;
      renderizarPreguntas();
    }, 150);
  });

  $("#orden").addEventListener("change", (e) => {
    filtros.orden = e.target.value;
    renderizarPreguntas();
  });

  $("#btnExpandir").addEventListener("click", () => {
    const lista = preguntasFiltradas();
    const todasAbiertas = lista.every((p) => solucionesAbiertas.has(p.codigo));
    lista.forEach((p) => todasAbiertas
      ? solucionesAbiertas.delete(p.codigo)
      : solucionesAbiertas.add(p.codigo));
    renderizarPreguntas();
  });

  $("#btnAleatoria").addEventListener("click", () => {
    const lista = preguntasFiltradas();
    if (!lista.length) return;
    const elegida = lista[Math.floor(Math.random() * lista.length)];
    const tarjeta = document.getElementById(`p-${elegida.codigo}`);
    tarjeta.scrollIntoView({ behavior: "smooth", block: "start" });
    tarjeta.classList.remove("resaltada");
    void tarjeta.offsetWidth;
    tarjeta.classList.add("resaltada");
  });

  /* ---------- Eventos: tarjetas ---------- */
  $("#listaPreguntas").addEventListener("click", (e) => {
    const boton = e.target.closest("[data-accion]");
    if (!boton) return;
    const tarjeta = boton.closest(".pregunta");
    const codigo = tarjeta.dataset.codigo;

    switch (boton.dataset.accion) {
      case "solucion": {
        const abierta = tarjeta.querySelector(".solucion").classList.toggle("visible");
        abierta ? solucionesAbiertas.add(codigo) : solucionesAbiertas.delete(codigo);
        boton.textContent = abierta ? "Ocultar solución" : "Ver solución";
        return;
      }
      case "hecha":
        progreso.completadas.has(codigo) ? progreso.completadas.delete(codigo) : progreso.completadas.add(codigo);
        break;
      case "favorita":
        progreso.favoritas.has(codigo) ? progreso.favoritas.delete(codigo) : progreso.favoritas.add(codigo);
        break;
    }
    guardarProgreso();
    refrescarTodo();
  });

  $("#btnReiniciar").addEventListener("click", () => {
    if (!confirm("¿Seguro que quieres borrar tu progreso y tus favoritas?")) return;
    progreso.completadas.clear();
    progreso.favoritas.clear();
    guardarProgreso();
    refrescarTodo();
  });

  /* ---------- Barra lateral ---------- */
  $("#btnColapsar").addEventListener("click", () => document.body.classList.add("contraida"));
  $("#btnMenu").addEventListener("click", () => {
    if (document.body.classList.contains("contraida")) {
      document.body.classList.remove("contraida");
    } else {
      document.body.classList.toggle("menu-abierto");
    }
  });
  $("#overlay").addEventListener("click", () => document.body.classList.remove("menu-abierto"));

  /* ---------- Tema claro / oscuro ---------- */
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

  /* ---------- Inicio ---------- */
  renderizarAcordeon();
  actualizarProgreso();
})();
