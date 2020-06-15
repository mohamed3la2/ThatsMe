import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_service/Auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegFlag = new EventEmitter() ;
  model: any = {} ;
  constructor(private auth: AuthService) { }

  ngOnInit() {
  }
  Register(){
    this.auth.Register(this.model).subscribe(next => {
      console.log('Successfull');
    },
    error => {
      console.log(error);
    });
  }
  Cancel(){
    this.cancelRegFlag.emit(false);
  }

}
