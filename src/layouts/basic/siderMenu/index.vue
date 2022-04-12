<template>
  <el-menu
    class="el-menu-vertical-demo"
    :router="true"
    :default-active="($route.meta && $route.meta.activePath) || $route.path"
    :collapse="collapse"
    @select="handleSelect"
    @open="handleOpen"
    @close="handleClose"
  >
    <!-- <sidebar-item  v-for="menu in menus" :key="menu.path" :item="menu" :base-path="menu.path" v-if="!menu.hidden"/> -->
    <!-- 目前只做了最多支持2层，element的样式有点特殊，所以无法直接使用递归，以后再看怎么处理 -->
    <template v-for="menu in menus">
      <el-submenu
        :key="menu.path"
        v-if="!menu.hidden && menu.children"
        :index="menu.path"
      >
        <template slot="title">
          <i :class="menu.icon"></i>
          <span>{{ menu.name }}</span>
        </template>
        <template v-for="child in menu.children">
          <el-menu-item
            :key="child.path"
            v-if="!child.hidden && child.path"
            :index="resolvePath(menu.path, child.path)"
            >{{ child.name }}</el-menu-item
          >
        </template>
      </el-submenu>
      <template v-else-if="!menu.hidden">
        <el-menu-item :key="menu.path" :index="resolvePath('', menu.path)">{{
          menu.name
        }}</el-menu-item>
      </template>
    </template>
  </el-menu>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils";
import { constantRouterMap } from "@/router/routes.js";
// import SidebarItem from './SidebarItem.vue'
export default {
  props: {
    collapse: { type: Boolean },
  },
  data() {
    return {
      menus: [],
    };
  },
  components: {
    // SidebarItem
  },
  methods: {
    handleOpen() {},
    handleClose() {},
    handleSelect() {
      // const p = keyPath.prop()
      // this.$router.push(keyPath[keyPath.length - 1])
      // this.$router.push('/' + keyPath.join('/'))
    },
    resolvePath(basePath, routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath;
      }
      return path.resolve(basePath, routePath);
    },
    isExternalLink(routePath) {
      return isExternal(routePath);
    },
  },
  created() {
    console.log(constantRouterMap);
    this.menus = constantRouterMap;
  },
};
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 230px;
  min-height: 400px;
}
</style>
