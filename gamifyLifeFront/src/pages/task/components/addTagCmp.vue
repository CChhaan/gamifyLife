<template>
  <view class="cover">
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
        <u-form-item label="主属性" prop="primary_attr" :border-bottom="false">
          <u-input
            class="form-item"
            v-model="
              InfluenceAttrTextMap[addTagData.primary_attr as InfluenceAttr]
            "
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
        <button class="operation-btn" @click="confirm">确认</button>
        <button class="operation-btn" @click="$emit('cancel')">取消</button>
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
  </view>
</template>

<script setup lang="ts">
import {
  InfluenceAttrTextMap,
  type InfluenceAttr,
  type TaskTag,
} from "@/type/task";
import { ref } from "vue";

const addTagData = defineModel<TaskTag>({ default: () => ({}) });

const emit = defineEmits<{
  (e: "cancel"): void;
  (e: "addTag"): void;
}>();

const primaryAttrSelectShow = ref(false);
const secondaryAttrSelectShow = ref(false);
const taskTagForm = ref();
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
const attrList = Object.entries(InfluenceAttrTextMap)
  .filter(([key]) => key !== "")
  .map(([value, label]) => ({ value, label }));

const confirm = () => {
  taskTagForm.value?.validate(async (valid: boolean, errors: any[]) => {
    if (valid) {
      emit("addTag");
    } else {
      console.log("表单验证失败", errors);
    }
  });
};
</script>

<style scoped lang="scss">
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
  padding: 20rpx 40rpx;
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
