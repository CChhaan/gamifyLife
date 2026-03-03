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
            <view class="comment flex flex-justify__around">
              <view class="flex comment-item">
                <u-icon name="eye" class="comment-icon" />200
              </view>
              <view class="flex comment-item">
                <u-icon name="thumb-up" class="comment-icon" />123
              </view>
              <view class="flex comment-item">
                <u-icon name="thumb-down" class="comment-icon" />45
              </view>
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

    &-posts {
      .post-item {
        padding: 20rpx 30rpx;
        background-color: var(--bg-color);
        margin: 30rpx;
        border-radius: 20rpx;
        box-shadow: var(--shadow);
      }

      .poster-info {
        .poster-avatar {
          width: 50rpx;
          height: 50rpx;
          border-radius: 50%;
          background-color: pink;
        }
        .poster-name {
          margin-left: 20rpx;
          font-size: var(--fontSize-normal);
        }
      }

      .post-header {
        font-size: var(--fontSize-large);
        font-weight: bold;
        margin-top: 20rpx;
      }

      .post-data {
        .post-time {
          font-size: var(--fontSize-small);
        }
        .comment {
          padding-top: 10rpx;
          .comment-item {
            font-size: var(--fontSize-normal);
          }

          .comment-icon {
            margin-right: 10rpx;
            font-size: var(--fontSize-big);
          }
        }
      }
    }
  }
}

.header-title {
  font-size: var(--fontSize-large);
  font-weight: bold;
  color: #fff;
}
</style>
