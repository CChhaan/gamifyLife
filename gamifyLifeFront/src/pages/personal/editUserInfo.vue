<template>
  <view>
    <view class="cover"></view>
    <view class="modal user-info-edit_content">
      <view class="user-info-edit_head">
        <view class="title">编辑个人资料</view>
        <view
          class="close flex flex-justify__center circle"
          @click="$emit('close')"
        >
          <u-icon name="close" color="#fff" size="25"></u-icon>
        </view>
      </view>
      <view class="user-info-edit_form">
        <u-form
          :model="userInfoFormData"
          ref="userInfoForm"
          :rules="userInfoRules"
          label-width="140"
        >
          <u-form-item label="昵称" prop="nickname" :border-bottom="false">
            <u-input
              class="form-item"
              v-model="userInfoFormData.nickname"
              placeholder="请输入昵称"
              border
            />
          </u-form-item>
          <u-form-item label="个性签名" prop="bio" :border-bottom="false">
            <u-input
              class="form-item"
              v-model="userInfoFormData.bio"
              placeholder="请输入个性签名"
              border
            />
          </u-form-item>
          <u-form-item label="性别" prop="gender" :border-bottom="false">
            <u-radio-group
              v-model="userInfoFormData.gender"
              @change="(val) => (userInfoFormData.gender = Number(val))"
            >
              <u-radio
                v-for="(item, index) in genderRange"
                :key="index"
                :name="item.value"
              >
                {{ item.text }}
              </u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item label="生日" prop="birthday" :border-bottom="false">
            <u-input
              class="form-item"
              v-model="birthdayText"
              type="select"
              @click="calendarShow = true"
              border
              placeholder="请选择生日"
            >
            </u-input>
          </u-form-item>
        </u-form>
        <view class="form-btn-group flex flex-justify__around">
          <button class="form-button" @click="handlerSave">保存</button>
          <button class="form-button cancel" @click="$emit('close')">
            取消
          </button>
        </view>
      </view>
    </view>
    <u-picker
      mode="time"
      v-model="calendarShow"
      :params="{
        year: true,
        month: true,
        day: true,
      }"
      confirm-text="确定"
      cancel-text="取消"
      :end-year="dayjs().year() - 1"
      @confirm="handlerBirthChange"
    ></u-picker>
  </view>
</template>

<script setup lang="ts">
import { type UserInfo } from "@/type/user";
import http from "@/utils/http";
import { onShow } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { computed, ref } from "vue";

const props = defineProps<{
  userInfo: UserInfo | null;
}>();

const emit = defineEmits<{
  (e: "close"): void;
  (e: "success"): void;
}>();

const userInfoForm = ref();

const userInfoRules = {};

const userInfoFormData = ref<UserInfo>({
  nickname: "",
  gender: 0,
  birthday: null,
  bio: null,
});

onShow(() => {
  props.userInfo && (userInfoFormData.value = { ...props.userInfo });
});

const genderRange = ref([
  {
    text: "男",
    value: 1,
  },
  {
    text: "女",
    value: 2,
  },
  {
    text: "保密",
    value: 0,
  },
]);

const calendarShow = ref(false);
const birthdayText = computed(() =>
  userInfoFormData.value.birthday
    ? dayjs(userInfoFormData.value.birthday).format("YYYY年MM月DD日")
    : "",
);

const handlerBirthChange = (e: any) => {
  userInfoFormData.value.birthday = dayjs(
    `${e.year}-${e.month}-${e.day}`,
  ).toDate();
};

const handlerSave = async () => {
  userInfoForm.value?.validate(async (valid: boolean, errors: any[]) => {
    if (valid) {
      try {
        await http.post("userInfo/updateUserInfo", {
          ...userInfoFormData.value,
        });
        emit("success"); // 先触发success事件
        setTimeout(() => {
          emit("close"); // 延迟关闭弹窗，确保父组件有时间处理success事件
        }, 500);
        uni.showToast({ title: "更新成功", icon: "success", duration: 2000 });
      } catch (error) {
        console.error("更新失败", error);
      }
    } else {
      console.log("表单验证失败", errors);
    }
  });
};
</script>

<style scoped lang="scss">
.cover {
  z-index: 10;
}

.user-info-edit_content {
  width: 90vw;
  border-radius: 16rpx;
  padding: 20rpx 25rpx 30rpx;
  z-index: 15;
}

.user-info-edit_head {
  margin-bottom: 20rpx;
  .title {
    font-size: var(--fontSize-big);
    text-align: center;
  }

  .close {
    width: 50rpx;
    height: 50rpx;
    position: absolute;
    top: 25rpx;
    right: 30rpx;
    background-color: var(--primary-color);
  }
}

.user-info-edit_form {
  width: 100%;
  border-radius: 20rpx;
  padding: 20rpx;
  .form-item {
    background-color: #fff;
  }

  .form-btn-group {
    margin-top: 20rpx;
  }

  .form-button {
    background-color: var(--primary-color);
    color: #fff;
    border-radius: 20rpx;
    box-shadow: var(--shadow);
    font-size: var(--fontSize-normal);
    line-height: 2.2;
    padding: 0 2em;
  }
  .cancel {
    background-color: var(--contrast-color);
  }
}

:deep(.u-radio__icon-wrap) {
  background-color: #fff;
}
</style>
