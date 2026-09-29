package com.materialEscolar.cadastro_materialEscolar.infrastructure.entitys;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "material_escolar")
@Entity
public class MaterialEscolar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "quantidade")
    private Integer quantidade;

    @Column(name = "preco")
    private Double preco;

    @Column(name = "fornecedor")
    private String fornecedor;
}