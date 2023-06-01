<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="vivo账号名称">
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
			>
			   新增
			</el-button>
      <span style="margin-left: 70px;">账号：SHzhongzt2022</span>
      <span style="margin-left: 70px;">密码：SHzhongzt2022&</span>
      <el-button style="margin-left: 70px" type="primary" @click="openApp">
        应用地址
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
      <el-table-column label="（TYPE）账号序号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号id" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.accountId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号名称" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号密码" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.password }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号数据源id" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.record }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号code" align="center" width="600" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号token" align="center" width="600" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.token }}</span>
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
        <el-form-item label="账号id">
          <el-input v-model="editData.accountId" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号名称">
          <el-input v-model="editData.name" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号密码">
          <el-input v-model="editData.password" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="数据源id">
          <el-input v-model="editData.record" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="code">
          <el-input v-model="editData.code" type="text" style="width: 60%" clearable></el-input>
          <el-button type="primary" style="margin-left: 40px;" @click="getCode()">获取code</el-button>
        </el-form-item>
        <el-form-item label="token">
          <el-input v-model="editData.token" type="text" style="width: 60%" clearable></el-input>
          <el-button type="primary" style="margin-left: 40px;" @click="getToken()">获取token</el-button>
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
import { vivoList, vivoInfo, auditVivo } from '@/api/account'
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
    // 打开应用地址
    openApp () {
      window.open('https://open-ad.vivo.com.cn/application/detail?appId=20221108011', "_blank");
    },
    // 获取code
    getCode () {
      window.open('https://open-ad.vivo.com.cn/OAuth?clientId=20221108011&state=0&redirectUri=https://zgzbtg.zgzb.com/wxxcx/callbacks/vivoAuth', "_blank")
    },
    // 获取token
    getToken () {
      var code =  this.editData.code;
       if(code != undefined && code != ''){
            var url = 'https://zgzbtg.zgzb.com/wxxcx/callbacks/getVivoToken?code=' + code;
            window.open(url,'_blank');
       } else{
            this.$message.error('code不能为空');
       }
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
      vivoList(this.listQuery).then(response => {
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
         accountId: this.editData.accountId,
         password: this.editData.password,
         record: this.editData.record,
         code: this.editData.code,
         token: this.editData.token
      }
      if (this.isEdit) {
        params.id = this.editData.id
      }
      auditVivo(params).then(response => {
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
