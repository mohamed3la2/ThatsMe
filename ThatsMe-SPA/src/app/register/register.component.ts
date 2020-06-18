import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_service/Auth.service';
import { AlertifyService } from '../_service/Alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegFlag = new EventEmitter() ;
  model: any = {} ;
  constructor(private auth: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
  }
  Register(){
    this.auth.Register(this.model).subscribe(next => {
      this.alertify.success('Registration successfully');
    },
    error => {
     this.alertify.error(error);
    });
  }
  Cancel(){
    this.cancelRegFlag.emit(false);
  }

}
