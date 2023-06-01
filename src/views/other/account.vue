<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-button
         style="margin-left: 20px;"
			   type="primary"
			   @click="addCode()"
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
      <el-table-column label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.cid }}</span>
        </template>
      </el-table-column>     
      <el-table-column label="广告账号名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告账号编号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="delCode(row)">
            解绑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="新增广告账号" :visible.sync="dialogFormVisible" width="1200px">
      <el-form :model="digQuery" ref="ruleForm" label-width="100px" inline style="margin-top: 20px;">
        <el-form-item label="平台">
          <el-select v-model="digQuery.sc_id" clearable>
            <el-option v-for="(item, index) in groupList"  :key="index" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="digQuery.accountname" type="text" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="编号">
          <el-input v-model="digQuery.accountid" type="text" placeholder="请输入" clearable></el-input>
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
      </el-form>

      <el-table
        class="table"
        v-loading="listLoading"
        height="700px"
        :data="digList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="ID" align="center">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="广告账号名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.account_name }}</span>
            </template>
        </el-table-column>
        <el-table-column label="广告账号编号" align="center">
          <template slot-scope="{row}">
            <span>{{ row.account_id }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="平台" align="center">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="addAccount(row)">
            加入
          </el-button>
        </template>
      </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import { clientList, plateList, searchAccountList, addClient, deleteClient } from '@/api/other'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  uid: ''
}

const defaultDigQuery = {
  sc_id: '',
  accountid: '',
  accountname: ''
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
      digLoading: false,
      digQuery: JSON.parse(JSON.stringify(defaultDigQuery)),
      digList: [],
      selectedNum: 0,
      selectedArr: [],
      groupList: []
    }
  },
  created() {
    this.listQuery.uid = this.$route.query.id
    this.getList();
  },
  methods: {
    getPlateList () {
      plateList().then(res => {
        if (res.code == 1) {
          this.groupList = res.data;
        }
      })
    },
    // 重置
    handleReset () {
      this.digQuery = JSON.parse(JSON.stringify(defaultDigQuery))
      this.getCodeList()
    },
    // 新增二维码列表
    getCodeList () {
      this.digLoading = true;
      searchAccountList(this.digQuery).then(res => {
        if (res.code == 1) {
          this.digList = res.data;
        }
        this.digLoading = false;
      })
    },
    // 加入
    addAccount (row) {
      let params = {
        uid: this.$route.query.id,
        id: row.id,
        title: row.title,
        account_id: row.account_id,
        account_name: row.account_name
      };
      addClient(params).then(res => {
        if (res.code == 1) {
          this.$message.success('绑定成功')
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
        this.dialogFormVisible = false;
      })
    },
    // 查询
    handleSearch() {
			this.getCodeList()
		},
    // 获取列表数据
    getList() {
      this.listLoading = true
      clientList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data
        }
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 新增账号
    addCode () {
      this.dialogFormVisible = true;
      this.getPlateList()
      this.getCodeList()
    },
    delCode (row) {
      let params = {
        uid: this.$route.query.id,
        cid: row.cid
      }
      deleteClient(params).then(res => {
         if (res.code == 1) {
           this.$message.success('解绑成功');
           this.getList()
         } else {
          this.$message.error(res.msg)
         }
      })
    },
  }
}
</script>
<style scoped>
  .table {
    margin-top: 20px;
  }
</style>
