import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, Toast } from 'ionic-angular';
import { OwnerHomePage } from '../owner-home/owner-home';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import { CameraOptions, Camera } from '@ionic-native/camera';

@IonicPage()
@Component({
  selector: 'page-owner-add-rooms',
  templateUrl: 'owner-add-rooms.html',
})
export class OwnerAddRoomsPage {
  database = AngularFireDatabase;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  features = [
    'Air conditioning',
'Bathroom with bathtub',
'Desk',
'Electric kettle',
'Flatscreen TV',
'Free WiFi',
'Hairdryer',
'Room safe',
'Satellite TV',
'Telephone',
'Television'
  ];

  roomCollections: string;
  uniqueimage: any;

  isuploaded = false;
  room = {
    roomtype: '',
    roomimage: '',
    roomdescription: '',
    occupancy: null,
    roomrate: null,
    features: []
  } as Room
  // roomImages = this.storage.child(this.room.roomtype+'room.jpg');
   constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController, public loadCtrl: LoadingController, public camera: Camera) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad OwnerAddRoomsPage');
    console.log( 'Rooms params received: ' ,this.navParams);
    // retreive the hotel name from the paarameters
    this.roomCollections = this.navParams.data;
    console.log('Rooms Collections assigned', this.roomCollections);

  }
  // select image for the room
  async selectImage(){
    const option: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
      sourceType: this.camera.PictureSourceType.SAVEDPHOTOALBUM
    }

    await this.camera.getPicture(option).then( res => {
      console.log(res);
      const image = `data:image/jpeg;base64,${res}`;
      // assign the image to the unique image property
      this.uniqueimage = image;
      // set the proprty to true
      this.isuploaded = true;
    }, err => {
      console.log(err);
    })
  }
  addRoom(){
    if (this.isuploaded) {
    // UPLOAD THE IMAGE
    // uploading process
    const roomImages = this.storage.child(this.room.roomtype+'room.jpg');
    const upload = roomImages.putString(this.uniqueimage, 'data_url');

    let load = this.loadCtrl.create({
      content: 'Uploading'
    })
    load.present();
    // track uploading process
    upload.on('state_changed', snapshot => {
      let prog = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      if (prog == 100){
        load.dismiss();
      }
      // handle errors
    },err => {
      console.log(err);
    }, () => {
      // handle success
      // get the download url
      upload.snapshot.ref.getDownloadURL().then(downloadURL => {
        console.log('Room file Available at ', downloadURL);
        this.room.roomimage = downloadURL;
        this.toastCtrl.create({
          message: 'Upload Success',
          duration: 2000
        }).present();
        this.isuploaded = true;
        // UPLODE ROOM DATA

          // inside the hotels collection, at a specified document, inside that document's collection add this room document
            let toast = this.toastCtrl.create({
              message: "Don't leave fields empty.",
              duration: 2000
            }).present();

            let loading = this.loadCtrl.create({
              content: 'Adding Room',
              spinner: 'bubbles'
            })
            loading.present();
            let addroom = this.db.collection('hotels').doc(this.roomCollections).collection('room').doc(this.room.roomtype).set(this.room);

          addroom.then(res => {
            loading.dismiss();
            this.toastCtrl.create({
              message: 'Room saved.',
              duration: 2000
            }).present();
            this.room = {
              roomtype: '',
              roomimage: '',
              roomdescription: '',
              occupancy: null,
              roomrate: null,
              features: []
            }
            this.uniqueimage = '';
          }).catch((err)=>{
            loading.dismiss();
            this.toastCtrl.create({
              message: 'Room not saved. Please try again.',
              duration: 2000
            }).present();
          })

      }).catch(err => {
        this.toastCtrl.create({
          message:'Something went wrong',
          duration: 2000
        }).present();
      })
    })
  } else {
    this.toastCtrl.create({
      message:'Select image for room',
      duration: 2000
    }).present();
  }
  }
  toHome(){
    this.navCtrl.push(OwnerHomePage);
  }
  deleteImage(){
    this.uniqueimage = '';
  }
}
export interface Room {
  roomtype: string;
  roomimage: string;
  roomdescription: string;
  occupancy: number;
  roomrate: number;
  features: any [];
}
