import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_service/user.service';
import { AuthService } from 'src/app/_service/Auth.service';
import { AlertifyService } from 'src/app/_service/Alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {

  @Input() user: User;
  constructor(private userSer: UserService, private auth: AuthService, private alert: AlertifyService) { }

  ngOnInit() {
  }

SendLike(receipientId){
  this.userSer.SendLike(this.auth.decodedToken.nameid , receipientId).subscribe(
    () => {
      this.alert.success('You gave a heart to' + this.user.knownAs);
  }, error =>{
    this.alert.error(error);
  });
}
}

