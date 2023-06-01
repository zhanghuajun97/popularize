<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="第几次回复">
				<el-input v-model="listQuery.skip" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="平台名称">
				<el-input v-model="listQuery.app_name" type="text" placeholder="请输入" clearable></el-input>
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
      <el-table-column label="企微客服名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企微客服id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.open_kfid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企微主体id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.corp_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转链接" align="center">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="普通文本" align="center">
        <template slot-scope="{row}">
          <span>{{ row.text_content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转文本" align="center">
        <template slot-scope="{row}">
          <span>{{ row.href_content }}</span>
        </template>
      </el-table-column>
      <el-table-column label="第几次回复" align="center">
        <template slot-scope="{row}">
          <span>{{ row.skip }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.app_name }}</span>
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

    <el-dialog :title="isEdit ? '编辑企微客服账号' : '新增企微客服账号'" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="企微客服">
          <el-select v-model="editData.open_kfid"  clearable filterable style="width: 60%" placeholder="请选择" @change="changeKf">
            <el-option v-for="(item, index) in kflist" :key="index" :label="item.name" :value="item.open_kfid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企微主体id">
          <el-input v-model="editData.corp_id" type="text" style="width: 60%"  readonly></el-input>
        </el-form-item>       
        <el-form-item label="回复次数">
          <el-input v-model="editData.skip" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="editData.url" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="普通文本">
          <el-input v-model="editData.text_content" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="跳转文本">
          <el-input v-model="editData.href_content" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="绑定名称">
          <el-input v-model="editData.app_name" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
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
import { msgKfList, weworkMsgList,  auditWeworkMsg } from '@/api/tools'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10,
  skip: '',
  app_name: ''
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
        name: '',
        corp_id: '',
        open_kfid: '',
        account_id: '',
        source_name: '',
        remark: '',
        url: '',
        text_content: '',
        href_content: '',
        return_type: ''
      },
      kflist: [],
      addBtn: false,
    }
  },
  created() {
    this.getList();
    this.getKfList();
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
    getKfList () {
      msgKfList().then(response => {
         if (response.code == 1) {
            this.kflist = response.data
         }
      })
    },
    // 选择客服
    changeKf (val) {
      this.kflist.forEach(item => {
        if (item.open_kfid == val) {
          this.editData.corp_id = item.corp_id
        }
      })
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      weworkMsgList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          this.total = response.data.total
        }
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 获取接待客服id
    getId () {
      if (this.editData.corp_id) {
        window.open(`https://zgzbtg.zgzb.com/wechatwork/auth/getList?corp_id=${this.editData.corp_id}`)
      } else {
        this.$message.warning('请先输入企微主体id')
      }
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
         corp_id: this.editData.corp_id,
         open_kfid: this.editData.open_kfid,
         skip: this.editData.skip,
         url: this.editData.url,
         text_content: this.editData.text_content,
         href_content: this.editData.href_content,
         app_name: this.editData.app_name
      }
      if (this.isEdit) {
        params.id = this.editData.id
      }
      auditWeworkMsg(params).then(response => {
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
