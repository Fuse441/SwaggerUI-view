import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { UploadService } from './upload.service';
import JSZip  from 'jszip'
import {  Router } from '@angular/router';
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

  constructor(private uploadService:UploadService,private router: Router){}

  ngOnInit(): void {
    let getDataSwagger =  this.uploadService.getDataSwagger()
      if (getDataSwagger) {
        try {
          this.hasUpload = "Has Data in Local"
          this.items = JSON.parse(getDataSwagger); 
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
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  async onUpload() {
    if (!this.selectedFile) return;
  
    const formData = new FormData();
    formData.append('file', this.selectedFile);
  
    try {
      const response = await this.uploadService.uploadFile(this.selectedFile);
      
      // ตรวจสอบประเภทของ response
      // console.log(response);
      if (response instanceof Blob) {
        // console.log('Blob size:', response.size); 
        // const arrayBuffer = await response.arrayBuffer(); 
        // console.log('ArrayBuffer byteLength:', arrayBuffer.byteLength); 
      } else {
        console.error('Response is not a Blob or ArrayBuffer');
      }
      
     const files = await this.extractZipFromResponse(response);
      // console.log("Files extracted:", files);
      this.uploadService.setDataSwagger(files)

      let getDataSwagger =  this.uploadService.getDataSwagger()
    
      if (getDataSwagger) {
        try {
          this.items = JSON.parse(getDataSwagger); 
          // console.log("log itme",this.items); 
        } catch (error) {
          console.error("Error parsing SwaggerData:", error);
        }
      } else {
        console.warn("No SwaggerData found in localStorage.");
      }
    
    } catch (error) {
      console.error('Upload failed:', error);
    }
  }
  
  
  
  
  async extractZipFromResponse(response: ArrayBuffer) {
    // console.log("Response type:", typeof response);  
  
    try {
      const zip = await JSZip.loadAsync(response);
      // console.log("Extracted zip content:", zip);
  
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
    console.log(getDataSwagger)
    getDataSwagger && getDataSwagger!.forEach((element:any) => {
       zip.file(`${element.name}`,`${element.content}`)
    });
   
    
    
    console.log(zip.files)
  
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
