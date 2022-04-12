<template>
  <el-dialog
    title="上传文件"
    :visible="visible"
    width="500px"
    height="100%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-upload
      class="upload-container"
      ref="upload"
      :multiple="true"
      accept="image/*"
      :action="uploadAction"
      :headers="uploadHeaders"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
        >上传到服务器</el-button
      >
      <div slot="tip" class="el-upload__tip">
        只能上传jpg/png文件，且不超过500kb
      </div>
    </el-upload>
  </el-dialog>
</template>
<script>
import { getUserInfo } from "@/utils/authority";
export default {
  props: {
    visible: { type: Boolean, default: false },
    submit: { type: Function, default: () => {} },
  },
  data() {
    return {
      uploadAction: "http://" + window.location.host + "/api/resource/upload",
      uploadHeaders: {},
      fileList: [
        // { name: 'food.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' },
        // { name: 'food2.jpeg', url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100' }
      ],
    };
  },
  methods: {
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {},
    handlePreview(file) {},
    handleClose() {
      this.$emit("update:visible", false);
    },
  },
  created() {
    const userinfo = getUserInfo();
    this.uploadHeaders = {
      ...this.uploadHeaders,
      ssotoken: userinfo.userToken,
    };
  },
};
</script>

<style lang="scss" scoped>
.upload-container {
  width: 100%;
}
</style>
