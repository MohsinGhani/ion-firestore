import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthData } from '../../providers/auth-data';
import { EmailValidator } from '../../validators/email';
import { HomePage } from '../home/home';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface User {
    name: string;
    email: string;
    isPresence: boolean;
}

@IonicPage()
@Component({
    selector: 'page-signup',
    templateUrl: 'signup.html',
})

export class Signup {

    public signupForm;
    loading: any;
    private usersCollection: AngularFirestoreCollection<any>;
    users: Observable<any[]>;
    idVerification: boolean = false;

    private itemDoc: AngularFirestoreDocument<any>;
    item: Observable<any>;

    constructor(public nav: NavController, public authData: AuthData,
        public formBuilder: FormBuilder, public loadingCtrl: LoadingController,
        public alertCtrl: AlertController, private _AngularFirestore: AngularFirestore) {

        this.usersCollection = _AngularFirestore.collection<any>('users');

        this.users = this.usersCollection.snapshotChanges().map(actions => {
            return actions.map(a => {
                const data = a.payload.doc.data() as User;
                const id = a.payload.doc.id;
                return { id, ...data };
            });
        });

        this.signupForm = formBuilder.group({
            id: ['', Validators.compose([Validators.minLength(4), Validators.required])],
            name: ['', Validators.compose([Validators.minLength(6), Validators.required])],
            email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
            password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
        })
    }

    verifyID(event) {
        if (event){
            this.itemDoc = this._AngularFirestore.doc<any>(`users/${event}`);
            this.item = this.itemDoc.valueChanges();
            this.item.subscribe((user) => {
                if (user != null) {
                    this.idVerification = true
                }
                else{
                    this.idVerification = false
                }
            })
        }
    }

    signupUser() {
        if (!this.signupForm.valid) {
            console.log(this.signupForm.value);
        } else {
            this.authData.signupUser(this.signupForm.value.id, this.signupForm.value.name, this.signupForm.value.email, this.signupForm.value.password)
                .then(() => {
                    this.loading.dismiss().then(() => {
                        this.nav.setRoot(HomePage);
                    });
                }, (error) => {
                    this.loading.dismiss().then(() => {
                        let alert = this.alertCtrl.create({
                            message: error.message,
                            buttons: [
                                {
                                    text: "Ok",
                                    role: 'cancel'
                                }
                            ]
                        });
                        alert.present();
                    });
                });
            this.loading = this.loadingCtrl.create();
            this.loading.present();
        }
    }

}
