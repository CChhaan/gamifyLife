<template>
  <div class="login">
    <view class="title">
      <text>GamifyLife</text>
    </view>
    <div class="form">
      <view class="login-form" v-if="page == 'login'">
        <uni-forms :modelValue="loginFormData" label-width="0" :rules="loginRules" ref="loginForm">
          <uni-forms-item name="account">
            <uni-easyinput placeholderStyle="font-size:32rpx" prefixIcon="person" type="text"
              v-model="loginFormData.account" placeholder="请输入账号或邮箱" trim />
          </uni-forms-item>
          <uni-forms-item class="form-item" name="password">
            <uni-easyinput placeholderStyle="font-size:32rpx" type="password" prefixIcon="locked"
              v-model="loginFormData.password" placeholder="请输入密码" trim />
          </uni-forms-item>
        </uni-forms>
        <button class="form-button" @click="handleLogin">登录</button>
      </view>
      <view class="register-form" v-else-if="page == 'register'">
        <uni-forms :modelValue="registerFormData" label-width="0" ref="registerForm" :rules="registerRules"
          validate-trigger="blur">
          <uni-forms-item name="account">
            <uni-easyinput placeholderStyle="font-size:32rpx" prefixIcon="person" type="text"
              v-model="registerFormData.account" placeholder="请输入账号" trim />
          </uni-forms-item>
          <uni-forms-item name="email">
            <uni-easyinput placeholderStyle="font-size:32rpx" prefixIcon="email" type="text"
              v-model="registerFormData.email" placeholder="请输入邮箱" trim />
          </uni-forms-item>
          <uni-forms-item class="form-item" name="password">
            <uni-easyinput placeholderStyle="font-size:32rpx" type="password" prefixIcon="locked"
              v-model="registerFormData.password" placeholder="请输入密码" trim />
          </uni-forms-item>
        </uni-forms>
        <button class="form-button" @click="handleRegister">注册</button>
      </view>
      <view class="tip">
        <button plain type="primary" class="tip-button" @click="handlePageChange">
          {{ page == 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
        </button>
      </view>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { setToken } from '@/utils/auth';
import http from '@/utils/http';
import { ref } from 'vue';

const page = ref('login')
const loginForm = ref(null)
const registerForm = ref(null)

const loginFormData = ref({
  account: '',
  password: ''
})

const registerFormData = ref({
  account: '',
  email: '',
  password: ''
})

const loginRules = {
  account: {
    rules: [
      {
        required: true,
        errorMessage: '请输入账号',
      }
    ]
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: '请输入密码',
      }
    ]
  }
}

const registerRules = {
  account: {
    rules: [
      {
        required: true,
        errorMessage: '请输入账号',
      }
    ]
  },
  email: {
    rules: [
      {
        required: true,
        errorMessage: '请输入邮箱',
      },
      {
        format: 'email',
        errorMessage: '请输入正确的邮箱',
      }
    ]
  },
  password: {
    rules: [
      {
        required: true,
        errorMessage: '请输入密码',
      }
    ]
  }
}

const handleLogin = async () => {
  try {
    await loginForm.value.validate();
    const token = await http({
      url: "/api/auth/login",
      method: "POST",
      data: loginFormData.value,
    });
    uni.showToast({ title: '登录成功', icon: 'success', duration: 2000 });
    setToken(token)
  } catch (err) {
    // 校验失败或请求失败
    console.log('校验或请求错误', err);
  }
}
const handleRegister = async () => {
  try {
    await registerForm.value.validate();
    await http({
      url: "/api/auth/register",
      method: "POST",
      data: registerFormData.value,
    });
    uni.showToast({ title: '注册成功，请登录', icon: 'none', duration: 2000 });
    page.value = 'login';
  } catch (err) {
    // 校验失败或请求失败
    console.log('校验或请求错误', err);
  }
}

const handlePageChange = () => {
  page.value = page.value == 'login' ? 'register' : 'login'
}
</script>

<style scoped lang="scss">
.login {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f8f7e6;
}

.title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
}

.form {
  width: 75%;
  padding: 80rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8f2de;
  border-radius: 16rpx;
  border-top: 6rpx solid #f9f9f0;
  border-bottom: 6rpx solid #eddebb;
  box-shadow: 0 4rpx 16rpx #e4d4b7;

  .form-button {
    background-color: #ea9554;
    color: #fff;
    border-radius: 30rpx;
    box-shadow: 0 4rpx 16rpx #ea9554cc;
  }

  .tip {
    margin-top: 30rpx;

    .tip-button {
      border: none;
    }
  }
}

:deep(.is-input-border) {
  border-radius: 20rpx;
  overflow: hidden;
  padding: 10rpx;
  border: 3rpx solid #c6c0b3 !important;
  box-shadow: inset 0 0 4rpx 5rpx #f5f5f5;

  .uni-icons {
    color: #aaa !important;
  }
}

:deep(.uni-easyinput__content-input) {
  font-size: 32rpx;
  padding-left: 10rpx;
}
</style>