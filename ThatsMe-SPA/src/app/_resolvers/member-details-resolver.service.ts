import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { Observable, of } from 'rxjs';
import { UserService } from '../_service/user.service';
import { AlertifyService } from '../_service/Alertify.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberDetailsResolverService implements Resolve<User> {

constructor(private userSer: UserService, private alertify: AlertifyService, private router: Router ) { }
  resolve(route: ActivatedRouteSnapshot): /*Observable<User>*/Promise<User> {
    // return this.userSer.getUser(route.params['id']).pipe(catchError(
    //   error => {
    //     this.alertify.error('Cannot Retrieving data');
    //     this.router.navigate(['/members']);
    //     return of(null);
    // }));
    return this.userSer.getUser(route.params['id']).toPromise().then(data => {
      if (data) {
        return data;
      } else {
        this.alertify.error('User deosn\'t avaliable');
        this.router.navigate(['/members']);
        return;
      }
    });
  }

}
