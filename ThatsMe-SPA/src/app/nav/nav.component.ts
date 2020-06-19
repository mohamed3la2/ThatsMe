import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/Auth.service';
import { AlertifyService } from '../_service/Alertify.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  model: any = {} ;

  constructor(public auth: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
  }
  login(){
    this.auth.Login(this.model).subscribe( next => {
     this.alertify.success('Logged Successfully');
    },
    error => {
      this.alertify.error(error);
    }, () => this.router.navigate(['/members']));
  }

  loggedIn(){
  return this.auth.LoggedIn();
  }
  loggedOut(){
    localStorage.removeItem('token');
    this.alertify.message('LoggedOut');
    this.router.navigate(['/home']);
  }
}
