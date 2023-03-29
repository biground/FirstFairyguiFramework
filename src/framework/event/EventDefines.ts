declare global {
    namespace broadcast {
        interface EventDataType {
            [key: string | symbol]: any
        }
        type EventTypeData = {
            [T in keyof EventDataType]: {
                listener: (data: EventDataType[T]) => void
                data: EventDataType[T];
            }
        }
    }
}
export class GlobalEvent {
    /**
     * UI显示
     * 发送参数: UIkey 比如 LoginView
     */
    static readonly UI_SHOWED = Symbol();
    /**
     * UI隐藏
     * 发送参数: UIkey 比如 CityView
     */
    static readonly UI_HIDED = Symbol();
    /**
     * 走完hideDpc的逻辑（完全移除引用之后）
     * 发送参数 UIkey 比如 CityView
     */
    static readonly HIDED_DPC = Symbol();
}
