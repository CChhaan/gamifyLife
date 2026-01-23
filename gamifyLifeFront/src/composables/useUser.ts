import { ref } from "vue";
import http from "@/utils/http";
import type { UserGrowth, UserInfo } from "@/type/user";

export function useUser() {
  const userInfo = ref<UserInfo | null>(null);
  const userGrowth = ref<UserGrowth | null>(null);

  const getUserInfo = async () => {
    userInfo.value = await http<UserInfo>({
      url: "/api/userInfo/getUserInfo",
      method: "GET",
    });
  };

  const getUserGrowth = async () => {
    userGrowth.value = await http({
      url: "/api/userGrowth/getUserGrowth",
      method: "GET",
    });
  };

  const loadUserData = async () => {
    await Promise.all([getUserInfo(), getUserGrowth()]);
  };

  return {
    userInfo,
    userGrowth,
    getUserInfo,
    getUserGrowth,
    loadUserData,
  };
}
