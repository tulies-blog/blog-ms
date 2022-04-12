<template>
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
</template>
