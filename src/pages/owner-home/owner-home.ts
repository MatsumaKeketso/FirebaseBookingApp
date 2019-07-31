import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, PopoverController, ToastController, AlertController } from 'ionic-angular';
import { OwnerAddHotelPage } from '../owner-add-hotel/owner-add-hotel';
import * as firebase from 'firebase';
import { OwnerViewHotelPage } from '../owner-view-hotel/owner-view-hotel';
import { LogoutPage } from '../logout/logout';
import { HomePage } from '../home/home';
import { UserProvider } from '../../providers/user/user';
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
  hotels = [ ];
  hotelsNo;
  user: any;
  userprofile = {};
  constructor(public navCtrl: NavController, public navParams: NavParams, public loadingCtrl: LoadingController, public popoverCtrl: PopoverController, public toastCtrl: ToastController, public alertCtrl: AlertController, public toast: ToastController, private userProv: UserProvider) {
  }
ionViewDidLoad() {
  // from this we can access this.navParams.data.uid or anything we need
  console.log('Home params received: ', this.navParams);
    this.user = this.navParams.data.email;
    // get the data for the page
    this.getData();
    let users = this.db.collection('users');
    // ...query the profile that contains the uid of the currently logged in user...
      let query = users.where("uid", "==", this.userProv.getUser().uid);
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got Data');

        querySnapshot.forEach(doc =>  {
          this.userprofile = doc.data();
          console.log('Profile from OHome: ', this.userprofile);
        })
      } else {
        this.userprofile = this.userProv.getUser().email;
      }
      // dismiss the loading
    }).catch(err => {
      // catch any errors that occur with the query.
      console.log("Query Results: ", err);
      // dismiss the loading
    })
  }
  addHotel(){
    // pushes to the addhotelpage with the paarmeter data
    this.navCtrl.push(OwnerAddHotelPage, this.navParams);
  }
  // getting a list of hotels
  async getData(){
    const load = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Getting Info...'
    });
    load.present();
    // get the documents(Hotels) inside the hotels collection
      this.db.collection('hotels').get().then(async querySnapshot => {
        querySnapshot.forEach(doc => {
          // '.data()' returns objects, push them into an array for display
          if (doc.data()) {
            this.hotels.push(doc.data());
            this.info = true;
          } else {
            let toast = this.toastCtrl.create({
              message: 'No hotels in database.',
              duration: 3000
            })
            toast.present();
          }
        });
// get the array length and assign its value
        this.hotelsNo = this.hotels.length;
        // dismiss the loadCtrl
        load.dismiss();
      }).catch(err => {
        let toast = this.toastCtrl.create({
          message: 'Error loading data. Please try again.',
          duration: 3000
        })
        toast.present();
        load.dismiss();
      });
  }
  // viewing room
  viewHotel(hotel){
    // receive the room data from the html and navigate to the next page with it
    this.navCtrl.push(OwnerViewHotelPage, {hotel});
  }
  // logout user
  async logout(){
      const popover = this.popoverCtrl.create(LogoutPage);
      popover.present();
  }
}
