import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from "@ionic-native/camera";
import { UserProvider } from '../../providers/user/user';
import * as firebase from 'firebase';
import { OwnerHomePage } from '../owner-home/owner-home';
import { LoginOwnerPage } from '../login-owner/login-owner';
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  someProperty = false;
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
    phone: null,
    bio: null
  }
  // store the selected image for upload
  profileImage;
  imageSelected = false;
  isuploaded = false;
  isuploading = false;
  uploadprogress = 0;
  bookings= [];
  nobookings = 0;
  arebookings = false;

  review = {
    fullname: '',
    text: '',
    date: '',
    uid: ''
  };
  reviews = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public camera: Camera, private userProv: UserProvider, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
    console.log('Room: ', this.navParams.data);
    this.userProfile.uid = this.userProv.getUser().uid;
    firebase.auth().onAuthStateChanged(user => {
      if (user){
        this.userProfile.email = user.email;
        this.db.collection('users').where('uid', '==', this.userProv.getUser().uid).get().then(snapshot => {
          if (snapshot.empty){

          } else {
            this.getProfile();
            let load = this.loadingCtrl.create({
              content: 'Just a sec...',
              spinner: 'bubbles'
            });
            load.present();
            this.db.collection('bookings').where('uid', '==', this.userProv.getUser().uid).get().then(snapshot => {
              snapshot.forEach(doc => {
                this.bookings.push(doc.data())
              })
              console.log('Bookings: ', this.bookings);
              this.nobookings = this.bookings.length;
              load.dismiss()
            }).catch(err => {
              load.dismiss();
            })
          }
          })
        }
      })
    // console.log('Profile user: ', this.userProv.user.uid);
    // this.userProfile.uid = this.userProv.user.uid
    // this.userProfile.email = this.userProv.getUser().email;
    // this.getProfile();
    // this.getBookings();
    this.getReviews();
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
      const UserImage = this.storage.child(this.userProv.getUser().uid+'.jpg');

    const upload = UserImage.putString(image, 'data_url');
     upload.on('state_changed', snapshot => {
       let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
       this.uploadprogress = progress;
       if (progress == 100){
        this.isuploading = false;
       }
     }, err => {
     }, () => {
      upload.snapshot.ref.getDownloadURL().then(downUrl => {
        this.userProfile.image = downUrl;
        console.log('Image downUrl', downUrl);

        this.isuploaded = true;
      })
     })
    }, err => {
      console.log("Something went wrong: ", err);
    })
    this.imageSelected = true;
  }
  signout() {
    firebase.auth().signOut().then(res => {
      this.toastCtrl.create({
        message: 'Logout Successful.',
        duration: 3000
      }).present();
      this.navCtrl.setRoot(LoginOwnerPage);
    }).catch( err => {
      this.toastCtrl.create({
        message: err,
        duration: 3000
      }).present();
      //
    })
  }
  createUser(){
    // error statement if the fields are empty
    if(!this.userProfile.name || !this.userProfile.surname || !this.userProfile.phone){
      this.toastCtrl.create({
        message: 'Not Yet! Do not leave any field empty.',
        duration: 3000
      }).present();
    }else{
     if (!this.imageSelected){
      this.toastCtrl.create({
        message: 'Not Yet!. Profile Image is required',
        duration: 3000
      }).present();
     }else {
       if (this.userProfile.phone.length < 10 || this.userProfile.phone.length > 10) {
        this.toastCtrl.create({
          message: 'Not Yet!. Phone number must be 10 digits',
          duration: 3000
        }).present();
       } else {
         // load the profile creation process
         const load = this.loadingCtrl.create({
          content: 'Creating Profile..'
        });
        load.present();
        const user = this.db.collection('users').doc(this.userProv.getUser().uid).set(this.userProfile);
        // upon success...
        user.then( () => {
          this.toastCtrl.create({
            message: 'User Profile added.',
            duration: 2000
          }).present();
          // ...get the profile that just got created...
          load.dismiss();
          this.getProfile()
          // catch any errors.
        }).catch( err=> {
          this.toastCtrl.create({
            message: 'Error creating Profile.',
            duration: 2000
          }).present();
          this.isProfile = false;
          load.dismiss();
        })
       }

     }
    }
          // add a doc profile for the currently loggged in user
      // let load2 = this.loadingCtrl.create({
      //   content: 'Adding Profile'
      // })
      // load2.present();
      // set the doc's id to the user's uid
      // set the doc's fields

  }
  getProfile(){
    // load the process
    let load = this.loadingCtrl.create({
      content: 'Just a sec...',
      spinner: 'bubbles'
    });
    load.present();
    // create a reference to the collection of users...
    let users = this.db.collection('users');
    // ...query the profile that contains the uid of the currently logged in user...
    let query = users.where("uid", "==", this.userProv.getUser().uid);
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {
          console.log('Profile Document: ', doc.data())
          this.displayProfile = doc.data();
          this.userProfile.bio  = doc.data().bio;
          this.userProfile.email = doc.data().email
          // this.profileImage.image  = doc.data().image
          this.userProfile.name  = doc.data().name;
          this.userProfile.phone  = doc.data().phone
          this.userProfile.surname = doc.data().surname
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
  editProfile(){
    this.isProfile = false;
  }
  getBookings(){
    this.db.collection('bookings').where('uid', '==', this.userProv.getUser().uid).get().then(snapshot => {
      if(snapshot.empty !== true){
        snapshot.forEach(doc => {
          this.bookings.push(doc.data());
        })
        this.nobookings = this.bookings.length;
        this.arebookings = true;
      }
    })
  }
  presentConfirm(booking) {
    let alert = this.alertCtrl.create({
      title: 'Confirm cancel',
      message: 'Do you want to cancel this reservation?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.db.collection('bookings').doc(booking.roomname+this.userProv.getUser().uid).delete().then(res => {
              this.bookings = [];
              this.nobookings = 0;
              this.getBookings();
              this.toastCtrl.create({
                message: 'Booking Cancelled',
                duration: 3000
              }).present();
            })
          }
        }
      ]
    });
    alert.present();
  }
  reset(){
    this.profileImage = '';
  }
  Back(){
    this.navCtrl.setRoot(OwnerHomePage)
  }
  goBack(){
    this.isProfile = true;
  }
  onClick(){
    this.someProperty = !this.someProperty;
  }
  createReview(){
    const nowDate = new Date();
    this.review.fullname = this.displayProfile.name+' '+this.displayProfile.surname;
    this.review.date = nowDate.toDateString();
    this.review.uid = this.userProv.getUser().uid;
    if (this.review.text==''){
      this.toastCtrl.create({
        message: 'Cannot send empty review',
        duration: 2000
      }).present()
    } else {
    this.db.collection('reviews').doc(this.userProv.getUser().uid+nowDate.toDateString()).set(this.review).then(res => {
      this.reviews = [];
      this.getReviews();
      this.toastCtrl.create({
        message: 'Thank you.',
        duration: 2000
      }).present();
    }).catch(err => {
      this.toastCtrl.create({
        message: 'Sorry the review could not be sent.',
        duration: 3000
      }).present()
    })
    }
  }
  getReviews(){
    this.reviews = [];
     this.db.collection('reviews').get().then(snapshot => {
      if (snapshot.empty !== true){
        console.log('Got Reviews')
        snapshot.forEach(doc => {
          this.reviews.push(doc.data());
        });
      } else {
        console.log('No Reviews')
      }
    })
  }

}
export interface UserProfile {
  uid: string;
  image?: string;
  name: string;
  surname: string;
  email:string;
  phone: any;
  bio: string
}
