import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NodeRepositoryModule } from './node-repository/node-repository.module';
import { NodeDetailsModule } from './node-details/node-details.module';
import { NgxElectronModule } from 'ngx-electron';
import { HeaderComponent } from './header/header.component';
import { MatIconModule } from '@angular/material/icon';
import { LogsComponent } from './logs/logs.component';
import { SystemHeaderComponent } from './system-header/system-header.component';
import { MarblesModule } from './marbles/marbles.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LogsComponent,
    SystemHeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    NodeRepositoryModule,
    NodeDetailsModule,
    NgxElectronModule,
    MatIconModule,
    MarblesModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
