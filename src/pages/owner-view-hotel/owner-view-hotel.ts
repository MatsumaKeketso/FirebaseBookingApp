import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { OwnerHomePage } from '../owner-home/owner-home';
import { BookingPage } from '../booking/booking';
import { UserProvider } from '../../providers/user/user';
@IonicPage()
@Component({
  selector: 'page-owner-view-hotel',
  templateUrl: 'owner-view-hotel.html',
})
export class OwnerViewHotelPage {
  db = firebase.firestore();
   hotelData = {
     hotelName: '',
     image: '',
     description: '',
     services: [],
     location: '',
     contacts: ''
   } as HotelData
  rating = 4;
  stars = []
  rooms =[];
  user;
  isAnonymous = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public load: LoadingController, public toastCtrl: ToastController, private userProv: UserProvider) {
  }

  ionViewDidLoad() {
    this.isAnonymous = this.userProv.getUser().isAnonymous;
    // receive hotel data from the home page
    console.log('View Hotel Params received: ', this.navParams);
    this.userProv.storeHotels(this.navParams)
    console.log('Owner viewpage loaded');
    let loading = this.load.create({
      spinner: 'bubbles',
      content: 'Loading..'
    })
    loading.present();
    // for loop generating the hotel stars
    for (let i = 0; i < this.rating; i++) {
      this.stars.push(i);
    }
    // if we get a value from the param's data..
    if (this.navParams.data.hotel.images){
      // dismiss the load
      loading.dismiss();
      console.log(this.navParams);
      // assign variables to the data
      this.hotelData.hotelName = this.navParams.data.hotel.hotelName;
      this.hotelData.image = this.navParams.data.hotel.images;
      this.hotelData.description = this.navParams.data.hotel.description;
      this.hotelData.services = this.navParams.data.hotel.services;
      this.hotelData.location = this.navParams.data.hotel.location;
      this.hotelData.contacts = this.navParams.data.hotel.contacts;
      // get the rooms for that specific hotel
      this.getRooms();
    } else {
      // error handling
      let toast = this.toastCtrl.create({
        message: 'Error Loading Data',
        duration: 300
      })
      toast.present().then(()=> {
        this.navCtrl.pop();
      })
    }
  }
  goBack(){
    // go back to home page
    // this.userProv.storeHotels(null);
    this.navCtrl.pop();
  }
  async getRooms(){
    // inside the hotels collection, inside a specified document(Hotel name), get a collection that exists in there
    let rooms = this.db.collection('hotels').doc(this.hotelData.hotelName).collection('room');
    // assign the response to the doc function
    rooms.get().then(async doc => {
      doc.forEach(doc => {
        let room = doc.data();
        // '.data()' returns an object, push each object(Document) in a rooms array
        this.rooms.push(doc.data());
      })
      // get the email for this usser
      this.user = this.navParams.data.email;
    }).catch(err => {
      // error handling
      console.log('Error getting Document: ', err);
    });
    console.log(this.rooms);
  }
  deleteHotel(hotelname){
    const  load = this.load.create({
      content: 'Deleting'
    })
    load.present();
    this.db.collection("hotels").doc(this.hotelData.hotelName).delete().then(res => {
      let toast = this.toastCtrl.create({
        message:'Delete successful',
        duration: 3000
      })
      toast.present();
      load.dismiss();
      this.navCtrl.push(OwnerHomePage);
    }).catch( err => {
      let toast = this.toastCtrl.create({
        message:'Delete error',
        duration: 3000
      })
      load.dismiss();
      toast.present();
    });
  }
  toBooking(val){
    this.navCtrl.push(BookingPage, val)
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
