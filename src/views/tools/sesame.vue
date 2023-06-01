<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
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
      <el-table-column label="公众号名称" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="appid" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.appid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="wechatapp_id" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.wechatapp_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="K线课堂历史订阅人群标签" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gid_one_tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="大咖策略历史订阅人群标签" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gid_two_tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="龙头早报历史订阅人群标签" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.gid_three_tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已添加人群标签" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.pay_add_tag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="已支付未添加人群标签" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.pay_no_add_tag }}</span>
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

    <el-dialog :title="isEdit ? '编辑芝麻小事标签' : '新增芝麻小事标签'" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="230px" style="margin-top: 20px;">
        <el-form-item label="appid">
          <el-input v-model="editData.appid" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="wechatapp_id">
          <el-input v-model="editData.wechatapp_id" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="K线课堂历史订阅人群标签">
          <el-input v-model="editData.gid_one_tag" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="大咖策略历史订阅人群标签">
          <el-input v-model="editData.gid_two_tag" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="龙头早报历史订阅人群标签">
          <el-input v-model="editData.gid_three_tag" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="已添加人群标签">
          <el-input v-model="editData.pay_add_tag" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="已支付未添加人群标签">
          <el-input v-model="editData.pay_no_add_tag" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
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
import { sesameList, auditSesame } from '@/api/tools'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10
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
        appid: '', // 修改appid后根据与公众号的对比显示公众号名称
        wechatapp_id: '', 
        gid_one_tag: '', 
        gid_two_tag: '',
        gid_three_tag: '',
        pay_add_tag: '',
        pay_no_add_tag: ''
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
      sesameList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          this.total = response.data.total
        }
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
      let params = {
         appid: this.editData.appid,
         wechatapp_id: this.editData.wechatapp_id,
         gid_one_tag: this.editData.gid_one_tag,
         gid_two_tag: this.editData.gid_two_tag,
         gid_three_tag: this.editData.gid_three_tag,
         pay_add_tag: this.editData.pay_add_tag,
         pay_no_add_tag: this.editData.pay_no_add_tag
      }
      if (this.isEdit) {
        params.id = this.editData.id
      }
      auditSesame(params).then(response => {
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
