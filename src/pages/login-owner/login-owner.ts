import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, } from 'ionic-angular';
import { OwnerHomePage } from "../owner-home/owner-home";
import { RegisterOwnerPage } from '../register-owner/register-owner';
import * as firebase from 'firebase';
import { UserProvider } from "../../providers/user/user";
import { HomePage } from '../home/home';
@IonicPage()
@Component({
  selector: 'page-login-owner',
  templateUrl: 'login-owner.html',
})
export class LoginOwnerPage {
  error: string;
  firebase = firebase;
  db = firebase.firestore();
  user = {} as Login;
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, private userProv: UserProvider) {
    this.login();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginOwnerPage');

  }
  toRegister(){
    this.navCtrl.push(RegisterOwnerPage);
  }
  async login(){
    const loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Please Wait..'
    });
    loading.present();
    this.firebase.auth().onAuthStateChanged( user => {
      if (user){
        // send the user's data if they're still loggedin
        this.userProv.setUser(user);
        loading.dismiss();
        console.log('login user auth response: ', user);
        // from user we can access the uid by : user.uid
        this.navCtrl.setRoot(OwnerHomePage, user);
      } else {
          if(!this.user.email || !this.user.password){
            loading.dismiss();
          } else {

            this.firebase.auth().signInWithEmailAndPassword(this.user.email, this.user.password).then(res => {
              if (res.user.uid){
                // send the user data to provider if they just signed in

                this.userProv.setUser(res);
                loading.dismiss();
                console.log("Response from signin: ", res);

                this.navCtrl.setRoot(OwnerHomePage, {userId: res.user});
                console.log('Login user signin response: ', user);
              }
            }, err => {
              console.log("Error: ", err);
              this.error = err.message;
              console.log('Owner user signin error: ', err);
              loading.dismiss();
            })
          }
      }
    })
  }
  toHome(){
    this.navCtrl.setRoot(HomePage);
  }
}
export interface Login {
  email: string;
  password: string;
}
