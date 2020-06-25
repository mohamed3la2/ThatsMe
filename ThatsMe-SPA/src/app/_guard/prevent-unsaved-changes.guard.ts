import {Injectable} from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { MemberEditComponent } from '../Members/member-edit/member-edit.component';

@Injectable()

export class PreventUnsavedChanges implements CanDeactivate<MemberEditComponent>{
    canDeactivate(component: MemberEditComponent){
        if (component.editForm.dirty){
            return confirm('Are you sure you want to leave ?');
        }
        return true;
    }
}