import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './Members/Member-list/Member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './Messages/Messages.component';
import { AuthGuardGuard } from './_guard/auth-guard.guard';
import { MemberDetailsComponent } from './Members/member-details/member-details.component';
import { MemberDetailsResolverService } from './_resolvers/member-details-resolver.service';
import { MemberListResolverService } from './_resolvers/member-list-resolver.service';
import { MemberEditComponent } from './Members/member-edit/member-edit.component';
import { MemberEditResolverService } from './_resolvers/member-edit-resolver.service';
import { PreventUnsavedChanges } from './_guard/prevent-unsaved-changes.guard';
import { ListsResolver } from './_resolvers/Lists.Resolver';


export const appRoutes: Routes = [
    { path : '', component : HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuardGuard],
        children: [
            { path : 'members', component : MemberListComponent, resolve : {
                users : MemberListResolverService
            }},
            { path : 'members/:id', component : MemberDetailsComponent, resolve: {
                user : MemberDetailsResolverService
            }},
            { path : 'member/edit', component : MemberEditComponent, resolve: {
                user: MemberEditResolverService
            }, canDeactivate : [PreventUnsavedChanges]},
            { path : 'lists', component : ListsComponent, resolve:{
                users: ListsResolver
            }},
            { path : 'messages', component : MessagesComponent}
        ]
    },
    { path : '**', redirectTo : '', pathMatch : 'full'}
];

