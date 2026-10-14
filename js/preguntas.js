/*
 * Banco de preguntas BOOZ IB — preguntas originales de práctica.
 *
 * Para añadir una pregunta, copia un objeto de PREGUNTAS y cambia sus campos:
 *   subtema:    código del subtema (ver TEMAS), p. ej. "1.2" o "5.16"
 *   nivel:      "SL" (NM) | "HL" (NS)
 *   paper:      1 | 2 | 3
 *   dificultad: "facil" | "media" | "dificil"
 *   enunciado:  texto introductorio de la pregunta
 *   partes:     apartados, cada uno con su texto y sus puntos
 *   solucion:   esquema de calificación, uno por apartado (mismo orden)
 *   pista:      ayuda que da el asistente (opcional)
 * Las fórmulas se escriben en LaTeX entre $...$ (en línea) o $$...$$ (bloque).
 */
const t = String.raw;

const TEMAS = {
  1: {
    nombre: "Número y álgebra", color: "#4f46e5",
    subtemas: [
      { codigo: "1.2", nivel: "SL", nombre: "Sucesiones y notación sigma" },
      { codigo: "1.3", nivel: "SL", nombre: "Progresiones geométricas" },
      { codigo: "1.4", nivel: "SL", nombre: "Aplicaciones financieras: interés compuesto y depreciación anual" },
      { codigo: "1.5", nivel: "SL", nombre: "Exponentes y logaritmos" },
      { codigo: "1.6", nivel: "SL", nombre: "Aproximación y estimación" },
      { codigo: "1.7", nivel: "SL", nombre: "Pago de préstamos y amortización" },
      { codigo: "1.8", nivel: "SL", nombre: "Uso de tecnología para resolver sistemas de ecuaciones lineales y ecuaciones polinómicas" },
      { codigo: "1.9", nivel: "HL", nombre: "Leyes de los logaritmos" },
      { codigo: "1.10", nivel: "HL", nombre: "Expresiones con exponentes no enteros" },
      { codigo: "1.11", nivel: "HL", nombre: "Suma de progresiones geométricas infinitas" },
      { codigo: "1.12", nivel: "HL", nombre: "Introducción a los números complejos" },
      { codigo: "1.13", nivel: "HL", nombre: "Números complejos (continuación)" },
      { codigo: "1.14", nivel: "HL", nombre: "Introducción a las matrices" },
      { codigo: "1.15", nivel: "HL", nombre: "Autovalores y autovectores" }
    ]
  },
  2: {
    nombre: "Funciones", color: "#0891b2",
    subtemas: [
      { codigo: "2.1", nivel: "SL", nombre: "Ecuaciones de rectas" },
      { codigo: "2.2", nivel: "SL", nombre: "Concepto de función, dominio y recorrido" },
      { codigo: "2.3", nivel: "SL", nombre: "Gráficas de funciones" },
      { codigo: "2.4", nivel: "SL", nombre: "Características clave de las gráficas" },
      { codigo: "2.5", nivel: "SL", nombre: "Modelos: lineal, cuadrático, exponencial, cúbico y sinusoidal" },
      { codigo: "2.6", nivel: "SL", nombre: "El proceso de modelización" },
      { codigo: "2.7", nivel: "HL", nombre: "Funciones compuestas e inversas" },
      { codigo: "2.8", nivel: "HL", nombre: "Transformaciones de gráficas" },
      { codigo: "2.9", nivel: "HL", nombre: "Otros modelos (logístico, potencial, etc.)" },
      { codigo: "2.10", nivel: "HL", nombre: "Escalas logarítmicas y linealización" }
    ]
  },
  3: {
    nombre: "Geometría y trigonometría", color: "#16a34a",
    subtemas: [
      { codigo: "3.1", nivel: "SL", nombre: "Geometría en 3D: volumen y superficie" },
      { codigo: "3.2", nivel: "SL", nombre: "Trigonometría: teoremas del seno y del coseno" },
      { codigo: "3.3", nivel: "SL", nombre: "Ángulos de elevación, depresión y rumbos" },
      { codigo: "3.4", nivel: "SL", nombre: "Arcos y sectores circulares" },
      { codigo: "3.5", nivel: "SL", nombre: "Mediatrices" },
      { codigo: "3.6", nivel: "SL", nombre: "Diagramas de Voronoi" },
      { codigo: "3.7", nivel: "HL", nombre: "Radianes" },
      { codigo: "3.8", nivel: "HL", nombre: "Circunferencia goniométrica y ecuaciones trigonométricas" },
      { codigo: "3.9", nivel: "HL", nombre: "Transformaciones con matrices" },
      { codigo: "3.10", nivel: "HL", nombre: "Introducción a los vectores" },
      { codigo: "3.11", nivel: "HL", nombre: "Ecuación vectorial de la recta" },
      { codigo: "3.12", nivel: "HL", nombre: "Cinemática vectorial" },
      { codigo: "3.13", nivel: "HL", nombre: "Producto escalar y producto vectorial" },
      { codigo: "3.14", nivel: "HL", nombre: "Teoría de grafos" },
      { codigo: "3.15", nivel: "HL", nombre: "Matrices de adyacencia" },
      { codigo: "3.16", nivel: "HL", nombre: "Algoritmos de árboles y ciclos" }
    ]
  },
  4: {
    nombre: "Estadística y probabilidad", color: "#d97706",
    subtemas: [
      { codigo: "4.1", nivel: "SL", nombre: "Muestreo y recolección de datos" },
      { codigo: "4.2", nivel: "SL", nombre: "Representación de datos" },
      { codigo: "4.3", nivel: "SL", nombre: "Medidas de centralización y dispersión" },
      { codigo: "4.4", nivel: "SL", nombre: "Correlación y regresión lineal" },
      { codigo: "4.5", nivel: "SL", nombre: "Conceptos de probabilidad" },
      { codigo: "4.6", nivel: "SL", nombre: "Diagramas de probabilidad y sucesos combinados" },
      { codigo: "4.7", nivel: "SL", nombre: "Variables aleatorias discretas" },
      { codigo: "4.8", nivel: "SL", nombre: "Distribución binomial" },
      { codigo: "4.9", nivel: "SL", nombre: "Distribución normal" },
      { codigo: "4.10", nivel: "SL", nombre: "Correlación de Spearman" },
      { codigo: "4.11", nivel: "SL", nombre: "Pruebas de hipótesis (χ² y t)" },
      { codigo: "4.12", nivel: "HL", nombre: "Diseño de la recolección de datos y fiabilidad" },
      { codigo: "4.13", nivel: "HL", nombre: "Regresión no lineal" },
      { codigo: "4.14", nivel: "HL", nombre: "Combinaciones lineales de variables aleatorias" },
      { codigo: "4.15", nivel: "HL", nombre: "Teorema central del límite" },
      { codigo: "4.16", nivel: "HL", nombre: "Intervalos de confianza" },
      { codigo: "4.17", nivel: "HL", nombre: "Distribución de Poisson" },
      { codigo: "4.18", nivel: "HL", nombre: "Regiones críticas y errores tipo I y II" },
      { codigo: "4.19", nivel: "HL", nombre: "Cadenas de Markov" }
    ]
  },
  5: {
    nombre: "Cálculo", color: "#db2777",
    subtemas: [
      { codigo: "5.1", nivel: "SL", nombre: "Introducción a límites y derivadas" },
      { codigo: "5.2", nivel: "SL", nombre: "Funciones crecientes y decrecientes" },
      { codigo: "5.3", nivel: "SL", nombre: "Derivada de axⁿ" },
      { codigo: "5.4", nivel: "SL", nombre: "Rectas tangentes y normales" },
      { codigo: "5.5", nivel: "SL", nombre: "Introducción a la integración" },
      { codigo: "5.6", nivel: "SL", nombre: "Puntos estacionarios" },
      { codigo: "5.7", nivel: "SL", nombre: "Optimización" },
      { codigo: "5.8", nivel: "SL", nombre: "Regla del trapecio" },
      { codigo: "5.9", nivel: "HL", nombre: "Otras derivadas: cadena, producto y cociente" },
      { codigo: "5.10", nivel: "HL", nombre: "Segunda derivada" },
      { codigo: "5.11", nivel: "HL", nombre: "Integrales definidas y áreas" },
      { codigo: "5.12", nivel: "HL", nombre: "Cinemática" },
      { codigo: "5.13", nivel: "HL", nombre: "Volúmenes de revolución" },
      { codigo: "5.14", nivel: "HL", nombre: "Ecuaciones diferenciales" },
      { codigo: "5.15", nivel: "HL", nombre: "Campos de pendientes" },
      { codigo: "5.16", nivel: "HL", nombre: "Método de Euler" },
      { codigo: "5.17", nivel: "HL", nombre: "Sistemas acoplados y diagramas de fase" },
      { codigo: "5.18", nivel: "HL", nombre: "Ecuaciones diferenciales de segundo orden" }
    ]
  }
};

const PREGUNTAS = [
  /* ===================== TEMA 1: NÚMERO Y ÁLGEBRA ===================== */
  {
    codigo: "NA-01", subtema: "1.5", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Un grano de polen tiene un diámetro de $0.000\,372$ metros.`,
    partes: [
      { texto: t`Escribe el diámetro en la forma $a \times 10^{k}$, donde $1 \le a < 10$ y $k \in \mathbb{Z}$.`, puntos: 2 },
      { texto: t`Se colocan $5 \times 10^{6}$ granos en fila. Calcula la longitud total de la fila en metros, dando la respuesta en la forma $a \times 10^{k}$.`, puntos: 2 }
    ],
    solucion: [
      t`$3.72 \times 10^{-4}$ m`,
      t`$(3.72 \times 10^{-4})(5 \times 10^{6}) = 18.6 \times 10^{2} = 1.86 \times 10^{3}$ m`
    ],
    pista: t`Cuenta cuántos lugares debes mover la coma para que quede un solo dígito distinto de cero delante. Al multiplicar, multiplica las mantisas y suma los exponentes.`
  },
  {
    codigo: "NA-02", subtema: "1.2", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Un teatro tiene 20 filas de asientos. La primera fila tiene 7 asientos y cada fila tiene 4 asientos más que la anterior.`,
    partes: [
      { texto: t`Halla el número de asientos de la última fila.`, puntos: 2 },
      { texto: t`Halla el número total de asientos del teatro.`, puntos: 2 }
    ],
    solucion: [
      t`$u_{20} = 7 + (20-1)(4) = 83$ asientos`,
      t`$S_{20} = \dfrac{20}{2}(7 + 83) = 900$ asientos`
    ],
    pista: t`Es una progresión aritmética con $u_1 = 7$ y $d = 4$. Usa $u_n = u_1 + (n-1)d$ y $S_n = \frac{n}{2}(u_1 + u_n)$.`
  },
  {
    codigo: "NA-03", subtema: "1.3", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`Un cultivo de bacterias tiene inicialmente 200 bacterias y crece un $15\%$ cada hora.`,
    partes: [
      { texto: t`Calcula el número de bacterias después de 6 horas.`, puntos: 2 },
      { texto: t`Halla el menor número entero de horas necesario para que el cultivo supere las 1000 bacterias.`, puntos: 3 }
    ],
    solucion: [
      t`$200(1.15)^{6} \approx 462.6 \Rightarrow 463$ bacterias`,
      t`$200(1.15)^{n} > 1000 \Rightarrow 1.15^{n} > 5 \Rightarrow n > \dfrac{\ln 5}{\ln 1.15} \approx 11.5$. Respuesta: $12$ horas.`
    ],
    pista: t`Crecer un 15% equivale a multiplicar por $r = 1.15$ cada hora. Para el apartado 2, plantea la desigualdad y resuélvela con la calculadora (tabla o gráfica).`
  },
  {
    codigo: "NA-04", subtema: "1.4", nivel: "SL", paper: 1, dificultad: "media",
    enunciado: t`Lucía invierte 5000 USD a una tasa de interés anual del $4.2\%$ compuesto mensualmente.`,
    partes: [
      { texto: t`Calcula el valor de la inversión después de 5 años, redondeado al dólar.`, puntos: 3 },
      { texto: t`Calcula el interés total ganado.`, puntos: 1 }
    ],
    solucion: [
      t`$FV = 5000\left(1 + \dfrac{0.042}{12}\right)^{60} \approx 6166$ USD (con la calculadora: $N=60$, $I\%=4.2$, $PV=-5000$, $P/Y=C/Y=12$).`,
      t`$6166 - 5000 = 1166$ USD`
    ],
    pista: t`Usa $FV = PV\left(1 + \frac{r}{100k}\right)^{kn}$ con $k = 12$ períodos al año, o el solucionador financiero (TVM) de la calculadora.`
  },
  {
    codigo: "NA-07", subtema: "1.10", nivel: "HL", paper: 1, dificultad: "media",
    enunciado: t`Preguntas sobre exponentes fraccionarios y negativos. Escribe las respuestas sin radicales, usando exponentes negativos cuando sea necesario.`,
    partes: [
      { texto: t`Simplifica $\dfrac{(3a^{2}b^{-1})^{2}}{9a^{-1}b}$.`, puntos: 3 },
      { texto: t`Simplifica $\sqrt[3]{27x^{6}} \cdot x^{-1/2}$.`, puntos: 2 },
      { texto: t`Resuelve la ecuación $25^{x} = \dfrac{1}{5\sqrt{5}}$.`, puntos: 3 }
    ],
    solucion: [
      t`$\dfrac{9a^{4}b^{-2}}{9a^{-1}b} = a^{5}b^{-3}$`,
      t`$3x^{2} \cdot x^{-1/2} = 3x^{3/2}$`,
      t`$5^{2x} = 5^{-3/2} \Rightarrow 2x = -\dfrac{3}{2} \Rightarrow x = -\dfrac{3}{4}$`
    ],
    pista: t`Recuerda: $(x^{m})^{n} = x^{mn}$, $\;x^{m}/x^{n} = x^{m-n}$ y $\sqrt[n]{x} = x^{1/n}$. En la ecuación, escribe ambos lados como potencias de 5.`
  },
  {
    codigo: "NA-08", subtema: "1.9", nivel: "HL", paper: 1, dificultad: "media",
    enunciado: t`En esta pregunta, usa las leyes de los logaritmos.`,
    partes: [
      { texto: t`Calcula el valor exacto de $\log_{2} 48 - \log_{2} 3$.`, puntos: 2 },
      { texto: t`Resuelve $\log_{3}(x+1) + \log_{3}(x-1) = 1$.`, puntos: 4 },
      { texto: t`Expresa $\ln\!\left(\dfrac{x^{3}}{\sqrt{y}}\right)$ en función de $\ln x$ y $\ln y$.`, puntos: 2 }
    ],
    solucion: [
      t`$\log_{2}\dfrac{48}{3} = \log_{2} 16 = 4$`,
      t`$\log_{3}(x^{2}-1) = 1 \Rightarrow x^{2} - 1 = 3 \Rightarrow x = \pm 2$. Como $x - 1 > 0$, solo vale $x = 2$.`,
      t`$3\ln x - \dfrac{1}{2}\ln y$`
    ],
    pista: t`$\log a - \log b = \log\frac{a}{b}$, $\;\log a + \log b = \log(ab)$ y $\log a^{n} = n\log a$. No olvides comprobar que los argumentos sean positivos.`
  },
  {
    codigo: "NA-05", subtema: "1.13", nivel: "HL", paper: 1, dificultad: "media",
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
    ],
    pista: t`$|a + bi| = \sqrt{a^{2} + b^{2}}$ y $\arg z = \arctan\frac{b}{a}$ (si está en el primer cuadrante). En forma exponencial, $(re^{i\theta})^{n} = r^{n}e^{in\theta}$.`
  },
  {
    codigo: "NA-06", subtema: "1.14", nivel: "HL", paper: 2, dificultad: "media",
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
    ],
    pista: t`Para una matriz $2\times2$: $\det = ad - bc$ y $A^{-1} = \frac{1}{\det A}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}$. El sistema es $A\mathbf{x} = \mathbf{b}$, así que $\mathbf{x} = A^{-1}\mathbf{b}$.`
  },

  /* ----- Tema 1: más preguntas por subtema ----- */
  {
    codigo: "NA-09", subtema: "1.10", nivel: "HL", paper: 1, dificultad: "media",
    enunciado: t`Preguntas sobre radicales y exponentes fraccionarios.`,
    partes: [
      { texto: t`Simplifica $\dfrac{6}{\sqrt{3}} + \sqrt{27}$, dando la respuesta en la forma $a\sqrt{3}$, donde $a \in \mathbb{Z}$.`, puntos: 2 },
      { texto: t`Resuelve la ecuación $x\sqrt{2} + 5 = 3x\sqrt{2} - 1$, dando la respuesta en la forma $\dfrac{a\sqrt{b}}{c}$, donde $a, b, c \in \mathbb{Z}$.`, puntos: 3 },
      { texto: t`Sabiendo que $\dfrac{\sqrt[4]{16^{3}}}{2^{-1}} = 2^{k}$, halla el valor de $k$.`, puntos: 2 }
    ],
    solucion: [
      t`$\dfrac{6}{\sqrt{3}} = \dfrac{6\sqrt{3}}{3} = 2\sqrt{3}$ y $\sqrt{27} = 3\sqrt{3}$, así que la suma es $5\sqrt{3}$.`,
      t`$6 = 2x\sqrt{2} \Rightarrow x = \dfrac{3}{\sqrt{2}} = \dfrac{3\sqrt{2}}{2}$`,
      t`$\sqrt[4]{16^{3}} = (2^{4})^{3/4} = 2^{3}$; $\;\dfrac{2^{3}}{2^{-1}} = 2^{4} \Rightarrow k = 4$`
    ],
    pista: t`Para racionalizar, multiplica numerador y denominador por $\sqrt{3}$. En el último apartado escribe todo como potencia de 2: $16 = 2^{4}$ y $\sqrt[4]{a} = a^{1/4}$.`
  },
  {
    codigo: "NA-10", subtema: "1.10", nivel: "HL", paper: 1, dificultad: "dificil",
    enunciado: t`Simplifica las siguientes expresiones. Escribe la respuesta final sin fracciones algebraicas (usa exponentes negativos cuando sea necesario).`,
    partes: [
      { texto: t`$\dfrac{(5a^{-2}b^{3})(-4a^{5}b^{-1})}{10ab^{4}}$`, puntos: 3 },
      { texto: t`$(3m^{2}n^{-1})^{-2}\,(9m^{-1}n^{2})^{3}$`, puntos: 3 },
      { texto: t`$\left(\dfrac{8x^{6}}{27y^{-3}}\right)^{2/3}$`, puntos: 3 }
    ],
    solucion: [
      t`Numerador: $-20a^{3}b^{2}$. Entonces $\dfrac{-20a^{3}b^{2}}{10ab^{4}} = -2a^{2}b^{-2}$`,
      t`$3^{-2}m^{-4}n^{2} \cdot 729m^{-3}n^{6} = 81m^{-7}n^{8}$`,
      t`$\dfrac{8^{2/3}x^{4}}{27^{2/3}y^{-2}} = \dfrac{4x^{4}}{9y^{-2}} = \dfrac{4}{9}x^{4}y^{2}$`
    ],
    pista: t`Trabaja por separado coeficientes, potencias de la primera letra y potencias de la segunda. Recuerda $(x^{m})^{n} = x^{mn}$ y $x^{-n} = \frac{1}{x^{n}}$.`
  },
  {
    codigo: "NA-11", subtema: "1.11", nivel: "HL", paper: 1, dificultad: "media",
    enunciado: t`Considera la progresión geométrica $24,\ 18,\ 13.5,\ \dots$`,
    partes: [
      { texto: t`Halla la razón común $r$.`, puntos: 1 },
      { texto: t`Explica por qué existe la suma de infinitos términos.`, puntos: 1 },
      { texto: t`Halla la suma de infinitos términos.`, puntos: 2 },
      { texto: t`Halla el menor valor de $n$ para el cual $S_n > 95$.`, puntos: 3 }
    ],
    solucion: [
      t`$r = \dfrac{18}{24} = 0.75$`,
      t`Porque $|r| = 0.75 < 1$.`,
      t`$S_\infty = \dfrac{24}{1 - 0.75} = 96$`,
      t`$96(1 - 0.75^{n}) > 95 \Rightarrow 0.75^{n} < \dfrac{1}{96} \Rightarrow n > 15.9$. Por tanto $n = 16$.`
    ],
    pista: t`$S_\infty = \frac{u_1}{1 - r}$ solo existe si $|r| < 1$. Para el último apartado, usa $S_n = \frac{u_1(1 - r^{n})}{1 - r}$ y una tabla en la calculadora.`
  },
  {
    codigo: "NA-12", subtema: "1.11", nivel: "HL", paper: 2, dificultad: "dificil",
    enunciado: t`Se deja caer una pelota desde una altura de $8$ m. Después de cada bote, alcanza el $60\%$ de la altura anterior.`,
    partes: [
      { texto: t`Halla la altura que alcanza la pelota después del tercer bote.`, puntos: 2 },
      { texto: t`Halla la distancia vertical total que recorre la pelota hasta detenerse.`, puntos: 4 }
    ],
    solucion: [
      t`$8(0.6)^{3} = 1.728$ m`,
      t`Bajada inicial: $8$ m. Cada bote sube y baja: $2 \times \dfrac{8(0.6)}{1 - 0.6} = 2 \times 12 = 24$ m. Total $= 8 + 24 = 32$ m.`
    ],
    pista: t`Después de la primera caída, cada altura se recorre dos veces (subida y bajada). Las alturas de los botes forman una progresión geométrica infinita con $u_1 = 4.8$ y $r = 0.6$.`
  },
  {
    codigo: "NA-13", subtema: "1.12", nivel: "HL", paper: 1, dificultad: "facil",
    enunciado: t`Sean $z_1 = 3 - 2i$ y $z_2 = 1 + 4i$.`,
    partes: [
      { texto: t`Halla $z_1 + z_2$.`, puntos: 1 },
      { texto: t`Halla $z_1 z_2$ en la forma $a + bi$.`, puntos: 2 },
      { texto: t`Halla $\dfrac{z_1}{z_2}$ en la forma $a + bi$.`, puntos: 3 },
      { texto: t`Resuelve la ecuación $z^{2} + 4z + 13 = 0$.`, puntos: 2 }
    ],
    solucion: [
      t`$4 + 2i$`,
      t`$3 + 12i - 2i - 8i^{2} = 11 + 10i$`,
      t`$\dfrac{(3 - 2i)(1 - 4i)}{(1 + 4i)(1 - 4i)} = \dfrac{-5 - 14i}{17} = -\dfrac{5}{17} - \dfrac{14}{17}i$`,
      t`$z = \dfrac{-4 \pm \sqrt{16 - 52}}{2} = \dfrac{-4 \pm 6i}{2} = -2 \pm 3i$`
    ],
    pista: t`Recuerda que $i^{2} = -1$. Para dividir, multiplica numerador y denominador por el conjugado del denominador, $1 - 4i$.`
  },
  {
    codigo: "NA-14", subtema: "1.13", nivel: "HL", paper: 2, dificultad: "dificil",
    enunciado: t`En un circuito de corriente alterna, dos voltajes se representan con los números complejos $V_1 = 10e^{i0}$ y $V_2 = 10e^{i\pi/3}$.`,
    partes: [
      { texto: t`Escribe $V_2$ en la forma $a + bi$.`, puntos: 2 },
      { texto: t`Halla el voltaje total $V = V_1 + V_2$ en la forma $a + bi$.`, puntos: 1 },
      { texto: t`Halla la amplitud $|V|$ y la fase $\arg V$ del voltaje total.`, puntos: 3 }
    ],
    solucion: [
      t`$V_2 = 10\left(\cos\dfrac{\pi}{3} + i\sin\dfrac{\pi}{3}\right) = 5 + 5\sqrt{3}\,i$`,
      t`$V = 15 + 5\sqrt{3}\,i$`,
      t`$|V| = \sqrt{225 + 75} = 10\sqrt{3} \approx 17.3$; $\;\arg V = \arctan\dfrac{5\sqrt{3}}{15} = \dfrac{\pi}{6}$`
    ],
    pista: t`$re^{i\theta} = r(\cos\theta + i\sin\theta)$. Suma partes reales e imaginarias por separado y luego vuelve a la forma polar.`
  },
  {
    codigo: "NA-15", subtema: "1.14", nivel: "HL", paper: 1, dificultad: "media",
    enunciado: t`Una tienda vende camisetas a $c$ dólares y gorras a $g$ dólares. Ana paga 61 dólares por 3 camisetas y 2 gorras. Luis paga 47 dólares por 1 camiseta y 4 gorras.`,
    partes: [
      { texto: t`Escribe esta información como una ecuación matricial $A\mathbf{x} = \mathbf{b}$.`, puntos: 2 },
      { texto: t`Halla $A^{-1}$.`, puntos: 2 },
      { texto: t`Halla el precio de una camiseta y el de una gorra.`, puntos: 2 }
    ],
    solucion: [
      t`$\begin{pmatrix} 3 & 2 \\ 1 & 4 \end{pmatrix}\begin{pmatrix} c \\ g \end{pmatrix} = \begin{pmatrix} 61 \\ 47 \end{pmatrix}$`,
      t`$\det A = 10$, $\;A^{-1} = \dfrac{1}{10}\begin{pmatrix} 4 & -2 \\ -1 & 3 \end{pmatrix}$`,
      t`$\begin{pmatrix} c \\ g \end{pmatrix} = \dfrac{1}{10}\begin{pmatrix} 4 & -2 \\ -1 & 3 \end{pmatrix}\begin{pmatrix} 61 \\ 47 \end{pmatrix} = \begin{pmatrix} 15 \\ 8 \end{pmatrix}$: camiseta 15 USD, gorra 8 USD.`
    ],
    pista: t`Cada fila de $A$ son las cantidades que compra una persona. Luego $\mathbf{x} = A^{-1}\mathbf{b}$.`
  },
  {
    codigo: "NA-16", subtema: "1.15", nivel: "HL", paper: 2, dificultad: "dificil",
    enunciado: t`Dos compañías telefónicas, $X$ e $Y$, compiten por clientes. Cada año, el $80\%$ de los clientes de $X$ se queda en $X$ y el $30\%$ de los clientes de $Y$ se cambia a $X$. La matriz de transición es $M = \begin{pmatrix} 0.8 & 0.3 \\ 0.2 & 0.7 \end{pmatrix}$.`,
    partes: [
      { texto: t`Halla la ecuación característica de $M$ y sus autovalores.`, puntos: 3 },
      { texto: t`Halla un autovector asociado a cada autovalor.`, puntos: 3 },
      { texto: t`A largo plazo, ¿qué proporción de clientes tendrá cada compañía?`, puntos: 2 }
    ],
    solucion: [
      t`$\lambda^{2} - 1.5\lambda + 0.5 = 0 \Rightarrow \lambda = 1$ y $\lambda = 0.5$`,
      t`Para $\lambda = 1$: $\begin{pmatrix} 3 \\ 2 \end{pmatrix}$. Para $\lambda = 0.5$: $\begin{pmatrix} 1 \\ -1 \end{pmatrix}$.`,
      t`El estado estable es proporcional a $\begin{pmatrix} 3 \\ 2 \end{pmatrix}$: $X$ tendrá el $60\%$ e $Y$ el $40\%$.`
    ],
    pista: t`La ecuación característica es $\det(M - \lambda I) = 0$. El estado a largo plazo es el autovector del autovalor $\lambda = 1$, escalado para que sus componentes sumen 1.`
  },
  {
    codigo: "NA-17", subtema: "1.9", nivel: "HL", paper: 1, dificultad: "dificil",
    enunciado: t`Preguntas sobre ecuaciones exponenciales y logarítmicas.`,
    partes: [
      { texto: t`Demuestra que la solución de $2^{x+1} = 5^{x}$ es $x = \dfrac{\ln 2}{\ln 2.5}$.`, puntos: 3 },
      { texto: t`Halla el valor de $x$ con tres cifras significativas.`, puntos: 1 },
      { texto: t`Resuelve $\log_{2} x + \log_{4} x = 6$.`, puntos: 3 }
    ],
    solucion: [
      t`$(x + 1)\ln 2 = x\ln 5 \Rightarrow \ln 2 = x(\ln 5 - \ln 2) = x\ln 2.5 \Rightarrow x = \dfrac{\ln 2}{\ln 2.5}$`,
      t`$x \approx 0.756$`,
      t`$\log_{4} x = \dfrac{\log_{2} x}{2}$, así que $\dfrac{3}{2}\log_{2} x = 6 \Rightarrow \log_{2} x = 4 \Rightarrow x = 16$`
    ],
    pista: t`Aplica $\ln$ en ambos lados y usa $\ln a^{n} = n\ln a$. En el último apartado cambia de base: $\log_{4} x = \frac{\log_{2} x}{\log_{2} 4}$.`
  },
  {
    codigo: "NA-18", subtema: "1.2", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Preguntas sobre notación sigma.`,
    partes: [
      { texto: t`Calcula $\displaystyle\sum_{k=1}^{20}(3k + 2)$.`, puntos: 2 },
      { texto: t`Escribe la suma $5 + 9 + 13 + \dots + 81$ en notación sigma.`, puntos: 2 },
      { texto: t`Halla el valor de la suma del apartado anterior.`, puntos: 2 }
    ],
    solucion: [
      t`Es aritmética con $u_1 = 5$ y $u_{20} = 62$: $\dfrac{20}{2}(5 + 62) = 670$`,
      t`$\displaystyle\sum_{k=1}^{20}(4k + 1)$`,
      t`$\dfrac{20}{2}(5 + 81) = 860$`
    ],
    pista: t`Escribe los primeros términos para ver el patrón. El término general de una progresión aritmética es $u_1 + (k-1)d$.`
  },
  {
    codigo: "NA-19", subtema: "1.2", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`En una progresión aritmética, el tercer término es $11$ y el octavo término es $31$.`,
    partes: [
      { texto: t`Halla la diferencia común y el primer término.`, puntos: 3 },
      { texto: t`Demuestra que $S_n = n(2n + 1)$.`, puntos: 2 },
      { texto: t`Halla el menor valor de $n$ para el cual $S_n > 500$.`, puntos: 2 }
    ],
    solucion: [
      t`$5d = 31 - 11 = 20 \Rightarrow d = 4$; $\;u_1 = 11 - 2(4) = 3$`,
      t`$S_n = \dfrac{n}{2}[2(3) + (n-1)4] = \dfrac{n}{2}(4n + 2) = n(2n + 1)$`,
      t`$n(2n + 1) > 500 \Rightarrow n > 15.6$, así que $n = 16$ (pues $S_{15} = 465$ y $S_{16} = 528$).`
    ],
    pista: t`Plantea $u_1 + 2d = 11$ y $u_1 + 7d = 31$ y réstalas. Para el último apartado, usa la tabla de la calculadora.`
  },
  {
    codigo: "NA-20", subtema: "1.3", nivel: "SL", paper: 1, dificultad: "media",
    enunciado: t`En una progresión geométrica, $u_2 = 12$ y $u_5 = 96$.`,
    partes: [
      { texto: t`Halla la razón común.`, puntos: 2 },
      { texto: t`Halla el primer término.`, puntos: 1 },
      { texto: t`Halla la suma de los 10 primeros términos.`, puntos: 2 }
    ],
    solucion: [
      t`$r^{3} = \dfrac{96}{12} = 8 \Rightarrow r = 2$`,
      t`$u_1 = \dfrac{12}{2} = 6$`,
      t`$S_{10} = \dfrac{6(2^{10} - 1)}{2 - 1} = 6138$`
    ],
    pista: t`$u_5 = u_2 \cdot r^{3}$. Después usa $S_n = \frac{u_1(r^{n} - 1)}{r - 1}$.`
  },
  {
    codigo: "NA-21", subtema: "1.4", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`Un automóvil cuesta 24 000 USD y se deprecia un $15\%$ cada año.`,
    partes: [
      { texto: t`Calcula el valor del automóvil después de 4 años.`, puntos: 2 },
      { texto: t`Halla después de cuántos años completos el valor será inferior a 10 000 USD por primera vez.`, puntos: 3 }
    ],
    solucion: [
      t`$24\,000(0.85)^{4} \approx 12\,528.15$ USD`,
      t`$24\,000(0.85)^{n} < 10\,000 \Rightarrow n > 5.39$, así que después de $6$ años.`
    ],
    pista: t`Depreciar un 15% equivale a multiplicar por $0.85$ cada año: $V = V_0(1 - \frac{r}{100})^{n}$.`
  },
  {
    codigo: "NA-22", subtema: "1.5", nivel: "SL", paper: 1, dificultad: "media",
    enunciado: t`Preguntas sobre exponentes y logaritmos.`,
    partes: [
      { texto: t`Resuelve $10^{x} = 250$, dando la respuesta con tres cifras significativas.`, puntos: 2 },
      { texto: t`Calcula, sin usar calculadora, $\log_{2} 32 + \log_{10} 0.01$.`, puntos: 2 },
      { texto: t`Una población crece según $P(t) = 500e^{0.04t}$, con $t$ en años. Halla cuánto tarda en duplicarse.`, puntos: 3 }
    ],
    solucion: [
      t`$x = \log_{10} 250 \approx 2.40$`,
      t`$5 + (-2) = 3$`,
      t`$e^{0.04t} = 2 \Rightarrow t = \dfrac{\ln 2}{0.04} \approx 17.3$ años`
    ],
    pista: t`$a^{x} = b \Leftrightarrow x = \log_{a} b$. Para duplicar, iguala $P(t) = 1000$ y aplica $\ln$.`
  },
  {
    codigo: "NA-23", subtema: "1.6", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Una caja tiene forma de prisma rectangular de dimensiones $12.4$ cm, $8.7$ cm y $5.2$ cm.`,
    partes: [
      { texto: t`Calcula el volumen exacto de la caja.`, puntos: 1 },
      { texto: t`Escribe el volumen redondeado a tres cifras significativas.`, puntos: 1 },
      { texto: t`Para estimar el volumen, Pedro redondea cada medida al entero más cercano. Halla su estimación.`, puntos: 1 },
      { texto: t`Halla el porcentaje de error de la estimación de Pedro.`, puntos: 2 }
    ],
    solucion: [
      t`$12.4 \times 8.7 \times 5.2 = 560.976$ cm$^{3}$`,
      t`$561$ cm$^{3}$`,
      t`$12 \times 9 \times 5 = 540$ cm$^{3}$`,
      t`$\left|\dfrac{540 - 560.976}{560.976}\right| \times 100\% \approx 3.74\%$`
    ],
    pista: t`Porcentaje de error $= \left|\frac{v_A - v_E}{v_E}\right| \times 100\%$, donde $v_A$ es el valor aproximado y $v_E$ el exacto.`
  },
  {
    codigo: "NA-24", subtema: "1.7", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`Carla pide un préstamo de 15 000 USD a una tasa de interés anual del $6\%$ compuesto mensualmente. Lo devolverá en 5 años con pagos mensuales iguales al final de cada mes.`,
    partes: [
      { texto: t`Calcula el pago mensual.`, puntos: 3 },
      { texto: t`Calcula la cantidad total que pagará Carla.`, puntos: 1 },
      { texto: t`Calcula el interés total pagado.`, puntos: 1 }
    ],
    solucion: [
      t`Con el TVM: $N = 60$, $I\% = 6$, $PV = 15\,000$, $FV = 0$, $P/Y = C/Y = 12$ $\Rightarrow PMT \approx 289.99$ USD`,
      t`$60 \times 289.99 = 17\,399.40$ USD`,
      t`$17\,399.40 - 15\,000 = 2\,399.40$ USD`
    ],
    pista: t`Usa el solucionador financiero (TVM) de la calculadora: el préstamo es $PV$ positivo, el saldo final $FV = 0$ y busca $PMT$.`
  },
  {
    codigo: "NA-25", subtema: "1.8", nivel: "SL", paper: 1, dificultad: "media",
    enunciado: t`Usa la calculadora gráfica para resolver las siguientes ecuaciones.`,
    partes: [
      { texto: t`Resuelve el sistema $\begin{cases} x + y + z = 6 \\ 2x - y + 3z = 9 \\ x + 2y - z = 2 \end{cases}$`, puntos: 3 },
      { texto: t`Resuelve la ecuación $2x^{3} - 3x^{2} - 11x + 6 = 0$.`, puntos: 3 }
    ],
    solucion: [
      t`$x = 1,\ y = 2,\ z = 3$`,
      t`$x = -2,\ x = \dfrac{1}{2},\ x = 3$`
    ],
    pista: t`Usa el solucionador de sistemas lineales (3 ecuaciones, 3 incógnitas) y el solucionador de polinomios de grado 3 de la calculadora. Comprueba sustituyendo.`
  },

  /* ===================== TEMA 2: FUNCIONES ===================== */
  {
    codigo: "FU-01", subtema: "2.1", nivel: "SL", paper: 1, dificultad: "facil",
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
    ],
    pista: t`$m = \frac{y_2 - y_1}{x_2 - x_1}$. Dos rectas perpendiculares cumplen $m_1 \cdot m_2 = -1$.`
  },
  {
    codigo: "FU-02", subtema: "2.5", nivel: "SL", paper: 2, dificultad: "media",
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
    ],
    pista: t`El vértice de $y = ax^{2} + bx + c$ está en $x = -\frac{b}{2a}$. La pelota llega al suelo cuando $h(t) = 0$.`
  },
  {
    codigo: "FU-03", subtema: "2.5", nivel: "SL", paper: 2, dificultad: "media",
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
    ],
    pista: t`Cuando $t \to \infty$, $e^{-0.05t} \to 0$. Para el tiempo, despeja la exponencial y aplica $\ln$ en ambos lados.`
  },
  {
    codigo: "FU-04", subtema: "2.5", nivel: "SL", paper: 2, dificultad: "dificil",
    enunciado: t`La profundidad del agua en un puerto, en metros, $t$ horas después de la medianoche, se modela con $d(t) = 3\sin(30t)^\circ + 5$, para $0 \le t \le 24$.`,
    partes: [
      { texto: t`Halla el período y la amplitud de $d$.`, puntos: 2 },
      { texto: t`Halla la profundidad máxima y la primera hora a la que ocurre.`, puntos: 2 },
      { texto: t`Un barco necesita al menos $6.5$ m de profundidad. Halla el intervalo de tiempo, durante las primeras 12 horas, en que el barco puede entrar al puerto.`, puntos: 3 }
    ],
    solucion: [
      t`Período $= \dfrac{360^\circ}{30^\circ} = 12$ h; amplitud $= 3$ m`,
      t`Máximo $= 8$ m cuando $30t = 90 \Rightarrow t = 3$ (a las 3:00)`,
      t`$\sin(30t)^\circ \ge 0.5 \Rightarrow 30 \le 30t \le 150 \Rightarrow 1 \le t \le 5$ (de 1:00 a 5:00)`
    ],
    pista: t`Para $a\sin(bx) + d$: amplitud $= |a|$, período $= \frac{360^\circ}{b}$ y eje principal $y = d$. Dibuja la gráfica y la recta $y = 6.5$ en la calculadora.`
  },

  /* ============== TEMA 3: GEOMETRÍA Y TRIGONOMETRÍA ============== */
  {
    codigo: "GT-03", subtema: "3.1", nivel: "SL", paper: 1, dificultad: "facil",
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
    ],
    pista: t`$V = \frac{1}{3}\pi r^{2}h$. La generatriz, el radio y la altura forman un triángulo rectángulo. Superficie total $= \pi r^{2} + \pi r l$.`
  },
  {
    codigo: "GT-01", subtema: "3.2", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Una escalera de 6 m está apoyada en una pared vertical y forma un ángulo de $70^\circ$ con el suelo horizontal.`,
    partes: [
      { texto: t`Halla la altura a la que la escalera toca la pared.`, puntos: 2 },
      { texto: t`Halla la distancia del pie de la escalera a la pared.`, puntos: 2 }
    ],
    solucion: [
      t`$6\sin 70^\circ \approx 5.64$ m`,
      t`$6\cos 70^\circ \approx 2.05$ m`
    ],
    pista: t`La escalera es la hipotenusa. La altura es el cateto opuesto al ángulo de $70^\circ$ y la distancia al pie es el cateto contiguo.`
  },
  {
    codigo: "GT-02", subtema: "3.2", nivel: "SL", paper: 2, dificultad: "media",
    enunciado: t`En el triángulo $ABC$, $AC = 8$ cm, $BC = 11$ cm y $A\hat{C}B = 50^\circ$.`,
    partes: [
      { texto: t`Halla $AB$.`, puntos: 3 },
      { texto: t`Halla el área del triángulo $ABC$.`, puntos: 2 }
    ],
    solucion: [
      t`$AB^{2} = 8^{2} + 11^{2} - 2(8)(11)\cos 50^\circ \approx 71.87 \Rightarrow AB \approx 8.48$ cm`,
      t`$\text{Área} = \tfrac{1}{2}(8)(11)\sin 50^\circ \approx 33.7$ cm$^{2}$`
    ],
    pista: t`Conoces dos lados y el ángulo comprendido: usa el teorema del coseno $c^{2} = a^{2} + b^{2} - 2ab\cos C$ y el área $\frac{1}{2}ab\sin C$.`
  },
  {
    codigo: "GT-04", subtema: "3.5", nivel: "SL", paper: 1, dificultad: "media",
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
    ],
    pista: t`La mediatriz pasa por el punto medio y es perpendicular al segmento: su pendiente es la recíproca opuesta de $m_{AB}$.`
  },
  {
    codigo: "GT-05", subtema: "3.7", nivel: "HL", paper: 1, dificultad: "facil",
    enunciado: t`Un sector circular tiene radio $10$ cm y ángulo central $1.2$ radianes.`,
    partes: [
      { texto: t`Halla la longitud del arco.`, puntos: 2 },
      { texto: t`Halla el área del sector.`, puntos: 2 }
    ],
    solucion: [
      t`$s = r\theta = 10(1.2) = 12$ cm`,
      t`$A = \tfrac{1}{2}r^{2}\theta = \tfrac{1}{2}(100)(1.2) = 60$ cm$^{2}$`
    ],
    pista: t`En radianes: longitud de arco $s = r\theta$ y área del sector $A = \frac{1}{2}r^{2}\theta$.`
  },

  /* ============== TEMA 4: ESTADÍSTICA Y PROBABILIDAD ============== */
  {
    codigo: "EP-01", subtema: "4.3", nivel: "SL", paper: 1, dificultad: "facil",
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
    ],
    pista: t`Los datos ya están ordenados: la mediana es el valor central (el 4.º de 7). La moda es el valor que más se repite.`
  },
  {
    codigo: "EP-05", subtema: "4.4", nivel: "SL", paper: 1, dificultad: "facil",
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
    ],
    pista: t`Un $r$ cercano a $1$ indica correlación positiva fuerte. La pendiente indica cuánto cambia $y$ cuando $x$ aumenta en una unidad.`
  },
  {
    codigo: "EP-02", subtema: "4.6", nivel: "SL", paper: 1, dificultad: "media",
    enunciado: t`Una urna contiene 5 bolas rojas y 3 azules. Se extraen dos bolas al azar, una tras otra, sin reemplazo.`,
    partes: [
      { texto: t`Halla la probabilidad de que ambas bolas sean rojas.`, puntos: 2 },
      { texto: t`Halla la probabilidad de que las bolas sean de distinto color.`, puntos: 3 }
    ],
    solucion: [
      t`$\dfrac{5}{8}\cdot\dfrac{4}{7} = \dfrac{5}{14}$`,
      t`$\dfrac{5}{8}\cdot\dfrac{3}{7} + \dfrac{3}{8}\cdot\dfrac{5}{7} = \dfrac{30}{56} = \dfrac{15}{28}$`
    ],
    pista: t`Dibuja un diagrama de árbol. Sin reemplazo, en la segunda extracción quedan 7 bolas. "Distinto color" puede ocurrir de dos formas: RA o AR.`
  },
  {
    codigo: "EP-04", subtema: "4.8", nivel: "SL", paper: 2, dificultad: "media",
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
    ],
    pista: t`$X \sim B(10,\ 0.3)$. Usa binompdf para "exactamente" y binomcdf para "como máximo". $P(X \ge 2) = 1 - P(X \le 1)$.`
  },
  {
    codigo: "EP-03", subtema: "4.9", nivel: "SL", paper: 2, dificultad: "media",
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
    ],
    pista: t`$X \sim N(170,\ 8^{2})$. Usa normalcdf para probabilidades e invNorm para hallar $k$ (área a la izquierda $= 0.9$).`
  },
  {
    codigo: "EP-06", subtema: "4.11", nivel: "SL", paper: 2, dificultad: "dificil",
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
    ],
    pista: t`$H_0$ siempre afirma independencia. Grados de libertad $= (\text{filas} - 1)(\text{columnas} - 1)$. Si $p <$ nivel de significación, se rechaza $H_0$.`
  },

  /* ===================== TEMA 5: CÁLCULO ===================== */
  {
    codigo: "CA-02", subtema: "5.4", nivel: "SL", paper: 1, dificultad: "facil",
    enunciado: t`Considera la curva $y = x^{2} + 3x$.`,
    partes: [
      { texto: t`Halla la pendiente de la curva en $x = 2$.`, puntos: 2 },
      { texto: t`Halla la ecuación de la recta tangente en $x = 2$.`, puntos: 2 }
    ],
    solucion: [
      t`$\dfrac{dy}{dx} = 2x + 3 \Rightarrow$ en $x = 2$, la pendiente es $7$`,
      t`Punto $(2, 10)$: $y - 10 = 7(x - 2) \Rightarrow y = 7x - 4$`
    ],
    pista: t`La pendiente de la tangente es el valor de la derivada en ese punto. Después usa $y - y_1 = m(x - x_1)$.`
  },
  {
    codigo: "CA-01", subtema: "5.6", nivel: "SL", paper: 1, dificultad: "media",
    enunciado: t`Considera la función $f(x) = x^{3} - 6x^{2} + 9x + 1$.`,
    partes: [
      { texto: t`Halla $f'(x)$.`, puntos: 2 },
      { texto: t`Halla las coordenadas de los puntos estacionarios y determina su naturaleza.`, puntos: 4 }
    ],
    solucion: [
      t`$f'(x) = 3x^{2} - 12x + 9$`,
      t`$3(x-1)(x-3) = 0 \Rightarrow x = 1, 3$. Máximo local en $(1, 5)$ y mínimo local en $(3, 1)$ (el signo de $f'$ cambia de $+$ a $-$ en $x=1$ y de $-$ a $+$ en $x=3$).`
    ],
    pista: t`Los puntos estacionarios cumplen $f'(x) = 0$. Estudia el signo de $f'$ a ambos lados de cada punto para saber si es máximo o mínimo.`
  },
  {
    codigo: "CA-04", subtema: "5.7", nivel: "SL", paper: 2, dificultad: "dificil",
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
    ],
    pista: t`Haz un dibujo: al recortar $x$ en cada esquina, cada lado de la base pierde $2x$. Para maximizar, resuelve $V'(x) = 0$ en el intervalo $0 < x < 6$.`
  },
  {
    codigo: "CA-03", subtema: "5.8", nivel: "SL", paper: 2, dificultad: "media",
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
    ],
    pista: t`La curva corta al eje $x$ en $x = \pm 2$, así que $h = \frac{4}{4} = 1$. Regla del trapecio: $\frac{h}{2}[y_0 + y_n + 2(y_1 + \dots + y_{n-1})]$.`
  },
  {
    codigo: "CA-05", subtema: "5.12", nivel: "HL", paper: 2, dificultad: "media",
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
    ],
    pista: t`La aceleración es la derivada de la velocidad y el desplazamiento es la integral de la velocidad. La velocidad es máxima cuando $a = 0$.`
  },
  {
    codigo: "CA-06", subtema: "5.16", nivel: "HL", paper: 3, dificultad: "dificil",
    enunciado: t`Considera la ecuación diferencial $\dfrac{dy}{dx} = x + y$, con $y(0) = 1$.`,
    partes: [
      { texto: t`Usa el método de Euler con paso $h = 0.1$ para estimar $y(0.2)$.`, puntos: 4 },
      { texto: t`Verifica que $y = 2e^{x} - x - 1$ es la solución exacta y halla el porcentaje de error de la estimación.`, puntos: 4 }
    ],
    solucion: [
      t`$y_1 = 1 + 0.1(0 + 1) = 1.1$; $\;y_2 = 1.1 + 0.1(0.1 + 1.1) = 1.22$. Por tanto $y(0.2) \approx 1.22$.`,
      t`$y' = 2e^{x} - 1$ y $x + y = 2e^{x} - 1$ ✓; $y(0) = 2 - 0 - 1 = 1$ ✓. Exacta: $y(0.2) = 2e^{0.2} - 1.2 \approx 1.2428$. Error $\approx \dfrac{0.0228}{1.2428} \times 100\% \approx 1.84\%$.`
    ],
    pista: t`Método de Euler: $y_{n+1} = y_n + h\,f(x_n, y_n)$ y $x_{n+1} = x_n + h$. Necesitas dos pasos para llegar de $x = 0$ a $x = 0.2$.`
  }
];
