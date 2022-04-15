<template>
  <page-view>
    <div class="basic-page-content">
      <el-card>
        <div class="table-constainer">
          <div class="tableListOperator">
            <div class="left-operator">
              <el-button
                type="plain"
                icon="el-icon-plus"
                @click="handleEdit(null)"
                >新增</el-button
              >
              <el-button
                type="plain"
                icon="el-icon-delete"
                @click="handleCommandBatch('delete')"
                >删除</el-button
              >
            </div>
          </div>
          <el-table
            ref="listTable"
            v-loading="$store.state.tag.loading.fetch"
            :data="$store.state.tag.listData.list"
            tooltip-effect="dark"
            style="width: 100%; min-height: 200px"
            size="medium"
            :header-cell-style="{ 'background-color': '#F6F8F9' }"
            @filter-change="handleFilterChange"
            @selection-change="handleSelectionChange"
            @sort-change="handleSortChange"
          >
            <el-table-column
              fixed
              type="selection"
              width="55"
            ></el-table-column>
            <el-table-column
              fixed
              prop="id"
              label="ID"
              width="70"
            ></el-table-column>
            <el-table-column fixed label="图片" width="70">
              <template slot-scope="scope">
                <el-image
                  :src="scope.row.cover"
                  :preview-src-list="[scope.row.cover]"
                  fit="contain"
                  style="width: 46px; height: 46px"
                >
                  <div
                    slot="error"
                    style="
                      width: 100%;
                      height: 100%;
                      display: flex;
                      align-items: center;
                      justify-content: center;
                      font-size: 20px;
                    "
                  >
                    <i class="el-icon-picture-outline"></i>
                  </div>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="标签名称"
              width="150"
            ></el-table-column>

            <el-table-column
              prop="articleCount"
              label="文章数"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="sort"
              label="排序序号"
              width="150"
            ></el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              min-width="160"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column></el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <div>
                  <a class="default" @click="handleEdit(scope.row)">
                    <i
                      class="el-icon-edit-outline"
                      style="padding-right: 5px"
                    />
                  </a>
                  <a
                    class="default"
                    @click="handleCommand('delete', scope.row)"
                  >
                    <i class="el-icon-delete" style="padding-right: 5px" />
                  </a>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <div class="table-bd clearfix">
            <div class="table-bd_left"></div>
            <div class="table-bd_right">
              <el-pagination
                :current-page="pageNum"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="pageSize"
                background
                layout="total, sizes, prev, next, jumper"
                :total="$store.state.tag.listData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentPageChange"
              />
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <edit-box
      v-if="editDialogVisible"
      :visible.sync="editDialogVisible"
      :row="currentRow"
      @submit="handleSubmit"
    />
    <!-- <detail-box v-if="detailDialogVisible" :visible.sync="detailDialogVisible" :row="currentRow" /> -->
    <!-- <upload-Select v-if="uploadDialogVisible" :visible.sync="uploadDialogVisible"></upload-Select> -->
  </page-view>
</template>

<script>
// import StandardTable from "@/components/standardTable/index";
import EditBox from "./edit.vue";
import PageView from "@/layouts/PageView";

export default {
  components: {
    // StandardTable,
    // Brandcrumb,
    PageView,
    EditBox,
  },
  data() {
    return {
      editDialogVisible: false,
      multipleSelection: [],
      currentRow: null,
      pageNum: 1,
      pageSize: 10,
      // 检索字段
      filters: {
        id: "",
        name: "",
        loginName: "",
        status: "",
      },
      // 查询过滤条件
      sorter: {}, // 排序 sortfield: 'id', sorttype: 'asc'
    };
  },
  methods: {
    clipboardSuccess() {
      this.$message({
        message: "Copy successfully",
        type: "success",
        duration: 1500,
      });
    },
    initData() {
      this.pageNum = 1;
      // this.pageSize = 10
      this.filters = {
        id: "",
        name: "",
      };
      // this.sorter = {}
      this.$refs.listTable.clearFilter();
      // this.$refs.listTable.clearSort()
    },

    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 获取排序参数
    getFiltersParams() {
      const { filters } = this;
      const searchParams = {};
      const searchKeys = Object.keys(filters).filter((key) => {
        // 这个条件是为了减少不必要的参数，一大堆查询参数看着难受。
        // 如果有特殊条件，比如就是要传空值，那么你就需要单独判断下。
        if (filters[key] === null || filters[key] === "") {
          return false;
        }
        return true;
      });
      searchKeys.forEach((key) => {
        searchParams[key] = filters[key];
      });
      return searchParams;
    },
    // 获取检索参数
    getSorterParams() {
      return this.sorter;
    },
    queryListData() {
      this.$store.dispatch("tag/list", { payload: this.queryParams() });
    },
    // 生成查询条件
    queryParams() {
      const { pageNum, pageSize } = this;
      return {
        pageNum,
        pageSize,
        ...this.getFiltersParams(),
        ...this.getSorterParams(),
      };
    },
    // 页码切换
    handleCurrentPageChange(val) {
      this.pageNum = val;
      this.queryListData();
    },
    // 每页显示条数变更
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1; // 当前页码重置
      this.queryListData();
    },
    // 检索查询
    handleSearch() {
      this.pageNum = 1; // 当前页码要重置
      this.queryListData();
    },
    // 排序
    handleSortChange({ prop, order }) {
      // resp)
      if (prop) {
        this.sorter = {
          sortfield: prop,
          sorttype: order === "descending" ? "desc" : "asc",
        };
      } else {
        this.sorter = {};
      }
      this.queryListData();
    },
    // 表头过滤
    handleFilterChange(filters) {
      Object.keys(filters).forEach((key) => {
        this.filters[key] = filters[key].join(",");
      });
      this.pageNum = 1; // 当前页码重置
      this.queryListData();
    },
    // 删除记录 接受一个ids数组
    handleDelete(ids) {
      const self = this;
      this.$confirm("此操作将删除该数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          self.$store.dispatch("tag/delete", {
            payload: { ids },
            callback: (resp) => {
              const { count } = resp;
              self.$message({
                type: "success",
                message: `成功删除${count}条数据!`,
              });
              const { list, pageNum, pageSize, total } =
                self.$store.state.tag.listData;
              const precount = list.length;
              // 判断一下count 是否与当前页面的记录条数相等，要是相等，就要查询前一页数据。
              if (count === precount && pageNum * pageSize >= total) {
                this.pagenum = this.pagenum - 1;
              }
              this.queryListData();
            },
          });
        })
        .catch(() => {});
    },
    handleOffline(ids) {
      const self = this;
      const status = 2;
      this.$store.dispatch("tag/changeStatus", {
        payload: { ids, status },
        callback: (resp) => {
          const { count } = resp;
          self.$message({
            type: "success",
            message: `成功锁定${count}条数据!`,
          });
          // todo 暂时我先偷懒直接刷新页面吧，以后优化
          this.queryListData();
        },
      });
    },
    handleOnline(ids) {
      const self = this;
      const status = 1;
      this.$store.dispatch("tag/changeStatus", {
        payload: { ids, status },
        callback: (resp) => {
          const { count } = resp;
          self.$message({
            type: "success",
            message: `成功启用${count}条数据!`,
          });
          // todo 暂时我先偷懒直接刷新页面吧，以后优化
          this.queryListData();
        },
      });
    },
    // 批量操作，自动获取选中的记录
    handleCommandBatch(command) {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请先选择你要操作的数据！",
          type: "error",
        });
        return;
      }
      const ids = this.multipleSelection.map((v) => v.id);
      if (command === "delete") {
        // 删除
        this.handleDelete(ids);
      } else if (command === "online") {
        // 上线
        this.handleOnline(ids);
      } else if (command === "offline") {
        // 下线
        this.handleOffline(ids);
      }
    },

    // 单个commad操作
    handleCommand(command, row) {
      const id = row.id;
      this.currentRow = row;
      if (command === "delete") {
        // 删除
        this.handleDelete([id]);
      } else if (command === "online") {
        // 上线
        this.handleOnline([row.id]);
      } else if (command === "offline") {
        // 下线
        this.handleOffline([row.id]);
      }
    },

    handleEdit(row) {
      this.editDialogVisible = true;
      this.currentRow = row;
    },
    handleSubmit() {
      this.queryListData();
    },
  },
  created() {
    this.queryListData();
  },
};
</script>
