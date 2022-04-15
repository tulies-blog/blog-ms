<template>
  <el-drawer
    title="详情"
    size="460px"
    :visible.sync="visible"
    direction="rtl"
    :before-close="handleClose"
  >
    <div class="preview-con">
      <div class="the-previewer-wrapper">
        <img :src="row.url" alt="文件无法预览。" />
      </div>
    </div>

    <el-form :model="row" label-width="100px">
      <el-form-item label="文件名称">
        {{ row.name }}
      </el-form-item>
      <el-form-item label="文件类型">
        {{ row.contentType }}
      </el-form-item>
      <el-form-item label="文件大小">
        {{ Math.round(parseFloat(row.size / 1000) * 100) / 100 }} KB
      </el-form-item>
      <el-form-item label="URL地址">
        <div>
          <el-input
            type="textarea"
            readonly
            :autosize="{ minRows: 1, maxRows: 3 }"
            v-model="row.url"
          ></el-input>
        </div>
        <div>
          <el-button
            type="text"
            v-clipboard:copy="row.url"
            v-clipboard:success="
              () => {
                $message.success('复制外链地址成功');
              }
            "
            >复制地址</el-button
          >
        </div>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
<script>
import clipboard from "@/directive/clipboard/index.js"; // use clipboard by v-directive

export default {
  directives: {
    clipboard,
  },
  props: {
    row: { type: Object, default: () => ({}) },
    visible: { type: Boolean, default: false },
  },
  data() {
    return {};
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    // handleCopy () {
    //   const self = this
    //   const clipboard = new Clipboard('#clipboard_btn', {
    //     text: function () {
    //       return self.row.url
    //     }
    //   })
    //   clipboard.on('success', function (e) {
    //     self.$message.success('复制成功')
    //     clipboard.destroy()
    //   })

    //   clipboard.on('error', function () {
    //     self.$message.error('复制失败')
    //     clipboard.destroy()
    //   })
    // }
  },
};
</script>

<style lang="scss" scoped>
.preview-con {
  position: relative;
  margin-bottom: 12px;
  .the-previewer-wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 360px;
    background-color: #f5f5f6;
    color: #9b9ea0;
    img {
      max-width: 100%;
      max-height: 360px;
      display: block;
    }
  }
}
</style>
