import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';

export interface User {
   name: string;
   email:string
  }

@Injectable()
export class AuthData {
  private usersCollection: AngularFirestoreCollection<User>;
  users: Observable<User[]>;
  constructor(private _AngularFirestore: AngularFirestore) {
    this.usersCollection = _AngularFirestore.collection<User>('users');
    this.users = this.usersCollection.valueChanges();
  }

  /**
   * [loginUser We'll take an email and password and log the user into the firebase app]
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  loginUser(email: string, password: string) {
    return firebase.auth().signInWithEmailAndPassword(email, password);
  }

  /**
   * [signupUser description]
   * This function will take the user's email and password and create a new account on the Firebase app, once it does
   * it's going to log the user in and create a node on userProfile/uid with the user's email address, you can use
   * that node to store the profile information.
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  signupUser(name: string, email: string, password: string){
    return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {
      this.usersCollection.doc(newUser.uid).set({
        name: name,
        email: email
      });
      // firebase.database().ref('/userProfile').child(newUser.uid).set({
      //   name: name,
      //   email: email
      // });
      console.log(this.users,"users");
    });
  }

  /**
   * [resetPassword description]
   * This function will take the user's email address and send a password reset link, then Firebase will handle the
   * email reset part, you won't have to do anything else.
   *
   * @param  {string} email    [User's email address]
   */
  resetPassword(email: string) {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  /**
   * This function doesn't take any params, it just logs the current user out of the app.
   */
  logoutUser() {
    return firebase.auth().signOut();
  }

  getUsers(){
    return this.users;
  }

}
