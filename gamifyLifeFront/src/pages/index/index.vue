<template>
  <view class="content">
    <view class="card personal-data">
      <view class="info">
        <view class="left">
          <view class="avatar">
            <image class="avatar-img"
              src="https://p9-passport.byteacctimg.com/img/mosaic-legacy/3796/2975850990~120x256.image"
              mode="scaleToFill" />
          </view>
          <view class="center">
            <view class="username">
              <text class="username-text">用户名用户名用户名</text>
            </view>
            <view class="level">
              <text>Lv. 16</text>
            </view>
          </view>
        </view>
        <view class="more">
          <button size="mini" plain="true" class="personal-more">
            查看详情
          </button>
        </view>
      </view>
      <view class="exp">
        <view class="data">
          <view class="exp-data">
            <text> exp: 1000/2000 </text>
          </view>
          <view class="gold-data">
            <text> $ 200 </text>
          </view>
        </view>
        <view class="exp-line">
          <view class="now"></view>
        </view>
      </view>
      <view class="attr-data">
        <view class="attr-item">
          <view class="attr-item-name">
            <image src="/static/imgs/brain.png" class="attr-item-icon" />
            <text>心智</text>
          </view>
          <text>20</text>
        </view>
        <view class="attr-item">
          <view class="attr-item-name">
            <image src="/static/imgs/strength.png" class="attr-item-icon" />
            <text>体魄</text>
          </view>
          <text>20</text>
        </view>
        <view class="attr-item">
          <view class="attr-item-name">
            <image src="/static/imgs/communication.png" class="attr-item-icon" />
            <text>社交</text>
          </view>
          <text>20</text>
        </view>
        <view class="attr-item">
          <view class="attr-item-name">
            <image src="/static/imgs/hourglass.png" class="attr-item-icon" />
            <text>自律</text>
          </view>
          <text>20</text>
        </view>
      </view>
    </view>
    <view class="task-category">
      <view class="task-category-item selected">
        <text class="task-category-item-text">编程学习编程</text>
      </view>
      <view class="task-category-item">
        <text class="task-category-item-text">学业任务</text>
      </view>
      <view class="task-category-item">
        <text class="task-category-item-text">每日任务</text>
      </view>
      <view class="task-category-item">
        <text class="task-category-item-text">健身目标</text>
      </view>
      <view class="task-category-item">
        <text class="task-category-item-text">更多</text>
      </view>
    </view>
    <view class="card task-data">
      <view class="tasks">
        <view class="task-item">
          <text class="task-item-text">完成 Vue 3 学习完成 Vue 3 学习 完成 Vue 3 学习</text>
          <radio style="transform: scale(0.7)" borderColor="#aaa" />
        </view>
        <view class="task-item">
          <text class="task-item-text">完成 Vue 3 学习</text>
          <radio style="transform: scale(0.7)" borderColor="#aaa" />
        </view>
        <view class="task-item">
          <text class="task-item-text">完成 Vue 3 学习</text>
          <radio style="transform: scale(0.7)" borderColor="#aaa" />
        </view>
        <view class="task-item">
          <text class="task-item-text">完成 Vue 3 学习</text>
          <radio style="transform: scale(0.7)" borderColor="#aaa" />
        </view>
        <view class="task-item">
          <text class="task-item-text">完成 Vue 3 学习</text>
          <radio style="transform: scale(0.7)" borderColor="#aaa" />
        </view>
      </view>
      <view class="more">
        <button size="mini" class="task-more">查看更多</button>
      </view>
    </view>
    <FloatPet />
  </view>
</template>

<script setup lang="ts">
import FloatPet from "@/components/FloatPet.vue/FloatPet.vue";
</script>

<style>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 140rpx;
  height: 100vh;
  background-color: #fef8e6;
}

.card {
  background-color: #fff;
  width: 85vw;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 10rpx #ccc;
  padding: 30rpx;
}

.personal-data {
  height: 35vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;

      .avatar {
        width: 120rpx;
        height: 120rpx;
        /* background-color: #fe7a24; */
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-img {
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;
        }
      }

      .center {
        margin-left: 30rpx;
        font-size: 36rpx;

        .username {
          .username-text {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 30vw;
            vertical-align: middle;
          }
        }
      }
    }

    .personal-more {
      border: 2rpx solid #888;
      padding: 0 0.75em;
      display: flex;
      align-items: center;
    }
  }

  .exp {
    width: 100%;

    .data {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10rpx;
      font-size: 28rpx;
    }

    .exp-line {
      width: 100%;
      background-color: #e2ecf8;
      height: 20rpx;
      border-radius: 10rpx;
      box-shadow: 0 2rpx 5rpx #ccc;

      .now {
        width: 50%;
        height: 100%;
        background-color: #fe7a24;
        border-radius: 10rpx;
      }
    }
  }

  .attr-data {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20rpx;

    .attr-item {
      /* font-size: 38rpx; */
      width: 47%;
      padding: 10rpx 20rpx;
      border-radius: 10rpx;
      box-shadow: 0 4rpx 10rpx #ccc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20rpx;

      .attr-item-name {
        display: flex;
        align-items: center;
        gap: 15rpx;

        .attr-item-icon {
          width: 45rpx;
          height: 45rpx;
        }
      }
    }
  }
}

.task-category {
  width: 85vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: auto;
  gap: 15rpx;
  padding: 20rpx 0;
  margin: 20rpx 0;

  .task-category-item {
    border-radius: 20rpx;
    background-color: #fcfcfc;
    border-radius: 20rpx;
    font-size: 28rpx;
    box-shadow: 0 6rpx 10rpx #ccc;
    padding: 20rpx;
  }

  .task-category-item-text {
    white-space: nowrap;
  }

  .selected {
    background-color: #fe7a24;
    color: #fff;
  }

  .more {
    background-color: #d0d0d0;
  }
}

.task-data {
  height: 35vh;
  /* box-shadow: inset 0 0 0 10rpx #fe7a24cc; */
  border-top: 14rpx solid #fe7a24cc;
  padding-top: 10rpx;
  padding-bottom: 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  .tasks {
    height: 80%;
    width: 100%;
    overflow: auto;
  }

  .task-item {
    padding: 20rpx;
    border-bottom: 2rpx solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .task-item-text {
      line-height: 1.5;
      white-space: nowrap;
      width: 85%;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;

      &::before {
        content: " ";
        display: inline-block;
        width: 10rpx;
        height: 28rpx;
        background-color: #fe7a24;
        margin-right: 20rpx;
      }
    }
  }

  .more {
    /* margin: 15rpx; */
    text-align: center;
    font-size: 28rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .task-more {
      background-color: #fe7a24;
      color: #fff;
      border-radius: 20rpx;
      font-size: 30rpx;
    }
  }
}
</style>
