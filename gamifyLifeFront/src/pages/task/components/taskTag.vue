<template>
  <view class="task-tag tab-page flex flex-col">
    <view class="task-tag_title">标签管理</view>
    <view class="task-tag_back flex" @click="$emit('close')">
      <u-icon name="arrow-left-double"></u-icon>
      <text class="back-text">返回</text>
    </view>
    <view style="width: 100%">
      <button class="btn" @click="isAdding = true">添加标签</button>
    </view>
    <view class="tags w-full">
      <tag-item-cmp
        v-for="item in tags"
        :item
        :key="item.id"
        @handleDel="openDeleteModal"
      />
    </view>
    <add-tag-cmp
      v-model="addTagData"
      v-if="isAdding"
      @addTag="confirmAdd"
      @cancel="cancelAdding"
    />
    <confirm-modal
      :text="text"
      v-if="confirmModalShow"
      @close="confirmModalShow = false"
      @confirm="deleteConfirm"
    ></confirm-modal>
  </view>
</template>

<script setup lang="ts">
import type { TaskTag } from "@/type/task";
import http from "@/utils/http";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal.vue";
import { ref } from "vue";
import TagItemCmp from "./tagItem.vue";
import AddTagCmp from "./addTag.vue";

defineProps<{
  tags: TaskTag[] | null;
}>();

const emits = defineEmits<{
  (e: "close"): void;
  (e: "refresh"): void;
}>();

// 删除标签
const confirmModalShow = ref(false);
const text = ref<string>("");
const deleteId = ref<number | null>(null);

const openDeleteModal = (id: number, name: string) => {
  text.value = `确认删除标签「${name}」吗？`;
  confirmModalShow.value = true;
  deleteId.value = id;
};

const deleteConfirm = async () => {
  if (deleteId.value) {
    try {
      await http.delete(`taskTag/deleteTaskTag/${deleteId.value}`);
      emits("refresh");
      uni.showToast({ title: "删除成功", icon: "success", duration: 2000 });
    } catch (error) {
      console.log("删除失败", error);
    }
  }
  confirmModalShow.value = false;
};

// 增加标签
const isAdding = ref(false);
const cancelAdding = () => {
  isAdding.value = false;
  addTagData.value = {
    name: "",
    primary_attr: "",
    secondary_attr: "",
  };
};

const addTagData = ref<TaskTag>({
  name: "",
  primary_attr: "",
  secondary_attr: "",
});

const confirmAdd = async () => {
  try {
    await http.post("taskTag/createTaskTag", addTagData.value);
    cancelAdding();
    emits("refresh");
    uni.showToast({ title: "添加成功", icon: "success", duration: 2000 });
  } catch (error) {
    console.log("添加失败", error);
  }
};
</script>

<style scoped lang="scss">
.task-tag {
  padding: 20rpx;
  overflow: auto;
  position: fixed;
  z-index: 10;

  &_title {
    font-size: var(--fontSize-large);
    font-weight: bold;
    text-align: center;
    margin-bottom: 30rpx;
  }

  &_back {
    position: absolute;
    top: 25rpx;
    left: 25rpx;
    .back-text {
      margin-left: 10rpx;
      font-size: var(--fontSize-normal);
    }
  }
  .btn {
    background-color: var(--primary-color);
    color: #fff;
    border-radius: 15rpx;
    font-size: var(--fontSize-large);
    line-height: 2;
    padding: 0.15em 1.5em;
  }

  .tags {
    overflow: auto;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 20rpx;
    margin-top: 20rpx;
    padding: 20rpx;
  }
}
</style>
