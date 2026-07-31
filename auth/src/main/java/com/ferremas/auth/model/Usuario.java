package com.ferremas.auth.model;

import jakarta.persistence.*;
import lombok.Data; // <-- Asegúrate de importar esto
import java.util.*;

@Entity
@Table(name = "usuarios")
@Data // <-- ESTA LÍNEA AGREGA TODOS LOS GETTERS Y SETTERS AUTOMÁTICAMENTE
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nombre;
    private String apellido;
    private Boolean activo = true;
    private Date fechaRegistro = new Date();

    // Nuevos campos
    private String telefono;
    private Date fechaNacimiento;
    private String direccion;
    private String tipoCliente;
    private Boolean newsletter;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "usuario_roles",
        joinColumns = @JoinColumn(name = "usuario_id"),
        inverseJoinColumns = @JoinColumn(name = "rol_id")
    )
    private Set<Rol> roles = new HashSet<>();

    // getters y setters

    // Suponiendo que Usuario tiene una lista de roles y quieres enviar el primero
    public String getRol() {
        return roles != null && !roles.isEmpty()
            ? roles.iterator().next().getNombre() // <-- Usa iterator para Set
            : "CLIENTE";
    }
}
