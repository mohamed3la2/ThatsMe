import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { Observable, of } from 'rxjs';
import { UserService } from '../_service/user.service';
import { AlertifyService } from '../_service/Alertify.service';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ListsResolver implements Resolve<User[]> {

constructor(private userSer: UserService, private alertify: AlertifyService, private router: Router ) { }
 pageNumber  = 1 ;
 pageSize = 5;
 userParams: any = {
  gender : 'all',
  maxAge : 99,
  minAge : 18,
  orderBy : 'LastActive'
 };
 likeParams = 'Likers';
  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.userSer.getUsers(this.pageNumber, this.pageSize, this.userParams, this.likeParams).pipe(catchError(
      error => {
        this.alertify.error('Cannot Retrieving data');
        this.router.navigate(['/home']);
        return of(null);
    }));
  }

}
