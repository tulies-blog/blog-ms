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
                @click="$router.push('/article/write')"
                >发表文章</el-button
              >
              <el-button
                type="plain"
                icon="apconfont apcon-icon_fabu"
                @click="handleCommandBatch('online')"
                >发布</el-button
              >
              <el-button
                type="plain"
                icon="apconfont apcon-xiaxian"
                @click="handleCommandBatch('offline')"
                >下线</el-button
              >
              <el-button
                type="plain"
                icon="el-icon-delete"
                @click="handleCommandBatch('delete')"
                >删除</el-button
              >
            </div>
            <div class="right-operator">
              <div v-if="!showMoreSearch">
                <el-input
                  clearable
                  placeholder="请输入内容"
                  v-model="simpleSearchObj.value"
                  class="input-with-select"
                  style="width: 280px; margin-left: 9px"
                  @clear="queryListData"
                >
                  <!-- @keyup.enter.native="handleSearch" -->
                  <el-select
                    v-model="simpleSearchObj.key"
                    slot="prepend"
                    placeholder="请选择"
                    style="width: 90px"
                  >
                    <el-option label="标题" value="title"></el-option>
                    <el-option label="文章ID" value="id"></el-option>
                    <el-option label="分类ID" value="categoryId"></el-option>
                    <el-option label="标签" value="tags"></el-option>
                  </el-select>
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="handleSearch"
                  ></el-button>
                </el-input>
                <el-button
                  style="margin-left: 9px"
                  icon="apconfont apcon-xiangxiazhanhang"
                  @click="handleShowMoreSearch(true)"
                  >高级查询</el-button
                >
              </div>
              <div v-else>
                <el-button
                  style
                  icon="apconfont apcon-xiangshangzhanhang"
                  @click="handleShowMoreSearch(false)"
                  >收起</el-button
                >

                <el-button icon="el-icon-refresh" @click="handleReset"
                  >重置</el-button
                >

                <el-popover
                  style="margin-left: 9px"
                  slot="append"
                  placement="bottom"
                  trigger="click"
                  width="120"
                  popper-class="ableListOperator-popover"
                >
                  <el-checkbox-group
                    v-model="moreSearchCheckList"
                    @change="handleMoreSearchChange"
                  >
                    <el-checkbox
                      v-for="prop in moreSeachProps"
                      :label="prop.value"
                      :key="prop.value"
                      :disabled="prop.disabled"
                      >{{ prop.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                  <el-button slot="reference" icon="el-icon-circle-plus"
                    >添加条件</el-button
                  >
                </el-popover>
                <el-button
                  style="margin-left: 9px"
                  @click="handleSearch"
                  slot="append"
                  icon="el-icon-search"
                  type="primary"
                  plain
                  >点击查询</el-button
                >
              </div>
            </div>
          </div>
          <div class="search-constainer" v-if="showMoreSearch">
            <el-form :inline="true" class="demo-form-inline" size="mini">
              <template v-for="k in moreSearchCheckList">
                <el-form-item :key="k" v-if="k === 'id'" label="ID">
                  <el-input
                    v-model="filters.id"
                    placeholder="请输入文章ID"
                  ></el-input>
                </el-form-item>
                <el-form-item :key="k" v-if="k === 'title'" label="标题">
                  <el-input
                    v-model="filters.title"
                    placeholder="请输入文章标题"
                  ></el-input>
                </el-form-item>
                <el-form-item :key="k" v-if="k === 'tags'" label="标签">
                  <el-input
                    v-model="filters.tags"
                    placeholder="请输入标签"
                  ></el-input>
                </el-form-item>
                <el-form-item :key="k" v-if="k === 'categoryId'" label="分类">
                  <el-input
                    v-model="filters.categoryId"
                    placeholder="请输入分类ID"
                  ></el-input>
                </el-form-item>
                <el-form-item :key="k" v-if="k === 'status'" label="状态">
                  <el-input
                    v-model="filters.status"
                    placeholder="请输入状态"
                  ></el-input>
                </el-form-item>
              </template>
            </el-form>
          </div>
          <el-table
            ref="listTable"
            v-loading="$store.state.article.loading.fetch"
            :data="$store.state.article.listData.list"
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
            <template v-for="t in tableColumnCheckedList">
              <el-table-column
                :key="t"
                v-if="t === 'poster'"
                fixed
                label="图片"
                width="70"
              >
                <template slot-scope="scope">
                  <img
                    :src="scope.row.poster"
                    style="max-width: 46px; max-height: 46px"
                  />
                </template>
              </el-table-column>
              <el-table-column
                :key="t"
                v-if="t === 'id'"
                fixed
                prop="id"
                label="ID"
                width="70"
              ></el-table-column>
              <el-table-column
                :key="t"
                v-if="t === 'title'"
                fixed
                prop="title"
                label="标题"
                min-width="250"
              ></el-table-column>
              <el-table-column
                :key="t"
                v-if="t === 'tags'"
                prop="tags"
                label="标签"
                width="150"
              ></el-table-column>
              <el-table-column
                :key="t"
                v-if="t === 'category'"
                prop="categoryId"
                label="分类"
                width="100"
              ></el-table-column>
              <el-table-column
                :key="t"
                v-if="t === 'status'"
                label="状态"
                width="80"
                column-key="status"
                :filters="[
                  { text: '删除', value: -1 },
                  { text: '待发布', value: 0 },
                  { text: '已发布', value: 1 },
                  { text: '下线', value: 2 },
                ]"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.status === -1" class="color-danger"
                    >删除</span
                  >
                  <span v-else-if="scope.row.status === 0" class="color-info"
                    >待发布</span
                  >
                  <span v-else-if="scope.row.status === 1" class="color-success"
                    >已发布</span
                  >
                  <span v-else-if="scope.row.status === 2" class="color-warning"
                    >下线</span
                  >
                  <span v-else class="color-warning">未知</span>
                </template>
              </el-table-column>
              <el-table-column
                :key="t"
                v-if="t === 'pv'"
                prop="pv"
                label="浏览量"
                width="80"
              ></el-table-column>
              <el-table-column
                :key="t"
                v-if="t === 'updateTime'"
                prop="updateTime"
                label="最后更新"
                width="160"
                sortable
              ></el-table-column>
              <el-table-column
                :key="t"
                v-if="t === 'createTime'"
                prop="createTime"
                label="创建更新"
                width="160"
                sortable
              ></el-table-column>
            </template>
            <el-table-column fixed="right" width="70">
              <!-- slot-scope="scope" -->
              <template slot="header">
                <span>操作</span>
                <el-popover
                  slot="append"
                  placement="bottom"
                  trigger="click"
                  width="120"
                  popper-class="ableListOperator-popover"
                  @show="handlePopoverShow"
                >
                  <el-checkbox-group
                    v-if="showMoreSearchCheckbox"
                    v-model="tableColumnCheckedList"
                  >
                    <el-checkbox
                      v-for="c in tableHeaderProps"
                      :label="c.value"
                      :key="c.value"
                      :checked="c.checked"
                      :disabled="c.disabled"
                      >{{ c.label }}</el-checkbox
                    >
                  </el-checkbox-group>
                  <i slot="reference" class="el-icon-circle-plus"></i>
                  <!-- <el-button slot="reference" icon="el-icon-circle-plus" type="text" circle size="mini"></el-button> -->
                </el-popover>
              </template>

              <template slot-scope="scope">
                <div>
                  <a class="default" @click="handleDetail(scope.row)">
                    <i
                      class="el-icon-edit-outline"
                      style="padding-right: 5px"
                    />
                  </a>
                  <el-dropdown
                    @command="handleCommand($event, scope.row)"
                    trigger="click"
                  >
                    <span class="el-dropdown-link default-link">
                      <i class="el-icon-more" />
                    </span>
                    <!-- @click="handleCommand('lock',scope)" -->
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item command="delete">删除</el-dropdown-item>
                      <el-dropdown-item command="online">发布</el-dropdown-item>
                      <el-dropdown-item command="offline"
                        >下线</el-dropdown-item
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
                :total="$store.state.article.listData.total"
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
    <!-- <upload-Select v-if="uploadDialogVisible" :visible.sync="uploadDialogVisible"></upload-Select> -->
  </page-view>
</template>

<script>
import clip from "@/utils/clipboard"; // use clipboard directly

// import StandardTable from "@/components/standardTable/index";
// import Brandcrumb from '@/components/Brandcrumb/index.vue'
import PageView from "@/layouts/PageView";
// import DetailBox from './detailBox'

const initMoreSearchCheckList = ["id", "title", "tags", "status"];
const initTableColumnCheckedList = [
  "poster",
  "id",
  "title",
  "tags",
  "categoryId",
  "status",
  "pv",
  "createTime",
];
const moreSeachProps = [
  { label: "ID", value: "id", disabled: true },
  { label: "标题", value: "title", disabled: true },
  { label: "标签", value: "tags" },
  { label: "分类", value: "categoryId" },
  { label: "状态", value: "status" },
];
const tableHeaderProps = [
  { label: "图片", value: "poster", disabled: true },
  { label: "ID", value: "id", disabled: true },
  { label: "标题", value: "title", disabled: true },
  { label: "标签", value: "tags", disabled: true },
  { label: "分类", value: "categoryId", disabled: true },
  { label: "状态", value: "status", disabled: true },
  { label: "浏览量", value: "pv", disabled: true },
  { label: "更新时间", value: "updateTime" },
  { label: "创建时间", value: "createTime" },
];
const defaultValues = {
  id: "",
  title: "",
  tags: "",
  categoryId: "",
  status: "",
};
export default {
  components: {
    // StandardTable,
    // Brandcrumb,
    PageView,
    // DetailBox
  },
  data() {
    return {
      detailDialogVisible: false,
      createDialogVisible: false,
      multipleSelection: [],
      currentRow: null,
      pageNum: 1,
      pageSize: 10,

      // 查询过滤条件
      sorter: {}, // 排序 sortfield: 'id', sorttype: 'asc'

      /** ***********搜索用到的一些属性 ************/
      showMoreSearchCheckbox: false,
      showMoreSearch: false,
      moreSearchCheckList: [...initMoreSearchCheckList],
      moreSeachProps: { ...moreSeachProps },
      tableColumnCheckedList: [...initTableColumnCheckedList],
      tableHeaderProps: { ...tableHeaderProps },
      simpleSearchObj: {
        key: "",
        value: "",
      },
      // 检索字段
      filters: { ...defaultValues },
      tableFilters: {},
      /** ***********   over  *************/
    };
  },
  methods: {
    handlePopoverShow() {
      this.showMoreSearchCheckbox = true;
    },
    handleShowMoreSearch(flag) {
      this.showMoreSearch = flag;
      // this.handleReset()
    },
    handleMoreSearchChange() {
      // this.moreSearchCheckList
      // initMoreSearchCheckList
      // 遍历不在里面的就设置为初始值
      initMoreSearchCheckList.forEach((v) => {
        if (!this.moreSearchCheckList.includes(v)) {
          this.filters[v] = "";
        }
      });
      // 判断表头filter中是否有这个 如果有就要清除掉，以免冲突
      Object.keys(this.tableFilters).forEach((key) => {
        if (this.moreSearchCheckList.includes(key)) {
          // 那么就要清除掉对应的表头filter
          this.$refs.listTable.clearFilter(key);
          delete this.tableFilters[key];
          // this.tableFilters = this.tableFilters
        }
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

      // 如果是用普通搜索
      if (!this.showMoreSearch) {
        if (this.simpleSearchObj.key) {
          searchOptions[this.simpleSearchObj.key] = this.simpleSearchObj.value;
        }
      } else {
        searchOptions = {
          ...this.filters,
        };
      }
      searchOptions = {
        ...searchOptions,
        ...this.tableFilters,
      };
      console.log("searchOptions", searchOptions);
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
      this.$store.dispatch("article/list", { payload: this.queryParams() });
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
    // 重置
    handleReset() {
      // this.initdata()

      this.pagenum = 0;

      this.simpleSearchObj = { key: "", value: "" };
      this.filters = { ...defaultValues };
      this.moreSearchCheckList = [...initMoreSearchCheckList];
      // 表头的条件看自己需要，想加就加
      // this.$refs.listTable.clearFilter()
      console.log("handleReset", this.filters);
      this.queryListData();
    },
    // 检索查询
    handleSearch() {
      console.log(this.moreSearchCheckList);
      this.pageNum = 1; // 当前页码要重置
      this.queryListData();
    },
    // 排序
    handleSortChange({ column, prop, order }) {
      console.log(column);
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
          // 如果在高级搜索中有这个 我们就禁用它
          if (this.moreSearchCheckList.includes(key)) {
            this.moreSearchCheckList = this.moreSearchCheckList.filter(
              (v) => v !== key
            );
            delete this.filters[key];
          }
        } else {
          delete tableFilters[key];
        }
      });
      this.tableFilters = tableFilters;
      // console.log(this.tableFilters)
      this.pageNum = 1; // 当前页码重置
      this.queryListData();
    },
    // 打开详情界面
    handleDetail(row) {
      this.$router.push(`/article/${row.id}/edit`);
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
          self.$store.dispatch("article/delete", {
            payload: { ids },
            callback: (resp) => {
              const { count } = resp;
              self.$message({
                type: "success",
                message: `成功删除${count}条!`,
              });
              const { list, pageNum, pageSize, total } =
                self.$store.state.article.listData;
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
      this.$store.dispatch("article/changeStatus", {
        payload: { ids, status },
        callback: (resp) => {
          const { count } = resp;
          self.$message({
            type: "success",
            message: `成功下线${count}篇文章!`,
          });
          // todo 暂时我先偷懒直接刷新页面吧，以后优化
          this.queryListData();
        },
      });
    },
    handleOnline(ids) {
      const self = this;
      const status = 1;
      this.$store.dispatch("article/changeStatus", {
        payload: { ids, status },
        callback: (resp) => {
          const { count } = resp;
          self.$message({
            type: "success",
            message: `成功上线${count}篇文章!`,
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
