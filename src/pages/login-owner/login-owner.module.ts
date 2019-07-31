import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LoginOwnerPage } from './login-owner';

@NgModule({
  declarations: [
    LoginOwnerPage,
  ],
  imports: [
    IonicPageModule.forChild(LoginOwnerPage),
  ],
})
export class LoginOwnerPageModule {}
