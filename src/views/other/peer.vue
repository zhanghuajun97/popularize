<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="姓名">
				<el-input v-model="listQuery.name" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
      <el-form-item label="unionid">
				<el-input v-model="listQuery.unionid" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
      <el-form-item label="屏蔽原因">
				<el-select v-model="listQuery.type" clearable style="width: 60%">
            <el-option label="同行" :value="1"></el-option>
            <el-option label="超龄" :value="2"></el-option>
            <el-option label="不可开发" :value="3"></el-option>
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
      <el-table-column label="序号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信unionid" align="center">
        <template slot-scope="{row}">
          <span>{{ row.unionid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="屏蔽原因" align="center">
        <template slot-scope="{row}">
          <span>{{ formatterType(row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.vccustomerid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="屏蔽状态" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.close"
            :active-value="1"
            :inactive-value="2"
            @change="changeStatus(row)"
          ></el-switch>
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

    <el-dialog :title="isEdit ? '编辑推广页面关键字' : '新增推广页面关键字'" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="客户id">
          <el-input v-model="editData.vccustomerid" type="text" style="width: 60%" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="客户名称">
          <el-input v-model="editData.name" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="unionid">
          <el-input v-model="editData.unionid" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="屏蔽原因">
          <el-select v-model="editData.type" clearable style="width: 60%">
          <el-option label="同行" :value="1"></el-option>
          <el-option label="超龄" :value="2"></el-option>
          <el-option label="不可开发" :value="3"></el-option>
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
import { peerList, auditPeer, changeUserStatus } from '@/api/other'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10,
  name: '',
  unionid: '',
  type: ''
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
        key: '',
        info: '',
        content: ''
      },
      addBtn: false,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 修改状态
    changeStatus (row) {
      let params = {
        id: row.id,
        data: row.close == 1 ? 1 : 2
      };
      changeUserStatus(params).then(res => {
         if (res.code == 1) {
           this.$message.success('修改成功')
           this.getList()
         }
      })
    },
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
      peerList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          this.total = response.data.total
        }
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
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
        vccustomerid: this.editData.vccustomerid,
        name: this.editData.name,
        unionid: this.editData.unionid,
        type: this.editData.type
      }
      if (this.isEdit) {
        params.id = this.editData.id
      }
      auditPeer(params).then(response => {
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
    // 格式化屏蔽原因
    formatterType (type) {
      switch (type) {
        case 1:
          return '同行'
        case 2:
          return '超龄'
        case 3:
          return '不可开发'　
        case 4:
          return '非股民'
        default:
          return '不可开发'
      }
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
