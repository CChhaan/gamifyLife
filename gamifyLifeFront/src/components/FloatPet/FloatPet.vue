<template>
  <movable-view
    class="float-pet"
    direction="all"
    :x="posX"
    :y="posY"
    @touchstart="movePetStart"
    @touchend="movePetEnd"
  >
    <image
      v-show="!move"
      style="width: 200rpx; height: 250rpx"
      src="../../static/pet_baby.png"
      mode="aspectFit"
    />
    <image
      v-show="move"
      style="width: 200rpx; height: 250rpx"
      src="../../static/pet_baby_catch.webp"
      mode="aspectFit"
    />
  </movable-view>
</template>

<script setup lang="ts">
import { onLoad } from "@dcloudio/uni-app";
import { ref } from "vue";

const posX = ref();
const posY = ref();
const move = ref(false);
onLoad(() => {
  const systemInfo = uni.getSystemInfoSync();
  const rpxToPx = systemInfo.screenWidth / 750;
  const petWidth = 200 * rpxToPx;
  const petHeight = 250 * rpxToPx;

  // 计算右下角位置
  posX.value = systemInfo.screenWidth - petWidth;
  posY.value = systemInfo.screenHeight - petHeight;
});

const movePetStart = (e: any) => {
  move.value = true;
};
const movePetEnd = (e: any) => {
  move.value = false;
};
</script>

<style scoped>
.float-pet {
  width: 200rpx;
  height: 250rpx;
  z-index: 1000;
}
</style>
