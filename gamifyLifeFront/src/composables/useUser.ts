import { ref } from "vue";
import http from "@/utils/http";
import type { UserGrowth, UserInfo } from "@/type/user";
import { saveUserData } from "@/utils/growthCal";

export function useUser() {
  const userInfo = ref<UserInfo | null>(null);
  const userGrowth = ref<UserGrowth | null>(null);

  const getUserInfo = async () => {
    userInfo.value = await http.get<UserInfo>("/api/userInfo/");
  };

  const getUserGrowth = async () => {
    userGrowth.value = await http.get<UserGrowth>("/api/userGrowth/");
    saveUserData(userGrowth.value.level, userGrowth.value.total_experience);
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
