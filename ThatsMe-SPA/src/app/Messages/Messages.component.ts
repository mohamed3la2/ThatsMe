import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../_service/user.service';
import { AlertifyService } from '../_service/Alertify.service';
import { AuthService } from '../_service/Auth.service';
import { Message } from '../_models/Message';
import { Pagination, PaginationResult } from '../_models/Pagination';

@Component({
  selector: 'app-Messages',
  templateUrl: './Messages.component.html',
  styleUrls: ['./Messages.component.css']
})
export class MessagesComponent implements OnInit {

  constructor(private route: ActivatedRoute, private userSer: UserService,
              private alert: AlertifyService, private auth: AuthService) { }
  messages: Message[];
  pagination: Pagination;
  messageContainer = 'unread';
  ngOnInit() {
    this.route.data.subscribe( data => {
      this.messages = data['messages'].result;
      this.pagination = data['messages'].pagination;
    });

  }
  LoadMessages(){
    this.userSer.getMessages(this.auth.decodedToken.nameid, this.pagination.pageNumber,
       this.pagination.itemsPerPage, this.messageContainer)
       .subscribe((res: PaginationResult<Message[]>) => {
        this.messages = res.result;
        this.pagination = res.pagination;
       }, error => {
         this.alert.error(error);
       });
  }
  DeleteMsg(id: number){
    this.alert.confirm('Are your sure u want to delete this message :', () => {
      this.userSer.DeleteMsg(id , this.auth.decodedToken.nameid).subscribe( () => {
        this.messages.splice(this.messages.findIndex(m => m.id === id) , 1);
        this.alert.success('Message deleted succussfully');
        this.LoadMessages();
      }, error => {
        this.alert.error('Something went wrong please try again') ;
      });
    });
  }

  pageChanged(event: any): void {
    this.pagination.pageNumber = event.page;
    this.LoadMessages();
   }

}
