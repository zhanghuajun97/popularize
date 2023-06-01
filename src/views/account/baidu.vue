<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="百度账号名称">
				<el-input v-model="listQuery.name" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="账号类型">
			  <el-select v-model="listQuery.skip" clearable placeholder="请选择">
          <el-option label="信息流" :value="2"></el-option>
			    <el-option label="搜索流" :value="1"></el-option>
			  </el-select>
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
      <el-table-column label="（TYPE）百度账号ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="百度账号名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="百度账号token" align="center" width="700">
        <template slot-scope="{row}">
          <span>{{ row.token }}</span>
        </template>
      </el-table-column>
      <el-table-column label="百度账号类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.skip }}</span>
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

    <el-dialog title="编辑百度账号" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="账号类型">
          <el-select v-model="editData.skip" clearable style="width: 60%">
            <el-option label="信息流" :value="2"></el-option>
            <el-option label="搜索流" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="百度账号名称">
          <el-input v-model="editData.name" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="TOKEN">
          <el-input v-model="editData.token" type="text" style="width: 60%" clearable></el-input>
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
import { baiduList, baiduInfo, auditBaidu } from '@/api/account'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10,
  name: '',
  skip: ''
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
      baiduList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          response.data.list.forEach((item, index) => {
             if (item.skip == 2) {
               this.list[index].skip = '信息流'
             } else {
               this.list[index].skip = '搜索流'
             }
          })
          this.total = response.data.total
        }
        
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 编辑账号
    editInfo () {
      this.addBtn = true;
      let params = {
         id: this.editData.id,
         name: this.editData.name,
         token: this.editData.token,
         skip: this.editData.skip
      }
      auditBaidu(params).then(response => {
        this.addBtn = false;
        if (response.code == 1) {
          this.dialogFormVisible = false;
          this.getList()
          this.$message.success('编辑成功')
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    handleUpdate(row) {
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
