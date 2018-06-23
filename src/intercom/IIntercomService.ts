import { IIntercomLead } from './IIntercomLead';

export interface IIntercomService {
    update(data: IIntercomLead): void;
}