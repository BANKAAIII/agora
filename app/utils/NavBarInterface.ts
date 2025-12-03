export interface navBarInterface{
    className?:string;
    onClick1?:()=>any;
    onClick2?:()=>any;
    open?:boolean;
    setOpen?:any; // this is not boolean, findout why and type it correctly.
}