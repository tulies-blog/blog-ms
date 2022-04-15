<template>
  <div class="default-header">
    <div class="container">
      <div class="logo">
        <span class="logo-icon">
          <a href="/" target="_blank"><img src="../../../assets/logo.jpg" /></a>
        </span>
        <span class="desc">Wang Jiayang's Personal Blog</span>
        <!-- <span style="color:#fff">版权中心</span> -->
        <el-tag v-if="headerTag" type="info" size="mini">
          {{ headerTag }}
        </el-tag>
      </div>
      <!-- <div class="topnav">
        <default-nav />
      </div> -->
      <div class="header-right">
        <a class="icon-action" href="http://www.wangjiayang.cn" target="_blank">
          <el-tooltip content="博客主页" placement="bottom">
            <i class="el-icon-s-home" />
          </el-tooltip>
        </a>
        <i class="split-line-icon apconfont apcon-icon-vertical-divider" />
        <el-dropdown @command="handleCommand">
          <span class="el-dropdown-link">
            {{ $store.state.user.userinfo.nickname }}
            <!-- Wang Jiayang -->
            <i class="el-icon-arrow-down el-icon--right" />
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="modify">修改密码</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出</el-dropdown-item>
            <el-dropdown-item>清除缓存</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    headerTag: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      visible: true, // 显示左菜单
      trigger: "click",
    };
  },
  mounted() {},
  methods: {
    handleCommand(command) {
      if (command === "logout") {
        console.log("hahah");
        this.$store.dispatch("user/logout", {
          callback: () => {
            this.$router.replace("/user/login");
          },
        });
      }
    },
    handleClose() {
      this.messageDialogVisible = false;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/config.scss";
.default-header {
  .container {
    // height: 100%;
    margin: 0 auto;
    height: 60px;
    padding: 0 15px;
    border-bottom: 1px solid #efefef;
    .header-menu {
      float: left;
      // width: 50px;
      height: 100%;
      line-height: 60px;
      text-align: center;
      cursor: pointer;
      transition: transform 0.3s;
      // -ms-transform: rotate(90deg);
      // transform: rotate(90deg);
      -ms-transform: rotate(0deg);
      transform: rotate(0deg);
      .header-icon {
        display: inline-block;
        // vertical-align: middle;
        // width: 30px;
        // height: 25px;
        font-size: 25px;
        color: #fff;
      }
      &.active {
        -ms-transform: rotate(90deg);
        transform: rotate(90deg);
      }
    }
    .split-line-icon {
      font-size: 25px;
      color: #888;
      // width: 5px;
    }
    .vertical-divider {
      float: left;
      height: 100%;
      line-height: 60px;
      color: #ffffff;
    }
    .logo {
      float: left;
      height: 100%;
      display: flex;
      align-items: center;
      a {
        color: #444;
      }
      .logo-icon {
        height: 50px;
        width: 40px;
        display: inline-block;
        img {
          margin-top: 15%;
          height: 70%;
          width: auto;
          border-radius: 5px;
        }
      }
      .desc {
        color: #444444;
        padding: 0 10px;
        font-size: 16px;
      }
    }
    .topnav {
      float: left;
      height: 100%;
      margin-left: 60px;
      // display: flex;
      // align-items: center;
      color: #ffffff;
    }

    .header-right {
      float: right;
      height: 100%;
      display: flex;
      align-items: center;
      .icon-action {
        font-size: 20px;
        padding-right: 14px;
        color: #666;
        &:last-of-type {
          padding-right: 4px;
        }
        &:hover {
          color: $mainColor;
        }
      }
      .user {
        margin-left: 8px;
        height: 34px;
        width: 34px;
        display: block;
        .avatar {
          display: block;
          overflow: hidden;
          font-style: normal;
          width: 34px;
          height: 34px;
          line-height: 34px;
          border-radius: 34px;
          background-color: $mainColor;
          color: #ffffff;
          font-size: 10px;
          text-align: center;
          > img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .el-menu.el-menu--horizontal {
    border: none;
  }
  .el-menu--horizontal > .el-menu-item {
    height: 40px;
    line-height: 40px;
  }
  .el-menu-item {
    padding: 0 10px;

    @media screen and (max-width: 400px) {
      padding: 0 8px;
    }
  }
  .el-dialog__header {
    border-bottom: 1px solid #efefef;
  }
  .el-dialog__body {
    padding: 10px 10px;
  }
}
.el-badge__content {
  padding: 0 4px;
  height: 16px;
  line-height: 16px;
}
</style>
