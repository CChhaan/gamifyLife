<template>
  <view class="tab-page personal-content flex flex-col flex-justify__start">
    <!-- 设置 -->
    <view
      class="setting flex flex-justify__center flex-col"
      @click="goToSetting"
    >
      <image
        class="setting-icon"
        src="/static/imgs/setting.png"
        mode="aspectFit"
      />
      <text>设置</text>
    </view>
    <!-- 个人信息 -->
    <view class="personal_card">
      <!-- 基本信息 -->
      <view class="w-full flex flex-justify__between">
        <view class="avatar circle flex flex-justify__center">
          <image
            class="img"
            :src="
              userInfo?.avatar_url ||
              'https://p9-passport.byteacctimg.com/img/mosaic-legacy/3796/2975850990~120x256.image'
            "
            mode="aspectFill"
          />
        </view>
        <view class="info flex flex-col flex-1 min-w-0 flex-align__start">
          <view class="name-sex flex w-full">
            <text class="name text-ellipsis w-full">{{
              userInfo?.nickname
            }}</text>
            <image
              v-if="userInfo?.gender == 1"
              class="sex"
              :src="`/static/imgs/${userInfo?.gender == 1 ? 'male' : 'female'}.png`"
              mode="scaleToFill"
            />
            <view v-else class="sex"></view>
          </view>
          <text class="sign text-ellipsis w-full">{{
            userInfo?.bio || "这个人很懒，什么都没有留下"
          }}</text>
          <view class="birth">
            <text>生日: {{ userInfo?.birthday || "- 年 - 月 - 日" }}</text>
          </view>
          <view class="flex">
            <image
              class="gold-icon"
              src="/static/imgs/financing.png"
              mode="scaleToFill"
            />
            <text>金币：${{ userGrowth?.gold }}</text>
          </view>
        </view>
      </view>
      <!-- 等级属性 -->
      <view class="info-data w-full flex flex-justify__between">
        <view class="attr flex flex-col">
          <text class="attr-name">心智</text>
          <text class="attr-value">{{ userGrowth?.mind }}</text>
        </view>
        <view class="attr flex flex-col">
          <text class="attr-name">体魄</text>
          <text class="attr-value">{{ userGrowth?.body }}</text>
        </view>
        <view class="level flex flex-col flex-justify__center">
          <text class="level-value">{{ userGrowth?.level }}</text>
          <text class="level-name">等级</text>
        </view>
        <view class="attr flex flex-col">
          <text class="attr-name">社交</text>
          <text class="attr-value">{{ userGrowth?.social }}</text>
        </view>
        <view class="attr flex flex-col">
          <text class="attr-name">自律</text>
          <text class="attr-value">{{ userGrowth?.discipline }}</text>
        </view>
      </view>
      <!-- 经验值 -->
      <view class="w-full">
        <view class="exp-value">
          exp: {{ userGrowth?.total_experience }}/{{ userGrowth?.nextLevelExp }}
        </view>
        <exp-line-cmp
          :total-experience="userGrowth?.total_experience"
          :next-level-exp="userGrowth?.nextLevelExp"
        />
      </view>
      <view class="info-setting w-full flex flex-justify__end">
        <button
          size="mini"
          class="info-setting-btn"
          @click="editInfoShow = true"
        >
          编辑资料
        </button>
      </view>
    </view>
    <!-- 其他功能入口 -->
    <view class="other-entry flex flex-justify__between">
      <view class="entry-item flex flex-justify__between">
        <text>个人成就</text>
        <image
          class="entry-icon"
          src="/static/imgs/trophy.png"
          mode="scaleToFill"
        />
      </view>
      <view
        class="entry-item flex flex-justify__between"
        @click="goToInventory"
      >
        <text>道具背包</text>
        <image
          class="entry-icon"
          src="/static/imgs/backpack.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <!-- 宠物入口 -->
    <view
      class="personal_card pet-entry flex flex-justify__between"
      @click="gotoPet"
    >
      <view class="pet-info flex flex-col flex-align__start">
        <view class="title">我的宠物</view>
        <view>
          <view>
            <text class="name">宠物名称</text>
            <view class="state healthy">健康</view>
          </view>
          <view>饱食度：80/100</view>
        </view>
      </view>
      <image class="pet-img" src="/static/pet_baby.png" mode="scaleToFill" />
    </view>
    <!-- 排行榜 -->
    <view class="ranks flex flex-justify__around flex-1 w-full">
      <div class="rank-item flex flex-col flex-justify__center">
        <text class="title">XXX排行榜</text>
        <image class="rank-icon" src="/static/imgs/medal.png" mode="widthFix" />
        <text class="position">第XXX名</text>
      </div>
      <div class="rank-item flex flex-col flex-justify__center">
        <text class="title">XXX排行榜</text>
        <image class="rank-icon" src="/static/imgs/medal.png" mode="widthFix" />
        <text class="position">第XXX名</text>
      </div>
      <div class="rank-item flex flex-col flex-justify__center">
        <text class="title">XXX排行榜</text>
        <image class="rank-icon" src="/static/imgs/medal.png" mode="widthFix" />
        <text class="position">第XXX名</text>
      </div>
    </view>
    <EditUserInfo
      @close="editInfoShow = false"
      @success="getUserInfo"
      v-if="editInfoShow"
      :userInfo="userInfo"
    />
  </view>
</template>

<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import EditUserInfo from "./editUserInfo.vue";
import { useUser } from "@/composables/useUser";
import ExpLineCmp from "@/components/ExpLine/ExpLine.vue";

const editInfoShow = ref(false);

const { userInfo, userGrowth, loadUserData, getUserInfo } = useUser();

const expWidth = computed(() => {
  if (!userGrowth.value) return 0;
  const exp = userGrowth.value.total_experience;
  const nextExp = userGrowth.value.nextLevelExp;
  return Math.min((exp / nextExp) * 100, 100);
});

onShow(async () => {
  await loadUserData();
});

const goToSetting = () => {
  uni.navigateTo({
    url: "/pages/setting/setting",
  });
};

const goToInventory = () => {
  uni.navigateTo({
    url: "/pages/inventory/inventory",
  });
};

const gotoPet = () => {
  uni.navigateTo({
    url: "/pages/pet/pet",
  });
};
</script>

<style scoped lang="scss">
.personal-content {
  overflow: auto;
}

.personal_card {
  background-color: var(--bg-color);
  width: 88vw;
  border-radius: 20rpx;
  box-shadow: var(--shadow);
  padding: 30rpx 40rpx;
  margin: 40rpx 0;
}

// 设置
.setting {
  position: fixed;
  top: 10rpx;
  right: 10rpx;
  box-shadow: var(--shadow);
  background-color: var(--bg-color);
  border-radius: 10rpx;
  padding: 10rpx 20rpx;
  font-size: var(--fontSize-small);

  .setting-icon {
    width: 40rpx;
    height: 40rpx;
  }
}

// 个人信息
.avatar {
  width: 180rpx;
  height: 180rpx;
}

.info {
  margin-left: 20rpx;
  color: var(--text-light-color);
  font-size: var(--fontSize-small);
  width: calc(100% - 200rpx);

  .name-sex {
    margin-bottom: 8rpx;
    padding-right: 50rpx;

    .name {
      font-size: var(--fontSize-big);
    }

    .sex {
      width: 45rpx;
      height: 45rpx;
      margin-left: 10rpx;
    }
  }

  .sign,
  .birth {
    margin-bottom: 8rpx;
  }

  .gold-icon {
    width: 36rpx;
    height: 36rpx;
    vertical-align: middle;
    margin-right: 10rpx;
  }
}

// 等级属性
.info-data {
  padding: 40rpx 0;

  .attr {
    background-color: #eec;
    padding: 10rpx 15rpx;
    border-radius: 20rpx;
    box-shadow: inset 0 2rpx 5rpx 3rpx #ddc;

    .attr-name {
      font-size: var(--fontSize-small);
      color: #a98;
    }

    .attr-value {
      font-size: var(--fontSize-normal);
      margin-top: 5rpx;
    }
  }

  .level {
    .level-value {
      font-size: var(--fontSize-big);
    }

    .level-name {
      color: #a98;
    }
  }
}

// 经验值
.exp-value {
  font-size: var(--fontSize-small);
  margin-bottom: 10rpx;
}

.info-setting {
  margin-top: 25rpx;

  .info-setting-btn {
    background-color: var(--primary-color);
    color: #fff;
    padding: 0 0.75em;
    margin: 0;
  }
}

// 其他功能入口
.other-entry {
  width: 88vw;
  margin: 10rpx 0;

  .entry-item {
    background-color: var(--bg-color);
    width: 48%;
    box-shadow: var(--shadow);
    border-radius: 20rpx;
    padding: 20rpx 40rpx;
    font-size: var(--fontSize-big);

    .entry-icon {
      width: 60rpx;
      height: 60rpx;
    }
  }
}

// 宠物入口
.pet-entry {
  padding: 20rpx 40rpx;
  z-index: 5;

  .pet-info {
    .title {
      font-size: var(--fontSize-big);
      margin-bottom: 20rpx;
    }

    .name {
      font-size: var(--fontSize-normal);
    }

    .state {
      display: inline-block;
      padding: 4rpx 15rpx;
      border-radius: 10rpx;
      margin-left: 15rpx;
    }

    .healthy {
      background-color: #cfc;
      color: #060;
      border: 2rpx solid #090;
    }
  }

  .pet-img {
    width: 200rpx;
    height: 250rpx;
  }
}

// 排行榜
.ranks {
  background: url("../../static/imgs/reward_bg.png") no-repeat;
  background-size: 100% 100%;
  margin: -120rpx 0 0 0;
  z-index: 1;
  padding: 120rpx 0 40rpx;
  border-radius: 20rpx 20rpx 0 0;

  .rank-item {
    background: url("../../static/imgs/rank_bg.png") no-repeat;
    background-size: 100% 100%;
    border-radius: 10rpx;
    width: 30%;
    height: 250rpx;

    .rank-icon {
      width: 50%;
      margin: 10rpx 0;
    }

    .title {
      font-size: var(--fontSize-normal);
    }

    .position {
      color: #cdb271;
    }
  }
}
</style>
