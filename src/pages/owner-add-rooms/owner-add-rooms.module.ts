import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OwnerAddRoomsPage } from './owner-add-rooms';

@NgModule({
  declarations: [
    OwnerAddRoomsPage,
  ],
  imports: [
    IonicPageModule.forChild(OwnerAddRoomsPage),
  ],
})
export class OwnerAddRoomsPageModule {}
