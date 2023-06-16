export enum FlagName {
  SKIPPED_ONBOARDING = 'skipped_onboarding',
}

export interface FlagType {
  id: number;
  user_id: number;
  name: FlagName;
  created_at: Date;
  updated_at: Date;
}
