import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { Observable, of } from 'rxjs';
import { UserService } from '../_service/user.service';
import { AlertifyService } from '../_service/Alertify.service';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../_service/Auth.service';

@Injectable()
export class MemberEditResolverService implements Resolve<User> {

constructor(private userSer: UserService, private alertify: AlertifyService,
            private router: Router, private auth: AuthService ) { }
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userSer.getUser(this.auth.decodedToken.nameid).pipe(catchError(
      error => {
        this.alertify.error('Cannot Retrieving your data');
        this.router.navigate(['/members']);
        return of(null);
    }));
  }

}
