<template>
  <movable-area class="tab-page flex flex-col flex-justify__center">
    <!-- 用户卡片 -->
    <view class="index_card user-card flex flex-col flex-justify__between">
      <!-- 基本信息 -->
      <view class="user-card_info flex flex-justify__between w-full">
        <view class="flex flex-1 overflow-hidden">
          <view class="avatar circle flex flex-justify__center flex-shrink-0">
            <image
              class="img"
              src="https://p9-passport.byteacctimg.com/img/mosaic-legacy/3796/2975850990~120x256.image"
              mode="scaleToFill"
            />
          </view>
          <view class="user-info min-w-0 flex-1">
            <view class="w-full">
              <text class="user-name text-ellipsis w-full">{{
                userInfo?.nickname
              }}</text>
            </view>
            <view>
              <text class="level">Lv. {{ userGrowth?.level }}</text>
            </view>
          </view>
        </view>
        <button
          size="mini"
          class="personal-more flex-shrink-0"
          @click="goToPersonal"
        >
          查看详情
        </button>
      </view>
      <!-- 经验值 -->
      <view class="user-card_exp w-full">
        <view class="exp-data w-full flex flex-justify__between">
          <view>
            <text>
              exp: {{ userGrowth?.total_experience }}/{{
                userGrowth?.nextLevelExp
              }}
            </text>
          </view>
          <view>
            <text> $ {{ userGrowth?.gold }} </text>
          </view>
        </view>
        <exp-line-cmp
          :total-experience="userGrowth?.total_experience"
          :next-level-exp="userGrowth?.nextLevelExp"
        />
      </view>
      <!-- 属性值 -->
      <view class="user-card_attr w-full flex flex-justify__between">
        <view
          class="attr-item flex flex-justify__between"
          v-for="(name, key) in InfluenceAttrTextMap"
          :key="key"
        >
          <view class="flex">
            <image
              :src="`/static/imgs/icons/${key}.png`"
              class="attr-item-icon"
            />
            <text>{{ name }}</text>
          </view>
          <text>{{ userGrowth?.[key] }}</text>
        </view>
      </view>
      <view>
        <view
          >今日高质量任务完成：{{
            userGrowth?.today_high_value_task_count
          }}</view
        >
        <view
          >今日任务完成：{{ userGrowth?.today_task_completion_count }} /
          20</view
        >
      </view>
    </view>
    <!-- 任务分类 -->
    <view class="task-category-list flex">
      <view
        class="task-category flex-shrink-0"
        :class="{ selected: selectedCategory == 'all' }"
        @click="selectedCategory = 'all'"
      >
        <text>全部</text>
      </view>
      <view
        class="task-category flex-shrink-0"
        :class="selectedCategory == value.id && 'selected'"
        v-for="value in taskCategories?.slice(0, 3)"
        :key="value.id"
        @click="selectedCategory = value.id"
      >
        <text>{{ value.name }}</text>
      </view>
      <view
        class="task-category more flex-shrink-0"
        v-if="taskCategories && taskCategories.length > 3"
        @click="gotoTask"
      >
        <text>更多</text>
      </view>
    </view>
    <!-- 任务列表 -->
    <view class="index_card task-data flex flex-col flex-justify__between">
      <view class="task-data_task-list w-full">
        <view
          class="task flex flex-justify__between w-full"
          v-for="task in taskList"
          :key="task.id"
          @click="gotoTask"
        >
          <text class="task-text text-ellipsis w-full">{{ task.title }}</text>
          <u-icon name="arrow-right-double" color="#aaa" size="28"></u-icon>
        </view>
      </view>
      <button size="mini" class="task-data_more" @click="gotoTask">
        查看更多
      </button>
    </view>
    <FloatPet />
  </movable-area>
</template>

<script setup lang="ts">
import FloatPet from "@/components/FloatPet/FloatPet.vue";
import ExpLineCmp from "@/components/ExpLine/ExpLine.vue";
import { InfluenceAttrTextMap } from "@/type/task";
import { useUser } from "@/composables/useUser";
import { useTask } from "@/composables/useTask";
import { onShow } from "@dcloudio/uni-app";
import { computed, ref } from "vue";

const { userInfo, userGrowth, loadUserData } = useUser();
const { taskCategories, taskList, loadTaskData } = useTask();

onShow(async () => {
  await loadUserData();
  await loadTaskData();
});

const selectedCategory = ref<number | string>("all");

const goToPersonal = () => {
  uni.switchTab({ url: "/pages/personal/personal" });
};

const gotoTask = () => {
  uni.switchTab({ url: "/pages/task/task" });
};
</script>

<style scoped lang="scss">
.index_card {
  background-color: var(--bg-color);
  width: 88vw;
  border-radius: 20rpx;
  box-shadow: var(--shadow);
  padding: 30rpx 40rpx;
}

// 用户卡片
.user-card {
  height: 37vh;

  // 基本信息
  &_info {
    .avatar {
      width: 120rpx;
      height: 120rpx;
    }

    .user-info {
      margin-left: 30rpx;
      .user-name,
      .level {
        display: inline-block;
        font-size: var(--fontSize-big);
      }
    }

    .personal-more {
      background-color: var(--primary-color);
      color: #fff;
      padding: 0 0.75em;
    }
  }

  // 经验值
  &_exp {
    .exp-data {
      margin-bottom: 10rpx;
      font-size: var(--fontSize-small);
    }
  }

  // 属性值
  &_attr {
    flex-wrap: wrap;

    .attr-item {
      width: 47%;
      padding: 10rpx 20rpx;
      border-radius: 10rpx;
      box-shadow: var(--shadow);
      margin-bottom: 30rpx;
      &:nth-child(n + 3) {
        margin-bottom: 0;
      }
      .attr-item-icon {
        width: 45rpx;
        height: 45rpx;
        margin-right: 15rpx;
      }
    }
  }
}

// 任务分类
.task-category-list {
  width: 88vw;
  overflow-x: auto;
  padding: 0 0 20rpx;
  margin: 20rpx 0 0;

  .task-category {
    border-radius: 20rpx;
    background-color: var(--bg-color);
    font-size: var(--fontSize-normal);
    box-shadow: var(--shadow);
    padding: 15rpx 30rpx;
    margin-right: 20rpx;
  }

  .selected {
    background-color: var(--primary-color);
    color: #fff;
  }

  .more {
    background-color: var(--contrast-color);
    color: #fff;
  }
}

// 任务列表
.task-data {
  height: 40vh;
  // border-top: 14rpx solid var(--primary-color);
  padding-top: 20rpx;
  padding-bottom: 20rpx;

  &_task-list {
    height: 80%;
    overflow: auto;

    .task {
      padding: 20rpx 10rpx;
      border-bottom: 2rpx solid #ddd;

      .task-text {
        line-height: 1.5;
        white-space: nowrap;

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
  }
  &_more {
    background-color: var(--primary-color);
    color: #fff;
    font-size: var(--fontSize-normal);
  }
}
</style>
