package com.materialEscolar.cadastro_materialEscolar.infrastructure.repository;

import com.materialEscolar.cadastro_materialEscolar.infrastructure.entitys.MaterialEscolar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MaterialEscolarRepository extends JpaRepository<MaterialEscolar, Long> {

    Optional<MaterialEscolar> findByNome(String nome);
}