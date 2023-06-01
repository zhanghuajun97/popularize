<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="oppo账号名称">
				<el-input v-model="listQuery.name" type="text" placeholder="请输入" clearable></el-input>
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
				>重置
      </el-button>
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
      <el-table-column label="（TYPE）账号ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="oppo账号名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告主id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.owner_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="api_id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.api_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="api_key" align="center">
        <template slot-scope="{row}">
          <span>{{ row.api_key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="isEdit ? '编辑账号' : '新增账号'" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="账号名称">
          <el-input v-model="editData.name" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="广告主id">
          <el-input v-model="editData.owner_id" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="api_id">
          <el-input v-model="editData.api_id" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="api_key">
          <el-input v-model="editData.api_key" type="text" style="width: 60%" clearable></el-input>
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
import { oppoList, oppoInfo, auditOppo } from '@/api/account'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10,
  name: ''
}

export default {
  components: { Pagination },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: JSON.parse(JSON.stringify(defaultQuery)),
      dialogFormVisible: false,
      editData: {},
      isEdit: false,
      info: {
        name: '',
        owner_id: '',
        api_id: '',
        api_key: ''
      },
      addBtn: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 查询
    handleSearch() {
			this.listQuery.page = 1
			this.getList()
		},
    // 新增账号
    addaccount () {
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.editData = JSON.parse(JSON.stringify(this.info))
    },
    // 重置
    handleReset() {
      this.listQuery = JSON.parse(JSON.stringify(defaultQuery))
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      oppoList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          this.total = response.data.total
        }
        
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 编辑账号
    editInfo () {
      this.addBtn = true;
      let params = {
         name: this.editData.name,
         owner_id: this.editData.owner_id,
         api_id: this.editData.api_id,
         api_key: this.editData.api_key
      }
      if (this.isEdit) {
        params.id = this.editData.id
      }
      auditOppo(params).then(response => {
        this.addBtn = false;
        if (response.code == 1) {
          this.dialogFormVisible = false;
          this.getList()
          this.isEdit ? this.$message.success('编辑成功') : this.$message.success('新增成功')
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleUpdate(row) {
      this.isEdit = true;
      this.dialogFormVisible = true;
      this.editData = JSON.parse(JSON.stringify(row));
    }
  }
}
</script>
<style scoped>
  .table {
    margin-top: 20px;
  }
</style>
