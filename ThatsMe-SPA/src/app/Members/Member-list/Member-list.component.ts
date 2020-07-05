import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_service/user.service';
import { AlertifyService } from '../../_service/Alertify.service';
import { User } from '../../_models/User';
import { Router, ActivatedRoute } from '@angular/router';
import { Pagination, PaginationResult } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-Member-list',
  templateUrl: './Member-list.component.html',
  styleUrls: ['./Member-list.component.css']
})
export class MemberListComponent implements OnInit {

  constructor(private userService: UserService , private alertService: AlertifyService, private route: ActivatedRoute) { }
  Users: User[] ;
  LoggedUser: User = JSON.parse(localStorage.getItem('user'));
  genderList = [ {value: 'male', display: 'Males' } , {value: 'female' , display: 'Females'} ];
  userParams: any = {};
  pagination: Pagination;
  ngOnInit() {
    this.route.data.subscribe( data => {
      this.Users = data['users'].result;
      this.pagination = data['users'].pagination;
    });

    this.userParams.maxAge = 99;
    this.userParams.minAge = 18;
    this.userParams.gender = this.LoggedUser.gender === 'male' ? 'female' : 'male' ;
    this.userParams.orderBy = 'LastActive';
  }

  resetFilters(){
    this.userParams.maxAge = 99;
    this.userParams.minAge = 18;
    this.userParams.gender = this.LoggedUser.gender === 'male' ? 'female' : 'male' ;
    this.LoadUsers();
  }

  LoadUsers(){
    this.userService.getUsers(this.pagination.pageNumber, this.pagination.itemsPerPage, this.userParams)
    .subscribe(( res: PaginationResult<User[]> ) => {
      this.Users = res.result;
      this.pagination = res.pagination;
    }, error => {
      this.alertService.error('Cannot load users');
    });
  }

  pageChanged(event: any): void {
   this.pagination.pageNumber = event.page;
   this.LoadUsers();
  }
}
