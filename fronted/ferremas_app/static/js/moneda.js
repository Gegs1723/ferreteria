async function obtenerValorDolar() {
  try {
    const res = await fetch('https://mindicador.cl/api/dolar');
    const data = await res.json();
    return data.serie[0].valor;
  } catch {
    return 1000;
  }
}

function formatearCLP(valor) {
  return 'CLP $' + valor.toLocaleString('es-CL');
}
function formatearUSD(valor) {
  return 'USD $' + valor.toFixed(2);
}

async function actualizarPreciosMoneda() {
  const moneda = localStorage.getItem('moneda') || 'clp';
  let valorDolar = 1;
  if (moneda === 'usd') valorDolar = await obtenerValorDolar();

  document.querySelectorAll('.precio-multi').forEach(function(span) {
    const precioCLP = parseFloat(span.dataset.precioClp);
    const precioUSD = parseFloat(span.dataset.precioUsd);

    if (moneda === 'usd') {
      let mostrarUSD = !isNaN(precioUSD) && precioUSD ? precioUSD : (precioCLP / valorDolar);
      span.innerHTML = formatearUSD(mostrarUSD);
    } else {
      span.innerHTML = formatearCLP(precioCLP);
    }
  });
}

document.addEventListener('DOMContentLoaded', function() {
  const selector = document.getElementById('selector-moneda');
  if (selector) {
    selector.value = localStorage.getItem('moneda') || 'clp';
    selector.addEventListener('change', function() {
      localStorage.setItem('moneda', selector.value);
      actualizarPreciosMoneda();
    });
  }
  actualizarPreciosMoneda();
});