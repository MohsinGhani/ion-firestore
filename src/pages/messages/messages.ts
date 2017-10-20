import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
  private messagesCollection: AngularFirestoreCollection<any>;
  messages: Observable<any[]>;
  chatID: String;
  from: String;
  to: String;
  message: String
  constructor(public navCtrl: NavController, public navParams: NavParams, private _AngularFirestore: AngularFirestore) {
    this.chatID = navParams.get('chatID');
    this.from = navParams.get('from');
    this.to = navParams.get('to');
    // console.log("from:" + this.from + " to:" +  this.to)
    this.messages = _AngularFirestore.collection<any>('conversation').doc(`${this.from}`).collection(`${this.to}`).valueChanges()
  }

  ionViewDidLoad() {
    // console.log('ionViewDidLoad MessagesPage');
  }

  gotoHome() {
    this.navCtrl.setRoot(HomePage);
  }

  sendMessageOnEnter(event) {
    if (event.code === "Enter") {
      event.preventDefault();
      this.sendMessage();
    }
  }

  sendMessage() {
    let msg = { text: this.message, from: this.from, to: this.to }
    this.message = null
    this._AngularFirestore.collection<any>('conversation').doc(`${this.from}`).collection(`${this.to}`).add(msg)
    // add in receiver node
    this._AngularFirestore.collection<any>('conversation').doc(`${this.to}`).collection(`${this.from}`).add(msg)
  }

}
