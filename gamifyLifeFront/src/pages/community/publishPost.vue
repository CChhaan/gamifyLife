<template>
  <view class="publish-post tab-page">
    <view class="title">发布帖子</view>
    <view class="back flex" @click="$emit('close')">
      <u-icon name="arrow-left-double"></u-icon>
      <text class="back-text">返回</text>
    </view>
    <view class="posts">
      <view v-for="item in postsList" :key="item.id" class="post-item">
        <view class="post-header">{{ item.title }}</view>
        <view class="post-data">
          <view class="post-time">
            创建时间：{{ dayjs(item.createdAt).format("YYYY-MM-DD HH:mm:ss") }}
          </view>
        </view>
        <view>类型：{{ PostTypeTextMap[item.post_type!] }}</view>
        <view class="flex flex-justify__end w-full">
          <button size="mini" @click="publishPost(item)">发布</button>
        </view>
      </view>
    </view>
    <confirm-modal-cmp
      :text="text"
      :cancel="true"
      v-if="showConfirmModal"
      @close="showConfirmModal = false"
      @confirm="confirmPublish"
    ></confirm-modal-cmp>
  </view>
</template>

<script setup lang="ts">
import { PostTypeTextMap, type Post } from "@/type/post";
import dayjs from "dayjs";
import ConfirmModalCmp from "@/components/ConfirmModal/ConfirmModal.vue";
import { ref } from "vue";
import http from "@/utils/http";

defineProps<{
  postsList: Post[];
}>();

const emits = defineEmits(["close", "refresh"]);

const text = ref("");
const showConfirmModal = ref(false);
const postId = ref();

// 发布帖子
const publishPost = (item: Post) => {
  text.value = `确认发布帖子“${item.title}”吗？`;
  showConfirmModal.value = true;
  postId.value = item.id;
};

// 确认发布帖子
const confirmPublish = async () => {
  try {
    await http.post("post/publish", {
      postId: postId.value,
    });
    showConfirmModal.value = false;
    emits("refresh");
    uni.showToast({ title: "发布成功", icon: "success", duration: 2000 });
  } catch (error) {
    console.log("发布失败", error);
  }
};
</script>

<style scoped lang="scss">
.publish-post {
  padding: 20rpx 30rpx;
  padding-bottom: 160rpx;
  position: fixed;
  z-index: 10;
}

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

.posts {
  height: calc(100vh - 250rpx);
  overflow: auto;
  font-size: var(--fontSize-normal);

  .post-item {
    margin-bottom: 20rpx;
    padding: 20rpx;
    border-radius: 20rpx;
    background-color: var(--bg-color);
    box-shadow: var(--shadow);
    .post-header {
      font-size: var(--fontSize-big);
      font-weight: bold;
    }
  }
}
button {
  margin: 0;
  font-size: var(--fontSize-normal);
  background-color: var(--primary-color);
  color: var(--text-contrast-color);
}
</style>
