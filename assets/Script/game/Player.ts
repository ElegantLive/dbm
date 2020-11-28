import CWorld from "./World";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

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
  public isHunker: boolean = true; // 闲置
  public isJumping: boolean = false; // 跃起
  public isFallDown: boolean = false; // 掉落

  private jumpCount: number = 0; // 默认无跳跃
  private touchingNumber: number = 0; // 默认无触碰
  private isWallCollisionCount: number = 0;
  private buttonIsPressed: boolean = false; // 是否按下按键 ｜ 是否操纵

  // LIFE-CYCLE CALLBACKS:

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
    if (this._direction !== -1 && this.jumpCount == 0 && !this.isDead) {
      // this.player_walk();
    }
    this.buttonIsPressed = true;
    this.turnLeft();
    this._direction = -1;
  }

  playerRight() {
    if (this._direction !== 1 && this.jumpCount == 0 && !this.isDead) {
      // this.player_walk();
    }
    this.buttonIsPressed = true;
    this.turnRight();
    this._direction = 1;
  }

  playerUp() {
    console.log("this.isJumping: " + this.isJumping);
    console.log("this.jumpCount: " + this.jumpCount);
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
    }
    if (this.isHunker) {
      return;
    }
  }

  onCollisionExit(other: cc.Collider, self: cc.Collider) {
    this.touchingNumber--; // 取消一个触碰
  }

  turnDown() {
    this.touchingNumber = 0;
    this.isFallDown = true;
    this.isJumping = false;
    this.jumpCount = 0;
  }

  update(dt) {
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
    if (this.isHunker) {
      this._speed.y = 0;
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
