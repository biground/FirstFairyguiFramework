export default class GEventType {
    public constructor() {}

    /**
     *页面延迟更新事件（总类型）
     */
    public static LATER_VIEW_UPDATE: string = "LATER_VIEW_UPDATE";

    public static RED_UPDATE: string = "RED_UPDATE";
    /**
     *SOCKET链接上了
     */
    public static SOCKET_TYPE_OPEN: string = "SOCKET_TYPE_OPEN";
    /**
     *SOCKET断开
     */
    public static SOCKET_TYPE_CLOSE: string = "SOCKET_TYPE_CLOSE";
    /**
     *SOCKET error
     */
    public static SOCKET_TYPE_ERROR: string = "SOCKET_TYPE_ERROR";
    /**
     *SOCKET 重连次数过多，放弃链接状态
     */
    public static SOCKET_TYPE_OVER: string = "SOCKET_TYPE_OVER";

    public static LOGIN_SUCCESS: string = "LOGIN_SUCCESS";

    public static SIMULATE_BATTLE: string = "SIMULATE_BATTLE";
    public static REPLAY_BATTLE: string = "REPLAY_BATTLE";
    public static BATTLE_EVENT: string = "BATTLE_EVENT";
    public static MYSTERY_EVENT: string = "MYSTERY_EVENT";

    public static FEATURE_UNLOCK: string = "FEATURE_UNLOCK"; //功能开启
    public static LV_CHANGE: string = "LV_CHANGE"; //等级变更
    public static HANDUP_CHANGE: string = "HANDUP_CHANGE"; //关卡变更

    public static EDITOR_EVENT: string = "EDITOR_EVENT"; //编辑器事件

    public static FRESH_SERVER_LIST: string = "FRESH_SERVER_LIST"; //拉取服务器列表

    public static HERO_TABLE_SCROLL_TO: string = "HERO_TABLE_SCROLL_TO"; //滚动到
}
