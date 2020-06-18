import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import {JwtHelperService} from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = 'https://localhost:44305/api/Auth/' ;
  jwtHelper = new JwtHelperService();
  decodedToken: any ;
constructor(private http: HttpClient) { }

Login(model: any){
  return this.http.post(this.baseURL + 'login', model).pipe(
    map((response: any) => {
     const user = response ;
     if (user){
       localStorage.setItem('token', user.token);
       this.decodedToken = this.jwtHelper.decodeToken(user.token);
     }
  })
  );
}
Register(model: any){
  return this.http.post(this.baseURL + 'register' , model);
}
LoggedIn(){
  var token = localStorage.getItem('token');
  return !this.jwtHelper.isTokenExpired(token);

}

}
