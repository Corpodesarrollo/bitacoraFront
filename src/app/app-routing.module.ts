import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrowserUtils } from '@azure/msal-browser';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule),
    canActivate: [AuthGuard]
  },
  {
    path:'',
    redirectTo:'login',
    pathMatch: 'full'
  },
  {
    path:'**',
    redirectTo:'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{
    useHash: true,
    scrollPositionRestoration: 'enabled',
    initialNavigation: !BrowserUtils.isInIframe() && !BrowserUtils.isInPopup() ? 'enabledNonBlocking' : 'disabled' // Set to enabledBlocking to use Angular Universal
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

