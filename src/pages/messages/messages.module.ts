import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MessagesPage } from './messages';

@NgModule({
  declarations: [
    MessagesPage,
  ],
  exports: [
    MessagesPage
  ]
})
export class MessagesPageModule {}
