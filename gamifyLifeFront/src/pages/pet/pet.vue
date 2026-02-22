<template>
  <view>
    <view class="pet flex flex-col flex-justify__center h-full">
      <view class="flex flex-col w-full flex-justify__center">
        <div class="pet-area w-full">
          <view class="pet-pic w-full">
            <image
              class="img"
              src="../../static/pet_baby.png"
              mode="aspectFit"
            />
            <view class="pet-shadow"></view>
          </view>
          <div class="carpet"></div>
        </div>
        <view class="box w-full flex flex-col">
          <template v-if="!feedShow">
            <view class="flex flex-col w-full">
              <view class="name flex flex-col">
                <view>{{ petInfo?.nickname }}</view>
                <view class="tags flex flex-justify__center">
                  <view class="status">{{ PetStatus[petInfo?.status!] }}</view>
                  <view class="stage">{{ PetStage[petInfo?.stage!] }}</view>
                </view>
              </view>

              <view class="exp w-full flex">
                <view class="w-full flex">
                  <view class="level">
                    <view>LV. {{ petInfo?.level }}</view>
                  </view>
                  <view class="exp-sum flex-1">
                    <div class="prog">{{ petInfo?.exp }}/{{ 100 }}</div>
                    <view
                      class="exp-now"
                      :style="{ width: petInfo?.exp + '%' }"
                    ></view>
                  </view>
                </view>
              </view>
              <view class="flex flex-justify__around w-full">
                <view>饱食度 {{ petInfo?.hunger }} /100</view>
                <view>亲密度 {{ petInfo?.affection }} /100</view>
              </view>
            </view>
            <view class="action flex flex-justify__around w-full">
              <view
                class="action-item flex flex-justify__center"
                @click="feedShow = true"
              >
                喂食
              </view>
              <view class="action-item flex flex-justify__center"> 洗澡 </view>
              <view class="action-item flex flex-justify__center"> 玩耍 </view>
            </view>
          </template>
          <template v-else>
            <view class="food-title flex flex-justify__around w-full">
              <view class="back flex" @click="closeFeed">
                <u-icon name="arrow-left-double"></u-icon>
                <text class="back-text">返回</text>
              </view>
              <view class="title">选择食物</view>
              <view class="buy" @click="buy"> 去购买 → </view>
            </view>

            <view class="flex flex-justify__around w-full">
              <view
                class="food flex flex-col"
                v-for="food in userItems"
                :index="food.id"
                :class="{ select: selectedItem?.id == food.id }"
                @click="selectedItem = food"
              >
                <view class="icon"
                  ><image
                    class="img"
                    :src="'http://localhost:3000' + food.item?.icon_url"
                    mode="aspectFit"
                /></view>
                <view class="text-ellipsis w-full">{{ food.item?.name }}</view>
              </view>
            </view>
            <view
              class="opt flex flex-justify__around w-full flex-col"
              v-if="selectedItem"
            >
              <view> 拥有：{{ selectedItem?.quantity }}个 </view>
              <view class="use-effect flex"
                >效果：
                <view
                  v-for="(value, key) in selectedItem.item?.effect"
                  :key="key"
                  class="effect"
                  >{{ ItemEffectType[key] }}
                  {{ +value! > 0 ? "+" + value : value }}</view
                >
              </view>
            </view>
            <button class="use-btn flex" @click="feedPet">喂一次</button>
          </template>
        </view>
      </view>
    </view>
    <view class="go-back" @click="goBack">
      <button class="flex flex-justify__center">
        <u-icon name="arrow-leftward"></u-icon>
        <span style="margin-left: 10rpx">返回</span>
      </button>
    </view>
    <view class="cover" v-if="create"></view>
    <view class="create-pet modal" v-if="create">
      <view class="create-title"> 给宠物起一个名字吧！ </view>
      <u-input v-model="petName" placeholder="请输入宠物名称" border />
      <button class="create-btn" @click="createPet">确定</button>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ItemEffectType, type Inventory } from "@/type/item";
import { PetStage, PetStatus, type Pet } from "@/type/pets";
import http from "@/utils/http";
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

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

const feedShow = ref(false);
const selectedItem = ref<Inventory>();
const userItems = ref<Inventory[]>();
const getUserItems = async () => {
  const res = await http.get<Inventory[]>("/items/userItems");
  userItems.value = res.filter((n) => n.item?.type === "FOOD");
};

const buy = () => {
  uni.navigateTo({
    url: "/pages/inventory/inventory",
  });
};

const feedPet = async () => {
  if (!selectedItem.value) {
    return;
  }
  try {
    await http.post("/items/feed", {
      itemId: selectedItem.value.item_id,
    });
    getPet();
    getUserItems();
    closeFeed();
    uni.showToast({
      title: "喂食成功",
      icon: "success",
    });
  } catch (error) {}
};

const closeFeed = () => {
  feedShow.value = false;
  selectedItem.value = undefined;
};

// 获取宠物信息
const petInfo = ref<Pet>();
const getPet = async () => {
  const res = await http.get<Pet>("/pet");
  if (!res) {
    create.value = true;
  } else {
    create.value = false;
    petInfo.value = res;
  }
};

// 创建宠物
const petName = ref();
const create = ref(false);
const createPet = async () => {
  try {
    await http.post("/pet/createPet", {
      pet_name: petName.value,
    });
    getPet();
  } catch (error) {}
};

onLoad(async () => {
  await getPet();
  await getUserItems();
});
</script>

<style scoped lang="scss">
.pet {
  height: 100vh;
  width: 100vw;
  overflow: auto;
  background: url(../../static/imgs/pet_bg.png) no-repeat;
  background-color: var(--bg-color-page);
  background-size: 100% 85%;
}

.go-back {
  position: fixed;
  top: 30rpx;
  left: 30rpx;
  z-index: 20;
  button {
    height: 80rpx;
    border-radius: 20rpx;
    background-color: var(--primary-color);
    box-shadow: var(--shadow);
    color: #fff;
    font-size: var(--fontSize-large);
    font-weight: bold;
  }
}

.pet-area {
  margin-bottom: 75rpx;
  .pet-pic {
    height: 400rpx;
    margin-bottom: -100rpx;
    position: relative;
    z-index: 3;
  }
  .pet-shadow {
    position: absolute;
    height: 10%;
    width: 40%;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    background-color: #0003;
    border-radius: 50%;
    z-index: -1;
  }

  .carpet {
    height: 150rpx;
    width: 80%;
    margin: 0 auto;
    // background-color: var(--primary-color);
    border-radius: 50%;
  }
}

.box {
  width: 90%;
  padding: 30rpx;
  background-color: var(--bg-color);
  border-radius: 30rpx;
  box-shadow: var(--shadow);
  position: fixed;
  bottom: 30rpx;
  z-index: 5;
}

.name {
  font-size: var(--fontSize-large);
  font-weight: bold;

  .tags {
    margin-top: 20rpx;
  }

  .stage,
  .status {
    padding: 5rpx 15rpx;
    font-size: var(--fontSize-small);
    color: #fff;
    border-radius: 10rpx;
  }

  .status {
    background-color: #4fd781;
    margin-right: 20rpx;
  }

  .stage {
    background-color: var(--primary-color);
    border-radius: 10rpx;
  }
}

.exp {
  margin: 20rpx 0;

  .level {
    border-radius: 20rpx;
    margin-right: 20rpx;
    font-size: var(--fontSize-normal);
    font-weight: bold;
  }

  .exp-sum {
    height: 30rpx;
    border-radius: 15rpx;
    border: 2rpx solid #ccc;
    position: relative;
    overflow: hidden;
    background-color: var(--bg-second-color);

    .prog {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: var(--fontSize-small);
      color: var(--text-light-color);
    }

    .exp-now {
      height: 100%;
      background-color: var(--primary-color);
    }
  }
}

.action {
  margin-top: 30rpx;

  .action-item {
    padding: 10rpx 40rpx;
    border-radius: 50rpx;
    background-color: var(--contrast-color);
    box-shadow: var(--shadow);
    color: #fff;
    font-size: var(--fontSize-big);
    font-weight: bold;
  }
}
.food-title {
  margin-bottom: 20rpx;

  .title {
    font-size: var(--fontSize-large);
    font-weight: bold;
  }
  .back {
    border-radius: 10rpx;

    .back-text {
      margin-left: 10rpx;
      font-size: var(--fontSize-normal);
    }
  }

  .buy {
    font-size: var(--fontSize-normal);
    font-weight: bold;
    color: var(--primary-color);
    padding: 5rpx 20rpx;
    border-radius: 20rpx;
  }
}

.food {
  width: 32%;
  padding: 10rpx;
  .icon {
    width: 100%;
    aspect-ratio: 1 / 1;
  }
  .name {
    font-size: var(--fontSize-normal);
    font-weight: bold;
    margin: 10rpx 0;
  }
}

.select {
  border: 2rpx solid var(--primary-color);
  border-radius: 20rpx;
  box-shadow: var(--shadow);
  background-color: var(--bg-color-page);
}

.opt {
  margin-top: 10rpx;
  .use-effect {
    flex-wrap: wrap;
  }
  .effect {
    margin: 10rpx;
  }
}
.use-btn {
  margin-top: 10rpx;
  line-height: 2em;
  background-color: var(--primary-color);
  box-shadow: var(--shadow);
  color: #fff;
  font-size: var(--fontSize-large);
  font-weight: bold;
}

.cover {
  z-index: 15;
}

.create-pet {
  width: 65vw;
  border-radius: 16rpx;
  padding: 20rpx 30rpx;
  z-index: 30;

  .create-title {
    font-size: var(--fontSize-big);
    margin-bottom: 20rpx;
  }

  .create-btn {
    border: none;
    color: #fff;
    background-color: var(--primary-color);
    font-size: var(--fontSize-normal);
    line-height: 1.5;
    padding: 0.25em 1em;
    margin-top: 20rpx;
  }
}
</style>
