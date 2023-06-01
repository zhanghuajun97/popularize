<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="360点睛账号名称">
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
				>重置</el-button
			>
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
      <el-table-column label="（TYPE）360点睛账号ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="360点睛账号名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="360点睛账号jzqs" align="center">
        <template slot-scope="{row}">
          <span>{{ row.jzqs }}</span>
        </template>
      </el-table-column>
      <el-table-column label="360点睛账号key" align="center">
        <template slot-scope="{row}">
          <span>{{ row.key }}</span>
        </template>
      </el-table-column>
      <el-table-column label="360点睛账号secret" align="center" width="500">
        <template slot-scope="{row}">
          <span>{{ row.secret }}</span>
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

    <el-dialog :title="isEdit ? '编辑360账号' : '新增360账号'" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="360账号名称">
          <el-input v-model="editData.name" type="text" style="width: 60%" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="jzqs">
          <el-input v-model="editData.jzqs" type="text" style="width: 60%" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="key">
          <el-input v-model="editData.key" type="text" style="width: 60%" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="secret">
          <el-input v-model="editData.secret" type="text" style="width: 60%" placeholder="请输入" clearable></el-input>
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
import { ocpcList, addOcpc, editOcpc } from '@/api/account'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10,
  name: '',
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
        jzqs: '',
        key: '',
        secret: ''
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
    // 重置
    handleReset() {
      this.listQuery = JSON.parse(JSON.stringify(defaultQuery))
      this.getList()
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      ocpcList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          this.total = response.data.total
        }
        
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 新增、编辑账号
    editInfo () {
      this.addBtn = true;
      let params = {
         name: this.editData.name,
         jzqs: this.editData.jzqs,
         key: this.editData.key,
         secret: this.editData.secret
      }
      if (this.isEdit) {
        params.id = this.editData.id;
        editOcpc(params).then(response => {
          this.addBtn = false;
          if (response.code == 1) {
            this.dialogFormVisible = false;
            this.getList()
            this.$message.success('编辑成功')
          } else {
            this.$message.error(response.msg)
          }
        })
      } else {
        addOcpc(params).then(response => {
          this.addBtn = false;
          if (response.code == 1) {
            this.dialogFormVisible = false;
            this.getList()
            this.$message.success('新增成功')
          } else {
            this.$message.error(response.msg)
          }
        })
      }
      
    },
    // 新增360账号
    addaccount () {
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.editData = JSON.parse(JSON.stringify(this.info))
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
