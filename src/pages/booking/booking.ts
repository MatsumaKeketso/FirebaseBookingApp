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
@IonicPage()
@Component({
  selector: 'page-booking',
  templateUrl: 'booking.html',
})
export class BookingPage {
  db = firebase.firestore();
  bookingInfo = {
    uid: null, // from provider
    name: null, // from form
    surname: null, // from form
    email: null, // from form
    phone: null, // from form
    checkin: null, // from form
    checkout: null, // from form
    adults: null, // from form
    cardnumber: null, // from form
    securitycode: null, // from form
    cardexpiary: null, // from form
    price: 0, // from calculation
    days: 0, // from calculation
    roomname: null,
    hotelname: null,
  };
  userData;
  userProfile = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProvider: UserProvider, private userProv: UserProvider, public toastCtrl: ToastController, public loadCtrl: LoadingController) {}

  ionViewDidLoad() {
    // console.log('Room In booking P', this.navParams);
    this.bookingInfo.hotelname = this.userProv.getHotels().data.hotel.hotelName
    this.bookingInfo.roomname = this.navParams.data.roomtype;
    this.bookingInfo.uid = this.userProvider.getUser().uid; // 1
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
      !this.bookingInfo.adults ||
      !this.bookingInfo.cardnumber ||
      !this.bookingInfo.securitycode ||
      !this.bookingInfo.cardexpiary
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
          message: 'Pick a future date for check in',
          duration: 3000
        }).present();
      } else {
        if (this.bookingInfo.cardnumber.length < 13 || this.bookingInfo.cardnumber.length > 13) { // CHECK IF THE CARD NUMBER IS 13 DIGITS
          this.toastCtrl.create({
            message: 'Card Number must be 13 digits',
            duration: 3000
          }).present();
        } else {
          if (this.bookingInfo.phone.length < 10 || this.bookingInfo.phone.length > 10) { // CHECK IF THE PHONE IS 10 DIGITS
            this.toastCtrl.create({
              message: 'Phone number must be 10 digits',
              duration: 3000
            }).present();
          } else {
            if (this.bookingInfo.securitycode.length > 3 || this.bookingInfo.securitycode.length < 3) { // CKECK IF THE SECURITY CODE IS 3 DIGITS
              this.toastCtrl.create({
                message: 'Security code must be 3 digits long.',
                duration: 3000
              }).present();
            } else { // IF ALL IS WELL THEN..
              let StartDate = new Date(this.bookingInfo.checkin);
              let EndDate = new Date(this.bookingInfo.checkout);
              // calculate number of days
              const days = 1000 * 60 * 60 * 24;
              const diff = EndDate.valueOf() - StartDate.valueOf();
              this.bookingInfo.days = Math.floor(diff / days); // 2
              // calculate the amount cost of stay
              this.bookingInfo.price = this.navParams.data.roomrate * this.bookingInfo.days * parseInt(this.bookingInfo.adults); // 3
              console.log( 'tHE BOOKING INFO: ' ,this.bookingInfo);
              if (!this.userProv.getUser().uid) { // CHECK IF THE USER ID IS FALSE. USE THE USER'S EMAIL IF THE ACCOUNT DOES NOT EXIST
                let usersBooking = this.db.collection('users');
                this.db.collection('users').doc(this.bookingInfo.email).collection('bookings').doc(this.userProv.getUser().uid).set(this.bookingInfo).then(res => {
                  this.toastCtrl.create({
                    message: 'Success',
                    duration: 3000
                  }).present();
                  this.navCtrl.pop()
                }).catch(err => {
                  this.toastCtrl.create({
                    message: 'Failed',
                    duration: 3000
                  }).present();
                })
              } else { // USE THE USER'S UID IF THE ACCOUNT EXISTS
                let usersBooking = this.db.collection('users');
                this.db.collection('users').doc(this.userProvider.getUser().uid).collection('bookings').doc(this.userProv.getUser().uid).set(this.bookingInfo).then(res => {
                  this.toastCtrl.create({
                    message: 'Success',
                    duration: 3000
                  }).present();
                  this.navCtrl.pop()
                }).catch(err => {
                  this.toastCtrl.create({
                    message: 'Failed',
                    duration: 3000
                  }).present();
                })
              }
            }
          }
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
          this.bookingInfo.phone = doc.data().number;
          // console.log('Profile Document from booking: ', this.userProfile);
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
