import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable, from } from 'rxjs';
import { Event } from '../models/event.model';
import { EVENTS } from './constants';
import { Auth } from 'aws-amplify';
import { flatMap } from 'rxjs/operators';
import { EnvConfigurationService } from 'src/env.config.service';

@Injectable()
export class EventService {

  private apiURL: string;
  private apiKey: string;

  constructor(
    private readonly http: HttpClient,
    private readonly configService: EnvConfigurationService
    ) {

      configService.load().toPromise().then(config => {
        this.apiURL = config.apiURL;
        this.apiKey = config.apiKey;
      });

    }

  /**
   * Return the event list.
   */
  getEvents(): Observable<Event[]> {
    return from(this.getJwt())
    .pipe(
      flatMap(
       response => {
          const headers = this.getHeaders(response as string);
          return this.http.get<Event[]>(`${this.apiURL}${EVENTS}`, { headers });
        }
      )
    );
  }

  /**
   * Return the event with the ID passed as parameter
   *
   * @param id Event ID
   */
  getEvent(id: string): Observable<Event> {
    return from(this.getJwt())
    .pipe(
      flatMap(
       response => {
          const headers = this.getHeaders(response as string);
          return this.http.get<Event>(`${this.apiURL}${EVENTS}/${id}`, { headers });
        }
      )
    );
  }

  /**
   * Delete the event, if exists, with the ID passed as parameter
   *
   * @param id  Event ID
   */
  deleteEvent(id: string): Observable<any> {
    return from(this.getJwt())
    .pipe(
      flatMap(
       response => {
          const headers = this.getHeaders(response as string);
          return this.http.delete(`${this.apiURL}${EVENTS}/${id}`, { headers });
        }
      )
    );
  }

  /**
   * Save the event passed as parameter
   *
   * @param event Event to add
   */
  addEvent(event: Event): Observable<Event> {
    return from(this.getJwt())
    .pipe(
      flatMap(
       response => {
          const headers = this.getHeaders(response as string);
          return this.http
          .post<Event>(`${this.apiURL}${EVENTS}/`, event, { headers });
        }
      )
    );
  }

  /**
   * Update the event passed as parameter
   *
   * @param event Event to update
   */
  updateEvent(event: Event): Observable<Event> {
    return from(this.getJwt())
    .pipe(
      flatMap(
       response => {
          const headers = this.getHeaders(response as string);
          return this.http
          .put<Event>(`${this.apiURL}${EVENTS}/${event.id}`, event, { headers });
        }
      )
    );
 }

  /**
   * Return the event list that match with the filter string
   *
   * @param filter String used to filter
   */
  getFilteredEvents(filter): Observable<any> {
    return from(this.getJwt())
    .pipe(
      flatMap(
       response => {
          const headers = this.getHeaders(response as string);
          return this.http.get(`${this.apiURL}${EVENTS}/me`, { headers });
        }
      )
    );
  }


getHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      'x-api-key' : `${this.apiKey}`,
      Authorization: token
    });
}

async getJwt() {
    return await Auth.currentSession().then(data => data.getIdToken().getJwtToken()).catch(err => console.log(err));
  }

}
