<template>
  <view class="achievement flex flex-col">
    <view class="ach-title flex w-full flex-justify__between">
      <view class="flex-1 flex">
        <view class="go-back" @click="goBack">
          <button class="flex flex-justify__center">
            <u-icon name="arrow-leftward"></u-icon>
            <span style="margin-left: 5rpx">返回</span>
          </button>
        </view>
      </view>
      <view class="flex-1">成就</view>
      <view class="flex-1"></view>
    </view>
    <view class="ach-types w-full flex">
      <view
        class="ach-type-item flex flex-col flex-justify__center"
        v-for="(type, index) in AchievementType"
        :class="{ selected: index === selectedType }"
        :key="index"
        @click="selectedType = index"
      >
        <view class="ach-type-icon">
          <image
            class="img"
            src="/src/static/imgs/icons/trophy.png"
            mode="scaleToFill"
          />
        </view>
        <view class="ach-type-name">
          <text>{{ type }}</text>
        </view>
        <view class="count">
          {{ getAchievementsUnlockedCount(index) }} /
          {{ filterAchievementsByType(index).length }}
        </view>
      </view>
    </view>
    <view class="ach-list w-full">
      <view
        class="ach-item flex flex-justify__between"
        v-for="item in filterAchievementsByType(selectedType)"
        :key="item.id"
        v-if="filterAchievementsByType(selectedType).length > 0"
      >
        <view
          class="arc-icon"
          :class="{ locked: !isUnlocked(item) && !isGiftGot(item) }"
        >
          <image
            class="img"
            src="/src/static/imgs/icons/trophy.png"
            mode="scaleToFill"
          ></image>
        </view>
        <view class="ach-info flex-1">
          <view class="ach-name">
            <text>{{ item.title }}</text>
          </view>
          <view class="ach-desc">
            {{ item.description }}
          </view>
        </view>
        <view class="ach-opt flex">
          <view class="detail-btn" size="mini" @click="selectedItem = item"
            >详情</view
          >
          <view class="get-gift" v-if="isGiftGot(item)">
            <button>领取奖励</button>
          </view>
          <view class="checked" v-else-if="isUnlocked(item)">
            <u-icon name="checkbox-mark"></u-icon>
            以达成
          </view>
          <view class="unget" v-else>未达成</view>
        </view>
      </view>
      <view class="empty-list flex flex-justify__center" v-else>- 暂无 -</view>
    </view>
    <achDetail
      v-if="selectedItem"
      :item="selectedItem"
      @close="selectedItem = null"
    />
  </view>
</template>

<script setup lang="ts">
// 获取成就类型列表
import http from "@/utils/http";
import { type Achievement, AchievementType } from "@/type/achievement";
import achDetail from "./achDetail.vue";
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
const achievementList = ref<Achievement[] | null>(null);
const selectedType = ref<keyof typeof AchievementType>("TASK");
const selectedItem = ref<Achievement | null>(null);
// 获取所有成就
const getAllAchievements = async () => {
  try {
    const res = await http.get("/achievement");
    achievementList.value = res;
  } catch (error) {
    console.log("获取成就类型列表失败", error);
  }
};

// 根据分类获取对应的成就列表
const filterAchievementsByType = (type: keyof typeof AchievementType) => {
  if (!achievementList.value) return [];
  return achievementList.value.filter((item) => item.type === type);
};

// 获取成就列表中以达成的成就数量
const getAchievementsUnlockedCount = (type: keyof typeof AchievementType) => {
  if (!achievementList.value) return 0;
  return filterAchievementsByType(type).filter(isUnlocked).length;
};
onShow(() => {
  getAllAchievements();
});
const goBack = () => {
  const pages = getCurrentPages();
  if (pages.length > 1) {
    uni.navigateBack();
  } else {
    // 如果没有上一页，可以跳转到首页或其他指定页面
    uni.reLaunch({
      url: "/pages/index/index",
    });
  }
};
const isGiftGot = (item: Achievement) => {
  if (!item.userAchievements) return false;
  return item.userAchievements.some((userItem) => userItem.gift_got === 1);
};

const isUnlocked = (item: Achievement) => {
  if (!item.userAchievements) return false;
  return item.userAchievements.some((userItem) => userItem.is_unlocked === 1);
};
</script>

<style scoped lang="scss">
.achievement {
  height: 100vh;
  background-color: var(--bg-color-page);
}

.ach-title {
  font-size: var(--fontSize-large);
  font-weight: bold;
  text-align: center;
  padding: 20rpx;

  .go-back {
    button {
      height: 60rpx;
      border-radius: 20rpx;
      background-color: var(--primary-color);
      box-shadow: var(--shadow);
      color: #fff;
      font-size: var(--fontSize-normal);
      font-weight: bold;
    }
  }
}

.ach-types {
  overflow-x: auto;
  padding: 5rpx 20rpx;
  height: 250rpx;
  .ach-type-item {
    flex-shrink: 0;
    width: 200rpx;
    height: 200rpx;
    margin-right: 20rpx;
    border-radius: 20rpx;
    background-color: var(--bg-color);
    box-shadow: var(--shadow);
    .ach-type-icon {
      width: 80rpx;
      height: 80rpx;
    }
    .ach-type-name {
      font-size: var(--fontSize-normal);
      font-weight: bold;
      margin: 5rpx 0;
    }
    .count {
      background-color: var(--primary-color);
      color: #fff;
      font-size: var(--fontSize-mini);
      padding: 0 15rpx;
      border-radius: 50rpx;
    }
  }
  .selected {
    background-color: var(--primary-color);
    color: #fff;
  }
}

.ach-list {
  overflow: auto;
  height: calc(100vh - 360rpx);
  .ach-item {
    margin: 20rpx;
    padding: 20rpx;
    border-radius: 20rpx;
    background-color: var(--bg-color);
    box-shadow: var(--shadow);
    .arc-icon {
      width: 80rpx;
      height: 80rpx;
      border-radius: 20rpx;
      border: 3rpx solid gold;
      box-shadow: var(--shadow);
      padding: 5rpx;
    }

    .locked {
      filter: grayscale(100%);
    }

    .ach-info {
      margin-left: 20rpx;
      .ach-name {
        font-size: var(--fontSize-normal);
        font-weight: bold;
        margin: 5rpx 0;
      }
      .ach-desc {
        white-space: nowrap;
        width: 40vw;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .ach-opt {
      .detail-btn {
        margin-right: 30rpx;
        cursor: pointer;
        color: var(--primary-color);
      }
      .unget {
        filter: grayscale(100%);
      }
      .get-gift {
        button {
          font-size: var(--fontSize-mini);
          height: 50rpx;
          line-height: 50rpx;
          border-radius: 25rpx;
          background-color: var(--primary-color);
          padding: 0 15rpx;
          color: #fff;
        }
      }
      .unget,
      .checked {
        background-color: var(--success-color);
        color: #fff;
        font-size: var(--fontSize-mini);
        padding: 5rpx 15rpx;
        border-radius: 50rpx;
      }
    }
  }
}
</style>
