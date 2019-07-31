import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OwnerAddHotelPage } from './owner-add-hotel';

@NgModule({
  declarations: [
    OwnerAddHotelPage,
  ],
  imports: [
    IonicPageModule.forChild(OwnerAddHotelPage),
  ],
})
export class OwnerAddHotelPageModule {}
