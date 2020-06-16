import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/Auth.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {} ;

  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
  login(){
    this.auth.Login(this.model).subscribe( next => {
      console.log(this.model, 'Success');
    },
    error => {
      console.log(error);
    });
  }

  loggedIn(){
    const token = localStorage.getItem('token');
    return !!token;
  }
  loggedOut(){
    localStorage.removeItem('token');
    console.log('LoggedOut');
  }
}
