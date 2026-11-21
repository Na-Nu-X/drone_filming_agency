import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  AerialCategory,
  AerialProject,
  AerialProjectDetail,
  AerialService,
  DroneFleetItem,
  FlightQuotePayload,
  FlightQuoteResponse,
  PilotMember,
  ProjectQuery,
} from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl.replace(/\/$/, '');

  getCategories(): Observable<AerialCategory[]> {
    return this.http.get<AerialCategory[]>(`${this.baseUrl}/categories/`);
  }

  getProjects(query: ProjectQuery = {}): Observable<AerialProject[]> {
    let params = new HttpParams();
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }
    return this.http.get<AerialProject[]>(`${this.baseUrl}/portfolio/`, { params });
  }

  getProject(slug: string): Observable<AerialProjectDetail> {
    return this.http.get<AerialProjectDetail>(`${this.baseUrl}/portfolio/${encodeURIComponent(slug)}/`);
  }

  getServices(featured?: boolean): Observable<AerialService[]> {
    const params = featured === undefined ? undefined : new HttpParams().set('featured', String(featured));
    return this.http.get<AerialService[]>(`${this.baseUrl}/services/`, { params });
  }

  getFleet(): Observable<DroneFleetItem[]> {
    return this.http.get<DroneFleetItem[]>(`${this.baseUrl}/fleet/`);
  }

  getPilots(): Observable<PilotMember[]> {
    return this.http.get<PilotMember[]>(`${this.baseUrl}/pilots/`);
  }

  submitQuote(payload: FlightQuotePayload): Observable<FlightQuoteResponse> {
    return this.http.post<FlightQuoteResponse>(`${this.baseUrl}/quotes/`, payload);
  }
}
