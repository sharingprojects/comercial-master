package com.sharingprojects.comercial.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sharingprojects.comercial.model.Oportunidade;

/**
 * 
 * @author Andreza 
 *         
 *         Em tempo de execução teremos uma implementação dessa
 *         Interface fazendo operações: find, save, update and delete no BD.
 */

public interface OportunidadeRepository extends JpaRepository<Oportunidade, Long> {
	
	//Se quiser implementar um método que faz uma consulta diferente, que não foi implementado ainda
	//pelo Spring Data JPA, pode-se criar um método personalizado.	
	Optional<Oportunidade> findByDescricaoAndNomeProspecto(String descricao, String nomeProspecto);


}
