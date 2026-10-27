package com.materialEscolar.cadastro_materialEscolar.controller;

import com.materialEscolar.cadastro_materialEscolar.business.MaterialEscolarService;
import com.materialEscolar.cadastro_materialEscolar.infrastructure.entitys.MaterialEscolar;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/material-escolar")
public class MaterialEscolarController {

    private final MaterialEscolarService service;

    public MaterialEscolarController(MaterialEscolarService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MaterialEscolar> salvarMaterial(@RequestBody MaterialEscolar material) {
        MaterialEscolar novoMaterial = service.salvarMaterial(material);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoMaterial);
    }

    @GetMapping
    public ResponseEntity<List<MaterialEscolar>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping(params = "id")
    public ResponseEntity<MaterialEscolar> buscarPorId(@RequestParam Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    @GetMapping(params = "nome")
    public ResponseEntity<MaterialEscolar> buscarPorNome(@RequestParam String nome) {
        return ResponseEntity.ok(service.buscarPorNome(nome));
    }

    @PutMapping
    public ResponseEntity<MaterialEscolar> atualizarMaterialPorId(@RequestParam Long id, @RequestBody MaterialEscolar material) {
        MaterialEscolar materialAtualizado = service.atualizarMaterialPorId(id, material);
        return ResponseEntity.ok(materialAtualizado);
    }

    // Funciona com: DELETE localhost:8000/material-escolar?id=1
    @DeleteMapping(params = "id")
    public ResponseEntity<Void> deletarPorId(@RequestParam Long id) {
        service.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }

    // Funciona com: DELETE localhost:8000/material-escolar?nome=Lapis
    @DeleteMapping(params = "nome")
    public ResponseEntity<Void> deletarPorNome(@RequestParam String nome) {
        service.deletarPorNome(nome);
        return ResponseEntity.noContent().build();
    }
}