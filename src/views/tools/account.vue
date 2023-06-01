<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="账户名称">
				<el-input v-model="listQuery.name" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="小程序appid">
				<el-input v-model="listQuery.app_id" type="text" placeholder="请输入" clearable></el-input>
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
				>重置</el-button>
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
      <el-table-column label="序号id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号类型" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.type == '1' ? '公众号' : '小程序' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号名称" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="appid" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.app_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="appsecret" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.app_secret }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.html_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回传类型" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.returntype }}</span>
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

    <el-dialog :title="isEdit ? '编辑微信平台账号' : '新增微信平台账号'" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="账号名称">
          <el-input v-model="editData.name" type="text" style="width: 60%" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="账号类型">
          <el-select v-model="editData.type" clearable style="width: 60%" placeholder="请选择">
            <el-option label="公众号" :value="1"></el-option>
            <el-option label="小程序" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="appid">
          <el-input v-model="editData.app_id" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="app_secret">
          <el-input v-model="editData.app_secret" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="回传方式">
          <el-select v-model="editData.return_type"  clearable filterable style="width: 60%" placeholder="请选择">
            <el-option v-for="(item, index) in type" :key="index" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editData.html_id" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
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
import { wechatSetList, returnType, wechatSetInfo, auditWechatSet } from '@/api/tools'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10,
  name: '',
  app_id: ''
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
      type: [],
      isEdit: false,
      info: {
        name: '', //名称
        type: '', //类型
        app_id: '', //appid
        app_secret: '', //app_secret
        return_type: '', //回传方式
      },
      addBtn: false,
    }
  },
  created() {
    this.getReturn();
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
      wechatSetList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          response.data.list.forEach((item, index) => {
             this.list[index].returntype = this.formatterType(item.return_type)
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
        }, 1.5 * 1000)
      })
    },
    // 获取回传方式
    getReturn () {
      returnType().then(response => {
        if (response.code == 1) {
          this.type = response.data;
          this.getList();
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    // 格式化回传类型
    formatterType (id) {
      let title = ''
      this.type.forEach(item => {
        if (item.id == id) {
          title = item.title
        }
      })
      return title
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
      let params = {
         name: this.editData.name,
         type: this.editData.type,
         app_id: this.editData.app_id,
         app_secret: this.editData.app_secret,
         return_type: this.editData.return_type,
         html_id: this.editData.html_id
      }
      if (this.isEdit) {
        params.id = this.editData.id
      }
      auditWechatSet(params).then(response => {
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
