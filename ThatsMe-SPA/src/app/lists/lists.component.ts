import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_service/Auth.service';
import { UserService } from '../_service/user.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_service/Alertify.service';
import { User } from '../_models/User';
import { Pagination, PaginationResult } from '../_models/Pagination';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {

  users: User[];
  pagination: Pagination;
  likesParam: string;
  userParams: any = {
    gender : 'all',
    maxAge : 99,
    minAge : 18,
    orderBy : 'LastActive'
   };
    constructor(private auth: AuthService, private userSer: UserService
              , private route: ActivatedRoute , private alert: AlertifyService) { }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.users = data['users'].result;
      this.pagination = data['users'].pagination;
    });
    this.likesParam = 'Likers';
  }

  LoadUsers(){
    this.userSer.getUsers(this.pagination.pageNumber, this.pagination.itemsPerPage, this.userParams, this.likesParam)
    .subscribe(( res: PaginationResult<User[]> ) => {
      this.users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alert.error('Cannot load users');
    });
  }
  pageChanged(event: any): void {
    this.pagination.pageNumber = event.page;
    this.LoadUsers();
   }

}
