<template>
  <view class="category-ctn">
    <view class="title">分类管理</view>
    <view class="back" @click="$emit('close')">
      <u-icon name="arrow-left-double"></u-icon>
      <text class="back-text">返回</text>
    </view>
    <view>
      <button class="btn" @click="isAdding = true">添加分类</button>
    </view>
    <view>
      <category-item-cmp
        v-show="isAdding"
        :is-input-status="true"
        v-model="addName"
        @input-save="addSave"
        @cancel-input="cancelAdd"
      />
      <template
        v-for="item in taskCategories"
        :key="item.id"
        class="category-item"
      >
        <category-item-cmp
          :item
          v-model="editName"
          :is-input-status="editId === item.id"
          @change-item-status="changeEditStatus"
          @delete-icon-evt="openDeleteModal"
          @input-save="editSave"
          @cancel-input="cancelEdit"
        />
      </template>
    </view>
    <confirm-modal
      :text="text"
      v-if="confirmModalShow"
      @close="confirmModalShow = false"
      @confirm="deleteConfirm"
    />
  </view>
</template>

<script setup lang="ts">
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal.vue";
import CategoryItemCmp from "./components/categoryItemCmp.vue";
import { type TaskCategory } from "@/type/task";
import http from "@/utils/http";
import { ref } from "vue";

defineProps<{
  taskCategories: TaskCategory[] | null;
}>();

const emit = defineEmits<{
  (e: "refresh"): void;
  (e: "close"): void;
}>();

const isAdding = ref<boolean>(false);
const addName = ref<string>("");
const editName = ref<string>("");
const editId = ref<number | null>(null);
const deleteId = ref<number | null>(null);
const text = ref<string>("");
const confirmModalShow = ref<boolean>(false);

const changeEditStatus = (id: number, name: string) => {
  editId.value = id;
  editName.value = name;
};

const openDeleteModal = (id: number, name: string) => {
  deleteId.value = id;
  text.value = `确定要删除[${name}]分类吗？`;
  confirmModalShow.value = true;
};

const addSave = async () => {
  try {
    if (!addName.value.trim()) return;

    await http({
      url: "/api/taskCategory/createTaskCategory",
      method: "POST",
      data: {
        name: addName.value,
      },
    });

    addName.value = "";
    isAdding.value = false;
    emit("refresh");
    uni.showToast({ title: "添加成功", icon: "success", duration: 2000 });
  } catch (error) {
    console.log("添加失败", error);
  }
};

const editSave = async () => {
  try {
    if (!editName.value.trim()) return;

    await http({
      url: "/api/taskCategory/updateTaskCategory/" + editId.value,
      method: "PUT",
      data: {
        name: editName.value,
      },
    });
    editId.value = null;
    editName.value = "";
    emit("refresh");
    uni.showToast({ title: "修改成功", icon: "success", duration: 2000 });
  } catch (error) {
    console.log("修改失败", error);
  }
};

const deleteConfirm = async () => {
  try {
    await http({
      url: "/api/taskCategory/deleteTaskCategory/" + deleteId.value,
      method: "DELETE",
    });
    deleteId.value = null;
    confirmModalShow.value = false;
    emit("refresh");
    uni.showToast({ title: "删除成功", icon: "success", duration: 2000 });
  } catch (error) {
    console.log("删除失败", error);
  }
};

const cancelAdd = () => {
  addName.value = "";
  isAdding.value = false;
};

const cancelEdit = () => {
  editId.value = null;
  editName.value = "";
};
</script>

<style scoped lang="scss">
.category-ctn {
  width: 100%;
  height: 100%;
  background-color: var(--background-second-color);
  padding: 20rpx;
  box-sizing: border-box;
  overflow: auto;
  position: fixed;
}

.title {
  font-size: 40rpx;
  font-weight: bold;
  text-align: center;
  margin-bottom: 30rpx;
}

.back {
  position: absolute;
  top: 25rpx;
  left: 25rpx;
  display: flex;
  .back-text {
    margin-left: 10rpx;
    font-size: 32rpx;
  }
}

.btn {
  background-color: var(--primary-color);
  color: #fff;
  border-radius: 15rpx;
  font-size: 36rpx;
  line-height: 2;
  padding: 0.25em 1.5em;
  height: auto;
}
</style>
