package com.materialEscolar.cadastro_materialEscolar.controller;

import com.materialEscolar.cadastro_materialEscolar.business.MaterialEscolarService;
import com.materialEscolar.cadastro_materialEscolar.infrastructure.entitys.MaterialEscolar;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/material")
public class MaterialEscolarController {

    private final MaterialEscolarService service;

    public MaterialEscolarController(MaterialEscolarService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<MaterialEscolar> salvar(@RequestBody MaterialEscolar material) {
        return ResponseEntity.ok(service.salvarMaterial(material));
    }

    @GetMapping
    public ResponseEntity<List<MaterialEscolar>> listarTodos() {
        return ResponseEntity.ok(service.listarTodos());
    }

    @GetMapping("/{nome}")
    public ResponseEntity<MaterialEscolar> buscarPorNome(@PathVariable String nome) {
        return ResponseEntity.ok(service.buscarPorNome(nome));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MaterialEscolar> atualizarPorId(@PathVariable Long id, @RequestBody MaterialEscolar material) {
        return ResponseEntity.ok(service.atualizarMaterialPorId(id, material));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletarPorId(id);
        return ResponseEntity.noContent().build();
    }
}