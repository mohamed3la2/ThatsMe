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
  photoUrl: string ;

  constructor(public auth: AuthService, private alertify: AlertifyService, private router: Router) { }

  ngOnInit() {
    this.auth.currentPhotoUrl.subscribe(photoUrl => { this.photoUrl = photoUrl; }) ;
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
    this.alertify.message('LoggedOut');
    localStorage.removeItem('token');
    this.auth.decodedToken = null;
    localStorage.removeItem('user');
    this.auth.CurrentUser = null;
    this.router.navigate(['/home']);
  }
}
