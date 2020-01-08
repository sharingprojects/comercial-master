package com.sharingprojects.comercial.controller;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.sharingprojects.comercial.model.Oportunidade;
import com.sharingprojects.comercial.repository.OportunidadeRepository;

//GET http://localhost:8080/api/v1/oportunidades/

@CrossOrigin("*")
@RestController
@RequestMapping("/api/v1/oportunidades/")
public class OportunidadeController {

	@Autowired
	private OportunidadeRepository oportunidades;

	@GetMapping("/all")
	public List<Oportunidade> listar() {
		return oportunidades.findAll();
	}

	@GetMapping("/{id}")
	public ResponseEntity<Oportunidade> buscarPorId(@PathVariable Long id) {
		// Optional é um objeto que encapsula Oportunidade
		Optional<Oportunidade> oportunidade = oportunidades.findById(id);

		if (oportunidade.isEmpty()) {
			return ResponseEntity.notFound().build();
		}

		return ResponseEntity.ok(oportunidade.get());
	}

	/**
	 * @RequestBody = converte o Json para um objeto
	 * @Valid = indica que é preciso validar o objeto antes de salvar
	 */
	@PostMapping("/save")
	@ResponseStatus(HttpStatus.CREATED)
	public Oportunidade adicionar(@Valid @RequestBody Oportunidade oportunidade) {

		Optional<Oportunidade> oportunidadesExistentes = oportunidades
				.findByDescricaoAndNomeProspecto(oportunidade.getDescricao(), oportunidade.getNomeProspecto());
		
		if (oportunidadesExistentes.isPresent()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, 
					"Já existe uma oportunidade com este mesmo prospecto e descrição");
		}

		return oportunidades.save(oportunidade);

	}
	
	@RequestMapping(value = "/{id}", method = RequestMethod.PUT)
	public ResponseEntity<Oportunidade> atualizar(@PathVariable Long id,
			@Valid @RequestBody Oportunidade newOportunidade) {
		
		Optional<Oportunidade> oldPessoa = oportunidades.findById(id);
		
		if (oldPessoa.isPresent()) {
			
			Oportunidade oportunidadeAtualizada = oldPessoa.get();
			oportunidadeAtualizada.setDescricao(newOportunidade.getDescricao());
			oportunidadeAtualizada.setNomeProspecto(newOportunidade.getNomeProspecto());
			oportunidadeAtualizada.setValor(newOportunidade.getValor());
			oportunidades.save(oportunidadeAtualizada);
			
			return new ResponseEntity<Oportunidade>(oportunidadeAtualizada, HttpStatus.OK);
			
		} else 
			return new ResponseEntity<>(HttpStatus.NOT_FOUND);
	}
	
	@RequestMapping(value = "/delete/{id}")
    public ResponseEntity<Oportunidade> delete(@PathVariable Long id)
    {
        Optional<Oportunidade> oportunidadeAremover = oportunidades.findById(id);
        
        if(oportunidadeAremover.isPresent()){
            oportunidades.delete(oportunidadeAremover.get());
            return new ResponseEntity<>(HttpStatus.OK);
        }
        else
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

}
