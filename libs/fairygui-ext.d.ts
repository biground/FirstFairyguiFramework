type FGComp = fairygui.GComponent;
type FGButton = fairygui.GButton;
type FGImage = fairygui.GImage;
type FGText = fairygui.GTextField;
type FGRText = fairygui.GRichTextField;
type FGLabel = fairygui.GLabel;
type FGController = fairygui.Controller;
type FGLoader = fairygui.GLoader;
type FGTextInput = fairygui.GTextInput
type FGList = fairygui.GList;
type FGObj = fairygui.GObject;
type FGGroup = fairygui.GGroup;

declare namespace fgui {
    interface GLoader {
        loadAnim<P extends PkgNameType>(pkgName: P, animName: AnimNameType<P>)
    }
}