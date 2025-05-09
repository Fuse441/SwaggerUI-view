import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { UploadService } from './upload.service';
import JSZip  from 'jszip'
import {  Router } from '@angular/router';
import axios, { isAxiosError } from 'axios';
@Component({
  selector: 'app-upload',
  imports: [CommonModule],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.scss'
})
export class UploadComponent implements OnInit {
  selectedFile: File | null = null;
  uploadMessage: string = '';
  hasUpload:string = ""
  items: { name: string }[] = []; 
  messageUpload:string = "";
  isBrowser: boolean = false;
  @ViewChild('input-file') inputFile?: ElementRef;
  uploadedFileName: string | null = null;

  constructor(private uploadService:UploadService,private router: Router,@Inject(PLATFORM_ID) private platformId: Object){}

  ngOnInit(): void {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      try {
        const getDataSwagger = localStorage.getItem("SwaggerData");
        if (getDataSwagger) {
          this.hasUpload = "Has Data in Local";
          this.items = JSON.parse(getDataSwagger);
        } else {
          console.warn("No SwaggerData found in localStorage.");
        }
      } catch (error) {
        console.error("Error parsing SwaggerData:", error);
      }
    }
  }
  

  
  
  
  clearFile() {
    this.selectedFile = null;
    this.uploadedFileName = null;
    const input = document.getElementById('input-file') as HTMLInputElement;
    if (input) {
      input.value = ''; 
    }
  }
  
  
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
  
  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      const file = event.dataTransfer.files[0];
      this.selectedFile = file;
      this.uploadedFileName = file.name;
    }
  }
  
  async checkAPI(data:any) {
    try {
      this.router.navigate(['/swaggerUI'], { queryParams: { data: JSON.stringify(data) } });
    } catch (error) {
      console.error('API error:', error);
    }
  }

  onFileSelected(event: Event) {
  console.log("event ==> ", this.selectedFile,
    this.uploadedFileName);
  
    
    const input = event.target as HTMLInputElement;
    console.log("input.files ==> ", input.files);

    if (input.files && input.files.length) {
      this.selectedFile = input.files[0];
      this.uploadedFileName = input.files[0].name;
    }
  }

  async onUpload() {
    
    if (!this.selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    let snackbar = document.getElementById("snackbar")
    try {
      
      const response = await this.uploadService.uploadFile(this.selectedFile);
      
      // ตรวจสอบประเภทของ response
      // 
      if (response instanceof Blob) {
        // 
        // const arrayBuffer = await response.arrayBuffer(); 
        // 
      } else {
        console.error('Response is not a Blob or ArrayBuffer');
      }
      
     const files = await this.extractZipFromResponse(response);
      // 
      this.uploadService.setDataSwagger(files)

      let getDataSwagger =  this.uploadService.getDataSwagger()
     
      if (getDataSwagger) {
        try {
          this.items = JSON.parse(getDataSwagger); 
       
        this.messageUpload = "อัพโหลดไฟล์เรียบร้อย"
        snackbar!.className = "show"
          
          setTimeout(function() {
            setTimeout(function(){ snackbar!.className = snackbar!.className.replace("show", ""); }, 3000);
          })
        } catch (error) {
          console.error("Error parsing SwaggerData:", error);
        }
      } else {
        console.warn("No SwaggerData found in localStorage.");
      }
    
    } catch (error:any) {
    
     
    this.messageUpload = `${error?.message}\n\n${error?.detail}`; 
         
        snackbar!.className = "show";
         
  
        setTimeout(function() {
          setTimeout(function(){ snackbar!.className = snackbar!.className.replace("show", ""); }, 3000);
        })
        console.error('Upload failed:', error);
      
      
    }
  }
  
  
  
  
  async extractZipFromResponse(response: ArrayBuffer) {
    // 
  
    try {
      const zip = await JSZip.loadAsync(response);
      // 
  
      const files: { name: string; content: string }[] = [];
  
      for (const fileName of Object.keys(zip.files)) {
        const file = zip.files[fileName];
        if (!file.dir) {
          const content = await file.async("string");  
          files.push({ name: fileName, content });
        }
      }
      
      return files;
    } catch (error) {
      console.error("Error extracting ZIP:", error);
      throw error;
    }
  }
  async  downloadZIP() {
    const zip = new JSZip();
    
    const getDataSwagger:any =  JSON.parse(this.uploadService.getDataSwagger()!)
    
    getDataSwagger && getDataSwagger!.forEach((element:any) => {
       zip.file(`${element.name}`,`${element.content}`)
    });
   
    
    
    
  
    // const imgData = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...";
    // zip.file("image.png", imgData.split(',')[1], { base64: true });
  
 
    const zipBlob = await zip.generateAsync({ type: "blob" });
  
   
    const link = document.createElement("a");
    link.href = URL.createObjectURL(zipBlob);
    link.download = "Swagger.zip";
    document.body.appendChild(link);
    link.click();
    
   
    document.body.removeChild(link);
  }
  
}
