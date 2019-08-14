import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-about-hotel',
  templateUrl: 'about-hotel.html',
})
export class AboutHotelPage {
  db = firebase.firestore();
  hotel = {}
  images = {}
  attractions = [];
  facilities = {};
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AboutHotelPage');
    this.db.collection('hotel').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.hotel = doc.data();
      })
      this.hotel;
    })
    this.getImages();
    this.getAttractions();
    this.getFacilities();
  }
  getImages(){
    this.db.collection('hotelgallery').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.images = doc.data();
      })
    })
  }
  getAttractions(){
    this.db.collection('attractions').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.attractions.push(doc.data());
      })
      console.log("attractions: ", this.attractions);
    })
  }
  getFacilities(){
    this.db.collection('facilities').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.facilities = doc.data();
      })
    })
  }
  back(){
    this.navCtrl.pop();
  }
}
