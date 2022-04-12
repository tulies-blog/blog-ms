<template>
  <div class="default-nav">
    <nuxt-link
      v-for="nav in navs"
      :key="nav.index"
      class="nav-item"
      tag="div"
      :to="nav.to"
    >
      {{ nav.name }}
    </nuxt-link>
  </div>
</template>
<script>
export default {
  data() {
    return {
      navs: [
        // {
        //   index: '0',
        //   name: '首页',
        //   to: '/'
        // },
        // {
        //   index: '1',
        //   name: '版权中心',
        //   to: '/crmg'
        // },
        // {
        //   index: '2',
        //   name: '支持与帮助',
        //   to: '/wiki'
        // },
        // {
        //   index: '3',
        //   name: '商务合作',
        //   to: '/cooperation'
        // },
        // {
        //   index: '4',
        //   name: '关于我们',
        //   to: '/about'
        // },
        {
          index: "5",
          name: "系统管理",
          to: "/admin",
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/config.scss";
.default-nav {
  .nav-item {
    float: left;
    padding: 0 16px;
    line-height: 60px;
    cursor: pointer;
    &.nuxt-link-exact-active,
    &.nuxt-link-active {
      // line-height: 58.7px;
      // border-bottom: 1.3px solid $mainColor;
      color: $mainColor;
    }
    &:hover {
      color: $mainColor;
    }
  }
}
</style>
