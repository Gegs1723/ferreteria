package com.ferremas.productos.service;

// TODO: Update the import below to match the actual package of Producto, for example:
// TODO: Update the import below to match the actual package of Producto, for example:
// import com.ferremas.productos.model.Producto;
import com.ferremas.productos.model.Producto;
import com.ferremas.productos.repository.ProductoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductoService {
    private final ProductoRepository repo;

    public ProductoService(ProductoRepository repo) {
        this.repo = repo;
    }

    public List<Producto> listar() { return repo.findAll(); }
    public Optional<Producto> obtener(Long id) { return repo.findById(id); }
    public Producto crear(Producto p) { return repo.save(p); }
    public void eliminar(Long id) { repo.deleteById(id); }
}
