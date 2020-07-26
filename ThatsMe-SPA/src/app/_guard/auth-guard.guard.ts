import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../_service/Auth.service';
import { AlertifyService } from '../_service/Alertify.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanActivate {


  constructor(private auth: AuthService , private alertify: AlertifyService , private router: Router) {

  }
  canActivate(): boolean{
    if ( this.auth.LoggedIn() ) {
      return true;
    }
    else{
      this.alertify.error('You must Log in first');
      this.router.navigate(['/home']);
    }
  }
}
