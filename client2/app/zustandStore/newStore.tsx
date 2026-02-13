import  {create} from "zustand";

// Interfaces

// candidates
export interface candidateInterface{
    id:string;
    name:string;
    description:string;
    image?: File | null;
}

// election's basic information
export interface electionInterface{
    name:string;
    description:string;
    fromDate: Date | null;
    toDate: Date | null;
}

// voting process detaila
export interface votingDetailsInterface{
    votingAccess: "public" | "private";
    votingType: '1'|'2'|'3' ;
}

// atcual type for state management variable to store information
interface createElectionStore{
    
    // metaData : election's basic infromation (election Interface)
    metaData : electionInterface;

    //candidates array
    candidates:candidateInterface[];

    // voting process details for the election
    voting: votingDetailsInterface;

    // FUNCTION'S for editing values inside the store (type only)

        setMeta: ( data: Partial<electionInterface> ) => void;

        addCandidate: ( candidate : Pick<candidateInterface , "name" | "description" | "id" > ) => void;
        updateCandidate: ( id: string , data: Partial<candidateInterface> ) => void;
        deleteCandidate: ( id:string, data: Partial<candidateInterface> )=> void;

        setVoting: (data: Partial<votingDetailsInterface>) => void;
    }       

// creating atcual store

export const useCreateElectionStore1 = create<createElectionStore>( (set,get) => ({
    metaData:{
        name:"",
        description:"",
        fromDate: null,
        toDate: null
    },

    candidates: [],

    voting:{
        votingAccess:'public',
        votingType:"1"
    },

    setMeta: (metaData)=>{
        set( (state) => ({
            metaData:{ ...state.metaData, ...metaData }
        }) )
    },
    addCandidate: (candidateData)=>{
        set( (prevArray) => ({
            candidates: [ ...prevArray.candidates, candidateData]
        }) )
    },
    updateCandidate: (id,candidateData)=>{},
    deleteCandidate: (id,candidateData)=>{},
    
    setVoting: ()=>{}
}) )
