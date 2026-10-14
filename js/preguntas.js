/*
 * Banco de preguntas BOOZ — preguntas originales de práctica.
 * Para añadir una pregunta, copia un objeto y cambia sus campos.
 *   tema: 1..5 (ver TEMAS) · nivel: "SL" | "HL" · paper: 1 | 2 | 3
 *   dificultad: "facil" | "media" | "dificil"
 *   Las fórmulas se escriben en LaTeX entre $...$ (en línea) o $$...$$ (bloque).
 */
const t = String.raw;

/* Cada pregunta debe usar en "subtema" uno de los nombres de su tema. */
const TEMAS = {
  1: {
    nombre: "Número y álgebra", color: "#4f46e5",
    subtemas: [
      "Notación científica", "Progresiones aritméticas", "Progresiones geométricas / crecimiento",
      "Matemática financiera", "Logaritmos y exponentes", "Aproximación y error",
      "Números complejos", "Matrices y sistemas", "Autovalores y autovectores"
    ]
  },
  2: {
    nombre: "Funciones", color: "#0891b2",
    subtemas: [
      "Rectas", "Dominio, recorrido e inversa", "Modelos cuadráticos", "Modelos exponenciales",
      "Modelos sinusoidales", "Transformaciones de funciones", "Modelos logísticos"
    ]
  },
  3: {
    nombre: "Geometría y trigonometría", color: "#16a34a",
    subtemas: [
      "Trigonometría en triángulos rectángulos", "Teorema del coseno y área", "Volumen y superficie de sólidos",
      "Geometría analítica", "Diagramas de Voronoi", "Arcos y sectores (radianes)",
      "Vectores", "Teoría de grafos"
    ]
  },
  4: {
    nombre: "Estadística y probabilidad", color: "#d97706",
    subtemas: [
      "Estadística descriptiva", "Probabilidad sin reemplazo", "Distribución normal",
      "Distribución binomial", "Regresión lineal", "Prueba de independencia χ²",
      "Pruebas t y bondad de ajuste", "Cadenas de Markov"
    ]
  },
  5: {
    nombre: "Cálculo", color: "#db2777",
    subtemas: [
      "Límites y derivadas", "Recta tangente", "Puntos estacionarios", "Optimización",
      "Integración y regla del trapecio", "Cinemática", "Ecuaciones diferenciales (método de Euler)",
      "Sistemas de ecuaciones diferenciales"
    ]
  }
};

const PREGUNTAS = [
  /* ===================== TEMA 1: NÚMERO Y ÁLGEBRA ===================== */
  {
    codigo: "NA-01", tema: 1, subtema: "Notación científica", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Un grano de polen tiene un diámetro de $0.000\,372$ metros.`,
    partes: [
      { texto: t`Escribe el diámetro en la forma $a \times 10^{k}$, donde $1 \le a < 10$ y $k \in \mathbb{Z}$.`, puntos: 2 },
      { texto: t`Se colocan $5 \times 10^{6}$ granos en fila. Calcula la longitud total de la fila en metros, dando la respuesta en la forma $a \times 10^{k}$.`, puntos: 2 }
    ],
    solucion: [
      t`$3.72 \times 10^{-4}$ m`,
      t`$(3.72 \times 10^{-4})(5 \times 10^{6}) = 18.6 \times 10^{2} = 1.86 \times 10^{3}$ m`
    ]
  },
  {
    codigo: "NA-02", tema: 1, subtema: "Progresiones aritméticas", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Un teatro tiene 20 filas de asientos. La primera fila tiene 7 asientos y cada fila tiene 4 asientos más que la anterior.`,
    partes: [
      { texto: t`Halla el número de asientos de la última fila.`, puntos: 2 },
      { texto: t`Halla el número total de asientos del teatro.`, puntos: 2 }
    ],
    solucion: [
      t`$u_{20} = 7 + (20-1)(4) = 83$ asientos`,
      t`$S_{20} = \dfrac{20}{2}(7 + 83) = 900$ asientos`
    ]
  },
  {
    codigo: "NA-03", tema: 1, subtema: "Progresiones geométricas / crecimiento", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`Un cultivo de bacterias tiene inicialmente 200 bacterias y crece un $15\%$ cada hora.`,
    partes: [
      { texto: t`Calcula el número de bacterias después de 6 horas.`, puntos: 2 },
      { texto: t`Halla el menor número entero de horas necesario para que el cultivo supere las 1000 bacterias.`, puntos: 3 }
    ],
    solucion: [
      t`$200(1.15)^{6} \approx 462.6 \Rightarrow 463$ bacterias`,
      t`$200(1.15)^{n} > 1000 \Rightarrow 1.15^{n} > 5 \Rightarrow n > \dfrac{\ln 5}{\ln 1.15} \approx 11.5$. Respuesta: $12$ horas.`
    ]
  },
  {
    codigo: "NA-04", tema: 1, subtema: "Matemática financiera", nivel: "SL", paper: 1, dificultad: "media",
    enunciado: t`Lucía invierte 5000 USD a una tasa de interés anual del $4.2\%$ compuesto mensualmente.`,
    partes: [
      { texto: t`Calcula el valor de la inversión después de 5 años, redondeado al dólar.`, puntos: 3 },
      { texto: t`Calcula el interés total ganado.`, puntos: 1 }
    ],
    solucion: [
      t`$FV = 5000\left(1 + \dfrac{0.042}{12}\right)^{60} \approx 6166$ USD (con la calculadora: $N=60$, $I\%=4.2$, $PV=-5000$, $P/Y=C/Y=12$).`,
      t`$6166 - 5000 = 1166$ USD`
    ]
  },
  {
    codigo: "NA-05", tema: 1, subtema: "Números complejos", nivel: "HL", paper: 1, dificultad: "media",
    enunciado: t`Considera el número complejo $z = 1 + \sqrt{3}\,i$.`,
    partes: [
      { texto: t`Halla el módulo y el argumento de $z$.`, puntos: 2 },
      { texto: t`Escribe $z$ en la forma $re^{i\theta}$.`, puntos: 1 },
      { texto: t`Halla $z^{6}$.`, puntos: 2 }
    ],
    solucion: [
      t`$|z| = \sqrt{1 + 3} = 2$, $\arg z = \arctan\sqrt{3} = \dfrac{\pi}{3}$`,
      t`$z = 2e^{i\pi/3}$`,
      t`$z^{6} = 2^{6}e^{i2\pi} = 64$`
    ]
  },
  {
    codigo: "NA-06", tema: 1, subtema: "Matrices y sistemas", nivel: "HL", paper: 2, dificultad: "media",
    enunciado: t`Sea $A = \begin{pmatrix} 2 & 1 \\ 1 & 3 \end{pmatrix}$.`,
    partes: [
      { texto: t`Halla $\det A$.`, puntos: 1 },
      { texto: t`Halla $A^{-1}$.`, puntos: 2 },
      { texto: t`Usa $A^{-1}$ para resolver el sistema $2x + y = 7$, $\;x + 3y = 11$.`, puntos: 3 }
    ],
    solucion: [
      t`$\det A = 2(3) - 1(1) = 5$`,
      t`$A^{-1} = \dfrac{1}{5}\begin{pmatrix} 3 & -1 \\ -1 & 2 \end{pmatrix}$`,
      t`$\begin{pmatrix} x \\ y \end{pmatrix} = \dfrac{1}{5}\begin{pmatrix} 3 & -1 \\ -1 & 2 \end{pmatrix}\begin{pmatrix} 7 \\ 11 \end{pmatrix} = \begin{pmatrix} 2 \\ 3 \end{pmatrix}$, es decir $x = 2,\ y = 3$.`
    ]
  },

  /* ===================== TEMA 2: FUNCIONES ===================== */
  {
    codigo: "FU-01", tema: 2, subtema: "Rectas", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`La recta $L_1$ pasa por los puntos $(2, 5)$ y $(6, 13)$.`,
    partes: [
      { texto: t`Halla la pendiente de $L_1$.`, puntos: 2 },
      { texto: t`Escribe la ecuación de $L_1$ en la forma $y = mx + c$.`, puntos: 2 },
      { texto: t`La recta $L_2$ es perpendicular a $L_1$ y pasa por el origen. Escribe su ecuación.`, puntos: 2 }
    ],
    solucion: [
      t`$m = \dfrac{13 - 5}{6 - 2} = 2$`,
      t`$5 = 2(2) + c \Rightarrow c = 1$, así $y = 2x + 1$`,
      t`$m_2 = -\dfrac{1}{2}$, así $y = -\dfrac{1}{2}x$`
    ]
  },
  {
    codigo: "FU-02", tema: 2, subtema: "Modelos cuadráticos", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`La altura, en metros, de una pelota lanzada hacia arriba viene dada por $h(t) = -4.9t^{2} + 19.6t + 2$, donde $t$ es el tiempo en segundos.`,
    partes: [
      { texto: t`Escribe la altura desde la que se lanza la pelota.`, puntos: 1 },
      { texto: t`Halla la altura máxima y el instante en que se alcanza.`, puntos: 3 },
      { texto: t`Halla el instante en que la pelota llega al suelo.`, puntos: 2 }
    ],
    solucion: [
      t`$h(0) = 2$ m`,
      t`Vértice: $t = -\dfrac{19.6}{2(-4.9)} = 2$ s; $h(2) = 21.6$ m`,
      t`$-4.9t^{2} + 19.6t + 2 = 0 \Rightarrow t \approx 4.10$ s (se descarta la raíz negativa)`
    ]
  },
  {
    codigo: "FU-03", tema: 2, subtema: "Modelos exponenciales", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`La temperatura de un café, en $^\circ$C, $t$ minutos después de servirse, se modela con $T(t) = 20 + 70e^{-0.05t}$.`,
    partes: [
      { texto: t`Halla la temperatura inicial del café.`, puntos: 1 },
      { texto: t`Halla la temperatura después de 10 minutos.`, puntos: 2 },
      { texto: t`Halla cuánto tiempo tarda el café en enfriarse a $40^\circ$C.`, puntos: 2 },
      { texto: t`Escribe la ecuación de la asíntota horizontal e interpreta su significado.`, puntos: 2 }
    ],
    solucion: [
      t`$T(0) = 90^\circ$C`,
      t`$T(10) = 20 + 70e^{-0.5} \approx 62.5^\circ$C`,
      t`$70e^{-0.05t} = 20 \Rightarrow t = \dfrac{\ln 3.5}{0.05} \approx 25.1$ min`,
      t`$T = 20$: la temperatura del café se acerca a la temperatura ambiente, $20^\circ$C.`
    ]
  },
  {
    codigo: "FU-04", tema: 2, subtema: "Modelos sinusoidales", nivel: "HL", paper: 2, dificultad: "dificil",
    enunciado: t`La profundidad del agua en un puerto, en metros, $t$ horas después de la medianoche, se modela con $d(t) = 3\sin\!\left(\dfrac{\pi}{6}t\right) + 5$, para $0 \le t \le 24$.`,
    partes: [
      { texto: t`Halla el período y la amplitud de $d$.`, puntos: 2 },
      { texto: t`Halla la profundidad máxima y la primera hora a la que ocurre.`, puntos: 2 },
      { texto: t`Un barco necesita al menos $6.5$ m de profundidad. Halla el intervalo de tiempo, durante las primeras 12 horas, en que el barco puede entrar al puerto.`, puntos: 3 }
    ],
    solucion: [
      t`Período $= \dfrac{2\pi}{\pi/6} = 12$ h; amplitud $= 3$ m`,
      t`Máximo $= 8$ m cuando $\dfrac{\pi}{6}t = \dfrac{\pi}{2} \Rightarrow t = 3$ (a las 3:00)`,
      t`$\sin\!\left(\dfrac{\pi}{6}t\right) \ge 0.5 \Rightarrow \dfrac{\pi}{6} \le \dfrac{\pi}{6}t \le \dfrac{5\pi}{6} \Rightarrow 1 \le t \le 5$ (de 1:00 a 5:00)`
    ]
  },

  /* ============== TEMA 3: GEOMETRÍA Y TRIGONOMETRÍA ============== */
  {
    codigo: "GT-01", tema: 3, subtema: "Trigonometría en triángulos rectángulos", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Una escalera de 6 m está apoyada en una pared vertical y forma un ángulo de $70^\circ$ con el suelo horizontal.`,
    partes: [
      { texto: t`Halla la altura a la que la escalera toca la pared.`, puntos: 2 },
      { texto: t`Halla la distancia del pie de la escalera a la pared.`, puntos: 2 }
    ],
    solucion: [
      t`$6\sin 70^\circ \approx 5.64$ m`,
      t`$6\cos 70^\circ \approx 2.05$ m`
    ]
  },
  {
    codigo: "GT-02", tema: 3, subtema: "Teorema del coseno y área", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`En el triángulo $ABC$, $AC = 8$ cm, $BC = 11$ cm y $A\hat{C}B = 50^\circ$.`,
    partes: [
      { texto: t`Halla $AB$.`, puntos: 3 },
      { texto: t`Halla el área del triángulo $ABC$.`, puntos: 2 }
    ],
    solucion: [
      t`$AB^{2} = 8^{2} + 11^{2} - 2(8)(11)\cos 50^\circ \approx 71.87 \Rightarrow AB \approx 8.48$ cm`,
      t`$\text{Área} = \tfrac{1}{2}(8)(11)\sin 50^\circ \approx 33.7$ cm$^{2}$`
    ]
  },
  {
    codigo: "GT-03", tema: 3, subtema: "Volumen y superficie de sólidos", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Un cono recto tiene radio de la base $3$ cm y altura $4$ cm.`,
    partes: [
      { texto: t`Halla el volumen del cono.`, puntos: 2 },
      { texto: t`Halla la generatriz (altura inclinada) del cono.`, puntos: 1 },
      { texto: t`Halla el área total de la superficie del cono.`, puntos: 2 }
    ],
    solucion: [
      t`$V = \tfrac{1}{3}\pi(3)^{2}(4) = 12\pi \approx 37.7$ cm$^{3}$`,
      t`$l = \sqrt{3^{2} + 4^{2}} = 5$ cm`,
      t`$A = \pi r^{2} + \pi r l = 9\pi + 15\pi = 24\pi \approx 75.4$ cm$^{2}$`
    ]
  },
  {
    codigo: "GT-04", tema: 3, subtema: "Geometría analítica", nivel: "SL", paper: 1, dificultad: "media",
    enunciado: t`Considera los puntos $A(-1, 4)$ y $B(5, -4)$.`,
    partes: [
      { texto: t`Halla la distancia $AB$.`, puntos: 2 },
      { texto: t`Halla el punto medio $M$ de $[AB]$.`, puntos: 1 },
      { texto: t`Halla la ecuación de la mediatriz de $[AB]$.`, puntos: 3 }
    ],
    solucion: [
      t`$AB = \sqrt{6^{2} + (-8)^{2}} = 10$`,
      t`$M = (2, 0)$`,
      t`$m_{AB} = -\dfrac{4}{3} \Rightarrow m_\perp = \dfrac{3}{4}$; $y = \dfrac{3}{4}(x - 2)$`
    ]
  },
  {
    codigo: "GT-05", tema: 3, subtema: "Arcos y sectores (radianes)", nivel: "HL", paper: 1, dificultad: "facil",
    enunciado: t`Un sector circular tiene radio $10$ cm y ángulo central $1.2$ radianes.`,
    partes: [
      { texto: t`Halla la longitud del arco.`, puntos: 2 },
      { texto: t`Halla el área del sector.`, puntos: 2 }
    ],
    solucion: [
      t`$s = r\theta = 10(1.2) = 12$ cm`,
      t`$A = \tfrac{1}{2}r^{2}\theta = \tfrac{1}{2}(100)(1.2) = 60$ cm$^{2}$`
    ]
  },

  /* ============== TEMA 4: ESTADÍSTICA Y PROBABILIDAD ============== */
  {
    codigo: "EP-01", tema: 4, subtema: "Estadística descriptiva", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Las notas de 7 estudiantes en una prueba son: $4,\ 7,\ 7,\ 8,\ 10,\ 12,\ 15$.`,
    partes: [
      { texto: t`Halla la media.`, puntos: 1 },
      { texto: t`Halla la mediana y la moda.`, puntos: 2 },
      { texto: t`Halla el rango.`, puntos: 1 }
    ],
    solucion: [
      t`$\bar{x} = \dfrac{63}{7} = 9$`,
      t`Mediana $= 8$; moda $= 7$`,
      t`Rango $= 15 - 4 = 11$`
    ]
  },
  {
    codigo: "EP-02", tema: 4, subtema: "Probabilidad sin reemplazo", nivel: "SL", paper: 1, dificultad: "media",
    enunciado: t`Una urna contiene 5 bolas rojas y 3 azules. Se extraen dos bolas al azar, una tras otra, sin reemplazo.`,
    partes: [
      { texto: t`Halla la probabilidad de que ambas bolas sean rojas.`, puntos: 2 },
      { texto: t`Halla la probabilidad de que las bolas sean de distinto color.`, puntos: 3 }
    ],
    solucion: [
      t`$\dfrac{5}{8}\cdot\dfrac{4}{7} = \dfrac{5}{14}$`,
      t`$\dfrac{5}{8}\cdot\dfrac{3}{7} + \dfrac{3}{8}\cdot\dfrac{5}{7} = \dfrac{30}{56} = \dfrac{15}{28}$`
    ]
  },
  {
    codigo: "EP-03", tema: 4, subtema: "Distribución normal", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`Las estaturas de los estudiantes de un colegio siguen una distribución normal con media $170$ cm y desviación típica $8$ cm.`,
    partes: [
      { texto: t`Halla la probabilidad de que un estudiante elegido al azar mida más de $182$ cm.`, puntos: 2 },
      { texto: t`Halla la probabilidad de que un estudiante mida entre $160$ y $180$ cm.`, puntos: 2 },
      { texto: t`El $10\%$ más alto de los estudiantes mide más de $k$ cm. Halla $k$.`, puntos: 2 }
    ],
    solucion: [
      t`$P(X > 182) \approx 0.0668$`,
      t`$P(160 < X < 180) \approx 0.789$`,
      t`$P(X < k) = 0.9 \Rightarrow k \approx 180.3$ cm`
    ]
  },
  {
    codigo: "EP-04", tema: 4, subtema: "Distribución binomial", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`La probabilidad de que un tirador acierte en el blanco es $0.3$. Realiza 10 tiros independientes. Sea $X$ el número de aciertos.`,
    partes: [
      { texto: t`Halla $P(X = 3)$.`, puntos: 2 },
      { texto: t`Halla $P(X \ge 2)$.`, puntos: 2 },
      { texto: t`Halla el número esperado de aciertos.`, puntos: 1 }
    ],
    solucion: [
      t`$P(X = 3) = \binom{10}{3}(0.3)^{3}(0.7)^{7} \approx 0.267$`,
      t`$P(X \ge 2) = 1 - P(X \le 1) \approx 1 - 0.149 = 0.851$`,
      t`$E(X) = np = 3$`
    ]
  },
  {
    codigo: "EP-05", tema: 4, subtema: "Regresión lineal", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Para un grupo de estudiantes, la recta de regresión de la nota de examen $y$ sobre las horas de estudio $x$ es $y = 2.5x + 12$. El coeficiente de correlación es $r = 0.91$.`,
    partes: [
      { texto: t`Describe la correlación entre las variables.`, puntos: 1 },
      { texto: t`Estima la nota de un estudiante que estudió 8 horas.`, puntos: 2 },
      { texto: t`Interpreta el valor $2.5$ en este contexto.`, puntos: 1 }
    ],
    solucion: [
      t`Correlación lineal positiva fuerte.`,
      t`$y = 2.5(8) + 12 = 32$`,
      t`Por cada hora adicional de estudio, la nota aumenta en promedio $2.5$ puntos.`
    ]
  },
  {
    codigo: "EP-06", tema: 4, subtema: "Prueba de independencia χ²", nivel: "SL", paper: 2, dificultad: "dificil",
    enunciado: t`Se pregunta a 200 estudiantes por su deporte preferido. Se realiza una prueba $\chi^{2}$ de independencia entre género y deporte preferido al nivel de significación del $5\%$. La tabla tiene 2 filas y 3 columnas, y el valor $p$ obtenido es $0.032$.`,
    partes: [
      { texto: t`Escribe las hipótesis nula y alternativa.`, puntos: 2 },
      { texto: t`Halla el número de grados de libertad.`, puntos: 1 },
      { texto: t`Escribe la conclusión de la prueba, justificando tu respuesta.`, puntos: 2 }
    ],
    solucion: [
      t`$H_0$: el deporte preferido es independiente del género. $H_1$: el deporte preferido no es independiente del género.`,
      t`$gl = (2-1)(3-1) = 2$`,
      t`Como $0.032 < 0.05$, se rechaza $H_0$: hay evidencia de que el deporte preferido depende del género.`
    ]
  },

  /* ===================== TEMA 5: CÁLCULO ===================== */
  {
    codigo: "CA-01", tema: 5, subtema: "Puntos estacionarios", nivel: "SL", paper: 1, dificultad: "media",
    enunciado: t`Considera la función $f(x) = x^{3} - 6x^{2} + 9x + 1$.`,
    partes: [
      { texto: t`Halla $f'(x)$.`, puntos: 2 },
      { texto: t`Halla las coordenadas de los puntos estacionarios y determina su naturaleza.`, puntos: 4 }
    ],
    solucion: [
      t`$f'(x) = 3x^{2} - 12x + 9$`,
      t`$3(x-1)(x-3) = 0 \Rightarrow x = 1, 3$. Máximo local en $(1, 5)$ y mínimo local en $(3, 1)$ (el signo de $f'$ cambia de $+$ a $-$ en $x=1$ y de $-$ a $+$ en $x=3$).`
    ]
  },
  {
    codigo: "CA-02", tema: 5, subtema: "Recta tangente", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Considera la curva $y = x^{2} + 3x$.`,
    partes: [
      { texto: t`Halla la pendiente de la curva en $x = 2$.`, puntos: 2 },
      { texto: t`Halla la ecuación de la recta tangente en $x = 2$.`, puntos: 2 }
    ],
    solucion: [
      t`$\dfrac{dy}{dx} = 2x + 3 \Rightarrow$ en $x = 2$, la pendiente es $7$`,
      t`Punto $(2, 10)$: $y - 10 = 7(x - 2) \Rightarrow y = 7x - 4$`
    ]
  },
  {
    codigo: "CA-03", tema: 5, subtema: "Integración y regla del trapecio", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`La región $R$ está limitada por la curva $y = 4 - x^{2}$ y el eje $x$.`,
    partes: [
      { texto: t`Usa la regla del trapecio con 4 intervalos de igual ancho para estimar el área de $R$.`, puntos: 3 },
      { texto: t`Halla el área exacta de $R$.`, puntos: 2 },
      { texto: t`Calcula el porcentaje de error de la estimación.`, puntos: 2 }
    ],
    solucion: [
      t`$h = 1$; valores: $0, 3, 4, 3, 0$. Área $\approx \tfrac{1}{2}(1)[0 + 0 + 2(3 + 4 + 3)] = 10$`,
      t`$\displaystyle\int_{-2}^{2}(4 - x^{2})\,dx = \dfrac{32}{3} \approx 10.67$`,
      t`$\left|\dfrac{10 - 32/3}{32/3}\right| \times 100\% = 6.25\%$`
    ]
  },
  {
    codigo: "CA-04", tema: 5, subtema: "Optimización", nivel: "SL", paper: 2, dificultad: "dificil",
    enunciado: t`Con una lámina cuadrada de cartón de 12 cm de lado se construye una caja abierta recortando cuadrados de lado $x$ cm en cada esquina y doblando los lados.`,
    partes: [
      { texto: t`Demuestra que el volumen de la caja es $V = x(12 - 2x)^{2}$.`, puntos: 2 },
      { texto: t`Halla el valor de $x$ que maximiza el volumen.`, puntos: 3 },
      { texto: t`Halla el volumen máximo.`, puntos: 1 }
    ],
    solucion: [
      t`La base es un cuadrado de lado $12 - 2x$ y la altura es $x$, por tanto $V = x(12 - 2x)^{2}$.`,
      t`$V'(x) = (12 - 2x)(12 - 6x) = 0 \Rightarrow x = 2$ (se descarta $x = 6$ porque da volumen $0$).`,
      t`$V(2) = 2(8)^{2} = 128$ cm$^{3}$`
    ]
  },
  {
    codigo: "CA-05", tema: 5, subtema: "Cinemática", nivel: "HL", paper: 2, dificultad: "media",
    enunciado: t`Una partícula se mueve en línea recta con velocidad $v(t) = 6t - t^{2}$ m s$^{-1}$, para $0 \le t \le 6$.`,
    partes: [
      { texto: t`Halla la aceleración en $t = 2$.`, puntos: 2 },
      { texto: t`Halla el desplazamiento entre $t = 0$ y $t = 6$.`, puntos: 2 },
      { texto: t`Halla la velocidad máxima.`, puntos: 2 }
    ],
    solucion: [
      t`$a(t) = 6 - 2t \Rightarrow a(2) = 2$ m s$^{-2}$`,
      t`$\displaystyle\int_{0}^{6}(6t - t^{2})\,dt = \left[3t^{2} - \tfrac{t^{3}}{3}\right]_0^6 = 36$ m`,
      t`$a = 0 \Rightarrow t = 3$; $v(3) = 9$ m s$^{-1}$`
    ]
  },
  {
    codigo: "CA-06", tema: 5, subtema: "Ecuaciones diferenciales (método de Euler)", nivel: "HL", paper: 3, dificultad: "dificil",
    enunciado: t`Considera la ecuación diferencial $\dfrac{dy}{dx} = x + y$, con $y(0) = 1$.`,
    partes: [
      { texto: t`Usa el método de Euler con paso $h = 0.1$ para estimar $y(0.2)$.`, puntos: 4 },
      { texto: t`Verifica que $y = 2e^{x} - x - 1$ es la solución exacta y halla el porcentaje de error de la estimación.`, puntos: 4 }
    ],
    solucion: [
      t`$y_1 = 1 + 0.1(0 + 1) = 1.1$; $\;y_2 = 1.1 + 0.1(0.1 + 1.1) = 1.22$. Por tanto $y(0.2) \approx 1.22$.`,
      t`$y' = 2e^{x} - 1$ y $x + y = 2e^{x} - 1$ ✓; $y(0) = 2 - 0 - 1 = 1$ ✓. Exacta: $y(0.2) = 2e^{0.2} - 1.2 \approx 1.2428$. Error $\approx \dfrac{0.0228}{1.2428} \times 100\% \approx 1.84\%$.`
    ]
  }
];
