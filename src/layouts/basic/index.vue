<template>
  <div class="layout-default">
    <el-row class="layout-default-header">
      <el-col :span="24">
        <div class="layout-default-maxarea">
          <my-header />
        </div>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" style="min-height: 200px">
        <div class="body-content">
          <div class="dv-layout">
            <div class="dv-layout_side">
              <sider-menu :collapse="isCollapse" />
              <div
                class="dv-layout_side-toolbar"
                :style="{ width: isCollapse ? '64px' : '230px' }"
              >
                <el-button
                  style="font-size: 16px; padding: 5px 8px"
                  @click="isCollapse = !isCollapse"
                  ><i class="el-icon-s-fold"></i
                ></el-button>
              </div>
            </div>
            <div class="dv-layout_main">
              <div class="dv-layout_router-view">
                <router-view />
              </div>
              <my-footer />
            </div>
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- <el-row>
      <el-col :span="24">
        <div>
          <my-footer />
        </div>
      </el-col>
    </el-row>-->
  </div>
</template>

<script>
import MyHeader from "./header/index";
import MyFooter from "./footer/index";
import SiderMenu from "./siderMenu/index";

export default {
  components: {
    MyHeader,
    MyFooter,
    SiderMenu,
  },
  data() {
    return {
      isCollapse: false,
      menus: [],
    };
  },
  created() {},
};
</script>
<style lang="scss" scoped>
@import "@/assets/css/config.scss";
.layout-default {
  min-height: 100vh;
  background-color: #f0f2f5;
  -webkit-font-smoothing: antialiased;
  min-width: 1200px;
  .layout-default-header {
    background: #fff;
    height: 60px;
    z-index: 1001;
    top: 0;
  }
}

.layout-default-maxarea {
  // max-width: $maxWeight;
  margin: 0 auto;
  // padding: 0 30px;
}

.default-page-container {
  width: 100%;
  display: flex;
  justify-content: space-between;
}

.default-page-container .default-page-main {
  padding: 0;
  overflow: hidden;
  flex: 1;
}

.default-page-container .default-page-aside {
  width: 276px;
  padding: 0 0 0 15px;
}

.dv-layout {
  background: #f6f8f9;
  color: #353535;
  display: flex;
  // padding: 40px 0 80px;

  .dv-layout_side {
    // width: 250px;
    padding-bottom: 50px;
    // position: absolute;
    transition: margin 0.3s, width 0.3s;
    border-right: solid 1px #e6e6e6;
    background: #fff;
    .el-menu-side {
      height: 100vh;
      overflow: scroll;
    }
    .el-menu {
      border-right: none;
    }
  }
  .dv-layout_side-toolbar {
    box-sizing: border-box;
    position: fixed;
    bottom: 0;
    // width: 100%;
    // height: 50px;
    // width: 250px;
    text-align: right;
    padding: 10px 15px 10px 0;
    border-top: 1px solid #e6e6e6;
    // display: flex;
    // justify-content: right;
    // justify-items: right;
  }
  .dv-layout_main {
    flex: 1;
    // overflow: hidden;
    width: 0;
    min-height: 600px;
    min-height: calc(100vh - 60px);
  }
  .dv-layout_router-view {
    min-height: 82vh;
  }
  .el-submenu .el-menu-item {
    text-overflow: ellipsis;
    overflow: hidden;
  }
}
</style>
