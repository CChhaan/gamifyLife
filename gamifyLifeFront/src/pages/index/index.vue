<template>
  <movable-area class="index-content">
    <view class="card personal-data">
      <view class="info">
        <view class="left">
          <view class="avatar">
            <image
              class="avatar-img"
              src="https://p9-passport.byteacctimg.com/img/mosaic-legacy/3796/2975850990~120x256.image"
              mode="scaleToFill"
            />
          </view>
          <view class="center">
            <view class="username">
              <text class="username-text">{{ userInfo?.nickname }}</text>
            </view>
            <view class="level">
              <text>Lv. {{ userGrowth?.level }}</text>
            </view>
          </view>
        </view>
        <view class="more">
          <button
            size="mini"
            plain="true"
            class="personal-more"
            @click="goToPersonal"
          >
            查看详情
          </button>
        </view>
      </view>
      <view class="exp">
        <view class="data">
          <view class="exp-data">
            <text>
              exp: {{ userGrowth?.total_experience }}/{{
                userGrowth?.nextLevelExp
              }}
            </text>
          </view>
          <view class="gold-data">
            <text> $ {{ userGrowth?.gold }} </text>
          </view>
        </view>
        <view class="exp-line">
          <view class="now" :style="{ width: expWidth + '%' }"></view>
        </view>
      </view>
      <view class="attr-data">
        <view
          class="attr-item"
          v-for="(name, key) in InfluenceAttrTextMap"
          :key="key"
        >
          <view class="attr-item-name">
            <image :src="`/static/imgs/${key}.png`" class="attr-item-icon" />
            <text>{{ name }}</text>
          </view>
          <text>{{ userGrowth?.[key] }}</text>
        </view>
      </view>
    </view>
    <view class="task-category">
      <view
        class="task-category-item"
        :class="selectedCategory == 'all' && 'selected'"
        @click="selectedCategory = 'all'"
        ><text class="task-category-item-text">全部</text></view
      >
      <view
        class="task-category-item"
        :class="selectedCategory == value.id && 'selected'"
        v-for="value in taskCategories?.slice(0, 3)"
        :key="value.id"
        @click="selectedCategory = value.id"
      >
        <text class="task-category-item-text">{{ value.name }}</text>
      </view>
      <view class="task-category-item" @click="gotoTask">
        <text class="task-category-item-text">更多</text>
      </view>
    </view>
    <view class="card task-data">
      <view class="tasks">
        <view
          class="task-item"
          v-for="task in taskList"
          :key="task.id"
          @click="gotoTaskDetail(task.id)"
        >
          <text class="task-item-text">{{ task.title }}</text>
          <view>
            <u-icon name="arrow-right-double" color="#aaa" size="28"></u-icon
          ></view>
        </view>
      </view>
      <view class="more">
        <button size="mini" class="task-more" @click="gotoTask">
          查看更多
        </button>
      </view>
    </view>
    <FloatPet />
  </movable-area>
</template>

<script setup lang="ts">
import FloatPet from "@/components/FloatPet.vue/FloatPet.vue";
import { useUser } from "@/composables/useUser";
import { onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";
import { InfluenceAttrTextMap } from "@/type/task";
import { useTask } from "@/composables/useTask";

const { userInfo, userGrowth, loadUserData } = useUser();
const { taskCategories, taskList, loadTaskData } = useTask();
onShow(async () => {
  await loadUserData();
  await loadTaskData();
});
const selectedCategory = ref<number | string>("all");

const expWidth = computed(() => {
  if (!userGrowth.value) return 0;
  const exp = userGrowth.value.total_experience;
  const nextExp = userGrowth.value.nextLevelExp;
  return Math.min((exp / nextExp) * 100, 100);
});

const goToPersonal = () => {
  uni.switchTab({ url: "/pages/personal/personal" });
};

const gotoTask = () => {
  uni.switchTab({ url: "/pages/task/task" });
};

const gotoTaskDetail = (id: number) => {
  uni.switchTab({ url: `/pages/task/task?id=${id}` });
};
</script>

<style scoped lang="scss">
* {
  box-sizing: border-box;
  padding: 0;
  margin: 0;
}

.index-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 140rpx;
  width: 100vw;
  height: 100vh;
  background-color: var(--background-color);
}

.card {
  background-color: #fff;
  width: 85vw;
  border-radius: 20rpx;
  box-shadow: 0 6rpx 10rpx #ccc;
  padding: 30rpx;
}

.personal-data {
  height: 35vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  .info {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .left {
      display: flex;
      align-items: center;

      .avatar {
        width: 120rpx;
        height: 120rpx;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        .avatar-img {
          width: 120rpx;
          height: 120rpx;
          border-radius: 50%;
        }
      }

      .center {
        margin-left: 30rpx;
        font-size: 36rpx;

        .username {
          .username-text {
            display: inline-block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            width: 35vw;
            vertical-align: middle;
          }
        }
      }
    }

    .personal-more {
      border: 2rpx solid #888;
      padding: 0 0.75em;
      display: flex;
      align-items: center;
    }
  }

  .exp {
    width: 100%;

    .data {
      width: 100%;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10rpx;
      font-size: 28rpx;
    }

    .exp-line {
      width: 100%;
      background-color: #e2ecf8;
      height: 20rpx;
      border-radius: 10rpx;
      box-shadow: 0 2rpx 5rpx #ccc;

      .now {
        height: 100%;
        background-color: var(--primary-color);
        border-radius: 10rpx;
      }
    }
  }

  .attr-data {
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20rpx;

    .attr-item {
      /* font-size: 38rpx; */
      width: 47%;
      padding: 10rpx 20rpx;
      border-radius: 10rpx;
      box-shadow: 0 4rpx 10rpx #ccc;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 20rpx;

      .attr-item-name {
        display: flex;
        align-items: center;
        gap: 15rpx;

        .attr-item-icon {
          width: 45rpx;
          height: 45rpx;
        }
      }
    }
  }
}

.task-category {
  width: 85vw;
  display: flex;
  align-items: center;
  // justify-content: space-between;
  overflow: auto;
  gap: 15rpx;
  padding: 20rpx 0;
  margin: 20rpx 0;

  .task-category-item {
    border-radius: 20rpx;
    background-color: #fcfcfc;
    border-radius: 20rpx;
    font-size: 28rpx;
    box-shadow: 0 6rpx 10rpx #ccc;
    padding: 20rpx;
  }

  .task-category-item-text {
    white-space: nowrap;
  }

  .selected {
    background-color: var(--primary-color);
    color: #fff;
  }

  .more {
    background-color: #d0d0d0;
  }
}

.task-data {
  height: 35vh;
  /* box-shadow: inset 0 0 0 10rpx var(--primary-color)cc; */
  border-top: 14rpx solid var(--primary-color) cc;
  padding-top: 10rpx;
  padding-bottom: 15rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;

  .tasks {
    height: 80%;
    width: 100%;
    overflow: auto;
  }

  .task-item {
    padding: 20rpx;
    border-bottom: 2rpx solid #ddd;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    .task-item-text {
      line-height: 1.5;
      white-space: nowrap;
      width: 85%;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: middle;

      &::before {
        content: " ";
        display: inline-block;
        width: 10rpx;
        height: 28rpx;
        background-color: var(--primary-color);
        margin-right: 20rpx;
      }
    }
  }

  .more {
    /* margin: 15rpx; */
    text-align: center;
    font-size: 28rpx;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .task-more {
      background-color: var(--primary-color);
      color: #fff;
      border-radius: 20rpx;
      font-size: 30rpx;
    }
  }
}
</style>
