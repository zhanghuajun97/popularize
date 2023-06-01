<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <!-- <el-form-item label="关键字">
				<el-input v-model="listQuery.info" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-button
         style="margin-left: 20px;"
			   type="primary"
			   icon="el-icon-search"
			   @click="handleSearch"
			>
			   搜索
			</el-button>
			<el-button type="danger" icon="el-icon-refresh" @click="handleReset"
				>重置</el-button> -->
        <el-button
         style="margin-left: 20px;"
			   type="primary"
			   @click="addaccount()"
         icon="el-icon-plus"
			>
			   新增
			</el-button>
		</el-form>

    <el-table
      class="table"
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="运营类型ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="运营形式" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="deleteOperate(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" /> -->

    <el-dialog title="新增运营形式" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="运营形式">
          <el-select v-model="editData.id" clearable multiple filterable>
            <el-option v-for="(item, index) in userlist"  :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="editInfo" :loading="addBtn">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { operateType, addOperate, delOperate } from '@/api/other'
import { groupList } from '@/api/user'
// import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10,
  info: ''
}

export default {
  // components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      userlist: [],
      listQuery: JSON.parse(JSON.stringify(defaultQuery)),
      dialogFormVisible: false,
      editData: {},
      type: [],
      isEdit: false,
      info: {
        key: '',
        info: '',
        content: ''
      },
      addBtn: false,
    }
  },
  created() {
    this.getGroupList()
    this.getList();
  },
  methods: {
    // 查询
    handleSearch() {
			this.listQuery.page = 1
			this.getList()
		},
    // 重置
    handleReset() {
      this.listQuery = JSON.parse(JSON.stringify(defaultQuery))
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      operateType().then(response => {
        if (response.code == 1) {
          this.list = response.data
        }
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    getGroupList() {
      groupList({}).then(response => {
        if (response.code == 1) {
          this.userlist = response.data
        }      
      })
    },
    // 新增账号
    addaccount () {
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.editData = JSON.parse(JSON.stringify(this.info))
    },
    // 编辑账号
    editInfo () {
      this.addBtn = true;
      let list = [];
      this.userlist.forEach(item1 => {
        this.editData.id.forEach(item2 => {
          if (item1.id == item2) {
            list.push(item1)
          }
        })
      })
      let params = {
        data: list
      }
      addOperate(params).then(response => {
        this.addBtn = false;
        if (response.code == 1) {
          this.dialogFormVisible = false;
          this.getList()
          this.$message.success('新增成功')
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    deleteOperate (row) {      
      this.$confirm("确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          if (row.id != 0) {
            let params = {
            id: row.id
            };
            delOperate(params).then(response => {
              if (response.code == '1') {
                this.$message.success('删除成功')
                this.getList()
              } else {
                this.$message.error(response.msg)
              }
            })
          } else {
            this.$message.error('自运营不可删除')
          }
          
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
  }
}
</script>
<style scoped>
  .table {
    margin-top: 20px;
  }
</style>
