<template>
  <page-view>
    <div class="basic-page-content">
      <el-card>
        <div class="table-constainer">
          <div class="tableListOperator">
            <div class="left-operator">
              <el-button
                type="primary"
                icon="el-icon-plus"
                @click="uploadDialogVisible = true"
                >上传文件</el-button
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
                placeholder="请输入图片路径"
                v-model="simpleSearchObj.value"
                class="input-with-select"
                @clear="queryListData"
              >
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
            v-loading="$store.state.resource.loading.fetch"
            :data="$store.state.resource.listData.list"
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
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column label="预览" width="70">
              <template slot-scope="scope">
                <el-image
                  :src="scope.row.url"
                  :preview-src-list="[scope.row.url]"
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
              label="文件名"
              width="250"
            ></el-table-column>
            <el-table-column
              prop="contentType"
              label="文件类型"
              width="120"
            ></el-table-column>
            <el-table-column label="文件大小" width="120">
              <template slot-scope="scope">
                <span
                  >{{
                    Math.round(parseFloat(scope.row.size / 1000) * 100) / 100
                  }}
                  KB</span
                >
              </template>
            </el-table-column>
            <el-table-column
              prop="relativePath"
              label="图片路径"
              min-width="200"
            ></el-table-column>

            <el-table-column
              prop="updateTime"
              label="最后更新"
              width="160"
            ></el-table-column>
            <el-table-column label="操作" width="80">
              <template slot-scope="scope">
                <div>
                  <a class="default" @click="handleDetail(scope.row)">
                    <i
                      class="apconfont apcon-yanjing_xianshi"
                      style="padding-right: 5px"
                    />
                  </a>
                  <el-dropdown @command="handleCommand($event, scope.row)">
                    <span class="el-dropdown-link default-link">
                      <i class="el-icon-more" />
                    </span>
                    <!-- @click="handleCommand('lock',scope)" -->
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="delete">
                        删除
                      </el-dropdown-item>
                      <el-dropdown-item
                        command="copy"
                        @click.native="handleCopy(scope.row, $event)"
                      >
                        复制外链
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
                :total="$store.state.resource.listData.total"
                @size-change="handleSizeChange"
                @current-change="handleCurrentPageChange"
              />
            </div>
          </div>
        </div>
      </el-card>
    </div>
    <detail-box
      v-if="detailDialogVisible"
      :visible.sync="detailDialogVisible"
      :row="currentRow"
    />
    <upload-Select
      v-if="uploadDialogVisible"
      :visible.sync="uploadDialogVisible"
      @close="handleUploadClose"
    ></upload-Select>
  </page-view>
</template>

<script>
import clip from "@/utils/clipboard"; // use clipboard directly

// import Brandcrumb from '@/components/Brandcrumb/index.vue'
import PageView from "@/layouts/PageView";
import UploadSelect from "./uploadSelect";
import DetailBox from "./detailBox";

export default {
  components: {
    // Brandcrumb,
    PageView,
    UploadSelect,
    DetailBox,
  },
  data() {
    return {
      detailDialogVisible: false,
      uploadDialogVisible: false,
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
      simpleSearchObj: {
        key: "relativePath", // 固定为这个
        value: "",
      },
      tableFilters: {},
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
      this.$store.dispatch("resource/list", { payload: this.queryParams() });
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
    // 打开详情界面
    handleDetail(row) {
      console.log(row);
      this.currentRow = row;
      this.detailDialogVisible = true;
    },
    handleCopy(row, event) {
      clip(row.url, event, {
        successMsg: "复制外链地址成功",
        errorMsg: "复制外链地址失败",
      });
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
          self.$store.dispatch("resource/delete", {
            payload: { ids },
            callback: (resp) => {
              const { count } = resp;
              self.$message({
                type: "success",
                message: `成功删除${count}条!`,
              });
              const { list, pageNum, pageSize, total } =
                self.$store.state.resource.listData;
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
    handleUploadClose() {
      this.queryListData();
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
      } else if (command === "copy") {
        // console.log('copy')
        // this.handleCopy(row)
      }
    },
  },
  created() {
    // const res = await new ResourceService().listData()
    // console.log(res)
    // this.initData()
    console.log(111);
    this.queryListData();
  },
};
</script>
