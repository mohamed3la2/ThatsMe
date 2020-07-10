import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { User } from '../_models/User';
import { Observable, of } from 'rxjs';
import { UserService } from '../_service/user.service';
import { AlertifyService } from '../_service/Alertify.service';
import { catchError } from 'rxjs/operators';
import { Message } from '../_models/Message';
import { AuthService } from '../_service/Auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {

constructor(private userSer: UserService, private alertify: AlertifyService,
            private router: Router, private auth: AuthService ) { }
 pageNumber  = 1 ;
 pageSize = 5;
 messageContainer = 'unread';
  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.userSer.getMessages(this.auth.decodedToken.nameid, this.pageNumber, this.pageSize, this.messageContainer)
    .pipe(
      catchError(
      error => {
        this.alertify.error('Cannot Retrieving Messages');
        this.router.navigate(['/home']);
        return of(null);
    }));
  }

}
