import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Pipe } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { appRoutes } from './Routes';
import {HttpClientModule} from '@angular/common/http';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import { RouterModule } from '@angular/router';
import { NgxGalleryModule } from 'ngx-gallery-9';
import { TimeagoModule } from 'ngx-timeago';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {ButtonsModule} from 'ngx-bootstrap/buttons';
import { FileUploadModule } from 'ng2-file-upload';


import { NavComponent } from './nav/nav.component';
import { AuthService } from './_service/Auth.service';
import { HomeComponent } from './home/home.component';
import { RegisterComponent } from './register/register.component';
import { ErrorInterceptorProvider } from './_service/error.interceptor';
import { MemberListComponent } from './Members/Member-list/Member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './Messages/Messages.component';
import { UserService } from './_service/user.service';
import { MemberCardComponent } from './Members/member-card/member-card.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MemberDetailsComponent } from './Members/member-details/member-details.component';
import { MemberDetailsResolverService } from './_resolvers/member-details-resolver.service';
import { MemberListResolverService } from './_resolvers/member-list-resolver.service';
import {MemberEditComponent } from './Members/member-edit/member-edit.component' ;
import { MemberEditResolverService } from './_resolvers/member-edit-resolver.service';
import { PreventUnsavedChanges } from './_guard/prevent-unsaved-changes.guard';
import { PhotoEditorComponent } from './Members/photo-editor/photo-editor.component';
import { ListsResolver } from './_resolvers/Lists.Resolver';

// export class TimeAgoExtendsPipe extends TimeAgoPipe {}
// @Pipe({
//    name: 'timeAgo',
//    pure: false
// })

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
      MemberDetailsComponent,
      MemberEditComponent,
      PhotoEditorComponent
   ],
   imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,
      FormsModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      BsDropdownModule.forRoot(),
      PaginationModule.forRoot(),
      ButtonsModule.forRoot(),
      TabsModule.forRoot(),
      RouterModule.forRoot(appRoutes),
      NgxGalleryModule,
      TimeagoModule.forRoot(),
      BsDatepickerModule.forRoot(),
      FileUploadModule,
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
      MemberListResolverService,
      MemberEditResolverService,
      PreventUnsavedChanges,
      ListsResolver
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
