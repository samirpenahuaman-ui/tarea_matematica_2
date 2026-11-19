const btnGenerar = document.getElementById("btn-generar");
const spanB = document.getElementById("valor-b");
const spanC = document.getElementById("valor-c");

const textoLineal = document.getElementById("funcion-lineal");
const listaLineal = document.getElementById("lista-lineal");

const textoAfin = document.getElementById("funcion-afin");
const listaAfin = document.getElementById("lista-afin");

function generar() {
    let b = Math.floor(Math.random() * 21) - 10;
    let c = Math.floor(Math.random() * 21) - 10;

    spanB.innerHTML = b;
    spanC.innerHTML = c;

    textoLineal.innerHTML = "";
    listaLineal.innerHTML = "";
    textoAfin.innerHTML = "";
    listaAfin.innerHTML = "";

    if (c == 0) {
        textoLineal.innerHTML = "f(x) = " + b + "x";
        listaLineal.innerHTML =
            "<li>Gráfica: Línea recta continua.</li>" +
            "<li>Paso Obligatorio: Pasa por el origen de coordenadas (0, 0).</li>" +
            "<li>Pendiente (b): Si b > 0 es creciente, si b < 0 es decreciente.</li>";
        textoAfin.innerHTML = "No es función afín (c = 0).";
    } else {
        textoAfin.innerHTML = "f(x) = " + b + "x + " + c;
        listaAfin.innerHTML =
            "<li>Gráfica: Línea recta que no pasa por el origen.</li>" +
            "<li>Corte Eje Y: Interseca al eje Y en las coordenadas (0, " + c + ").</li>" +
            "<li>Inclinación: Regulada por el valor del coeficiente de pendiente b.</li>" +
            "<li>Traslación: Es una traslación vertical de la función lineal f(x) = " + b + "x en " + c + " unidades.</li>";
        textoLineal.innerHTML = "No es función lineal (c ≠ 0).";
    }
}

btnGenerar.addEventListener("click", generar);