<template>
  <div class="float-pet">
    <image
      style="width: 200rpx; height: 250rpx"
      src="../../static/pet_baby.png"
      mode="aspectFit"
    />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped>
.float-pet {
  position: fixed;
  z-index: 1000;
  bottom: 130rpx;
  right: 0rpx;
}
</style>
