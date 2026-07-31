package com.ferremas.auth.controller;

import com.ferremas.auth.dto.LoginDTO;
import com.ferremas.auth.dto.UsuarioDTO;
import com.ferremas.auth.model.Usuario;
import com.ferremas.auth.model.Rol;
import com.ferremas.auth.repository.UsuarioRepository;
import com.ferremas.auth.repository.RolRepository;
import com.ferremas.auth.security.JwtUtil;
import com.ferremas.auth.service.UsuarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UsuarioService usuarioService;
    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RolRepository rolRepository;

    @PostMapping("/registro")
    public ResponseEntity<?> registro(@RequestBody UsuarioDTO dto) {
        Usuario usuario = usuarioService.registrar(dto);
        return ResponseEntity.ok(Map.of("usuario", usuario.getEmail()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioService.login(dto.email, dto.password);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            String token = jwtUtil.generateToken(usuario.getEmail());
            // Suponiendo que Usuario tiene una lista de roles y quieres enviar el primero
            String rol = usuario.getRoles() != null && !usuario.getRoles().isEmpty()
                ? usuario.getRoles().iterator().next().getNombre()
                : "CLIENTE";
            return ResponseEntity.ok(Map.of(
                "token", token,
                "usuario", usuario.getEmail(),
                "nombre", usuario.getNombre(),
                "rol", rol // <-- Ahora se envía el rol
            ));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Credenciales inválidas"));
    }

    @GetMapping("/usuario")
    public ResponseEntity<?> usuario(@RequestHeader("Authorization") String authHeader) {
        String token = authHeader.replace("Bearer ", "");
        if (jwtUtil.validateToken(token)) {
            String email = jwtUtil.extractEmail(token);
            return ResponseEntity.ok(Map.of("email", email));
        }
        return ResponseEntity.status(401).body(Map.of("error", "Token inválido"));
    }

    @GetMapping("/usuarios")
    public List<Usuario> listarUsuarios() {
        return usuarioRepository.findAll();
    }

    @GetMapping("/usuarios/{id}")
    public ResponseEntity<?> getUsuarioById(@PathVariable UUID id) {
        Optional<Usuario> usuario = usuarioRepository.findById(id);
        if (usuario.isPresent()) {
            return ResponseEntity.ok(usuario.get());
        }
        return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
    }

    @DeleteMapping("/usuarios/{id}")
    public ResponseEntity<?> deleteUsuario(@PathVariable UUID id) {
        if (usuarioRepository.existsById(id)) {
            usuarioRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("mensaje", "Usuario eliminado"));
        }
        return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
    }

    @PutMapping("/usuarios/{id}")
    public ResponseEntity<?> updateUsuario(@PathVariable UUID id, @RequestBody UsuarioDTO dto) {
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(id);
        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();
            usuario.setNombre(dto.nombre);
            usuario.setApellido(dto.apellido);
            usuario.setEmail(dto.email);
            usuario.setTelefono(dto.telefono);
            usuario.setFechaNacimiento(dto.fechaNacimiento);
            usuario.setDireccion(dto.direccion);
            usuario.setTipoCliente(dto.tipoCliente);
            usuario.setNewsletter(dto.newsletter);

            // ACTUALIZAR ROL
            if (dto.rol != null && !dto.rol.isEmpty()) {
                Rol nuevoRol = rolRepository.findByNombre(dto.rol).orElse(null);
                if (nuevoRol != null) {
                    usuario.getRoles().clear();
                    usuario.getRoles().add(nuevoRol);
                }
            }

            usuarioRepository.save(usuario);
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.status(404).body(Map.of("error", "Usuario no encontrado"));
    }
}
