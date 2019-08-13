import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController, AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { OwnerHomePage } from '../owner-home/owner-home';
import { BookingPage } from '../booking/booking';
import { UserProvider } from '../../providers/user/user';
import { RegisterOwnerPage } from '../register-owner/register-owner';
@IonicPage()
@Component({
  selector: 'page-owner-view-hotel',
  templateUrl: 'owner-view-hotel.html',
})
export class OwnerViewHotelPage {
  db = firebase.firestore();
  rating = 4;
  stars = []
  room = {};
  user;
  isAnonymous = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public load: LoadingController, public toastCtrl: ToastController, private userProv: UserProvider, public alertCtrl: AlertController) {
  }
  ionViewDidLoad() {
    console.log('Room received: ', this.navParams.data.room);
    this.room = this.navParams.data.room;
    console.log('User ', this.userProv.getUser());

  }
  goBack(){
    // go back to home page
    // this.userProv.storeHotels(null);
    this.navCtrl.pop();
  }
  toBooking(val){
    const loader = this.load.create({
      content: 'Loading',
      spinner: 'bubbles'
    })
    loader.present()
    firebase.auth().onAuthStateChanged(user => {
      if (user){
        this.userProv.setUser(user);
        this.navCtrl.push(BookingPage, this.room);
        loader.dismiss();
      } else {
        console.log('No user');
        loader.dismiss();
        this.alertCtrl.create({
          title: 'Create Account.',
          message: 'You have to be signed in to continue. Create an account?',
          buttons: [
            {
              text: 'Not yet',
              handler: data => {
                console.log('Cancelled');

              }
            },
            {
              text: 'Yes',
              handler: data => {
                this.navCtrl.push(RegisterOwnerPage, this.room);
              }
            }
          ]
        }).present()
      }
    })
  }
}
export interface HotelData {
  hotelName: string;
  image: string;
  description: string;
  services: any [];
  location: string;
  contacts: string;
}
