import {Routes} from '@angular/router';
import { HomeComponent } from './home/home.component';
import { MemberListComponent } from './Member-list/Member-list.component';
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './Messages/Messages.component';
import { AuthGuardGuard } from './_guard/auth-guard.guard';


export const appRoutes: Routes = [
    { path : '', component : HomeComponent},
    {
        path: '',
        runGuardsAndResolvers: 'always',
        canActivate: [AuthGuardGuard],
        children: [
            { path : 'members', component : MemberListComponent},
            { path : 'lists', component : ListsComponent},
            { path : 'messages', component : MessagesComponent}
        ]
    },
    { path : '**', redirectTo : '', pathMatch : 'full'}
];

