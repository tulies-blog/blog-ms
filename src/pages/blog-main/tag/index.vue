<template>
  <page-view>
    <div class="basic-page-content">
      <el-card>
        <div class="table-constainer">
          <div class="tableListOperator">
            <div class="left-operator">
              <el-button
                type="plain"
                icon="apconfont apcon-icon_fabu"
                @click="handleCommandBatch('online')"
                >启用</el-button
              >
              <el-button
                type="plain"
                icon="apconfont apcon-xiaxian"
                @click="handleCommandBatch('offline')"
                >锁定</el-button
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
            <el-table-column
              prop="name"
              label="标签名称"
              width="150"
            ></el-table-column>
            <el-table-column label="状态" width="80">
              <template slot-scope="scope">
                <span v-if="scope.row.status === -1" class="color-danger"
                  >删除</span
                >
                <span v-else-if="scope.row.status === 0" class="color-info"
                  >待发布</span
                >
                <span v-else-if="scope.row.status === 1" class="color-success"
                  >正常</span
                >
                <span v-else-if="scope.row.status === 2" class="color-warning"
                  >锁定</span
                >
                <span v-else class="color-warning">未知</span>
              </template>
            </el-table-column>
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
                  <el-dropdown
                    @command="handleCommand($event, scope.row)"
                    trigger="click"
                  >
                    <span class="el-dropdown-link default-link">
                      <i class="el-icon-more" />
                    </span>
                    <!-- @click="handleCommand('lock',scope)" -->
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="delete">
                        删除
                      </el-dropdown-item>
                      <el-dropdown-item command="online">
                        发布
                      </el-dropdown-item>
                      <el-dropdown-item command="offline">
                        下线
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
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
    <!-- <detail-box v-if="detailDialogVisible" :visible.sync="detailDialogVisible" :row="currentRow" /> -->
    <!-- <upload-Select v-if="uploadDialogVisible" :visible.sync="uploadDialogVisible"></upload-Select> -->
  </page-view>
</template>

<script>
// import StandardTable from "@/components/standardTable/index";
import PageView from "@/layouts/PageView";

export default {
  components: {
    // StandardTable,
    // Brandcrumb,
    PageView,
    // DetailBox
  },
  data() {
    return {
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
  },
  created() {
    this.queryListData();
  },
};
</script>
