package com.ferremas.productos.repository;

import com.ferremas.productos.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCaseOrCategoriaIdOrMarcaContainingIgnoreCaseOrCodigoBarrasContainingIgnoreCaseOrProveedorContainingIgnoreCase(
        String nombre,
        String descripcion,
        Long categoriaId,
        String marca,
        String codigoBarras,
        String proveedor
    );
}
