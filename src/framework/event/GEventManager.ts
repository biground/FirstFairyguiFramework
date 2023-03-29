import GEventType from "./GEventType";

export default class GEventManager {
    private static _ins: GEventManager;
    private _eventArr: string[] = [];
    private _nextEventArr: string[] = [];
    private _redArr: string[] = [];
    public constructor() { }

    public static get ins(): GEventManager {
        if (!this._ins) {
            this._ins = new GEventManager();
        }
        return this._ins;
    }

    /**
     * 重置
     *
     */
    public static clean(): void {
        this._ins = null;
    }
    /**
     * 注册事件
     * @param type
     * @param caller
     * @param callBack
     * @param isOnce
     * @param args
     *
     */
    public regEvent<T extends keyof broadcast.EventDataType>(type: T, caller: any, callBack: broadcast.EventTypeData[T]["listener"], isOnce: boolean = false, args: any[] = null): void {
        if (isOnce) {
            Laya.stage.once(type, caller, callBack, args);
        } else {
            Laya.stage.on(type, caller, callBack, args);
        }
    }

    /**
     * 触发事件
     * @param type
     * @param data
     *
     */
    public dispEvent<T extends keyof broadcast.EventDataType>(type: T, data: broadcast.EventDataType[T] = null): void {
        Laya.stage.event(type, [data]);
    }

    /**
     * 对象中删除侦听器。
     * @param type		事件的类型。
     * @param caller	事件侦听函数的执行域。
     * @param listener	事件侦听函数。
     * @param onceOnly	（可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
     * @return 此 EventDispatcher 对象。
     */
    public removeEvent(type: string, caller: any, listener: Function, onceOnly: boolean = false): void {
        Laya.stage.off(type, caller, listener, onceOnly);
    }

    //*********************************************以下是延迟更新页面事件**************************************************

    public regDelayEventLis(
        caller: any = null,
        callBack: Function = null,
        isOnce: boolean = false,
        args: any[] = null
    ): void {
        if (isOnce) {
            Laya.stage.once(GEventType.LATER_VIEW_UPDATE, caller, callBack, args);
        } else {
            Laya.stage.on(GEventType.LATER_VIEW_UPDATE, caller, callBack, args);
        }
    }

    private curDelayEventP: any = {};
    private nextDelayEventP: any = {};
    private tmpDelayEventP: any;
    public disDelayEvent(type: string, eventP: any = null): void {
        let idx = this._nextEventArr.indexOf(type);
        if (idx == -1) {
            this._nextEventArr.push(type);
        }

        do {
            if (eventP == null) break;

            let target: any[] = this.nextDelayEventP[type];
            if (target == null) {
                target = this.nextDelayEventP[type] = [eventP];
            } else {
                target.push(eventP);
            }
            break;
        } while (true);
        Laya.timer.callLater(this, this.latterDis);

        // if(this._eventArr.indexOf(type)==-1)
        // {
        //     Laya.timer.callLater(this, this.latterDis);
        //     if(eventP != null)
        //         this.nextDelayEventP[type] = eventP;
        // }
    }

    private latterDis(): void {
        let tmp = this._eventArr;
        this._eventArr = this._nextEventArr;
        this._nextEventArr = tmp;

        if (this._eventArr.length > 0) {
            this.tmpDelayEventP = this.curDelayEventP;
            this.curDelayEventP = this.nextDelayEventP;
            this.nextDelayEventP = this.curDelayEventP;
            Laya.stage.event(GEventType.LATER_VIEW_UPDATE, [this._eventArr, this.curDelayEventP]);
            for (let key in this.curDelayEventP) {
                if (this.curDelayEventP[key] != null) {
                    this.curDelayEventP[key] = null;
                }
            }
            this._eventArr.length = 0;
        }
    }

    public removeDelayEventLis(caller: any, listener: Function, onceOnly: boolean = false): void {
        Laya.stage.off(GEventType.LATER_VIEW_UPDATE, caller, listener, onceOnly);
    }

    //*********************************************以下是红点事件**************************************************

    /**
     * 注册红点延迟更新事件
     * @param caller
     * @param callBack
     * @param isOnce
     * @param args
     *
     */
    public regRedEvent(
        caller: any = null,
        callBack: Function = null,
        isOnce: boolean = false,
        args: any[] = null
    ): void {
        if (isOnce) {
            Laya.stage.once(GEventType.RED_UPDATE, caller, callBack, args);
        } else {
            Laya.stage.on(GEventType.RED_UPDATE, caller, callBack, args);
        }
    }

    /**
     *延迟触发  EventType.RED_UPDATE 事件
     * @param type 子事件
     *
     */
    public disRedEvent(): void {
        if (this._redArr.length < 1) {
            this._redArr.push(GEventType.RED_UPDATE);
            Laya.timer.callLater(this, this.redDisEvent);
        }
    }

    /**
     * 延迟处理事件
     *
     */
    private redDisEvent(): void {
        if (this._redArr.length > 0) {
            Laya.stage.event(GEventType.RED_UPDATE, [this._redArr]);
            this._redArr = [];
        }
    }

    /**
     * 对象中删除侦听器。
     * @param caller	事件侦听函数的执行域。
     * @param listener	事件侦听函数。
     * @param onceOnly	（可选）如果值为 true ,则只移除通过 once 方法添加的侦听器。
     * @return 此 EventDispatcher 对象。
     */
    public removeRedEvent(caller: any, listener: Function, onceOnly: boolean = false): void {
        Laya.stage.off(GEventType.RED_UPDATE, caller, listener, onceOnly);
    }
}
