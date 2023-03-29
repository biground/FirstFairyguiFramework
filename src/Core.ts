export class App implements G.IApp {
    public static readonly UN_RUN: number = 0;
    public static readonly BOOTING: number = 1;
    public static readonly BOOTEND: number = 2;
    public static readonly RUNING: number = 3;
    public static readonly STOP: number = 4;
    protected _state: number = 0;
    protected _moduleMap: { [key: string]: G.IModule } = {};
    protected _proxyModuleMap: { [key: string]: G.IModule };
    public get state(): number {
        return this._state;
    }
    public get moduleMap(): IModuleMap {
        const moduleMap = this._moduleMap;
        return this._moduleMap as any;
    }
    public async bootstrap(bootLoaders: G.IBootLoader[]): Promise<boolean> {
        const bootPromises: Promise<boolean>[] = [];
        for (let i = 0; i < bootLoaders.length; i++) {
            const bootLoader: G.IBootLoader = bootLoaders[i];
            bootPromises.push(
                new Promise<boolean>((res, rej) => {
                    bootLoader.onBoot(this, (isOk) => {
                        if (isOk) {
                            res(true);
                        } else {
                            rej();
                        }
                    });
                })
            );
        }
        this.setState(App.BOOTING);
        try {
            await Promise.all(bootPromises);
            this.setState(App.BOOTEND);
            return true;
        } catch (e) {
            console.error(e);
            this.setState(App.BOOTEND);
            return false;
        }
    }

    public init(): void {
        const moduleMap = this._moduleMap;
        let moduleIns: G.IModule;
        for (const key in moduleMap) {
            moduleIns = moduleMap[key];
            moduleIns.onInit && moduleIns.onInit(this);
        }
        for (const key in moduleMap) {
            moduleIns = moduleMap[key];
            moduleIns.onAfterInit && moduleIns.onAfterInit(this);
        }
        this.setState(App.RUNING);
    }
    public bootSubPkg(subPkgName: string, bootEndCb: G.BootEndCallback) {
        const subPkg: G.ISubPkg = window[subPkgName];
        if (subPkg && subPkg.onBoot) {
            subPkg.onBoot(this, this.moduleMap, bootEndCb);
        }
    }
    public loadModule(moduleIns: any | G.IModule, key?: string): boolean {
        if (this._state === App.STOP) return false;
        let res: boolean = false;
        if (!key) {
            key = moduleIns.key;
        }
        if (key && typeof key === "string") {
            if (moduleIns) {
                if (!this._moduleMap[key]) {
                    this._moduleMap[key] = moduleIns;
                    res = true;
                    if (this._state === App.RUNING) {
                        moduleIns.onInit && moduleIns.onInit(this);
                        moduleIns.onAfterInit && moduleIns.onAfterInit();
                    }
                } else {
                    this._log(`加载模块:模块:${key}已经存在,不重复加载`);
                }
            } else {
                this._log(`加载模块:模块:${key}实例为空`);
            }
        } else {
            this._log(`加载模块:模块key为空`);
        }
        return res;
    }
    public hasModule(moduleKey: string): boolean {
        return !!this._moduleMap[moduleKey];
    }
    public stop(): void {
        const moduleMap = this._moduleMap;
        let moduleIns: G.IModule;
        this.setState(App.STOP);
        for (const key in moduleMap) {
            moduleIns = moduleMap[key];
            moduleIns.onStop && moduleIns.onStop();
        }
    }
    public getModule<T extends G.IModule>(moduleKey: string): T {
        return this._moduleMap[moduleKey] as T;
    }

    protected setState(state: number) {
        this._state = state;
    }
    /**
     * 输出
     * @param level 1 warn 2 error
     * @param msg
     */
    protected _log(msg: string, level?: number): void {
        switch (level) {
            case 1:
                console.warn(`【主程序】${msg}`);
                break;
            case 2:
                console.error(`【主程序】${msg}`);
                break;
            default:
                console.warn(`【主程序】${msg}`);
                break;
        }
    }
}
