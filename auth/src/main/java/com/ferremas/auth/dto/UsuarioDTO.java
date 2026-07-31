package com.ferremas.auth.dto;

import java.util.Date;

public class UsuarioDTO {
    public String email;
    public String password;
    public String nombre;
    public String apellido;
    public String telefono;
    public Date fechaNacimiento;
    public String direccion;
    public String tipoCliente;
    public Boolean newsletter;
    public String rol; // Opcional, si quieres manejar roles desde el frontend
}
