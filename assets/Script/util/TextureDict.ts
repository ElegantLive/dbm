const { ccclass } = cc._decorator;

@ccclass
export default class TextureDict extends cc.Component {
  private static imageDict = {};

  static loadImageRemote(url: string | null, call: Function) {
    if (!url) return;
    const texture = this.imageDict[url];
    if (texture) {
      const spriteFrame = new cc.SpriteFrame(texture);
      call && call(spriteFrame);
      return;
    }

    cc.assetManager.loadRemote(url, { ext: ".png" }, (err, texture) => {
      if (err) {
        console.error("load ", url, " error: ", err);
      }
      if (texture) {
        this.imageDict[url] = texture;
        const spriteFrame = new cc.SpriteFrame(texture as cc.Texture2D);
        call && call(spriteFrame);
      }
    });
  }
}
