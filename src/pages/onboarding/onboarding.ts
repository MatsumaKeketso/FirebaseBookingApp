import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Slides, LoadingController } from 'ionic-angular';
import { ProfilePage } from '../profile/profile';
import { OwnerHomePage } from '../owner-home/owner-home';
import { LoginOwnerPage } from '../login-owner/login-owner';
import { RegisterOwnerPage } from '../register-owner/register-owner';
import * as firebase from 'firebase';
import { UserProvider } from '../../providers/user/user';

@IonicPage()
@Component({
  selector: 'page-onboarding',
  templateUrl: 'onboarding.html',
})
export class OnboardingPage {
  @ViewChild('slides') slides: Slides;
  db = firebase.firestore();
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProv: UserProvider, public loadingCtrl: LoadingController
    ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OnboardingPage');
    // this.slides.lockSwipes(true);
    const loading = this.loadingCtrl.create({
      content: 'Just a sec',
      spinner: 'bubbles'
    })
    loading.present();
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.userProv.setUser(user);
        
        this.db.collection('users').where('uid', '==', user.uid).get().then(snapshot => {
          if (snapshot.empty){
            loading.dismiss();
            this.navCtrl.setRoot(ProfilePage)
          } else {
            loading.dismiss();
            this.navCtrl.setRoot(OwnerHomePage)
          }
        })
      } else {
        loading.dismiss();
      }
    })
  }
  changeSlide(val){
    this.slides.slideTo(val);
  }
  login(){
    this.navCtrl.setRoot(LoginOwnerPage);
  }
  creteAccount(){
    this.navCtrl.setRoot(RegisterOwnerPage);
  }
  notNow(){
    this.navCtrl.push(OwnerHomePage);
  }
  skip(){
    while (!this.slides.isEnd()) {
      this.slides.slideNext();
    }
  }
}
