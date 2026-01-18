<template>
  <view class="content">
    <view class="setting">
      <image class="setting-icon" src="/static/imgs/setting.png" mode="scaleToFill" />
      <text>设置</text>
    </view>
    <view class="card">
      <view class="personal-info">
        <view class="avatar">
          <image class="avatar-img"
            src="https://p9-passport.byteacctimg.com/img/mosaic-legacy/3796/2975850990~120x256.image"
            mode="scaleToFill" />
        </view>
        <view class="info">
          <view class="name-sex">
            <image class="sex" src="/static/imgs/male.png" mode="scaleToFill" />
            <text class="name">账户名</text>
            <button size="mini" plain="true" class="info-setting">
              编辑资料
            </button>
          </view>
          <text class="sign">个性签名: 月下柳梢头，人约黄昏后。月下柳梢头，人约黄昏后。</text>
          <view class="birth">
            <text>生日: 2004-04-03</text>
          </view>
          <view class="gold">
            <image class="gold-icon" src="/static/imgs/financing.png" mode="scaleToFill" />
            <text>金币：$1300</text>
          </view>
        </view>
        <!-- <button size="mini" plain="true" class="info-setting">
          编辑资料
        </button> -->
        <!-- <view class="edit">修改个人资料</view> -->
      </view>
      <view class="personal-data">
        <view class="attr">
          <text class="attr-name">心智</text>
          <text class="attr-value">120</text>
        </view>
        <view class="attr">
          <text class="attr-name">体魄</text>
          <text class="attr-value">120</text>
        </view>
        <view class="level">
          <text class="level-value">12</text>
          <text class="level-name">等级</text>
        </view>
        <view class="attr">
          <text class="attr-name">社交</text>
          <text class="attr-value">120</text>
        </view>
        <view class="attr">
          <text class="attr-name">自律</text>
          <text class="attr-value">120</text>
        </view>
      </view>
      <view class="exp">
        <view class="exp-line">
          <text>EXP</text>
          <view class="exp-sum">
            <view class="exp-now"></view>
          </view>
        </view>
        <view class="exp-value">
          1200/2000
        </view>
      </view>
    </view>
    <view class="other-entry">
      <view class="entry-item achieve">
        <text>个人成就</text>
        <image class="entry-icon" src="/static/imgs/trophy.png" mode="scaleToFill" />
      </view>
      <view class="entry-item bag">
        <text>道具背包</text>
        <image class="entry-icon" src="/static/imgs/backpack.png" mode="scaleToFill" />
      </view>
    </view>
    <view class="card pet-entry">
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
  </view>
</template>

<script setup lang="ts">

</script>

<style>
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  height: 100vh;
  overflow: auto;
  background-color: #fef8e6;
}

.card {
  background-color: #fff;
  width: calc(100% - 60rpx);
  border-radius: 20rpx;
  box-shadow: 0 6rpx 10rpx #ccc;
  padding: 30rpx;
  margin: 30rpx 0;
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
    background-color: #fe7a24cc;
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

    .name-sex {
      display: flex;
      align-items: center;
      color: #000;
      margin-bottom: 8rpx;

      .sex {
        width: 35rpx;
        height: 35rpx;
        margin-right: 16rpx;
        vertical-align: middle;
      }

      .name {
        font-size: 36rpx;
        font-weight: bold;
      }

      .info-setting {
        height: 50rpx;
        padding: 0 0.5em;
        border: 2rpx solid #888;
        display: flex;
        align-items: center;
      }
    }

    .sign {
      margin-bottom: 8rpx;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
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
      font-weight: bold;
      color: #a98;
    }

    .attr-value {
      font-size: 32rpx;
      font-weight: bold;
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
    border: 6rpx solid #fe7a24cc;
    border-radius: 50%;
    width: 120rpx;
    height: 120rpx;

    .level-value {
      font-size: 32rpx;
      color: #100;
      font-weight: bold;
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
      width: 60%;
      height: 100%;
      background-color: #fe7a24cc;
      border-radius: 10rpx;
    }
  }

  .exp-value {
    text-align: right;
    margin-top: 5rpx;
    font-size: 28rpx;
    color: #888;
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
      font-weight: bold;
      margin-bottom: 20rpx;
    }

    .name {
      font-size: 32rpx;
      font-weight: bold;
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
  width: calc(100% - 60rpx);
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
    font-weight: bold;

    .entry-icon {
      width: 80rpx;
      height: 80rpx;
    }
  }

}

.ranks {
  background-color: #c9b183;
  flex: 1;
  width: 100%;
  margin: -100rpx 0 0 0;
  z-index: 1;
  padding-top: 100rpx;
  display: flex;
  align-items: center;
  justify-content: space-around;
  /* border-radius: 50% 0; */
  border-radius: 20rpx 20rpx 0 0;
  border: 6rpx solid #e1c695;
  padding-bottom: 140rpx;

  .rank-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: #a99574;
    border: 5rpx solid #e1c695;
    border-radius: 10rpx;
    width: 30%;
    height: 250rpx;

    .rank-icon {
      width: 50%;
      margin: 10rpx 0;
    }

    .title {
      font-size: 32rpx;
      font-weight: bold;
    }

    .position {
      font-size: 28rpx;
      font-weight: bold;
      color: #cdb271;
    }
  }
}
</style>