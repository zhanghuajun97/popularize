<template>
  <div class="app-container">
    <el-form ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
			<el-button type="primary" @click="addGroup" icon="el-icon-plus"
				>新增</el-button
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
      <el-table-column label="角色名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="setRole(row)">
            设置角色权限
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="isEdit ? '编辑角色' : '新增角色' " :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="名称">
          <el-input v-model="editData.role_name" type="text" style="width: 60%" clearable></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editData.remark" type="text" style="width: 60%" clearable></el-input>
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

    <el-dialog title="设置角色权限" :visible.sync="diaRoleVisible" width="500px">
      <div  style="height:500px;overflow:auto">
        <el-tree  style="height:500px;overflow:auto"
          v-loading="menuListLoading"
          ref="roleTree"
          node-key="id"
          show-checkbox
          :props="defaultProps"
          :data="dataSource"
          :default-expanded-keys="expandedDataKey"
          :default-checked-keys="defaultCheckedKeys"
          class="data-tree"
        >
          <span
              slot-scope="{ node, data }"
              :class="[{ 'el-icon-menu': data.ismenu==1 },{ 'el-icon-sort': data.ismenu==2 },'el-icon']"
            >
              <span v-if="data.ismenu == 1" style="padding-left:2px;">{{ node.label }}</span>
              <span v-else style="padding-left:2px;">{{ node.label }} ( {{data.url}} )</span>
            </span>
          </el-tree>
        </div>
        <div class="footer">
          <el-button type="danger" @click="diaRoleVisible=false">取消</el-button>
          <el-button type="primary" @click="confirmRole">确定</el-button>
        </div>
        
    </el-dialog>

  </div>
</template>

<script>
import { roleList, addRole, editRole, menuList, setGroupMenu } from '@/api/user'

export default {
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      dialogFormVisible: false,
      editData: {},
      isEdit: false,
      info: {
        name: '',
        remark: ''
      },
      diaRoleVisible: false,
      gid: '',
      dataSource: [],
      menuListLoading: false,
      defaultProps: {
        children: "children",
        label: "label"
      },
      expandedDataKey:[],
      defaultCheckedKeys: [],
      addBtn: false,
    }
  },
  created() {
    this.getList()
  },
  methods: {
    // 获取列表数据
    getList() {
      this.listLoading = true
      roleList({}).then(response => {
        if (response.code == 1) {
          this.list = response.data
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
         role_name: this.editData.role_name,
         remark: this.editData.remark
      }
      if (this.isEdit) {
        params.id = this.editData.id
        editRole(params).then(response => {
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
        addRole(params).then(response => {
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
    handleUpdate(row) {
      this.isEdit = true;
      this.dialogFormVisible = true;
      this.editData = JSON.parse(JSON.stringify(row));
    },
    addGroup () {
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.editData = JSON.parse(JSON.stringify(this.info))
    },
    // 设置角色权限
    setRole(row) {
      this.diaRoleVisible = true;
      this.gid = row.id;
      this.getMenulist()
    },
    getMenulist () {
      let that = this;
      let params = {
        gid: this.gid
      }
      this.expandedDataKey = []
      this.defaultCheckedKeys = []
      this.menuListLoading = true;
      menuList(params).then(res => {
        if (res.code == 1) {
          that.dataSource = res.data
        };
        res.data.forEach(item => {
           if (item.has_auth == 1) {
              this.expandedDataKey.push(item.id)
              this.getchecked(item)
           }
        })
        that.menuListLoading = false;
      })
    },
    // 递归出选中id
    getchecked(item) {
      if (item.children) {
        item.children.forEach(data => {
          if (data.has_auth) {
            this.defaultCheckedKeys.push(data.id)
            this.getchecked(data)
          }
        })
      }
    },
    // 授权角色
    confirmRole () {
      let checkedKeys = this.$refs.roleTree.getCheckedKeys()
      let defaultKeys = []
      this.dataSource.forEach(item => {
        defaultKeys.push(item.id)
      })
      let params = {
        gid: this.gid,
        menu_list: [...new Set(checkedKeys.concat(defaultKeys))].toString()
      };
      setGroupMenu(params).then(res => {
         if (res.code == 1) {
            this.$message.success('设置成功')
            this.diaRoleVisible = false;
            this.getList()
         }
      })
    }
  }
}
</script>
<style scoped>
  .table {
    margin-top: 20px;
  }
  .footer {
    margin-top: 20px;
  }
</style>
