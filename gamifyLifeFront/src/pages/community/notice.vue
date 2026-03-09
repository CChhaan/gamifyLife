<template>
  <view class="notice tab-page">
    <view class="title">通知</view>
    <view class="back flex" @click="$emit('close')">
      <u-icon name="arrow-left-double"></u-icon>
      <text class="back-text">返回</text>
    </view>
    <view class="notice_main w-full">
      <view class="notice_main-tabbar flex flex-justify__between">
        <view
          class="tab-item flex-1"
          :class="{ selected: selectedTab === '互动通知' }"
          @click="selectedTab = '互动通知'"
          >互动通知</view
        >
        <view
          class="tab-item flex-1"
          :class="{ selected: selectedTab === '系统通知' }"
          @click="selectedTab = '系统通知'"
          >系统通知</view
        >
      </view>
      <view class="posts">
        <view v-for="item in noticeList" :key="item.id" class="post-item">
          <view class="post-header">{{ item.title }}</view>
          <view class="post-data">
            <view class="post-time">
              创建时间：{{
                dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss")
              }}
            </view>
          </view>
          <view>类型：{{ PostTypeTextMap[item.post_type!] }}</view>
          <view class="flex flex-justify__end w-full">
            <button size="mini" @click="publishPost(item)">发布</button>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script lang="ts" setup>
import { Interaction } from "@/type/post";
import http from "@/utils/http";
import { computed, ref, watch } from "vue";

const selectedTab = ref("系统通知");

const noticeList = ref<Interaction>();
// 获取互动通知
const getUserInteractions = async () => {
  try {
    const res = await http.get("/postInteraction/userInteractions");
    noticeList.value = res;
  } catch (error) {
    console.log(error);
  }
};
watch(selectedTab, (newVal, oldVal) => {
  if (newVal === "系统通知") {
    uni.showToast({ title: "系统通知", icon: "success", duration: 2000 });
  } else if (newVal === "互动通知") {
    getUserInteractions();
  }
});
</script>

<style lang="scss" scoped>
.notice {
  padding: 20rpx 0;
  padding-bottom: 160rpx;
  position: fixed;
  z-index: 10;

  .title {
    font-size: var(--fontSize-large);
    font-weight: bold;
    text-align: center;
    margin-bottom: 30rpx;
  }

  .back {
    position: absolute;
    top: 25rpx;
    left: 25rpx;
    .back-text {
      margin-left: 10rpx;
      font-size: var(--fontSize-normal);
    }
  }
  .notice_main {
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
        color: var(--primary-color);
        border-bottom: 10rpx solid var(--primary-color);
      }
    }
  }
}
</style>
