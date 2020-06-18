import { Component, OnInit } from '@angular/core';
import { AuthService } from './_service/Auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tokenName } from '@angular/compiler';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  jwtHelper = new JwtHelperService();
  constructor(private auth: AuthService) {}

  ngOnInit(){
    var token = localStorage.getItem('token');
    if (token){
      this.auth.decodedToken = this.jwtHelper.decodeToken(token);
    }
    
  }


}
