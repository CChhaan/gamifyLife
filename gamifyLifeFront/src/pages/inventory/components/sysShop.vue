<template>
  <view class="sys-ctn w-full h-full">
    <view class="sys-item-list w-full flex flex-col">
      <view
        class="sys-item flex w-full flex-justify__between"
        v-for="item in sysItems"
        :key="item.id"
      >
        <view class="icon">
          <image
            class="img"
            :src="'http://8.222.155.211:3000' + item.icon_url"
            mode="scaleToFill"
          />
        </view>
        <view class="flex-1">
          <view class="name">{{ item.name }}</view>
          <view :class="{ fold: fold !== item.id }">
            {{ item.description }}
          </view>
          <view
            class="text-show"
            @click="fold = fold == item.id ? -1 : item.id"
            >{{ fold == item.id ? "收起" : "展开" }}</view
          >
        </view>
        <view class="flex flex-col">
          <view class="price">单价：${{ item.price }}</view>
          <u-number-box
            :model-value="getItemQuantity(item.id)"
            input-width="50"
            @update:model-value="
              (value: number) => updateCartItem(item.id, value)
            "
          ></u-number-box>
        </view>
      </view>
    </view>
    <view class="buy-info flex flex-justify__between">
      <view class="flex">
        <view class="count">已购买：{{ totalCount }}</view>
        <view class="price">总价：{{ totalPrice }}</view>
      </view>
      <view class="flex">
        <button class="empty" @click="clearCart">清空</button>
        <button @click="buyItems">确认购买</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { Item } from "@/type/item";
import http from "@/utils/http";
import { onLoad } from "@dcloudio/uni-app";
import { sys } from "uview-pro";
import { computed, ref } from "vue";

const value = ref(1);
const fold = ref();

const sysItems = ref<Item[] | null>();
const cart = ref<Map<number, number>>(new Map());

const updateCartItem = (itemId: any, count: number) => {
  if (count <= 0) {
    cart.value.delete(itemId);
    return 0;
  } else {
    cart.value.set(itemId, count);
    console.log(cart.value);
    return count;
  }
};

const getItemQuantity = (itemId: any) => {
  return cart.value.get(itemId) || 0;
};

// 计算购物车总数量
const totalCount = computed(() => {
  let total = 0;
  cart.value.forEach((count) => (total += count));
  return total;
});

// 计算购物车总价
const totalPrice = computed(() => {
  let total = 0;
  cart.value.forEach((count, itemId) => {
    const item = sysItems.value?.find((i) => i.id === itemId);
    if (item) {
      total += item.price * count;
    }
  });
  return total;
});

// 清空购物车
const clearCart = () => {
  cart.value.clear();
};

// 购买道具
const buyItems = async () => {
  try {
    if (cart.value.size === 0) {
      uni.showToast({
        title: "请先选择商品",
        icon: "none",
      });
      return;
    }
    const purchaseItems = Array.from(cart.value.entries()).map(
      ([itemId, count]) => ({
        id: itemId,
        quantity: count,
      }),
    );
    await http.post("items/buyItem", purchaseItems);
    uni.showToast({
      title: "购买成功",
      icon: "success",
    });
    cart.value.clear();
  } catch (error) {
    console.log("购买道具失败", error);
  }
};

const getSysItems = async () => {
  sysItems.value = await http.get<Item[]>("items");
};

onLoad(() => {
  getSysItems();
});
</script>

<style scoped lang="scss">
.sys-ctn {
  overflow: scroll;
}

.sys-item-list {
  padding: 25rpx;
  padding-bottom: 230rpx;

  .sys-item {
    padding: 20rpx;
    border-bottom: 2rpx solid #eee;
    background-color: #fff;
    border-radius: 20rpx;
    margin-bottom: 25rpx;
    box-shadow: var(--shadow);

    .icon {
      width: 150rpx;
      height: 150rpx;
      margin-right: 20rpx;
    }

    .name {
      font-size: var(--fontSize-normal);
      font-weight: bold;
      margin-bottom: 10rpx;
    }

    .fold {
      height: 50rpx;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .text-show {
      color: var(--primary-color);
    }

    .price {
      font-size: var(--fontSize-normal);
      margin-bottom: 20rpx;
    }
  }
}

.buy-info {
  position: fixed;
  bottom: 20rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 95%;
  background-color: var(--bg-color);
  box-shadow: var(--shadow);
  border-radius: 10rpx;
  z-index: 30;
  padding: 20rpx;

  .count {
    margin-right: 20rpx;
  }

  .empty {
    background-color: var(--contrast-color);
  }
  button {
    background-color: var(--primary-color);
    color: #fff;
    border-radius: 10rpx;
    font-size: var(--fontSize-normal);
    padding: 0 1em;
    margin-left: 10rpx;
  }
}
</style>
