package com.ferremas.productos.controller;

import com.ferremas.productos.model.Producto;
import com.ferremas.productos.repository.ProductoRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/productos")
@CrossOrigin(origins = { "http://127.0.0.1:8000", "http://localhost:8000" })
public class ProductoController {
    private final ProductoRepository productoRepository;

    public ProductoController(ProductoRepository productoRepository) {
        this.productoRepository = productoRepository;
    }

    @GetMapping
    public List<Producto> getAll() {
        return productoRepository.findAll();
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public Producto create(
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("estado") String estado,
            @RequestParam("categoriaId") Long categoriaId,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        Producto producto = new Producto();
        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setEstado(estado);
        producto.setCategoriaId(categoriaId);

        if (imagen != null && !imagen.isEmpty()) {
            producto.setImagen(imagen.getBytes());
        }

        return productoRepository.save(producto);
    }

    @GetMapping("/{id}")
    public Producto getById(@PathVariable Long id) {
        return productoRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        productoRepository.deleteById(id);
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public Producto update(
            @PathVariable Long id,
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("estado") String estado,
            @RequestParam("categoriaId") Long categoriaId,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto == null)
            return null;

        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setEstado(estado);
        producto.setCategoriaId(categoriaId);

        if (imagen != null && !imagen.isEmpty()) {
            producto.setImagen(imagen.getBytes());
        }

        return productoRepository.save(producto);
    }

    @PatchMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public Producto partialUpdate(
            @PathVariable Long id,
            @RequestParam("nombre") String nombre,
            @RequestParam(value = "descripcion", required = false) String descripcion,
            @RequestParam("precio") BigDecimal precio,
            @RequestParam("stock") Integer stock,
            @RequestParam("estado") String estado,
            @RequestParam("categoriaId") Long categoriaId,
            @RequestParam(value = "imagen", required = false) MultipartFile imagen) throws IOException {
        Producto producto = productoRepository.findById(id).orElse(null);
        if (producto == null)
            return null;

        producto.setNombre(nombre);
        producto.setDescripcion(descripcion);
        producto.setPrecio(precio);
        producto.setStock(stock);
        producto.setEstado(estado);
        producto.setCategoriaId(categoriaId);

        if (imagen != null && !imagen.isEmpty()) {
            producto.setImagen(imagen.getBytes());
        }

        return productoRepository.save(producto);
    }

    @GetMapping("/buscar")
    public List<Producto> buscarProductos(
            @RequestParam(value = "query", required = false, defaultValue = "") String query) {
        if (query.trim().isEmpty()) {
            return List.of();
        }
        Long categoriaId = null;
        try {
            categoriaId = Long.parseLong(query);
        } catch (NumberFormatException ignored) {
        }
        return productoRepository
                .findByNombreContainingIgnoreCaseOrDescripcionContainingIgnoreCaseOrCategoriaIdOrMarcaContainingIgnoreCaseOrCodigoBarrasContainingIgnoreCaseOrProveedorContainingIgnoreCase(
                        query, query, categoriaId, query, query, query);
    }
}
