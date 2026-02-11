export interface HomePanel {
  type: 'announcement' | 'timer' | 'schedule-now' | 'schedule-next';
  value: any;
}

export interface Home {
  panels: HomePanel[];
}
