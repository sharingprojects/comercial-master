import { Component, OnInit } from '@angular/core';
import { OportunidadeService } from '../service/oportunidade.service';
import { MessageService } from 'primeng/api';
import { MenuItem } from 'primeng/api'
import { Oportunidade } from 'src/model/oportunidade';


@Component({
  selector: 'app-painel-negociacao',
  templateUrl: './painel-negociacao.component.html',
  styleUrls: ['./painel-negociacao.component.css']
})
export class PainelNegociacaoComponent implements OnInit {

  oportunidades: Oportunidade[];
  oportunidade: Oportunidade = {
    id: null,
    descricao: null,
    nomeProspecto: null,
    valor: null
  };

  //formatação dinâmica das colunas
  cols: any[];
  itens: MenuItem[];
  displaySaveDialog: boolean = false;

  constructor(
    private oportunidadeService: OportunidadeService,
    private messageService: MessageService
    ) { }

   
  //ele é chamado quando o componente está tudo pronto
  ngOnInit() {

    this.consultar();

     this.cols = [
       {field: "id", header: "ID"},
       {field: "descricao", header: "Descrição"},
       {field: "nomeProspecto", header: "Nome Prospecto"},
       {field: "valor", header: "Valor"}
     ]

  
    this.itens = [
      {
        label: 'Novo', 
        icon: 'pi pi-fw pi-plus',
        command: () => this.showSaveDialog()    
       },
       {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil'     
      }
  ];
}
  
 

  consultar(){
    /*
    fazer a consulta no service e atribuir a variável oportunidades
    me retorna um objeto do tipo observable, então tenho que escutar e me inscrever nesse objeto,
    pois quando tiver uma resposta, lembrando que é uma requisição assícrona, pode durar menos de 1s
    ou 10s, mas o ponto aqui é saber quando a resposta vier, por isso que me subscrevo nesse objeto para saber
    quando tiver alguma resposta, então quando tiver uma resposta eu atribuo a uma variável */
    this.oportunidadeService.getAll().subscribe(
      (resultado: any) => {
        let listOportunidadesAtualizada: Oportunidade[] = [];
        for (let i = 0; i < resultado.length; i++) {
          let op = resultado[i] as Oportunidade;
          listOportunidadesAtualizada.push(op);
        }
        this.oportunidades = listOportunidadesAtualizada;
      },
      error => {
        console.log(error);
      }
    );

}

showSaveDialog(){
  this.displaySaveDialog = true;
      
}

  /*adicionar() {
    this.oportunidadeService.add(this.oportunidade)
        .subscribe(() => {
          //limpa os campos
          this.oportunidade = {};
          //atualiza os dados na tabela
          this.consultar();

          this.messageService.add({
               severity: 'success',
               summary: 'Oportunidade adicionada com sucesso!'
          });
        },
        resposta => {    
          let msg = 'Erro inesperado. Tente novamente!';

          //pegar essa msg do json, da api
          if (resposta.error.msg) {
            msg = resposta.error.msg;
          }
          
          this.messageService.add({
               severity: 'error',
               summary: msg
        });        
  });  
 }  */
}