import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { Login } from '../login/login';
import { MessagesPage } from '../messages/messages';
import { AngularFirestore, AngularFirestoreCollection,AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { ChatComponent } from '../../components/chat/chat';
import { Storage } from '@ionic/storage';

export interface User {
    name: string;
    email: string;
    isPresence: boolean;
}

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private chatPage = ChatComponent;
    private usersCollection: AngularFirestoreCollection<User>;
    users: Observable<User[]>;
    messages: Observable<any>;
    constructor(public navCtrl: NavController, public authData: AuthData, private _AngularFirestore: AngularFirestore, private storage: Storage) {
        this.usersCollection = _AngularFirestore.collection<User>('users');
        // this.users = this.usersCollection.valueChanges();
        this.users = this.usersCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as User;
                const id = a.payload.doc.id;
                return { id, ...data };
            });
        })
    }

    showMessages(id) {
        let _id:String[] = []
        let chatID:String;
        _id.push(id)
        this.storage.get('uid').then((uid) => {
            _id.push(uid)
        }).then(()=>{
            // _id.sort()
            chatID = `${_id[0]}-${_id[1]}`
            this.navCtrl.push(MessagesPage, {
                chatID: chatID,
                from: _id[1],
                to:_id[0]
              });
        })
        
    }

    logOut() {
        this.authData.logoutUser().then(() => {
            this.navCtrl.setRoot(Login);
        });
    }

}
