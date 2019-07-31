import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { ToastController } from 'ionic-angular';
/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider {
  user;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  profileImage ='';
  hotels;
  constructor(public http: HttpClient, public camera: Camera, public toastCtrl: ToastController) {
    console.log('Hello UserProvider Provider');
  }
  setUser(val){
    this.user = val;
    console.log('User form Provider', this.user);
  }
  getUser(){
    return this.user;
  }
  uploadProfile(val){
    const profileImages = this.storage.child('User Name.jpg');
    const upload = profileImages.putString(val, 'data_url');
  }
  createProfile(val){
    const profile = this.db.collection('users').add(val);

    profile.then( res => {
      this.toastCtrl.create({
        message: 'Profile Created',
        duration: 2000
      }).present();
    }, err => {
      this.toastCtrl.create({
        message: 'Profile creation Error. Try again later',
        duration: 2000
      }).present();
    })
  }
  editProfile(val){

  }
  deleteProfile(val){

  }
  storeHotels(val){
    this.hotels = val;
  }
  getHotels(){
    return this.hotels;
  }
}
