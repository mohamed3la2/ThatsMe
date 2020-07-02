import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_service/Auth.service';
import { AlertifyService } from '../_service/Alertify.service';
import { FormGroup, FormControl, FormControlDirective, Validators, FormBuilder } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/User';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  @Output() cancelRegFlag = new EventEmitter() ;
  user: User ;
  registerForm: FormGroup ;
  datePickerConfig: Partial<BsDatepickerConfig>;
  constructor(private auth: AuthService, private alertify: AlertifyService, private router: Router , private fb: FormBuilder) { }

  ngOnInit() {
    // this.registerForm = new FormGroup ({
    //   username: new FormControl('', Validators.required),
    //   password: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),
    //   confirmPassword: new FormControl('', [Validators.required])
    // }, this.PasswordMatchValidator);
    this.datePickerConfig = {
      containerClass : 'theme-dark-blue'
    };
    this.CreateRegisterForm();
  }
  CreateRegisterForm(){
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: [null, Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', Validators.required]
    }, {validators: this.PasswordMatchValidator});
  }
  PasswordMatchValidator(g: FormGroup){
    return g.get('password').value === g.get('confirmPassword').value ? null : {'mismatch': true} ;
  }
  Register(){
    this.user = Object.assign({} , this.registerForm.value) ;
    this.auth.Register(this.user).subscribe(() => {
      this.alertify.success('Registration Successfully');
    }, error => {
      this.alertify.error(error);
    }, () => {
      this.auth.Login(this.user).subscribe( () => {
        this.router.navigate(['/members']);
      }, error => {
        this.alertify.error(error);
      });
    });

    // this.auth.Register(this.model).subscribe(next => {
    //   this.alertify.success('Registration successfully');
    // },
    // error => {
    //  this.alertify.error(error);
    // });

  }
  Cancel(){
    this.cancelRegFlag.emit(false);
  }

}
