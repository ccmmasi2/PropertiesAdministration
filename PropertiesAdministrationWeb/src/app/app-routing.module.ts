import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './modules/home/home/home.component';

const routes: Routes = [ 
  {
    path: '',
    component: HomeComponent
  }, 
  {
    path: 'system',
    loadChildren: () =>
    import('@modules/catalog/catalog.module').then((m) => m.CatalogModule), 
  }, 
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
