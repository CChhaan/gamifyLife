<template>
  <view class="community tab-page flex flex-col">
    <view class="community_banner flex w-full flex-shrink-0">
      <button size="mini" @click="showPublishPost = true">
        发布动态 ( {{ userUnPublishedPosts.length }} )
      </button>
      <button size="mini" @click="showNotice = true">通知</button>
    </view>
    <view class="community_main w-full">
      <view class="community_main-tabbar flex flex-justify__between">
        <view
          class="tab-item flex-1"
          :class="{ selected: selectedTab === '热门' }"
          @click="selectedTab = '热门'"
          >热门</view
        >
        <view
          class="tab-item flex-1"
          :class="{ selected: selectedTab === '最新' }"
          @click="selectedTab = '最新'"
          >最新</view
        >
        <view
          class="tab-item flex-1"
          :class="{ selected: selectedTab === '我的帖子' }"
          @click="selectedTab = '我的帖子'"
          >我的帖子</view
        >
      </view>
      <view class="community_main-posts">
        <view v-for="item in postsList" :key="item.id" class="post-item">
          <view class="poster-info flex flex-justify__between">
            <view class="flex"
              ><view class="poster-avatar">
                <image class="img" :src="item.userInfo?.avatar_url" />
              </view>
              <view class="poster-name">{{
                item.userInfo?.nickname
              }}</view></view
            >
            <button
              class="hide"
              v-if="isUserPost(item) && item.status == 'PUBLISHED'"
              @click="hidePost(item)"
            >
              设为私密
            </button>
            <button
              class="hide"
              v-if="isUserPost(item) && item.status == 'HIDDEN'"
              @click="unhidePost(item)"
            >
              设为公开
            </button>
          </view>
          <view class="post-header">{{ item.title }}</view>
          <view class="post-data">
            <view class="post-time"
              >发布时间：{{
                dayjs(item.published_at).format("YYYY-MM-DD HH:mm:ss")
              }}</view
            >
            <view class="comment flex flex-justify__around">
              <view class="flex comment-item">
                <u-icon name="eye" class="comment-icon" />{{ item.view_count }}
              </view>
              <view
                class="flex comment-item"
                @click="LikeOrDislike(item, isLiked(item))"
              >
                <u-icon
                  :name="isLiked(item) ? 'thumb-up-fill' : 'thumb-up'"
                  class="comment-icon"
                />{{ item.like_count }}
              </view>
              <view
                class="flex comment-item"
                @click="DislikeOrUnDislike(item, isDisliked(item))"
              >
                <u-icon
                  :name="isDisliked(item) ? 'thumb-down-fill' : 'thumb-down'"
                  class="comment-icon"
                />{{ item.dislike_count }}
              </view>
            </view>
          </view>
        </view>
      </view>
    </view>
    <publish-post-cmp
      @close="closePublishPost"
      v-if="showPublishPost"
      :postsList="userUnPublishedPosts"
      @refresh="getUserPosts"
    />
    <notice-cmp @close="closeNotice" v-if="showNotice" />
  </view>
</template>

<script lang="ts" setup>
import type { Post } from "@/type/post";
import http from "@/utils/http";
import { onShow } from "@dcloudio/uni-app";
import PublishPostCmp from "./publishPost.vue";
import NoticeCmp from "./notice.vue";

import { computed, ref, watch } from "vue";
import dayjs from "dayjs";

const userPosts = ref<Post[]>();

const selectedTab = ref("热门");
const fresh = ref(false);

// 获取用户的动态
const getUserPosts = async () => {
  const res = await http.get<Post[]>("/post/getUserPosts");
  userPosts.value = res || [];
};
// 获取热门动态
const getHotPosts = async () => {
  const res = await http.get<Post[]>("/post/getAllPublishedPosts", {
    sort: "like_count",
  });
  return res || [];
};

// 获取最新动态
const getNewPosts = async () => {
  const res = await http.get<Post[]>("/post/getAllPublishedPosts", {
    sort: "published_at",
  });
  return res || [];
};

// 用户未发布的动态
const userUnPublishedPosts = computed(() => {
  return userPosts.value?.filter((item) => !item.published_at) || [];
});

// 获取用户发布的动态
const userPublishedPosts = computed(() => {
  return userPosts.value?.filter((item) => item.published_at) || [];
});

const postsList = ref<Post[]>([]);

watch(
  [selectedTab, fresh],
  async () => {
    switch (selectedTab.value) {
      case "热门": {
        const hotPosts = await getHotPosts();
        postsList.value = hotPosts;
        break;
      }
      case "最新":
        const newPosts = await getNewPosts();
        postsList.value = newPosts;
        break;
      case "我的帖子":
        await getUserPosts();
        postsList.value = userPublishedPosts.value || [];
        break;
    }
  },
  { immediate: true },
);
// 发布帖子
const showPublishPost = ref(false);
const showNotice = ref(false);

// 判断是否是用户发的帖子
const isUserPost = (post: Post) => {
  return userPosts.value?.some((item) => item.id === post.id);
};

const closePublishPost = () => {
  showPublishPost.value = false;
  getUserPosts();
};

const closeNotice = () => {
  showNotice.value = false;
};

// 判断帖子用户是否点赞过
const isLiked = (post: Post) => {
  if (!post.interactions) {
    return false;
  } else {
    return post.interactions.some(
      (item) => item.interaction_type === "LIKE" && item.is_active === 1,
    );
  }
};

// 判断帖子用户是否点踩过
const isDisliked = (post: Post) => {
  if (!post.interactions) {
    return false;
  } else {
    return post.interactions.some(
      (item) => item.interaction_type === "DISLIKE" && item.is_active === 1,
    );
  }
};

// 隐藏帖子
const hidePost = async (post: Post) => {
  try {
    await http.post("post/hide", {
      postId: post.id,
    });
    uni.showToast({ title: "设为私密成功", icon: "success", duration: 2000 });
    getUserPosts();
    fresh.value = !fresh.value;
  } catch (error) {
    console.log("设为私密失败", error);
  }
};

// 公开帖子
const unhidePost = async (post: Post) => {
  try {
    await http.post("post/unhide", {
      postId: post.id,
    });
    uni.showToast({ title: "设为公开成功", icon: "success", duration: 2000 });
    fresh.value = !fresh.value;
  } catch (error) {
    console.log("设为公开失败", error);
  }
};

// 点赞和取消
const LikeOrDislike = async (post: Post, isLike: boolean) => {
  try {
    if (!post.interactions) {
      return;
    }
    const url = isLike ? "postInteraction/unlike" : "postInteraction/like";
    await http.post(url, {
      postId: post.id,
      isLike,
    });
    uni.showToast({
      title: isLike ? "取消点赞" : "点赞成功",
      icon: "success",
      duration: 2000,
    });
    getUserPosts();
    fresh.value = !fresh.value;
  } catch (error) {
    console.log(isLike ? "点赞失败" : "取消点赞失败", error);
  }
};

// 点踩和取消
const DislikeOrUnDislike = async (post: Post, isDislike: boolean) => {
  try {
    if (!post.interactions) {
      return;
    }
    const url = isDislike
      ? "postInteraction/unDislike"
      : "postInteraction/dislike";
    await http.post(url, {
      postId: post.id,
      isDislike,
    });
    uni.showToast({
      title: isDislike ? "取消点踩" : "点踩成功",
      icon: "success",
      duration: 2000,
    });
    getUserPosts();
    fresh.value = !fresh.value;
  } catch (error) {
    console.log(isDislike ? "点踩失败" : "取消点踩失败", error);
  }
};

onShow(() => {
  getUserPosts();
});
</script>

<style lang="scss" scoped>
.community {
  overflow: auto;

  &_banner {
    height: 100rpx;
    background-color: var(--primary-color);
    padding: 0 20rpx;

    button {
      margin: 0 10rpx;
    }
  }

  &_main {
    overflow: auto;

    &-tabbar {
      background-color: var(--bg-color);

      .tab-item {
        padding: 20rpx 0;
        font-size: var(--fontSize-normal);
        font-weight: bold;
        color: #000;
        text-align: center;
      }

      .selected {
        color: var(--primary-color);
        border-bottom: 10rpx solid var(--primary-color);
      }
    }

    &-posts {
      .post-item {
        padding: 20rpx 30rpx;
        background-color: var(--bg-color);
        margin: 30rpx;
        border-radius: 20rpx;
        box-shadow: var(--shadow);
      }

      .poster-info {
        .poster-avatar {
          width: 60rpx;
          height: 60rpx;
          border-radius: 50%;
          background-color: pink;
        }
        .poster-name {
          margin-left: 20rpx;
          font-size: var(--fontSize-normal);
        }

        .hide {
          margin: 0;
          font-size: var(--fontSize-small);
          background-color: var(--contrast-color);
          color: var(--text-contrast-color);
        }
      }

      .post-header {
        font-size: var(--fontSize-big);
        font-weight: bold;
        margin: 20rpx 0 10rpx;
      }

      .post-data {
        .post-time {
          font-size: var(--fontSize-small);
        }
        .comment {
          padding-top: 10rpx;
          .comment-item {
            font-size: var(--fontSize-normal);
          }

          .comment-icon {
            margin-right: 10rpx;
            font-size: var(--fontSize-big);
          }
        }
      }
    }
  }
}

// .header-title {
//   font-size: var(--fontSize-large);
//   font-weight: bold;
//   color: #fff;
// }
</style>
