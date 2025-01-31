import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from '../../../environments/env';
import { isPlatformBrowser } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class menuListService {
  private apiUrl = environment.apiUrl;
  private dataSubject:any
  constructor() {}
  private storageKey = 'swaggerFileName';

  async getData(fileName:string) { 
    try {
      const response = await axios.get(`${this.apiUrl}/broker-swagger?fileName=${fileName}`);
      return response.data;
    } catch (error) {
      console.error('API error:', error);
      throw error;
    }

  }


  setFileName(name: string) {
  
      localStorage.setItem(this.storageKey, name);
    
  }

  getFileName() {
try {
  return localStorage.getItem(this.storageKey);
  
} catch (error) {
  return console.error(error)
  
}
  }
}
