import { Component, OnInit } from '@angular/core';
import { menuListService } from './menu-list.service';
import { ActivatedRoute, Router } from '@angular/router';
import { configSwagger } from '../../assets/config/swaggerConfig';
import { CommonModule } from '@angular/common';
import { UploadService } from '../upload/upload.service';
@Component({
  selector: 'app-menu-list',
  imports: [CommonModule],
templateUrl: './menu-list.component.html',
  styleUrl: './menu-list.component.scss'
})
export class MenuListComponent implements OnInit {
  items: { name: string }[] = []; 

  constructor(private swaggerService: menuListService, private router: Router, private uploadService: UploadService) {
  
  }
  
  ngOnInit(): void {
    
    const temp = localStorage.getItem("SwaggerData");
    
    if (temp) {
      try {
        this.items = JSON.parse(temp); 
        // 
      } catch (error) {
        console.error("Error parsing SwaggerData:", error);
      }
    } else {
      console.warn("No SwaggerData found in localStorage.");
    }
  }

  async checkAPI(data:any) {
    try {
      this.router.navigate(['/swaggerUI'], { queryParams: { data: JSON.stringify(data) } });
    } catch (error) {
      console.error('API error:', error);
    }
  }
}
