import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-Value',
  templateUrl: './Value.component.html',
  styleUrls: ['./Value.component.css']
})
export class ValueComponent implements OnInit {
  title = 'Values';

  constructor(private _http:HttpClient) { }
  values:any;
  ngOnInit() {
    this.getValues();
  }
  getValues(){
    this._http.get("https://localhost:44305/api/values/").subscribe(
      respone =>{
        this.values = respone;
    },
    error=>{
      console.log("error");
    }
    )
  }

}
