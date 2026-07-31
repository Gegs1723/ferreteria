// Backend productos: http://localhost:8085/productos

window.ProductosFerramas = {
  productos: [],
  cargados: false,
  cargar: function(callback) {
    fetch('http://localhost:8085/productos')
      .then(r => r.json())
      .then(data => {
        this.productos = data;
        this.cargados = true;
        callback(data);
      })
      .catch(() => {
        this.productos = [];
        this.cargados = false;
        callback([]);
      });
  }
};


// ==== RENDER DE PRODUCTOS ====
function renderProducto(p, categoria) {
  const imgSrc = p.imagen
    ? `data:image/jpeg;base64,${p.imagen}`
    : '/static/imagenes/logo_ferreteria.jpg';
  return `
    <div class="card h-100 shadow-sm product-card">
      <img src="${imgSrc}" class="card-img-top p-3" alt="${p.nombre}" onerror="this.src='/static/imagenes/logo_ferreteria.jpg'">
      <div class="card-body">
        <h5 class="card-title">${p.nombre}</h5>
        <p class="card-text">${p.descripcion || ''}</p>
        <p class="card-text fw-bold text-primary mb-0">
          <span class="precio-multi card-text text-success fw-bold fs-4 mb-0"
            data-precio-clp="${p.precio}"
            data-precio-usd="${p.precioUsd !== undefined ? p.precioUsd : ''}">
            CLP $${p.precio ? p.precio.toLocaleString('es-CL') : '0'}
          </span>
        </p>
        ${p.precioOferta ? `<p class="card-text text-success fw-bold">Oferta: <span class="precio-multi" data-precio-clp="${p.precioOferta}" data-precio-usd="${p.precioOfertaUsd !== undefined ? p.precioOfertaUsd : ''}">CLP $${p.precioOferta.toLocaleString('es-CL')}</span></p>` : ''}
        <span class="badge bg-secondary">${p.marca || ''}</span>
        <button class="btn btn-primary w-100 mt-3 btn-add-to-cart"
                data-id="${p.id}"
                data-name="${p.nombre}"
                data-price="${p.precioOferta || p.precio}"
                data-img="${imgSrc}">
          <i class="fas fa-cart-plus me-2"></i>AÑADIR AL CARRO
        </button>
      </div>
    </div>
  `;
}

// ==== SECCIONES DE PRODUCTOS ====
// Acabados
const categoriasAcabados = [10, 11, 12];
const contenedorAcabados = document.getElementById('api-acabados');
if (contenedorAcabados) {
  window.ProductosFerramas.cargar(function(productos) {
    const acabados = productos.filter(p => categoriasAcabados.includes(Number(p.categoriaId)));
    contenedorAcabados.innerHTML = '';
    if (!acabados.length) {
      contenedorAcabados.innerHTML = '<div class="col-12 text-center text-muted">No hay productos de acabados disponibles.</div>';
      return;
    }
    acabados.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Acabados");
      contenedorAcabados.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Accesorios Varios
const contenedorAccesorios = document.getElementById('api-accesorios-varios');
if (contenedorAccesorios) {
  window.ProductosFerramas.cargar(function(productos) {
    const accesorios = productos.filter(p =>
      p.nombre &&
      (
        p.nombre.toLowerCase().includes('cinturón') ||
        p.nombre.toLowerCase().includes('cinturon') ||
        p.nombre.toLowerCase().includes('cinturones') ||
        p.nombre.toLowerCase().includes('rodillera') ||
        p.nombre.toLowerCase().includes('rodilleras') ||
        p.nombre.toLowerCase().includes('tapón') ||
        p.nombre.toLowerCase().includes('tapon') ||
        p.nombre.toLowerCase().includes('tapones')
      )
    );
    contenedorAccesorios.innerHTML = '';
    if (!accesorios.length) {
      contenedorAccesorios.innerHTML = '<p class="text-center">No hay accesorios varios en la base de datos.</p>';
      return;
    }
    accesorios.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Accesorio");
      contenedorAccesorios.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Arena
const contenedorArena = document.getElementById('api-arena');
if (contenedorArena) {
  window.ProductosFerramas.cargar(function(productos) {
    const arenas = productos.filter(p =>
      p.nombre && p.nombre.toLowerCase().includes('arena')
    );
    contenedorArena.innerHTML = '';
    if (!arenas.length) {
      contenedorArena.innerHTML = '<p class="text-center">No hay arena en la base de datos.</p>';
      return;
    }
    arenas.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Arena");
      contenedorArena.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Barnices
const contenedorBarnices = document.getElementById('api-barnices');
if (contenedorBarnices) {
  window.ProductosFerramas.cargar(function(productos) {
    const barnices = productos.filter(p =>
      p.nombre && p.nombre.toLowerCase().includes('barniz')
    );
    contenedorBarnices.innerHTML = '';
    if (!barnices.length) {
      contenedorBarnices.innerHTML = '<p class="text-center">No hay barnices en la base de datos.</p>';
      return;
    }
    barnices.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Barniz");
      contenedorBarnices.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Cascos
const contenedorCascos = document.getElementById('api-cascos');
if (contenedorCascos) {
  window.ProductosFerramas.cargar(function(productos) {
    const cascos = productos.filter(p =>
      p.nombre && p.nombre.toLowerCase().includes('casco')
    );
    contenedorCascos.innerHTML = '';
    if (!cascos.length) {
      contenedorCascos.innerHTML = '<p class="text-center">No hay cascos en la base de datos.</p>';
      return;
    }
    cascos.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Casco");
      contenedorCascos.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Cemento
const contenedorCemento = document.getElementById('api-cemento');
if (contenedorCemento) {
  window.ProductosFerramas.cargar(function(productos) {
    const cementos = productos.filter(p =>
      p.nombre && p.nombre.toLowerCase().includes('cemento')
    );
    contenedorCemento.innerHTML = '';
    if (!cementos.length) {
      contenedorCemento.innerHTML = '<p class="text-center">No hay cementos en la base de datos.</p>';
      return;
    }
    cementos.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Cemento");
      contenedorCemento.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Cerámicos
const contenedorCeramicos = document.getElementById('api-ceramicos');
if (contenedorCeramicos) {
  window.ProductosFerramas.cargar(function(productos) {
    const ceramicos = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('cerámico') ||
        p.nombre.toLowerCase().includes('ceramico')
      )
    );
    contenedorCeramicos.innerHTML = '';
    if (!ceramicos.length) {
      contenedorCeramicos.innerHTML = '<p class="text-center">No hay cerámicos en la base de datos.</p>';
      return;
    }
    ceramicos.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Cerámico");
      contenedorCeramicos.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Destornilladores
const contenedorDestornilladores = document.getElementById('api-destornilladores');
if (contenedorDestornilladores) {
  window.ProductosFerramas.cargar(function(productos) {
    const destornilladores = productos.filter(p =>
      p.nombre && p.nombre.toLowerCase().includes('destornillador')
    );
    contenedorDestornilladores.innerHTML = '';
    if (!destornilladores.length) {
      contenedorDestornilladores.innerHTML = '<p class="text-center">No hay destornilladores en la base de datos.</p>';
      return;
    }
    destornilladores.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Destornillador");
      contenedorDestornilladores.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Equipos de Medición
const contenedorEquiposMedicion = document.getElementById('api-equipos-medicion');
if (contenedorEquiposMedicion) {
  window.ProductosFerramas.cargar(function(productos) {
    const equipos = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('cinta') ||
        p.nombre.toLowerCase().includes('nivel') ||
        p.nombre.toLowerCase().includes('calibrador') ||
        p.nombre.toLowerCase().includes('calibradores')
      )
    );
    contenedorEquiposMedicion.innerHTML = '';
    if (!equipos.length) {
      contenedorEquiposMedicion.innerHTML = '<p class="text-center">No hay equipos de medición en la base de datos.</p>';
      return;
    }
    equipos.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Equipo de Medición");
      contenedorEquiposMedicion.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Equipos de Seguridad
const contenedorEquiposSeguridad = document.getElementById('api-equipos-seguridad');
if (contenedorEquiposSeguridad) {
  window.ProductosFerramas.cargar(function(productos) {
    const equipos = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('casco') ||
        p.nombre.toLowerCase().includes('cascos') ||
        p.nombre.toLowerCase().includes('guante') ||
        p.nombre.toLowerCase().includes('guantes') ||
        p.nombre.toLowerCase().includes('lente') ||
        p.nombre.toLowerCase().includes('lentes')
      )
    );
    contenedorEquiposSeguridad.innerHTML = '';
    if (!equipos.length) {
      contenedorEquiposSeguridad.innerHTML = '<p class="text-center">No hay equipos de seguridad en la base de datos.</p>';
      return;
    }
    equipos.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Equipo de Seguridad");
      contenedorEquiposSeguridad.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Fijaciones y Adhesivos
const contenedorFijacionesAdhesivos = document.getElementById('api-fijaciones-adhesivos');
if (contenedorFijacionesAdhesivos) {
  window.ProductosFerramas.cargar(function(productos) {
    const filtrados = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('fijacion') ||
        p.nombre.toLowerCase().includes('fijación') ||
        p.nombre.toLowerCase().includes('fijaciones') ||
        p.nombre.toLowerCase().includes('fijador') ||
        p.nombre.toLowerCase().includes('fijadores') ||
        p.nombre.toLowerCase().includes('adhesivo') ||
        p.nombre.toLowerCase().includes('adhesivos')
      )
    );
    contenedorFijacionesAdhesivos.innerHTML = '';
    if (!filtrados.length) {
      contenedorFijacionesAdhesivos.innerHTML = '<p class="text-center">No hay fijaciones ni adhesivos en la base de datos.</p>';
      return;
    }
    filtrados.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Fijación/Adhesivo");
      contenedorFijacionesAdhesivos.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Guantes
const contenedorGuantes = document.getElementById('api-guantes');
if (contenedorGuantes) {
  window.ProductosFerramas.cargar(function(productos) {
    const guantes = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('guante') ||
        p.nombre.toLowerCase().includes('guantes')
      )
    );
    contenedorGuantes.innerHTML = '';
    if (!guantes.length) {
      contenedorGuantes.innerHTML = '<p class="text-center">No hay guantes en la base de datos.</p>';
      return;
    }
    guantes.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Guante");
      contenedorGuantes.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Herramientas Eléctricas
const contenedorHerramientasElectricas = document.getElementById('api-herramientas-electricas');
if (contenedorHerramientasElectricas) {
  window.ProductosFerramas.cargar(function(productos) {
    const herramientas = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('taladro') ||
        p.nombre.toLowerCase().includes('taladros') ||
        p.nombre.toLowerCase().includes('sierra') ||
        p.nombre.toLowerCase().includes('sierras') ||
        p.nombre.toLowerCase().includes('lijadora') ||
        p.nombre.toLowerCase().includes('lijadoras')
      )
    );
    contenedorHerramientasElectricas.innerHTML = '';
    if (!herramientas.length) {
      contenedorHerramientasElectricas.innerHTML = '<p class="text-center">No hay herramientas eléctricas en la base de datos.</p>';
      return;
    }
    herramientas.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Herramienta Eléctrica");
      contenedorHerramientasElectricas.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Herramientas Manuales
const contenedorHerramientasManuales = document.getElementById('api-herramientas-manuales');
if (contenedorHerramientasManuales) {
  window.ProductosFerramas.cargar(function(productos) {
    const herramientas = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('martillo') ||
        p.nombre.toLowerCase().includes('martillos') ||
        p.nombre.toLowerCase().includes('destornillador') ||
        p.nombre.toLowerCase().includes('destornilladores') ||
        p.nombre.toLowerCase().includes('llave') ||
        p.nombre.toLowerCase().includes('llaves')
      )
    );
    contenedorHerramientasManuales.innerHTML = '';
    if (!herramientas.length) {
      contenedorHerramientasManuales.innerHTML = '<p class="text-center">No hay herramientas manuales en la base de datos.</p>';
      return;
    }
    herramientas.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Herramienta Manual");
      contenedorHerramientasManuales.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Materiales de Construcción
const contenedorMaterialesConstruccion = document.getElementById('api-materiales-construccion');
if (contenedorMaterialesConstruccion) {
  window.ProductosFerramas.cargar(function(productos) {
    const materiales = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('cemento') ||
        p.nombre.toLowerCase().includes('arena') ||
        p.nombre.toLowerCase().includes('ladrillo') ||
        p.nombre.toLowerCase().includes('ladrillos')
      )
    );
    contenedorMaterialesConstruccion.innerHTML = '';
    if (!materiales.length) {
      contenedorMaterialesConstruccion.innerHTML = '<p class="text-center">No hay materiales de construcción en la base de datos.</p>';
      return;
    }
    materiales.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Material de Construcción");
      contenedorMaterialesConstruccion.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Productos Destacados (Inicio)
const contenedorDestacados = document.getElementById('api-productos-destacados');
const indicadoresDestacados = document.getElementById('carousel-indicadores-destacados');
if (contenedorDestacados) {
  window.ProductosFerramas.cargar(function(productos) {
    const destacados = productos.filter(p => p.destacado == 1 || p.destacado === true);
    if (!destacados.length) {
      contenedorDestacados.innerHTML = '<div class="carousel-item active"><div class="text-center text-muted py-5">No hay productos destacados disponibles.</div></div>';
      if (indicadoresDestacados) indicadoresDestacados.innerHTML = '';
      return;
    }
    // Agrupa de a 4 productos por slide
    const slides = [];
    for (let i = 0; i < destacados.length; i += 4) {
      const grupo = destacados.slice(i, i + 4);
      slides.push(grupo);
    }
    contenedorDestacados.innerHTML = slides.map((grupo, idx) => `
      <div class="carousel-item${idx === 0 ? ' active' : ''}">
        <div class="row justify-content-center">
          ${grupo.map(p => `
            <div class="col-12 col-sm-6 col-md-4 col-lg-3 mb-3">
              <div class="card h-100 mx-auto" style="width: 18rem;">
                <img src="${p.imagen ? `data:image/jpeg;base64,${p.imagen}` : '/static/imagenes/logo_ferreteria.jpg'}" class="card-img-top" alt="${p.nombre}">
                <div class="card-body">
                  <h5 class="card-title">${p.nombre}</h5>
                  <p class="card-text">${p.descripcion || ''}</p>
                  <p class="card-text fw-bold text-primary mb-0">
                    <span class="precio-multi card-text text-success fw-bold fs-4 mb-0"
                      data-precio-clp="${p.precio}"
                      data-precio-usd="${p.precioUsd !== undefined ? p.precioUsd : ''}">
                      CLP $${p.precio ? p.precio.toLocaleString('es-CL') : '0'}
                    </span>
                  </p>
                  ${p.precioOferta ? `<p class="card-text text-success fw-bold">Oferta: <span class="precio" data-precio="${p.precioOferta}">${p.precioOferta.toLocaleString('es-CL', { style: 'currency', currency: 'CLP' })}</span></p>` : ''}
                  <span class="badge bg-secondary">${p.marca || ''}</span>
                  <button class="btn btn-primary w-100 mt-3 btn-add-to-cart"
                          data-id="${p.id}"
                          data-name="${p.nombre}"
                          data-price="${p.precioOferta || p.precio}"
                          data-img="${p.imagen ? `data:image/jpeg;base64,${p.imagen}` : '/static/imagenes/logo_ferreteria.jpg'}">
                    <i class="fas fa-cart-plus me-2"></i>AÑADIR AL CARRO
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('');
    // Indicadores dinámicos
    if (indicadoresDestacados) {
      indicadoresDestacados.innerHTML = slides.map((_, idx) =>
        `<button type="button" data-bs-target="#carouselDestacados" data-bs-slide-to="${idx}"${idx === 0 ? ' class="active" aria-current="true"' : ''} aria-label="Slide ${idx + 1}"></button>`
      ).join('');
    }
  });
}

// Ladrillos
const contenedorLadrillos = document.getElementById('api-ladrillos');
if (contenedorLadrillos) {
  window.ProductosFerramas.cargar(function(productos) {
    const ladrillos = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('ladrillo') ||
        p.nombre.toLowerCase().includes('ladrillos')
      )
    );
    contenedorLadrillos.innerHTML = '';
    if (!ladrillos.length) {
      contenedorLadrillos.innerHTML = '<p class="text-center">No hay ladrillos en la base de datos.</p>';
      return;
    }
    ladrillos.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Ladrillo");
      contenedorLadrillos.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Lentes de Seguridad
const contenedorLentes = document.getElementById('api-lentes-seguridad');
if (contenedorLentes) {
  window.ProductosFerramas.cargar(function(productos) {
    const lentes = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('lente') ||
        p.nombre.toLowerCase().includes('lentes')
      )
    );
    contenedorLentes.innerHTML = '';
    if (!lentes.length) {
      contenedorLentes.innerHTML = '<p class="text-center">No hay lentes de seguridad en la base de datos.</p>';
      return;
    }
    lentes.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Lente de Seguridad");
      contenedorLentes.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Lijadoras
const contenedorLijadoras = document.getElementById('api-lijadoras');
if (contenedorLijadoras) {
  window.ProductosFerramas.cargar(function(productos) {
    const lijadoras = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('lijadora') ||
        p.nombre.toLowerCase().includes('lijadoras')
      )
    );
    contenedorLijadoras.innerHTML = '';
    if (!lijadoras.length) {
      contenedorLijadoras.innerHTML = '<p class="text-center">No hay lijadoras en la base de datos.</p>';
      return;
    }
    lijadoras.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Lijadora");
      contenedorLijadoras.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Llaves
const contenedorLlaves = document.getElementById('api-llaves');
if (contenedorLlaves) {
  window.ProductosFerramas.cargar(function(productos) {
    const llaves = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('llave') ||
        p.nombre.toLowerCase().includes('llaves')
      )
    );
    contenedorLlaves.innerHTML = '';
    if (!llaves.length) {
      contenedorLlaves.innerHTML = '<p class="text-center">No hay llaves en la base de datos.</p>';
      return;
    }
    llaves.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Llave");
      contenedorLlaves.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Martillos
const contenedorMartillos = document.getElementById('api-martillos');
if (contenedorMartillos) {
  window.ProductosFerramas.cargar(function(productos) {
    const martillos = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('martillo') ||
        p.nombre.toLowerCase().includes('martillos')
      )
    );
    contenedorMartillos.innerHTML = '';
    if (!martillos.length) {
      contenedorMartillos.innerHTML = '<p class="text-center">No hay martillos en la base de datos.</p>';
      return;
    }
    martillos.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Martillo");
      contenedorMartillos.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Pinturas
const contenedorPinturas = document.getElementById('api-pinturas');
if (contenedorPinturas) {
  window.ProductosFerramas.cargar(function(productos) {
    const pinturas = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('pintura') ||
        p.nombre.toLowerCase().includes('pinturas')
      )
    );
    contenedorPinturas.innerHTML = '';
    if (!pinturas.length) {
      contenedorPinturas.innerHTML = '<p class="text-center">No hay pinturas en la base de datos.</p>';
      return;
    }
    pinturas.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Pintura");
      contenedorPinturas.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Sierras
const contenedorSierras = document.getElementById('api-sierras');
if (contenedorSierras) {
  window.ProductosFerramas.cargar(function(productos) {
    const sierras = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('sierra') ||
        p.nombre.toLowerCase().includes('sierras')
      )
    );
    contenedorSierras.innerHTML = '';
    if (!sierras.length) {
      contenedorSierras.innerHTML = '<p class="text-center">No hay sierras en la base de datos.</p>';
      return;
    }
    sierras.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Sierra");
      contenedorSierras.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Taladros
const contenedorTaladros = document.getElementById('api-taladros');
if (contenedorTaladros) {
  window.ProductosFerramas.cargar(function(productos) {
    const taladros = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('taladro') ||
        p.nombre.toLowerCase().includes('taladros')
      )
    );
    contenedorTaladros.innerHTML = '';
    if (!taladros.length) {
      contenedorTaladros.innerHTML = '<p class="text-center">No hay taladros en la base de datos.</p>';
      return;
    }
    taladros.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Taladro");
      contenedorTaladros.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}

// Tornillos y Anclajes
const contenedorTornillosAnclajes = document.getElementById('api-tornillos-anclajes');
if (contenedorTornillosAnclajes) {
  window.ProductosFerramas.cargar(function(productos) {
    const filtrados = productos.filter(p =>
      p.nombre && (
        p.nombre.toLowerCase().includes('tornillo') ||
        p.nombre.toLowerCase().includes('tornillos') ||
        p.nombre.toLowerCase().includes('anclaje') ||
        p.nombre.toLowerCase().includes('anclajes')
      )
    );
    contenedorTornillosAnclajes.innerHTML = '';
    if (!filtrados.length) {
      contenedorTornillosAnclajes.innerHTML = '<p class="text-center">No hay tornillos ni anclajes en la base de datos.</p>';
      return;
    }
    filtrados.forEach(p => {
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = renderProducto(p, "Tornillo/Anclaje");
      contenedorTornillosAnclajes.appendChild(col);
    });
    actualizarPreciosMoneda();
  });
}



document.addEventListener('DOMContentLoaded', function() {
  const formBusqueda = document.getElementById('form-busqueda');
  if (formBusqueda) {
    formBusqueda.addEventListener('submit', function(e) {
      e.preventDefault();
      const input = document.getElementById('input-busqueda');
      const valor = input.value.trim();
      if (valor) {
        window.location.href = "/resultados?q=" + encodeURIComponent(valor);
        // Si usas Django con nombre de url, reemplaza la línea anterior por:
        // window.location.href = "{% url 'resultados_busqueda' %}?q=" + encodeURIComponent(valor);
      }
    });
  }

  const params = new URLSearchParams(window.location.search);
  const q = params.get("q") || "";
  const infoDiv = document.getElementById("busqueda-info");
  infoDiv.innerHTML = q
    ? `<span class="fs-5">Mostrando resultados para: <strong>${q}</strong></span>`
    : '<span class="text-danger">No se ingresó término de búsqueda.</span>';

  let productosOriginales = [];

  function renderProductosBusqueda(lista) {
    const contenedorBusqueda = document.getElementById('busqueda-productos');
    contenedorBusqueda.innerHTML = '';
    if (lista.length === 0) {
      contenedorBusqueda.innerHTML = '<p class="text-center">No se encontraron productos para tu búsqueda.</p>';
      return;
    }
    lista.forEach(p => {
      const imgSrc = p.imagen
        ? `data:image/jpeg;base64,${p.imagen}`
        : '/static/imagenes/logo_ferreteria.jpg';
      const col = document.createElement('div');
      col.className = 'col-md-6 col-lg-3';
      col.innerHTML = `
        <div class="card h-100 shadow-sm product-card">
          <img src="${imgSrc}" class="card-img-top p-3" alt="${p.nombre}" onerror="this.src='/static/imagenes/logo_ferreteria.jpg'">
          <div class="card-body">
            <h5 class="card-title">${p.nombre}</h5>
            <p class="mb-1 text-muted">${p.marca ? p.marca : ''}</p>
            <p class="mb-2 small">${p.categoria ? p.categoria : ''}</p>
            <div class="d-flex justify-content-between align-items-center">
              <span class="precio-multi card-text text-success fw-bold fs-4 mb-0"
                data-precio-clp="${p.precio}"
                data-precio-usd="${p.precioUsd !== undefined ? p.precioUsd : ''}">
                CLP $${p.precio ? p.precio.toLocaleString('es-CL') : '0'}
              </span>
            </div>
            <button class="btn btn-primary w-100 mt-3 btn-add-to-cart"
                    data-id="${p.id}"
                    data-name="${p.nombre}"
                    data-price="${p.precio}"
                    data-img="${imgSrc}">
              <i class="fas fa-cart-plus me-2"></i>AÑADIR AL CARRO
            </button>
          </div>
        </div>
      `;
      contenedorBusqueda.appendChild(col);
    });
    actualizarPreciosMoneda();
    document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
      btn.addEventListener('click', function() {
        // Aquí puedes llamar a tu función para agregar al carrito
        // Por ejemplo: addToCart(this.dataset)
      });
    });
  }

  function filtrarYOrdenarBusqueda() {
    let lista = [...productosOriginales];

    // Filtro por marca
    const marca = document.getElementById('filtro-marca').value;
    if (marca) {
      lista = lista.filter(p => (p.marca || '').toLowerCase() === marca.toLowerCase());
    }

    // Filtro por categoría
    const categoria = document.getElementById('filtro-categoria').value;
    if (categoria) {
      lista = lista.filter(p => (p.categoria || '').toLowerCase() === categoria.toLowerCase());
    }

    // Ordenar
    const orden = document.getElementById('ordenar-por').value;
    if (orden === 'precio_asc') {
      lista.sort((a, b) => (a.precio || 0) - (b.precio || 0));
    } else if (orden === 'precio_desc') {
      lista.sort((a, b) => (b.precio || 0) - (a.precio || 0));
    } else if (orden === 'nombre_asc') {
      lista.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));
    } else if (orden === 'nombre_desc') {
      lista.sort((a, b) => (b.nombre || '').localeCompare(a.nombre || ''));
    }
    renderProductosBusqueda(lista);
  }

  function llenarFiltrosBusqueda(productos) {
    // Marcas únicas
    const marcas = [...new Set(productos.map(p => p.marca).filter(Boolean))];
    const selectMarca = document.getElementById('filtro-marca');
    marcas.forEach(m => {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      selectMarca.appendChild(opt);
    });

    // Categorías únicas
    const categorias = [...new Set(productos.map(p => p.categoria).filter(Boolean))];
    const selectCategoria = document.getElementById('filtro-categoria');
    categorias.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      selectCategoria.appendChild(opt);
    });
  }

  if (q) {
    fetch('http://localhost:8085/productos') // <-- Cambia 8083 por 8085
      .then(res => res.json())
      .then(productos => {
        productosOriginales = productos.filter(p =>
          (p.nombre && p.nombre.toLowerCase().includes(q.toLowerCase())) ||
          (p.descripcion && p.descripcion.toLowerCase().includes(q.toLowerCase()))
        );
        llenarFiltrosBusqueda(productosOriginales);
        filtrarYOrdenarBusqueda();
      })
      .catch(() => {
        contenedorBusqueda.innerHTML = '<p class="text-danger">Error al buscar productos.</p>';
      });

    document.getElementById('filtro-marca').addEventListener('change', filtrarYOrdenarBusqueda);
    document.getElementById('filtro-categoria').addEventListener('change', filtrarYOrdenarBusqueda);
    document.getElementById('ordenar-por').addEventListener('change', filtrarYOrdenarBusqueda);
    document.getElementById('btn-limpiar-filtros').addEventListener('click', function() {
      document.getElementById('filtro-marca').value = '';
      document.getElementById('filtro-categoria').value = '';
      document.getElementById('ordenar-por').value = 'relevancia';
      filtrarYOrdenarBusqueda();
    });
  }
})