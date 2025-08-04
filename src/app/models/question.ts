import { Solution } from "./solution";

export interface Question{
    id:string;
    username:string;
    question:string;
    solutions?:Solution[];
}