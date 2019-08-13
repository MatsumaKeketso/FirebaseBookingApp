import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { OwnerHomePage } from "../owner-home/owner-home";
import { RegisterOwnerPage } from '../register-owner/register-owner';
import * as firebase from 'firebase';
import { UserProvider } from "../../providers/user/user";
import { HomePage } from '../home/home';
import { ProfilePage } from '../profile/profile';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EmailValidator } from '../../validators/emails';
@IonicPage()
@Component({
  selector: 'page-login-owner',
  templateUrl: 'login-owner.html',
})
export class LoginOwnerPage {
  loginForm: FormGroup;
  error: string;
  firebase = firebase;
  db = firebase.firestore();
  user = {} as Login;
  constructor(public navCtrl: NavController,public formBuilder: FormBuilder, public navParams: NavParams, public loadingCtrl: LoadingController, private userProv: UserProvider, public alertCtrl: AlertController) {
    this.loginForm = formBuilder.group({
      email: ['', Validators.compose([Validators.required, EmailValidator.isValid])],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])]
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginOwnerPage');
    this.firebase.auth().onAuthStateChanged( user => {
      if (user){
        // send the user's data if they're still loggedin
        this.userProv.setUser(user);
        this.db.collection('users').where('uid', '==', this.userProv.getUser().uid).get().then(snapshot => {
          if (snapshot.empty){
            this.navCtrl.push(ProfilePage);
          } else {
            this.navCtrl.setRoot(OwnerHomePage);
          }
        });
      }
    })
  }
  toRegister(){
    this.navCtrl.push(RegisterOwnerPage);
  }
  async login(){
    if (!this.loginForm.valid){
      this.alertCtrl.create({
        message: 'Fields cannot be left empty.'
      }).present();
    } else {
      const loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please Wait..'
    });
    loading.present();
      this.firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password).then(res => {
        if (res.user.uid){
          // send the user data to provider if they just signed in
          // CHECK IF THE USER HAS PROFILE
          this.db.collection('users').where('uid', '==', res.user.uid).get().then(snapshot => {
            snapshot.forEach(doc => {
              console.log(doc.data());

            })
            loading.dismiss();
          })
          // this.userProv.setUser(res);
          // loading.dismiss();
          // console.log("Response from signin: ", res);

          // this.navCtrl.setRoot(OwnerHomePage, {userId: res.user});
          // console.log('Login user signin response: ', user);
        }
      }, err => {
        console.log("Error: ", err);
        this.error = err.message;
        console.log('Owner user signin error: ', err);
        loading.dismiss();
      })
    }
  }
  toHome(){
    this.navCtrl.setRoot(HomePage);
  }
}
export interface Login {
  email: string;
  password: string;
}
