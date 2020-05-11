import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

export enum Environment {
    Prod = 'prod',
    Local = 'local'
}

interface Configuration {
    apiURL: string;
    apiKey: string;
    cognitoRegion: string;
    userPoolId: string;
    userPoolWebClientId: string;
    stage: Environment;
}

@Injectable({ providedIn: 'root' })
export class EnvConfigurationService {
    private readonly configUrl = 'assets/config/config.json';
    private configuration$: Observable<Configuration>;

    constructor(private http: HttpClient) { }

    public load(): Observable<Configuration> {
        if (!this.configuration$) {
            this.configuration$ = this.http
                .get<Configuration>(`${this.configUrl}`)
                .pipe(shareReplay(1));
        }
        return this.configuration$;
    }
}
