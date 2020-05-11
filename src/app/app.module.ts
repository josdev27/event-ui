import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';

// Modules
import { CoreModule } from './core/core.module';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { EventsModule } from './events/events.module';

// State Management
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.store';
import { EffectsModule } from '@ngrx/effects';
import { LayoutEffects } from './store/layout/layout.effects';

// Components
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AppComponent } from './app.component';
import { HomePageComponent } from './home-page/home-page.component';
import { ToolbarComponent } from './toolbar/toolbar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalErrorHandlerService } from './core/global-error-handler.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerErrorsInterceptor } from './core/server-error.interceptor';

import { AmplifyAngularModule, AmplifyService, AmplifyModules } from 'aws-amplify-angular';
import Auth from '@aws-amplify/auth';
import { EnvConfigurationService } from 'src/env.config.service';
import Amplify from '@aws-amplify/core';

@NgModule({
  declarations: [
    AppComponent,
    HomePageComponent,
    ToolbarComponent,
    PageNotFoundComponent,
  ],
  imports: [
    CoreModule,
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    EventsModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([LayoutEffects]),
    AmplifyAngularModule
  ],
  providers: [
    {
      provide: ErrorHandler,
      useClass: GlobalErrorHandlerService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ServerErrorsInterceptor,
      multi: true,
    },
    {
      provide: AmplifyService,
      useFactory:  () => {
        return AmplifyModules({
          Auth
        });
      }
    },
    {
      provide: APP_INITIALIZER,
      useFactory: (envConfigService: EnvConfigurationService) => () => {
        envConfigService.load().toPromise().then( config =>
        Amplify.configure({
          Auth: {
              // REQUIRED - Amazon Cognito Region
              region: config.cognitoRegion,
              // OPTIONAL - Amazon Cognito User Pool ID
              userPoolId: config.userPoolId,
              // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
              userPoolWebClientId: config.userPoolWebClientId,
          },
        }));
      },
      deps: [EnvConfigurationService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
/**
 * General Module for the app
 */
export class AppModule {}

