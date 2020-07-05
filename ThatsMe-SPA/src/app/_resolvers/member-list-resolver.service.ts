import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { Observable, of } from 'rxjs';
import { UserService } from '../_service/user.service';
import { AlertifyService } from '../_service/Alertify.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberListResolverService implements Resolve<User[]> {

constructor(private userSer: UserService, private alertify: AlertifyService, private router: Router ) { }
 pageNumber  = 1 ;
 pageSize = 5;
  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.userSer.getUsers(this.pageNumber, this.pageSize).pipe(catchError(
      error => {
        this.alertify.error('Cannot Retrieving data');
        this.router.navigate(['/home']);
        return of(null);
    }));
  }

}
