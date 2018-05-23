let baseURL = process.env.BASE_API;
let Util = {
  /*根据value查找子集*/
  findChildrenByValue: function (data, action) {
    let res = null
    const find = (data, action) => {
      for (let item of data) {
        if (item.action === action) {
          return (res = item.children || [])
        } else {
          item.children && find(item.children, action)
        }
      }
    }
    find(data, action)
    return res
  },
  /*查找对象数组是否存在某关键字
   参数:
   list:数组
   keyword:关键字
   type:（匹配类型非必传）:（keys（键）/values（值））默认同时匹配
   isLike（匹配方式非必传）:ture（模糊匹配）/false(匹配相等)默认匹配相等
   * */
  findArrayObjKeyword: function (list, keyword, type, isLike) {
    if (typeof(type) == "string") {
      isLike = isLike || false;
      type = type || "";
    } else {
      isLike = type || false;
      type = "";
    }
    let newList = [];
    let result = Object.values(list).filter(item => {
      newList = type ? Object[type](item) : Object.keys(item).concat(Object.values(item));
      let exist = newList.filter(val => {
        return isLike ? val.indexOf(keyword) > -1 : val == keyword
      });
      return exist.length > 0
    });
    return {
      resultArr: result,
      flag: result.length > 0
    }
  },
  isAllEqual(obj) {
    /*判断数组是否全部相等
     *参数:
     *array 要比较的数组
     *isIgnore是否忽略大大小写
     * 返回值:
     * true 全部相等，false 不等
     * */
    let arrStr = JSON.stringify(obj.array);
    let firstStr = JSON.stringify(obj.array[0]);
    let flag = true;
    if (obj.array.length > 1) {
      for (var i = 1; i < obj.array.length; i++) {
        let str = JSON.stringify(obj.array[i]);
        if (obj.isIgnore) {
          str = str.toLowerCase();
          firstStr = firstStr.toLowerCase();
        }
        if (firstStr != str) {
          flag = false;
          break;
        }
      }
    }
    return flag;
  },
  isRepeat(obj) {
    /*比较数组中是否有重复的元素
     *参数:
     *array 要比较的数组
     *isIgnore是否忽略大大小写
     * 返回值:
     * true有，false 没有
     * */
    let arrStr = JSON.stringify(obj.array);
    let firstStr = JSON.stringify(obj.array[0]);
    let flag = false;
    if (obj.array.length > 1) {
      for (var i = 1; i < obj.array.length; i++) {
        let str = JSON.stringify(obj.array[i]);
        if (obj.isIgnore) {
          str = str.toLowerCase();
          firstStr = firstStr.toLowerCase();
        }
        if (firstStr == str) {
          flag = true;
          break;
        }
      }
    }
    return flag;
  },
  removeRepetition(obj) {
    /*去掉数组中重复的元素
     *参数:
     *isIgnore是否忽略大大小写
     * 返回值:
     * result
     * */
    let arrStr = JSON.stringify(obj.array);
    let firstStr = JSON.stringify(obj.array[0]);
    let result = [obj.array[0]], resultStr = JSON.stringify(result)
    if (obj.array.length > 1) {
      for (var i = 1; i < obj.array.length; i++) {
        let str = JSON.stringify(obj.array[i]);
        if (obj.isIgnore) {
          str = str.toLowerCase();
          resultStr = resultStr.toLowerCase();
        }
        if (resultStr.indexOf(str) == -1) {
          result.push(obj.array[i]);
          resultStr = JSON.stringify(result);
        }
      }
    }
    return result;
  },
  diffObjArray(list1, list2, attr) {
    //对比两个数组，去掉相同的,返回新数组
    let result = [];
    for (let i = 0; i < list1.length; i++) {
      let obj = list1[i];
      let flag = false;
      for (let k = 0; k < list2.length; k++) {
        if (list2[k][attr] == obj[attr]) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        result.push(obj);
      }
    }
    return result;
  },
  /*
   例如
   传入其请求路径"Erp/count/exportCountDepot"
   请求参数:req = {
   depot_id:"1",
   type:1
   }
   context:this(vue实例)
   得到结果http://erp.jcsjzx.cn/Erp/count/exportCountDepot?user_id=86&token=a70398ab4513d5ec7355bd3cd364f442d356770a
   &type=1&depot_id=1
   * */
  getExportUrl(url, req, context) {//获取导出链接
    return baseURL + url + "?" + delegateObj.geSearchParams(req, context);
  },
  getUrlPara(url, req, context) {
    return url + "?" + delegateObj.geSearchParams(req, context);
  },
  geSearchParams(req, context) {
    let arr = [];
    Object.keys(req).forEach((key) => {
      arr.push(key + "=" + req[key]);
    });
    return arr.join("&");
  },
  geSearchParamsUrl(url, req, context) {
    return url + "?" + delegateObj.geSearchParams(req, context);
  },
  getResultByKey(key, val, list) {//根据特定字段过滤结果集
    return list.filter(item => {
      return item[key] == val;
    })
  },
  pickerOptions: {
    disabledDate(time) {
      return time.getTime() > Date.now();
    },
    shortcuts: [{
      text: '今天',
      onClick(picker) {
        picker.$emit('pick', new Date());
      }
    }, {
      text: '昨天',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24);
        picker.$emit('pick', date);
      }
    }, {
      text: '一周前',
      onClick(picker) {
        const date = new Date();
        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
        picker.$emit('pick', date);
      }
    },
      {
        text: '最近15天',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 15);
          picker.$emit('pick', date);
        }
      },
      {
        text: '最近一个月',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 30);
          picker.$emit('pick', date);
        }
      }, {
        text: '最近三个月',
        onClick(picker) {
          const date = new Date();
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 90);
          picker.$emit('pick', date);
        }
      }]
  },//日期选择器特有的选项
  //emptySrc: require('@/assets/images/empty.png'),//表格无数据图片路径
  getTabSumary(data, result) {
    //表格合计
    data.map(item => {
      return Object.keys(item).filter(key => {
        if (Object.keys(result).indexOf(key) > -1) {
          result[key] += Number(item[key]) || 0
        }
      })
    });
    return result;
  },
  RegExp: {//验证
    pureName(rule, value, callback) {//可以验证少数民族名
      let v = value.toString().trim();
      let flag = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/.test(v);
      if (!flag) {
        if (callback) callback(new Error('填写内容为2位以上中文!'));
      } else {
        callback();
      }
      // return flag;
    },
    pureCN(rule, value, callback) {//纯中文
      let v = value.toString().trim();
      let flag = /^[\u4E00-\u9FA5]+$/.test(v);
      if (!flag) {
        if (callback) callback(new Error('填写内容为纯中文!'));
      } else {
        callback();
      }
      // return flag;
    },
    pureEN(rule, value, callback) {//纯英文
      let v = value.toString().trim();
      let flag = /^[A-Za-z]+$/.test(v);
      if (!flag) {
        if (callback) callback(new Error('填写内容为纯英文!'));
      } else {
        callback();
      }
      // return flag;
    },
    pureNumber: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = (/^\+?[1-9][0-9]*$/.test(v));
      if (!flag) {
        if (callback) callback(new Error('填写内容必须为纯数字!'));
      } else {
        callback();
      }
      // return flag;
    },
    passwordReg(rule, value, callback) {//密码
      let v = value.toString().trim();
      // let flag = /^[a-zA-Z0-9_`~!@#$%^&*()\-_+={[\]\}\?:;'"|<,.>/]{6,20}$/.test(v);
      let flag = /^[a-zA-Z0-9_`~!@#$%^&*()\-_+={[\]\}\?:;'"|<,.>/]{8,16}$/.test(v);  //180522改为8-16位密码 by:jw
      if (!flag) {
        if (callback) callback(new Error('密码格式由8-16位的字符组成!'));
      } else {
        callback();
      }
      // return flag;
    },
    LawfulReg: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = /^[\da-zA-Z_]+$/.test(v);
      /*/^\w+$/*/
      if (!flag) {
        if (callback) callback(new Error('填写内容只能由字母、数字、下划线组成!'));
      } else {
        callback();
      }
      // return flag;
    },
    phoneReg(rule, value, callback) {//手机号
      let v = value.toString().trim();
      // let flag = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/.test(v); //之前的正则，貌似176号段匹配不到
      // let flag = /1(3\d|47|5((?!4)\d)|7(0|1|[6-8])|8\d)\d{8,8}/.test(v);  //180404更新 by:wang
      // let flag = /^1\d{10}$/.test(v);   //直接匹配 1开头的 11位数字 by:hr
      let flag = /^[1][3,4,5,6,7,8,9][0-9]{9}$/.test(v); //产品要求严格匹配手机号  //180517更新 by:jw
      if (!flag) {
        if (callback) callback(new Error('手机格式不正确!'));
      } else {
        callback();
      }
      // return flag;
    },
    notEmpty: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = true;
      if (v.length < 1) {
        flag = false;
        if (callback) {
          if (callback) callback(new Error('填写内容不能为空!'));
        } else {
          callback();
        }
      } else {
        callback();
      }
      // return flag;
    },
    withinST: function (rule, value, callback) {//6-20位置
      let v = value.toString().trim();
      let flag = true;
      if (v.length < 6 || v.length > 20) {
        flag = false;
        if (callback) {
          if (callback) callback(new Error('填写内容6-20位!'));
        } else {
          callback();
        }
      }
      // return flag;
    },
    emailReg: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(v);
      if (!flag) {
        if (callback) callback(new Error('邮箱格式不正确!'));
      } else {
        callback();
      }
      // return flag;
    },

    identityReg: function (rule, value, callback) {
      let v = value.toString().trim();
      let flag = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(v);
      if (!flag) {
        if (callback) callback(new Error('身份证号不合法!'));
      } else {
        callback();
      }
      // return flag;
    },
    bankReg: function (rule, value, callback) {
      let v = value.toString().trim();
      let strBank = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
      let flag = true;
      if (!(/^[0-9]{16,19}$/.test(v))) {
        flag = false;
        if (callback) callback(new Error('银行卡为16-19位的纯数字!'));
      } else if (strBank.indexOf(v.substring(0, 2)) == -1) {
        flag = false;
        if (callback) callback(new Error('银行卡号开头6位不符合规范!'));
      }
      // return flag;
    }
  },
  keyupExp: {//keyup事件
    justNumber() {
      /*输入框仅输入数字*/
      event.target.value = event.target.value.replace(/[^0-9]/g, '').trim();
      return event.target.value;
    },
    justNumAndPointN(n) {
      let str = event.target.value;
      if (str.indexOf(".") == 0) {
        if (str.length == 1) {
          event.target.value = "";
        } else {
          let end = end = str.substr((str.indexOf(".") + 1)).replace(/[^0-9]/g, '').substr(0, n);
          str = "0." + end;
          event.target.value = parseFloat(str);
        }
      } else if (str.indexOf(".") > 0) {
        let idx = str.indexOf(".");
        let start = str.substring(0, idx).replace(/[^0-9]/g, '');
        let end = str.substr(str.indexOf(".") + 1).replace(/[^0-9]/g, '').substr(0, n);
        str = start + "." + end;
        event.target.value = str;
      } else {
        event.target.value = event.target.value.replace(/[^0-9]/g, '');
      }
    },
    justNumAndPoint2() {
      /*输入框仅输入数字，小数点保留2位*/
      this.justNumAndPointN(2);
    },
    justNumAndPoint4() {
      /*输入框仅输入数字，小数点保留4位*/
      this.justNumAndPointN(4);
    }
  },
};

let delegateObj = Util;
export default Util;
