import { Injectable, EventEmitter } from '@angular/core';
import { Message } from '../_models/Message';
import { HubConnection, HubConnectionBuilder } from '@aspnet/signalr';
import { environment } from 'src/environments/environment';
import { AuthService } from './Auth.service';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  chatUrl = environment.chatUrl;
  messageReceived = new EventEmitter<Message>();
  connectionEstablished = new EventEmitter<boolean>();
  private connectionIsEstablished = false;
  // tslint:disable-next-line: variable-name
  private _hubConnection: HubConnection;

constructor(private auth: AuthService) {
    this.createConnection();
    this.registerOnServerEvents();
    this.startConnection();
 }
sendMessage(message: Message) {
  this._hubConnection.invoke('NewMessage', message);
}

private createConnection() {
  this._hubConnection = new HubConnectionBuilder()
    .withUrl('https://localhost:44305/chat?UserConnectionId=' + this.auth.decodedToken.nameid)
    .build();
  console.log('connection Created at' + this.chatUrl + '/chat');
}
private startConnection(): void {
  console.log('connection state before ' + this._hubConnection.state);
  this._hubConnection.start().then(() => {
      console.log('Hub connection started Successfully .....');
      this.connectionIsEstablished = true;
      this.connectionEstablished.emit(true);
    }).catch(err => {
      console.log('Error while establishing connection, retrying...');
      setTimeout(function() { this.startConnection(); }, 5000);
    }).finally(() => {
      console.log('connection state in finally ' + this._hubConnection.state);
    });
  console.log('connection state after ' + this._hubConnection.state);

}

private registerOnServerEvents(): void {
  this._hubConnection.on('newmsg', (newMsg: Message) => {
    console.log('message from server' + newMsg);
    this.messageReceived.emit(newMsg);
  });

}

}
