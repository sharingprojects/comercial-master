import { Component, OnInit } from '@angular/core';
import { OportunidadeService } from '../service/oportunidade.service';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
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

  selectedOportunidade: Oportunidade ={
    id: null,
    descricao: null,
    nomeProspecto: null,
    valor: null
  }
  //formatação dinâmica das colunas
  cols: any[];
  itens: MenuItem[];
  displaySaveDialog: boolean = false;
 


  constructor(
    private oportunidadeService: OportunidadeService,
    private messageService: MessageService,
    private confirmService: ConfirmationService

    ) { }

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
        command: () => this.showSaveDialog(false)    
       },
       {
        label: 'Editar',
        icon: 'pi pi-fw pi-pencil',
        command: () => this.showSaveDialog(true)      
      },
      {
        label: 'Remover',
        icon: 'pi pi-fw pi-times',
        command: () => this.delete()
           
      }
  ];
}
  
 
  consultar(){
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

showSaveDialog(editar: boolean){
  
  if (editar) {
    if (this.selectedOportunidade != null && this.selectedOportunidade.id != null) {      
      this.oportunidade = this.selectedOportunidade;       
    } else {
        this.showMessagemNotSelection();   
        return;
    } 
  } else {
    this.oportunidade = new Oportunidade();   
  }
  this.displaySaveDialog = true;      
}

save(){
  this.oportunidadeService.save(this.oportunidade)  
      .subscribe(
         (resultado:any) => {
           let oportunidade = resultado as Oportunidade;
           this.validaOportunidade(oportunidade);
           this.messageService.add({
                severity: 'success',
                summary: 'Oportunidade adicionada com sucesso!'
           });
        },
        resposta => {    
            let msg = 'Erro inesperado. Tente novamente.';

           //pegar essa msg do json, da api
           if (resposta.error.message) {
              msg = resposta.error.message;
            }              
           this.messageService.add({severity: 'error', summary: msg});
         }         
      );
      this.displaySaveDialog = false;
}

delete(){

  if (this.selectedOportunidade == null || this.selectedOportunidade.id == null){
    this.showMessagemNotSelection();
    return;
  }  

  let idExcluido: number = this.selectedOportunidade.id;

  this.confirmService.confirm({
     message: "Tem certeza que deseja excluir esse registro?",     
     accept: () => {
      this.oportunidadeService.delete(this.selectedOportunidade.id).subscribe(
        (resultado: any) => {                    
          this.messageService.add({ severity: 'success', 
                                    summary: "Resultado", 
                                    detail: "Registro com id '"+idExcluido+"' foi excluído com sucesso."});
          this.deletaObjectoDaLista();
        })
     }
   })
}

deletaObjectoDaLista(){

  let index = this.oportunidades.indexOf(this.selectedOportunidade);
  this.oportunidades = this.oportunidades.filter((val, i) => i != index);
 
}

validaOportunidade(oportunidade: Oportunidade){

  let index = this.oportunidades.findIndex((e) => e.id == oportunidade.id);

  if (index != -1){
    this.oportunidades[index] = oportunidade;
  } else {
    this.oportunidades.push(oportunidade);
  }
}

showMessagemNotSelection() {
  
    this.messageService.add({severity : 'warn', 
                             summary: 'Atenção!',
                             detail: 'Por favor selecione um registro'});                             
    
   
}

 
}