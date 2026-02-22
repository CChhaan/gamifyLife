<template>
  <div class="login flex flex-col flex-justify__center">
    <view class="title">
      <image class="img" src="../../static//imgs/logo.png" mode="scaleToFill" />
    </view>
    <div class="form flex flex-col flex-justify__center">
      <auth-form
        v-if="page == 'login'"
        v-model="loginFormData"
        :auth-rules="commonRules"
        btn-text="登录"
        @submit="handleLogin"
        :items="[
          {
            prop: 'account',
            icon: 'account',
            placeholder: '请输入账号或邮箱',
          },
          {
            prop: 'password',
            icon: 'lock',
            placeholder: '请输入密码',
            type: 'password',
          },
        ]"
      />
      <auth-form
        v-else-if="page == 'register'"
        v-model="registerFormData"
        :auth-rules="registerRules"
        btn-text="注册"
        @submit="handleRegister"
        :items="[
          {
            prop: 'account',
            icon: 'account',
            placeholder: '请输入账号',
          },
          {
            prop: 'email',
            icon: 'email',
            placeholder: '请输入邮箱',
          },
          {
            prop: 'password',
            icon: 'lock',
            placeholder: '请输入密码',
            type: 'password',
          },
          {
            prop: 'confirmPassword',
            icon: 'lock',
            placeholder: '请确认密码',
            type: 'password',
          },
        ]"
      />
      <view class="tip">
        <button plain class="tip-button" @click="handlePageChange">
          {{ page == "login" ? "没有账号？去注册" : "已有账号？去登录" }}
        </button>
      </view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AuthForm from "@/components/Form/AuthForm.vue";
import { setToken } from "@/utils/auth";
import http from "@/utils/http";
import { ref } from "vue";

const page = ref<string>("login");
const commonRules = {
  account: [
    {
      required: true,
      message: "请输入账号",
    },
  ],
  password: [
    {
      required: true,
      message: "请输入密码",
    },
  ],
};

const handlePageChange = () => {
  page.value = page.value == "login" ? "register" : "login";
};

// 登录
const loginFormData = ref({
  account: "",
  password: "",
});

const handleLogin = async () => {
  try {
    const data = {
      [loginFormData.value.account.includes("@") ? "email" : "account"]:
        loginFormData.value.account,
      password: loginFormData.value.password,
    };
    const token = await http({
      url: "/auth/login",
      method: "POST",
      data,
    });
    uni.showToast({ title: "登录成功", icon: "success" });
    setToken(token);
    uni.switchTab({ url: "/pages/index/index" });
  } catch (error) {
    console.error("更新失败", error);
  }
};

// 注册
const registerFormData = ref({
  ...loginFormData.value,
  email: "",
  confirmPassword: "",
});

const registerRules = {
  ...commonRules,
  email: [
    {
      required: true,
      message: "请输入邮箱",
    },
    {
      format: "email",
      message: "请输入正确的邮箱",
    },
  ],
  confirmPassword: [
    {
      required: true,
      message: "请确认密码",
    },
    {
      validator: (rule: any, value: string) => {
        if (value !== registerFormData.value.password) {
          return false;
        }
        return true;
      },
      message: "两次输入的密码不一致",
    },
  ],
};

const handleRegister = async () => {
  try {
    await http({
      url: "/auth/register",
      method: "POST",
      data: registerFormData.value,
    });
    uni.showToast({
      title: "注册成功，请登录",
      icon: "none",
    });
    page.value = "login";
  } catch (error) {
    console.error("注册失败", error);
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100vh;
  background-color: var(--bg-third-color);
}

.title {
  width: 600rpx;
  height: 206rpx;
  font-size: var(--fontSize-large);
  font-weight: bold;
  margin-bottom: 40rpx;
}

.form {
  width: 75%;
  padding: 80rpx 40rpx;
  background-color: var(--bg-second-color);
  border-radius: 16rpx;
  border-top: 6rpx solid #f9f9f0;
  border-bottom: 6rpx solid #eddebb;
  box-shadow: var(--shadow);

  .tip {
    margin-top: 30rpx;

    .tip-button {
      border: 0;
      color: var(--contrast-color);
    }
  }
}
</style>
