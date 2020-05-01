export interface Hidable {
    readonly shown:boolean;
}

export function isHidable(arg:any): arg is Hidable {
    return arg && arg.shown && typeof(arg.shown) == 'boolean';
}