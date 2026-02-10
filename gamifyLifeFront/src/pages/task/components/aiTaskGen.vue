<template>
  <view class="ai-task">
    <view class="ai-task-content">
      <view class="title">AI智能任务规划</view>
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
import http from "@/utils/http";
import { ref } from "vue";

const prompt = ref("");
const emit = defineEmits<{
  (e: "close"): void;
  (e: "getAiStatus", id: string): void;
}>();

const aiGen = async () => {
  if (prompt.value) {
    // 调用AI接口
    http
      .post("/api/aiTask/aiCreateTask", {
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
.ai-task {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 20;
  background-color: rgba($color: #000000, $alpha: 0.3);
}
.ai-task-content {
  width: 80%;
  height: 50%;
  background-color: #fff;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 40rpx;
  overflow: auto;

  .title {
    font-size: 36rpx;
    font-weight: bold;
    margin-bottom: 40rpx;
    text-align: center;
  }

  .ai-btn {
    border: none;
    color: #fff;
    background-color: var(--primary-color);
    font-size: 36rpx;
    width: 100%;
    margin-top: 20rpx;
  }

  .cancel {
    background-color: var(--contrast-color);
  }
}
</style>
