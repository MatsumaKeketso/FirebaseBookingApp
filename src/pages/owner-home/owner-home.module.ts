import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OwnerHomePage } from './owner-home';

@NgModule({
  declarations: [
    OwnerHomePage,
  ],
  imports: [
    IonicPageModule.forChild(OwnerHomePage),
  ],
})
export class OwnerHomePageModule {}
