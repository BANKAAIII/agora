export interface electionPageInterface{
    id?:string;
    title:string;
    description:string;
    status : 'upcoming' | 'ongoing' | 'completed';
    participated : boolean;
    candidates: Array<{name:string; manifesto:string;}>;
}