import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/delay';
import 'rxjs/add/operator/map';
import { Observable } from "rxjs/Observable";
import { normalize } from 'normalizr';
import { city } from '../entity.schema';
import { IEntities } from '../entity.model';
import { IPagination } from '../entity.action';

@Injectable()
export class CityService {
  //#region Private member
  //#endregion

  //#region Constructor
  constructor(public _http: HttpClient) {
  }
  //#endregion

  //#region Public properties
  
  //#endregion

  //#region Public methods
  public getCities(pagination : IPagination): Observable<IEntities> {
    return this._http.get('http://localhost:3000/cities')
    .map(records => {
      return normalize(records, [ city ]).entities;
    })
  }
  //#endregion

  //#region Private methods

  //#endregion
}