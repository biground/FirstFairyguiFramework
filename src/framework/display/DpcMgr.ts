import { isNull } from "../tools/TypeUtil";

/**
 * DisplayControllerMgr
 * 显示控制类管理器基类
 */
export class DpcMgr implements G.IDpCtrlMgr {
    /**
     * 单例缓存字典 key:ctrlKey,value:G.IDpCtrl
     */
    protected _sigCtrlCache: G.CtrlInsMap = {};
    protected _sigCtrlShowCfgMap: { [key: string]: G.IDpCtrlShowConfig } = {};
    protected _resLoadHandler: G.DpcResLoadHandler;
    /**
     * 控制器类字典
     */
    protected _ctrlClassMap: { [key: string]: G.CtrlClassType<G.IDpCtrl> } = {};
    public get sigCtrlCache(): G.CtrlInsMap {
        return this._sigCtrlCache;
    }
    public getCtrlClass(typeKey: string): G.CtrlClassType<G.IDpCtrl> {
        const clas = this._ctrlClassMap[typeKey];
        return clas;
    }
    public init(resLoadHandler?: G.DpcResLoadHandler): void {
        if (!this._resLoadHandler) {
            this._resLoadHandler = resLoadHandler;
        }
    }
    public registTypes(classes: G.CtrlClassMap | G.CtrlClassType[]) {
        if (classes) {
            if (typeof classes.length === "number" && classes.length) {
                for (let i = 0; i < classes.length; i++) {
                    this.regist(classes[i]);
                }
            } else {
                for (const typeKey in classes) {
                    this.regist(classes[typeKey], typeKey);
                }
            }
        }
    }
    public regist(ctrlClass: G.CtrlClassType, typeKey?: string) {
        const classMap = this._ctrlClassMap;
        if (!ctrlClass.typeKey) {
            if (!typeKey) {
                console.error(`typeKey is null`);
                return;
            } else {
                (ctrlClass as any)["typeKey"] = typeKey;
            }
        }
        if (classMap[ctrlClass.typeKey]) {
            console.error(`type:${ctrlClass.typeKey} is exit`);
        } else {
            classMap[ctrlClass.typeKey] = ctrlClass;
        }
    }
    public getSigDpcRess(typeKey: string): string[] {
        const ctrlIns = this.getSigDpcIns({ typeKey: typeKey });
        if (ctrlIns) {
            return ctrlIns.getRess();
        }
        return null;
    }
    public getSigDpcIns<T extends G.IDpCtrl = any>(cfg: string | G.IDpcKeyConfig): T {
        cfg = this._getCfg(cfg);
        const sigCtrlCache = this._sigCtrlCache;
        if (!cfg.key) return null;
        let ctrlIns = sigCtrlCache[cfg.key];
        if (!ctrlIns) {
            ctrlIns = ctrlIns ? ctrlIns : this.insDpc(cfg);
            ctrlIns && (sigCtrlCache[cfg.key] = ctrlIns);
        }
        return ctrlIns as any;
    }
    public showDpc<T extends G.IDpCtrl = any>(showCfg: string | G.IDpCtrlShowConfig): T {
        showCfg = this._getCfg(showCfg);
        const ctrlIns = this.getSigDpcIns(showCfg);
        if (ctrlIns) {
            this.addDpcResRef(ctrlIns);

            const showTypeKey = ctrlIns.key;
            ctrlIns.needShow = true;
            const sigCtrlShowCfgMap = this._sigCtrlShowCfgMap;
            const oldShowCfg = sigCtrlShowCfgMap[ctrlIns.key];
            if (oldShowCfg) {
                oldShowCfg.onCancel && oldShowCfg.onCancel();
                Object.assign(oldShowCfg, showCfg);
            } else {
                sigCtrlShowCfgMap[ctrlIns.key] = showCfg;
            }
            if (ctrlIns.needLoad) {
                ctrlIns.isLoaded = false;
            } else if (!ctrlIns.isLoaded && !ctrlIns.isLoading) {
                ctrlIns.needLoad = true;
            }
            //需要加载
            if (ctrlIns.needLoad) {
                const preloadCfg = showCfg as G.IDpCtrlLoadConfig;
                preloadCfg.loadCb = (loadedCtrlIns) => {
                    const loadedShowCfg = sigCtrlShowCfgMap[showTypeKey];
                    if (loadedCtrlIns && loadedCtrlIns.needShow) {
                        this.initSigDpc(loadedShowCfg);
                        this._onCtrlShow(loadedCtrlIns, loadedShowCfg);
                    }
                    delete sigCtrlShowCfgMap[showTypeKey];
                };
                this._loadCtrl(ctrlIns, preloadCfg);
                ctrlIns.needLoad = false;
            } else {
                if (!ctrlIns.isInited) {
                    this.initSigDpc(showCfg);
                }
                if (ctrlIns.isInited) {
                    this._onCtrlShow(ctrlIns, showCfg);
                }
            }
            return ctrlIns as T;
        }
    }
    public loadSigDpc<T extends G.IDpCtrl = any>(loadCfg: string | G.IDpCtrlLoadConfig): T {
        loadCfg = this._getCfg(loadCfg);
        const ctrlIns = this.getSigDpcIns(loadCfg);
        if (ctrlIns) {
            this._loadDpc(ctrlIns, loadCfg);
        }
        return ctrlIns as any;
    }
    protected _loadDpc(ctrlIns: G.IDpCtrl, loadCfg: G.IDpCtrlLoadConfig): void {
        if (ctrlIns) {
            if (ctrlIns.needLoad) {
                ctrlIns.isLoaded = false;
            } else if (!ctrlIns.isLoaded && !ctrlIns.isLoading) {
                ctrlIns.needLoad = true;
            }
            if (ctrlIns.needLoad) {
                this._loadCtrl(ctrlIns, loadCfg);
            }
            ctrlIns.needLoad = false;
        }
    }
    public initSigDpc<T extends G.IDpCtrl = any>(cfg: string | G.IDpCtrlInitConfig): T {
        let ctrlIns: G.IDpCtrl;
        cfg = this._getCfg<G.IDpCtrlInitConfig>(cfg);
        ctrlIns = this.getSigDpcIns(cfg);
        if (ctrlIns && ctrlIns.isLoaded && !ctrlIns.isInited) {
            ctrlIns.onInit(cfg.onInitData);
            ctrlIns.isInited = true;
            ctrlIns.forceHide();
        }
        return ctrlIns as any;
    }
    private _onCtrlShow(ctrlIns: G.IDpCtrl, showCfg: G.IDpCtrlShowConfig) {
        if (ctrlIns.needShow) {
            if (ctrlIns.isAsyncShow) {
                if (ctrlIns.isShowing) {
                    ctrlIns.forceHide();
                    ctrlIns.isShowing = false;
                }
                ctrlIns.onShow(showCfg.onShowData, showCfg.asyncShowedCb);
            } else {
                ctrlIns.onShow(showCfg.onShowData);
            }
            showCfg.showedCb && showCfg.showedCb(ctrlIns);
        }
        ctrlIns.needShow = false;
    }
    public createDpc<T extends G.IDpCtrl = any>(
        createCfg: string | G.IDpCtrlCreateConfig,
        loadEndCb?: VoidFunction,
        showEndCb?: VoidFunction
    ): T {
        createCfg = this._getCfg(createCfg) as G.IDpCtrlCreateConfig;
        const ctrlIns = this.insDpc(createCfg);
        const createCb = createCfg.createCb;
        if (ctrlIns) {
            this.addDpcResRef(ctrlIns);
            const initData = createCfg.onInitData;
            const onShowData = createCfg.onShowData;
            const isAutoShow = createCfg.isAutoShow;

            createCfg.loadCb = (ctrl) => {
                if (ctrl) {
                    ctrl.onInit(initData);
                    loadEndCb && loadEndCb();
                    ctrl.forceHide();
                    if (isAutoShow) {
                        const showCfg: G.IDpCtrlShowConfig = createCfg as any;
                        showCfg.onShowData = onShowData;
                        showCfg.showedCb = showEndCb;
                        this._onCtrlShow(ctrl, showCfg);
                    }
                }
                createCb && createCb(ctrl);
            };
            this._loadCtrl(ctrlIns, createCfg);
        } else {
            createCb(null);
        }
        return ctrlIns as T;
    }

    public hideDpc(key: string, autoReleaseRes?: boolean): void {
        if (!key) {
            console.warn("!!!key is null");
            return;
        }
        const ctrlIns = this._sigCtrlCache[key];
        if (!ctrlIns) {
            console.warn(`${key} 没实例化`);
            return;
        }
        ctrlIns.needShow = false;
        ctrlIns.onHide();
        this.removeDpcResRef(key, autoReleaseRes);
    }

    public updateDpc<K>(key: string, updateData?: K): void {
        if (!key) {
            console.warn("!!!key is null");
            return;
        }
        const ctrlIns = this._sigCtrlCache[key];
        if (ctrlIns && ctrlIns.isInited) {
            ctrlIns.onUpdate(updateData);
        } else {
            console.warn(` updateDpc key:${key},该实例没初始化`);
        }
    }
    public destroyDpc(key: string, destroyRes?: boolean) {
        if (!key || key === "") {
            console.warn("!!!key is null");
            return;
        }
        const ctrlIns = this._sigCtrlCache[key];
        this.destroyDpcByIns(ctrlIns, destroyRes);
        this._sigCtrlCache[key] = undefined;
        delete this._sigCtrlCache[key];
    }
    public destroyDpcByIns(ctrlIns: G.IDpCtrl, destroyRes?: boolean) {
        if (ctrlIns) {
            if (ctrlIns.isInited) {
                ctrlIns.isLoaded = false;
                ctrlIns.isInited = false;
                ctrlIns.needShow = false;
                ctrlIns.forceHide();
            }
            this.removeDpcResRef(ctrlIns, true);
            ctrlIns.onDestroy(destroyRes);
        } else {
            console.warn(`destroyDpc key:${ctrlIns.key},该实例没有初始化`);
        }
    }
    public hasDpc(key: string): boolean {
        return !!this.sigCtrlCache[key];
    }
    public getDpcIns<T extends G.IDpCtrl = any>(key: string): T {
        if (!key) {
            console.warn("!!! key is null");
            return;
        }
        const ctrlIns = this._sigCtrlCache[key];
        if (!ctrlIns) {
            console.warn(`getDpc key:${key},该控制器没有加载`);
            return null;
        }
        return ctrlIns.getFace<T>();
    }

    public isShowed(key: string): boolean {
        if (!key) {
            console.warn("!!!key is null");
            return;
        }
        const ctrlIns = this._sigCtrlCache[key];
        if (ctrlIns) {
            return ctrlIns.isShowed;
        } else {
            return false;
        }
    }
    public isLoaded(key: string): boolean {
        if (!key) {
            console.warn("!!!key is null");
            return;
        }
        const ctrlIns = this._sigCtrlCache[key];
        if (ctrlIns) {
            return ctrlIns.isLoaded;
        } else {
            return false;
        }
    }

    public onResize() {
        const sigCtrlCache = this._sigCtrlCache;
        let ctrlIns: G.IDpCtrl;
        for (let key in sigCtrlCache) {
            ctrlIns = sigCtrlCache[key];
            if (ctrlIns.isInited) {
                ctrlIns.onResize();
            }
        }
    }
    public insDpc<T extends G.IDpCtrl = any>(keyCfg: string | G.IDpcKeyConfig): T {
        keyCfg = this._getCfg(keyCfg);
        const ctrlClass = this._ctrlClassMap[keyCfg.typeKey];
        if (!ctrlClass) {
            console.error(`实例,请先注册类:${keyCfg.typeKey}`);
            return null;
        }
        const ctrlIns = new ctrlClass();
        ctrlIns.key = keyCfg.key;
        return ctrlIns as any;
    }
    public addDpcResRef(keyOrCtrl: string | G.IDpCtrl): void {
        let dpcIns: G.IDpCtrl;
        if (typeof keyOrCtrl === "string") {
            dpcIns = this.getSigDpcIns(keyOrCtrl);
        } else {
            dpcIns = keyOrCtrl;
        }
        if (dpcIns.isRetainRes) {
            return;
        }
        if (dpcIns.onResRefChange) {
            dpcIns.isRetainRes = true;
            dpcIns.onResRefChange(true);
        }
    }
    public removeDpcResRef(keyOrCtrl: string | G.IDpCtrl, autoReleaseRes?: boolean, destroyRes?: boolean): void {
        let dpcIns: G.IDpCtrl;
        if (typeof keyOrCtrl === "string") {
            dpcIns = this.getSigDpcIns(keyOrCtrl);
        } else {
            dpcIns = keyOrCtrl;
        }
        if (!dpcIns.isRetainRes) {
            return;
        }
        if (dpcIns.onResRefChange) {
            dpcIns.isRetainRes = false;
            dpcIns.onResRefChange(false, autoReleaseRes, destroyRes);
        }
    }
    private _getCfg<T = {}>(cfg: string | T): T {
        if (typeof cfg === "string") {
            cfg = { typeKey: cfg, key: cfg } as any;
        }
        if (!cfg["key"]) {
            cfg["key"] = cfg["typeKey"];
        }
        return cfg as T;
    }
    protected _loadCtrl(ctrlIns: G.IDpCtrl, loadCfg: G.IDpCtrlLoadConfig) {
        if (ctrlIns) {
            if (!ctrlIns.isLoaded) {
                if (isNull(loadCfg["loadCount"])) {
                    loadCfg["loadCount"] = 0;
                }
                loadCfg["loadCount"]++;
                const onComplete = () => {
                    loadCfg["loadCount"]--;
                    if (loadCfg["loadCount"] === 0) {
                        ctrlIns.isLoaded = true;
                        ctrlIns.isLoading = false;
                        loadCfg.loadCb(ctrlIns);
                    }
                };
                const onError = () => {
                    loadCfg["loadCount"]--;
                    console.error(`资源加载失败:${ctrlIns.key}`);
                    if (loadCfg["loadCount"] === 0) {
                        ctrlIns.isLoaded = false;
                        ctrlIns.isLoading = false;
                        loadCfg.loadCb(null);
                    }
                };

                const customLoadViewIns: G.ICustomLoadDpc = ctrlIns as any;
                ctrlIns.isLoading = true;
                ctrlIns.isLoaded = false;
                if (customLoadViewIns.onLoad) {
                    customLoadViewIns.onLoad(onComplete, onError, loadCfg.loadArgs);
                } else if (this._resLoadHandler) {
                    const ress = ctrlIns.getRess ? ctrlIns.getRess() : null;
                    if (!ress || !ress.length) {
                        onComplete();
                        return;
                    }
                    this._resLoadHandler(loadCfg.key, ress, onComplete, onError, loadCfg.loadArgs);
                } else {
                    ctrlIns.isLoaded = false;
                    ctrlIns.isLoading = false;
                    onError();
                    console.error(`无法处理加载:${ctrlIns.key}`);
                }
            } else {
                ctrlIns.isLoaded = true;
                ctrlIns.isLoading = false;
                loadCfg.loadCb && loadCfg.loadCb(ctrlIns);
            }
        }
    }
}
