import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/User';
import { AlertifyService } from 'src/app/_service/Alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from 'src/app/_service/user.service';
import { AuthService } from 'src/app/_service/Auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {

  constructor(private route: ActivatedRoute, private alert: AlertifyService,
              private userSer: UserService, private auth: AuthService) { }
  user: User ;
  @ViewChild('Editform') editForm: NgForm ;
  photoUrl: string ;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any){
    if (this.editForm.dirty){
      $event.returnValue = true;
    }
  }
  ngOnInit() {
    this.route.data.subscribe(data => {
      this.user = data['user'];
    });
    this.auth.currentPhotoUrl.subscribe(photoUrl => this.photoUrl = photoUrl );
  }

  UpdateUser(){
    this.userSer.updateUser(this.auth.decodedToken.nameid , this.user ).subscribe(next => {
    this.alert.success('Profile updated successfully') ;
    this.editForm.reset(this.user);
    }, error => {
      this.alert.error(error) ;
    });
  }
  UpdateNewMainPhoto( PhotoUrl){
    this.user.photoUrl = PhotoUrl ;
  }

}
