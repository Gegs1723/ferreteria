package com.ferremas.auth.service;

import com.ferremas.auth.dto.UsuarioDTO;
import com.ferremas.auth.model.Rol;
import com.ferremas.auth.model.Usuario;
import com.ferremas.auth.repository.RolRepository;
import com.ferremas.auth.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class UsuarioService {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RolRepository rolRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public Usuario registrar(UsuarioDTO dto) {
        Usuario usuario = new Usuario();
        usuario.setEmail(dto.email);
        usuario.setPassword(passwordEncoder.encode(dto.password));
        usuario.setNombre(dto.nombre);
        usuario.setApellido(dto.apellido);
        usuario.setTelefono(dto.telefono);
        usuario.setFechaNacimiento(dto.fechaNacimiento);
        usuario.setDireccion(dto.direccion);
        usuario.setTipoCliente(dto.tipoCliente);
        usuario.setNewsletter(dto.newsletter);

        Rol rol = rolRepository.findByNombre("CLIENTE").orElseGet(() -> {
            Rol nuevoRol = new Rol();
            nuevoRol.setNombre("CLIENTE");
            return rolRepository.save(nuevoRol);
        });
        usuario.getRoles().add(rol);

        return usuarioRepository.save(usuario);
    }

    public Optional<Usuario> login(String email, String password) {
        System.out.println("Email recibido: '" + email + "'");
        System.out.println("Password recibido: '" + password + "'");
        Optional<Usuario> usuarioOpt = usuarioRepository.findByEmail(email);
        if (usuarioOpt.isPresent()) {
            System.out.println("Usuario encontrado: " + usuarioOpt.get().getEmail());
            if (passwordEncoder.matches(password, usuarioOpt.get().getPassword())) {
                System.out.println("Contraseña correcta");
                return usuarioOpt;
            } else {
                System.out.println("Contraseña incorrecta");
            }
        } else {
            System.out.println("Usuario no encontrado");
        }
        return Optional.empty();
    }
}
