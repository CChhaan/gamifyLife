<template>
  <view class="authForm">
    <u-form
      :model="authFormData"
      ref="authForm"
      :rules="authRules"
      label-width="60"
    >
      <u-form-item
        v-for="item in items"
        :key="item.prop"
        class="form-item"
        :prop="item.prop"
        :border-bottom="false"
        :left-icon="item.icon"
      >
        <u-input
          v-model="authFormData[item.prop]"
          :placeholderStyle="'font-size:32rpx'"
          :placeholder="item.placeholder"
          :type="item.type || 'text'"
        />
      </u-form-item>
    </u-form>
    <button class="form-button" @click="onSubmit">{{ btnText }}</button>
  </view>
</template>

<script setup lang="ts">
import { type FormItem } from "@/type/form";
import UForm from "uview-pro/components/u-form/u-form.vue";
import { ref } from "vue";
const authFormData = defineModel<Record<string, any>>({ default: {} });
defineProps<{
  authRules: object;
  items: FormItem[];
  btnText: string;
}>();

const emit = defineEmits<{
  (e: "submit"): void;
}>();

const authForm = ref<InstanceType<typeof UForm> | null>(null);

// 添加 onSubmit 函数（之前缺失）
const onSubmit = () => {
  authForm.value?.validate(async (valid: boolean, errors: any[]) => {
    if (valid) {
      emit("submit");
    } else {
      console.log("表单验证失败", errors);
    }
  });
};
</script>

<style scoped lang="scss">
.authForm {
  width: 100%;
  .form-item {
    box-shadow: inset 0 0 4rpx 5rpx #f5f5f5;
    margin-bottom: 40rpx;
    border: 3rpx solid #c6c0b3;
    border-radius: 20rpx;
    padding: 10rpx 20rpx;
    background-color: #fff;
    font-size: 32rpx;
  }
  .form-button {
    background-color: var(--primary-color);
    color: #fff;
    border-radius: 30rpx;
    box-shadow: 0 4rpx 16rpx #ea9554;
  }
}

:deep(.u-form-item) {
  .u-iconfont {
    font-size: 40rpx !important;
    color: var(--placeholder-color);
  }
}
</style>
