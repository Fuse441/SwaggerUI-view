import { Routes } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { BrokerSwaggerComponent } from './pages/broker-swagger/broker-swagger.component';
import { MenuListComponent } from './pages/menu-list/menu-list.component';
import { UploadComponent } from './pages/upload/upload.component';

export const routes: Routes = [
    {
        path : 'swaggerUI' , component : BrokerSwaggerComponent,
    },
    { path: 'broker', component: MenuListComponent },
    { path: 'upload', component: UploadComponent },
    
    {
        path : '**' , component : PageNotFoundComponent,
    }
];
