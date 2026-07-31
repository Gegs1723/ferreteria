const API_URL = "http://localhost:8085/productos";

// Mapeo de IDs a nombres de categoría
const categorias = {
  1: "Martillos",
  2: "Destornilladores",
  3: "Llaves",
  4: "Taladros",
  5: "Sierras",
  6: "Lijadoras",
  7: "Cemento",
  8: "Arena",
  9: "Ladrillos",
  10: "Pinturas",
  11: "Barnices",
  12: "Cerámicos",
  13: "Cascos",
  14: "Guantes",
  15: "Lentes de Seguridad",
  16: "Accesorios Varios",
  17: "Tornillos y Anclajes",
  18: "Fijaciones y Adhesivos",
  19: "Equipos de Medición",
  20: "Herramientas Manuales",
  21: "Herramientas Eléctricas",
  22: "Materiales de Construcción",
  23: "Equipos de Seguridad",
};

// Autoselección de categoría según la descripción
const descInput = document.getElementById("producto-descripcion");
if (descInput) {
  descInput.addEventListener("input", function () {
    const desc = this.value.toLowerCase();
    const select = document.getElementById("producto-categoria");
    if (desc.includes("martillo")) select.value = "1";
    else if (desc.includes("destornillador")) select.value = "2";
    else if (desc.includes("llave")) select.value = "3";
    else if (desc.includes("taladro")) select.value = "4";
    else if (desc.includes("sierra")) select.value = "5";
    else if (desc.includes("lijadora")) select.value = "6";
    else if (desc.includes("cemento")) select.value = "7";
    else if (desc.includes("arena")) select.value = "8";
    else if (desc.includes("ladrillo")) select.value = "9";
    else if (desc.includes("pintura")) select.value = "10";
    else if (desc.includes("barniz")) select.value = "11";
    else if (desc.includes("cerámico")) select.value = "12";
    else if (desc.includes("casco")) select.value = "13";
    else if (desc.includes("guante")) select.value = "14";
    else if (desc.includes("lente")) select.value = "15";
    else if (desc.includes("accesorio")) select.value = "16";
    else if (desc.includes("tornillo") || desc.includes("anclaje"))
      select.value = "17";
    else if (desc.includes("fijacion") || desc.includes("adhesivo"))
      select.value = "18";
    else if (desc.includes("medicion")) select.value = "19";
    else select.value = "";
  });
}

let productosGlobal = [];
let paginaActual = 1;
const productosPorPagina = 10;

// Renderiza la tabla según la página
function renderTablaProductos() {
  const tbody = document.getElementById("tabla-productos");
  tbody.innerHTML = "";
  const inicio = (paginaActual - 1) * productosPorPagina;
  const fin = inicio + productosPorPagina;
  const productosPagina = productosGlobal.slice(inicio, fin);

  productosPagina.forEach((p) => {
    const fila = document.createElement("tr");
    fila.innerHTML = `
      <td>${p.id}</td>
      <td>
        <button class="btn btn-warning btn-sm me-2" onclick="editarProducto(${p.id})">Editar</button>
        <button class="btn btn-danger btn-sm" onclick="eliminarProducto(${p.id})">Eliminar</button>
      </td>
      <td>${p.nombre}</td>
      <td>${p.descripcion || ""}</td>
      <td>
        ${
          p.imagen
            ? `<img src="data:image/jpeg;base64,${p.imagen}" alt="${p.nombre}" width="60">`
            : `<img src="/static/imagenes/logo_ferreteria.jpg" alt="Logo Ferretería" width="60">`
        }
      </td>
      <td>${categorias[p.categoriaId] || "Sin categoría"}</td>
      <td>${p.estado ?? ""}</td>
      <td>${p.stock ?? ""}</td>
      <td>${p.marca || ""}</td>
      <td>${p.modelo || ""}</td>
      <td>${p.codigoBarras || ""}</td>
      <td>${p.proveedor || ""}</td>
      <td>${p.color || ""}</td>
      <td>${p.tamano || ""}</td>
      <td>${p.unidadMedida || ""}</td>
      <td>${p.ubicacion || ""}</td>
      <td>
        <span class="precio-multi"
          data-precio-clp="${p.precio}"
          data-precio-usd="${p.precioUsd !== undefined ? p.precioUsd : ''}">
          CLP $${p.precio.toLocaleString('es-CL')}
        </span>
      </td>
      <td>
        <span class="precio-multi"
          data-precio-clp="${p.precioOferta || ''}"
          data-precio-usd="${p.precioOfertaUsd !== undefined ? p.precioOfertaUsd : ''}">
          ${p.precioOferta ? `CLP $${p.precioOferta.toLocaleString('es-CL')}` : ''}
        </span>
      </td>
      <td>${p.oferta ? "Sí" : "No"}</td>
      <td>${p.destacado ? "Sí" : "No"}</td>
    `;
    tbody.appendChild(fila);
  });

  renderPaginacion();
  if (typeof actualizarPreciosMoneda === "function") {
    actualizarPreciosMoneda();
  }
}

// Renderiza los botones de paginación
function renderPaginacion() {
  let paginacion = document.getElementById("paginacion-productos");
  if (!paginacion) {
    paginacion = document.createElement("div");
    paginacion.id = "paginacion-productos";
    paginacion.className = "my-3 d-flex justify-content-center";
    document.querySelector(".table-responsive").appendChild(paginacion);
  }
  const totalPaginas = Math.ceil(productosGlobal.length / productosPorPagina);
  let html = "";
  for (let i = 1; i <= totalPaginas; i++) {
    html += `<button class="btn btn-sm ${
      i === paginaActual ? "btn-primary" : "btn-outline-primary"
    } mx-1" onclick="cambiarPagina(${i})">${i}</button>`;
  }
  paginacion.innerHTML = html;
}

window.cambiarPagina = function (num) {
  paginaActual = num;
  renderTablaProductos();
};

function cargarProductos() {
  fetch(API_URL)
    .then((r) => r.json())
    .then((productos) => {
      productosGlobal = productos;
      paginaActual = 1;
      renderTablaProductos();
    })
    .catch(() => {
      document.getElementById("tabla-productos").innerHTML =
        '<tr><td colspan="9" class="text-danger">Error al cargar productos.</td></tr>';
    });
}

const formProducto = document.getElementById("form-producto");
if (formProducto) {
  formProducto.onsubmit = function (e) {
    e.preventDefault();
    // Validación de categoría
    const categoria = document.getElementById("producto-categoria").value;
    if (!categoria || isNaN(Number(categoria))) {
      alert("Selecciona una categoría válida.");
      return false;
    }
    const formData = new FormData(this);
    const imagenInput = document.getElementById("producto-imagen");
    if (imagenInput.files.length) {
      formData.append("imagen", imagenInput.files[0]);
    } // Si no hay archivo, NO agregues nada a formData
    let url = API_URL;
    let method = "POST";
    const id = document.getElementById("producto-id").value;
    if (id) {
      url += "/" + id;
      method = "PATCH"; // Usar PATCH para actualizar
    }
    fetch(url, {
      method: method,
      body: formData,
    })
      .then((r) => r.json())
      .then(() => {
        this.reset();
        cargarProductos();
        document.getElementById("btn-guardar").textContent = "Agregar";
      })
      .catch(() => alert("Error al guardar producto"));
  };
}

window.editarProducto = function (id) {
  fetch(API_URL + "/" + id)
    .then((r) => r.json())
    .then((p) => {
      document.getElementById("producto-id").value = p.id;
      document.getElementById("btn-guardar").textContent = "Actualizar";
      document.getElementById("producto-nombre").value = p.nombre;
      document.getElementById("producto-descripcion").value = p.descripcion;
      document.getElementById("producto-precio").value = p.precio;
      document.getElementById("producto-stock").value = p.stock;
      document.getElementById("producto-estado").value = p.estado;
      document.getElementById("producto-categoria").value = p.categoriaId;
      document.getElementById("producto-marca").value = p.marca || "";
      document.getElementById("producto-modelo").value = p.modelo || "";
      document.getElementById("producto-unidad").value = p.unidadMedida || "";
      document.getElementById("producto-codigo-barras").value =
        p.codigoBarras || "";
      document.getElementById("producto-proveedor").value = p.proveedor || "";
      document.getElementById("producto-ubicacion").value = p.ubicacion || "";
      document.getElementById("producto-precio-oferta").value =
        p.precioOferta || "";
      document.getElementById("producto-oferta").value = p.oferta ? "1" : "0";
      document.getElementById("producto-destacado").value = p.destacado
        ? "1"
        : "0";
      document.getElementById("producto-color").value = p.color || "";
      document.getElementById("producto-tamano").value = p.tamano || "";
    })
    .catch(() => alert("Error al cargar el producto"));
};

window.eliminarProducto = function (id) {
  if (!confirm("¿Seguro que deseas eliminar este producto?")) return;
  fetch(API_URL + "/" + id, { method: "DELETE" })
    .then(() => cargarProductos())
    .catch(() => alert("Error al eliminar producto"));
};

cargarProductos();

// Buscador conectado al backend
const formBusqueda = document.getElementById("form-busqueda-productos");
const buscador = document.getElementById("buscador-productos");
const btnLimpiar = document.getElementById("btn-limpiar-busqueda");

if (formBusqueda && buscador) {
  formBusqueda.addEventListener("submit", function (e) {
    e.preventDefault();
    const query = buscador.value.trim();
    if (query.length === 0) {
      cargarProductos();
      return;
    }
    fetch(`${API_URL}/buscar?query=${encodeURIComponent(query)}`)
      .then((r) => r.json())
      .then((productos) => {
        if (!Array.isArray(productos)) {
          productosGlobal = [];
          renderTablaProductos();
          alert("Error en la búsqueda. El servidor no devolvió una lista.");
          return;
        }
        productosGlobal = productos;
        paginaActual = 1;
        renderTablaProductos();
      })
      .catch(() => {
        document.getElementById("tabla-productos").innerHTML =
          '<tr><td colspan="9" class="text-danger">Error al buscar productos.</td></tr>';
      });
  });

  // Botón limpiar búsqueda
  btnLimpiar.addEventListener("click", function () {
    buscador.value = "";
    cargarProductos();
  });
}
