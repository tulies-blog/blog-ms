<template>
  <el-dialog
    title="编辑标签"
    :visible="visible"
    width="500px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="标签名称">
        <el-input v-model="form.name" placeholder="请输入标签名称"></el-input>
      </el-form-item>
      <el-form-item label="排序值">
        <el-input-number
          v-model="form.sort"
          placeholder="请输入排序值"
        ></el-input-number>
      </el-form-item>
      <el-form-item label="图片">
        <el-upload
          class="cover-upload"
          :class="{ over: coverFile.length > 0 }"
          :file-list="coverFile"
          list-type="picture-card"
          :limit="1"
          accept="image/*"
          :action="uploadAction"
          :headers="uploadHeaders"
          :on-success="handleFileSuccess"
          :on-remove="handleFileRemove"
        >
          <div>
            <i class="el-icon-upload"></i>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handlePublish">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getUserInfo } from "@/utils/authority";

export default {
  props: {
    row: { type: Object, default: null },
    visible: { type: Boolean, default: false },
    // close: {
    //   type: Function,
    //   default: () => {}
    // }
    // submit: { type: Function, default: () => {} },
  },
  data() {
    return {
      title: "",
      form: {
        name: "",
        sort: "",
        cover: "",
      },
      coverFile: [],
      uploadAction: "http://" + window.location.host + "/api/ms/file/upload",
      uploadHeaders: {},
    };
  },

  created() {
    const userinfo = getUserInfo();
    this.uploadHeaders = {
      ...this.uploadHeaders,
      ssotoken: userinfo.userToken,
    };
  },
  mounted() {
    console.log(this.row);
    if (this.row && this.row.id) {
      this.title = "编辑分类";
      this.form = { ...this.row };
      this.coverFile = [
        {
          name: "标签图片",
          url: this.row.cover,
        },
      ];
    } else {
      this.title = "新建分类";
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    handlePublish() {
      // this.$store.dispatch('usermg/create', {
      //   id: 29,
      //   name: 'wx3232233',
      //   loginName: 'wx12333222'
      //   // status: 1,
      //   // password: '123!@#qwe'
      // })
      const self = this;
      const formdata = { ...this.form };
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (self.coverFile.length > 0) {
            formdata.cover =
              (self.coverFile[0].response &&
                self.coverFile[0].response.data.baseUrl) ||
              self.coverFile[0].url;
          }
          let action = "tag/create";
          if (self.row && self.row.id) {
            action = "tag/update";
          }
          self.$store.dispatch(action, {
            payload: formdata,
            callback: (resp) => {
              if (resp.code === 0) {
                self.$message({
                  message: "保存成功",
                  type: "success",
                });
                const newrow = {
                  ...self.row,
                  ...self.record,
                };
                console.log();
                // 清除当前点击的row
                self.$emit("update:row", null);
                self.$emit("update:visible", false);
                // 保存之后的回调
                self.$emit("submit", newrow);
              } else {
                self.$message({
                  message: resp.msg || "系统异常，请稍后再试",
                  type: "error",
                });
              }
            },
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleFileRemove(file, fileList) {
      this.coverFile = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.coverFile = fileList;
    },
  },
};
</script>
<style lang="scss" scoped>
.cover-upload.over::v-deep .el-upload--picture-card {
  display: none;
}
</style>
