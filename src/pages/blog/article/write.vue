<template>
  <page-view>
    <div slot="headerAction">
      <div>
        <!-- <el-button  icon="el-icon-setting"></el-button> -->
        <el-button type="primary" @click="handlePublish">发布文章</el-button>
      </div>
    </div>
    <div class="basic-page-content">
      <el-card>
        <div class="row-item">
          <div style="padding-right: 15px; flex: 1">
            <div class="row-item">
              <el-input
                placeholder="标题：请输入文章标题"
                v-model="entity.title"
              ></el-input>
            </div>
            <div>
              <el-input
                type="textarea"
                :rows="2"
                placeholder="文章简介：简要描述下这篇文章的主要内容以及需要重点说明的东西。"
                v-model="entity.description"
              ></el-input>
            </div>
          </div>
          <div style="width: 160px; overflow: hidden; height: 95px">
            <el-upload
              :action="uploadAction"
              :file-list="posterFile"
              list-type="picture-card"
              :limit="1"
              accept="image/*"
              :headers="uploadHeaders"
              :on-preview="handlePictureCardPreview"
              :on-success="handleFileSuccess"
              :on-remove="handleFileRemove"
            >
              <div>
                <i class="el-icon-upload"></i>
              </div>
            </el-upload>
          </div>
        </div>

        <div class="row-item">
          <el-cascader
            style="width: 320px"
            placeholder="文章分类"
            v-model="entity.categoryId"
            :options="$store.state.category.treeData"
            :props="{
              emitPath: false,
              value: 'id',
              label: 'name',
            }"
          ></el-cascader>
          <el-input
            style="margin: 0 10px"
            placeholder="标签,如：java,spring（用逗号,分号;隔开）"
            v-model="entity.tags"
            class="input-with-select"
          ></el-input>
          <el-button>
            更多设置
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
        </div>

        <div>
          <mavon-editor v-model="entity.content" style="min-height: 600px" />
        </div>
      </el-card>
    </div>

    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </page-view>
</template>

<script>
// import Brandcrumb from '@/components/Brandcrumb/index.vue'
import { getUserInfo } from "@/utils/authority";

import PageView from "@/layouts/PageView";
import "mavon-editor/dist/css/index.css";
export default {
  components: {
    // Brandcrumb,
    PageView,
  },
  data() {
    return {
      entity: {
        title: "",
        categoryId: 1,
        tags: "",
        content: "",
      },
      dialogImageUrl: "",
      dialogVisible: false,
      posterFile: [],
      uploadAction: "http://" + window.location.host + "/api/ms/file/upload",
      uploadHeaders: {},
    };
  },
  methods: {
    handlePublish() {
      const loading = this.$loading({
        lock: true,
        text: "正在发表文章...",
        // spinner: 'el-icon-loading'
        // background: 'rgba(0, 0, 0, 0.7)'
      });

      let poster = "";
      if (this.posterFile.length > 0) {
        poster =
          (this.posterFile[0].response &&
            this.posterFile[0].response.data.baseUrl) ||
          this.posterFile[0].url;
      }
      const payload = {
        ...this.entity,
        poster,
      };
      this.$store.dispatch("article/create", {
        payload,
        callback: (res) => {
          loading.close();
          if (res.code === 0) {
            this.$message.success("文章发表成功", 2000);
            // 这边跳转到版权列表
            this.$router.push("/index/article");
          } else {
            this.$message.error(res.msg || "系统异常，请稍后再试", 2000);
          }
        },
      });
    },
    handleFileRemove(file, fileList) {
      this.posterFile = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleFileSuccess(response, file, fileList) {
      this.posterFile = fileList;
    },
  },
  created() {
    // 先判断store中有没有category
    (this.$store.state.category.treeData &&
      this.$store.state.category.treeData.length > 0) ||
      this.$store.dispatch("category/tree");

    const userinfo = getUserInfo();
    this.uploadHeaders = {
      ...this.uploadHeaders,
      ssotoken: userinfo.userToken,
    };
  },
};
</script>
<style scoped>
/* .row-item >>> .el-input-group__prepend{
    background-color:#fff;
  } */
</style>
<style lang="scss" scoped>
.row-item {
  margin-bottom: 15px;
  overflow: hidden;
  display: flex;
}
.row-item:after,
.row-item:before {
  display: table;
  content: "";
}

/** 重置样式 */
.row-item ::v-deep .el-input-group__prepend {
  background-color: #fff;
}

// .hide ::v-deep .el-upload--picture-card {
//   display: none;
// }

.row-item ::v-deep .el-upload--picture-card {
  width: 160px;
  height: 95px;
  line-height: 95px;
}
.row-item ::v-deep .el-upload-list--picture-card .el-upload-list__item {
  width: 160px;
  height: 95px;
}
</style>
