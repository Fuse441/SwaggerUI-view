import { Routes } from '@angular/router';
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
        path : '**' , component: UploadComponent,
    }
];
