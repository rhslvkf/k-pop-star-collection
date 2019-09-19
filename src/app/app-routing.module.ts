import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomePageModule) },
  { path: 'list', loadChildren: () => import('./list/list.module').then(m => m.ListPageModule) },
  { path: 'youtube/:starName', loadChildren: './youtube/youtube.module#YoutubePageModule', runGuardsAndResolvers: 'always' },
  { path: 'sns/twitter/:starName', loadChildren: './twitter/twitter.module#TwitterPageModule' },
  { path: 'sns/facebook/:starName', loadChildren: './facebook/facebook.module#FacebookPageModule' },
  { path: 'vlive/:starName', loadChildren: './vlive/vlive.module#VlivePageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, onSameUrlNavigation: 'reload' })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
