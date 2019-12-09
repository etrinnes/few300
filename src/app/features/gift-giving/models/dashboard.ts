export interface DashboardModel {
  holidayId: string;
  holiday: string;
  recipients: {
    id: string;
    name: string;
  }[];
}
