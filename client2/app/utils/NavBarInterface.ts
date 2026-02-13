export interface navBarInterface{
    className?:string;
    open?:boolean;
    setOpen?:any; // this is not boolean, findout why and type it correctly.
    navMenuOpen?:boolean; // for navBar2
    setNavMenuOpen?:any; // for navbar 2

    searchOpen?:boolean;
    setSearchOpen?:any;

    button1ClassName?:string;
    button2ClassName?:string;
    button3ClassName?:string;

    button1Img?:string;
    button2Img:string;
    button3Img?:string;

    button1Function?:()=>void;
    button2Function?:()=>void;
    button3Function?:()=>void;

    setButton1State?:any;
    setButton2State?:any;
    setButton3State?:any;

    button1State?:boolean;    
    button2State?:boolean;
    button3State?:boolean;

}