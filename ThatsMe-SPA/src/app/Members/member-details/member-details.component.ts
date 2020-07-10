import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AlertifyService } from 'src/app/_service/Alertify.service';
import { ActivatedRoute } from '@angular/router';
import { User } from 'src/app/_models/User';
import { UserService } from 'src/app/_service/user.service';
import { NgxGalleryOptions, NgxGalleryImage, NgxGalleryAnimation } from 'ngx-gallery-9';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.css']
})
export class MemberDetailsComponent implements OnInit {

  constructor(private userService: UserService , private alert: AlertifyService , private route: ActivatedRoute) { }
  @ViewChild('memberTabs', {static: true}) memberTabs: TabsetComponent ;
  user: User;
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  ngOnInit() {
    this.route.data.subscribe(data => {
    this.user = data['user'];
    });
    this.route.queryParams.subscribe(params => {
      const selectedTab = params['tab'];
      this.memberTabs.tabs[selectedTab > 0 ? selectedTab : 0].active = true;
    });
    this.galleryOptions = [
    {
      width: '500px',
      height: '500px',
      imagePercent : 100,
      thumbnailsColumns: 4,
      imageAnimation: NgxGalleryAnimation.Slide,
      preview : false
    }
  ];
    this.galleryImages = this.getImages();
  }
  getImages(){

    const imgsUrls = [];
    for (const photo of this.user.photos) {
      imgsUrls.push({
        small: photo.url,
        medium: photo.url,
        big: photo.url,
        description: photo.description
      });
    }
    return imgsUrls;
  }
  selectTab(tabId: number){
    this.memberTabs.tabs[tabId].active = true;
  }
  // LoadUser(){
  //   this.userService.getUser(+this.route.snapshot.params['id']).subscribe((user: User) =>{
  //     this.user = user;
  //   }, error =>{
  //     this.alert.error(error);
  //   });
  // }
}
