<template>
  <view class="community tab-page flex flex-col">
    <view
      class="community_banner flex w-full flex-shrink-0 flex-justify__between"
    >
      <button size="mini">发布动态</button>
      <view class="header-title">社区中心</view>
      <button size="mini">通知</button>
    </view>
    <view class="community_main w-full">
      <view class="community_main-tabbar flex flex-justify__between">
        <view class="tab-item flex-1 selected">热门</view>
        <view class="tab-item flex-1">最新</view>
        <view class="tab-item flex-1">我的帖子</view>
      </view>
      <view class="community_main-posts">
        <view v-for="item in 10" :key="item" class="post-item">
          <view class="poster-info flex">
            <view class="poster-avatar">
              <image class="img" src="/static/images/avatar.png" />
            </view>
            <view class="poster-name">发布者昵称</view>
          </view>
          <view class="post-header"> 帖子标题 </view>
          <view class="post-data">
            <view class="post-time">发布时间：2023-08-15 10:00:00</view>
            <view class="comment">
              <view class="like">点赞数：123</view>
              <view class="hate">点踩数：45</view>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
.community {
  overflow: auto;

  &_banner {
    height: 100rpx;
    background-color: var(--primary-color);
    padding: 0 20rpx;

    button {
      margin: 0 10rpx;
    }
  }

  &_main {
    overflow: auto;

    &-tabbar {
      background-color: var(--bg-color);

      .tab-item {
        padding: 20rpx 0;
        font-size: var(--fontSize-normal);
        font-weight: bold;
        color: #000;
        text-align: center;
      }

      .selected {
        background-color: var(--contrast-color);
        color: #fff;
      }
    }
  }
}

.header-title {
  font-size: var(--fontSize-large);
  font-weight: bold;
  color: #fff;
}

// .post-item {
//   width: 100%;
//   padding-bottom: 20rpx;
// }

// .poster-avatar {
//   width: 50rpx;
//   height: 50rpx;
//   border-radius: 50%;
//   background-color: #fde;
//   margin-right: 20rpx;
// }
</style>
