<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="渠道名称">
				<el-input v-model="listQuery.source_name" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
      <el-form-item label="广告账号名称">
				<el-input v-model="listQuery.account_name" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
      <el-form-item label="备注">
				<el-input v-model="listQuery.remark" type="text" placeholder="请输入" clearable></el-input>
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
      <el-table-column label="类型" align="center">
        <template slot-scope="{row}">
          <span>{{ formatterType(row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="微信号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.wechat_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企微主体" align="center">
        <template slot-scope="{row}">
          <span>{{ formatterCompany(row.corp_id) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="使用人员" align="center" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.staff_list.toString() }}</span>
        </template>
      </el-table-column>
      <el-table-column label="推广渠道" align="center">
        <template slot-scope="{row}">
          <span>{{ row.source_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="广告账号" align="center">
        <template slot-scope="{row}">
          <span>{{ row.account_name }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="二维码地址" align="center">
        <template slot-scope="{row}">
          <el-avatar shape="square" :size="100" :src="row.qr_code"></el-avatar>
          </template>
      </el-table-column> -->
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="400" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="showMore(row)">
            展示次数
          </el-button>
          <el-button type="primary" size="mini" @click="showCode(row)">
            查看二维码
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="deleteCode(row)" :loading="delBtn">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="新增联系我二维码" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="类型">
          <!-- <el-select v-model="editData.type" clearable style="width: 60%" @change="changeType">
            <el-option label="单人" :value="1"></el-option>
            <el-option label="多人" :value="2"></el-option>
          </el-select> -->
          <el-radio-group v-model="editData.type" style="width: 60%" @change="changeType">
            <el-radio :label="1">单人</el-radio>
            <el-radio :label="2">多人</el-radio>
            <el-radio :label="3">个人微信</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="企微主体">
          <el-select v-model="editData.corp_id" clearable style="width: 60%">
            <el-option label="中广云投顾" value="ww84e21ddcde245da7"></el-option>
            <el-option label="中广云智投" value="ww1415629f5fbf0627"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用人员">
          <el-input v-model="editData.people" type="text" readonly  @focus="selectPeople" style="width: 60%" clearable placeholder="请选择"></el-input>
        </el-form-item>
        <el-form-item label="微信号(电话)" v-if="editData.type == 3">
          <el-input v-model="editData.wechat_id" type="text" @input="changeWechat" onkeyup="this.value=this.value.replace(/[^\w_]/g,'');"  clearable placeholder="请输入" style="width: 60%"></el-input>
        </el-form-item>
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
          <el-select v-model="editData.account" style="width: 60%" class="filter-item" filterable @change="changeAccount" clearable>
            <el-option v-for="item in accountList" :key="item.key" :label="item.account_name + '(' + item.account_id + ')'" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="备注">
          <el-input 
            v-model="editData.remark" show-word-limit
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }" 
            style="width: 60%" 
            clearable 
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="addCount" :loading="addBtn">
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog title="展示次数" :visible.sync="dialogCountVisible" width="600px">
      <el-table
      :data="countData"
      style="width: 100%">
      <el-table-column
        prop="today_count"
        label="今日展示"
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
    <el-dialog
      :visible.sync="dialogSelectVisible"
      width="900px"
      title="请选择员工"
      :close-on-click-modal="false"
      :before-close="beforeClose"
      :append-to-body="true"
    >
      <div class="people-wrapper">
        <el-row :gutter="20">
          <el-col :span="14" class="dialog-left">
            <el-input
              class="search-input"
              v-model.trim="search"
              placeholder="请搜索成员"
              clearable
              size="small"
              @keyup.enter.native="onSearch"
              @change="onSearch"
            >
              <template #prefix>
                <!-- <el-icon class="el-input__icon"><Search /></el-icon> -->
                <el-icon class="el-input__icon"></el-icon>
              </template>
            </el-input>
            <el-tree
              :data="tree"
              :expand-on-click-node="false"
              :load="loadNode"
              :props="treeProps"
              lazy
              @node-click="clickTreeNode"
            >
              <template #default="{ node, data }">
                <span class="custom-tree-node">
                  <i
                    :class="data.staff_id ? 'el-icon-user' : 'el-icon-folder'"
                  ></i>
                  <span v-if="!data.staff_id">{{ node.label }}</span>
                  <span v-if="data.staff_id && showPhone"
                    >{{ node.label }}-{{ data.phone }}(绑定crm：{{ data.crm_username != '' ? data.crm_username : '未绑定' }})</span
                  >
                  <span v-if="data.staff_id && !showPhone">{{
                    node.label
                  }}</span>
                </span>
              </template>
            </el-tree>
          </el-col>
          <el-col :span="10" class="dialog-right">
            <div class="choose-user">
              <div class="choose-title">
                <span>已选择成员</span>
              </div>
              <div class="choose-list">
                <div
                  class="choose-item"
                  v-for="(item, index) in userList"
                  :key="item.userid"
                >
                  <span>
                    <i class="el-icon-user"></i>
                    <i>{{ item.name }}</i>
                    <i v-if="showPhone">({{ item.phone }})</i>
                  </span>
                  <i
                    class="el-icon-close"
                    @click="handleClose(1, index, item.userid)"
                  ></i>
                </div>
                <div
                  class="choose-item"
                  v-for="(item, index) in deptList"
                  :key="item.dept_id"
                >
                  <span>
                    <i class="el-icon-folder"></i>
                    <i>{{ item.name }}</i>
                  </span>
                  <i
                    class="el-icon-close"
                    @click="handleClose(2, index, item.dept_id)"
                  ></i>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCancel">取 消</el-button>
          <el-button type="primary" @click="submit">确 认</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog title="编辑联系我二维码" :visible.sync="dialogEditVisible" width="600px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="微信号(电话)" v-if="editData.type == 3">
          <el-input v-model="editData.wechat_id" type="text" clearable placeholder="请输入" style="width: 60%"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="editData.type" style="width: 60%" disabled>
            <el-option label="单人" :value="1"></el-option>
            <el-option label="多人" :value="2"></el-option>
            <el-option label="个人微信" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用人员">
            <el-input v-model="editData.people" type="text" readonly  @focus="selectPeople" style="width: 60%" clearable placeholder="请选择"></el-input>
          </el-form-item>
        <el-form-item label="备注">
          <el-input 
            v-model="editData.remark" show-word-limit
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 6 }" 
            style="width: 60%" 
            clearable 
            placeholder="请输入"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEditVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="editCount" :loading="editBtn">
          确认
        </el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogImgVisible" width="300px">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
import { contactList, getSourceByCrm, getChannelAccount, addContact, editContact, contactInfo, deleteContact, delWechatCode, changeWechatCodeStatus, showCount } from '@/api/popularize'
import { getStaffDeptTree, searchStaffList } from '@/api/other'
import Pagination from '@/components/Pagination'
import { deepClone } from "@/utils";
import { thisExpression } from '@babel/types';
const defaultQuery = {
  page: 1,
  limit: 10,
  remark: '',
  source_name: '',
  account_name: ''
}

const addQuery = {
  source: '',
  source_name: '',
  account: '',
  account_name: '',
  corp_id: '',
  remark: '',
  wechat_id: '',
  type: '',
  staff_list: []
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
      editData: JSON.parse(JSON.stringify(addQuery)),
      type: [],
      isEdit: false,
      info: {
        wechat_id: '',
        wechat_name: '',
        extra: '',
        code_id: '',
        type: ''
      },
      imageUrl: '',
      dialogVisible: false,
      dialogImageUrl: '',
      fileList: [],
      dialogCountVisible: false,
      countData: [],
      codeForm: {
        type: "3",
        config: true,
        remark: "",
        staff_ids: [],
        dept_ids: [],
      },
      dialogSelectVisible: false,
      onlyPeople: true,
      text: '',
      search: '',
      dialogVisible: true,
      tree: [],
      deptList: [],
      userList: [],
      deptListCopy: [],
      userListCopy: [],
      isSearch: false,
      treeProps: {
        label: "name",
        children: "zones",
        isLeaf: "leaf",
      },
      dept_id: '',
      showPhone: true,
      sourceList: [],
      source_props: { multiple: false, expandTrigger: 'click', value: 'id', label: 'title' },
      accountList: [],
      showWechat: false,
      dialogEditVisible: false,
      dialogImgVisible:false,
      dialogImageUrl: '',
      addBtn: false,
      editBtn: false,
      delBtn: false,
    }
  },
  created() {
    this.getList();
  },
  methods: {
    //选择人员
    selectPeople() {
      this.userList = deepClone(this.editData.staff_list);
      if (this.editData.corp_id !== '' && this.editData.type !== '') {
        this.getTree()
        this.dialogSelectVisible = true
      } else if (this.editData.type == '') {
        this.$message.warning('请先选择类型')
      } else {
        this.$message.warning('请先选择企微主体')
      }
      
    },
    // 查看二维码
    showCode(row) {
      this.dialogImgVisible = true;
      this.dialogImageUrl = row.qr_code
    },
    // 格式化企微主体
    formatterCompany (id) {
      switch (id) {
        case 'ww84e21ddcde245da7':
          return '中广云投顾';
        case 'ww5fbafe202a1f7d80':
          return '中广云学堂';
        case 'ww1415629f5fbf0627':
          return '中广云智投';
        case 'ww473eb3c9a67a6830':
          return '中广云牛股营'
      }
    },
    // 类型格式化
    formatterType (type) {
      if (type == 1) {
        return '单人'
      } else if (type == 2) {
        return '多人'
      } else {
        return '个人微信'
      }
    },
    // 改变级联选择器值
    handleChange() {
      this.$nextTick(() => {
        this.editData.source_name = this.$refs.cascaderSource.presentText;
        this.getAccountList()
      })     
    },
    // 类型改变
    changeType(val) {
      if (val == 1) {
        this.showWechat = true
      } else {
        this.showWechat = false
      }
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
    // 校验字符
    changeWechat(val) {
      var flag = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ ]")
      // 判断 even 是否包含特殊字符
      if(flag.test(val)){
        this.$message.error('不能包含特殊字符')
        this.editData.wechat_id = ''
      }else if (val.length > 12){
        this.$message.error('长度不能超过12位，请重新输入')
      }
    },
    // 展示次数
    showMore (row) {
      this.countData = []
      let params = {
        type: 1,
        id: row.id
      };
      showCount(params).then(res => {
        this.dialogCountVisible = true;
        this.countData.push(res.data)
      })   
    },
    changeAccount (e) {
      this.accountList.forEach((item, index) => {
        console.log(e, item.id)
         if (e == item.id) {
          this.editData.account_name = item.account_name
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
    // 修改状态
    changeStatus (row) {
      let params = {
        id: row.id,
        status: row.status
      };
      changeWechatCodeStatus(params).then(response => {
        if (response.code == 1) {
          this.$message.success('修改成功')
          this.getList()
        }
      })
    },
    // 删除二维码
    deleteCode (row) {
      this.$confirm(
        `确定删除${row.staff_list.toString()}的固定二维码吗？`,
        "",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "danger",
          }
        )
        .then(() => {
          this.deleteQrcode(row)
        })
        .catch(() => {
          
        });
    },
    // 删除二维码
    deleteQrcode (row) {
      this.delBtn = true;
      let params = {
        id: row.id
      };
      deleteContact(params).then(response => {
        this.delBtn = false;
        if (response.code == '1') {
          this.$message.success('删除成功')
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
      contactList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          this.total = response.data.total
        } else {
          this.$message.error(response.msg)
        }
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
    },
    // 新增账号
    addaccount () {
      this.dialogFormVisible = true
      this.editData = JSON.parse(JSON.stringify(addQuery))
      this.getSource()
      this.isEdit = false
    },
    // 新增账号
    addCount () {
      this.addBtn = true;
      let params = {
        source: this.editData.source[1],
        source_name: this.editData.source_name,
        account: this.editData.account,
        account_name: this.editData.account_name,
        corp_id: this.editData.corp_id,
        remark: this.editData.remark,
        type: this.editData.type,
        staff_list: this.editData.staff_list
      }
      if (this.editData.type == 3) {
        params.wechat_id = this.editData.wechat_id
      }
      addContact(params).then(res => {
          this.addBtn = false;
         if (res.code == 1) {
           this.dialogFormVisible = false;
           this.getList();
           this.$message.success('新增成功')
         } else {
           this.$message.error(res.msg)
         }
      })
    },
    // 编辑账号
    handleUpdate(row) {
      this.isEdit = true;
      this.dialogEditVisible = true;
      let params = {
        id: row.id
      }
      contactInfo(params).then(res => {
        if (res.code == 1) {
          this.editData = res.data.staffInfo;
          this.editData.staff_list = res.data.staffList;
          this.editData.people = res.data.staffList.map(item => item.name).toString()
        } else {
          this.$message.error(res.msg)
        }
      })
      // this.editData = JSON.parse(JSON.stringify(row));
    },
    editCount () {
      this.editBtn = true;
      let parmas= {
        id: this.editData.id,
        remark: this.editData.remark,
        staff_list: this.editData.staff_list
      };
      if (this.editData.type == 3) {
        parmas.wechat_id = this.editData.wechat_id
      }
      editContact(parmas).then(res => {
        this.editBtn = false;
        if (res.code == 1) {
           this.dialogEditVisible = false;
           this.getList();
           this.$message.success('编辑成功')
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    openDialog () {
      if (this.disabled) {
        return false;
      }
      this.search = "";
      this.onSearch();
      this.dialogVisible = true;
    },
    onClear () {
      this.text = "";
      this.search = "";
      this.deptListCopy = [];
      this.userListCopy = [];
      this.deptList = [];
      this.userList = [];
    },
    async onSearch() {
      if (this.search) {
        this.isSearch = true;
        const params = { client_name: this.search, corp_id: this.editData.corp_id };
        const res = await searchStaffList(params);
        if (res.code == 1) {
          this.tree = res.data || [];
        } else {
          console.log(123)
          this.$message.error(res.msg)
        }
      } else {
        this.isSearch = false;
        this.tree = [];
        this.getTree();
      }
    },
    //获取成员tree
    async getTree ()  {
      let params = {
        corp_id: this.editData.corp_id,
        dept_id: this.dept_id
      }
      getStaffDeptTree(params).then(res => {
        if (res.code == 1) {
          this.tree = res.data
        }
      })
    },
    //懒加载树节点
    async loadNode (node, resolve) {
      if (this.isSearch) {
        resolve([]);
        return false;
      }
      if (node.level === 0) {
        resolve(this.tree);
        setTimeout(()=>{
          node.childNodes.forEach((item) => {
            if (item.data.staff_id) {
              item.isLeaf = true;
            }
          });
        },200)
      } else {
        if (!node.data.staff_id) {
          //点击的是部门，请求接口
          // const dept_id = node.data.id;
          let params = {
            corp_id: this.editData.corp_id,
            dept_id: node.data.id
          }
          const res = await getStaffDeptTree(params);
          resolve(res.data);
          node.childNodes.forEach((item) => {
            if (item.data.staff_id) {
              item.isLeaf = true;
            }
          });
        } else {
          resolve([]);
        }
      }
    },
    isMultiple() {
      if (this.editData.type == 1 || this.editData.type == 3) {
        this.userList = [];
      }
    },
    //点击树节点
    clickTreeNode (node)  {
      //点击的是员工
      if (node.staff_id) {
        if (node.crm_username == '') {
          this.$message.error('该员工未绑定crm，请重新选择')
        } else {
          const target = this.userList.find(
            (item) => item.staff_id == node.staff_id
          );
          if (!target) {
            this.isMultiple();
            this.userList.push(node);
          } else {
            //删除该员工
            let index = this.userList.indexOf(target);
            this.userList.splice(index, 1);
          }
        }
      }
    },
    //点击已选择节点的删除按钮
    handleClose (type, index) {
      if (type == 1) {
        //删除员工
        this.userList.splice(index, 1);
      } else {
        //删除公司/部门
        this.deptList.splice(index, 1);
      }
    },
    //dialog关闭前回调
    beforeClose(done)  {
      this.deptList = deepClone(this.deptListCopy);
      this.userList = deepClone(this.userListCopy);
      done();
    },
    //点击取消
    handleCancel() {
      this.deptList = deepClone(this.deptListCopy);
      this.userList = deepClone(this.userListCopy);
      this.dialogSelectVisible = false;
    },
    // 确认选择人员
    submit () {
      this.editData.people = (this.userList.map(item => item.name)).toString()
      this.editData.staff_list = this.userList;
      this.dialogSelectVisible = false;
      this.userList = []
    },
  }
}
</script>
<style scoped>
  .table {
    margin-top: 20px;
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
    border: 1px dashed #c0ccda;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .dialog-right {
    padding-left: 20px;
  }
  
.el-input__suffix{
  display:none !important;
}

.dept-staff :hover .el-input__suffix {
  display:block !important;
}
.people-wrapper {
  height: 50vh;
  
  
}
.el-row {
  height: 100%;
}

.el-col {
  height: 100%;
  
}
.el-tree {
    height:calc(100% - 32px);
    overflow: auto;
  }
.choose-user {
  height: 100%;
}
.choose-title{
    line-height: 32px;
  }
.choose-list {
  padding-right: 20px;
  height: calc(100% - 32px);
  overflow: auto;   
}
.choose-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    
}
.choose-item span{
  line-height: 32px;
}
.el-icon-close {
  cursor: pointer;
}
.el-input > .el-input__suffix{
    transform: translateY(2px);
    cursor: pointer;
}
.dialog-left > .el-input{
        width: 90%;
    }

.dialog-left > .el-input__inner{
    border:none;
    background-color: #F7F7F7;
    border-radius: 16px;
}
</style>


