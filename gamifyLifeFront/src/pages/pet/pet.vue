<template>
  <view class="pet-ctn">
    <view class="pet">
      <view class="img">
        <image src="../../static/pet_baby.png" mode="aspectFit" />
      </view>
      <view class="data">
        <view class="name">
          <view class="pet-name">宠物名称</view>
          <view class="tags">
            <view class="status">正常</view>
            <view class="stage">成长期</view>
          </view>
        </view>

        <view class="exp">
          <view class="exp-line">
            <view class="level">
              <view class="level-text">LV. 2</view>
            </view>
            <view class="exp-sum">
              <div class="prog">{{ 10 }}/{{ 100 }}</div>
              <view class="exp-now" :style="{ width: 10 + '%' }"></view>
            </view>
          </view>
        </view>
        <view class="other">
          <view class="hungry">饱食度 80/100</view>
          <view class="relation">亲密度 10/100</view>
        </view>
      </view>
      <view class="action">
        <view class="action-item">
          <span>喂食</span>
        </view>
        <view class="action-item">
          <span>洗澡</span>
        </view>
        <view class="action-item">
          <span>玩耍</span>
        </view>
      </view>
    </view>
  </view>
  <view class="go-back" @click="goBack">
    <button>
      <u-icon name="arrow-leftward"></u-icon>
      <span style="margin-left: 5rpx">返回首页</span>
    </button>
  </view>
</template>

<script setup lang="ts">
const goBack = () => {
  uni.switchTab({
    url: "/pages/index/index",
  });
};
</script>

<style scoped>
.pet-ctn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  overflow: auto;
  background-color: var(--bg-second-color);
}

.go-back {
  position: fixed;
  top: 16rpx;
  left: 15rpx;
  z-index: 20;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80rpx;
    border-radius: 20rpx;
    background-color: var(--primary-color);
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: 40rpx;
    font-weight: bold;
  }
}

.pet {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.data {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;

  .name {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 40rpx;
    font-weight: bold;

    .tags {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10rpx;
    }

    .status {
      margin-left: 20rpx;
      padding: 5rpx 10rpx;
      font-size: 30rpx;
      font-weight: normal;
      color: #fff;
      background-color: #4fd781;
      border-radius: 10rpx;
      margin-right: 20rpx;
    }

    .stage {
      padding: 5rpx 10rpx;
      font-weight: normal;
      font-size: 30rpx;

      color: #fff;
      background-color: var(--primary-color);
      border-radius: 10rpx;
    }
  }

  .exp {
    width: 100%;
    margin: 20rpx 0;

    .exp-line {
      width: 100%;
      display: flex;
      align-items: center;

      .level {
        background-color: var(--primary-color);
        color: #fff;
        border-radius: 20rpx;
        padding: 5rpx 15rpx;
        font-size: 30rpx;
        font-weight: bold;
        margin-right: -10rpx;
        z-index: 5;
      }

      .exp-sum {
        flex: 1;
        height: 30rpx;
        background-color: #ffe;
        border-radius: 15rpx;
        border: 2rpx solid #ccc;
        position: relative;
        overflow: hidden;

        .prog {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 28rpx;
          color: #888;
        }

        .exp-now {
          height: 100%;
          background-color: var(--third-color);
        }
      }
    }
  }

  .other {
    width: 100%;
    display: flex;
    justify-content: space-around;
  }
}

.action {
  display: flex;
  justify-content: space-around;
  width: 100%;
  margin-top: 50rpx;

  .action-item {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10rpx 40rpx;
    border-radius: 10rpx;
    background-color: var(--contrast-color);
    box-shadow: 0 0 10rpx rgba(0, 0, 0, 0.2);
    color: #fff;
    font-size: 40rpx;
    font-weight: bold;
  }
}
</style>
