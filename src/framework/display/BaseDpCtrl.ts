import { m } from "../../ModuleMap";

export class BaseDpCtrl implements G.IDpCtrl {
    protected _dpcMgr: G.IDpCtrlMgr;
    protected _key: string;
    constructor(dpcMgr?: G.IDpCtrlMgr) {
        this._dpcMgr = dpcMgr;
    }
    needLoad?: boolean;
    isRetainRes?: boolean;
    onResRefChange(isAddRef: boolean, autoReleaseRes?: boolean, destroyRes?: boolean): void {}

    public isLoaded: boolean = false;
    public isLoading: boolean = false;
    protected _isAsyncInit: boolean = false;
    protected _isAsyncShow: boolean = false;

    public isInited: boolean = false;
    protected _isShowing: boolean = false;
    protected _isShowed: boolean = false;
    public needShow: boolean = false;

    public get isAsyncInit(): boolean {
        return this._isAsyncInit;
    }
    public get isAsyncShow() {
        return this._isAsyncShow;
    }
    public get isShowing(): boolean {
        return this._isShowing;
    }

    public get isShowed(): boolean {
        return this._isShowed;
    }
    public get key(): string {
        return this._key;
    }
    public set key(value: string) {
        this._key = value;
    }
    public onInit(initData?: any, endCb?: VoidFunction): void {
        endCb && endCb();
    }
    public onShow(showData?: any, endCb?: VoidFunction): void {
        this._isShowed = true;
        this._isShowing = false;
        endCb && endCb();
    }
    public onUpdate(updateData?: any, endCb?: VoidFunction): void {
        endCb && endCb();
    }
    public getFace<T>(): T {
        return this as any;
    }
    public onHide(endCb?: VoidFunction): void {
        this._isShowed = false;
        this.needShow = false;
        endCb && endCb();
    }
    public forceHide(): void {}
    public getNode<T = any>(): T {
        return null;
    }
    public onDestroy(destroyRes?: boolean, endCb?: VoidFunction): void {
        this._isShowed = false;
        this._isShowing = false;
        this.isInited = false;
        this.isLoaded = false;
        this.isLoading = false;
        endCb && endCb();
    }
    public getRess(): string[] {
        return null;
    }
    public onResize() {}
}
