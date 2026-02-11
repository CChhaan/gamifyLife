<template>
  <view class="bag-ctn">
    <view class="bag">
      <view
        class="bag-item"
        v-for="item in userItems"
        :key="item.id"
        @click="selectedItem = item"
      >
        <view class="item">
          <image
            class="item-image"
            :src="'http://localhost:3000' + item.item?.icon_url"
            mode="aspectFill"
          />
          <view class="name">{{ item.item?.name }}</view>
        </view>
        <view class="count">{{ item.quantity }}</view>
      </view>
      <view class="cover" v-if="selectedItem"></view>
      <view class="item-info" v-if="selectedItem">
        <view class="detail">
          <view class="pic"
            ><image
              class="item-image"
              :src="'http://localhost:3000' + selectedItem.item?.icon_url"
              mode="aspectFill"
          /></view>
          <view class="name">{{ selectedItem.item?.name }}</view>
          <view class="description">{{ selectedItem.item?.description }}</view>
        </view>
        <view class="item-count" v-if="selectedItem.item?.type == 'FOOD'">
          <u-number-box
            v-model="count"
            input-width="50"
            :max="selectedItem.quantity"
          ></u-number-box>
        </view>
        <view class="options">
          <view class="option cancel" @click="cancel">取消</view>
          <view class="option">使用</view>
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
  userItems.value = await http.get<Inventory[]>("/api/items/userItems");
};

onLoad(() => {
  getUserItems();
});

const cancel = () => {
  selectedItem.value = undefined;
  count.value = 0;
};
</script>

<style scoped lang="scss">
.bag-ctn {
  width: 100%;
  height: 100%;
  overflow: auto;
}

.bag {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30rpx;
  margin: 40rpx 20rpx;
}

.bag-item {
  aspect-ratio: 1/1;
  height: auto;
  position: relative;
  border-radius: 15rpx;
  width: 100%;
  height: 100%;
  background-color: #fff;
  padding: 10rpx;
  box-shadow: 5rpx 5rpx 10rpx rgba(0, 0, 0, 0.2);
}

.item {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .item-image {
    width: 80%;
    height: 80%;
  }
  .name {
    font-size: 28rpx;
    font-weight: 600;
    margin-top: 10rpx;
  }
}

.count {
  position: absolute;
  top: -10rpx;
  right: -10rpx;
  background: var(--primary-color);
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 20rpx;
  height: 40rpx;
  padding: 10rpx;
}
.cover {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
}
.item-info {
  position: fixed;
  top: 50%;
  left: 50%;
  width: 75vw;
  transform: translate(-50%, -50%);
  background: #fff;
  padding: 20rpx;
  border-radius: 10rpx;
  box-shadow: 5rpx 5rpx 10rpx rgba(0, 0, 0, 0.2);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;

  .detail {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    margin-bottom: 20rpx;
    .pic {
      width: 50vw;
      height: 50vw;
    }
    .item-image {
      width: 100%;
      height: 100%;
    }
    .name {
      margin-top: 10rpx;
      font-size: 36rpx;
      font-weight: 600;
    }
    .description {
      margin-top: 10rpx;
      color: #666;
    }
  }

  .options {
    display: flex;
    width: 100%;
    margin-top: 20rpx;

    .option {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10rpx;
      border-radius: 10rpx;
      background: var(--primary-color);
      color: #fff;
      font-size: 32rpx;
      font-weight: 600;
    }
    .cancel {
      margin-right: 20rpx;
      background: var(--contrast-color);
    }
  }
}
</style>
