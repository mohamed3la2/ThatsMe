import { Component, OnInit, Input } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { AuthService } from 'src/app/_service/Auth.service';
import { UserService } from 'src/app/_service/user.service';
import { AlertifyService } from 'src/app/_service/Alertify.service';
import { User } from 'src/app/_models/User';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {

  @Input() recipientId: number ;
  messages: Message[];
  newMsg: any = {} ;

  constructor(private auth: AuthService, private userSer: UserService, private alert: AlertifyService) { }

  ngOnInit() {
    this.loadMsgThread();
  }
  loadMsgThread() {
    const currentUser = +this.auth.decodedToken.nameid;
    this.userSer.getMessagesThread(this.auth.decodedToken.nameid, this.recipientId)
    .pipe(
      tap(messagesBefore => {
      for ( let i = 0 ; messagesBefore.length > i ; i ++){
        if (messagesBefore[i].recipientId === currentUser && messagesBefore[i].isRead === false ) {
          this.userSer.MarkAsRead(messagesBefore[i].id, currentUser);
        }
      }
    })
    ).subscribe( messages => {
      this.messages = messages;
    }, error => {
      this.alert.error('error cannot load msgs');
    });
  }
  SendMessage(){
    this.newMsg.recipientId = this.recipientId;
    this.userSer.SendMessage(this.auth.decodedToken.nameid , this.newMsg).subscribe( (message: Message) => {
      this.messages.unshift(message);
      this.newMsg.content = '';
    }, error => {
      this.alert.error(error);
    });
  }

}
