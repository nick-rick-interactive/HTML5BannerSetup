declare let clickTag:string;
declare let banner:any;
declare interface BannerI {

    width:number;
    height:number;
    type:string;

    loop:number;

    P:Publisher;
    L:JSLang;

}
declare interface CJSImg {

    el:any,
    src:string

}
declare interface JSLangI {

    B:Banner;

    els:Object;

}
declare interface PublisherI {

    B:Banner;

    type:string;

    loop:number;
    curLoop:number;

    switchInt:number;
    autoTimer:number;

    isExpanded:boolean;
    isCollapsed:boolean;

}