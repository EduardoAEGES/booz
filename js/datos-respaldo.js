/* Copia de respaldo del banco de preguntas: se usa solo si no hay conexión con Supabase.
 * Para actualizarla, en modo MASTER usa Ajustes → Descargar datos-respaldo.js y reemplaza este archivo. */
window.DATOS_RESPALDO = {
 "version": 1,
 "ajustes": {
  "sitio": "BOOZ IB",
  "materia": "Matemáticas: Aplicaciones e Interpretación (AI)",
  "materiaCorta": "Matemáticas AI",
  "logo": "img/logo.jpg",
  "acento": "#0b84c6"
 },
 "temas": [
  {
   "id": "t-ejemplo-1",
   "numero": 1,
   "nombre": "Álgebra básica",
   "color": "#4f46e5",
   "subtemas": [
    {
     "id": "s-ejemplo-1-1",
     "codigo": "1.1",
     "nombre": "Ecuaciones de primer grado"
    },
    {
     "id": "s-ejemplo-1-2",
     "codigo": "1.2",
     "nombre": "Funciones lineales"
    }
   ]
  }
 ],
 "preguntas": [
  {
   "id": "q-ejemplo-1",
   "subtema": "s-ejemplo-1-1",
   "paper": null,
   "dificultad": "facil",
   "enunciado": "Resuelve las siguientes ecuaciones.",
   "imagen": "",
   "pista": "Deja la $x$ sola: lo que suma pasa restando y lo que multiplica pasa dividiendo.",
   "partes": [
    {
     "tipo": "abierta",
     "texto": "$2x + 5 = 13$",
     "puntos": 2,
     "respuestas": [
      "4"
     ],
     "solucion": "$2x = 13 - 5 = 8 \\Rightarrow x = \\dfrac{8}{2} = 4$"
    },
    {
     "tipo": "abierta",
     "texto": "$3(x - 2) = 12$",
     "puntos": 2,
     "respuestas": [
      "6"
     ],
     "solucion": "$x - 2 = \\dfrac{12}{3} = 4 \\Rightarrow x = 6$"
    }
   ]
  },
  {
   "id": "q-ejemplo-2",
   "subtema": "s-ejemplo-1-1",
   "paper": null,
   "dificultad": "facil",
   "enunciado": "Elige la respuesta correcta.",
   "imagen": "",
   "pista": "Comprueba cada alternativa sustituyendo el valor de $x$ en la ecuación.",
   "partes": [
    {
     "tipo": "multiple",
     "texto": "¿Cuál es la solución de $x - 7 = 3$?",
     "puntos": 1,
     "opciones": [
      "$x = 4$",
      "$x = 10$",
      "$x = -4$",
      "$x = 21$"
     ],
     "correcta": 1,
     "solucion": "Sumamos 7 a los dos lados: $x = 3 + 7 = 10$."
    },
    {
     "tipo": "multiple",
     "texto": "Si $\\dfrac{x}{4} = 5$, ¿cuánto vale $x$?",
     "puntos": 1,
     "opciones": [
      "$20$",
      "$\\dfrac{5}{4}$",
      "$9$",
      "$1$"
     ],
     "correcta": 0,
     "solucion": "Multiplicamos los dos lados por 4: $x = 5 \\cdot 4 = 20$."
    }
   ]
  },
  {
   "id": "q-ejemplo-3",
   "subtema": "s-ejemplo-1-1",
   "paper": null,
   "dificultad": "media",
   "enunciado": "Caso práctico: Ana tiene el doble de edad que su hermano Luis. Entre los dos suman 36 años.",
   "imagen": "",
   "pista": "Si Luis tiene $x$ años, Ana tiene $2x$ años.",
   "partes": [
    {
     "tipo": "abierta",
     "texto": "Escribe una ecuación usando $x$ para la edad de Luis.",
     "puntos": 2,
     "respuestas": [
      "x + 2x = 36"
     ],
     "solucion": "$x + 2x = 36$"
    },
    {
     "tipo": "abierta",
     "texto": "Halla la edad de cada uno.",
     "puntos": 2,
     "respuestas": [
      "12; 24"
     ],
     "solucion": "$3x = 36 \\Rightarrow x = 12$. Luis tiene 12 años y Ana 24 años."
    }
   ]
  },
  {
   "id": "q-ejemplo-4",
   "subtema": "s-ejemplo-1-2",
   "paper": null,
   "dificultad": "facil",
   "enunciado": "Observa la gráfica de la función $f(x) = 2x + 1$.",
   "imagen": "",
   "grafico": {
    "app": "graphing",
    "base64": "UEsDBBQAAAAIAIoxUl0x3fnrEwUAAL0lAAAXAAAAZ2VvZ2VicmFfZGVmYXVsdHMyZC54bWztWlFT4zYQfu79Co+f2gcS24lJcoPvhruZTpnhuJvCdPqq2IqjokiuJBOHX9+15NiCEAhOCKEHD8irSCvt961XK8knn4sZdW6wkISzyPU7nutgFvOEsDRyczU5GrqfP304STFP8VggZ8LFDKnIDcuWdb+w0++MAq+sQ1kWualA2RRUuE5GkSr7RO7cdQpJPjJ+gWZYZijGl/EUz9A5j5HSWqZKZfJjtzufzzvLATtcpF3QKbuFTLppqjpQgqYZZTJyq4ePoNh0r3rPe7pf4Hl+9+9v52agI8KkQizGLhiU4AnKqZLwiCmeYaYctchw5GacMOU6FI0xjdwfpeT8OhEY/+Y6VSfAyQMdv5zIKZ87fPwPjqFOiRzX/bTQLdvAz185ZcIRkRv4rgOw+h6UYyhHAeBFsymKXM+0pmiBhXODQEVVg3LFY61A104QlZVmPdQ3nmDzS79qzwgQBHg6UmGgwuvAYMY0eAA6FppaS4+2+JLcVnpCu1YtaFVdTSfmXCTSKSL3Al24zqIqb00JTU66FZ6bIZvgDLMEGt2B128Frw+0GHxHBl8/fHl83yC6xz8bujDzF4D3O7NBDd5MRDhgjz1jf+IUZmoD23sHdte+2v/fQKpRMuDJ8n/kxnyWUVzsF3FKWIPeuRZqtIN2uYIJtvAfoC7Tqv2lCTDaQ1CXNhrQ1JTE1wxLSMBgCag7lQ9/kASWG00XhxSPKEDRHwyNBvwvu0MVAaYItNka/knO4tKWGtKvubixOej1vddgodH5TG/fNQWBp0dcj6DEaSnVaFwu5caN2+Vke3bj13ZinitaDnrGFOyNACSYmlyx5Rrj7AoG+s6uBGKy3B/ddxjYqQg7RlU8VHNgVcxb/WmLt0igxWP8h+/875H/HURDdoNEzY7NZLuMymYyCK3cvwOu8Sp0PmNBsM1vl/28bUfeymGO27365aLzIGadwcE5zA0YxRvj/6rEJoF4E0ncy0e/B/JtWKewJIjtYNtCF6n1zv5YyjULA8PCtmnQYzxaaG269+n4nvnz+yPP94/hKODAvLtE9s4WpYTWVDTYmvxuexc58Hfk6Y1Ou9RrPfoxZyRutiZGqnHvv0eWDfIqTFLMTJCG4OJpHQsoQPOtkQpfSwsoQLrVhe4KdghSOKem9alpdhqYomeKvinCCq8nuMzAP6xM+d5S0W+3UXoLEWYXoXdP+fOhOAzLZ1hYr//FUq79JTQBAOaf3z2PkpQkQO+MAJRHgPEMwapa5t1jyWmu4PoMbqVYc31mnGxOEjUt8Yb5TUiBkyVyzpQLcsuZqoFySh89pfqe7WmWwR/XJ5cbBad1brzeaRv3bLXuIZbS5r07NVIDvDmy141WTwMf5wMmouk47gTDnj8Me97AH4zC4fGG9PjDhh7zw5bsrHsHgbUm1oa9ClYRN4eikNrug8Dl6uv5g37YC0ZB6I9GfXiwZ77VHu/3uqLZubS8px1q+8sCAOhBeNjxwZ9mfqXpi53uUR7nsjmfNlINErhiu5x4W5R2vjqhvCCUILFY1b9lfrIeW4WLJhm40oL1mcABJnfrTQGw02ZqZ0ayLuWNMRMCKDL4hgPOCPQghH1B8XUqeM4qn7aT6Z2YXq0xh7OjGnNOMex5l8Z8WcrWhfDKur4Olmp9ftmQ9CQ08I1MfD3mxZ1l6YlbL9m4/rkWrGvbB1x/E0OXHxncd4GjV/KBNkdtz7x4fDADsWHvWl8rdZdfRn368B9QSwMEFAAAAAgAijFSXYJHRTRjAwAABxEAABcAAABnZW9nZWJyYV9kZWZhdWx0czNkLnhtbO2YzXLTMBCAz/AUGt2J7cRO604Nk4EDzAADw4Wram8SgS0ZSYnjvhrvwDOx1qqtSwv9mbQznSGHrP521/p2vZFy/GrX1GwLxkqtCp5MYs5AlbqSalXwjVu+OOSvXj4/XoFewYkRbKlNI1zBs2HluV42SSf5NB7GRNsWfGVEu0YTnLW1cINOwTvOdlYeKf1RNGBbUcKXcg2NeK9L4byVtXOtPYqirusmZw4n2qwitGmjna2i1cpNUKKlpla24KFxhIZJPWh3M683jeMk+vrhPTl6IZV1QpXAcUMVLMWmdhabUEMDyjHXt1DwUitZztBFLU6gLvg75XCXUA6PyMqN2QJnQbngsySL0dqz41JrU1mmdwVHBroncUqiQ7AIi+a2NLeluY4GOxrs/GA0GLRr3TF98g0dF9yZDXoND+Q7fg1Ov9a1NswUfIoeMGJJjPIEZT7FUNTtWqDFSRLTJ0nzOEnmyZT0a9GDYVuBRoNXsXG69Cb96FLUNvjyzj/oCmgmDeuVxGwYyFgHGHd0ThRxMxj53mfR2IpU8MX1NTC3luV3BRaDmI2UhsZbWVUwJCPpwA9FKnb4LngrDCaQM7IM83IFaouctLFsF/uH6FGgtVPq7RLf61Fg79QLr4rPbuSOLWj1gpYtpiRmJFISWWB0HIV0uZI4Yift7M15mBahO8qVeOZz5a6hRfdIEb8xrsMLFqL6UDHEdHncKLLQBtzrr5//huxfwFIYB1YKNXpNXw8Tf/KePwXe+6f9d3xoX8GI2iffv0QNa+a9qOW5xzZNUCI4L88LULYveEsx/DIFE3+ta9cRC6Bum58bC4ZmQmmnQk11OtTuG0tCq+t+DZXR6oL4aOgC+ixAv8+btddfijQQzfJ5nM7TvcXtbkl/J6ILU65lAxWIy0gxGx4PKTFNDzzSQTxlop96rMcSq8SY5uMlaBJKyeGVEvwkYRppm8sok0dMzDlVZUrMHHtPhqUCd767j0N7XC6z/+XyNgx/bETlj1hhi5/P+mOWlI77rHnzNB8+B/MkO0xSJLgnLPs4eMqmrWUp3a0uDyiuXh6GQboj9CROUdzzRsEWcxIHJA5J5DceLezGLPEKfd1ROExdDnJ6vyCj3rWH4cnBbXP9wvADHofHSv88Dkeje3909h/Dy+e/AVBLAwQUAAAACACKMVJd1je9uRkAAAAXAAAAFgAAAGdlb2dlYnJhX2phdmFzY3JpcHQuanNLK81LLsnMz1NIT0/yz/PMyyzR0FSorgUAUEsDBBQAAAAIAIoxUl21SiYyYwYAAHERAAAMAAAAZ2VvZ2VicmEueG1svVhtb9s2EP68/oqDPrVbY+tddmG3SIthG5AWRbMNw77REm1zkSVBomO76I/fcyQtxW42JEuxNgrJ0/FeH95Rmb3Zb0q6lW2n6mruBSPfI1nldaGq1dzb6uXFxHvz+tlsJeuVXLSClnW7EXruJczZ70tG8Wga+kwTTTP3Vq1o1hDhUVMKzXvm3s4jVcw9UciFCJbFhZgW4iKeyPxCpMvFRRxNptNFtIimk6VH+069quoPYiO7RuTyOl/Ljbiqc6GNvrXWTfdqPN7tdqOjaaO6XY2hvRvvu2K8Wi1GGCFpU1bd3HOTVxBst7vdu8jsC30/GP/x/soqulBVp0WVS49d36rXz76b7VRV1DvaqUKv5146nXi0lmq1Rizi0PfGzNMgHo3MtbqVHXbeWRrX9aaBQLCJit/bCZW9Vx4V6lYVsp17/miaZX6WRSnCkk7iSehR3SpZaccbsMbZuBd1q+SunxhtsT/NkCLVqUUp595SlJ1ECqpli6j2604fSiQEKnW7xXqwJnhp/oNFfQZ/7CO5Ngh45/sv+cnwJInzvtecBLBW13Vp5Pr0hQJKfDwUTOklpRkoIQUJxaBMQMkoYloSxBQRswQRxTHGmMlBijf8Gr+hjIIAbyj0KQwpDCiMsEwSSsCW8d4QvOnUyPPxMDcswhMxLYrwGFoU4wl5BkGJFQM7kig1s8T8nvAeaEmg7wuZV6DFU6hjQpIFFMESrDOfIBfiYbHxJvaJfwKKWUmYUTghI9XI9xGjhyfHEc6yc8xNcl9uUjyctNPcxKeZQSJ8eAbzfDhpBoSPqcgXL30OCwbjgu9zUjAklgfu8RIumsHymMRhiJ7q39G76OHe4VD23oGLUYOBAYEhIrYaE1jPQ+yWqV0aqPmAjKVy4jEAR0DTE11BKB7tCtzvddqj+RiVR4WmTj1M4dPw2LsIdCAJYjH3Lq9++vHtp8sHO/zEKN8b4wT1iX/Mc6YwepTHX5XHR+tLT87et3E2njxQeRACCP+rxoxx8HWpsSNOphm/TQqm/5qC2bhvjs4e6tbMeVSo5QY3BJ+yjLKIUlMuTMNCp0Kltl0rCylLKONicexd6DUTSnl0DYzb1+SkgSXc3u50sZSJ6BRcW8g0INvOwvjY0TA3PY373WlPQ/OJh/4DA1lUQISuSSmXK9eIYEXYt6IQ5qPzpIR2lYSUckn8h66Ey1rdqT60a1niJmdjZDKrqmarT0OXb/haY9Kia3CL0lzFLH9R5zdvz4MtRYcbUy8VN5jhknS2NBkrxUKWuEleMwroVpTu6vPdbFlXsMbkH6XDyDJXtZnc5qUqlKh+R9qPkPyw3SxkC7BhWvcyePtwpUME+itdkFmOvK7b4vrQASO0/1O22BvFOEoHOw+nwQjoG/5xHcwFw3mC29fBzeNg5OTJ22upNRzqSOwlYGejt2rNBbGf/9K9rUtQXNSaWlX6nWj0tjUXc2hp2dDLalVKExqTMlxe85tFvb+2lRj+sKxfDw2XKat/sXpXl3VLOE5hkoDBjajXPBoeNmzggrPMhAE8kQscy+1ZAi4J4AmyqWEKJiYfSJ6qrHXOV5hoHXW1QuxVZ2oF9luUuCPOSef78LZS+uq40Cq/GXxlfpvUYxBPRTqWJ4ucjc/wNHMgP6JrUxcOmCbEs/HJ+9mNbCtZWihVSPy23naW/c7R2nbyo9Dry6r4JFc4gB8Fl0ANQyzr4F8hc7XBRncUXFYF4+A3eGbJhVy18hgQa82d88MQbVopim4tJbDukmGRPrC52nm0f4aeXkpT3TcKFQIp24i9TZ2WOPuWv8tb1TC+aYFCfSMHDBeqYwk9gbkRkg6+4bjXFZKhORH4hNzqdQ1cYY/QTOFDvYfJHX9tHlOJr0QQMT7fv6A5PQ/pe8LsB0ImtYH8clsZyUaVLOUGn0/nrwZpph4AAVQv/kIBOgPOkAG87pHPgAfwudXxAQqxFGWzFn1QS3HgqtPH0xW09z1mHHWp9rI4z/VwfPQaQMWXHnCJqmJd4PaKyc+qKKSt2DU+lZU+8B0sdtC1Tt8bP1zMTPye++gvL45STaW5J2CWPuz9L9EK+fzzNRAjl4kpuv8jw9XjHYfAgMZhb9QnHRP8zeFgyuSdE5ajeDK/keJctt/s7BgXTPvKlUBLPTsM7ox0ZGGPQEPZ5/5bfAj2+C6uTWNyf6N4/exvUEsBAhQAFAAAAAgAijFSXTHd+esTBQAAvSUAABcAAAAAAAAAAAAAAAAAAAAAAGdlb2dlYnJhX2RlZmF1bHRzMmQueG1sUEsBAhQAFAAAAAgAijFSXYJHRTRjAwAABxEAABcAAAAAAAAAAAAAAAAASAUAAGdlb2dlYnJhX2RlZmF1bHRzM2QueG1sUEsBAhQAFAAAAAgAijFSXdY3vbkZAAAAFwAAABYAAAAAAAAAAAAAAAAA4AgAAGdlb2dlYnJhX2phdmFzY3JpcHQuanNQSwECFAAUAAAACACKMVJdtUomMmMGAABxEQAADAAAAAAAAAAAAAAAAAAtCQAAZ2VvZ2VicmEueG1sUEsFBgAAAAAEAAQACAEAALoPAAAAAA==",
    "png": "",
    "alto": 380,
    "interactivo": false
   },
   "pista": "En $f(x) = mx + b$, el número que multiplica a $x$ es la pendiente y $b$ es el corte con el eje $y$.",
   "partes": [
    {
     "tipo": "multiple",
     "texto": "¿Cuál es la pendiente de la recta?",
     "puntos": 1,
     "opciones": [
      "$1$",
      "$2$",
      "$-2$",
      "$\\dfrac{1}{2}$"
     ],
     "correcta": 1,
     "solucion": "En $f(x) = 2x + 1$, la pendiente es $m = 2$: la recta sube 2 unidades por cada unidad que avanza."
    },
    {
     "tipo": "abierta",
     "texto": "¿En qué punto corta la recta al eje $y$?",
     "puntos": 1,
     "respuestas": [
      "(0, 1)",
      "1"
     ],
     "solucion": "Cuando $x = 0$: $f(0) = 1$. Corta en el punto $(0, 1)$."
    }
   ]
  },
  {
   "id": "q-ejemplo-5",
   "subtema": "s-ejemplo-1-2",
   "paper": null,
   "dificultad": "media",
   "enunciado": "Caso práctico: un taxi cobra 3 soles por subir y 2 soles por cada kilómetro recorrido.",
   "imagen": "",
   "pista": "La parte fija es el corte con el eje $y$ y lo que se paga por kilómetro es la pendiente.",
   "partes": [
    {
     "tipo": "abierta",
     "texto": "Escribe la función $C(x)$ del costo de un viaje de $x$ kilómetros.",
     "puntos": 2,
     "respuestas": [
      "C(x) = 2x + 3"
     ],
     "solucion": "$C(x) = 2x + 3$"
    },
    {
     "tipo": "abierta",
     "texto": "¿Cuánto cuesta un viaje de 8 km?",
     "puntos": 1,
     "respuestas": [
      "19"
     ],
     "solucion": "$C(8) = 2(8) + 3 = 19$ soles."
    },
    {
     "tipo": "multiple",
     "texto": "Con 25 soles, ¿cuántos kilómetros como máximo puedes recorrer?",
     "puntos": 1,
     "opciones": [
      "8 km",
      "11 km",
      "12,5 km",
      "14 km"
     ],
     "correcta": 1,
     "solucion": "$2x + 3 = 25 \\Rightarrow 2x = 22 \\Rightarrow x = 11$ km."
    }
   ]
  }
 ],
 "apuntes": [
  {
   "id": "a-ejemplo-1",
   "tema": "t-ejemplo-1",
   "titulo": "¿Qué es una ecuación de primer grado?",
   "contenido": "Una ecuación de primer grado es una igualdad con una incógnita (normalmente $x$) que no está elevada a ninguna potencia, por ejemplo $2x + 5 = 13$.\n\nPara resolverla dejamos la $x$ sola haciendo la misma operación en los dos lados de la igualdad:\n\n$$2x + 5 = 13$$\n\n$$2x = 13 - 5 = 8$$\n\n$$x = \\frac{8}{2} = 4$$\n\nSiempre podemos comprobar el resultado: $2(4) + 5 = 13$ ✓",
   "imagen": "",
   "grafico": null
  },
  {
   "id": "a-ejemplo-2",
   "tema": "t-ejemplo-1",
   "titulo": "La función lineal",
   "contenido": "Una función lineal tiene la forma $f(x) = mx + b$.\n\n• $m$ es la pendiente: cuánto sube (o baja) la recta por cada unidad que avanzamos en $x$.\n• $b$ es el corte con el eje $y$: la recta pasa por el punto $(0, b)$.\n\nEjemplo: en $f(x) = 2x + 1$ la pendiente es $2$ y la recta corta al eje $y$ en $(0, 1)$, como se ve en la gráfica.",
   "imagen": "",
   "grafico": {
    "app": "graphing",
    "base64": "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",
    "png": "",
    "alto": 380,
    "interactivo": false
   }
  }
 ],
 "tarjetas": [
  {
   "id": "c-ejemplo-1",
   "tema": "t-ejemplo-1",
   "frente": "¿Qué hacemos para despejar $x$ en $x + 5 = 9$?",
   "reverso": "Restamos 5 en los dos lados: $x = 9 - 5 = 4$."
  },
  {
   "id": "c-ejemplo-2",
   "tema": "t-ejemplo-1",
   "frente": "Resuelve: $5x = 35$",
   "reverso": "$x = \\dfrac{35}{5} = 7$"
  },
  {
   "id": "c-ejemplo-3",
   "tema": "t-ejemplo-1",
   "frente": "En $f(x) = mx + b$, ¿qué representa $m$?",
   "reverso": "La pendiente de la recta."
  },
  {
   "id": "c-ejemplo-4",
   "tema": "t-ejemplo-1",
   "frente": "En $f(x) = mx + b$, ¿qué representa $b$?",
   "reverso": "El corte con el eje $y$: el punto $(0, b)$."
  }
 ],
 "formularios": [
  {
   "id": "f-ejemplo-1",
   "tema": "t-ejemplo-1",
   "titulo": "Fórmulas de álgebra básica",
   "entradas": [
    {
     "nombre": "Ecuación de primer grado",
     "formula": "$ax + b = c \\Rightarrow x = \\dfrac{c - b}{a}$",
     "nota": "con $a \\ne 0$"
    },
    {
     "nombre": "Función lineal",
     "formula": "$f(x) = mx + b$",
     "nota": "$m$: pendiente · $b$: corte con el eje $y$"
    },
    {
     "nombre": "Pendiente entre dos puntos",
     "formula": "$m = \\dfrac{y_2 - y_1}{x_2 - x_1}$",
     "nota": ""
    },
    {
     "nombre": "Ecuación punto-pendiente",
     "formula": "$y - y_1 = m(x - x_1)$",
     "nota": ""
    }
   ]
  }
 ],
 "examenes": [
  {
   "id": "e-ejemplo-1",
   "titulo": "Examen de práctica: Álgebra básica",
   "descripcion": "Cinco preguntas sencillas para comprobar lo que has aprendido.",
   "minutos": 20,
   "preguntas": [
    "q-ejemplo-1",
    "q-ejemplo-2",
    "q-ejemplo-3",
    "q-ejemplo-4",
    "q-ejemplo-5"
   ]
  }
 ]
};
