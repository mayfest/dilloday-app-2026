export interface Stage {
  name: string;
  artists: string[];
  position?: number;
  icon?: string;
  primary?: string;
  secondary?: string;
  textPrimary?: string;
  textSecondary?: string;
}

export interface Schedule {
  [stage: string]: Stage;
}
