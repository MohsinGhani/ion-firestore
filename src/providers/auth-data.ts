import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';

export interface User {
  name: string;
  email: string
}

@Injectable()
export class AuthData {
  private usersCollection: AngularFirestoreCollection<User>;
  private isPresenceCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;

  constructor(private _AngularFirestore: AngularFirestore, private storage: Storage) {
    this.usersCollection = _AngularFirestore.collection<User>('users');
    this.isPresenceCollection = _AngularFirestore.collection<User>('presence');
    this.users = this.usersCollection.valueChanges();
  }

  loginUser(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password).then((user) => {
      this._AngularFirestore.collection('users', ref => ref.where('email', '==', email)).valueChanges().subscribe((user) => {
        this.storage.set('uid', user[0]['id']);
        this.usersCollection.doc(user[0]['id']).update({
          isPresence: true
        })
      })
    })
  }

  signupUser(id: any, name: string, email: string, password: string) {
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
      this.usersCollection.doc(id).set({
        id: id,
        name: name,
        email: email,
        isPresence: true
      }).then(() => {
        this.storage.set('uid', id);
      })
    });
  }

  resetPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  logoutUser() {
    this.storage.get('uid').then((id) => {
      this.usersCollection.doc(id).update({
        isPresence: false
      })
      this.storage.set('uid', null);
    });
    return firebase.auth().signOut()
  }

  getUsers() {
    return this.users;
  }

}
