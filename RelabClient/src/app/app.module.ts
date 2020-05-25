import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AgmCoreModule} from '@agm/core'; // <---
import {HttpClientModule} from '@angular/common/http'; // <--
import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
     AgmCoreModule.forRoot({apiKey: 'AIzaSyDWM-7Nu6T5uaHDnxmeNIiHqDpJR35-vy8'}), // <---
    HttpClientModule // <---
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
