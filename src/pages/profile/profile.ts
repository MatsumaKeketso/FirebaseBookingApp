import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { UserProvider } from '../../providers/user/user';
import * as firebase from 'firebase';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  // show the profile is it got retrieved
  isProfile = false;
  db = firebase.firestore();
  storage = firebase.storage().ref();
  // store the user data from firebase
  loggedInUser;
  displayProfile;
  userProfile = {
    uid: null,
    image: null,
    name: null,
    surname: null,
    email: null,
    number: null
  } as UserProfile
  // store the selected image for upload
  profileImage;
  imageSelected = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera, private userProv: UserProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    console.log('Profile user: ', this.userProv.user.uid);
    this.userProfile.uid = this.userProv.user.uid
    this.userProfile.email = this.userProv.getUser().email;
    this.getProfile();
  }
  setUser(){
    this.loggedInUser = this.userProv.getUser();
  }
  async selectImage(){
    let option: CameraOptions = {
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

      this.profileImage = image;

    }, err => {
      console.log("Something went wrong: ", err);
    })
    this.imageSelected = true;
  }
  createUser(){
    // error statement if the fields are empty
    if(!this.userProfile.name || !this.userProfile.surname || !this.userProfile.number){
      this.toastCtrl.create({
        message: 'Do not leave fields empty. Email is optional',
        duration: 3000
      }).present();
    }else{
     if (!this.imageSelected){
      this.toastCtrl.create({
        message: 'Profile Image is required',
        duration: 3000
      }).present();
     }else {
        // load the profile creation process
    const load = this.loadingCtrl.create({
      content: 'Uploading Profile Image...'
    });
    load.present();
    const UserImage = this.storage.child(this.userProfile.name+this.userProv.getUser().uid+'.jpg');

    const upload = UserImage.putString(this.profileImage, 'data_url');
     upload.on('state_changed', snapshot => {
       let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       if (progress == 100){
        load.dismiss();
       }
     }, err => {
     }, () => {
      upload.snapshot.ref.getDownloadURL().then(downUrl => {
        this.userProfile.image = downUrl;

      // add a doc profile for the currently loggged in user
      let load2 = this.loadingCtrl.create({
        content: 'Adding Profile'
      })
      load2.present();
      // set the doc's id to the user's uid
      // set the doc's fields
        const user = this.db.collection('users').doc(this.userProv.getUser().uid).set(this.userProfile);
      // upon success...
      user.then( () => {
        this.toastCtrl.create({
          message: 'User Profile added.',
          duration: 2000
        }).present();
        // ...get the profile that just got created...
        load2.dismiss();
        this.getProfile()
        // catch any errors.
      }).catch( err=> {
        this.toastCtrl.create({
          message: 'Error creating Profile.',
          duration: 2000
        }).present();
        this.isProfile = false;
        load2.dismiss();
      })

      })
     })
     }
    }
  }
  getProfile(){
    // load the process
    let load = this.loadingCtrl.create({
      content: 'Fetching your Profile...'
    });
    load.present();
    // create a reference to the collection of users...
    let users = this.db.collection('users');
    // ...query the profile that contains the uid of the currently logged in user...
    let query = users.where("uid", "==", this.userProfile.uid);
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          console.log('Profile Document: ', doc.data())
          this.displayProfile = doc.data();
        })
        this.isProfile = true;
      } else {
        console.log('No data');
        this.isProfile = false;
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
  reset(){
    this.profileImage = '';
  }
  goBack(){
    this.navCtrl.pop();
  }

}
export interface UserProfile {
  uid: string;
  image?: string;
  name: string;
  surname: string;
  email:string;
  number: number;
}
