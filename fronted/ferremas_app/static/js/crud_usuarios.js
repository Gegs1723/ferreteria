const API_URL = "http://localhost:8084/api/auth/usuarios";

// Cargar usuarios al iniciar
document.addEventListener("DOMContentLoaded", listarUsuarios);

// Listar usuarios
function listarUsuarios() {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No hay token de autenticación. Por favor, inicia sesión.");
        return;
    }
    fetch(API_URL, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(usuarios => {
        const tbody = document.getElementById("tabla-usuarios");
        tbody.innerHTML = "";
        usuarios.forEach(usuario => {
            tbody.innerHTML += `
                <tr>
                    <td>${usuario.id}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario('${usuario.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario('${usuario.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                    <td>${usuario.nombre || ""}</td>
                    <td>${usuario.apellido || ""}</td>
                    <td>${usuario.email || ""}</td>
                    <td>${usuario.telefono || ""}</td>
                    <td>${usuario.fechaNacimiento ? usuario.fechaNacimiento.substring(0,10) : ""}</td>
                    <td>${usuario.direccion || ""}</td>
                    <td>${usuario.tipoCliente || ""}</td>
                    <td>${usuario.newsletter ? "Sí" : "No"}</td>
                    <td>${usuario.rol || (usuario.roles && usuario.roles.length > 0 ? usuario.roles[0].nombre : '')}</td>
                </tr>
            `;
        });
    });
}

// Crear o actualizar usuario
document.getElementById("form-usuario").addEventListener("submit", function(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No hay token de autenticación. Por favor, inicia sesión.");
        return;
    }
    const id = document.getElementById("usuario-id").value;
    const datos = {
        nombre: document.getElementById("usuario-nombre").value,
        apellido: document.getElementById("usuario-apellido").value,
        email: document.getElementById("usuario-email").value,
        password: document.getElementById("usuario-password").value,
        telefono: document.getElementById("usuario-telefono").value,
        fechaNacimiento: document.getElementById("usuario-fecha-nacimiento").value,
        direccion: document.getElementById("usuario-direccion").value,
        tipoCliente: document.getElementById("usuario-tipo-cliente").value,
        newsletter: document.getElementById("usuario-newsletter").value === "true",
        rol: document.getElementById("usuario-rol").value
    };

    if (id) {
        // Editar
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(datos)
        }).then(() => {
            this.reset();
            listarUsuarios();
        });
    } else {
        // Crear
        fetch(`${API_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(datos)
        }).then(() => {
            this.reset();
            listarUsuarios();
        });
    }
});

// Editar usuario (cargar datos en el formulario)
window.editarUsuario = function(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No hay token de autenticación. Por favor, inicia sesión.");
        return;
    }
    fetch(`${API_URL}/${id}`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(usuario => {
        document.getElementById("usuario-id").value = usuario.id;
        document.getElementById("usuario-nombre").value = usuario.nombre || "";
        document.getElementById("usuario-apellido").value = usuario.apellido || "";
        document.getElementById("usuario-email").value = usuario.email || "";
        document.getElementById("usuario-password").value = "";
        document.getElementById("usuario-telefono").value = usuario.telefono || "";
        document.getElementById("usuario-fecha-nacimiento").value = usuario.fechaNacimiento ? usuario.fechaNacimiento.substring(0,10) : "";
        document.getElementById("usuario-direccion").value = usuario.direccion || "";
        document.getElementById("usuario-tipo-cliente").value = usuario.tipoCliente || "";
        document.getElementById("usuario-newsletter").value = usuario.newsletter ? "true" : "false";
        document.getElementById("usuario-rol").value = usuario.rol || "";
    });
}

// Eliminar usuario
window.eliminarUsuario = function(id) {
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No hay token de autenticación. Por favor, inicia sesión.");
        return;
    }
    if (confirm("¿Seguro que deseas eliminar este usuario?")) {
        fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        })
        .then(() => listarUsuarios());
    }
}

// Buscador de usuarios
document.getElementById("form-busqueda-usuarios").addEventListener("submit", function(e) {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
        alert("No hay token de autenticación. Por favor, inicia sesión.");
        return;
    }
    const q = document.getElementById("buscador-usuarios").value.toLowerCase();
    fetch(API_URL, {
        headers: {
            "Authorization": "Bearer " + token
        }
    })
    .then(res => res.json())
    .then(usuarios => {
        const tbody = document.getElementById("tabla-usuarios");
        tbody.innerHTML = "";
        usuarios.filter(u =>
            (u.nombre && u.nombre.toLowerCase().includes(q)) ||
            (u.apellido && u.apellido.toLowerCase().includes(q)) ||
            (u.email && u.email.toLowerCase().includes(q))
        ).forEach(usuario => {
            tbody.innerHTML += `
                <tr>
                    <td>${usuario.id}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario('${usuario.id}')"><i class="fas fa-edit"></i></button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario('${usuario.id}')"><i class="fas fa-trash"></i></button>
                    </td>
                    <td>${usuario.nombre || ""}</td>
                    <td>${usuario.apellido || ""}</td>
                    <td>${usuario.email || ""}</td>
                    <td>${usuario.telefono || ""}</td>
                    <td>${usuario.fechaNacimiento ? usuario.fechaNacimiento.substring(0,10) : ""}</td>
                    <td>${usuario.direccion || ""}</td>
                    <td>${usuario.tipoCliente || ""}</td>
                    <td>${usuario.newsletter ? "Sí" : "No"}</td>
                    <td>${usuario.rol || (usuario.roles && usuario.roles.length > 0 ? usuario.roles[0].nombre : '')}</td>
                </tr>
            `;
        });
    });
});

// Limpiar búsqueda
document.getElementById("btn-limpiar-busqueda-usuarios").addEventListener("click", function() {
    document.getElementById("buscador-usuarios").value = "";
    listarUsuarios();
});