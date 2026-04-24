import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private readonly http: HttpClient) {}

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  getByCategory(categoryId?: number): Observable<Product[]> {
    let params = new HttpParams();
    if (typeof categoryId === 'number') {
      params = params.set('categoryId', categoryId.toString());
    }
    return this.http.get<Product[]>(`${this.apiUrl}/products`, { params });
  }

  getById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }

  create(data: Omit<Product, 'id' | 'categoryName'>): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/products`, data);
  }

  update(id: number, data: Omit<Product, 'id' | 'categoryName'>): Observable<Product> {
    return this.http.put<Product>(`${this.apiUrl}/products/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/products/${id}`);
  }
}
