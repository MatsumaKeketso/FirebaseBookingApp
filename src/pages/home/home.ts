import { Component } from '@angular/core';
import { NavController, LoadingController, ToastController } from 'ionic-angular';
import { LoginOwnerPage } from '../login-owner/login-owner';
import * as firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public toastCtrl: ToastController, private userProv: UserProvider) {}
  asGuest(){
          this.navCtrl.push(LoginOwnerPage);
  }
  asOwner(){
    this.navCtrl.push(LoginOwnerPage);
  }
}
