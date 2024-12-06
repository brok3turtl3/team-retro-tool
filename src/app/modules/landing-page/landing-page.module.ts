import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LandingPageRoutingModule } from './landing-page-routing.module';
import { LandingPageComponent } from './landing-page.component';
import { LoginComponent } from './components/login/login.component';

@NgModule({
  declarations: [LandingPageComponent, LoginComponent],
  imports: [CommonModule, FormsModule, LandingPageRoutingModule],
})
export class LandingPageModule {}
