import { Component,  } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { ConfirmedPage } from '../confirmed/confirmed';
@IonicPage()
@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html',
})
export class PaymentPage {
  db = firebase.firestore();
  booking = {
    adults: null,
checkin: null,
checkout: null,
days:null,
email:null,
name:null,
phone: null,
price:null,
roomname:null,
surname:null,
uid: null
  };
  room = {
    description: null,
features: [],
image: null,
lastcreated: null,
name: null,
price: null,
sleeps: null,
  };
  payment = {
    method: '',
    name: '',
    surname: '',
    cardnumber: null,
    cvv: null,
    expiration: null
  }
  constructor(public navCtrl: NavController, public navParams: NavParams, public toast: ToastController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PaymentPage');
    console.log(this.navParams);
    this.booking = this.navParams.data.booking;
    this.room = this.navParams.data.room;
    this.payment.name = this.booking.name;
    this.payment.surname = this.booking.surname;
  }
  confirm(){
    if (!this.payment.cardnumber ||
      !this.payment.method ||
      !this.payment.name ||
      !this.payment.surname ||
      !this.payment.cvv ||
      !this.payment.expiration){
        this.toast.create({
          message: 'Please full all form fields.',
          duration: 3000
        }).present();
      } else {
        let date = new Date(this.booking.checkout); // past
        let expiary = new Date(this.payment.expiration); // the future
        let day = 1000 *60 *60 *24;
        let diff = expiary.valueOf() - date.valueOf();
        let actual = Math.floor(diff/ day);
        if (actual < 0){
          this.toast.create({
            message: 'Payment invalid. Your card will expire before you reach your checkout.',
            duration: 3000
          }).present();
        } else{
          if (this.payment.cardnumber.length < 13 || this.payment.cardnumber.length > 13) {
            this.toast.create({
              message: 'Card number invalid. Digits are more or less than 13.',
              duration: 3000
            }).present();
          } else {
            if (this.payment.cvv.length < 3 || this.payment.cvv.length > 3) {
              this.toast.create({
                message: 'CVV invalid. Digits are more or less than 3.',
                duration: 3000
              }).present();
            } else {
              this.db.collection('bookings').doc(this.booking.roomname+this.booking.uid).collection('payment').doc(this.payment.method).set(this.payment).then(res => {
           this.navCtrl.push(ConfirmedPage);
          }).catch(err => {
            this.toast.create({
              message: 'Something went wrong',
              duration: 3000
            }).present();
          })
            }
          }

        }
      }
  }
}
