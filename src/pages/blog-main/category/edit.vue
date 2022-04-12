<template>
  <el-dialog
    title="编辑分类"
    :visible="visible"
    width="400px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="上层分类" v-if="row && row.parent">
        <el-input
          :value="row.parent.name + '-' + row.parent.id"
          disabled
        ></el-input>
      </el-form-item>
      <el-form-item label="分类名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序值">
        <el-input v-model="form.sort"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
export default {
  props: {
    row: { type: Object, default: null },
    visible: { type: Boolean, default: false },
    // close: {
    //   type: Function,
    //   default: () => {}
    // }
    submit: { type: Function, default: () => {} },
  },
  data() {
    return {
      title: "",
      form: {
        name: "",
        sort: "",
      },
    };
  },
  mounted() {
    console.log(this.row);
    if (this.row) {
      this.title = "编辑分类";
    } else {
      this.title = "新建分类";
    }
  },
  methods: {
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleCreate() {
      // this.$store.dispatch('usermg/create', {
      //   id: 29,
      //   name: 'wx3232233',
      //   loginName: 'wx12333222'
      //   // status: 1,
      //   // password: '123!@#qwe'
      // })
      const self = this;

      this.$refs.rowform.validate((valid) => {
        if (valid) {
          self.$store.dispatch("usermg/edit", {
            payload: this.record,
            callback: (resp) => {
              if (resp.code === 0) {
                self.$message({
                  message: "更新用户成功",
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
                self.submit(newrow);
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
  },
};
</script>
