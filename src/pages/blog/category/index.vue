<template>
  <page-view>
    <div class="basic-page-content">
      <el-card>
        <div class="table-constainer">
          <!-- <div class="tableListOperator">
            <div class="left-operator">
              <el-button icon="el-icon-plus" @click="handleAdd(null)"
                >新增分类</el-button
              >
            </div>
          </div> -->
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
            <el-table-column prop="id" label="ID"></el-table-column>
            <el-table-column
              prop="name"
              label="分类名称"
              width="250"
            ></el-table-column>
            <el-table-column
              prop="urlName"
              label="URL Name"
              width="250"
            ></el-table-column>
            <el-table-column
              prop="articleCount"
              label="文章数"
              width="100"
              sortable
            ></el-table-column>
            <el-table-column
              prop="sort"
              label="优先级"
              width="100"
              sortable
            ></el-table-column>
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
