<template>
  <view class="beian-footer">
    <!-- #ifdef H5 -->
    <a
      class="beian-link"
      href="https://beian.miit.gov.cn/"
      target="_blank"
      rel="noopener noreferrer"
      >黑ICP备2026003031号</a
    >
    <!-- #endif -->
    <!-- #ifndef H5 -->
    <text class="beian-text">黑ICP备2026003031号</text>
    <!-- #endif -->
  </view>
</template>

<style scoped lang="scss">
/* 固定在底部 Tab 栏上方，与 pages.json 中 tabBar.height 一致 */
.beian-footer {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 140rpx;
  z-index: 99;
  text-align: center;
  padding: 8rpx 16rpx 0;
  pointer-events: none;
  background-color: var(--bg-second-color);
  .beian-link,
  .beian-text {
    pointer-events: auto;
    font-size: 24rpx;
    color: #999;
  }

  .beian-link {
    text-decoration: none;
    color: #999;
  }
}
</style>
