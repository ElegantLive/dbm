import { delay } from "../util/Common";
import CWorld from "./World";

const { ccclass, property } = cc._decorator;

type PlayerAnimationMapKey =
  | "player_run"
  | "player_die"
  | "player_stand"
  | "player_fall"
  | "player_jump";

@ccclass
export default class Player extends cc.Component {
  @property()
  public maxSpeedV2: cc.Vec2 = new cc.Vec2(0, 0);

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

  private jumpCount: boolean = false; // 默认无跳跃
  // private touchingNumber: boolean = false; // 默认无触碰
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
    if (this.win || this.isDead) return;
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
    if (this.win || this.isDead) return;
    if (!this.touchingNumber) {
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
    if (this.win || this.isDead) return;
    this._direction = 0;
    this.animationPlay("player_stand");
    if (!this.isDead && !this.jumpCount) {
      //jumpCount 跳跃次数 落地为0 落地之后才可以再跳
      // this.player_idle();
    }
    this.buttonIsPressed = false;
  }

  noUpControlPlayer() {
    if (this.win || this.isDead) return;
    this.isJumping = true;
  }

  playerLeft() {
    if (this.win || this.isDead) return;
    if (this._direction !== -1 && !this.jumpCount && !this.isDead) {
      // this.player_walk();
      this.animationPlay("player_run");
    }
    this.buttonIsPressed = true;
    this.turnLeft();
    this._direction = -1;
  }

  playerRight() {
    if (this.win || this.isDead) return;
    if (this._direction !== 1 && !this.jumpCount && !this.isDead) {
      // this.player_walk();
      this.animationPlay("player_run");
    }
    this.buttonIsPressed = true;
    this.turnRight();
    this._direction = 1;
  }

  playerUp() {
    if (this.win || this.isDead) return;
    if (!this.isJumping && !this.jumpCount && !this.isDead) {
      // 如果活着的没在跳跃状态，并且玩家着地
      this.animationPlay("player_jump");
      this._speed.y = this.jumpSpeed;
      this.isJumping = true;
      this.isHunker = false;
      this.jumpCount = true;
    }
  }

  playerDown() {
    if (this.win || this.isDead) return;
    if (!this.touchingNumber) {
      return;
    }
    if (!this.isHunker && !this.isDead) {
      // this.player_hunker();
      this.isHunker = true;
    }
  }

  animationPlay(key: PlayerAnimationMapKey) {
    const anim = this.node.getComponent(cc.Animation);

    anim.pause();
    anim.play(key);
  }

  turnLeft() {
    this.node.scaleX = -Math.abs(this.node.scaleX);
  }

  turnRight() {
    this.node.scaleX = Math.abs(this.node.scaleX);
  }

  onBeginContact(
    contact: cc.PhysicsContact,
    self: cc.BoxCollider,
    other: cc.BoxCollider
  ) {
    switch (other.tag) {
      case 6:
        // 直接死亡
        this.onCollisionEnterByHorrible(other, self);
        break;
      default:
        break;
    }
  }

  onCollisionEnter(other: cc.BoxCollider, self: cc.BoxCollider) {
    switch (other.tag) {
      case 1:
        this.onCollisionEnterByPrincess(other, self);
        break;
      case 2:
        this.onCollisionEnterByBlock(other, self);
        break;
      case 3:
        this.onCollisionEnterByBlockReward(other, self);
        break;
      case 4:
        this.onCollisionEnterByReward(other, self);
        break;
      case 5:
        this.onCollisionEnterBytricker(other, self);
        break;
      case 6:
        // 直接死亡
        this.onCollisionEnterByHorrible(other, self);
        break;
      case 7:
        // 不受力死亡
        this.onCollisionEnterByNation(other, self);
        break;
      default:
        break;
    }
  }
  onCollisionEnterByNation(other: cc.BoxCollider, self: cc.BoxCollider) {
    cc.director.getCollisionManager().enabled = false;
  }
  onCollisionEnterBytricker(other: cc.BoxCollider, self: cc.BoxCollider) {
    other.node.opacity = 255;
    this.dieJump();
  }

  onCollisionEnterByHorrible(other: cc.BoxCollider, self: cc.BoxCollider) {
    this.dieJump();
  }

  onCollisionEnterByPrincess(other: cc.BoxCollider, self: cc.BoxCollider) {
    // this.touchingNumber = true; // 增加触碰
    this.touchingNumber++;
    this.dispatchSuccess();
  }

  onCollisionEnterByBlock(other: cc.BoxCollider, self: cc.BoxCollider) {
    // 碰到地板，砖头
    // this.touchingNumber = true; // 增加触碰
    this.touchingNumber++;
    this.jumpCount = false; // 清除跳跃

    var otherAabb = other.world.aabb;
    // 上一次计算的碰撞组件的 aabb 碰撞框
    var otherPreAabb = other.world.preAabb.clone();
    var selfAabb = self.world.aabb;
    var selfPreAabb = self.world.preAabb.clone();
    selfPreAabb.x = selfAabb.x;
    otherPreAabb.x = otherAabb.x;

    if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
      if (this._speed.x > 0 && selfPreAabb.xMax > otherPreAabb.xMin) {
        // this.collisionX = 1;
        // this._speed.x == 0;
      }

      if (this._speed.x < 0 && selfPreAabb.xMin < otherPreAabb.xMax) {
        // this.collisionX = -1;
        // this._speed.x == 0;
      }
    }
    selfPreAabb.y = selfAabb.y;
    otherPreAabb.y = otherAabb.y;
    // if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
    //   if (
    //     this._speed.y < 0 &&
    //     (selfPreAabb.yMax < otherPreAabb.yMax ||
    //       selfPreAabb.yMin < otherPreAabb.yMin)
    //   ) {
    //     const pre = selfPreAabb.xMax < otherPreAabb.xMax ? 0.2 : -0.2;
    //     const ws = other.node.convertToWorldSpaceAR(cc.v2(0, 0));
    //     const pos = self.node.parent.convertToNodeSpaceAR(ws);
    //     this.node.x = (other.node.width + self.node.width) / 2 + pos.x - pre;
    //   }
    // }

    if (this.isFallDown) {
      this.isJumping = false;
      this.isFallDown = false;
      this.isHunker = true;
      this.animationPlay("player_stand");
      const ws = other.node.convertToWorldSpaceAR(cc.v2(0, 0));
      const pos = self.node.parent.convertToNodeSpaceAR(ws);
      // this.node.y = (other.node.height + self.node.height) / 2 + pos.y - 0.1;
      if (cc.Intersection.rectRect(selfPreAabb, otherPreAabb)) {
        if (this._speed.y < 0 && selfPreAabb.yMin > otherPreAabb.yMin) {
          this._speed.y = 0;
        }
      }
    }
    if (this.isJumping) {
      this.isJumping = false;
      this.isFallDown = true;
      this.animationPlay("player_jump");
      this._speed.y = -this._speed.y;
    }
    if (this.isHunker) {
      return;
    }
  }

  onCollisionEnterByBlockReward(other: cc.BoxCollider, self: cc.BoxCollider) {
    const sc = other.node.getComponent("CollisionReward");
    if (sc) {
      if (this.isJumping) {
        sc.dispachGot();
      }
    }
    this.onCollisionEnterByBlock(other, self);
  }

  onCollisionEnterByReward(other: cc.BoxCollider, self: cc.BoxCollider) {
    const sc = other.node.getComponent("CollisionReward");
    if (sc) {
      sc.dispachGot();
    }
  }

  onCollisionExit(other: cc.BoxCollider, self: cc.BoxCollider) {
    const map = [1, 2, 3];
    // 清除穿模限制
    this.collisionX = 0;
    this.collisionY = 0;
    if (map.indexOf(other.tag) > -1) {
      // this.touchingNumber = false;
      this.touchingNumber--;
    }
  }

  async dieJump() {
    if (this.isDead) return;
    this.animationPlay("player_die");
    cc.director.getCollisionManager().enabled = false;
    // cc.audioEngine.play(this.dieAudio, false, 1);
    // this.anim.play("player_die");
    this._speed.y = this.jumpSpeed;
    // this.touchingNumber = false;
    this.touchingNumber--;
    this.isHunker = false;
    this.isFallDown = true;
    this.isJumping = false;
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
      this.animationPlay("player_stand");
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
    // 游戏胜利或者失败直接取消更新
    if (this.win || this.lose) return;

    if (this.node.y < -(cc.winSize.height / 2 + 100) && !this.isDead) {
      this.dieJump();
    }

    if (this.touchingNumber) {
    } else {
      // y
      if (this.isFallDown || this.isJumping || !this.touchingNumber) {
        //  自由下落
        this._speed.y += CWorld.G * dt;
        if (Math.abs(this._speed.y) > this.maxSpeedV2.y) {
          this._speed.y =
            this._speed.y > 0 ? this.maxSpeedV2.y : -this.maxSpeedV2.y;
        }
        if (this._speed.y < 0 && this.isJumping && !this.isFallDown) {
          this.isFallDown = true;
          this.isJumping = false;
          this.animationPlay("player_fall");
        }
        if (this.isHunker && this._speed.y < 0 && !this.isFallDown) {
          this.animationPlay("player_fall");
          this.isHunker = false;
          this.isFallDown = true;
          this.isJumping = false;
        }
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

    if (this._speed.x * this.collisionX > 0) {
      this._speed.x = 0;
    }

    this.node.x += this._speed.x * dt * CWorld.AddSpeed;
    this.node.y += this._speed.y * dt;
  }
}
