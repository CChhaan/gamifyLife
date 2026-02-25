<template>
  <view class="cover">
    <view v-if="ready" class="ready flex flex-col w-full flex-justify__around">
      <view class="rule">在规定时间内接住尽可能多的球！</view>
      <button class="begin-btn" @click="gameStart">开始游戏</button>
    </view>

    <view class="flex">
      <div class="close" @click="cancelGame">退出游戏</div>
    </view>
    <view class="game-date flex flex-justify__between" v-if="!ready">
      <view>得分：{{ count }}</view>
      <view>时间：{{ time }}</view>
    </view>
    <view
      v-for="ball in balls"
      :key="ball.id"
      class="ball"
      :style="{ left: ball.x + '%', top: ball.y + '%' }"
      @click="clickBall(ball.id)"
    ></view>
    <view
      v-if="end"
      class="game-over flex flex-col w-full flex-justify__around"
    >
      游戏结束！ 共接住{{ count }}个球！
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref } from "vue";

const emits = defineEmits<{
  (e: "win", count: number): Promise<void>;
  (e: "close"): void;
}>();
const ready = ref(true);
const end = ref(false);

const count = ref(0);
const time = ref(10); // 游戏时间
let timer: any = null;
const gameStart = () => {
  ready.value = false;
  end.value = false;
  count.value = 0;
  time.value = 5;
  balls.value = [];

  // 开始倒计时
  timer = setInterval(() => {
    time.value--;
    if (time.value <= 0) {
      clearInterval(timer);
      clearInterval(ballTimer);
      balls.value = [];
      end.value = true;
      setTimeout(() => {
        emits("win", count.value);
      }, 2000);
    }
  }, 1000);

  // 开始生成球体
  ballTimer = setInterval(createBall, 500); // 每500毫秒生成一个新球

  // 开始更新球体位置
  requestAnimationFrame(updateBalls);
};

// 添加球体相关的状态
const balls = ref<
  Array<{ id: number; x: number; y: number; angle: number; speed: number }>
>([]);
let ballTimer: any = null;
let ballIdCounter = 0;

// 创建新球
const createBall = () => {
  const angle = Math.random() * 360; // 随机角度
  const speed = Math.random(); // 随机速度
  balls.value.push({
    id: ballIdCounter++,
    x: 50 + (Math.random() * 20 - 10), // 百分比位置，初始在中心
    y: 50 + (Math.random() * 20 - 10),
    angle,
    speed,
  });
};

// 更新球的位置
const updateBalls = () => {
  balls.value = balls.value.filter((ball) => {
    // 根据角度和速度计算新位置
    const radians = (ball.angle * Math.PI) / 180;
    ball.x += Math.cos(radians) * ball.speed;
    ball.y += Math.sin(radians) * ball.speed;

    // 检查球是否超出屏幕边界
    return ball.x >= 0 && ball.x <= 100 && ball.y >= 0 && ball.y <= 100;
  });

  // 使用 requestAnimationFrame 持续更新
  requestAnimationFrame(updateBalls);
};

// 点击球体
const clickBall = (ballId: number) => {
  balls.value = balls.value.filter((ball) => ball.id !== ballId);
  count.value++;
};

const cancelGame = () => {
  if (timer) clearInterval(timer);
  if (ballTimer) clearInterval(ballTimer);
  balls.value = [];
  emits("close");
};
</script>

<style lang="scss" scoped>
.cover {
  background-color: transparent;
  z-index: 30;
}

.close {
  position: absolute;
  top: 30rpx;
  left: 30rpx;
  z-index: 31;
  padding: 10rpx 20rpx;
  background-color: var(--primary-color);
  font-size: var(--fontSize-big);
  box-shadow: var(--shadow);
  color: #fff;
  border-radius: 8rpx;
}

.ready {
  height: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 31;

  background-color: #fffa;

  .rule {
    font-size: 50rpx;
    font-weight: bolder;
    color: var(--primary-color);
    text-align: center;
  }

  .begin-btn {
    padding: 0 40rpx;
    background-color: var(--primary-color);
    color: #fff;
    font-size: var(--fontSize-large);
    border-radius: 8rpx;
    box-shadow: var(--shadow);
  }
}

.game-date {
  width: 50%;
  position: absolute;
  top: 30rpx;
  right: 30rpx;
  z-index: 31;
  font-size: var(--fontSize-big);
  font-weight: bolder;
}

.ball {
  width: 100rpx;
  height: 100rpx;
  background-color: #666;
  border-radius: 50%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 31;
}

.game-over {
  width: 120%;
  padding: 30rpx;
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 31;
  font-size: 50rpx;
  font-weight: bolder;
  background-color: var(--primary-color);
  border: 10rpx solid var(--secondary-color);
  border-left: 0;
  border-right: 0;
  color: #fff;
  text-align: center;
  transform: translate(-50%, -50%) rotate(5deg);
  animation: game-over 1s;
}

@keyframes game-over {
  0% {
    transform: translate(-100%, -100%) rotate(-5deg);
  }

  100% {
    transform: translate(-50%, -50%) rotate(5deg);
  }
}
</style>
