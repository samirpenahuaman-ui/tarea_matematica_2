let botonGenerar = document.querySelector("#btnGenerar");
let spanB = document.querySelector("#valorB");
let spanC = document.querySelector("#valorC");
let formulaTexto = document.querySelector("#formulaTexto");
let fotoAlgebra = document.querySelector("#fotoAlgebra");

let cajaConstante = document.querySelector("#cajaConstante");
let cajaLineal = document.querySelector("#cajaLineal");
let cajaNoFuncion = document.querySelector("#cajaNoFuncion");
let cajaAfin = document.querySelector("#cajaAfin");

let indiceCaso = 0;

function enteroAleatorio(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function distintoDeCeroAleatorio(min, max) {
  let num = 0;
  while (num === 0) {
    num = enteroAleatorio(min, max);
  }
  return num;
}

function limpiarCajas() {
  cajaConstante.classList.remove("activa");
  cajaLineal.classList.remove("activa");
  cajaNoFuncion.classList.remove("activa");
  cajaAfin.classList.remove("activa");
}

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
  let b = 0;
  let c = 0;
  let tipoTexto = "";

  limpiarCajas();

  if (indiceCaso === 0) {
    b = 0;
    c = distintoDeCeroAleatorio(-3, 3);
    tipoTexto = "Función constante";
    cajaConstante.classList.add("activa");
  } else if (indiceCaso === 1) {
    b = distintoDeCeroAleatorio(-3, 3);
    c = 0;
    tipoTexto = "Función lineal";
    cajaLineal.classList.add("activa");
  } else if (indiceCaso === 2) {
    b = 0;
    c = 0;
    tipoTexto = "No hay función";
    cajaNoFuncion.classList.add("activa");
  } else {
    b = distintoDeCeroAleatorio(-3, 3);
    c = distintoDeCeroAleatorio(-3, 3);
    tipoTexto = "Función afín";
    cajaAfin.classList.add("activa");
  }

  indiceCaso = (indiceCaso + 1) % 4;

  spanB.innerText = b;
  spanC.innerText = c;

  let formula = formatearFormula(b, c);
  formulaTexto.innerText = formula;

  fotoAlgebra.src = construirSvgAlgebra(b, c, tipoTexto, formula);
}

botonGenerar.addEventListener("click", generarYClasificar);
generarYClasificar();