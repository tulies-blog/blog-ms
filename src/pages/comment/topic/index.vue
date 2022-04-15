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
              <!-- <el-button
                type="plain"
                icon="el-icon-delete"
                @click="handleCommandBatch('delete')"
                >删除</el-button
              > -->
            </div>
            <div class="right-operator">
              <el-input
                clearable
                placeholder="请输入内容"
                v-model="simpleSearchObj.value"
                class="input-with-select"
                style="width: 300px; margin-left: 9px"
                @clear="queryListData"
              >
                <el-select
                  v-model="simpleSearchObj.key"
                  slot="prepend"
                  placeholder="请选择"
                  style="width: 100px"
                >
                  <el-option label="ID" value="id"></el-option>
                  <el-option label="帖子标题" value="title"></el-option>
                  <el-option label="帖子ID" value="tid"></el-option>
                </el-select>
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="handleSearch"
                ></el-button>
              </el-input>
            </div>
          </div>
          <el-table
            ref="listTable"
            v-loading="$store.state.comment.topic.loading.fetch"
            :data="$store.state.comment.topic.listData.list"
            tooltip-effect="dark"
            style="width: 100%; min-height: 200px"
            size="medium"
            :header-cell-style="{
              'background-color': '#F6F8F9',
              padding: '6px 0',
            }"
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
              fixed
              prop="title"
              label="帖子标题"
              min-width="250"
            ></el-table-column>
            <el-table-column
              prop="tid"
              label="帖子ID"
              width="120"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="repliedCount"
              label="评论数"
              width="100"
              sortable
            ></el-table-column>
            <el-table-column
              label="审核类型"
              width="120"
              column-key="checkMode"
              :filters="[
                { text: '先发后审', value: 0 },
                { text: '先审后发', value: 1 },
              ]"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.checkMode === 0" class="color-success"
                  >先发后审</span
                >
                <span
                  v-else-if="scope.row.checkMode === 1"
                  class="color-warning"
                  >先审后发</span
                >
                <span v-else class="color-warning">未知</span>
              </template>
            </el-table-column>
            <el-table-column
              label="状态"
              width="80"
              column-key="status"
              :filters="[
                { text: '删除', value: -1 },
                { text: '正常', value: 1 },
                { text: '锁定', value: 2 },
              ]"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status === -1" class="color-danger"
                  >删除</span
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
              width="160"
              sortable
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <div>
                  <a
                    class="default"
                    :href="scope.row.url"
                    :title="'打开文章：' + scope.row.url"
                    target="_black"
                  >
                    <i class="el-icon-document" />
                  </a>
                  <el-dropdown
                    @command="handleCommand($event, scope.row)"
                    trigger="click"
                  >
                    <span class="el-dropdown-link default-link">
                      <i class="el-icon-more" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <!-- <el-dropdown-item command="delete">删除</el-dropdown-item> -->
                      <el-dropdown-item command="online">启用</el-dropdown-item>
                      <el-dropdown-item command="offline"
                        >锁定</el-dropdown-item
                      >
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
                :total="$store.state.comment.topic.listData.total"
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
import PageView from "@/layouts/PageView";

export default {
  components: {
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
      // 查询过滤条件
      tableFilters: {},
      simpleSearchObj: {
        key: "title",
        value: "",
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
      let searchOptions = {};
      if (this.simpleSearchObj.key) {
        searchOptions[this.simpleSearchObj.key] = this.simpleSearchObj.value;
      }
      if (this.tableFilters) {
        searchOptions = {
          ...searchOptions,
          ...this.tableFilters,
        };
      }
      const searchParams = {};
      const searchKeys = Object.keys(searchOptions).filter((key) => {
        // 这个条件是为了减少不必要的参数，一大堆查询参数看着难受。
        // 如果有特殊条件，比如就是要传空值，那么你就需要单独判断下。
        if (searchOptions[key] === null || searchOptions[key] === "") {
          return false;
        }
        return true;
      });
      searchKeys.forEach((key) => {
        searchParams[key] = searchOptions[key];
      });
      return searchParams;
    },
    // 获取检索参数
    getSorterParams() {
      console.log(this.sorter);
      if (this.sorter && this.sorter.sortfield) {
        const { sortfield, sorttype } = this.sorter;
        return {
          sorter: `${sortfield} ${sorttype}`,
        };
      }
      return {};
    },
    queryListData() {
      this.$store.dispatch("comment/topic/list", {
        payload: this.queryParams(),
      });
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
    handleSortChange({ column, prop, order }) {
      if (prop && order) {
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
      const tableFilters = { ...this.tableFilters };
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key].length > 0) {
          tableFilters[key] = filters[key].join(",");
        } else {
          delete tableFilters[key];
        }
      });
      this.tableFilters = tableFilters;
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
          self.$store.dispatch("comment/topic/delete", {
            payload: { ids },
            callback: (resp) => {
              const { count } = resp;
              self.$message({
                type: "success",
                message: `成功删除${count}条!`,
              });
              const { list, pageNum, pageSize, total } =
                self.$store.state.comment.topic.listData;
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
      this.$store.dispatch("comment/topic/changeStatus", {
        payload: { ids, status },
        callback: (resp) => {
          const { count } = resp;
          self.$message({
            type: "success",
            message: `成功锁定${count}个!`,
          });
          // todo 暂时我先偷懒直接刷新页面吧，以后优化
          this.queryListData();
        },
      });
    },
    handleOnline(ids) {
      const self = this;
      const status = 1;
      this.$store.dispatch("comment/topic/changeStatus", {
        payload: { ids, status },
        callback: (resp) => {
          const { count } = resp;
          self.$message({
            type: "success",
            message: `成功启用${count}个!`,
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
