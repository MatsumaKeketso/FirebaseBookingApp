import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import * as firebase from 'firebase';
import { UserProvider } from "../../providers/user/user";


@IonicPage()
@Component({
  selector: 'page-viewbooking',
  templateUrl: 'viewbooking.html',
})
export class ViewbookingPage {
  db = firebase.firestore();
  userprofile = {};
  bookings = [];
  data= false;
  constructor(public navCtrl: NavController, public navParams: NavParams, private userProv: UserProvider, public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
  }

  ionViewDidLoad() {

    // console.log('Hotels in providerB: ', this.userProv.getHotels());
    this.userProv.getUser();
    this.db.collection('users').doc(this.userProv.getUser().uid).collection('bookings').get().then(snapshot => {
      console.log('Reservations: ', snapshot);
      if (!snapshot.empty) {
        this.data = true;
        snapshot.forEach( doc => {
          this.bookings.push(doc.data());
      })
      }
    }).catch(err => {
      console.log('An error occured');
      this.data= false;
    })

    let users = this.db.collection('users');
    // ...query the profile that contains the uid of the currently logged in user...
      let query = users.where("uid", "==", this.userProv.getUser().uid);
    query.get().then(querySnapshot => {
      // ...log the results of the document exists...
      if (querySnapshot.empty !== true){
        console.log('Got Data');

        querySnapshot.forEach(doc =>  {
          this.userprofile = doc.data();
          console.log('Profile from VBooking: ', this.userprofile);
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
  cancelRes(val){
    let load = this.loadingCtrl.create({
      content: 'Loading',
      spinner: 'bubbles'
    })
    load.present();
    let ref = this.db.collection('users').doc(this.userProv.getUser().uid).collection('bookings').doc(this.userProv.getUser().uid).delete();
    ref.then(res => {
      load.dismiss();
      this.toastCtrl.create({
        message:'Delete successful',
        duration: 3000
      }).present();
      this.ionViewDidLoad();
      this.navCtrl.getActive().component;
    }).catch(err => {
      load.dismiss();
      this.toastCtrl.create({
        message: 'Error deleting',
        duration: 3000
      }).present()
    })
    console.log('Cancelled Res: ', val);

  }
  back(){
    this.navCtrl.pop()
  }
}
