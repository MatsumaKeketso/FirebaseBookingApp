import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';

import { AngularFireAuth } from "angularfire2/auth";
import { UserProvider } from '../../providers/user/user';
import * as firebase from 'firebase';
import { ProfilePage } from '../profile/profile';
import { OwnerHomePage } from '../owner-home/owner-home';
import { BookingPage } from '../booking/booking';
import { LoginOwnerPage } from '../login-owner/login-owner';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/emails';
@IonicPage()
@Component({
  selector: 'page-register-owner',
  templateUrl: 'register-owner.html',
})
export class RegisterOwnerPage {
  signupForm: FormGroup;
  db = firebase.firestore()
  error: string;
  user = {} as Register;
  repPass = '';
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private afAuth: AngularFireAuth, 
    private userProvider: UserProvider, 
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    ) {
    this.signupForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      repPass: ['', Validators.compose([Validators.minLength(6), Validators.required])]
  });
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterOwnerPage');
    console.log('Room: ', this.navParams);
  }

  toLogin(){
    this.navCtrl.push(LoginOwnerPage, this.navParams);
  }
  register(){
    const loading = this.loadingCtrl.create({
      content: 'Checking..',
      spinner: 'bubbles'
    });
    loading.present();
    if (!this.user.email || !this.user.password){
      loading.dismiss();
      this.error = "The inputs should not be empty."
    } else if (this.user.password.length < 6) {
      loading.dismiss();
      this.error = "Password must be more than 6 characters long."
    } else {
      if (this.user.password == this.repPass){
        this.error = '';
        this.afAuth.auth.createUserWithEmailAndPassword(this.user.email, this.user.password).then(res => {
            loading.dismiss();
            this.userProvider.setUser(res);
              this.navCtrl.setRoot(ProfilePage);
        }, err => {
          loading.dismiss();
          this.error = err.message;
        })
      } else {
        loading.dismiss();
        this.error = 'Passwords do not match';
      }
    }
  }
}
export interface Register {
  email: string;
  password: string;
}
