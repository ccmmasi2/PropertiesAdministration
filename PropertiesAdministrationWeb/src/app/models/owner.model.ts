import { IdentificationType } from "./identificationType.model";

export class OwnerDTO {
    idOwner: number = 0;
    name: string = '';
    identificationType: IdentificationType = IdentificationType.CC;
    identification: string = '';
    address: string = '';
    photo: string = '';
    birthDay: Date;
} 
