import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/Auth.service';
import { AlertifyService } from '../_service/Alertify.service';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {} ;

  constructor(public auth: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }
  login(){
    this.auth.Login(this.model).subscribe( next => {
     this.alertify.success('Logged Successfully');
    },
    error => {
      this.alertify.error(error);
    });
  }

  loggedIn(){
  return this.auth.LoggedIn();
  }
  loggedOut(){
    localStorage.removeItem('token');
    this.alertify.message('LoggedOut');
  }
}
