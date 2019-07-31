import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { OwnerAddRoomsPage } from '../owner-add-rooms/owner-add-rooms';
import { AngularFireDatabase } from "angularfire2/database"
import { Camera, CameraOptions } from "@ionic-native/camera";
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-owner-add-hotel',
  templateUrl: 'owner-add-hotel.html',
})
export class OwnerAddHotelPage {
  database = AngularFireDatabase;
  db = firebase.firestore();
  storage = firebase.storage().ref();

  uniqueimage = '';
  isselected = false;
  prog;
  services = ['24-hour room service',
    '24-hour reception',
    'Airport shuttle',
    'Beach / Sun umbrellas',
    'Business centre',
    'Car park',
    'Casino',
    'Concierge',
    'Conference rooms',
    'Deck chairs / Sun loungers',
    'Doctor on site',
    'Express check-in / out',
    'Gym',
    'Hotel bar',
    'Hotel safe',
    'Laundry service',
    'Lift',
    'Nightclub',
    'Non-smoking rooms',
    'Outdoor swimming pool',
    'PC with internet',
    'Pool bar',
    'Porter service',
    'Restaurant',
   'Room service',
    'Washing machine'
  ]; // for the hotel
  items = [];
  hotel = {
    ownerid: '',
    hotelName: '',
    images: '', // understand the structure? its an array :)
    description: '',
    services: [], // understand the response?: its an array :)
    location: '',
    contacts: ''
  } as HotelModel;
  constructor(public navCtrl: NavController, public navParams: NavParams,  public camera: Camera, private loadingCtrl: LoadingController, private toastCtrl: ToastController) {}

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerAddHotelPage');
    this.hotel.ownerid = this.navParams.data.uid;
    console.log('Add hotel params received: ', this.navParams);
    // from this we can access this.navParams.data.uid
  }
  async selectImage(){
    // image options
    const option: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }
    // get image from phone's library
    await this.camera.getPicture(option).then( res => {
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;
      this.uniqueimage = image;
      this.isselected = true;

    }, err => {
      console.log("Something went wrong: ", err);
    })
  }
  deleteImage(){
    // reset the image to null
    this.uniqueimage= '';
    console.log(this.hotel.images);
  }
  addHotel(){
    // checks if the image is selected, if true...

    if (this.isselected) {
      // ...load the upload process
      let load = this.loadingCtrl.create({
      content: 'Uploading'
    });
    load.present();
    // set the image name to the hotel's name
    const hotelImages = this.storage.child(this.hotel.hotelName+'.jpg');
    // put the image inside the storage
    const upload = hotelImages.putString(this.uniqueimage, 'data_url');
    // check on the state of the upload
    upload.on('state_changed', snapshot => {
      this.prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (this.prog == 100) {
        // dismiss the 'Uploading' loadtCtrl
        load.dismiss();
      }
    }, error => {
    }, () => {
      // get the download url of the image once the upload is complete
      upload.snapshot.ref.getDownloadURL().then( downloadURL => {
        console.log('File Available at ', downloadURL);
        // assign the image url to the images property of the hotel object
        this.hotel.images = downloadURL;
        // check the inputs of the form
        if (!this.hotel.hotelName || !this.hotel.description || !this.hotel.location || !this.hotel.services){
          // handle the empty fields
          this.toastCtrl.create({
            message: "Don't leave fields empty.",
            duration: 2000
          }).present();
        }else{
          // send the hotel data to the database once the errs are handled
          const hotel = this.db.collection('hotels').doc(this.hotel.hotelName).set(this.hotel);
          // check the response of the hotel from the database
        hotel.then( res => {
          this.toastCtrl.create({
            message: 'Hotel added successfully',
            duration: 3000
          }).present();
          // push to the Rooms page with the hotel's name
          this.navCtrl.push(OwnerAddRoomsPage, this.hotel.hotelName);
        }, err => {
          // handle the error of the data upload
          this.toastCtrl.create({
            message: 'Error adding hotel',
            duration: 3000
          }).present();
        })
        }
      })
    })
    } else {
      // ...handle the unselected hotel image
      this.toastCtrl.create({
        message: 'Please upload image first.',
        duration: 3000
      }).present();
    }


}
}
// model for the hotel data (helps with intelisens)
export interface HotelModel {
  ownerid: string;
  hotelName: string;
  images: any;
  description: string;
  services: any [];
  rooms: string; // reference in firebase database
  location: string;
  contacts: string;
}
