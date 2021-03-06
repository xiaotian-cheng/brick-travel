import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { AMapComponent } from '../components/a-map/a-map.component';
import { InformationWindowComponent } from '../components/a-map/information-window/information-window.component';
import { RateComponent } from '../components/a-map/rate/rate.component';
import { ViewPointMarkerComponent } from '../components/a-map/viewpoint-marker/viewpoint-marker.component';
import { TravelAgendaComponent } from '../components/travel-agenda/travel-agenda.component';
import { ViewPointFilterComponent } from '../components/viewpoint-filter/viewpoint-filter.component';
import { ViewPointListComponent } from '../components/viewpoint-list/viewpoint-list.component';
import { ViewPointSearchComponent } from '../components/viewpoint-search/viewpoint-search.component';
import { DragulaDirective } from '../directives/dragula.directive';
import { StoreModule } from '../modules/store/store.module';
import { TestPage } from '../pages/test/test.page';
import { DragulaService } from '../providers/dragula.service';
import { App } from './app.component';
import { ViewPointsListPage } from '../pages/view-points-list/view-points-list.page';
import { CityPickPage } from '../pages/city-pick/city-pick.page';
import { ViewPointDetailComponent } from '../components/viewpoint-detail/viewpoint-detail';
import { HomePage } from '../pages/home/home.page';
import { ViewPointPage } from '../pages/view-point/view-point.page';
import { TravelAgendaPage } from '../pages/travel-agenda/travel-agenda.page';
import { ViewPointsSelectPage } from '../pages/view-points-select/view-points-select.page';

@NgModule({
  declarations: [
    App,
    AMapComponent,
    ViewPointMarkerComponent,
    InformationWindowComponent,
    TestPage,
    HomePage,
    ViewPointPage,
    RateComponent,
    ViewPointFilterComponent,
    ViewPointSearchComponent,
    ViewPointListComponent,
    ViewPointDetailComponent,
    TravelAgendaComponent,
    DragulaDirective,
    ViewPointsListPage,
    ViewPointsSelectPage,
    TravelAgendaPage,
    CityPickPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    StoreModule,
    IonicModule.forRoot(App)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    App,
    TestPage,
    HomePage,
    ViewPointPage,
    ViewPointsListPage,
    ViewPointsSelectPage,
    TravelAgendaPage,
    CityPickPage,
    ViewPointMarkerComponent,
    InformationWindowComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    DragulaService
  ]
})
export class AppModule {}
