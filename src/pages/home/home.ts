import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AuthData } from '../../providers/auth-data';
import { Login } from '../login/login';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface User {
    name: string;
    email:string
   }

@Component({
    selector: 'page-home',
    templateUrl: 'home.html'
})
export class HomePage {
    private usersCollection: AngularFirestoreCollection<User>;
    users: Observable<User[]>;
    constructor(public navCtrl: NavController, public authData: AuthData, private _AngularFirestore: AngularFirestore) {
        this.usersCollection = _AngularFirestore.collection<User>('users');
        this.users = this.usersCollection.valueChanges();
    }
    logOut() {
        this.authData.logoutUser().then(() => {
            this.navCtrl.setRoot(Login);
        });
    }

    // ionViewWillEnter() {
    //        console.log(this.user)
    // }
}
