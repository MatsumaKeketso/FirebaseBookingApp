import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from "angularfire2/auth";
import { UserProvider } from '../../providers/user/user';
import * as firebase from 'firebase';
import { ProfilePage } from '../profile/profile';
import { OwnerHomePage } from '../owner-home/owner-home';
import { BookingPage } from '../booking/booking';
@IonicPage()
@Component({
  selector: 'page-register-owner',
  templateUrl: 'register-owner.html',
})
export class RegisterOwnerPage {
  db = firebase.firestore()
  error: string;
  user = {} as Register;
  passmatch = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth, private userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterOwnerPage');
    console.log('Room: ', this.navParams);

  }
  rpassword(event){
    if(this.user.password !== event.path[0].value){
      this.error = 'Passwords do not match.'
    } else {
      this.error = ''
      this.passmatch = true;
    }

  }
  toLogin(){
    this.navCtrl.pop();
  }
  register(){
    if (!this.user.email || !this.user.password){
      this.error = "The inputs should not be empty."
    } else if (this.user.password.length < 6) {
      this.error = "Password must be more than 6 characters long."
    } else {
      if (this.passmatch){
        this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password).then(res => {
          if (res) {
            this.navCtrl.push(ProfilePage, this.navParams.data);
          }
        }, err => {
          this.error = err.message;
        })
      }
    }
  }
}
export interface Register {
  email: string;
  password: string;
}
