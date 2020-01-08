import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Oportunidade } from 'src/model/oportunidade';

//Essa injeção de dependência informa que o serviço abaixo está sendo oferecido para o framework
//para poder injetar em algum lugar que precisar
@Injectable({
  providedIn: 'root'
})


export class OportunidadeService {

  //url do recurso de oportunidades
  apiUrl:string = 'http://localhost:8080/api/v1/oportunidades';

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
        //não retorna uma json, mas sim um tipo observable
    return this.http.get(this.apiUrl + "/all");
  }


  save(oportunidade: Oportunidade): Observable<any> {
   return this.http.post(this.apiUrl + "/save", oportunidade);
  }

  delete(id: number): Observable<any>{
    return this.http.get(this.apiUrl + "/delete/"+id);
  }


  
}
