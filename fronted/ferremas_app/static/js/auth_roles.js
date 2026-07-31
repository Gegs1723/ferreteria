// ======= login.js =======
const loginForm = document.getElementById("login-form");
if (loginForm) {
    loginForm.addEventListener("submit", async function(e) {
        e.preventDefault();

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch("http://localhost:8084/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            const data = await response.json();
            // Soporta roles como string o array
            let roles = Array.isArray(data.rol) ? data.rol : [data.rol];
            localStorage.setItem("token", data.token);
            localStorage.setItem("nombre", data.nombre);
            localStorage.setItem("email", data.usuario);
            localStorage.setItem("roles", JSON.stringify(roles));

            // Sincroniza con la sesión de Django
            await fetch("/sincronizar_sesion/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nombre: data.nombre, rol: roles[0], email: data.usuario }) // <--- AGREGA email
            });

            window.location.href = "/";
        } else {
            alert("Credenciales incorrectas o error de autenticación.");
        }
    });
}

// ======= header_usuario.js =======
window.addEventListener("DOMContentLoaded", function() {
    const nombre = localStorage.getItem("nombre");
    const email = localStorage.getItem("email");
    const rolesRaw = localStorage.getItem("roles");
    let roles = [];
    try {
        roles = rolesRaw ? JSON.parse(rolesRaw) : [];
    } catch (e) {
        roles = [];
    }

    // Header usuario
    const usuarioHeader = document.getElementById("usuario-header");
    const nombreUsuario = document.getElementById("nombre-usuario");
    const rolUsuario = document.getElementById("rol-usuario");
    const loginLink = document.getElementById("login-link");
    const logoutLink = document.getElementById("logout-link");
    const registerLink = document.getElementById("register-link");

    if ((nombre || email) && usuarioHeader && nombreUsuario && rolUsuario) {
        usuarioHeader.style.display = "inline";
        nombreUsuario.textContent = nombre || email;
        rolUsuario.textContent = roles.length > 0 ? roles.join(", ") : "";
        if (loginLink) loginLink.style.display = "none";
        if (logoutLink) logoutLink.style.display = "inline";
        if (registerLink) registerLink.style.display = "none";
    } else {
        if (usuarioHeader) usuarioHeader.style.display = "none";
        if (loginLink) loginLink.style.display = "inline";
        if (logoutLink) logoutLink.style.display = "none";
        if (registerLink) registerLink.style.display = "inline";
    }

    // Menús por rol
    const menuAdminUsuarios = document.getElementById("menu-admin-usuarios");
    const menuAdminInventario = document.getElementById("menu-admin-inventario");
    const menuVendedorPedidos = document.getElementById("menu-vendedor-pedidos");
    const menuVendedorClientes = document.getElementById("menu-vendedor-clientes");
    const menuBodegueroPedidos = document.getElementById("menu-bodeguero-pedidos");
    const menuBodegueroClientes = document.getElementById("menu-bodeguero-clientes");
    const menuBodegueroRegistrar = document.getElementById("menu-bodeguero-registrar");
    const menuContadorPagos = document.getElementById("menu-contador-pagos");
    const menuClienteCompras = document.getElementById("menu-cliente-compras");
    // Catálogo
    const menuCatalogoHerramientas = document.getElementById("menu-catalogo-herramientas");
    const menuCatalogoMateriales = document.getElementById("menu-catalogo-materiales");
    const menuCatalogoTornillos = document.getElementById("menu-catalogo-tornillos");
    const menuCatalogoFijaciones = document.getElementById("menu-catalogo-fijaciones");
    const menuCatalogoMedicion = document.getElementById("menu-catalogo-medicion");

    // Oculta todos los menús especiales por defecto
    if (menuVendedorPedidos) menuVendedorPedidos.style.display = "none";
    if (menuVendedorClientes) menuVendedorClientes.style.display = "none";
    if (menuBodegueroPedidos) menuBodegueroPedidos.style.display = "none";
    if (menuBodegueroClientes) menuBodegueroClientes.style.display = "none";
    if (menuBodegueroRegistrar) menuBodegueroRegistrar.style.display = "none";
    if (menuContadorPagos) menuContadorPagos.style.display = "none";
    if (menuClienteCompras) menuClienteCompras.style.display = "none";

    // Por defecto, el catálogo SIEMPRE visible (para cliente y no logueado)
    if (menuCatalogoHerramientas) menuCatalogoHerramientas.style.display = "block";
    if (menuCatalogoMateriales) menuCatalogoMateriales.style.display = "block";
    if (menuCatalogoTornillos) menuCatalogoTornillos.style.display = "block";
    if (menuCatalogoFijaciones) menuCatalogoFijaciones.style.display = "block";
    if (menuCatalogoMedicion) menuCatalogoMedicion.style.display = "block";

    // Si está logueado y NO es cliente, oculta el catálogo
    if (roles.length > 0 && !roles.includes("CLIENTE")) {
        if (menuCatalogoHerramientas) menuCatalogoHerramientas.style.display = "none";
        if (menuCatalogoMateriales) menuCatalogoMateriales.style.display = "none";
        if (menuCatalogoTornillos) menuCatalogoTornillos.style.display = "none";
        if (menuCatalogoFijaciones) menuCatalogoFijaciones.style.display = "none";
        if (menuCatalogoMedicion) menuCatalogoMedicion.style.display = "none";
    }

    // Muestra solo lo del rol
    if (roles.includes("ADMIN")) {
        if (menuAdminUsuarios) menuAdminUsuarios.style.display = "block";
        if (menuAdminInventario) menuAdminInventario.style.display = "block";
    }
    if (roles.includes("VENDEDOR")) {
        if (menuVendedorPedidos) menuVendedorPedidos.style.display = "block";
        if (menuVendedorClientes) menuVendedorClientes.style.display = "block";
    }
    if (roles.includes("BODEGUERO")) {
        if (menuBodegueroPedidos) menuBodegueroPedidos.style.display = "block";
        if (menuBodegueroClientes) menuBodegueroClientes.style.display = "block";
        if (menuBodegueroRegistrar) menuBodegueroRegistrar.style.display = "block";
    }
    if (roles.includes("CONTADOR")) {
        if (menuContadorPagos) menuContadorPagos.style.display = "block";
    }
    if (roles.includes("CLIENTE")) {
        if (menuClienteCompras) menuClienteCompras.style.display = "block";
        // El catálogo ya está visible por defecto
    }

    // Logout
    if (logoutLink) {
        logoutLink.onclick = function(e) {
            e.preventDefault();
            fetch('/cerrar_sesion/', { method: 'POST', credentials: 'same-origin' })
                .finally(() => {
                    localStorage.removeItem("token");
                    localStorage.removeItem("nombre");
                    localStorage.removeItem("email");
                    localStorage.removeItem("roles");
                    window.location.href = "/";
                });
        };
    }
});
