import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/env';
@Injectable({
  providedIn: 'root'
})
export class UploadService {
  private apiUrl = environment.apiUrl;
  private dataSwagger = "SwaggerData"
  constructor() { }

  async uploadFile(file: File) { 
    const formData = new FormData();
    formData.append('file', file);
    
     
  
    try {
      const response = await axios.post(`${this.apiUrl}/excel`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        responseType: 'blob', // ✅ ใช้ 'blob' สำหรับไฟล์
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data instanceof Blob) {
          try {
         
            const errorText = await error.response.data.text();
            const errorJson = JSON.parse(errorText);

            throw errorJson;
          } catch (parseError) {
            console.error('Error parsing response:', parseError);
            throw parseError
          }
        }
        // console.error('API error:', error.response?.statusText);
        throw error.response?.data;
      } else {
        console.error('Unexpected error:', error);
        throw error;
      }
    }
    
  }
  setDataSwagger(data:any){
    localStorage.setItem(this.dataSwagger,JSON.stringify(data))
  }
  getDataSwagger(){
    // 
    return localStorage.getItem(this.dataSwagger)
  }
  
}
