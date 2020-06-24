import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';


import { NavComponent } from './nav/nav.component';
import { AuthService } from './_service/Auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_service/error.interceptor';
import { MemberListComponent } from './Members/Member-list/Member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './Messages/Messages.component';
import { appRoutes } from './Routes';
import { UserService } from './_service/user.service';
import { MemberCardComponent } from './Members/member-card/member-card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MemberDetailsComponent } from './Members/member-details/member-details.component';
import { MemberDetailsResolverService } from './_resolvers/member-details-resolver.service';
import { MemberListResolverService } from './_resolvers/member-list-resolver.service';
import { NgxGalleryModule } from 'ngx-gallery-9';

export function tokenGetter(){
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      HomeComponent,
      MemberListComponent,
      ListsComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailsComponent
   ],
   imports: [
      BrowserModule,
      HttpClientModule,
      FormsModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      NgxGalleryModule,
      JwtModule.forRoot({
         config: {
            // tslint:disable-next-line: object-literal-shorthand
            tokenGetter : tokenGetter,
            whitelistedDomains: ['localhost:44305'],
            blacklistedRoutes: ['localhost:44305/api/auth']
         }
      }),
   ],
   providers: [
      AuthService,
      UserService,
      ErrorInterceptorProvider,
      MemberDetailsResolverService,
      MemberListResolverService
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
