import { Component, OnInit } from '@angular/core';
import { AuthService } from './_service/Auth.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { tokenName } from '@angular/compiler';
import { User } from './_models/User';

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
    var currentUser = JSON.parse(localStorage.getItem('user')) ;
    if (token){
      this.auth.decodedToken = this.jwtHelper.decodeToken(token);
    }
    if (currentUser ){
      this.auth.CurrentUser = currentUser ;
      this.auth.ChangeMainPhoto(currentUser.photoUrl);
    }
  }


}
