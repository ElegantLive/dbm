import { delay } from "../util/Common";
import CWorld from "./World";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Player extends cc.Component {
  @property(cc.Animation)
  anim: cc.Animation = null;

  @property()
  public maxSpeedV2: cc.Vec2 = new cc.Vec2(0, 0);

  @property({ type: cc.AudioClip })
  dieAudio: cc.AudioClip = null;

  @property({ type: cc.AudioClip })
  jumpAudio: cc.AudioClip = null;

  @property({ type: cc.AudioClip })
  player_decrease_Audio: cc.AudioClip = null;

  @property({ type: cc.AudioClip })
  hit_block_Audio: cc.AudioClip = null;

  @property()
  jumpSpeed: number = 0;

  public _life: number = 1;
  public _direction: number = 0;
  public _speed: cc.Vec2 = new cc.Vec2(0, 0);

  public collisionX: number = 0;
  public collisionY: number = 0;

  public isDead: boolean = false; // 死亡
  public isHunker: boolean = false; // 闲置
  public isJumping: boolean = false; // 跃起
  public isFallDown: boolean = true; // 掉落

  private jumpCount: number = 0; // 默认无跳跃
  private touchingNumber: number = 0; // 默认无触碰
  private win: boolean = false;
  private lose: boolean = false;
  private isWallCollisionCount: number = 0;
  private buttonIsPressed: boolean = false; // 是否按下按键 ｜ 是否操纵

  private winTween = null;

  // LIFE-CYCLE CALLBACKS:

  public static _instance: Player = null;
  public static getInstance() {
    if (!this._instance) {
      this._instance = new Player();
    }
    return this._instance;
  }

  onLoad() {
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  onDestroy() {
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
    cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
  }

  start() {}

  onKeyDown(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
        this.playerLeft();
        break;
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.playerRight();
        break;
      case cc.macro.KEY.w:
      case cc.macro.KEY.up:
        this.playerUp();
        break;
      case cc.macro.KEY.down:
      case cc.macro.KEY.s:
        this.playerDown();
        break;
    }
  }

  onKeyUp(event) {
    switch (event.keyCode) {
      case cc.macro.KEY.a:
      case cc.macro.KEY.left:
      case cc.macro.KEY.d:
      case cc.macro.KEY.right:
        this.noLRControlPlayer();
        break;
      case cc.macro.KEY.up:
      case cc.macro.KEY.w:
        this.noUpControlPlayer();
        break;
      case cc.macro.KEY.s:
      case cc.macro.KEY.down:
        this.noDownControlPlayer();
        break;
    }
  }

  noDownControlPlayer() {
    if (this.touchingNumber === 0) {
      return;
    }
    if (!this.isDead) {
      if (this._direction !== 0) {
        // this.player_walk();
      } else {
        // this.player_idle();
      }
      this.isHunker = false;
    }
  }

  noLRControlPlayer() {
    this._direction = 0;
    if (!this.isDead && this.jumpCount == 0) {
      //jumpCount 跳跃次数 落地为0 落地之后才可以再跳
      // this.player_idle();
    }
    this.buttonIsPressed = false;
  }

  noUpControlPlayer() {
    this.isJumping = true;
  }

  playerLeft() {
    if (this.win || this.isDead) return;
    if (this._direction !== -1 && this.jumpCount == 0 && !this.isDead) {
      // this.player_walk();
    }
    this.buttonIsPressed = true;
    this.turnLeft();
    this._direction = -1;
  }

  playerRight() {
    if (this.win || this.isDead) return;
    if (this._direction !== 1 && this.jumpCount == 0 && !this.isDead) {
      // this.player_walk();
    }
    this.buttonIsPressed = true;
    this.turnRight();
    this._direction = 1;
  }

  playerUp() {
    if (!this.isJumping && this.jumpCount == 0 && !this.isDead) {
      // 如果活着的没在跳跃状态，并且玩家着地
      // this.player_jump();
      this._speed.y = this.jumpSpeed;
      this.isJumping = true;
      this.isHunker = false;
      this.jumpCount++;
    }
  }

  playerDown() {
    if (this.touchingNumber === 0) {
      return;
    }
    if (!this.isHunker && !this.isDead) {
      // this.player_hunker();
      this.isHunker = true;
    }
  }

  turnLeft() {
    this.node.scaleX = -Math.abs(this.node.scaleX);
  }

  turnRight() {
    this.node.scaleX = Math.abs(this.node.scaleX);
  }

  onCollisionEnter(other: cc.Collider, self: cc.Collider) {
    switch (other.tag) {
      case 1:
        this.onCollisionEnterByPrincess(other, self);
        break;
      case 2:
        this.onCollisionEnterByBlock(other, self);
        break;
      default:
        break;
    }
  }

  onCollisionEnterByPrincess(other: cc.Collider, self: cc.Collider) {
    this.touchingNumber++; // 增加触碰
    this.jumpCount = 0; // 清除跳跃
    this.dispatchSuccess();
  }

  onCollisionEnterByBlock(other: cc.Collider, self: cc.Collider) {
    // 碰到地板，砖头
    this.touchingNumber++; // 增加触碰
    this.jumpCount = 0; // 清除跳跃
    if (this.isJumping) {
      this.isJumping = false;
      this.isFallDown = true;
    }
    if (this.isFallDown) {
      this.isFallDown = false;
      this.isHunker = true;
      const ws = other.node.convertToWorldSpaceAR(cc.v2(0, 0));
      const pos = self.node.parent.convertToNodeSpaceAR(ws);
      this.node.y = (other.node.height + self.node.height) / 2 + pos.y;
      this._speed.y = 0;
    }
    if (this.isHunker) {
      return;
    }
  }

  onCollisionExit(other: cc.Collider, self: cc.Collider) {
    this.touchingNumber--; // 取消一个触碰
  }

  async dieJump() {
    if (this.isDead) return;
    cc.director.getCollisionManager().enabled = false;
    // cc.audioEngine.play(this.dieAudio, false, 1);
    // this.anim.play("player_die");
    this._speed.y = this.jumpSpeed;
    this.touchingNumber = 0;
    this.isDead = true;
    this._life = 0;
    // this.node.parent.getComponent("camera").isRun = false;
    await delay(2000);
    cc.director
      .getScene()
      .getChildByName("Canvas")
      .getComponent("Game")
      .dispatchFailure(); //dispatchSuccess
    this.node.destroy();
  }

  dispatchSuccess() {
    if (!this.winTween) {
      const princess = cc.find("Canvas/Princess");
      this.winTween = cc
        .tween(this.node)
        .to(0.1, { y: princess.y })
        .call(() => {
          this.win = true;
          this.noUpControlPlayer();
          this.noDownControlPlayer();
          this.noLRControlPlayer();
          cc.director
            .getScene()
            .getChildByName("Canvas")
            .getComponent("Game")
            .dispatchSuccess();
          cc.log("win");
        })
        .start();
    }
  }

  update(dt) {
    // cc.log(
    //   this.isFallDown,
    //   this.isJumping,
    //   this.isHunker,
    //   this.jumpCount,
    //   this.touchingNumber,
    //   this._speed,
    //   this.node.x,
    //   this.node.y
    // );

    // 游戏胜利或者失败直接取消更新
    if (this.win || this.lose) return;

    if (this.node.y < -cc.winSize.height / 2 && !this.isDead) {
      this.dieJump();
    }
    // y
    if (this.isFallDown || this.isJumping || this.touchingNumber < 1) {
      //  自由下落
      this._speed.y += CWorld.G * dt;
      if (Math.abs(this._speed.y) > this.maxSpeedV2.y) {
        this._speed.y =
          this._speed.y > 0 ? this.maxSpeedV2.y : -this.maxSpeedV2.y;
      }
      if (this._speed.y < 0 && this.isJumping && !this.isFallDown) {
        this.isFallDown = true;
      }
    }

    // x

    if (this._direction === 0) {
      // 刹车
      if (this._speed.x > 0) {
        this._speed.x -= CWorld.WalkA * dt;
        if (this._speed.x <= 0) this._speed.x = 0;
      } else if (this._speed.x < 0) {
        this._speed.x += CWorld.WalkA * dt;
        if (this._speed.x >= 0) this._speed.x = 0;
      }
    } else {
      this._speed.x += (this._direction > 0 ? 1 : -1) * CWorld.WalkA * dt;
      if (Math.abs(this._speed.x) > this.maxSpeedV2.x) {
        this._speed.x =
          this._speed.x > 0 ? this.maxSpeedV2.x : -this.maxSpeedV2.x;
      }
    }

    // if (this._speed.x * this.collisionX > 0) {
    //   this._speed.x = 0;
    // }

    this.node.x += this._speed.x * dt * CWorld.AddSpeed;
    this.node.y += this._speed.y * dt;
  }
}
