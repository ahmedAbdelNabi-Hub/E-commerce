export interface IStatus {
    id: number;
    statusName: string;
    statusDescription: string;
    assignableBy:string;
}

export interface IGroupedStatuses{
    admin: IStatus[];
    system: IStatus[];
}