import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Message } from 'src/app/_models/Message';
import { AuthService } from 'src/app/_service/Auth.service';
import { UserService } from 'src/app/_service/user.service';
import { AlertifyService } from 'src/app/_service/Alertify.service';
import { User } from 'src/app/_models/User';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { ChatService } from 'src/app/_service/Chat.service';



@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  // @Input() products$: Observable<any>;
  @Input() recipientId: number ;
  messages: Message[];
  newMsg: any = {} ;

  constructor(private auth: AuthService, private userSer: UserService,
              private alert: AlertifyService, private chatSer: ChatService , private ngZone: NgZone) { }

  ngOnInit() {
    this.loadMsgThread();
    this.chatSer.messageReceived.subscribe( (msg: Message) => {
      if (this.recipientId === msg.senderId || this.recipientId === msg.recipientId) {
        this.messages.unshift(msg);
      }
    }, error => {
      console.log('we didn\'t get message and push it') ;
    });
    //this.subscribeToEvents();
  }
  loadMsgThread() {
    const currentUser = +this.auth.decodedToken.nameid;
    this.userSer.getMessagesThread(this.auth.decodedToken.nameid, this.recipientId)
    // .pipe(
    //   tap(messagesBefore => {
    //   for ( let i = 0 ; messagesBefore.length > i ; i ++){
    //     if (messagesBefore[i].recipientId === currentUser && messagesBefore[i].isRead === false ) {
    //       this.userSer.MarkAsRead(messagesBefore[i].id, currentUser);
    //     }
    //   }
    // })
    // )
    .subscribe( messages => {
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
  //////////////////////////////////////////////// SignalR
  private subscribeToEvents(): void {
    this.chatSer.messageReceived.subscribe((message: Message) => {
      this.ngZone.run(() => {
        this.messages.unshift(message) ;
        // this.messages.push(message);
        // if (message.clientuniqueid !== this.uniqueID) {
        //   message.type = "received";
        //   this.messages.push(message);
        // }
      });
    });
  }
  sendMessageSignalR(): void {
    if (this.newMsg.content) {
      this.newMsg.recipientId = this.recipientId;
      this.messages.unshift(this.newMsg);
      this.chatSer.sendMessage(this.newMsg);
      this.newMsg.content = '';
    }
  }


}
