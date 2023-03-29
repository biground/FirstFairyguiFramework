declare global {
    namespace G {
        type CtrlClassType<T extends IDpCtrl = any> = {
            readonly typeKey?: string;
            new (dpCtrlMgr?: IDpCtrlMgr): T;
        };
        type CtrlLoadedCb = (isOk: boolean) => void;
        type CtrlInsMap = { [key: string]: IDpCtrl };
        type CtrlShowCfgs = { [key: string]: IDpCtrlShowConfig[] };
        type CtrlClassMap = { [key: string]: CtrlClassType<IDpCtrl> };
        type CtrlInsCb<T = IDpCtrl> = (ctrl: T) => void;
        /**
         * key dpc实例的key
         * ress 需要加载的资源
         * complete 加载完成回调
         * error 加载失败回调
         * progress 加载中回调 进度值0~1
         * loadArgs 加载参数
         */
        type DpcResLoadHandler = (
            key: string,
            ress: string[],
            complete: VoidFunction,
            error?: VoidFunction,
            loadArgs?: any
        ) => void;
        interface IDpcKeyConfig {
            typeKey: string;
            key?: string;
        }
        interface IDpCtrlLoadConfig extends IDpcKeyConfig {
            /**加载参数 */
            loadArgs?: any;
            /**自定义加载处理 */
            loadHandler?: DpcResLoadHandler;
            /**加载完成回调 */
            loadCb?: CtrlInsCb;
        }
        interface IDpCtrlInitConfig extends IDpcKeyConfig {
            onInitData?: any;
        }
        interface IDpCtrlCreateConfig extends IDpCtrlLoadConfig, IDpcKeyConfig {
            isAutoShow?: boolean;
            onInitData?: any;
            onShowData?: any;
            createCb?: CtrlInsCb;
        }
        interface IDpCtrlShowConfig extends IDpCtrlLoadConfig, IDpCtrlInitConfig {
            onShowData?: any;
            /**onShow后调用就执行 */
            showedCb?: CtrlInsCb;
            /**onShow内调用异步显示完成回调，比如动画之类的 */
            asyncShowedCb?: VoidFunction;
            /**显示被取消了 */
            onCancel?: VoidFunction;
        }
        interface IDpCtrl extends ICustomLoadDpc{
            key?: string;
            /**正在加载 */
            isLoading?: boolean;
            /**已经加载 */
            isLoaded?: boolean;

            // /**是否异步初始化 */
            // isAsyncInit?: boolean
            // /**正在初始化 */
            // isIniting?: boolean;
            /**已经初始化 */
            isInited?: boolean;

            /**是否异步显示 */
            isAsyncShow?: boolean;
            /**正在显示 */
            isShowing?: boolean;
            /**已经显示 */
            isShowed?: boolean;
            /**需要显示 */
            needShow?: boolean;
            /**需要加载 */
            needLoad?: boolean;
            /**是否持有资源 */
            isRetainRes?: boolean;
            /**获取资源 */
            getRess?(): string[];
            /**
             * 初始化
             * @param initData 初始化数据
             * @param endCb 初始化结束
             */
            onInit(initData?: any, endCb?: VoidFunction): void;
            /**
             * 当显示时
             * @param showData 显示数据
             * @param endCb 显示结束
             */
            onShow(showData?: any, endCb?: VoidFunction): void;
            /**
             * 当更新时
             * @param updateData 更新数据
             * @param endCb 结束回调
             */
            onUpdate(updateData: any): void;
            /**
             * 获取控制器
             */
            getFace<T = any>(): T;
            /**
             * 当隐藏时
             * @param endCb 结束回调
             */
            onHide(endCb?: any): void;
            /**
             * 强制隐藏
             */
            forceHide(): void;
            /**
             * 当销毁时
             * @param destroyRes
             * @param endCb 结束回调
             */
            onDestroy(destroyRes?: boolean): void;
            /**
             * 资源引用变更
             * @param isAddRef 是否添加引用
             * @param autoReleaseRes 是否自动清理资源， 只清理gpu资源，不销毁资源壳
             * @param destroyRes 是否销毁资源，清理gpu资源，并销毁资源壳
             */
            onResRefChange(isAddRef: boolean, autoReleaseRes?: boolean, destroyRes?: boolean): void;
            /**
             * 当设备尺寸发生变化时
             * @param stageWidth
             * @param stageHeight
             * @param viewScale
             */
            onResize(): void;
            getNode<T = any>(): T;
        }
        interface ICustomLoadDpc {
            /**
             * 当加载时
             * @param complete 加载完成
             * @param error 加载失败
             * @param loadArgs 加载参数
             */
            onLoad?(complete: VoidFunction, error?: VoidFunction, loadArgs?: any[]): void;
        }
        interface IDpCtrlMgr {
            /**
             * 控制器单例字典
             */
            sigCtrlCache: CtrlInsMap;
            /**
             * 初始化
             * @param resLoadHandler 资源加载接口
             */
            init(resLoadHandler?: G.DpcResLoadHandler): void;
            /**
             * 批量注册控制器类
             * @param classMap
             */
            registTypes(classes: G.CtrlClassMap | G.CtrlClassType[]): void;
            /**
             * 注册控制器类
             * @param ctrlClass
             */
            regist(ctrlClass: G.CtrlClassType, typeKey?: string): void;
            /**
             * 实例化显示控制器
             * @param keyCfg 注册时的typeKey或者 G.IDpcKeyConfig
             */
            insDpc<T extends G.IDpCtrl = any>(keyCfg: string | G.IDpcKeyConfig): T;
            /**
             * 获取/生成单例显示控制器示例
             * @param cfg 注册时的typeKey或者 G.IDpcKeyConfig
             */
            getSigDpcIns<T extends G.IDpCtrl = any>(cfg: string | G.IDpcKeyConfig): T;
            /**
             * 加载Dpc
             * @param loadCfg 注册时的typeKey或者 G.IDpCtrlLoadConfig
             */
            loadSigDpc<T extends G.IDpCtrl = any>(loadCfg: string | G.IDpCtrlLoadConfig): T;
            /**
             * 初始化显示控制器
             * @param initCfg 注册类时的 typeKey或者 G.IDpCtrlInitConfig
             */
            initSigDpc<T extends G.IDpCtrl = any>(initCfg: string | G.IDpCtrlInitConfig): T;
            /**
             *
             * @param typeKey
             * @param key
             * @param lifeCircleData
             */
            showDpc<T extends IDpCtrl = any>(showCfg: string | IDpCtrlShowConfig): T;
            /**
             * 更新控制器
             * @param key
             * @param updateData
             */
            updateDpc(key: string, updateData?: any): void;
            /**
             * 隐藏控制器
             * @param key
             * @param releaseDpcRes 释放资源
             */
            hideDpc(key: string, releaseDpcRes?: boolean): void;
            /**
             * 获取单例显示控制器实例
             * @param key
             */
            getDpcIns<T extends IDpCtrl = any>(key: string): T;
            /**
             * 是否实例化了单例dpc
             * @param key
             */
            hasDpc(key: string): boolean;
            /**
             * 销毁控制器
             * @param key
             */
            destroyDpc(key: string, destroyRes?: boolean): void;
            /**
             * 创建控制器实例
             * @param typeKey
             * @param key
             * @param lifeCircleData
             * @param isAutoShow
             */
            createDpc<T extends IDpCtrl = any>(
                createCfg: string | IDpCtrlCreateConfig,
                loadEndCb?: VoidFunction,
                showEndCb?: VoidFunction
            ): T;
            /**
             * 持有dpc资源
             * @param keyOrCtrl
             */
            addDpcResRef(keyOrCtrl: string | G.IDpCtrl): void;
            /**
             * 释放dpc资源 , 清理占显存资源，但保留壳
             * @param keyOrCtrl
             */
            removeDpcResRef(keyOrCtrl: string | G.IDpCtrl): void;
            /**
             * 通过实例销毁
             * @param ins
             * @param destroyRes 是否销毁资源
             */
            destroyDpcByIns<T extends G.IDpCtrl>(ins: T, destroyRes?: boolean, endCb?: VoidFunction): void;
            /**
             * 获取单例控制器是否显示
             * @param key
             */
            isShowed(key: string): boolean;
            /**
             * 获取控制器类
             * @param typeKey
             */
            getCtrlClass(typeKey: string): CtrlClassType<IDpCtrl>;
        }
    }
}
export interface DpCtrlInterfaces {}
