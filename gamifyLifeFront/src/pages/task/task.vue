<template>
  <view class="task-page">
    <view class="banner">
      <button size="mini">标签管理</button>
      <button size="mini">分类管理</button>
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
        <text class="task-category-item-text">健身目标</text>
      </view>
    </view>
    <view class="task-list">
      <view class="timeFilter">
        <view class="time">全部</view>
        <view class="time">昨天</view>
        <view class="time selected">今天</view>
        <view class="time">明天</view>
        <view class="time">本周</view>
        <view class="time">本月</view>
        <view class="time">本年</view>
        <view class="time">本年</view>
      </view>
      <view class="tasks">
        <view class="task-item" v-for="n in 10" :key="n">
          <radio style="transform: scale(0.7)" borderColor="#aaa" />
          <view class="task-detail">
            <view class="task-info">
              <text class="task-title">完成 Vue 3 学习</text>
              <view class="task-tag">前端学习</view>
            </view>
            <view class="task-reward">
              <view class="reward">exp: 133</view>
              <view class="reward">$133</view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <view class="add-task">
      <button>+</button>
    </view>
  </view>
</template>

<script setup lang="ts"></script>

<style scoped lang="scss">
.task-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-bottom: 140rpx;
  background-color: var(--background-color);
}

.banner {
  width: 100%;
  height: 100rpx;
  background-color: var(--third-color);
  display: flex;
  align-items: center;
  padding: 0 20rpx;
  button {
    margin: 0 10rpx;
  }
}

.task-category {
  width: calc(100% - 50rpx);
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: auto;
  gap: 15rpx;
  padding: 30rpx 0;
  // margin: 30rpx 0;

  .task-category-item {
    background-color: #fcfcfc;
    border-radius: 50rpx;
    font-size: 28rpx;
    box-shadow: 0 6rpx 10rpx #ccc;
    padding: 15rpx 30rpx;
  }

  .task-category-item-text {
    white-space: nowrap;
  }

  .selected {
    background-color: var(--primary-color);
    color: #fff;
  }

  .more {
    background-color: #d0d0d0;
  }
}
.task-list {
  width: calc(100% - 50rpx);
  background-color: #fff;
  border-radius: 40rpx;
  box-shadow: 0 6rpx 10rpx #ccc;
  padding: 20rpx;
  height: calc(100vh - 390rpx);
  overflow: auto;
  .timeFilter {
    width: 100%;
    font-size: 28rpx;
    color: #999;
    margin-bottom: 30rpx;
    display: flex;
    overflow: auto;
    font-size: 32rpx;
    justify-content: space-between;
    border-bottom: 2rpx solid #eee;
    .time {
      padding: 5rpx 20rpx 10rpx;
      white-space: nowrap;
    }
    .selected {
      color: var(--primary-color);
      border-bottom: 6rpx solid var(--primary-color);
    }
  }
  .task-item {
    display: flex;
    font-size: 32rpx;
    margin-bottom: 30rpx;
  }
  .tasks {
    height: calc(100% - 85rpx);
    overflow: auto;

    .task-info,
    .task-reward {
      display: flex;
      align-items: center;
      margin-left: 10rpx;
    }
    .task-tag {
      margin-left: 20rpx;
      padding: 5rpx 10rpx;
      border-radius: 10rpx;
      font-size: 24rpx;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--third-color);
      color: #fff;
    }
    .reward {
      margin-right: 15rpx;

      border-radius: 10rpx;
      font-size: 28rpx;
      color: var(--third-color);
    }
  }
}
.add-task {
  position: fixed;
  bottom: 200rpx;
  right: 50rpx;
  button {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    background-color: var(--primary-color);
    color: #fff;
    font-size: 40rpx;
    font-weight: bold;
  }
}
</style>
