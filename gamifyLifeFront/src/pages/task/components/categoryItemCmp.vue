<template>
  <view class="category-item flex flex-justify__between">
    <view>
      <u-input
        v-model="inputName"
        v-show="isInputStatus"
        class="edit-input"
        placeholder="请输入分类名称"
      ></u-input>
      <text v-show="!isInputStatus">{{ item?.name }}</text>
    </view>
    <view class="operation flex flex-justify__end">
      <template v-if="!isInputStatus">
        <u-icon
          name="edit-pen"
          @click="$emit('changeItemStatus', item!.id, item!.name)"
        ></u-icon>

        <u-icon
          class="icon"
          name="trash"
          color="#ff0000"
          @click="$emit('deleteIconEvt', item!.id, item!.name)"
        >
        </u-icon>
      </template>
      <template v-else>
        <button
          size="mini"
          plain
          class="operation-btn save-btn"
          @click="$emit('inputSave')"
        >
          保存
        </button>
        <button
          size="mini"
          plain
          class="operation-btn cancel-btn"
          @click="$emit('cancelInput')"
        >
          取消
        </button>
      </template>
    </view>
  </view>
</template>

<script setup lang="ts">
import type { TaskCategory } from "@/type/task";

defineProps<{
  isInputStatus: boolean;
  item?: TaskCategory;
}>();

defineEmits<{
  changeItemStatus: [id: number, name: string];
  deleteIconEvt: [id: number, name: string];
  inputSave: [];
  cancelInput: [];
}>();

const inputName = defineModel<string>({ default: "" });
</script>

<style scoped lang="scss">
.category-item {
  border: 3rpx solid var(--secondary-color);
  border-left: 10rpx solid var(--primary-color);
  padding: 30rpx;
  margin: 20rpx 0;
  background-color: var(--bg-color);
  font-size: var(--fontSize-big);
  border-radius: 10rpx;
  .edit-input {
    width: 80%;
    border-bottom: 3rpx solid;
    padding: 0 10rpx !important;
    box-sizing: border-box;
  }
}

.operation {
  width: 50%;
  .icon {
    margin-left: 30rpx;
  }
  .operation-btn {
    border: none;
    color: #fff;
    font-size: var(--fontSize-normal);
    line-height: 1.5;
    padding: 0.25em 1em;
  }
  .save-btn {
    background-color: var(--primary-color);
  }

  .cancel-btn {
    background-color: var(--contrast-color);
  }
}
</style>
