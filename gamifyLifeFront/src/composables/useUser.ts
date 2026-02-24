import { ref } from "vue";
import http from "@/utils/http";
import type { UserDailyLog, UserGrowth, UserInfo } from "@/type/user";
import { saveUserData } from "@/utils/growthCal";

export function useUser() {
  // 用户信息
  const userInfo = ref<UserInfo | null>(null);

  // 用户成长信息
  const userGrowth = ref<UserGrowth | null>(null);

  // 用户每日日志
  const userDailyLog = ref<UserDailyLog | null>(null);

  const getUserInfo = async () => {
    userInfo.value = await http.get<UserInfo>("/userInfo/");
  };

  const getUserGrowth = async () => {
    userGrowth.value = await http.get<UserGrowth>("/userGrowth/");
    saveUserData(userGrowth.value.level, userGrowth.value.total_experience);
  };

  const getUserDailyLog = async () => {
    userDailyLog.value = await http.get<UserDailyLog>("/userDailyLog/");
  };

  const loadUserData = async () => {
    await Promise.all([getUserInfo(), getUserGrowth(), getUserDailyLog()]);
  };

  return {
    userInfo,
    userGrowth,
    getUserInfo,
    getUserGrowth,
    loadUserData,
    userDailyLog,
    getUserDailyLog,
  };
}
