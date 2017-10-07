import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { Login } from '../login/login';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
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
    constructor(public navCtrl: NavController, public authData: AuthData, private _AngularFirestore: AngularFirestore, private storage: Storage) {
        this.usersCollection = _AngularFirestore.collection<User>('users');
        // this.users = this.usersCollection.valueChanges();

        this.users = this.usersCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as User;
                const id = a.payload.doc.id;
                return { id, ...data };
            });
        });
    }

    showMessages(id) {
        let _id:String[] = []
        _id.push(id)
        this.storage.get('uid').then((uid) => {
            _id.push(uid)
        }).then(()=>{
            console.log(_id[0] + "--" + _id[1])
        })
    }

    logOut() {
        this.authData.logoutUser().then(() => {
            this.navCtrl.setRoot(Login);
        });
    }

}
