<template>
  <view class="personal-content">
    <view class="setting" @click="goToSetting">
      <image
        class="setting-icon"
        src="/static/imgs/setting.png"
        mode="scaleToFill"
      />
      <text>设置</text>
    </view>
    <view class="card">
      <view class="personal-info">
        <view class="avatar">
          <image
            v-if="!userInfo?.avatar_url"
            class="avatar-img"
            src="https://p9-passport.byteacctimg.com/img/mosaic-legacy/3796/2975850990~120x256.image"
            mode="scaleToFill"
          />
          <image
            v-else
            class="avatar-img"
            :src="userInfo?.avatar_url"
            mode="scaleToFill"
          />
        </view>
        <view class="info">
          <view class="name-sex">
            <text class="name">{{ userInfo?.nickname }}</text>
            <image
              v-if="userInfo?.gender == 1"
              class="sex"
              src="/static/imgs/male.png"
              mode="scaleToFill"
            />
            <image
              v-else-if="userInfo?.gender == 2"
              class="sex"
              src="/static/imgs/female.png"
              mode="scaleToFill"
            />
            <view v-else class="sex"></view>
          </view>
          <text class="sign">{{
            userInfo?.bio || "这个人很懒，什么都没有留下"
          }}</text>
          <view class="birth">
            <text>生日: {{ userInfo?.birthday || "- 年 - 月 - 日" }}</text>
          </view>
          <view class="gold">
            <image
              class="gold-icon"
              src="/static/imgs/financing.png"
              mode="scaleToFill"
            />
            <text>金币：${{ userGrowth?.gold }}</text>
          </view>
        </view>
      </view>
      <view class="personal-data">
        <view class="attr">
          <text class="attr-name">心智</text>
          <text class="attr-value">{{ userGrowth?.mind }}</text>
        </view>
        <view class="attr">
          <text class="attr-name">体魄</text>
          <text class="attr-value">{{ userGrowth?.body }}</text>
        </view>
        <view class="level">
          <text class="level-value">{{ userGrowth?.level }}</text>
          <text class="level-name">等级</text>
        </view>
        <view class="attr">
          <text class="attr-name">社交</text>
          <text class="attr-value">{{ userGrowth?.social }}</text>
        </view>
        <view class="attr">
          <text class="attr-name">自律</text>
          <text class="attr-value">{{ userGrowth?.discipline }}</text>
        </view>
      </view>
      <view class="exp">
        <view class="exp-value">
          {{ userGrowth?.total_experience }}/{{ userGrowth?.nextLevelExp }}
        </view>
        <view class="exp-line">
          <text>EXP</text>
          <view class="exp-sum">
            <view class="exp-now" :style="{ width: expWidth + '%' }"></view>
          </view>
        </view>
      </view>
      <view class="info-setting">
        <button
          size="mini"
          plain="true"
          class="info-setting-btn"
          @click="editInfoShow = true"
        >
          编辑资料
        </button>
      </view>
    </view>
    <view class="other-entry">
      <view class="entry-item achieve">
        <text>个人成就</text>
        <image
          class="entry-icon"
          src="/static/imgs/trophy.png"
          mode="scaleToFill"
        />
      </view>
      <view class="entry-item bag" @click="goToInventory">
        <text>道具背包</text>
        <image
          class="entry-icon"
          src="/static/imgs/backpack.png"
          mode="scaleToFill"
        />
      </view>
    </view>
    <view class="card pet-entry" @click="gotoPet">
      <view class="pet-info">
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
    <view class="ranks">
      <div class="rank-item">
        <text class="title">XXX排行榜</text>
        <image class="rank-icon" src="/static/imgs/medal.png" mode="widthFix" />
        <text class="position">第XXX名</text>
      </div>
      <div class="rank-item">
        <text class="title">XXX排行榜</text>
        <image class="rank-icon" src="/static/imgs/medal.png" mode="widthFix" />
        <text class="position">第XXX名</text>
      </div>
      <div class="rank-item">
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
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.personal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
  overflow: auto;
  background-color: var(--background-second-color);
}

.card {
  background-color: #fff;
  // width: calc(100% - 100rpx);
  width: 85vw;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 10rpx #ccc;
  padding: 30rpx;
  margin: 40rpx 0;
}

.setting {
  position: fixed;
  top: 10rpx;
  right: 10rpx;
  box-shadow: 0 2rpx 10rpx #aaa;
  background-color: #fff;
  border-radius: 10rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* width: 100rpx; */
  padding: 10rpx 20rpx;
  font-size: 24rpx;

  .setting-icon {
    width: 40rpx;
    height: 40rpx;
  }
}

.personal-info {
  display: flex;
  padding-bottom: 20rpx;
  justify-content: space-between;
  align-items: center;
  width: 100%;

  .avatar {
    width: 180rpx;
    height: 180rpx;
    // background-color: var(--primary-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;

    .avatar-img {
      width: 170rpx;
      height: 170rpx;
      border: 5rpx solid #fed;
      border-radius: 50%;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
    margin-left: 20rpx;
    color: #888;
    font-size: 28rpx;
    width: calc(100% - 200rpx);

    .name-sex {
      display: flex;
      align-items: center;
      color: #000;
      margin-bottom: 8rpx;
      padding-right: 50rpx;

      .name {
        font-size: 36rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        max-width: calc(100% - 50rpx);
        // font-weight: bold;
      }

      .sex {
        width: 35rpx;
        height: 35rpx;
        margin-left: 10rpx;
        // vertical-align: middle;
      }
    }

    .sign {
      margin-bottom: 8rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      // white-space: nowrap;
    }

    .birth {
      display: flex;
      justify-content: space-between;
      margin-bottom: 8rpx;
    }

    .gold {
      display: flex;
      align-items: center;
      color: #000;

      .gold-icon {
        width: 36rpx;
        height: 36rpx;
        vertical-align: middle;
        margin-right: 10rpx;
      }
    }
  }
}

.personal-data {
  padding: 20rpx 0;
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;

  .attr {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #eec;
    padding: 10rpx 20rpx;
    border-radius: 20rpx;
    box-shadow: inset 0 2rpx 5rpx 3rpx #ddc;

    .attr-name {
      font-size: 24rpx;
      // font-weight: bold;
      color: #a98;
    }

    .attr-value {
      font-size: 32rpx;
      // font-weight: bold;
      color: #100;
      margin-top: 5rpx;
    }
  }

  .level {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 120rpx;

    .level-value {
      font-size: 32rpx;
      color: #100;
      // font-weight: bold;
    }

    .level-name {
      font-size: 24rpx;
      color: #a98;
    }
  }
}

.exp {
  width: 100%;

  .exp-line {
    width: 100%;
    display: flex;
    align-items: center;

    .exp-sum {
      flex: 1;
      height: 20rpx;
      background-color: #eed;
      border-radius: 10rpx;
      margin-left: 20rpx;
      box-shadow: 0 2rpx 5rpx #ccc;
    }

    .exp-now {
      height: 100%;
      background-color: var(--primary-color);
      border-radius: 10rpx;
    }
  }

  .exp-value {
    text-align: left;
    margin-left: 3em;
    font-size: 28rpx;
    color: #888;
  }
}

.info-setting {
  width: 100%;
  height: 60rpx;
  display: flex;
  justify-content: flex-end;
  margin-top: 10rpx;

  .info-setting-btn {
    width: 6em;
    padding: 0;
    border: 2rpx solid #888;
    display: flex;
    font-size: 24rpx;
    align-items: center;
    justify-content: center;
  }
}

.pet-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  /* overflow: hidden; */
  padding: 20rpx 40rpx;
  z-index: 5;

  .pet-info {
    display: flex;
    flex-direction: column;

    .title {
      font-size: 40rpx;
      // font-weight: bold;
      margin-bottom: 20rpx;
    }

    .name {
      font-size: 32rpx;
      // font-weight: bold;
    }

    .state {
      display: inline-block;
      padding: 4rpx 15rpx;
      border-radius: 10rpx;
      font-size: 28rpx;
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

.other-entry {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // width: calc(100% - 70rpx);
  width: 85vw;
  margin: 10rpx 0;

  .entry-item {
    background-color: #fff;
    width: 48%;
    box-shadow: 0 6rpx 10rpx #ccc;
    border-radius: 20rpx;
    padding: 20rpx 40rpx;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 36rpx;
    // font-weight: bold;

    .entry-icon {
      width: 60rpx;
      height: 60rpx;
    }
  }
}

.ranks {
  background: url("../../static/imgs/reward_bg.png") no-repeat;
  background-size: 100% 100%;
  flex: 1;
  width: 100%;
  margin: -120rpx 0 0 0;
  z-index: 1;
  padding: 120rpx 0 180rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  border-radius: 20rpx 20rpx 0 0;

  .rank-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
      font-size: 32rpx;
      // font-weight: bold;
    }

    .position {
      font-size: 28rpx;
      // font-weight: bold;
      color: #cdb271;
    }
  }
}
</style>
