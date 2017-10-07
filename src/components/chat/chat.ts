import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
/**
 * Generated class for the ChatComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'chat',
  templateUrl: 'chat.html'
})
export class ChatComponent implements OnInit {

  text: string;

  constructor(private navController:NavController,private navParams:NavParams) {
    this.text = 'Hello World';
  }

  ngOnInit(){
    let data = this.navParams.data;
    console.log(data);
  }

  goBack(){
    this.navController.pop();
  }

}
