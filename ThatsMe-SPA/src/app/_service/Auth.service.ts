import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = 'https://localhost:44305/api/Auth/' ;
constructor(private http: HttpClient) { }

Login(model: any){
  return this.http.post(this.baseURL + 'login', model).pipe(
    map((response: any) => {
     const user = response ;
     if (user){
       localStorage.setItem('token', user.token);
     }
  })
  );
}
Register(model: any){
  return this.http.post(this.baseURL + 'register' , model);
}

}
