import { Component, OnInit } from '@angular/core';
import { UserService } from '../../_service/user.service';
import { AlertifyService } from '../../_service/Alertify.service';
import { User } from '../../_models/User';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-Member-list',
  templateUrl: './Member-list.component.html',
  styleUrls: ['./Member-list.component.css']
})
export class MemberListComponent implements OnInit {

  constructor(private userService: UserService , private alertService: AlertifyService, private route: ActivatedRoute) { }
  Users: User[] ;
  ngOnInit() {
    this.route.data.subscribe( data => {
      this.Users = data['users'];
    });
  }

  // LoadUsers(){
  //   this.userService.getUsers().subscribe(( users: User[] ) => {
  //     this.Users = users;
  //   }, error => {
  //     this.alertService.error('Cannot load users');
  //   });
  // }
}
