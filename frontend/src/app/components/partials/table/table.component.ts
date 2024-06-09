import { Component } from '@angular/core';

@Component({
  selector: 'table',
  templateUrl: './app.component.html',
  styleUrls: [ './app.component.css' ]
})
export class AppComponent  {
  name = 'Angular 6';
  email="";
  aa:boolean=false;

  users=[{
    id:'123',
    email:'abc@gmail.com'
  },{
    id:'1234',
    email:'xyz@hotmail.com'
  },{
    id:'12345',
    email:'jsgsbh@kk.com'
  },{
    id:'123456',
    email:'test@gmail.com'
  }]

  setIndex(ii: boolean){
    this.aa=ii;
    console.log
  }
}