import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SystemStatusDto } from '../dto/system-status.dto';
import { SystemStatusDataSource } from './system-status.datasource';

@Injectable()
export class HttpSystemStatusDataSource extends SystemStatusDataSource {
  constructor(private readonly http: HttpClient) {
    super();
  }

  get(): Promise<SystemStatusDto> {
    return firstValueFrom(
      this.http.get<SystemStatusDto>(`${environment.apiUrl}/system/status`)
    );
  }
}
