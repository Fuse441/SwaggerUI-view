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
          'Content-Type': 'multipart/form-data' 
        },
        responseType: 'blob' as 'json',
      });
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }
  }
  setDataSwagger(data:any){
    localStorage.setItem(this.dataSwagger,JSON.stringify(data))
  }
  getDataSwagger(){
    // console.log( localStorage.getItem(this.dataSwagger))
    return localStorage.getItem(this.dataSwagger)
  }
  
}
