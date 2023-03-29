declare interface IFguiPkgResInfo<T = any, K = any, J = any> {
    /**包资源路径，不带后缀 */
    pkgPath?: string,
    /**包名 */
    pkgName?: string | any,
    /**图集资源 */
    atlas: { [key: string]: string[] | string }
    /**散图资源,生成时可能是单一图片路径，或者图片路径数组 */
    imgs: { [key: string]: string }
    /**动画名字典 */
    animNames?: J
    /**动画资源对应的图片和图集资源key从atlas或imgs里取,运行时生成路径数组 */
    animRess: { [key: string]: string[]  }
    /** 是否带分文件夹导出 如果是true 即hero.fui的路径就要是这样：hero/hero.fui ,否则这样hero.fui */
    isWithDir: boolean
    /**组件名字典 */
    keys?: T,
    /**组件资源引用信息字典 */
    compResRefMap?: K,
    /**组件引用资源路径数组字典，key是组件名，value是所引用的资源数组 */
    compDepRessMap?: { [key: string]: string[] }
    /**运行时生成的包内的资源路径数组 */
    ress?: string[],
    /**组件所依赖的所有资源路径数组 */
    compDepRess?: string[]
}

declare interface IFguiPkgResRefMap {
    [key: string]: IFguiPkgResRef

}
declare interface IFguiPkgResRef {
    /**对图集的引用 */
    atlas: number[]
    /**对序列帧资源的引用 */
    anims: string[]
    /**对组件的引用 */
    comps: string[]
    /**对单独的图片文件的引用 */
    imgs: string[],
    /**依赖的组件所依赖的包 */
    compsDepPkgs?: string[]

}
declare interface IFguiResConfig {
    /**包资源信息字典 */
    resInfoMap: { [key: string]: IFguiPkgResInfo },
    /**包文件后缀 */
    extension: string,
    /**命名空间 */
    nameSpace: string,
    /**是否是二进制格式 */
    isByte: boolean
}
declare interface IFguiPkgResInfoMap { }
type CompNameType<T extends keyof IFguiPkgResInfoMap> = keyof IFguiPkgResInfoMap[T]["keys"];
type AnimNameType<T extends keyof IFguiPkgResInfoMap> = keyof IFguiPkgResInfoMap[T]["animNames"];
type PkgNameType = keyof IFguiPkgResInfoMap;