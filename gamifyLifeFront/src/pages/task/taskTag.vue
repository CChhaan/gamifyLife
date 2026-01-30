<template>
  <view class="tag-ctn">
    <view class="title">标签管理</view>
    <view class="back" @click="$emit('close')">
      <u-icon name="arrow-left-double"></u-icon>
      <text class="back-text">返回</text>
    </view>
    <view style="width: 100%">
      <button class="btn" @click="isAdding = true">添加标签</button>
    </view>
    <view class="tags">
      <view class="tag-item" v-for="item in tags" :key="item.id">
        <view class="tag-name">
          <text class="tag-name-text">{{ item.name }}</text>
        </view>
        <view class="tag-item-attr">
          <u-icon
            :name="`/static/imgs/${item.primary_attr}.png`"
            size="40"
          ></u-icon>
          <text class="attr-name">{{
            InfluenceAttrTextMap[item.primary_attr]
          }}</text>
        </view>
        <view class="tag-item-attr" v-if="item.secondary_attr">
          <u-icon
            :name="`/static/imgs/${item.secondary_attr}.png`"
            size="40"
          ></u-icon>
          <text class="attr-name">{{
            InfluenceAttrTextMap[item.secondary_attr]
          }}</text>
        </view>
        <view class="operation">
          <button
            class="operation-btn"
            @click="openDeleteModal(item.id, item.name)"
          >
            删除
          </button>
        </view>
      </view>
    </view>
    <view class="cover" v-if="isAdding">
      <view class="add-tag-card">
        <u-form
          :model="addTagData"
          ref="taskTagForm"
          :rules="userInfoRules"
          label-width="100"
          label-align="center"
        >
          <u-form-item label="名称" prop="name" :border-bottom="false">
            <u-input
              class="form-item"
              v-model="addTagData.name"
              placeholder="请输入标签名称"
              border
            />
          </u-form-item>
          <u-form-item
            label="主属性"
            prop="primary_attr"
            :border-bottom="false"
          >
            <u-input
              class="form-item"
              v-model="InfluenceAttrTextMap[addTagData.primary_attr]"
              type="select"
              @click="primaryAttrSelectShow = true"
              border
              placeholder="请选择主影响属性"
            >
            </u-input>
          </u-form-item>
          <u-form-item
            label="副属性"
            prop="secondary_attr"
            :border-bottom="false"
          >
            <u-input
              class="form-item"
              v-model="
                InfluenceAttrTextMap[addTagData.secondary_attr as InfluenceAttr]
              "
              type="select"
              @click="secondaryAttrSelectShow = true"
              border
              placeholder="请选择副影响属性"
            >
            </u-input>
          </u-form-item>
        </u-form>
        <view class="add-operation">
          <button class="operation-btn" @click="confirmAdd">确认</button>
          <button class="operation-btn" @click="cancelAdding">取消</button>
        </view>
      </view>
    </view>
    <u-select
      v-model="primaryAttrSelectShow"
      mode="single-column"
      :list="attrList"
      @confirm="addTagData.primary_attr = $event[0].value"
      confirm-text="确定"
      cancel-text="取消"
    ></u-select>
    <u-select
      v-model="secondaryAttrSelectShow"
      mode="single-column"
      :list="attrList"
      @confirm="addTagData.secondary_attr = $event[0].value"
      confirm-text="确定"
      cancel-text="取消"
    ></u-select>
    <confirm-modal
      :text="text"
      v-if="confirmModalShow"
      @close="confirmModalShow = false"
      @confirm="deleteConfirm"
    ></confirm-modal>
  </view>
</template>

<script setup lang="ts">
import {
  InfluenceAttrTextMap,
  type TaskTag,
  type InfluenceAttr,
} from "@/type/task";
import http from "@/utils/http";
import ConfirmModal from "@/components/ConfirmModal/ConfirmModal.vue";

import { onMounted, ref } from "vue";
const tags = ref<TaskTag[] | null>();
const taskTagForm = ref();
const confirmModalShow = ref(false);
const text = ref<string>("");
const deleteId = ref<number | null>(null);

const openDeleteModal = (id: number, name: string) => {
  text.value = `确认删除标签${name}吗？`;
  confirmModalShow.value = true;
  deleteId.value = id;
};

const deleteConfirm = async () => {
  if (deleteId.value) {
    try {
      await http({
        url: `/api/taskTag/deleteTaskTag/${deleteId.value}`,
        method: "DELETE",
      });
      getTags();
      uni.showToast({ title: "删除成功", icon: "success", duration: 2000 });
    } catch (error) {
      console.log("删除失败", error);
    }
  }
  confirmModalShow.value = false;
};

const getTags = async () => {
  tags.value = await http<TaskTag[] | null>({
    url: "/api/taskTag/",
    method: "GET",
  });
};

const addTagData = ref<TaskTag>({
  name: "",
  primary_attr: "",
  secondary_attr: "",
});

const userInfoRules = {
  name: [
    {
      required: true,
      message: "请输入标签名称",
    },
  ],
  primary_attr: [
    {
      required: true,
      message: "请选择主影响属性",
    },
  ],
};
const primaryAttrSelectShow = ref(false);
const secondaryAttrSelectShow = ref(false);
const attrList = Object.entries(InfluenceAttrTextMap)
  .filter(([key]) => key !== "")
  .map(([value, label]) => ({ value, label }));
const isAdding = ref(false);
const cancelAdding = () => {
  isAdding.value = false;
  addTagData.value = {
    name: "",
    primary_attr: "",
    secondary_attr: "",
  };
};
const confirmAdd = async () => {
  taskTagForm.value?.validate(async (valid: boolean, errors: any[]) => {
    if (valid) {
      try {
        await http({
          url: "/api/taskTag/createTaskTag",
          method: "POST",
          data: addTagData.value,
        });
        addTagData.value = {
          name: "",
          primary_attr: "",
          secondary_attr: "",
        };
        isAdding.value = false;
        getTags();
        uni.showToast({ title: "添加成功", icon: "success", duration: 2000 });
      } catch (error) {
        console.log("添加失败", error);
      }
    } else {
      console.log("表单验证失败", errors);
    }
  });
};
onMounted(() => {
  getTags();
});
</script>

<style scoped lang="scss">
.tag-ctn {
  width: 100vw;
  height: 100vh;
  background-color: var(--background-second-color);
  padding: 20rpx;
  padding-bottom: 145rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;
  position: fixed;
  z-index: 10;
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

.tags {
  width: 100%;
  overflow: auto;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20rpx;
  margin-top: 20rpx;
  padding: 20rpx;
  .tag-item {
    border-radius: 15rpx;
    padding: 20rpx;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    font-size: 32rpx;
    color: var(--text-color);
    box-shadow: 5px 5px 7px rgba(33, 33, 33, 0.7);
    &:nth-child(5n + 1) {
      background-color: #fdf;
      transform: rotate(-6deg);
    }
    &:nth-child(5n + 2) {
      background-color: #dfd;
      transform: rotate(6deg);
    }
    &:nth-child(5n + 3) {
      background-color: #fdd;
      transform: rotate(-3deg);
    }
    &:nth-child(5n + 4) {
      background-color: #ddf;
      transform: rotate(3deg);
    }
    &:nth-child(5n) {
      background-color: #ffd;
      transform: rotate(1deg);
    }
  }
  .tag-name {
    font-size: 40rpx;

    .tag-name-text {
      margin-right: 10rpx;
    }
  }
  .tag-item-attr {
    display: flex;
    align-items: center;
    .attr-name {
      margin-left: 10rpx;
    }
  }
}

.cover {
  position: absolute;
  z-index: 15;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
}

.add-tag-card {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 66%;
  box-sizing: border-box;
  padding: 10rpx 40rpx;
  background-color: #fefefe;
  border-radius: 15rpx;
  box-shadow: 10rpx 10rpx 20rpx rgba(33, 33, 33, 0.5);
  z-index: 20;
}
.add-operation {
  display: flex;
  justify-content: space-between;
}
.operation-btn {
  border: none;
  color: #fff;
  background-color: var(--primary-color);
  font-size: 32rpx;
  line-height: 1.5;
  padding: 0.25em 1em;
  margin-top: 10rpx;
}
</style>
