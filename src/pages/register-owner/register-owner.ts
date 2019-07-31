import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { AngularFireAuth } from "angularfire2/auth";
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-register-owner',
  templateUrl: 'register-owner.html',
})
export class RegisterOwnerPage {
  error: string;
  user = {} as Register;
  constructor(public navCtrl: NavController, public navParams: NavParams, private afAuth: AngularFireAuth, private userProvider: UserProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterOwnerPage');
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
      this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password).then(res => {
        if (res) {
          this.userProvider.setUser(res);
          this.navCtrl.pop();
        }
      }, err => {
        this.error = err.message;
      })
    }
  }
}
export interface Register {
  email: string;
  password: string;
}
