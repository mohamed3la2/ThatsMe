import { Photo } from './Photo';

export interface User {
    id: string;
    username: string;
    knownAs: string ;
    age: number ;
    gender: string;
    createdIn: Date;
    lastActive: Date;
    photoUrl: string;
    city: string;
    country: string;
    interests?: string;
    lookingFor?: string;
    introduction?: string;
    photos?: Photo[] ;

}
