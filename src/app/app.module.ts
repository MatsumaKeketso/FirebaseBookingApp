import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginOwnerPage } from '../pages/login-owner/login-owner';
import { OwnerAddHotelPage } from '../pages/owner-add-hotel/owner-add-hotel';
import { OwnerAddRoomsPage } from '../pages/owner-add-rooms/owner-add-rooms';
import { OwnerHomePage } from '../pages/owner-home/owner-home';
import { OwnerViewHotelPage } from '../pages/owner-view-hotel/owner-view-hotel';
import { RegisterOwnerPage } from '../pages/register-owner/register-owner';
import { AngularFireAuthModule } from "angularfire2/auth";
import { AngularFireModule } from "angularfire2";
import { FIREBASE_CONFIG } from './app.firebase.config';

import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";
import { Camera } from "@ionic-native/camera";
import { File } from "@ionic-native/file";
import { WebView } from "@ionic-native/ionic-webview/ngx";
import {  ImagePicker} from "@ionic-native/image-picker";
import { SpinnerDialog } from "@ionic-native/spinner-dialog";
import { FilePath } from '@ionic-native/file-path'
import { FileTransfer } from "@ionic-native/file-transfer";
import { LogoutPage } from '../pages/logout/logout';

import * as firebase from 'firebase';
import { UserProvider } from '../providers/user/user';
import { ProfilePage } from '../pages/profile/profile';
import { BookingPage } from '../pages/booking/booking';
import { ViewbookingPage } from '../pages/viewbooking/viewbooking';
import { PaymentPage } from '../pages/payment/payment';
import { ConfirmedPage } from '../pages/confirmed/confirmed';
import { OnboardingPage } from '../pages/onboarding/onboarding';

firebase.initializeApp(FIREBASE_CONFIG);
@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginOwnerPage,
    RegisterOwnerPage,
    OwnerAddHotelPage,
    OwnerAddRoomsPage,
    OwnerHomePage,
    OwnerViewHotelPage,
    LogoutPage,
    ProfilePage,
    BookingPage,
    ViewbookingPage,
    PaymentPage,
    ConfirmedPage,
    OnboardingPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireAuthModule,
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    IonicStorageModule.forRoot(),
    HttpClientModule,

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginOwnerPage,
    RegisterOwnerPage,
    OwnerAddHotelPage,
    OwnerAddRoomsPage,
    OwnerHomePage,
    OwnerViewHotelPage,
    LogoutPage,
    ProfilePage,
    BookingPage,
    ViewbookingPage,
    PaymentPage,
    ConfirmedPage,
    OnboardingPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Camera,
    File,
    WebView,
    ImagePicker,
    SpinnerDialog,
    FileTransfer,
    FilePath,
    UserProvider,
  ]
})
export class AppModule {}
