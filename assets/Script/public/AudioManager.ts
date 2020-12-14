const { ccclass, property } = cc._decorator;

type onceKey =
  | "win"
  | "coin"
  | "jump"
  | "lose"
  | "foollose"
  | "broken"
  | "whatcar"
  | "button";

@ccclass
export default class AudioManager extends cc.Component {
  @property(cc.AudioClip)
  bgMusic: cc.AudioClip = null;
  @property(cc.AudioClip)
  coinMusic: cc.AudioClip = null;
  @property(cc.AudioClip)
  winMusic: cc.AudioClip = null;
  @property(cc.AudioClip)
  buttonMusic: cc.AudioClip = null;
  @property(cc.AudioClip)
  jumpMusic: cc.AudioClip = null;
  @property(cc.AudioClip)
  loseMusic: cc.AudioClip = null;
  @property(cc.AudioClip)
  foolloseMusic: cc.AudioClip = null;
  @property(cc.AudioClip)
  brokenMusic: cc.AudioClip = null;
  @property(cc.AudioClip)
  whatcarMusic: cc.AudioClip = null;

  musicMap;
  bgStatus: boolean = false;
  onceStatus: boolean = false;
  bgMusicChannel: number;

  public static _instance: AudioManager;

  onLoad() {
    this.initVolume();
    this.playBgMusic();
    this.musicMap = {
      win: this.winMusic,
      coin: this.coinMusic,
      jump: this.jumpMusic,
      button: this.buttonMusic,
      whatcar: this.whatcarMusic,
      broken: this.brokenMusic,
      foollose: this.foolloseMusic,
      lose: this.loseMusic,
    };
  }

  initVolume() {
    const volumeStr = cc.sys.localStorage.getItem("userVolume");
    const volume = volumeStr ? JSON.parse(volumeStr) : { bg: true, once: true };
    if (!volumeStr) {
      cc.sys.localStorage.setItem("userVolume", JSON.stringify(volume));
    }
    this.bgStatus = volume.bg;
    this.onceStatus = volume.once;
  }

  playOnceMusic(key: onceKey) {
    if (this.musicMap.hasOwnProperty(key)) {
      if (this.onceStatus) {
        cc.audioEngine.play(this.musicMap[key], false, 0.5);
      }
    }
  }

  playOnceMusicEvt(evt) {
    const data = evt.getUserData();

    if (data.hasOwnProperty(data.key)) {
      this.playOnceMusic(data.key);
    }
  }

  playBgMusic() {
    if (this.bgStatus) {
      if (typeof this.bgMusicChannel == "undefined") {
        this.bgMusicChannel = cc.audioEngine.play(this.bgMusic, true, 0.5);
      } else {
        cc.audioEngine.resume(this.bgMusicChannel);
      }
    }
  }

  stopBgMusic() {
    if (this.bgMusicChannel !== undefined) {
      cc.audioEngine.pause(this.bgMusicChannel);
    }
  }

  getBgMusicStatus() {
    if (this.bgMusicChannel !== undefined) {
      return (
        cc.audioEngine.getState(this.bgMusicChannel) ==
        cc.audioEngine.AudioState.PLAYING
      );
    }
    return false;
  }

  checkBgMusicStatus(status: boolean) {
    if (this.bgStatus != status) {
      this.bgStatus = status;
      this.updateStorageVolume("bg", status);
      status ? this.playBgMusic() : this.stopBgMusic();
    }
  }

  checkOnceMusicStatus(status: boolean) {
    if (this.onceStatus != status) {
      this.onceStatus = status;
      this.updateStorageVolume("once", status);
    }
  }

  updateStorageVolume(key: "bg" | "once", value: boolean) {
    const volume = JSON.parse(cc.sys.localStorage.getItem("userVolume"));
    if (volume[key] != value) {
      volume[key] = value;
      cc.sys.localStorage.setItem("userVolume", JSON.stringify(volume));
    }
  }
}
