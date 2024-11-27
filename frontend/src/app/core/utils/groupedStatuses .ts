import { IGroupedStatuses, IStatus } from "../models/interfaces/IStatus";

export function groupStatuses(statuses: IStatus[]): IGroupedStatuses {
    return {
      admin: statuses.filter(status => status.assignableBy === 'admin'),
      system: statuses.filter(status => status.assignableBy === 'system')
    };
  }