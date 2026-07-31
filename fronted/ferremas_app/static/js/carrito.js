// Función para formatear precios
function formatearPrecio(precio) {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(precio);
}

// Carrito global
let carrito = JSON.parse(localStorage.getItem('carritoFerramas')) || [];

// Actualiza el contador del carrito en el header
function actualizarContadorCarrito() {
  const contadorCarrito = document.getElementById('contador-carrito');
  const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
  if (contadorCarrito) {
    contadorCarrito.textContent = totalItems;
    contadorCarrito.style.display = totalItems > 0 ? 'block' : 'none';
  }
  const cantidadProductos = document.getElementById('cantidad-productos-carrito');
  if (cantidadProductos) {
    cantidadProductos.textContent = totalItems;
  }
}

// Guarda el carrito en localStorage
function guardarCarrito() {
  localStorage.setItem('carritoFerramas', JSON.stringify(carrito));
}

// Agrega un producto al carrito
function agregarAlCarrito(boton) {
  const producto = {
    id: boton.dataset.id,
    name: boton.dataset.name,
    price: parseInt(boton.dataset.price),
    img: boton.dataset.img,
    cantidad: 1
  };
  const productoExistente = carrito.find(item => item.id === producto.id);
  if (productoExistente) {
    productoExistente.cantidad++;
  } else {
    carrito.push(producto);
  }
  guardarCarrito();
  actualizarContadorCarrito();
  actualizarVistaCarrito();
  mostrarCarritoEnPagina();

  // Feedback visual
  if (boton) {
    boton.classList.replace('btn-primary', 'btn-success');
    boton.innerHTML = '<i class="fas fa-check me-2"></i>AGREGADO';
    setTimeout(() => {
      boton.classList.replace('btn-success', 'btn-primary');
      boton.innerHTML = '<i class="fas fa-cart-plus me-2"></i>AÑADIR AL CARRO';
    }, 2000);
  }
}

// Elimina un producto del carrito por índice
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  guardarCarrito();
  actualizarVistaCarrito();
  actualizarContadorCarrito();
  mostrarCarritoEnPagina();
}

// Cambia la cantidad de un producto
function cambiarCantidad(index, cambio) {
  const nuevaCantidad = carrito[index].cantidad + cambio;
  if (nuevaCantidad > 0) {
    actualizarCantidad(index, nuevaCantidad);
  }
}

// Actualiza la cantidad manualmente
function actualizarCantidad(index, cantidad) {
  if (cantidad < 1) cantidad = 1;
  carrito[index].cantidad = cantidad;
  guardarCarrito();
  actualizarVistaCarrito();
  actualizarContadorCarrito();
  mostrarCarritoEnPagina();
}

// Actualiza la vista del carrito en el modal
function actualizarVistaCarrito() {
  const itemsCarrito = document.getElementById('items-carrito');
  const carritoVacio = document.getElementById('carrito-vacio');
  const totalContainer = document.getElementById('total-container');
  const totalCarrito = document.getElementById('total-carrito');
  if (!itemsCarrito) return;
  if (carrito.length === 0) {
    if (carritoVacio) carritoVacio.style.display = 'block';
    itemsCarrito.innerHTML = '';
    itemsCarrito.style.display = 'none';
    if (totalContainer) totalContainer.style.display = 'none';
    if (totalCarrito) totalCarrito.textContent = '$0';
    actualizarContadorCarrito();
    return;
  }
  if (carritoVacio) carritoVacio.style.display = 'none';
  itemsCarrito.style.display = 'block';
  if (totalContainer) totalContainer.style.display = 'flex';

  let html = '';
  let total = 0;
  let cantidad = 0;
  carrito.forEach((item, index) => {
    const imgSrc = item.img ? item.img : '/static/imagenes/logo_ferreteria.jpg';
    html += `
      <div class="d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
        <div class="d-flex align-items-center">
          <img src="${imgSrc}" alt="${item.name}" class="img-thumbnail me-3" style="width: 80px; height: 80px; object-fit: contain;" onerror="this.src='/static/imagenes/logo_ferreteria.jpg'">
          <div>
            <h6 class="mb-1">${item.name}</h6>
            <p class="mb-1">${formatearPrecio(item.price)} c/u</p>
            <p class="mb-0 fw-bold">${formatearPrecio(item.price * item.cantidad)}</p>
          </div>
        </div>
        <div class="d-flex align-items-center">
          <button class="btn btn-sm btn-outline-danger btn-remove-item me-2" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
          <div class="input-group" style="width: 120px;">
            <button class="btn btn-outline-secondary btn-decrement" type="button" data-index="${index}">-</button>
            <input type="number" min="1" class="form-control text-center cantidad-item" value="${item.cantidad}" data-index="${index}">
            <button class="btn btn-outline-secondary btn-increment" type="button" data-index="${index}">+</button>
          </div>
        </div>
      </div>
    `;
    total += item.price * item.cantidad;
    cantidad += item.cantidad;
  });

  // Aplica descuento si hay más de 4 artículos
  let descuento = 0;
  if (cantidad > 4) {
    descuento = total * 0.10; // 10% de descuento
    total = total - descuento;
  }

  // Muestra el descuento en el HTML si aplica
  let descuentoHtml = '';
  if (descuento > 0) {
    descuentoHtml = `<div class="text-success">Descuento aplicado: -${formatearPrecio(descuento)}</div>`;
  }

  itemsCarrito.innerHTML = html + descuentoHtml;
  const cantidadProductos = document.getElementById('cantidad-productos-carrito');
  if (cantidadProductos) cantidadProductos.textContent = cantidad;
  if (totalCarrito) totalCarrito.textContent = formatearPrecio(total);
}

// Obtiene el valor del dólar desde la API de Mindicador
async function obtenerValorDolar() {
  try {
    const res = await fetch('https://mindicador.cl/api/dolar');
    const data = await res.json();
    return data.serie[0].valor;
  } catch {
    return 1000;
  }
}
async function obtenerValorEuro() {
  try {
    const res = await fetch('https://mindicador.cl/api/euro');
    const data = await res.json();
    return data.serie[0].valor;
  } catch {
    return 1100;
  }
}
async function obtenerValorYuan() {
  try {
    const res = await fetch('https://mindicador.cl/api/yuan');
    const data = await res.json();
    return data.serie[0].valor;
  } catch {
    return 130;
  }
}

function formatearCLP(valor) { return 'CLP $' + valor.toLocaleString('es-CL'); }
function formatearUSD(valor) { return 'USD $' + valor.toFixed(2); }
function formatearEUR(valor) { return '€' + valor.toFixed(2); }
function formatearCNY(valor) { return '¥' + valor.toFixed(2); }

// Calcula totales con y sin descuento
function calcularTotales(carrito) {
  let totalSinDescuento = carrito.reduce((sum, item) => sum + item.price * item.cantidad, 0);
  let cantidad = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  let descuento = cantidad > 4 ? totalSinDescuento * 0.10 : 0;
  let totalConDescuento = totalSinDescuento - descuento;
  return { totalSinDescuento, descuento, totalConDescuento };
}

// Muestra el carrito en la página de carrito
async function mostrarCarritoEnPagina() {
  const carritoVacio = document.getElementById('carrito-vacio');
  const itemsCarrito = document.getElementById('items-carrito');
  const totalContainer = document.getElementById('total-container');
  const totalCarrito = document.getElementById('total-carrito');
  const cantidadProductos = document.getElementById('cantidad-productos-carrito');
  const selectorMoneda = document.getElementById('selector-moneda');
  if (!itemsCarrito) return;
  if (carrito.length === 0) {
    if (carritoVacio) carritoVacio.style.display = 'block';
    itemsCarrito.innerHTML = '';
    itemsCarrito.style.display = 'none';
    if (totalContainer) totalContainer.style.display = 'none';
    if (cantidadProductos) cantidadProductos.textContent = '0';
    if (totalCarrito) totalCarrito.textContent = '$0';
    return;
  }
  if (carritoVacio) carritoVacio.style.display = 'none';
  itemsCarrito.style.display = 'block';
  if (totalContainer) totalContainer.style.display = 'flex';

  let moneda = selectorMoneda ? selectorMoneda.value : 'clp';
  let valorDolar = 1, valorEuro = 1, valorYuan = 1;
  if (moneda === 'usd') valorDolar = await obtenerValorDolar();
  if (moneda === 'eur') valorEuro = await obtenerValorEuro();
  if (moneda === 'cny') valorYuan = await obtenerValorYuan();

  let html = `
    <div class="row fw-bold border-bottom pb-2 mb-2">
      <div class="col-5">Producto</div>
      <div class="col-2">Cantidad</div>
      <div class="col-2">Precio</div>
      <div class="col-2">Subtotal</div>
      <div class="col-1"></div>
    </div>
  `;

  let total = 0, cantidad = 0;
  carrito.forEach((item, index) => {
    const imgSrc = item.img ? item.img : '/static/imagenes/logo_ferreteria.jpg';
    const precioClp = item.price;
    const subtotalClp = item.price * item.cantidad;
    let precio, subtotal, formatear;

    if (moneda === 'usd') {
      precio = precioClp / valorDolar;
      subtotal = subtotalClp / valorDolar;
      formatear = formatearUSD;
    } else if (moneda === 'eur') {
      precio = precioClp / valorEuro;
      subtotal = subtotalClp / valorEuro;
      formatear = formatearEUR;
    } else if (moneda === 'cny') {
      precio = precioClp / valorYuan;
      subtotal = subtotalClp / valorYuan;
      formatear = formatearCNY;
    } else {
      precio = precioClp;
      subtotal = subtotalClp;
      formatear = formatearCLP;
    }

    html += `
      <div class="row align-items-center mb-2">
        <div class="col-5">
          <img src="${imgSrc}" alt="${item.name}" class="img-thumbnail me-3" style="width: 60px; height: 60px; object-fit: contain;" onerror="this.src='/static/imagenes/logo_ferreteria.jpg'">
          ${item.name}
        </div>
        <div class="col-2">
          <div class="input-group">
            <button class="btn btn-outline-secondary btn-decrement" type="button" data-index="${index}">-</button>
            <input type="number" min="1" class="form-control text-center cantidad-item" value="${item.cantidad}" data-index="${index}">
            <button class="btn btn-outline-secondary btn-increment" type="button" data-index="${index}">+</button>
          </div>
        </div>
        <div class="col-2">
          <span class="precio-multi"
            data-precio-clp="${precioClp}"
            data-precio-usd="${(precioClp / valorDolar).toFixed(2)}"
            data-precio-eur="${(precioClp / valorEuro).toFixed(2)}"
            data-precio-cny="${(precioClp / valorYuan).toFixed(2)}">
            ${formatear(precio)}
          </span>
        </div>
        <div class="col-2">
          <span class="precio-multi"
            data-precio-clp="${subtotalClp}"
            data-precio-usd="${(subtotalClp / valorDolar).toFixed(2)}"
            data-precio-eur="${(subtotalClp / valorEuro).toFixed(2)}"
            data-precio-cny="${(subtotalClp / valorYuan).toFixed(2)}">
            ${formatear(subtotal)}
          </span>
        </div>
        <div class="col-1">
          <button class="btn btn-sm btn-outline-danger btn-remove-item" data-index="${index}">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `;
    total += subtotalClp;
    cantidad += item.cantidad;
  });

  // Aplica descuento si hay más de 4 artículos
  let descuento = 0;
  if (cantidad > 4) {
    descuento = total * 0.10;
    total = total - descuento;
  }

  let mostrarTotal, mostrarTotalSinDesc, mostrarDescuento, formatear;
  if (moneda === 'usd') {
    mostrarTotal = formatearUSD(total / valorDolar);
    mostrarTotalSinDesc = formatearUSD((total + descuento) / valorDolar);
    mostrarDescuento = formatearUSD(descuento / valorDolar);
  } else if (moneda === 'eur') {
    mostrarTotal = formatearEUR(total / valorEuro);
    mostrarTotalSinDesc = formatearEUR((total + descuento) / valorEuro);
    mostrarDescuento = formatearEUR(descuento / valorEuro);
  } else if (moneda === 'cny') {
    mostrarTotal = formatearCNY(total / valorYuan);
    mostrarTotalSinDesc = formatearCNY((total + descuento) / valorYuan);
    mostrarDescuento = formatearCNY(descuento / valorYuan);
  } else {
    mostrarTotal = formatearCLP(total);
    mostrarTotalSinDesc = formatearCLP(total + descuento);
    mostrarDescuento = formatearCLP(descuento);
  }

  let resumenHtml = `
    <div class="mt-3">
      <div>Total sin descuento: <span class="fw-bold">${mostrarTotalSinDesc}</span></div>
      <div>Descuento: <span class="fw-bold text-success">-${mostrarDescuento}</span></div>
      <div>Total a pagar: <span class="fw-bold text-primary">${mostrarTotal}</span></div>
    </div>
  `;

  itemsCarrito.innerHTML = html + resumenHtml;
  if (cantidadProductos) cantidadProductos.textContent = cantidad;
  if (totalCarrito) totalCarrito.textContent = mostrarTotal;
}

// Cambia el total cuando cambia la moneda
document.addEventListener('DOMContentLoaded', function() {
  const selectorMoneda = document.getElementById('selector-moneda');
  if (selectorMoneda) {
    selectorMoneda.addEventListener('change', mostrarCarritoEnPagina);
  }

  actualizarContadorCarrito();

  // Modal del carrito
  const btnCarrito = document.getElementById('btn-carrito');
  const modalCarrito = document.getElementById('modalCarrito') ? new bootstrap.Modal(document.getElementById('modalCarrito')) : null;
  if (btnCarrito && modalCarrito) {
    btnCarrito.addEventListener('click', function() {
      actualizarVistaCarrito();
      modalCarrito.show();
    });
  }

  // Delegación de eventos para botones del carrito
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('btn-add-to-cart') || e.target.closest('.btn-add-to-cart')) {
      const boton = e.target.classList.contains('btn-add-to-cart') ? e.target : e.target.closest('.btn-add-to-cart');
      agregarAlCarrito(boton);
    }
    if (e.target.classList.contains('btn-remove-item') || e.target.closest('.btn-remove-item')) {
      const boton = e.target.classList.contains('btn-remove-item') ? e.target : e.target.closest('.btn-remove-item');
      eliminarDelCarrito(boton.dataset.index);
    }
    if (e.target.classList.contains('btn-decrement')) {
      cambiarCantidad(e.target.dataset.index, -1);
    }
    if (e.target.classList.contains('btn-increment')) {
      cambiarCantidad(e.target.dataset.index, 1);
    }
  });

  // Cambios manuales en la cantidad
  const itemsCarrito = document.getElementById('items-carrito');
  if (itemsCarrito) {
    itemsCarrito.addEventListener('change', function(e) {
      if (e.target.classList.contains('cantidad-item')) {
        const nuevaCantidad = parseInt(e.target.value) || 1;
        actualizarCantidad(e.target.dataset.index, nuevaCantidad);
      }
    });
  }

  // Redirigir a la página del carrito desde el modal
  const btnFinalizarCompra = document.getElementById('btn-finalizar-compra');
  if (btnFinalizarCompra) {
    btnFinalizarCompra.addEventListener('click', function() {
      window.location.href = "/carrito/";
    });
  }

  // Mostrar productos en la página carrito si corresponde
  if (document.getElementById('items-carrito')) {
    mostrarCarritoEnPagina();
  }

  // Procesar pago con Stripe Checkout
  const btnPagarStripe = document.getElementById('btn-pagar-stripe');
  if (btnPagarStripe) {
    btnPagarStripe.addEventListener('click', async function() {
      const email = prompt("Ingresa tu correo para el recibo de pago:");
      // Validación básica de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        alert("Debes ingresar un correo válido para continuar.");
        return;
      }
      const tipoEntrega = document.getElementById('tipo-entrega').value;
      const metodoPago = document.getElementById('metodo-pago').value;
      if (metodoPago === 'stripe') {
        const carritoEnviar = carrito.map(item => ({
          id: item.id, // <-- aquí el cambio
          nombre: item.name,
          precio_unitario: item.price,
          cantidad: item.cantidad
        }));
        const direccion = localStorage.getItem('direccion_entrega') || "";
        await fetch('/sincronizar_sesion/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            carrito: carritoEnviar,
            direccion: direccion,
            tipo_pago: 'stripe',
            tipo_entrega: tipoEntrega,
            email: email
          })
        });
        // Aquí va el POST real a Stripe
        const resp = await fetch('/stripe_checkout/', { method: 'POST' });
        const data = await resp.json();
        if (data.url) {
          window.location.href = data.url; // Redirige a Stripe Checkout real
        } else {
          alert('Error al iniciar pago con Stripe');
        }
      } else if (metodoPago === 'transferencia') {
        alert('Para transferencias, deposita a la cuenta ... y envía el comprobante a ...');
      }
    });
  }

  // --- ELIMINA el registro de pedido desde el frontend ---
  // Ya no se debe registrar el pedido ni limpiar el carrito aquí.
  // El backend se encarga de registrar el pedido y limpiar el carrito de la sesión.
  // El frontend solo limpia el carrito y actualiza el contador cuando vuelve a pago_exitoso.
});