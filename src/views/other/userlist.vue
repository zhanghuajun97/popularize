<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
			<el-button type="primary" @click="register"
				>注册用户</el-button
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
      <el-table-column label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="昵称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center">
        <template slot-scope="{row}">
          <span>{{ row.status == 1 ? '开启' : '关闭' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.group_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="toAccount(row)" v-if="row.group_name == '代理商'">
            广告账户
          </el-button>
          <el-button type="primary" size="mini" @click="setGroup(row)">
            授权
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="编辑用户信息" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="昵称">
          <el-input v-model="editData.username" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="editData.mobile" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="editData.status" clearable style="width: 60%">
            <el-option label="启用" :value="1"></el-option>
            <el-option label="关闭" :value="0"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="editInfo()" :loading="addBtn">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="注册用户" :visible.sync="dialogRegVisible" width="800px">
      <el-form :model="regData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="名称">
          <el-input v-model="regData.username" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="regData.password" type="text" style="width: 60%" clearable show-password></el-input>
        </el-form-item>
        <el-form-item label="确认密码">
          <el-input v-model="regData.repassword" type="text" style="width: 60%" clearable show-password></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="regData.mobile" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogRegVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmRegister" :loading="editBtn">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="设置用户角色" :visible.sync="dialogGroVisible" width="600px">
      <el-form :model="regData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-select v-model="gid" clearable style="width: 300px">
          <el-option v-for="(item, index) in groupList"  :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogGroVisible= false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmGroup()">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { userList, registerUser, editUser, setUserGroup, groupList } from '@/api/user'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10
}

const defaultRegQuery = {
  username: '',
  password: '',
  repassword: '',
  phone: ''
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
      dialogRegVisible: false,
      dialogGroVisible: false,
      regData: JSON.parse(JSON.stringify(defaultRegQuery)),
      gid: '',
      uid: '',
      groupList: [],
      addBtn: false,
      editBtn: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      userList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          this.total = response.data.total
        }
        
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    // 注册用户
    register() {
      this.dialogRegVisible = true;
    },
    // 获取角色列表
    getGroupList() {
      groupList({}).then(response => {
        if (response.code == 1) {
          this.groupList = response.data
        }     
      })
    },
    // 广告账号
    toAccount (row) {
      console.log(row)
      let routeData = this.$router.resolve({
        path: "/accounts",
        query: {id: row.uid},
        params:{id: row.uid}
      });
      window.open(routeData.href, '_blank');
    },
    // 确定注册
    confirmRegister () {
      this.editBtn = true;
      let params = {
        username: this.regData.username,
        password: this.regData.password,
        repassword: this.regData.repassword,
        mobile: this.regData.mobile
      };
      registerUser(params).then(res => {
        this.editBtn = false;
        if (res.code == 1) {
          this.dialogRegVisible = false;
          this.$message.success('注册成功');
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 编辑账号
    editInfo () {
      this.addBtn = true;
      console.log(this.editData)
      let params = {
         uid: this.editData.id,
         username: this.editData.username,
         mobile: this.editData.mobile,
         status: this.editData.status
      }
      editUser(params).then(response => {
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
    // 设置角色
    confirmGroup (row) {
      let params = {
        uid: this.uid,
        gid: this.gid
      };
      setUserGroup(params).then(res => {
        if (res.code == 1) {
          this.dialogGroVisible = false;
          this.$message.success('设置成功');
          this.getList()
        }
      })
    },
    // 授权
    setGroup(row) {
      this.uid = row.uid;
      this.dialogGroVisible = true;
      this.getGroupList()
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
