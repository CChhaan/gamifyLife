<template>
  <view>
    <view class="cover"></view>
    <view class="ai-task-content modal">
      <view class="title">AI智能任务规划</view>
      <view class="count">今日已使用AI任务规划次数：{{ count }} / 10</view>
      <view>
        <u-input
          v-model="prompt"
          type="textarea"
          placeholder="请输入任务大致描述"
          height="200"
          border
        ></u-input>
      </view>
      <view>
        <button class="ai-btn" @click="aiGen">AI规划</button>
        <button @click="$emit('close')" class="ai-btn cancel">取消</button>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { UserDailyLog } from "@/type/user";
import http from "@/utils/http";
import { computed, ref, toRef, watch } from "vue";
const props = defineProps<{
  count?: number;
}>();

const prompt = ref("");
const emit = defineEmits<{
  (e: "close"): void;
  (e: "getAiStatus", id: string): void;
}>();

const aiGen = async () => {
  if (prompt.value) {
    // 调用AI接口
    http
      .post("/aiTask/aiCreateTask", {
        content: prompt.value,
      })
      .then((res) => {
        emit("close");
        emit("getAiStatus", res.id);
      });
  }
};
</script>

<style scoped lang="scss">
.ai-task-content {
  width: 80%;
  padding: 40rpx;
  overflow: auto;
  border-radius: 15rpx;

  .title {
    font-size: var(--fontSize-big);
    font-weight: bold;
    margin-bottom: 20rpx;
    text-align: center;
  }
  .count {
    margin-bottom: 20rpx;
  }

  .ai-btn {
    color: #fff;
    background-color: var(--primary-color);
    font-size: var(--fontSize-big);
    width: 100%;
    margin-top: 20rpx;
  }

  .cancel {
    background-color: var(--contrast-color);
  }
}
</style>
