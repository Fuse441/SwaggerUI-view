import { Component, OnInit, AfterViewInit, Renderer2, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { menuListService } from '../menu-list/menu-list.service';
import  yaml from 'js-yaml';
import { ActivatedRoute } from '@angular/router';
import JSZip from 'jszip';
@Component({
  selector: 'app-broker-swagger',
  templateUrl: "./broker-swagger.component.html",
  styleUrls: ['./broker-swagger.component.scss'],
})
export class BrokerSwaggerComponent implements OnInit, AfterViewInit {
  dataSwagger:any;
  findSwagger:any
  foundItem:any;
  itemName:string = "";
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
             this.itemName = this.foundItem.name
             this.foundItem = yaml.load(this.foundItem.content)
      
             
            if (this.foundItem) {
              
            } else {
              
            }
          }
        }
      });
    }
  
  
   
    
    
  }
  async downloadYAML() {
    

    const fileName = this.itemName.endsWith(".yaml") ? this.itemName : this.itemName + ".yaml";

  
    let fileContent;
    try {
        fileContent = typeof this.foundItem === "string" 
            ? this.foundItem 
            : yaml.dump(this.foundItem); 
    } catch (error) {
        console.error("YAML conversion error:", error);
        return;
    }

    
    const yamlBlob = new Blob([fileContent], { type: "text/yaml" });

  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(yamlBlob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();

   
    setTimeout(() => URL.revokeObjectURL(link.href), 100);

  
    document.body.removeChild(link);
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
