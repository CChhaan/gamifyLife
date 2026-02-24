import { ref } from "vue";
import http from "@/utils/http";
import type { Pet } from "@/type/pets";

export function usePet() {
  // 获取宠物信息
  const petInfo = ref<Pet>();
  const getPet = async () => {
    petInfo.value = await http.get<Pet>("/pet");
  };

  return {
    petInfo,
    getPet,
  };
}
