import { computed, ref } from "vue";
import http from "@/utils/http";

import type { Post } from "@/type/post";

export function usePost() {
  const userPosts = ref<Post[]>();

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

  return {
    userPosts,
    getUserPosts,
    getHotPosts,
    getNewPosts,
    userUnPublishedPosts,
    userPublishedPosts,
  };
}
