<template>
    <view>
        <view class="edit-user-info">
            <view class="title">编辑个人资料</view>
            <view class="close" @click="$emit('close')">
                <image class="close-icon" src="/static/imgs/close.png" mode="scaleToFill" />
            </view>
            <view class="form">
                <u-form :model="userInfoFormData" ref="userInfoForm" :rules="userInfoRules" label-width="140"
                    label-align="center">
                    <u-form-item label="昵称" prop="nickname" :border-bottom="false">
                        <u-input class="form-item" v-model="userInfoFormData.nickname" placeholder="请输入昵称" border />
                    </u-form-item>
                    <u-form-item label="个性签名" prop="bio" :border-bottom="false">
                        <u-input class="form-item" v-model="userInfoFormData.bio" placeholder="请输入个性签名" border />
                    </u-form-item>
                    <u-form-item label="性别" prop="gender" :border-bottom="false">
                        <u-radio-group v-model="userInfoFormData.gender"
                            @change="val => userInfoFormData.gender = Number(val)">
                            <u-radio v-for="(item, index) in genderRange" :key="index" :name="item.value">
                                {{ item.text }}
                            </u-radio>
                        </u-radio-group>
                    </u-form-item>
                    <u-form-item label="生日" prop="birthday" :border-bottom="false">
                        <u-input class="form-item" v-model="birthdayText" type="select" @click="calendarShow = true"
                            border placeholder="请选择生日">
                        </u-input>
                    </u-form-item>
                </u-form>
                <view class="form-btn-group">
                    <button class="form-button" @click="handlerSave">保存</button>
                    <button class="form-button" @click="$emit('close')">取消</button>
                </view>
            </view>
        </view>
        <u-picker mode="time" v-model="calendarShow" :params="{
            year: true,
            month: true,
            day: true,
        }" confirm-text="确定" cancel-text="取消" :end-year="dayjs().year() - 1" @confirm="handlerBirthChange"></u-picker>
    </view>
</template>

<script setup lang="ts">
import { type UserInfo } from "@/type/user";
import http from "@/utils/http";
import { onShow } from "@dcloudio/uni-app";
import dayjs from "dayjs";
import { computed, ref } from "vue";


const props = defineProps<{
    userInfo: UserInfo | null
}>();

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'success'): void
}>();

const birthdayText = computed(() =>
    userInfoFormData.value.birthday ? dayjs(userInfoFormData.value.birthday).format('YYYY年MM月DD日') : ''
);

const userInfoForm = ref();



const userInfoFormData = ref<UserInfo>({
    nickname: '',
    gender: 0,
    birthday: null,
    bio: null,
});
onShow(() => {
    if (props.userInfo) {
        userInfoFormData.value = { ...props.userInfo };
    }
})
const calendarShow = ref(false);

const genderRange = ref([
    {
        text: '男',
        value: 1
    },
    {
        text: '女',
        value: 2
    },
    {
        text: '保密',
        value: 0
    }
])

const userInfoRules = {

}

const handlerBirthChange = (e: any) => {
    userInfoFormData.value.birthday = dayjs(`${e.year}-${e.month}-${e.day}`).toDate();
}

const handlerSave = async () => {
    userInfoForm.value?.validate(async (valid: boolean, errors: any[]) => {
        if (valid) {
            try {
                await http({
                    url: '/api/userInfo/updateUserInfo',
                    method: 'POST',
                    data: {
                        ...userInfoFormData.value
                    }
                })
                emit('success');
                uni.showToast({ title: '更新成功', icon: 'success', duration: 2000 });
            } catch (error) {
                console.error('更新失败', error);
            }
        } else {
            console.log('表单验证失败', errors);
        }
    });

    emit('close');
}
</script>

<style scoped lang="scss">
.edit-user-info {
    width: 90vw;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #f8f2de;
    border-radius: 16rpx;
    border-top: 6rpx solid #f9f9f0;
    border-bottom: 6rpx solid #eddebb;
    box-shadow: 0 4rpx 16rpx #e4d4b7;
    padding: 20rpx;
    z-index: 10;
}

.title {
    font-size: 32rpx;
    text-align: center;
}

.close {
    width: 40rpx;
    height: 40rpx;
    position: absolute;
    top: 20rpx;
    right: 30rpx;
    font-size: 28rpx;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    background-color: #fe7a24;
    border-radius: 50%;

    .close-icon {
        width: 30rpx;
        height: 30rpx;
    }
}

.form {
    margin-top: 20rpx;

    .form-item {
        background-color: #fff;
        border: 3rpx solid #c6c0b3;
    }

    .birth-choose {
        padding: 10rpx;
        font-size: 28rpx;
        color: #999;
        background-color: #fff;
        border-radius: 5rpx;
        border: 3rpx solid #c6c0b3;
    }

    .form-btn-group {
        display: flex;
        justify-content: space-around;
        margin-top: 20rpx;
    }

    .form-button {
        background-color: #fe7a24;
        color: #fff;
        border-radius: 25rpx;
        box-shadow: 0 4rpx 16rpx #ea9554;
        font-size: 32rpx;
        line-height: 2;
        padding: 0 1.5em;
        height: auto;
    }
}

:deep(.u-radio__icon-wrap) {
    background-color: #fff;
}
</style>