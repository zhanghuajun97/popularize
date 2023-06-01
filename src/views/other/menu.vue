<template>
  <div style="padding:20px;">
    <el-row :gutter="20">
      <el-col :span="8" style="padding:0 20px;font-weight: 700;">
        <el-button size="mini" style="margin-bottom: 20px;" @click.stop="() => addTopMenu()">新增顶层菜单</el-button>

        <div style="max-height: 550px;overflow-y:auto;">
          <el-tree
            :data="data"
            node-key="id"
            highlight-current
            :expand-on-click-node="true"
            draggable
            @node-drop="allowDrop"
            :default-expanded-keys="expandedKey"
          >
            <span
              slot-scope="{ node, data }"
              :class="[{ activeColor: data.id==iscolor }, 'custom-tree-node','action']"
              @click="getDetail(node,data)"
            >
              <span
                :class="[{ 'el-icon-menu': data.ismenu==1 },{ 'el-icon-sort': data.ismenu==2 },'el-icon']"
              >
                <span style="padding-left:2px;">{{ node.label }}</span>
              </span>
              <span class="active">
                <el-button
                  type="text"
                  size="mini"
                  style="font-weight: 700;"
                  @click.stop="() => append(node,data)"
                  icon="el-icon-plus"
                >新增</el-button>
                <el-button
                  type="text"
                  size="mini"
                  style="font-weight: 700;"
                  @click.stop="() => remove(node, data)"
                >删除</el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </el-col>
      <el-col :span="16">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ Eddtxt }}菜单</span>
            <el-button
              type="text"
              style="float: right; padding: 3px 0;font-weight: 700;"
              @click="submitForm('menuForm')"
            >确定</el-button>
            <el-button
              type="text"
              style="float: right; margin-right: 20px;padding: 3px 0;font-weight: 700;"
              @click="resetForm('menuForm')"
            >重置</el-button>
          </div>
          <el-row :gutter="20">
            <!-- 表单 start -->
            <el-form
              ref="menuForm"
              :model="menuForm"
              :rules="rules"
              label-width="100px"
              class="demo-ruleForm"
            >
              <el-form-item label="上级菜单:">
                <el-col>
                  <el-input
                    v-model="menuForm.parentname"
                    :pid="menuForm.parent_id"
                    :disabled="true"
                  />
                </el-col>
              </el-form-item>

              <el-col :span="11">
                <el-form-item label="名称:" prop="title">
                  <el-input v-model="menuForm.title" />
                </el-form-item>
                <el-form-item label="类别:" prop="ismenu">
                    <el-radio-group v-model="menuForm.ismenu">
                      <el-radio :label="1">菜单</el-radio>
                      <el-radio :label="2">接口</el-radio>
                    </el-radio-group>
                </el-form-item>
              </el-col>

              <el-col :span="11">
                <el-form-item label="路径:" prop="url">
                  <el-input v-model="menuForm.url" />
                </el-form-item>
              </el-col>

              <el-col>
                <el-form-item label="备注:" prop="remark">
                  <el-col>
                    <el-input v-model="menuForm.remark" type="textarea" />
                  </el-col>
                </el-form-item>
              </el-col>
            </el-form>
          </el-row>
        </el-card>
      </el-col>
      <!-- 表单 end -->
    </el-row>
  </div>
</template>

<script>
import { menuList, auditMenu, deleteMenu, setGroupMenu  } from "@/api/user";
// import { setMenu } from "../../utils/auth";
import store from "../../store";
import router from "../../router";

let id = 1100;
export default {
  name: "permission_menu",
  data() {
    return {
      iscolor: "",
      data: [],
      txt: "",
      Eddtxt: "新增",
      menuForm: {
        id: 0,
        pid: 0,
        parentname: "",
        title: "",
        name: "",
        url: "",
        ismenu: 1,
        remark: ""
      },
      rules: {
        title: [
          {
            required: true,
            trigger: "blur",
            message: "无菜单名称"
          }
        ],
        name: [
          {
            required: true,
            trigger: "blur",
            message: "无路由名称"
          },
          {
            required: true,
            pattern: /[a-zA-Z]/,
            trigger: "blur",
            message: "仅限英文"
          }
        ],
        ismenu: [
          {
            required: true,
            trigger: "change",
            message: "未选择"
          }
        ],
        blank: [
          {
            required: true,
            trigger: "change",
            message: "未选择"
          }
        ],
        url: [
          {
            required: true,
            trigger: "blur",
            message: "无路径"
          }
        ]
      },
      expandedKey: []
    };
  },
  mounted() {},
  created() {
    this.getdata();
  },
  methods: {
    getdata() {
      const _this = this;
      menuList().then(res => {
        _this.data = JSON.parse(JSON.stringify(res.data));
      });
    },
    getDetail(node, data) {
      let _this = this;
      _this.resetForm("menuForm"); // 表单重置
      _this.Eddtxt = "编辑";
      _this.iscolor = data.id;
      // 当前元素
      _this.menuForm.name = data.name;
      _this.menuForm.title = data.label;
      _this.menuForm.url = data.url;
      _this.menuForm.remark = data.remark;
      _this.menuForm.ismenu = data.ismenu 
      _this.menuForm.id = data.id;
      _this.menuForm.pid = node.data.pid;

      // 父元素
      const parent = node.parent;
      _this.txt = [];
      _this.menuForm.parentname = "";
      _this.getparent(node);
      _this.forArray();
    },
    //新增顶层菜单
    addTopMenu() {
      const _this = this;
      _this.resetForm("menuForm"); // 表单重置
      _this.Eddtxt = "新增";
      _this.txt = [];
      _this.menuForm.pid = 0;
    },
    append(node, data) {
      let _this = this;
      _this.resetForm("menuForm"); // 表单重置
      _this.Eddtxt = "新增";
      _this.iscolor = data.id;

      // 父元素
      const parent = node.parent;
      _this.txt = [];
      _this.menuForm.parentname = "";
      _this.getparent2(node);
      _this.forArray();
    },
    forArray() {
      let _this = this;
      for (let i = 0; i < _this.txt.length; i++) {
        _this.menuForm.parentname += _this.txt[i];
      }
    },
    getparent(pnode) {
      const _this = this;
      if (pnode.data.pid != 0 && pnode.parent != null) {
        _this.txt.unshift(pnode.parent.data.label + " / ");
        _this.getparent(pnode.parent);
      }
    },
    getparent2(pnode) {
      const _this = this;
      _this.txt.unshift(pnode.data.label + " / ");
      if (pnode.data.pid != 0 && pnode.parent != null) {
        _this.getparent2(pnode.parent);
      }
    },
    remove(node, data) {
      const _this = this;
      _this
        .$confirm("确定删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          let params = {
            id: data.id
          }
          deleteMenu(params).then(response => {
            _this.$message({
              message: response.msg,
              type: "success"
            });
            if (response.code == 1) {
              this.getdata(); //列表重载
              if (data.ismenu == 1) {
                _this.freshMenu();
              }
            }
          });
          _this.resetForm("menuForm"); // 表单重置
        })
        .catch(() => {
          _this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    submitForm(formName) {
      const _this = this;
      _this.$refs[formName].validate(valid => {
        if (valid) {
          let params = {};
          if (_this.Eddtxt != "新增") {
            params = {
              id: _this.menuForm.id,
              pid: _this.menuForm.pid,
              title: _this.menuForm.title,
              url: _this.menuForm.url,
              is_menu: _this.menuForm.ismenu,
              remark: _this.menuForm.remark
            };
          } else {
            params = {
              pid: _this.menuForm.pid,
              title: _this.menuForm.title,
              url: _this.menuForm.url,
              is_menu: _this.menuForm.ismenu,
              remark: _this.menuForm.remark
            };
          }
          auditMenu(params).then(response => {
              _this.expandedKey.push(params.pid);
              _this.$message({
                message: response.msg,
                type: "success"
              });
              if (response.code == 1) {
                _this.getdata(); //列表重载
                _this.resetForm("menuForm"); // 表单重置
                if (params.ismenu == 1) {
                  _this.freshMenu();
                }
              }
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    // 表单重置
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    //拖拽成功完成时出发的事件
    allowDrop(selfNode, endNode, location, e) {
      let _this = this;
      let new_pid = 0;
      if (location == "before" || location == "after") {
        if (endNode.parent.parent != null) {
          new_pid = endNode.parent.data.id;
        }
      } else {
        new_pid = endNode.data.id;
      }
      let data = selfNode.data;
      _this.changeNode(data, new_pid);
    },
    changeNode(data, new_pid) {
      let _this = this;
      let params = {
        id: data.id,
        pid: new_pid,
        title: data.label,
        url: data.url,
        ismenu: data.ismenu,
      };
      auditMenu(params).then(response => {
        _this.expandedKey.push(params.pid);
        _this.$message({
          message: response.msg,
          type: "success"
        });
        if (response.code == 1) {
          _this.getdata(); //列表重载
          _this.resetForm("menuForm"); // 表单重置
          if (params.ismenu == 1) {
            _this.freshMenu();
          }
        }
      })
    },
    async freshMenu() {
      var response = await menuList();
      // setMenu(JSON.stringify(response.data));
      const accessRoutes = await store.dispatch(
        "permission/generateRoutes",
        response.data
      );
      router.addRoutes(accessRoutes);
    }
  }
};
</script>

<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}
.active {
  display: none;
}

.action:hover .active {
  display: block;
  color: red;
}

.grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
}

.icon-item {
  margin: 20px;
  height: 85px;
  text-align: center;
  width: 100px;
  float: left;
  font-size: 30px;
  color: #24292e;
  cursor: pointer;
}
.icon-item span {
  display: block;
  font-size: 16px;
  margin-top: 10px;
}

.disabled {
  pointer-events: none;
}

.activeColor {
  color: rgb(24, 144, 255);
}
</style>
