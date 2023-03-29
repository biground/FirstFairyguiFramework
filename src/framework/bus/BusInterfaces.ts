declare global {
    namespace G {
        /**提供者的使用者，比如model,view */
        interface IControllerUser<T> {
            setController(ctrl: T): void;
            onInit();
        }
        /**业务模块定义接口 */
        interface IBusModuleDefine {
            moduleKey: string;
            views: { [key: string]: string };
            [key: string]: any;
        }
        interface IBusModule extends G.IModule {
            /**登录初始化 */
            onLoginInit?(loginData?: any): void;
            /**登录后所有业务模块都初始化后 */
            onAfterLoginInit?(loginData?: any): void;
            /**断开连接 */
            onDisconnect?(): void;
            /**重连时 */
            onReconnect?(reconnectData?: any): void;
        }
        interface IBusModuleMgr extends G.IModule {
            loadBusModules(modules: G.IBusModule[]): void;
            onLoginSuccess(data: any): void;
            onReconnected(data: any): void;
            onDisConnected(): void;
        }
    }
}
export interface IBusInterfaces {}
