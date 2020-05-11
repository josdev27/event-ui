import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from '../models/user.model';
import * as login from '../store/login/login.actions';
import { USER, USERS } from './constants';
import { Auth } from 'aws-amplify';
import { from } from 'rxjs';
import { EnvConfigurationService } from 'src/env.config.service';

@Injectable()
export class UserService {
  constructor(
    private readonly http: HttpClient,
    private readonly store: Store<any>
  ) {}

  isAuthenticated: boolean;

  /**
   * Sign up the user
   *
   * @param user User to sign up
   */
  signup(user: User): Observable<any> {

    const userAws = {
      username: user.email,
      password: user.password
    };

    return from(Auth.signUp(userAws)
      .then(data => {
        return user;
      })
      .catch(err => {
        console.log(err);
        return err.message;
      })
      );
  }

  /**
   * Log in user in the system if the password is correct.
   *
   * If the password is incorrect return a string message
   *
   * @param user Use to log in
   */
  login(user: User): Observable<any>  {

   const userAws = {
      username: user.email,
      password: user.password
    };

   return from (Auth.signIn(userAws)
      .then(data => {
        localStorage.setItem(USER, JSON.stringify({email: user.email}));
        this.setUser();
        return user;
      })
      .catch(err => {
        console.log(err);
        return err.message;
      }));
  }

  /**
   * Log out the user in the system
   */
  logout() {
    Auth.signOut()
    .then(data => {
      localStorage.clear();
      return false;
    })
    .catch(err => {
      console.log(err);
      return true;
    });
  }

  /**
   * Return true if user is authenticated, false in other case.
   */
  checkUser(): boolean {
    this.setUser();
    return this.isAuthenticated;
  }

  /**
   * Determine if user is authenticated and then set result in isAuthenticated properti
   */
  private setUser() {
    this.isAuthenticated = true;
    this.isAuthenticated = Boolean(localStorage.getItem(USER));
    this.isAuthenticated ? this.store.dispatch(new login.Logged(true)) : this.store.dispatch(new login.Logged(false));
  }

}
