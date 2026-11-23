/*Toma los elementos del HTML con document.querySelector(...) (botón, <span> de b y c, fórmula, imagen y las 4 cajas).*/
let botonGenerar = document.querySelector("#btnGenerar");
let spanB = document.querySelector("#valorB");
let spanC = document.querySelector("#valorC");
let formulaTexto = document.querySelector("#formulaTexto");
let fotoAlgebra = document.querySelector("#fotoAlgebra");

let cajaConstante = document.querySelector("#cajaConstante");
let cajaLineal = document.querySelector("#cajaLineal");
let cajaNoFuncion = document.querySelector("#cajaNoFuncion");
let cajaAfin = document.querySelector("#cajaAfin");
/*(enteroAleatorio): Saca un número entero al azar entre min y max (en el código se usa de -3 a 3).*/
function enteroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/*(prepararCajas): Crea el párrafo .caracteristicaCaja dentro de cada caja si todavía no existe.*/
function prepararCajas() {
  let cajas = [cajaConstante, cajaLineal, cajaNoFuncion, cajaAfin];
  for (let i = 0; i < cajas.length; i = i + 1) {
    let detalle = cajas[i].querySelector(".caracteristicaCaja");
    if (!detalle) {
      detalle = document.createElement("p");
      detalle.className = "caracteristicaCaja";
      cajas[i].appendChild(detalle);
    }
  }
}
/*(resetearCajas): Limpia la clase activa, los colores y los textos de características de las 4 cajas antes de cada sorteo.*/
function resetearCajas() {
  let cajas = [cajaConstante, cajaLineal, cajaNoFuncion, cajaAfin];
  for (let i = 0; i < cajas.length; i = i + 1) {
    cajas[i].classList.remove("activa");
    cajas[i].style.backgroundColor = "#ffffff";
    cajas[i].style.borderColor = "#cbd5e1";
    cajas[i].style.color = "#1f2937";

    let detalle = cajas[i].querySelector(".caracteristicaCaja");
    if (detalle) {
      detalle.innerText = "";
    }
  }
}
/*(activarCajaConCaracteristica): Pinta en color la caja que corresponde y escribe sus características dentro de ella.*/
function activarCajaConCaracteristica(caja, colorFondo, colorBorde, textoCaracteristica) {
  caja.classList.add("activa");
  caja.style.backgroundColor = colorFondo;
  caja.style.borderColor = colorBorde;
  caja.style.color = "#0f172a";

  let detalle = caja.querySelector(".caracteristicaCaja");
  if (detalle) {
    detalle.innerText = textoCaracteristica;
  }
}
/*(formatearFormula): Arma cómo se ve la fórmula (f(x) = ..., simplificando 1x/-1x o avisando cuando b = 0 y c = 0).*/
function formatearFormula(b, c) {
  if (b === 0 && c === 0) {
    return "No hay función (no se puede graficar)";
  }
  if (b === 0) {
    return "f(x) = " + c;
  }
  if (c === 0) {
    if (b === 1) {
      return "f(x) = x";
    }
    if (b === -1) {
      return "f(x) = -x";
    }
    return "f(x) = " + b + "x";
  }

  let parteB = b + "x";
  if (b === 1) {
    parteB = "x";
  } else if (b === -1) {
    parteB = "-x";
  }

  let parteC = c > 0 ? " + " + c : " - " + Math.abs(c);
  return "f(x) = " + parteB + parteC;
}
/*(construirSvgAlgebra): Dibuja el gráfico SVG (rejilla, ejes y la recta y = bx + c, o el aviso si no se puede graficar) y lo manda a fotoAlgebra.src.*/
function construirSvgAlgebra(b, c, tipoTexto, formula) {
  let ancho = 480;
  let alto = 320;
  let cx = ancho / 2;
  let cy = alto / 2 + 28;
  let escala = 24;

  let rejilla = "";
  for (let x = cx % escala; x < ancho; x = x + escala) {
    rejilla = rejilla + '<line x1="' + x + '" y1="54" x2="' + x + '" y2="' + alto + '" stroke="#2d3a4b" stroke-width="1"/>';
  }
  for (let y = cy % escala; y > 54; y = y - escala) {
    rejilla = rejilla + '<line x1="0" y1="' + y + '" x2="' + ancho + '" y2="' + y + '" stroke="#2d3a4b" stroke-width="1"/>';
  }

  let ejes =
    '<line x1="0" y1="' + cy + '" x2="' + ancho + '" y2="' + cy + '" stroke="#94a3b8" stroke-width="2"/>' +
    '<line x1="' + cx + '" y1="54" x2="' + cx + '" y2="' + alto + '" stroke="#94a3b8" stroke-width="2"/>';

  let contenidoFuncion = "";
  if (b === 0 && c === 0) {
    contenidoFuncion =
      '<rect x="40" y="' + (cy - 34) + '" width="' + (ancho - 80) + '" height="68" rx="8" fill="#1e293b" stroke="#f87171" stroke-width="2"/>' +
      '<text x="' + cx + '" y="' + (cy - 5) + '" fill="#f87171" font-size="16" font-family="Arial, sans-serif" font-weight="bold" text-anchor="middle">' +
      "No hay función — No se puede graficar" +
      "</text>" +
      '<text x="' + cx + '" y="' + (cy + 18) + '" fill="#cbd5e1" font-size="13" font-family="Arial, sans-serif" text-anchor="middle">' +
      "Condición: b = 0 y c = 0" +
      "</text>";
  } else {
    let xMin = -cx / escala;
    let xMax = (ancho - cx) / escala;
    let y1 = b * xMin + c;
    let y2 = b * xMax + c;

    let px1 = cx + xMin * escala;
    let py1 = cy - y1 * escala;
    let px2 = cx + xMax * escala;
    let py2 = cy - y2 * escala;

    contenidoFuncion =
      '<line x1="' + px1 + '" y1="' + py1 + '" x2="' + px2 + '" y2="' + py2 + '" stroke="#38bdf8" stroke-width="3"/>';
  }
/*(generarYClasificar): Sortea b y c entre -3 y 3, decide cuál de los 4 casos toca, actualiza textos, resalta la caja, pone su característica y genera la imagen.*/
  let svg =
    '<svg xmlns="http://www.w3.org/2000/svg" width="' + ancho + '" height="' + alto + '" viewBox="0 0 ' + ancho + ' ' + alto + '">' +
    '<rect width="' + ancho + '" height="' + alto + '" rx="10" fill="#0f172a"/>' +
    '<rect x="0" y="0" width="' + ancho + '" height="54" fill="#1e293b"/>' +
    '<text x="14" y="22" fill="#f8fafc" font-size="14" font-family="Arial, sans-serif" font-weight="bold">' +
    formula + "  |  " + tipoTexto +
    "</text>" +
    '<text x="14" y="42" fill="#93c5fd" font-size="12" font-family="Arial, sans-serif">' +
    "Valores: b = " + b + " , c = " + c +
    "</text>" +
    rejilla +
    ejes +
    contenidoFuncion +
    "</svg>";

  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function generarYClasificar() {
  let b = enteroAleatorio(-3, 3);
  let c = enteroAleatorio(-3, 3);

  prepararCajas();
  resetearCajas();

  spanB.innerText = b;
  spanC.innerText = c;

  let tipoTexto = "";

  if (b === 0 && c !== 0) {
    tipoTexto = "Función constante";
    activarCajaConCaracteristica(
      cajaConstante,
      "#dcfce7",
      "#16a34a",
      "• Recta horizontal (pendiente 0).\n• Corta el eje y en (0, " + c + ").\n• No corta el eje x."
    );
  } else if (c === 0 && b !== 0) {
    tipoTexto = "Función lineal";
    activarCajaConCaracteristica(
      cajaLineal,
      "#dbeafe",
      "#2563eb",
      "• Recta inclinada que pasa por (0, 0).\n• Pendiente b = " + b + ".\n• Corta ambos ejes en el origen."
    );
  } else if (b === 0 && c === 0) {
    tipoTexto = "No hay función";
    activarCajaConCaracteristica(
      cajaNoFuncion,
      "#fef3c7",
      "#d97706",
      "• Condición b = 0 y c = 0.\n• No define una función.\n• No se puede graficar una recta."
    );
  } else {
    tipoTexto = "Función afín";
    activarCajaConCaracteristica(
      cajaAfin,
      "#ede9fe",
      "#7c3aed",
      "• Recta inclinada que no pasa por (0, 0).\n• Pendiente b = " + b + ".\n• Corta el eje y en (0, " + c + ")."
    );
  }

  let formula = formatearFormula(b, c);
  formulaTexto.innerText = formula;

  fotoAlgebra.src = construirSvgAlgebra(b, c, tipoTexto, formula);
}
/*Escucha el clic en #btnGenerar para repetir todo y ejecuta generarYClasificar() al abrir la página.*/
botonGenerar.addEventListener("click", generarYClasificar);


generarYClasificar();