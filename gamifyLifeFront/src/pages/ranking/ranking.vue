<template>
  <view>
    <view class="top-tab flex">
      <view
        class="tab-item"
        :class="{ selected: rankingType === 'GOLD' }"
        @click="rankingType = 'GOLD'"
      >
        金币榜
      </view>
      <view
        class="tab-item"
        :class="{ selected: rankingType === 'EXP' }"
        @click="rankingType = 'EXP'"
      >
        个人经验榜
      </view>
      <view
        class="tab-item"
        :class="{ selected: rankingType === 'EXP_PET' }"
        @click="rankingType = 'EXP_PET'"
      >
        宠物经验榜
      </view>
    </view>
    <view class="main flex w-full flex-align__start">
      <view class="left-tab">
        <view
          class="tab-item"
          :class="{ selected: cycle === value.value }"
          @click="cycle = value.value"
          v-for="value in cycleList"
          :key="value.value"
        >
          {{ value.label }}
        </view>
      </view>
      <view class="rank-main" v-if="rankData.length > 0">
        <view class="rank-item rank-th flex">
          <view class="flex-1">排名</view>
          <view class="flex-2">玩家</view>
          <view class="flex-2">数值</view>
        </view>
        <view
          class="rank-item rank-td flex"
          v-for="rank in rankData"
          :key="rank.id"
        >
          <view class="flex-1">{{ rank.rank }}</view>
          <view class="flex-2">{{ rank.userInfo.nickname }}</view>
          <view class="flex-2">{{ rank.score }}</view>
        </view>
      </view>
      <view class="rank-empty" v-else>- 暂无数据 -</view>
    </view>
    <view class="go-back" @click="goBack">
      <button class="flex flex-justify__center">
        <u-icon name="arrow-leftward"></u-icon>
        <span style="margin-left: 5rpx">返回</span>
      </button>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { IRankingDetail, IRankingSnapshot } from "@/type/ranking";
import type { UserInfo } from "@/type/user";
import http from "@/utils/http";
import { onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";

type RankingItem = (IRankingSnapshot & {
  details: (IRankingDetail & { userInfo: UserInfo })[];
})[];

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
const cycleList = [
  {
    label: "周榜",
    value: "WEEKLY",
  },
  {
    label: "月榜",
    value: "MONTHLY",
  },
];
const rankingType = ref("GOLD");
const cycle = ref("WEEKLY");

const allRanks = ref<RankingItem[]>();

const getRankings = async () => {
  const res = await http.get("/ranking/getAllRankings");
  allRanks.value = res;
};

const rankData = computed(() => {
  if (!allRanks.value) return [];
  console.log("allRanks.value", allRanks.value);
  const filtered = allRanks.value.filter((item) => {
    if (!item || item.length === 0) return false;

    return (
      item[0].cycle_type === cycle.value &&
      item[0].ranking_type === rankingType.value
    );
  });
  if (filtered.length === 0) return [];
  return filtered[0][0].details;
});

onShow(async () => {
  await getRankings();
});
</script>

<style scoped>
.top-tab {
  padding-left: 200rpx;
  .tab-item {
    padding: 20rpx 0;
    font-size: var(--fontSize-normal);
    font-weight: bold;
    color: #000;
    text-align: center;
    margin: 10rpx 20rpx;
  }
  .selected {
    color: var(--primary-color);
  }
}
.main {
  padding: 0 10rpx;
}
.left-tab {
  width: 15%;
  .tab-item {
    text-align: center;
    margin: 20rpx;
    font-size: var(--fontSize-normal);
  }
  .selected {
    color: var(--primary-color);
  }
}

.rank-main {
  width: 85%;
  border: 2rpx solid #ccc;
  border-radius: 20rpx;
  overflow: hidden;

  .rank-item {
    width: 100%;
    padding: 20rpx 0;
    text-align: center;
    background-color: #f5f7f9;
  }

  .rank-th {
    border-bottom: 2rpx solid #ccc;
    font-weight: bold;
  }
  .rank-td {
    border-bottom: 2rpx solid #ccc;

    &:nth-child(2n) {
      background-color: #d5e0e3;
    }

    &:last-child {
      border-bottom: none;
    }
  }
}
.rank-empty {
  width: 85%;
  padding-top: 100rpx;
  font-size: var(--fontSize-normal);
  text-align: center;
}

.go-back {
  position: fixed;
  top: 20rpx;
  left: 15rpx;
  z-index: 20;
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
</style>
