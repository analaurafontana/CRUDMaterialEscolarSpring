package com.materialEscolar.cadastro_materialEscolar.business;

import com.materialEscolar.cadastro_materialEscolar.infrastructure.entitys.MaterialEscolar;
import com.materialEscolar.cadastro_materialEscolar.infrastructure.repository.MaterialEscolarRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MaterialEscolarService {

    private final MaterialEscolarRepository repository;

    public MaterialEscolarService(MaterialEscolarRepository repository) {
        this.repository = repository;
    }

    public MaterialEscolar salvarMaterial(MaterialEscolar materialEscolar) {
        return repository.saveAndFlush(materialEscolar);
    }

    public MaterialEscolar buscarPorNome(String nome) {
        return repository.findByNome(nome).orElseThrow(
                () -> new RuntimeException("Material escolar não encontrado com o nome: " + nome)
        );
    }

    public List<MaterialEscolar> listarTodos() {
        return repository.findAll();
    }

    public void deletarPorId(Long id) {
        repository.deleteById(id);
    }

    public MaterialEscolar atualizarMaterialPorId(Long id, MaterialEscolar material) {
        MaterialEscolar materialEntity = repository.findById(id).orElseThrow(() ->
                new RuntimeException("Material não encontrado")
        );

        MaterialEscolar materialAtualizado = MaterialEscolar.builder()
                .id(materialEntity.getId())
                .nome(material.getNome() != null ? material.getNome() : materialEntity.getNome())
                .quantidade(material.getQuantidade() != null ? material.getQuantidade() : materialEntity.getQuantidade())
                .preco(material.getPreco() != null ? material.getPreco() : materialEntity.getPreco())
                .fornecedor(material.getFornecedor() != null ? material.getFornecedor() : materialEntity.getFornecedor())
                .build();

        return repository.saveAndFlush(materialAtualizado);
    }
}