<template>
  <div class="main">
    <el-tabs v-model="tabName" git :stretch="true">
      <el-tab-pane label="帐号密码登录" name="account">
        <el-form ref="loginform" :model="loginform" :rules="rules" size="large">
          <el-form-item>
            <el-input
              v-model="loginform.username"
              prefix-icon="el-icon-user"
              placeholder="请输入账号"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="loginform.password"
              type="password"
              prefix-icon="el-icon-lock"
              placeholder="请输入密码"
            ></el-input>
          </el-form-item>
          <el-button
            type="primary"
            size="large"
            style="width: 100%"
            @click="handleLogin"
            >登录</el-button
          >
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import md5 from "md5";

export default {
  data() {
    return {
      tabName: "account",
      loginform: {
        username: "",
        password: "",
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  created() {},
  methods: {
    handleLogin() {
      const self = this;
      this.$refs.loginform.validate((valid, formdata) => {
        if (!valid) {
          console.log("error submit!!");
          return false;
        }
        self.$store.dispatch("user/login", {
          payload: {
            username: self.loginform.username,
            password: md5(self.loginform.password),
          },
          callback(loginresp) {
            if (loginresp.code === 0) {
              self.$router.push("/");
            } else {
              self.$message.error(loginresp.msg);
            }
          },
        });
      });

      // this.$router.push('/crmg')
    },
  },
};
</script>

<style lang="scss" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }

  .user-login-other {
    text-align: left;
    margin-top: 24px;
    line-height: 22px;

    .item-icon {
      font-size: 24px;
      color: rgba(0, 0, 0, 0.2);
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: #1890ff;
      }
    }

    .register {
      float: right;
    }
  }
}
</style>
