<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="关键字">
				<el-input v-model="listQuery.keyword" type="text" placeholder="请输入（名称 电话 邮箱）" clearable></el-input>
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
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column label="企微主体" align="center">
        <template slot-scope="{row}">
          <span>{{ row.corp_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="头像" align="center"  width="100">
        <template slot-scope="{row}">
          <el-avatar shape="square" :size="30" :src="row.avatar"></el-avatar>
          </template>
      </el-table-column>
      <el-table-column label="微信名片" align="center">
        <template slot-scope="{row}">
          <el-avatar shape="square" :size="100" :src="row.qr_code"></el-avatar>
          </template>
      </el-table-column>
      <el-table-column label="员工userid" align="center">
        <template slot-scope="{row}">
          <span>{{ row.userid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企微姓名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
          </template>
      </el-table-column>
      <el-table-column label="企微别名" align="center">
        <template slot-scope="{row}">
          <span>{{ row.alias }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="绑定销售" align="center">
        <template slot-scope="{row}">
          <span>{{ row.crm_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="330" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="showMore(row)">
            展示次数
          </el-button>
          <!-- <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button> -->
          <el-button type="primary" size="mini" @click="deleteCode(row)" :loading="delBtn">
            删除
          </el-button>
          <el-button type="primary" size="mini" @click="showPage(row)" :loading="delBtn">
            关联页面
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog title="请选择员工" :visible.sync="dialogFormVisible" width="1100px">
      <el-form :model="addData" ref="ruleForm" label-width="80px" inline>
        <el-form-item label="关键字">
          <el-input v-model="addData.keyword" type="text" style="width: 200px" placeholder="请输入（名称 电话 邮箱）" clearable></el-input>
        </el-form-item>
        <el-form-item label="主体">
          <el-select v-model="addData.corp_id" clearable style="width: 150px">
            <el-option v-for="(item, index) in companyList"  :key="index" :label="item.name" :value="item.corp_id"></el-option>
          </el-select>
        </el-form-item>
        <el-button
         style="margin-left: 20px;"
			   type="primary"
			   icon="el-icon-search"
			   @click="searchAdd"
			>
			   搜索
			</el-button>
			<el-button type="danger" icon="el-icon-refresh" @click="reset"
				>重置</el-button>
      </el-form>
      <el-table 
        class="table"
        :key="tableKey"
        v-loading="addlistLoading"
        :data="addList"
        border
        fit
        max-height="700px"
        style="width: 100%;">
        <el-table-column label="头像" align="center" width="100">
          <template slot-scope="{row}">
            <el-avatar shape="square" :size="30" :src="row.avatar"></el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="userid" align="center">
          <template slot-scope="{row}">
            <span>{{ row.userid }}</span>
          </template>
        </el-table-column>
        <el-table-column label="微信名称" align="center">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" align="center">
          <template slot-scope="{row}">
            <span>{{ row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center">
          <template slot-scope="{row}">
            <span>{{ row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="addStaff(row)" :loading="addBtn">
            添加
          </el-button>
        </template>
      </el-table-column>
      </el-table>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="editInfo">
          确认
        </el-button>
      </div> -->
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
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
    <el-dialog title="关联页面" :visible.sync="dialogHtmlVisible" width="1600px">
      <el-form :model="diaQuery" ref="diaForm" label-width="120px" inline style="margin-top: 20px;">
          <el-form-item label="渠道名称">
            <el-input v-model="diaQuery.source_name" type="text" placeholder="请输入渠道名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="账号名称">
            <el-input v-model="diaQuery.account_name" type="text" placeholder="请输入账号名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="优化师">
            <el-input v-model="diaQuery.user_name" type="text" placeholder="请输入优化师" clearable></el-input>
          </el-form-item>
          <el-button
            style="margin-left: 20px;"
            type="primary"
            icon="el-icon-search"
            @click="listSearch()"
          >
            搜索
          </el-button>
          <el-button type="danger" icon="el-icon-refresh" @click="diaReset()">重置</el-button>
          <el-button type="primary"  @click="pause()">批量暂停</el-button>
          <el-button type="primary"  @click="someOpen()">批量开启</el-button>
          <el-button type="primary"  @click="unbind()">批量解绑</el-button>
      </el-form>
      <el-table
      :data="htmlList"
      class="table"
      max-height="500px"
      @selection-change="handleSelectionChange"
      border
      fit
      style="width: 100%">
      <el-table-column
          type="selection"
          width="55">
      </el-table-column>
      <el-table-column
        prop="id"
        label="页面id"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="source_name"
        label="渠道名称"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="account_name"
        label="账户名称"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="user_name"
        label="优化师"
        align="center"
        >
      </el-table-column>
      <el-table-column
        prop="link"
        label="页面链接"
        align="center"
        width="600"
        >
      </el-table-column>
      <el-table-column
        prop="name"
        label="页面标题"
        align="center"
        width="200"
        >
      </el-table-column>
      <el-table-column
        prop="is_pause"
        label="暂停状态"
        align="center"
        >
        <template slot-scope="{row}">
          <span>{{ row.is_pause == 1 ? '暂停' : '正常' }}</span>
        </template>
      </el-table-column>
    </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { wecodeStaffList, showCount, searchUser, addWecodeStaff, delWecodeStaff, staffHtmlList, staffAllPause, staffAllDelete } from '@/api/other'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10,
  keyword: '',
  name: ''
}

const defaultDiaQuery = {
  source_name: '',
  account_name: '',
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
      diaQuery: JSON.parse(JSON.stringify(defaultDiaQuery)),
      dialogFormVisible: false,
      editData: {},
      type: [],
      isEdit: false,
      addData: {
        corp_id: 'ww1415629f5fbf0627',
        keyword: ''
      },
      imageUrl: '',
      htmlList: [],
      dialogVisible: false,
      dialogHtmlVisible: false,
      dialogImageUrl: '',
      fileList: [],
      dialogCountVisible: false,
      countData: [],
      addList: [],
      codeId: '',
      addlistLoading: false,
      companyList: [
        {
          corp_id: 'ww84e21ddcde245da7',
          name: '中广云投顾'
        },
        {
          corp_id: 'ww5fbafe202a1f7d80',
          name: '中广云学堂'
        },
        {
          corp_id: 'ww1415629f5fbf0627',
          name: '中广云智投'
        },
        {
          corp_id: 'ww473eb3c9a67a6830',
          name: '中广云牛股营'
        }
      ],
      addBtn: false,
      delBtn: false,
      selectedNum: 0,
      selectedArr: []
    }
  },
  created() {
    this.getList();
  },
  methods: {
    // 展示次数
    showMore (row) {
      this.countData = []
      let params = {
        type: 4,
        id: row.id
      };
      showCount(params).then(res => {
        this.dialogCountVisible = true;
        this.countData.push(res.data)
      })   
    },
    // 展示关联页面
    showPage(row) {
      this.codeId = row.id;
      let params = {
         id: row.id
      };
      staffHtmlList(params).then(res => {
        if (res.code == 1) {
          this.htmlList = res.data
          if (res.data.length > 0) {
            this.dialogHtmlVisible = true
          } else {
            this.$message.error('暂无关联页面')
          }
        }
      })
    },
    listSearch() {
      let params = {
        id: this.codeId,
        source_name: this.diaQuery.source_name,
        account_name: this.diaQuery.account_name,
        user_name: this.diaQuery.user_name
      };
      console.log(this.diaQuery)
      staffHtmlList(params).then(res => {
        if (res.code == 1) {
          this.htmlList = res.data
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 批量暂停
    pause() {
      let html_ids = [];
      this.selectedArr.forEach(item => {
        html_ids.push(item.id)
      })
      let params = {
         id: this.codeId,
         html_ids: html_ids.toString(),
         pause: 1
      };
      staffAllPause(params).then(res => {
        if (res.code == 1) {
          this.$message.success('暂停成功')
          this.dialogHtmlVisible = false
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 批量开启
    someOpen() {
      let html_ids = [];
      this.selectedArr.forEach(item => {
        html_ids.push(item.id)
      })
      let params = {
         id: this.codeId,
         html_ids: html_ids.toString(),
         pause: 0
      };
      staffAllPause(params).then(res => {
        if (res.code == 1) {
          this.$message.success('开启成功')
          this.dialogHtmlVisible = false
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
     // 选择新增
     handleSelectionChange(selectedData) {
      this.selectedNum = selectedData.length
      this.selectedArr = selectedData
    },
    // 批量解绑
    unbind() {
      let html_ids = [];
      this.selectedArr.forEach(item => {
        html_ids.push(item.id)
      })
      let params = {
         id: this.codeId,
         html_ids: html_ids.toString()
      };
      staffAllDelete(params).then(res => {
        if (res.code == 1) {
          this.$message.success('解绑成功')
          this.dialogHtmlVisible = false
          this.getList()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 添加员工
    addStaff(row) {
      this.addBtn = true;
      let params = {
        alias: row.alias,
        avatar: row.avatar,
        corp_id: row.corp_id,
        email: row.email,
        mobile: row.mobile,
        name: row.name,
        userid: row.userid
      };
      addWecodeStaff(params).then(res => {
        this.addBtn = false;
         if (res.code == 1) {
            this.dialogFormVisible = false;
            this.getList()
         }
      })
    },
    // 图片上传成功
    handleAvatarSuccess(res, file) {
        this.editData.code_id = res.data.id;
        this.imageUrl = URL.createObjectURL(file.raw); 
    },
    handleRemove(file, fileList) {
        console.log(file, fileList);
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    // 查询添加员工
    searchAdd () {
      let params = {
        corp_id: this.addData.corp_id,
        keyword: this.addData.keyword
      };
      this.addlistLoading = true;
      searchUser(params).then(res => {
        this.addList = res.data;
        this.addlistLoading = false
      })
    },
    // 重置添加
    reset() {
      this.addData.corp_id = '';
      this.addData.keyword = '';
      this.addList = []
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
        `确定删除${row.name}的固定二维码`,
        "",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "danger",
          }
        )
        .then(() => {
          this.deleteStaff(row)
        })
        .catch(() => {
          
        });
    },
    // 删除活码员工
    deleteStaff (row) {
      this.delBtn = true;
      let params = {
        id: row.id
      };
      delWecodeStaff(params).then(response => {
        this.delBtn = false;
        if (response.code == '1') {
          this.$message.success('删除成功')
          this.getList()
        } else {
          this.$message.error(response.msg)
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
    diaReset() {
      this.diaQuery = JSON.parse(JSON.stringify(defaultDiaQuery))
      this.listSearch()
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      wecodeStaffList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          response.data.list.forEach((item, index) => {
             this.list[index].corp_name = this.formatterCompany(item.corp_id)
          })
          this.total = response.data.total
        }
        setTimeout(() => {
          this.listLoading = false
        }, 0.5 * 1000)
      })
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
    // 新增账号
    addaccount () {
      this.dialogFormVisible = true;
    },
    // 编辑账号
    editInfo () {
      let params = {
        wechat_id: this.editData.wechat_id,
        wechat_name: this.editData.wechat_name,
        extra: this.editData.extra,
        code_id: this.editData.code_id
      }
      if (this.isEdit) {
        params.id = this.editData.id
      }
      auditWechatCode(params).then(response => {
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
      this.fileList = [{
        name: '二维码',
        url: this.editData.url
      }]
    }
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
</style>


