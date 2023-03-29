export class BaseControllerUser<T> implements G.IControllerUser<T> {
    protected _presenter: T;
    public setController(presenter: T): void {
        if (this._presenter) return;
        this._presenter = presenter;
    }
    public onInit() {}
}
