<template>
  <view class="user-items w-full h-full">
    <view class="item-list">
      <view
        class="item w-full"
        v-for="item in userItems"
        :key="item.id"
        @click="selectedItem = item"
      >
        <view class="w-full h-full flex flex-col flex-justify__center">
          <image
            class="img"
            :src="'http://localhost:3000' + item.item?.icon_url"
            mode="aspectFit"
          />
          <view class="name">{{ item.item?.name }}</view>
        </view>
        <view class="count flex flex-justify__center circle">{{
          item.quantity
        }}</view>
      </view>
      <view class="cover" v-if="selectedItem"></view>
      <view class="item-detail modal flex flex-col" v-if="selectedItem">
        <view class="pic">
          <image
            class="img"
            :src="'http://localhost:3000' + selectedItem.item?.icon_url"
            mode="aspectFit"
          />
        </view>
        <view class="name">{{ selectedItem.item?.name }}</view>
        <view class="description">{{ selectedItem.item?.description }}</view>

        <view v-if="selectedItem.item?.type == 'FOOD'">
          <u-number-box
            v-model="count"
            :max="selectedItem.quantity"
          ></u-number-box>
        </view>
        <view class="options flex w-full">
          <view
            class="option cancel flex flex-justify__center flex-1"
            @click="cancel"
            >取消</view
          >
          <view
            class="option flex flex-justify__center flex-1"
            v-if="selectedItem.item?.type !== 'FOOD'"
            >使用</view
          >
          <view
            class="option flex flex-justify__center flex-1"
            v-else
            @click="gotoPet"
            >去使用</view
          >
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Inventory } from "@/type/item";
import http from "@/utils/http";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const userItems = ref<Inventory[]>();
const selectedItem = ref<Inventory>();
const count = ref<number>(0);

const getUserItems = async () => {
  userItems.value = await http.get<Inventory[]>("/items/userItems");
};

onLoad(() => {
  getUserItems();
});

const cancel = () => {
  selectedItem.value = undefined;
  count.value = 0;
};

const gotoPet = () => {
  uni.navigateTo({
    url: `/pages/pet/pet`,
  });
};
</script>

<style scoped lang="scss">
.user-items {
  overflow: auto;
}

.item-list {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20rpx;
  margin: 40rpx 20rpx;
}

.item {
  aspect-ratio: 1/1;
  position: relative;
  border-radius: 15rpx;
  background-color: var(--bg-color);
  padding: 10rpx;
  box-shadow: var(--shadow);

  .name {
    font-size: var(--fontSize-small);
    font-weight: 600;
    margin-top: 10rpx;
  }

  .count {
    position: absolute;
    top: -10rpx;
    right: -10rpx;
    background: var(--primary-color);
    color: #fff;
    padding: 3rpx 15rpx;
  }
}

.cover {
  z-index: 5;
}
.item-detail {
  width: 75vw;
  padding: 20rpx;
  border-radius: 10rpx;
  z-index: 10;

  .pic {
    width: 50vw;
    height: 50vw;
  }

  .name {
    margin: 10rpx;
    font-size: var(--fontSize-big);
    font-weight: 600;
  }
  .description {
    color: var(--text-light-color);
    margin-bottom: 10rpx;
  }

  .options {
    margin-top: 20rpx;

    .option {
      padding: 10rpx;
      border-radius: 10rpx;
      background: var(--primary-color);
      color: #fff;
      font-size: var(--fontSize-normal);
      font-weight: 600;
    }
    .cancel {
      margin-right: 20rpx;
      background: var(--contrast-color);
    }
  }
}
</style>
