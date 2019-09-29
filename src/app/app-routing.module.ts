import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'loading-page', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'youtube/:starName', loadChildren: './youtube/youtube.module#YoutubePageModule' },
  { path: 'sns/twitter/:starName', loadChildren: './twitter/twitter.module#TwitterPageModule' },
  { path: 'sns/facebook/:starName', loadChildren: './facebook/facebook.module#FacebookPageModule' },
  { path: 'vlive/:starName', loadChildren: './vlive/vlive.module#VlivePageModule' },
  { path: 'favorites/star', loadChildren: './favorites/star/star.module#StarPageModule' },
  { path: 'favorites/youtube', loadChildren: './favorites/youtube/youtube.module#YoutubePageModule' },
  { path: 'loading-page', loadChildren: './loading-page/loading-page.module#LoadingPagePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
