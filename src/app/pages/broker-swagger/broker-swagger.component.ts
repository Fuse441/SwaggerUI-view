import { Component, OnInit, AfterViewInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { menuListService } from '../menu-list/menu-list.service';
import  yaml from 'js-yaml';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-broker-swagger',
  templateUrl: "./broker-swagger.component.html",
  styleUrls: ['./broker-swagger.component.scss'],
})
export class BrokerSwaggerComponent implements OnInit, AfterViewInit {
  dataSwagger:any;
  findSwagger:any
  foundItem:any
  constructor(
    private renderer: Renderer2, 
    @Inject(PLATFORM_ID) private platformId: object,
    private swaggerService: menuListService,
    private route: ActivatedRoute
  ) {
   
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.route.queryParams.subscribe(params => {
        const data = params['data'];
        if (data) {
        
          this.findSwagger = localStorage.getItem("SwaggerData");
          if (this.findSwagger) {
            this.findSwagger = JSON.parse(this.findSwagger);
            
             this.foundItem = this.findSwagger.find((item: any) => item.name ===  data.replace(/['"]+/g, ''));
             this.foundItem = yaml.load(this.foundItem.content)
             console.log(this.foundItem)
            if (this.foundItem) {
              console.log('Found item:', this.foundItem);
            } else {
              console.log('Item with name not found');
            }
          }
        }
      });
    }
  
  
   
    
    
  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.initializeSwagger()
      
    }
  }
  

  initializeSwagger(): void {
    if (typeof window !== 'undefined' && (window as any).SwaggerUIBundle) {
      (window as any).ui = (window as any).SwaggerUIBundle({
        spec: this.foundItem,
        dom_id: '#swagger-ui',
      });
    }
  }
}
