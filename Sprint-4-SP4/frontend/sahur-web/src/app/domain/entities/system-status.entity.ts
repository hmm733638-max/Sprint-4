export interface SystemStatus {
  readonly application: string;
  readonly persistence: string;
  readonly databaseAvailable: boolean;
}
