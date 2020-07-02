import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/Photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_service/Auth.service';
import { UserService } from 'src/app/_service/user.service';
import { AlertifyService } from 'src/app/_service/Alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {

  @Input() photos: Photo[] ;
  @Output() UpdateMainphoto = new EventEmitter<string>();

  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = environment.apiUrl;
  currentMainPhoto: Photo ;

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }
  constructor(private auth: AuthService, private userSer: UserService, private alert: AlertifyService) { }

  ngOnInit() {
    this.InitializeUploader();
  }

  InitializeUploader(){
    this.uploader = new FileUploader({
      url: this.baseUrl + 'Users/' + this.auth.decodedToken.nameid + '/Photos',
      authToken: 'Bearer ' + localStorage.getItem('token') ,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
      removeAfterUpload : true,
      isHTML5: true,
      allowedFileType : ['image']
    });
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onSuccessItem = (item , response, status, header) => {
      if ( response ){
        const res: Photo = JSON.parse(response);
        const photo: Photo = {
          id : res.id,
          url : res.url,
          description : res.description,
          dataAdded : res.dataAdded,
          isMain : res.isMain
        };
        this.photos.push(photo);
        if (photo.isMain){
          this.auth.ChangeMainPhoto(photo.url);
          this.auth.CurrentUser.photoUrl = photo.url;
          localStorage.setItem('user', JSON.stringify(this.auth.CurrentUser));
        }
      }
    };
  }
setMainPhoto(photo: Photo){
  this.userSer.setMainPhoto(this.auth.decodedToken.nameid , photo.id ).subscribe(() => {
    this.currentMainPhoto = this.photos.filter( p => p.isMain === true)[0] ;
    this.currentMainPhoto.isMain = false;
    photo.isMain = true ;
    // this.UpdateMainphoto.emit(photo.url);
    this.auth.ChangeMainPhoto(photo.url);
    this.auth.CurrentUser.photoUrl = photo.url;
    localStorage.setItem('user', JSON.stringify(this.auth.CurrentUser));
    this.alert.success('Success');
  }, error => {
    this.alert.error('Something went Wrong pls try again');
  }) ;
}
DeletePhoto(id: number){
  this.alert.confirm('Are you sure you want to delete this Image', () => {
    this.userSer.DeletePhoto(this.auth.decodedToken.nameid , id).subscribe(() => {
      this.photos.splice(this.photos.findIndex(p => p.id === id) , 1);
      this.alert.success('Image delete successfully');
    }, error => {
      this.alert.error('please try again later') ;
    });
  });
}

}
