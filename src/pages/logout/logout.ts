import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { AngularFireDatabase } from "angularfire2/database"
import { LoginOwnerPage } from '../login-owner/login-owner';
import { ProfilePage } from '../profile/profile';
import { ViewbookingPage } from '../viewbooking/viewbooking';

@IonicPage()
@Component({
  selector: 'page-logout',
  templateUrl: 'logout.html',
})
export class LogoutPage {
  database = AngularFireDatabase;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, public toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LogoutPage');
  }
  logout() {
    firebase.auth().signOut().then(res => {
      this.toast.create({
        message: 'Logout Successful.',
        duration: 3000
      }).present();
      this.navCtrl.push(LoginOwnerPage);
    }).catch( err => {
      this.toast.create({
        message: err,
        duration: 3000
      }).present();
      //
    })
  }
  toProfile(){
    this.navCtrl.push(ProfilePage);
  }
  toReservations(){
    this.navCtrl.push(ViewbookingPage);
  }
}
