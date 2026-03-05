<template>
  <view class="community tab-page flex flex-col">
    <view class="community_banner flex w-full flex-shrink-0">
      <button size="mini" @click="showPublishPost = true">
        发布动态 ( {{ userUnPublishedPosts.length }} )
      </button>
      <button size="mini">通知</button>
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
          <view class="poster-info flex">
            <view class="poster-avatar">
              <image class="img" :src="item.userInfo?.avatar_url" />
            </view>
            <view class="poster-name">{{ item.userInfo?.nickname }}</view>
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
              <view class="flex comment-item">
                <u-icon name="thumb-up" class="comment-icon" />{{
                  item.like_count
                }}
              </view>
              <view class="flex comment-item">
                <u-icon name="thumb-down" class="comment-icon" />{{
                  item.dislike_count
                }}
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
  </view>
</template>

<script lang="ts" setup>
import type { Post } from "@/type/post";
import http from "@/utils/http";
import { onShow } from "@dcloudio/uni-app";
import PublishPostCmp from "./publishPost.vue";
import { computed, ref, watch } from "vue";
import dayjs from "dayjs";

const userPosts = ref<Post[]>();

const selectedTab = ref("热门");

// 获取用户的动态
const getUserPosts = async () => {
  const res = await http.get<Post[]>("/post/getUserPosts");
  userPosts.value = res || [];
};
// 获取热门动态
const getHotPosts = async () => {
  const res = await http.get<Post[]>("/post/getAllPublishedPosts", {
    sort: "view_count",
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
  selectedTab,
  async () => {
    switch (selectedTab.value) {
      case "热门": {
        const hotPosts = await getHotPosts();
        postsList.value = hotPosts;
        break;
      }
      case "最新":
        postsList.value = [];
        break;
      case "我的帖子":
        postsList.value = userPublishedPosts.value || [];
        break;
    }
  },
  { immediate: true },
);
console.log(postsList.value);
// 发布帖子
const showPublishPost = ref(false);

const closePublishPost = () => {
  showPublishPost.value = false;
  getUserPosts();
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
        background-color: var(--contrast-color);
        color: #fff;
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
          width: 50rpx;
          height: 50rpx;
          border-radius: 50%;
          background-color: pink;
        }
        .poster-name {
          margin-left: 20rpx;
          font-size: var(--fontSize-normal);
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
