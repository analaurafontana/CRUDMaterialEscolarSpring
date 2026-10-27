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

    public MaterialEscolar buscarPorId(Long id) {
        return repository.findById(id).orElseThrow(
                () -> new RuntimeException("Material escolar não encontrado com o id: " + id)
        );
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
        if (!repository.existsById(id)) {
            throw new RuntimeException("Material não encontrado com o id: " + id);
        }
        repository.deleteById(id);
    }

    // Método adicionado para realizar a exclusão filtrando pelo nome
    public void deletarPorNome(String nome) {
        MaterialEscolar material = repository.findByNome(nome).orElseThrow(
                () -> new RuntimeException("Material escolar não encontrado com o nome: " + nome)
        );
        repository.delete(material);
    }

    public MaterialEscolar atualizarMaterialPorId(Long id, MaterialEscolar material) {
        MaterialEscolar materialEntity = repository.findById(id).orElseThrow(() ->
                new RuntimeException("Material não encontrado com o id: " + id)
        );

        if (material.getNome() != null) {
            materialEntity.setNome(material.getNome());
        }
        if (material.getQuantidade() != null) {
            materialEntity.setQuantidade(material.getQuantidade());
        }
        if (material.getPreco() != null) {
            materialEntity.setPreco(material.getPreco());
        }
        if (material.getFornecedor() != null) {
            materialEntity.setFornecedor(material.getFornecedor());
        }

        return repository.saveAndFlush(materialEntity);
    }
}