<script>
  import dayjs from 'dayjs';
  import { useUserStore } from '../../stores/user';
  import { mapState, mapActions } from 'pinia';

  export default {
    data() {
      return {
        currentTime: dayjs().format('YYYY 年 MM 月 DD 日 dddd HH:mm:ss'),
        timeTimer: 0,
      };
    },
    computed: {
      bigscreenRoutes() {
        const bigscreenRoutes = this.$router
          .getRoutes()
          .filter((route) => /\/bigscreen\//i.test(route.path));
        bigscreenRoutes.forEach((route) => {
          route.meta.active = route.path === this.$route.path;
        });
        return bigscreenRoutes;
      },
      ...mapState(useUserStore, ['userName', 'from']),
    },
    methods: {
      ...mapActions(useUserStore, ['logout']),
      handleCommand(command) {
        if (command === 'logout') {
          this.handleLogout();
        }
        if (command === 'backOrigin') {
          this.handleBackOrigin();
        }
      },
      handleBackOrigin() {
        if (this.from?.href) {
          if (this.from?.name) {
            window.open(this.from.href, this.from.name);
          } else {
            location.href = this.from.href;
          }
        } else {
          window.open('http://iot.cqset.com/view/#/login', '智慧电网数据分析平台');
          window.close();
        }
      },
      handleLogout() {
        this.logout();
        this.handleBackOrigin();
        location.reload();
      },
    },
    mounted() {
      this.timeTimer = setInterval(() => {
        this.currentTime = dayjs().format('YYYY 年 MM 月 DD 日 dddd HH:mm:ss');
      }, 1000);
    },
    beforeDestroy() {
      clearInterval(this.timeTimer);
    },
  };
</script>
<template>
  <div h="full" overflow="hidden" flex="~ col">
    <header class="bigscreen-header" h="25" p="x-4" flex="~" items="center" text="xl">
      <p flex="1/5">{{ currentTime }}</p>
      <h1 text="4xl center" select="none">在线监测</h1>
      <p flex="1/5" text="right">
        <el-dropdown @command="handleCommand">
          <span color="content">
            <i class="icon el-icon-user"> </i>
            {{ userName }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-user">{{ userName }}</el-dropdown-item>
            <el-dropdown-item icon="el-icon-house" command="backOrigin">返回认证</el-dropdown-item>
            <el-dropdown-item icon="el-icon-position" divided command="logout">
              退出
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </p>
    </header>
    <div m="4 b-10" rounded="2" flex="1 ~ col" overflow="hidden" bg="primary/15">
      <nav h="25">
        <RouterLink
          class="bigscreen-nav-item"
          v-for="navItem in bigscreenRoutes"
          :key="navItem.path"
          :to="navItem"
          :class="{ active: navItem.meta?.active }"
        >
          <span class="bigscreen-nav-item--icon">
            <i class="icon" :class="navItem.meta?.iconClass"></i>
          </span>
          <span class="bigscreen-nav-item--text">{{ navItem.meta?.text }}</span>
        </RouterLink>
      </nav>
      <main m="x-4" flex="1" overflow="hidden">
        <RouterView></RouterView>
      </main>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .icon {
    @apply text-3xl color-content;
  }
  .bigscreen {
    &-header {
      background-image: url('@/assets/images/theme-header.png');
      background-size: 100%;
      @apply bg-center bg-no-repeat;
      .icon {
        @apply cursor-pointer transition hover:(transform scale-150 text-primary);
      }
    }
    &-nav {
      &-item {
        @apply inline-flex items-center m-5 w-40 rounded-6 overflow-hidden relative cursor-pointer transition-all duration-500;
        &--icon {
          background-image: url('@/assets/images/nav-item--icon.png');
          @apply p-y-3 p-x-8 bg-contain bg-center bg-no-repeat;
        }
        &--text {
          line-height: 3rem;
          background-image: url('@/assets/images/nav-item--text.png');
          @apply absolute right-0 -z-1 w-25 text-center bg-contain bg-center bg-no-repeat transition-all duration-500;
        }
        &.active,
        &:hover {
          @apply shadow shadow-xl shadow-primary;
        }
      }
    }
  }
</style>
