import {create} from  "zustand";

// userProfile
interface userProfileInterface {
    name:string;
    image: File | null;
}

export const useProfileStore = create<userProfileInterface>( (get,set)=>({
    name:"ameya",
    image:null
}) );

// connected wallets
export type walletType =
| "coinbase"
| "phantom" 
| "walletConnect"
| "metamask"

export interface WalletAccount{
    address:string;
    chainId :number;
}

export interface walletAdapter{

    id:walletType;
    name:string;
    icon: File | null;
    connected:boolean;
    
    connect: ()=> Promise<WalletAccount> ; 
    disconnect: ()=>Promise<void> ;
    isConnected: ()=> boolean ;
}

export const mockAdapters:walletAdapter[] =[
    {
        // phantom wallet
        id:"phantom",
        name:"phantom",
        icon: null,
        connected:false,

        connect: async()=>{
            console.log("phantom wallet connectded");
            return {
                address:"phantom address",
                chainId:90009090
            }
        },

        disconnect: async()=>{},

        isConnected: ()=>true
    },
    {
        // metaMask wallet
        id:"metamask",
        name:"metaMask",
        icon: null,
        connected:false,

        connect: async()=>{
            console.log("metaMask wallet connectded");
            return {
                address:"metaMask address",
                chainId:90009090
            }
        },

        disconnect: async()=>{},

        isConnected: ()=>true
    },
    {
        // coinBase wallet
        id:"coinbase",
        name:"CoinBase",
        icon: null,
        connected:false,

        connect: async()=>{
            console.log("coinbase wallet connectded");
            return {
                address:"coinbase address",
                chainId:90009090
            }
        },

        disconnect: async()=>{},

        isConnected: ()=>true
    },
    {
        // walletConnect wallet
        id:"walletConnect",
        name:"walletConnect",
        icon: null,
        connected:false,

        connect: async()=>{
            console.log("walletConnect is connectded");
            return {
                address:"walletConnect address",
                chainId:90009090
            }
        },

        disconnect: async()=>{},

        isConnected: ()=>true
    }
]

// created Elections , 4 pinned, bookmarked   

interface electionCandidates{
    name:string;
    image: File | null
    description: string;

}

interface electionInterface{
    id:string;
    creator:userProfileInterface;
    name:string;
    description:string;
    status:string;
    pinned:boolean;
    participated:boolean;
    bookmarked:boolean;
    isdisplayed:boolean;

    fromDate: Date;
    toDate: Date;
    votingType:string;
    votingAccess:string;

    candidates: electionCandidates[]
}

export const elections: electionInterface[] = [
    {   
        id:"1",
        creator:{
            name:"ameya",
            image:null
        },

        name:"Vijay garden Elections",
        description:"for election comittee head",
        status:'ongoing',
        pinned:true,
        participated:false,
        bookmarked:false,
        isdisplayed:false,

        fromDate: new Date(2025, 7, 23),
        toDate: new Date(2025, 8, 12),
        votingType:"type 1",
        votingAccess:"private",

        candidates:[
            {
                name:"karl",
                description:"steat",
                image:null
            },
            {
                name:"siya",
                description:"pagel",
                image:null
            }
        ]

    },
    {
        id:"2",
        creator:{
            name:"mohammad",
            image:null
        },

        name:"kurla Elections",
        description:"for election kurla",
        status:'ongoing',
        pinned:true,
        participated:false,
        bookmarked:false,
        isdisplayed:false,

        fromDate: new Date(2025, 7, 23),
        toDate: new Date(2025, 8, 12),
        votingType:"type 2",
        votingAccess:"public",

        candidates:[
            {
                name:"simba",
                description:"steat",
                image:null
            },
            {
                name:"scar",
                description:"pagel",
                image:null
            }
        ]

    },
    {
        id:"3",
        creator:{
            name:"geeta",
            image:null
        },

        name:"add company",
        description:"for add company comittee head",
        status:'ongoing',
        pinned:true,
        participated:false,
        bookmarked:false,
        isdisplayed:false,

        fromDate: new Date(2025, 7, 23),
        toDate: new Date(2025, 8, 12),
        votingType:"type 1",
        votingAccess:"private",

        candidates:[
            {
                name:"snaika",
                description:"steat",
                image:null
            },
            {
                name:"mabmba",
                description:"pagel",
                image:null
            }
        ]

    },
    {
        id:"4",
        creator:{
            name:"kanika",
            image:null
        },

        name:"state Elections",
        description:"for election state comittee head",
        status:'ongoing',
        pinned:true,
        participated:false,
        bookmarked:false,
        isdisplayed:false,

        fromDate: new Date(2025, 7, 23),
        toDate: new Date(2025, 8, 12),
        votingType:"type 2",
        votingAccess:"public",

        candidates:[
            {
                name:"maois",
                description:"steat",
                image:null
            },
            {
                name:"viktor",
                description:"pagel",
                image:null
            }
        ]

    },
    {
        id:"5",
        creator:{
            name:"ameya",
            image:null
        },

        name:"comittee Elections",
        description:"for election comitteeX head",
        status:'ongoing',
        pinned:true,
        participated:false,
        bookmarked:false,
        isdisplayed:false,

        fromDate: new Date(2025, 7, 23),
        toDate: new Date(2025, 8, 12),
        votingType:"type 1",
        votingAccess:"private",

        candidates:[
            {
                name:"mem 1 ",
                description:"steat",
                image:null
            },
            {
                name:"mem 2",
                description:"pagel",
                image:null
            }
        ]

    },{
        id:"7",
        creator:{
            name:"ameya",
            image:null
        },

        name:"aossie Elections",
        description:"for aossie comittee head",
        status:'ongoing',
        pinned:true,
        participated:false,
        bookmarked:false,
        isdisplayed:false,

        fromDate: new Date(2025, 7, 23),
        toDate: new Date(2025, 8, 12),
        votingType:"type 1",
        votingAccess:"private",

        candidates:[
            {
                name:"c1",
                description:"steat",
                image:null
            },
            {
                name:"c2",
                description:"pagel",
                image:null
            }
        ]

    },
    {
        id:"8",
        creator:{
            name:"ameya",
            image:null
        },

        name:"Vijay garden Elections",
        description:"for election comittee head",
        status:'ongoing',
        pinned:true,
        participated:false,
        bookmarked:false,
        isdisplayed:false,

        fromDate: new Date(2025, 7, 23),
        toDate: new Date(2025, 8, 12),
        votingType:"type 1",
        votingAccess:"private",

        candidates:[
            {
                name:"karl",
                description:"steat",
                image:null
            },
            {
                name:"siya",
                description:"pagel",
                image:null
            }
        ]

    }
]

// display Election 
// random eleciton for searching 

