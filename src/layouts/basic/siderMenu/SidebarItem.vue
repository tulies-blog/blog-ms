<template>
  <div>
    <el-submenu v-if="item.children" :index="item.path">
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{ item.name }}</span>
      </template>
      <template v-for="child in item.children">
        <sidebar-item
          v-if="!child.hidden"
          :item="child"
          :key="child.path"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-submenu>
    <template v-else>
      <el-menu-item :index="basePath">{{ item.name }}</el-menu-item>
    </template>
  </div>
</template>

<script>
import path from "path";
import { isExternal } from "@/utils";

export default {
  name: "SidebarItem",
  props: {
    // route object
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: "",
    },
  },
  methods: {
    resolvePath(routePath) {
      if (this.isExternalLink(routePath)) {
        return routePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    isExternalLink(routePath) {
      return isExternal(routePath);
    },
  },
};
</script>
