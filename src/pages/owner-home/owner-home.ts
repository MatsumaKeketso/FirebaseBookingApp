import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController, ToastController, AlertController } from 'ionic-angular';
import { OwnerAddHotelPage } from '../owner-add-hotel/owner-add-hotel';
import * as firebase from 'firebase';
import { OwnerViewHotelPage } from '../owner-view-hotel/owner-view-hotel';
import { LogoutPage } from '../logout/logout';
import { HomePage } from '../home/home';
import { UserProvider } from '../../providers/user/user';
import { RegisterOwnerPage } from '../register-owner/register-owner';
import { ProfilePage } from '../profile/profile';
import { AboutHotelPage } from '../about-hotel/about-hotel';
@IonicPage()
@Component({
  selector: 'page-owner-home',
  templateUrl: 'owner-home.html',
})
export class OwnerHomePage {
  // using the firestore
  db = firebase.firestore();
  // changes if the content is empty
  info = false;
  stars = [1,2,3,4];
  // to display the hotels
  hotel = {};
  landmark = [];
  naturals = [];
  room = [];
  user: any;
  userprofile = {};

  review = {
    image: '',
    name: '',
    date: '',
    text: ''
  };
  reviews = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController, public alertCtrl: AlertController, public toast: ToastController, private userProv: UserProvider) {
  }
ionViewDidLoad() {
  const loading = this.loadingCtrl.create({
    content: 'Loading'
  });
  loading.present();
  //get the user profile
  let users = this.db.collection('users');

    /* let query = users.where("uid", "==", this.userProv.getUser().uid)
    // ...query the profile that contains the uid of the currently logged in user...
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got data', querySnapshot);
        querySnapshot.forEach(doc => {

          this.userprofile = doc.data();
          this.review.name = doc.data().name;
          this.review.image = doc.data().image;
          console.log('Profile Document: ', this.userprofile)
        })
      } else {
        console.log('No data');
      }
      // dismiss the loading
    }).catch(err => {
      // catch any errors that occur with the query.
      console.log("Query Results: ", err);
    }) */
    // get the hotel data
    this.db.collection('hotel').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.hotel = doc.data();
      });
    });
    // get the rooms
    this.db.collection('rooms').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.room.push(doc.data());
      });
      console.log('Rooms: ', this.room);

    });
    // get the hotel landmarks
    this.db.collection('hotel').doc('Azure Grotto Hotel').collection('landmarks').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.landmark.push(doc.data());
      });
    });
    // get the hotel's natural attractions
    this.db.collection('hotel').doc('Azure Grotto Hotel').collection('naturals').get().then(snapshot => {
      snapshot.forEach(doc => {
        this.naturals.push(doc.data());
      });
      loading.dismiss();
    });

  }
  // viewing room
  viewRoom(room){
    // receive the room data from the html and navigate to the next page with it
    this.navCtrl.push(OwnerViewHotelPage, {room});
  }
  // create a review

  // logout user
  profile(){
    this.navCtrl.push(ProfilePage);
  }
  toAbout(){
    this.navCtrl.push(AboutHotelPage);
  }
}
