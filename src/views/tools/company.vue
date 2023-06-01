<template>
  <div class="app-container">
    <el-form :model="listQuery" ref="ruleForm" label-width="120px" inline style="margin-top: 20px;">
      <el-form-item label="客服名称">
				<el-input v-model="listQuery.name" type="text" placeholder="请输入" clearable></el-input>
			</el-form-item>
			<el-form-item label="平台">
          <el-select v-model="listQuery.source" clearable>
            <el-option v-for="(item, index) in groupList"  :key="index" :label="item.title" :value="item.id"></el-option>
          </el-select>
			</el-form-item>
      <el-form-item label="企微主体">
          <el-select v-model="listQuery.corp_id" clearable>
            <el-option v-for="(item, index) in companyList"  :key="index" :label="item.name" :value="item.corp_id"></el-option>
          </el-select>
			</el-form-item>
      <el-form-item label="跳转形式">
          <el-select v-model="listQuery.type" clearable>
            <el-option label="触发式回复" value="1"></el-option>
            <el-option label="蓝链" value="2"></el-option>
            <el-option label="固定码" value="3"></el-option>
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
      <el-table-column label="序号id" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="平台" align="center">
        <template slot-scope="{row}">
          <span>{{ row.source_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="企微主体" align="center">
        <template slot-scope="{row}">
          <span>{{ row.corp_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客服名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="支付" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_pay == 0 ? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="跳转形式" align="center">
        <template slot-scope="{row}">
          <span>{{ formatterRouter(row.type) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="去重" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_repeat == 0 ? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="回复" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_reply == 0 ? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="追粉" align="center">
        <template slot-scope="{row}">
          <span>{{ row.is_fans == 0 ? '否' : '是' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center">
        <template slot-scope="{row}">
          <span>{{ row.remark }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="setFans(row)"  v-if='row.is_reply == 1'>
            配置追粉回复
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="isEdit ? '编辑企微客服账号' : '新增企微客服账号'" :visible.sync="dialogFormVisible" width="800px">
      <el-form :model="editData" ref="ruleForm" label-width="120px" style="margin-top: 20px;">
        <el-form-item label="账号名称">
          <el-input v-model="editData.name" type="text" style="width: 60%" placeholder="请输入" clearable></el-input>
        </el-form-item>
        <el-form-item label="企微主体">
          <!-- <el-input v-model="editData.corp_id" type="text" style="width: 60%" placeholder="请输入" clearable></el-input> -->
          <el-select v-model="editData.corp_id"  clearable filterable style="width: 60%" placeholder="请选择">
            <el-option v-for="(item, index) in companyList" :key="index" :label="item.name" :value="item.corp_id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="接待客服id">
          <el-input v-model="editData.open_kfid" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
          <el-button type="primary" style="margin-left: 20px;" @click="getId">获取接待客服id</el-button>
        </el-form-item>
        <el-form-item label="客服账号">
          <el-input v-model="editData.account_id" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="平台">
          <el-select v-model="editData.source" clearable  style="width: 60%" @change="changeSource">
            <el-option v-for="(item, index) in groupList" :key="index" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跳转形式">
          <el-select v-model="editData.type" clearable style="width: 60%">
            <el-option label="触发式回复" :value="1"></el-option>
            <el-option label="蓝链" :value="2"></el-option>
            <el-option label="固定码" :value="3"></el-option>
          </el-select>
			  </el-form-item>
        <el-form-item label="是否支付">
          <el-select v-model="editData.is_pay" clearable style="width: 60%">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
			  </el-form-item>
        <el-form-item label="是否去重">
          <el-select v-model="editData.is_repeat" clearable style="width: 60%">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
			  </el-form-item>
        <el-form-item label="是否追粉">
          <el-select v-model="editData.is_fans" clearable style="width: 60%">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
			  </el-form-item>
        <el-form-item label="是否回复">
          <el-select v-model="editData.is_reply" clearable style="width: 60%">
            <el-option label="否" :value="0"></el-option>
            <el-option label="是" :value="1"></el-option>
          </el-select>
			  </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="editData.url" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="普通文本">
          <el-input v-model="editData.text_content" type="textarea" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="跳转文本">
          <el-input v-model="editData.href_content" type="textarea" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="editData.remark" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="回传方式">
          <el-select v-model="editData.return_type"  clearable filterable style="width: 60%" placeholder="请选择">
            <el-option v-for="(item, index) in type" :key="index" :label="item.title" :value="item.id"></el-option>
          </el-select>
        </el-form-item> -->
        
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

    <el-dialog title="微信客服追粉" :visible.sync="dialogFansVisible" width="1300px">
      <el-form inline style="display:flex;justify-content: space-between;height: 35px;">
        <el-button
          style="margin-left: 20px;"
          type="primary"
          @click="addFans()"
          icon="el-icon-plus"
        >
          新增
        </el-button>
        <el-form-item>
          <span class="tips">追粉消息推送消息段为7：00 - 22：00</span>
        </el-form-item>
      </el-form>
      <el-table
      class="table"
        v-loading="fansLoading"
        :data="fansList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="回复" align="center">
          <template slot-scope="{row}">
            <span>第{{ row.skip }}次回复</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type == 1 ? '文本蓝链' : '固定码' }}</span>
        </template>
      </el-table-column>
        <el-table-column label="普通文本" align="center">
          <template slot-scope="{row}">
            <span>{{ row.text_content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="跳转文字" align="center">
          <template slot-scope="{row}">
            <span>{{ row.href_content }}</span>
          </template>
        </el-table-column>
        <el-table-column label="跳转链接" align="center">
          <template slot-scope="{row}">
            <span>{{ row.url }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row}">
            <el-button type="primary" size="mini" @click="editFans(row)">
              编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

    <el-dialog :title="isEditFans ? '编辑企微客服追粉' : '新增企微客服追粉' " :visible.sync="dialogAddVisible" width="800px">
      <el-form :model="addData" label-width="120px" style="margin-top: 20px;">
        <!-- <el-form-item label="企微客服">
          <el-select v-model="addData.open_kfid"  clearable filterable style="width: 60%" placeholder="请选择" @change="changeKf" disabled>
            <el-option v-for="(item, index) in kflist" :key="index" :label="item.name" :value="item.open_kfid"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企微主体id">
          <el-input v-model="addData.corp_id" type="text" style="width: 60%"  disabled></el-input>
        </el-form-item>        -->
        <el-form-item label="回复次数">
          <el-input v-model="skip" type="text" style="width: 70%" clearable placeholder="请输入" :disabled="isEditFans"></el-input>
        </el-form-item>
        <el-form-item label="类型">
          <el-select v-model="addData.type" clearable style="width: 70%">
            <el-option label="文本蓝链" :value="1"></el-option>
            <el-option label="固定码" :value="2"></el-option>
          </el-select>
			  </el-form-item>
        <el-form-item label="跳转链接">
          <el-input v-model="addData.url" type="text" style="width: 70%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="普通文本">
          <el-input v-model="addData.text_content" type="textarea" style="width: 70%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="跳转文本">
          <el-input v-model="addData.href_content" type="textarea" style="width: 70%" clearable placeholder="请输入"></el-input>
        </el-form-item>
        <!-- <el-form-item label="绑定名称">
          <el-input v-model="app_name" type="text" style="width: 60%" clearable placeholder="请输入"></el-input>
        </el-form-item>         -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="confirmAdd" :loading="addBtn">
          确认
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { weworkList, weworkInfo, auditWework, returnType, weworkMsgList, msgKfList, auditWeworkMsg } from '@/api/tools'
import { plateList } from '@/api/other'
import Pagination from '@/components/Pagination'
const defaultQuery = {
  page: 1,
  limit: 10,
  name: '',
  source: '',
  corp_id: '',
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
      groupList: [],
      dialogFansVisible: false,
      fansList: [],
      fansLoading: true,
      dialogAddVisible: false,
      addData: {},
      kflist: [],
      app_name: '',
      skip: '',
      isEditFans: false,
    }
  },
  created() {
    // this.getList();
    this.getReturn();
    this.getPlateList();
  },
  methods: {
    // 获取平台列表
    getPlateList () {
      plateList().then(res => {
        if (res.code == 1) {
          this.groupList = res.data;
        }
      })
    },
    getKfList () {
      msgKfList().then(response => {
         if (response.code == 1) {
            this.kflist = response.data
         }
      })
    },
    // 跳转形式
    formatterRouter (type) {
      switch (type) {
        case 1:
          return '触发式回复'
        case 2:
          return '蓝链';
        case 3: 
          return '固定码'
        default:
          return '-'
      }
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
    // 配置追粉
    setFans(row) {
      console.log(row)
      this.addData = row;
      this.dialogFansVisible = true;
      this.getFansList()
    },
    getFansList () {
      let params = {
        open_kfid: this.addData.open_kfid,
        corp_id: this.addData.corp_id
      }
      weworkMsgList(params).then(res => {
        this.fansLoading = false;
        if (res.code == 1) {
          this.fansList = res.data.list
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    // 新增追粉
    addFans () {
      this.addData.url = "";
      this.addData.text_content = "";
      this.addData.href_content = "";
      this.skip = "";
      this.isEditFans = false;
      this.dialogAddVisible = true;
      this.getKfList();
    },
    // 选择客服
    changeKf (val) {
      this.kflist.forEach(item => {
        if (item.open_kfid == val) {
          this.addData.corp_id = item.corp_id
        }
      })
    },
    // 新增追粉
    confirmAdd () {
      let params = {
         corp_id: this.addData.corp_id,
         open_kfid: this.addData.open_kfid,
         skip: this.skip,
         url: this.addData.url,
         text_content: this.addData.text_content,
         href_content: this.addData.href_content,
         app_name: this.addData.app_name,
         type: this.addData.type
      }
      if (this.isEditFans) {
        params.id = this.addData.id
      }
      auditWeworkMsg(params).then(response => {
        if (response.code == 1) {
          this.dialogAddVisible = false;
          this.getFansList()
          this.isEditFans ? this.$message.success('编辑成功') : this.$message.success('新增成功')
        } else {
          this.$message.error(response.msg)
        }
      })
    },
    // 获取列表数据
    getList() {
      this.listLoading = true
      weworkList(this.listQuery).then(response => {
        if (response.code == 1) {
          this.list = response.data.list
          response.data.list.forEach((item, index) => {
             this.list[index].returntype = this.formatterType(item.return_type)
             this.list[index].corp_name = this.formatterCompany(item.corp_id)
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
    // 获取接待客服id
    getId () {
      if (this.editData.corp_id) {
        window.open(`https://zgzbtg.zgzb.com/wechatwork/auth/getList?corp_id=${this.editData.corp_id}`)
      } else {
        this.$message.warning('请先输入企微主体id')
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
      this.isEdit = false;
      this.dialogFormVisible = true;
      this.editData = JSON.parse(JSON.stringify(this.info))
    },
    // 平台选择
    changeSource (val) {
      this.groupList.forEach(item => {
        if (item.id == val) {
          this.editData.source_name = item.title
          this.editData.source = item.id
        }
      })
    },
    // 编辑账号
    editInfo () {
      this.addBtn = true;
      let params = {
         name: this.editData.name,
         corp_id: this.editData.corp_id,
         open_kfid: this.editData.open_kfid,
         account_id: this.editData.account_id,
         source_name: this.editData.source_name,
         source: this.editData.source,
         remark: this.editData.remark,
         type: this.editData.type,
         is_pay: this.editData.is_pay,
         is_repeat: this.editData.is_repeat,
         is_fans: this.editData.is_fans,
         is_reply: this.editData.is_reply,
         text_content: this.editData.text_content,
         url: this.editData.url,
         href_content: this.editData.href_content
      }
      if (this.isEdit) {
        params.id = this.editData.id
      }
      auditWework(params).then(response => {
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
    },
    // 编辑追粉
    editFans(row) {
      this.isEditFans = true;
      this.dialogAddVisible = true;
      this.addData = JSON.parse(JSON.stringify(row));
      this.skip = this.addData.skip;
    }
  }
}
</script>
<style scoped>
  .table {
    margin-top: 20px;
  }
  .tips {
    font-size: 18px;
    font-weight: bold;
  }
</style>
