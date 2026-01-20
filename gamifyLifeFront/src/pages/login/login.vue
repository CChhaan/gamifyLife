<template>
  <div class="login">
    <view class="title">
      <text>GamifyLife</text>
    </view>
    <uni-forms :modelValue="formData">
      <uni-forms-item label="姓名" name="name">
        <uni-easyinput type="text" v-model="formData.name" placeholder="请输入姓名" />
      </uni-forms-item>
      <uni-forms-item label="年龄" name="age">
        <input type="text" v-model="formData.age" placeholder="请输入年龄" />
      </uni-forms-item>
      <uni-forms-item required name="hobby" label="兴趣爱好">
        <uni-data-checkbox multiple v-model="formData.hobby" :localdata="hobby" />
      </uni-forms-item>
    </uni-forms>
  </div>
</template>

<script lang="ts" setup>
import http from '@/utils/http';

const handleRegister = async() => {
  await http({
    url: "/api/auth/register",
    method: "POST",
    data: {
      account: "testuser",
      password: "testpassword",
      email: "testuser@example.com",
    },
  });
}
</script>

<style scoped></style>