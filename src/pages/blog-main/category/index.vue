<template>
  <page-view>
    <div class="basic-page-content">
      <el-card>
        <div class="table-constainer">
          <div class="tableListOperator">
            <div class="left-operator">
              <el-button icon="el-icon-plus" @click="handleAdd(null)"
                >新增一级分类</el-button
              >
            </div>
          </div>
          <el-table
            v-loading="$store.state.user.loading.fetch"
            :data="$store.state.category.treeData"
            style="width: 100%; min-height: 200px"
            :header-cell-style="{
              'background-color': '#F6F8F9',
              padding: '6px 0',
            }"
            row-key="id"
            size="medium"
            :expand-row-keys="['1', '22']"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
            @filter-change="handleFilterChange"
            @sort-change="handleSortChange"
          >
            <el-table-column
              prop="name"
              label="分类名称"
              sortable
              width="250"
            ></el-table-column>
            <el-table-column
              prop="sort"
              label="优先级"
              width="100"
            ></el-table-column>
            <el-table-column
              label="状态"
              min-width="100"
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
            <el-table-column fixed="right" label="操作" width="160">
              <template slot-scope="scope">
                <div>
                  <a
                    class="default"
                    @click="handleEdit(scope.row)"
                    style="padding-right: 10px"
                  >
                    <i class="el-icon-edit"></i>
                  </a>
                  <a
                    class="default"
                    @click="handleAdd(scope.row)"
                    style="padding-right: 10px"
                  >
                    <i class="el-icon-folder-add"></i>
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
                      <el-dropdown-item command="online">
                        发布
                      </el-dropdown-item>
                      <el-dropdown-item command="offline">
                        锁定
                      </el-dropdown-item>
                      <el-dropdown-item command="delete">
                        删除
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-card>
    </div>
    <add-box
      v-if="addDialogVisible"
      :visible.sync="addDialogVisible"
      :row="currentRow"
    />
    <edit-box
      v-if="editDialogVisible"
      :visible.sync="editDialogVisible"
      :row="currentRow"
    />
    <!-- <upload-Select v-if="uploadDialogVisible" :visible.sync="uploadDialogVisible"></upload-Select> -->
  </page-view>
</template>
<script>
// import StandardTable from "@/components/standardTable/index";
import PageView from "@/layouts/PageView";
import EditBox from "./edit";
import AddBox from "./add";

export default {
  components: {
    // StandardTable,
    // Brandcrumb,
    PageView,
    EditBox,
    AddBox,
  },
  data() {
    return {
      addDialogVisible: false,
      editDialogVisible: false,
      currentRow: null,
      tableFilters: {},
      sorter: {}, // 排序 sortfield: 'id', sorttype: 'asc'
    };
  },
  methods: {
    // 获取排序参数
    getFiltersParams() {
      let searchOptions = {};
      // // 如果是用普通搜索
      // if (!this.showMoreSearch) {
      //   if (this.simpleSearchObj.key) {
      //     searchOptions[this.simpleSearchObj.key] = this.simpleSearchObj.value
      //   }
      // } else {
      //   searchOptions = {
      //     ...this.filters
      //   }
      // }
      searchOptions = {
        ...searchOptions,
        ...this.tableFilters,
      };
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
    // 生成查询条件
    queryParams() {
      return {
        ...this.getFiltersParams(),
        ...this.getSorterParams(),
      };
    },
    queryTreeData() {
      this.$store.dispatch("category/tree", { payload: this.queryParams() });
    },
    // 排序
    handleSortChange({ prop, order }) {
      if (prop) {
        this.sorter = {
          sortfield: prop,
          sorttype: order === "descending" ? "desc" : "asc",
        };
      } else {
        this.sorter = {};
      }
      this.queryTreeData();
    },
    // 表头过滤
    handleFilterChange(filters) {
      // // filters)
      const tableFilters = {};
      Object.keys(filters).forEach((key) => {
        if (filters[key] && filters[key].length > 0) {
          tableFilters[key] = filters[key].join(",");
        } else {
          delete tableFilters[key];
        }
      });
      this.tableFilters = tableFilters;
      // console.log(this.tableFilters)
      this.pageNum = 1; // 当前页码重置
      this.queryTreeData();
    },
    handleEdit(row) {
      this.currentRow = row;
      this.editDialogVisible = true;
    },
    handleAdd(row) {
      this.currentRow = row;
      this.addDialogVisible = true;
    },
  },
  created() {
    this.queryTreeData();
    // (this.$store.state.category.treeData && this.$store.state.category.treeData.length > 0) || this.$store.dispatch('category/tree')
  },
};
</script>
