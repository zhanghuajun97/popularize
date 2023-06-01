<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="100px" inline style="margin-top: 20px;">
      <el-form-item label="平台">
        <el-cascader
            v-model="listQuery.source_name"
            :options="sourceList"
            filterable
            placeholder="请选择平台"
            :props="name_props"
            collapse-tags
            clearable
          ></el-cascader>
			</el-form-item>
      <el-form-item label="标题">
				<el-input v-model="listQuery.name" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
      <el-form-item label="链接">
				<el-input v-model="listQuery.link" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
      <el-form-item label="优化师">
				<el-select v-model="listQuery.user_name" class="filter-item" filterable="" clearable>
            <el-option v-for="item in users" :key="item.key" :label="item.name" :value="item.name" />
        </el-select>
			</el-form-item>
      <el-form-item label="广告账户">
				<el-input v-model="listQuery.account_name" type="text" placeholder="请输入" clearable></el-input>
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
      <el-button
         style="margin-left: 20px;"
			   type="info"
			   @click="addWecode()"
			>
			   多页面企微活码
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column label="ID" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" align="center" width="100" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推广渠道" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.source_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告账号" align="center" width="300" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.account_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="优化师" align="center"  show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.user_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="二维码类型" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ formatterCode(row.wecode_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回传类型" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.upload_type == 1 ? '前端js回传' : 'API回传' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="API回传方式" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ formatterType(row.api_type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="链接地址" align="center" width="600" show-overflow-tooltip>
        <template slot-scope="{row}">
          <el-link :href="row.link" target="_blank" type="primary">{{row.link}}</el-link>
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否推广" align="center">
        <template slot-scope="{row}">
          <el-switch
            v-model="row.is_use"
            :active-value="1"
            :inactive-value="2"
            @change="changeStatus(row)"
          ></el-switch>
        </template>
      </el-table-column> -->
      <el-table-column label="描述" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="showWechat(row)" v-show="row.wecode_type == 1">
            联系我固定码
          </el-button>
          <el-button type="primary" size="mini" @click="showWework(row)" v-show="row.wecode_type == 2">
            企微带参活码
          </el-button>
          <el-button type="primary" size="mini" @click="showMore(row)">
            展示次数
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="deleteType(row)" :loading="delBtn">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="isEdit ? '编辑推广页面' : '新增推广页面'" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="推广渠道">
          <el-cascader
              v-model="editData.source"
              :options="sourceList"
              filterable
              ref="cascaderSource"
              placeholder="请选择推广渠道"
              :style="{ width: '60%' }"
              :props="source_props"
              @change="handleChange"
              collapse-tags
              clearable
            ></el-cascader>
        </el-form-item>
        <el-form-item label="广告账号">
          <el-select v-model="editData.account" style="width: 60%" class="filter-item" filterable="" @change="changeAccount">
            <el-option v-for="item in accountList" :key="item.key" :label="item.account_name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="优化师">
          <el-select v-model="editData.user" style="width: 60%" class="filter-item" filterable="" @change="changeUser">
            <el-option v-for="item in users" :key="item.key" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="editData.name" type="text" style="width: 60%" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="链接">
          <el-input v-model="editData.link" type="text" style="width: 60%" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="二维码类型">
          <el-select v-model="editData.wecode_type" style="width: 60%" class="filter-item" filterable="">
            <el-option label="联系我固定码" :value="1"></el-option>
            <el-option label="企微带参活码" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="回传类型">
          <el-select v-model="editData.upload_type" style="width: 60%" class="filter-item" filterable="" placeholder="请选择">
            <el-option label="前端JS回传" :value="1"></el-option>
            <el-option label="API回传" :value="2"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="API回传类型">
          <el-select v-model="editData.api_type" style="width: 60%" class="filter-item" filterable="" placeholder="请选择">
            <el-option v-for="item in type" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="editData.description" type="text" style="width: 60%" placeholder="请输入" clearable></el-input>
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
    <el-dialog title="展示次数" :visible.sync="dialogCountVisible" width="700px">
      <el-table
      :data="countData"
      style="width: 100%">
      <el-table-column
        prop="today_count"
        label="今日展示"
        width="180">
      </el-table-column>
      <el-table-column
        prop="today_add"
        label="今日添加"
        width="180">
      </el-table-column>
      <el-table-column
        prop="yes_count"
        label="昨日展示"
        width="180">
      </el-table-column>
      <el-table-column
        prop="third_count"
        label="前天展示">
      </el-table-column>
    </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { type, typeDel, typeUse, showCount, getSourceByCrm, getChannelAccount, auditType, typeInfo, getSpreadUser } from '@/api/popularize'
import { returnType } from '@/api/tools'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10,
  link: '',
  name: '', //链接标题
  source_name: '', //平台
  account_name: '',
  user_name: ''
}

const linkQuery = {
  source_name: '',
  source: '',
  account: '',
  name: '',
  link: '',
  wecode_type: '',
  upload_type: '',
  api_type: '',
  description: '',
  account_name: '',
  user: '',
  user_name: ''
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
      dialogCountVisible: false,
      countData: [],
      info: {
        key: '',
        info: '',
        content: ''
      },
      editData: JSON.parse(JSON.stringify(linkQuery)),
      selectedNum: 0,
      selectedArr: [],
      sourceList: [],
      source_props: { multiple: false, expandTrigger: 'click', value: 'id', label: 'title' },
      name_props: { multiple: false, expandTrigger: 'click', value: 'title', label: 'title' },
      accountList: [],
      addBtn: false,
      delBtn: false,
      userList: [],
      users: []
    }
  },
  created() {
    this.getReturn ();
    this.getSource();
    this.getUserList();
  },
  methods: {
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
    // 选择优化师
    changeUser (val) {
      this.users.forEach(item => {
        if (item.id == val) {
          this.editData.user = val;
          this.editData.user_name = item.name;
        }
      })
      // if (!this.editData.account) {
      //   this.editData.user = '';
      //   this.$message.error('请先选择广告账户')
      // } else {
      //   // const res = await getSpreadUser({account: this.editData.account})
      //   // if (res.code == 1) {
          
      //   // }
      //   this.userList.forEach(item => {
      //     if (item.id == val) {
      //       this.editData.user = val;
      //       this.editData.user_name = item.name;
      //     }
      //   })
      // }
      
    },
    // 获取优化师列表
    getUserList (id) {
      var params = {}
      if (id) {
        params = {
          account: id
        }
      }
      getSpreadUser(params).then(res => {
        if (res.code == 1) {
          if (id) {
            this.userList = res.data
          } else {
            this.users = res.data
          }
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 格式化二维码类型
    formatterCode (val) {
      switch (val) {
        case 1:
          return '联系我固定码'
        case 2:
          return '企微带参活码'
        case 3:
          return '个人微信'
        default:
          return '个人微信'
      }
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
    showMore (row) {
      this.countData = []
      let params = {
        type: 3,
        id: row.id
      };
      showCount(params).then(res => {
        this.dialogCountVisible = true;
        this.countData.push(res.data)
      })   
    },
    changeAccount (e) {
      this.getUserList(e)
      this.accountList.forEach((item, index) => {
         if (e == item.id) {
          this.editData.account_name = item.account_name + '(' + item.account_id + ')'
          console.log(this.editData.account_name)
         }
      })
    },
    // 改变级联选择器值
    handleChange() {
      this.$nextTick(() => {
        this.editData.source_name = this.$refs.cascaderSource.presentText;
        this.getAccountList()
      })
    },
    // 获取账号列表
    getAccountList (id) {
      if (id) {
        var params = {
          source: id
        }
      } else {
        var params = {
          source: this.editData.source[1]
        };
      }  
      getChannelAccount(params).then(res => {
        if (res.code == 1) {
          this.accountList = res.data;
        }
      })
    },
    // 获取渠道列表
    getSource() {
      getSourceByCrm({}).then(res => {
        if (res.code == 1) {
          this.sourceList = res.data
        }
      })
    },
    // 查看固定码
    showWechat (row) {
      // this.$router.push({
      //   path: '/normal',
      //   query: {
      //     id: row.id
      //   }
      // })
      let routeData = this.$router.resolve({
        path: "/normal",
        query: {id: row.id},
        params:{id: row.id}
      });
      window.open(routeData.href, '_blank');
    },
    // 查看企微活码
    showWework (row) {
      // this.$router.push({
      //   path: '/relation',
      //   query: {
      //     id: row.id
      //   }
      // })
      let routeData = this.$router.resolve({
        path: "/relation",
        query: {id: row.id},
        params:{id: row.id}
      });
      window.open(routeData.href, '_blank');
    },
    // 删除链接
    deleteType (row) {
      this.$confirm("确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          this.delBtn = true;
          let params = {
            id: row.id
          };
          typeDel(params).then(response => {
            this.delBtn = false;
            if (response.code == '1') {
              this.$message.success('删除成功')
              this.getList()
            } else {
              this.$message.error(response.msg)
            }
          })
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
     // 选择新增
     handleSelectionChange(selectedData) {
      this.selectedNum = selectedData.length
      this.selectedArr = selectedData
    },
    // 多页面企微活码
    addWecode() {
      if (this.selectedArr.length < 1) {
        this.$message.warning('请先勾选要操作的页面链接')
      } else {
        let ids = []
        this.selectedArr.forEach(item => {
          ids.push(item.id)
        })
        let routeData = this.$router.resolve({
          path: "/addwecode",
          query: {ids: ids.toString()},
          params:{ids: ids.toString()}
        });
        window.open(routeData.href, '_blank');
      }

    },
    // 修改状态
    changeStatus (row) {
      let params = {
        id: row.id,
        data: row.is_use
      };
      typeUse(params).then(res => {
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
      if (this.listQuery.source_name.length == 2) {
        this.listQuery.source_name = this.listQuery.source_name[1]
      } else {
        this.listQuery.source_name = this.listQuery.source_name.toString()
      }
      type(this.listQuery).then(response => {
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
        source_name: this.editData.source_name,
        account: this.editData.account,
        name: this.editData.name,
        link: this.editData.link,
        wecode_type: this.editData.wecode_type,
        upload_type: this.editData.upload_type,
        api_type: this.editData.api_type,
        description: this.editData.description,
        source: Array.isArray(this.editData.source) ? this.editData.source[1] : this.editData.source,
        account_name: this.editData.account_name,
        user: this.editData.user,
        user_name: this.editData.user_name
      }
      if (this.isEdit) {
        params.id = this.editData.id;
        if (!Array.isArray(this.editData.source)) {
          params.source = this.editData.source
        }
      }
      auditType(params).then(response => {
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
      let params = {
        id: row.id
      };
      typeInfo(params).then(res => {
        if (res.code == 1) {
          this.editData = res.data
          this.getAccountList(this.editData.source)
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
</style>


