declare global {
    type ArgsType<T> = T extends (...args: infer A) => any ? A : never;
    type FunctionPropertyNames<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T] &
        string;
    interface IModuleMap {}
    namespace G {
        interface IModule {
            /**模块名 */
            key?: string;
            /**
             * 当初始化时
             */
            onInit?(app: IApp): void;
            /**
             * 所有模块初始化完成时
             */
            onAfterInit?(app: IApp): void;
            /**
             * 模块停止时
             */
            onStop?(): void;
        }
        type BootEndCallback = (isSuccess: boolean) => void;
        /**
         * 引导程序
         */
        interface IBootLoader {
            /**
             * 引导
             * @param app
             */
            onBoot(app: IApp, bootEnd: BootEndCallback): void;
        }
        /**
         * 子包程序
         */
        interface ISubPkg {
            onBoot(app: IApp, m: IModuleMap, bootEnd: BootEndCallback): void;
        }
        /**
         * 主程序
         */
        interface IApp {
            /**
             * 程序状态
             * 0 未启动 1 引导中, 2 初始化, 3 运行中
             */
            state: number;
            /**
             * 模块字典
             */
            moduleMap: IModuleMap;
            /**
             * 引导
             * @param bootLoaders
             */
            bootstrap(bootLoaders: G.IBootLoader[]): Promise<boolean>;
            /**
             * 初始化
             */
            init(onModulesInited?: (moduleMap: IModuleMap) => void): void;
            /**
             * 加载模块
             * @param module
             */
            loadModule(module: IModule | any, key?: string): void;
            /**
             * 加载子包
             * @param subPkgName
             * @param bootEndCb
             */
            bootSubPkg(subPkgName: string, bootEndCb: BootEndCallback): void;
            /**
             * 停止
             */
            stop(): void;
            /**
             * 获取模块实例
             * @param moduleKey
             */
            getModule<T extends IModule = any>(moduleKey: string): T;
            /**
             * 判断有没有这个模块
             * @param moduleKey
             */
            hasModule(moduleKey: string): boolean;
        }
    }
}

export interface GCoreInterfaces {}
