declare global {
    namespace G {
        type LayerClassType = new () => ILayer;
        interface ILayer {
            layerType: number;
            layerName: string;
            onInit(layerName: string, layerType: number, layerMgr: ILayerMgr): void;
            /**
             * 当被添加到根节点时
             * @param root
             */
            onAdd(root: any): void;
            /**
             * 当隐藏时
             */
            onHide(): void;
            /**
             * 当显示时
             */
            onShow(): void;
            /**
             * 当销毁时
             */
            onDestroy?(): void;
            /**
             * 当有节点添加时
             * @param node
             */
            onNodeAdd(node: any): void;
            /**
             * 当有显示节点添加时
             * @param sp
             */
            onSpAdd(sp: any): void;
        }
        interface ILayerMgr<T = any> {
            /**
             * 层级字典
             */
            layerMap: Map<number, G.ILayer>;
            /**
             * 层级管理根节点
             */
            root: T;
            /**
             * 初始化层级
             * @param root 层级根节点
             * @param layerEnum 层级枚举
             * @param defaultType 默认层级处理类
             * @param typeMap 自定义层级处理类字典
             */
            init(root: T, layerEnum: any, defaultType: LayerClassType, typeMap?: Map<string, LayerClassType>): void;
            /**
             * 添加层级
             * @param layer 层级对象
             */
            addLayer(layer: G.ILayer): boolean;
            /**
             * 移除层级
             * @param layerType 层级类型
             */
            removeLayer(layerType: number): boolean;
            /**
             * 隐藏指定层级
             * @param layerType
             */
            hideLayer(layerType: number): void;
            /**
             * 显示指定层级
             * @param layerType
             */
            showLayer(layerType: number): void;
            /**
             * 添加渲染节点到层级
             * @param node
             * @param layerType
             */
            addNodeToLayer(node: T, layerType: number): void;
            /**
             * 获取层级
             * @param layerType
             */
            getLayerByType<K extends G.ILayer>(layerType: number): K;
        }
    }
}
export interface LayerInterfaces {}
