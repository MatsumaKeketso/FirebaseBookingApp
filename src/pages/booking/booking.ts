import {
  Component
} from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  ToastController,
  LoadingController
} from 'ionic-angular';
import {
  UserProvider
} from '../../providers/user/user';
import * as firebase from 'firebase';
import { PaymentPage } from '../payment/payment';
@IonicPage()
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
  db = firebase.firestore();
  // stores the room info
  room = {} as Room;
  // stores the form data
  bookingInfo = {
    uid: null, // from provider
    name: null, // from form
    surname: null, // from form
    email: null, // from form
    phone: null, // from form
    checkin: null, // from form
    checkout: null, // from form
    adults: null, // from form
    price: 0, // from calculation
    days: 0, // from calculation
    roomname: null,
  };
  userData;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private userProv: UserProvider, public toastCtrl: ToastController, public loadCtrl: LoadingController) {}

  ionViewDidLoad() {
    console.log(this.navParams);
    this.room = this.navParams.data;
    this.bookingInfo.roomname = this.room.name;
    this.bookingInfo.uid = this.userProv.getUser().uid;
    console.log( 'The room: ', this.room);
    this.getProfile()

  }
  goBack() {
    this.navCtrl.pop();
    this.userData = this.userProv.getUser();
  }
  createBooking() {
    if (
      !this.bookingInfo.name ||
      !this.bookingInfo.surname ||
      !this.bookingInfo.email ||
      !this.bookingInfo.phone ||
      !this.bookingInfo.checkin ||
      !this.bookingInfo.checkout ||
      !this.bookingInfo.adults
    ) { // CHECK IF INPUTS ARE EMPTY
      this.toastCtrl.create({
        message: 'All fields must be filled',
        duration: 3000
      }).present();
    } else {

      const start = new Date(this.bookingInfo.checkin);
      const end = new Date(this.bookingInfo.checkout);​​
      const days = 1000 * 60 * 60 * 24;
      const month = 1000 * 60;
      const diff = end.valueOf() - start.valueOf();
      const Verr = Math.floor(diff / days);
      if (Verr <= 0) { // CHECK IF THE DATE IS IN THE FUTURE
        this.toastCtrl.create({
          message: 'Pick a future date for check out',
          duration: 3000
        }).present();
      } else {
          if (this.bookingInfo.phone.length < 10 || this.bookingInfo.phone.length > 10) { // CHECK IF THE PHONE IS 10 DIGITS
            this.toastCtrl.create({
              message: 'Phone number must be 10 digits',
              duration: 3000
            }).present();
          } else {
            // IF ALL IS WELL THEN..
              let StartDate = new Date(this.bookingInfo.checkin);
              let EndDate = new Date(this.bookingInfo.checkout);
              // calculate number of days
              const days = 1000 * 60 * 60 * 24;
              const diff = EndDate.valueOf() - StartDate.valueOf();
              this.bookingInfo.days = Math.floor(diff / days); // 2
              // calculate the amount cost of stay
              this.bookingInfo.price = this.room.price * this.bookingInfo.days * parseInt(this.bookingInfo.adults); // 3
              console.log( 'tHE BOOKING INFO: ' ,this.bookingInfo);
               // EVERYTHING SHOULD BE FINE

                this.db.collection('bookings').doc(this.bookingInfo.roomname+this.userProv.getUser().uid).set(this.bookingInfo).then(res => {
                  this.toastCtrl.create({
                    message: 'Success',
                    duration: 3000
                  }).present();
                  this.navCtrl.push(PaymentPage, {booking: this.bookingInfo, room: this.navParams.data});
                }).catch(err => {
                  this.toastCtrl.create({
                    message: 'Failed',
                    duration: 3000
                  }).present();
                });
          }
      }
    }
  }
  getProfile() {
    // load the process
    let load = this.loadCtrl.create({
      content: 'Fetching your Profile...'
    });
    load.present();
    // create a reference to the collection of users...
    let users = this.db.collection('users');
    // ...query the profile that contains the uid of the currently logged in user...
    let query = users.where("uid", "==", this.userProv.getUser().uid);
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true) {
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          this.bookingInfo.name = doc.data().name;
          this.bookingInfo.surname = doc.data().surname;
          this.bookingInfo.email = doc.data().email;
          this.bookingInfo.phone = doc.data().phone;
        })
      } else {
        console.log('No data');
      }
      // dismiss the loading
      load.dismiss();
    }).catch(err => {
      // catch any errors that occur with the query.
      console.log("Query Results: ", err);
      // dismiss the loading
      load.dismiss();
    })
  }
}
export interface Room {
  name: string;
  description: string;
  image: string;
  features : [any],
  lastcreated: string;
  sleeps: any;
  price: number;
}
