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
                  <el-option label="评论ID" value="id"></el-option>
                  <el-option label="帖子ID" value="tid"></el-option>
                  <el-option label="用户ID" value="userid"></el-option>
                  <el-option label="用户名" value="username"></el-option>
                  <el-option label="父评论ID" value="parentid"></el-option>
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
            v-loading="$store.state.comment.reply.loading.fetch"
            :data="$store.state.comment.reply.listData.list"
            row-key="id"
            tooltip-effect="dark"
            style="width: 100%; min-height: 200px"
            size="medium"
            @expand-change="handleExpandChange"
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
              width="25"
            ></el-table-column>
            <el-table-column type="expand">
              <template slot-scope="props">
                <el-form
                  style="padding-left: 80px"
                  label-position="left"
                  inline
                  class="table-expand"
                  v-loading="props.row.loading"
                >
                  <div>
                    <el-form-item label="状态">
                      <span v-if="props.row.status === -1" class="color-danger"
                        >删除</span
                      >
                      <span
                        v-else-if="props.row.status === 0"
                        class="color-info"
                        >待审核</span
                      >
                      <span
                        v-else-if="props.row.status === 1"
                        class="color-success"
                        >正常</span
                      >
                      <span
                        v-else-if="props.row.status === 2"
                        class="color-warning"
                        >未通过</span
                      >
                      <span v-else class="color-warning">未知</span>
                    </el-form-item>
                    <el-form-item label="评论时间">
                      <span>{{ props.row.createTime }}</span>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="评论者">
                      <span
                        >{{ props.row.username
                        }}<span v-if="props.row.userid"
                          >({{ props.row.userid }})</span
                        ></span
                      >
                    </el-form-item>
                    <el-form-item label="文章">
                      <span>
                        {{ props.row.topic.title }}(
                        <a
                          class="default"
                          target="_blank"
                          :href="props.row.topic.url"
                          :title="'打开文章：' + props.row.topic.url"
                          >查看</a
                        >)
                      </span>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item label="评论的内容">
                      <span>{{ props.row.content }}</span>
                    </el-form-item>
                  </div>
                  <el-divider content-position="left">其他信息</el-divider>
                  <div>
                    <el-form-item label="点赞数">
                      <span>{{ props.row.diggCount }}</span>
                    </el-form-item>
                    <el-form-item label="回复层级">
                      <span>{{ props.row.grade }}</span>
                    </el-form-item>
                    <el-form-item label="根评论ID" v-if="props.row.root">
                      <span>{{ props.row.root.id }}</span>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item
                      label="父评论者"
                      v-if="props.row.relateUsername"
                    >
                      <span
                        >{{ props.row.relateUsername }}（{{
                          props.row.relateUserid
                        }}）</span
                      >
                    </el-form-item>
                    <el-form-item label="父评论ID" v-if="props.row.parent">
                      <span>{{ props.row.parent.id }}</span>
                    </el-form-item>
                  </div>
                  <div>
                    <el-form-item
                      label="父评论内容"
                      v-if="props.row.relateUsername"
                    >
                      <span>撒解决阿娇肯定撒</span>
                    </el-form-item>
                  </div>
                </el-form>
              </template>
            </el-table-column>
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column
              prop="tid"
              label="帖子ID"
              width="120"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="userid"
              label="用户"
              width="120"
            ></el-table-column>
            <el-table-column
              prop="username"
              label="昵称"
              width="100"
            ></el-table-column>
            <el-table-column
              prop="diggCount"
              label="点赞数"
              width="100"
              sortable
            ></el-table-column>
            <el-table-column
              label="状态"
              width="80"
              column-key="status"
              :filters="[
                { text: '删除', value: -1 },
                { text: '待审核', value: 0 },
                { text: '正常', value: 1 },
                { text: '未通过', value: 2 },
              ]"
            >
              <template slot-scope="scope">
                <span v-if="scope.row.status === -1" class="color-danger"
                  >删除</span
                >
                <span v-else-if="scope.row.status === 0" class="color-info"
                  >待审核</span
                >
                <span v-else-if="scope.row.status === 1" class="color-success"
                  >正常</span
                >
                <span v-else-if="scope.row.status === 2" class="color-warning"
                  >未通过</span
                >
                <span v-else class="color-warning">未知</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="content"
              label="评论内容"
              min-width="200"
              show-overflow-tooltip
            ></el-table-column>
            <!-- <el-table-column prop="parentid" label="父ID" width="80"></el-table-column>
            <el-table-column prop="rootid" label="根ID" width="80"></el-table-column>-->
            <el-table-column
              prop="grade"
              label="层级"
              width="60"
            ></el-table-column>
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
                    @click="handleCommand('delete', scope.row)"
                  >
                    <i class="el-icon-delete" style="padding: 0 10px" />
                  </a>
                  <!-- <el-dropdown
                    @command="handleCommand($event, scope.row)"
                    trigger="click"
                  >
                    <span class="el-dropdown-link default-link">
                      <i class="el-icon-more" />
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                      <el-dropdown-item command="online">发布</el-dropdown-item>
                      <el-dropdown-item command="offline"
                        >下线</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </el-dropdown> -->
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
                :total="$store.state.comment.reply.listData.total"
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
      expandRowKeys: [],
      multipleSelection: [],
      currentRow: null,
      pageNum: 1,
      pageSize: 10,
      // 检索字段
      tableFilters: {},
      simpleSearchObj: {
        key: "id",
        value: "",
      },
      // 查询过滤条件
      sorter: {}, // 排序 sortfield: 'id', sorttype: 'asc'
    };
  },
  methods: {
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
      console.log(val);
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
      return this.sorter;
    },
    queryListData() {
      this.$store.dispatch("comment/reply/list", {
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
      console.log(val);
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
          self.$store.dispatch("comment/reply/delete", {
            payload: { ids },
            callback: (resp) => {
              const { count } = resp;
              self.$message({
                type: "success",
                message: `成功删除${count}条!`,
              });
              const { list, pageNum, pageSize, total } =
                self.$store.state.comment.reply.listData;
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
      this.$store.dispatch("comment/reply/changeStatus", {
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
      this.$store.dispatch("comment/reply/changeStatus", {
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
      // console.log(this.multipleSelection)
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
      // console.log(rr)
      console.log(row);
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
    handleExpandChange(row, expandedRows) {
      console.log(this.expandRowKeys);
      // console.log('expanded')
      // if (row.id !== 138) {
      //   return
      // }
      if (expandedRows.filter((v) => v.id === row.id).length <= 0) {
        // console.log(3232323)
        return;
      }

      // this.$set()

      // row.loading = true
      console.log(this.$store.state.comment.reply.listData);
      const list = this.$store.state.comment.reply.listData.list.map((v) => {
        if (v.id === row.id) {
          v.loading = true;
        }
        return v;
      });
      // console.log(list)
      this.$store.commit("comment/reply/setListData", {
        ...this.$store.state.comment.reply.listData,
        list,
      });

      this.$store.dispatch("comment/reply/info", {
        payload: { id: row.id },
        callback: (res) => {
          console.log(res);
          // row.parent = res.data.parent

          const list2 = this.$store.state.comment.reply.listData.list.map(
            (v) => {
              if (v.id === res.data.id) {
                v = {
                  ...v,
                  ...res.data,
                  loading: false,
                };
              }
              return v;
            }
          );
          // row.loading = false
          // this.$set(row, 'loading', false)
          this.$store.commit("comment/reply/setListData", {
            ...this.$store.state.comment.reply.listData,
            list: list2,
          });
        },
      });
    },
  },
  created() {
    this.queryListData();
  },
};
</script>
<style lang="scss" scoped>
.table-expand {
  font-size: 0;
}
.table-expand ::v-deep label {
  // width: 90px;
  color: #99a9bf;
}
.table-expand ::v-deep .el-form-item {
  margin-right: 40px;
  margin-bottom: 0;
  // width: 50%;
}
</style>
