import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { User } from '../_models/User';
import { map } from 'rxjs/operators';
import { PaginationResult } from '../_models/Pagination';

/*const httpOption = {
  headers: new HttpHeaders({
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  })
};*/

@Injectable({
  providedIn: 'root'
})
export class UserService {

  baseUrl = environment.apiUrl ;
  constructor(private http: HttpClient) { }

getUsers(page?, itemsPerPage?, userParams?, likeParams?): Observable<PaginationResult<User[]>>{
  const paginationResult: PaginationResult<User[]> = new PaginationResult<User[]>();
  let params = new HttpParams();
  if (page != null && itemsPerPage != null) {
    params = params.append('pageNumber' , page);
    params = params.append('pageSize' , itemsPerPage);
  }
  if (userParams != null){
    params = params.append('gender', userParams.gender);
    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('orderBy', userParams.orderBy);
  }
  if (likeParams === 'Likers'){
    params = params.append('likers', 'true');
  }
  if (likeParams === 'Likees'){
    params = params.append('likees', 'true');
  }
  
  return this.http.get<User[]>(this.baseUrl + 'users', { observe: 'response', params})
  .pipe(
    map(response => {
      paginationResult.result = response.body;
      if (response.headers.get('Pagination') != null){
        paginationResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginationResult ;
    })
  );
}

getUser(id): Observable<User>{
  return this.http.get<User>(this.baseUrl + 'users/' + id);
}

updateUser(id: number, user: User){
  return this.http.put(this.baseUrl + 'users/' + id, user );
}
setMainPhoto(userId: number, id: number){
  return this.http.post( this.baseUrl + 'users/' + userId + '/photos/' + id + '/setMain' , {});
}
DeletePhoto(userId: number , id: number){
  return this.http.delete(this.baseUrl + 'users/' + userId + '/photos/' + id );
}
SendLike(id: number, recipientId: number){
  return this.http.post(this.baseUrl + 'users/' + id + '/like/' + recipientId , {});
}
}
