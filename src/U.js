/**
 * @file U.js This is an awesome collection of util functions
 * @version 1.0
 * @author Peng sicheng
 * @copyright 2017
 */

;(function() {
    'use strict';

    var root = this;
    /**
     * @namespace U
     * @desc 全局命名空间U，所有函数皆属于对象U的方法，通过U.XX调用
     */
    var U = function(obj){
        if(obj instanceof U){
            return obj;
        }else{
            return new U(obj);
        }
    };

    //根据exports判断运行环境node or browser
    if(typeof exports === 'undefined'){
        root.U = U;
    }else{
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = U;
        }
        exports.U = U;
    }

    var toString = Object.prototype.toString;
    if(![].forEach){
        //es5 forEach shim
        Array.prototype.forEach = function(fn){
            for(var i = 0,len = this.length;i<len;i++){
                fn.call(this,this[i],i);
            }
        };
    }
    /** @namespace Type */
    /**
     * 获取指定对象类型
     * @memberof Type
     * @param {*} myParam. Required. myParam description.
     * @return {string} myReturnValue description.
     * @method getType
     */
    U.getType = function(obj){
        var str = toString.call(obj),//=>’[object Number]’
            right = str.split(' ')[1];
        return right.substr(0, right.length-1).toLocaleLowerCase();//=>'number'
    };
    U.isNaN = function(obj){
        return obj !== obj;
    };
    U.isUndefined = function(obj){
        return obj === void 0;
    };
    U.isObject = function(obj){
        var type = typeof obj;
        return U.getType(obj) === 'object' || type === 'object' || type === 'function';
    };
    U.isElement = function(obj){
        return !!(obj && obj.nodeType === 1);
    };
    U.isArray = Array.isArray || function(obj){
        return toString.call(obj) === '[object Array]';
    };
    U.isArrayLike = function(obj){
        if(obj && typeof obj === 'object'){
            var n = obj.length;
            var str = toString.call(obj);
            if(/Array|NodeList|Arguments|CSSRuleList/.test(str)){
                return true;
            }else if(
                +n===n && //true:判断为number类型
                !(n%1) && //true:判断为整数
                n >= 0
            ){
                return true;
            }
        }
        return false;
    };

    /** @namespace Collection */
    /** 遍历list中所有元素，list可以是array,arryLike or object
     * @param {list} list - 准备遍历的集合对象
     * @param {eachCallback} fn - 回调方法（value,index,list）
     * @return {list} myReturnValue description.
     * @method each
     * @memberof Collection
     */
    U.each = function(list, fn){
        var i,len;
        if(U.isArray(list) || U.isArrayLike(list)){
            for(i=0,len=list.length;i<len;i++){
                fn(list[i], i, list);
            }
        }else if(U.getType(list) === 'object'){
            for(i in list){
                fn(list[i], i, list);
            }
        }else{
            throw new TypeError('first param should be an array, arrayLike or object!');
        }
        return list;
    };
    /**
     * 遍历回调函数
     * @callback  eachCallback
     * @param {*} value - 当前对象value
     * @param {number} index - 当前对象index
     * @param {list} list - 遍历集合
     */

    //其他常用类型判断
    U.each(['Arguments','Function','String','Number','Date','RegExp','Error'],function(type){
        U['is' + type] = function(obj){
            return toString.call(obj) === '[object ' + type + ']';
        };
    });
    /**
     * 输出list根据转换函数fn映射的新数组
     * @param {list} list - 目标集合
     * @param {eachCallback} fn - 回调方法（value,index,list）
     * @return {array} 返回经由fn生成的新数组
     * @method map
     * @memberof Collection
     */
    U.map = function(list, fn){
        var res;
        if(U.isArray(list) || U.isArrayLike(list)){
            res = new Array(list.length);
            list = [].slice.call(list);
            for(var i=0,len=list.length;i<len;i++){
                res[i] = fn(list[i], i, list);
            }
        }else if(U.getType(list) === 'object'){
            res = {};
            for(var j in list){
                res[j] = fn(list[j], j, list);
            }
        }else{
            throw new TypeError('first param should be an array, arrayLike or object!');
        }
        return res;
    };
    //
    //fn接受四个参数memo(上次计算结果,传入参数memo表示memo初始值),value,index,list
    /**
     * 对list遍历，并执行fn,每次遍历结果作为第一个参数传递给下次遍历，最后返回一个结果
     * @param {list} list - 目标集合
     * @param {reduceCallback} fn - 回调方法（memo,value,index,list）
     * @param {*} memo - reduce初始值
     * @return {*} reduce结果
     * @method reduce
     * @memberof Collection
     */
    U.reduce = function(list, fn, memo){
        var count = 0;
        while(count < list.length){
            memo = fn(memo, list[count], count, list);
            count += 1;
        }
        return memo;
    };
    /**
     *reduce回调函数
     * @callback  reduceCallback
     * @param {*} memo - reduce初始值
     * @param {*} value - 当前对象value
     * @param {number} index - 当前对象index
     * @param {list} list - 遍历集合
     */

    /**
     * 对list遍历，返回第一个通过fn的检测(return:true)的值
     * @param {list} list - 目标集合
     * @param {eachCallback} fn - 检测函数
     * @return {*} list中第一个通过fn检测的值
     * @method find
     * @memberof Collection
     */
    U.find = function(list,fn){
        for(var i=0,len=list.length;i<len;i++){
            if(fn(list[i])){
                return list[i];
            }
        }
    };
    /**
     * 对list遍历，返回所有通过fn的检测(return:true)的值
     * @param {list} list - 目标集合
     * @param {eachCallback} fn - 检测函数
     * @return {array} 所有通过fn检测的值组成的数组
     * @method filter
     * @memberof Collection
     */
    U.filter = function(list,fn){
        var res = [];
        U.each(list,function(value){
            if(fn(value)){
                res.push(value);
            }
        });
        return res;
    };
    /**
     * 遍历list，返回所有未通过fn的检测(return:true)的值，与filter相仿
     * @param {list} list - 目标集合
     * @param {eachCallback} fn - 检测函数
     * @return {array} 所有未通过fn检测的值组成的数组
     * @method reject
     * @memberof Collection
     */
    U.reject = function(list,fn){
        var res = [];
        U.each(list,function(value){
            if(!fn(value)){
                res.push(value);
            }
        });
        return res;
    };
    /**
     * 遍历list, 返回包含props列出键值对的数组
     * @param {list} list - 目标集合
     * @param {object} props - 需要匹配的键值对
     * @return {array} 包含props列出键值对的数组
     * @method where
     * @memberof Collection
     */
    U.where = function(list,props){
        var matcher = U.matcher(props), res = [];
        U.each(list,function(value){
            if(matcher(value)){
                res.push(value);
            }
        });
        return res;
    };
    /**
     * 若list中所有值都通过fn的真值检测，则返回true
     * @param {list} list - 目标集合
     * @param {eachCallback} fn - 检测函数
     * @return {boolean} 若list中所有值都通过fn的真值检测，则返回true
     * @method every
     * @memberof Collection
     */
    U.every = function(list,fn){
        var keys = U.isObject(list) && U.keys(list),
            length = (keys || list).length;
        for(var i=0;i<length;i++){
            var item = keys ? list[keys[i]] : list[i];
            if(!fn(item))return false;
        }
        return true;
    };
    /**
     * 只要list中有值通过fn的真值检测，则返回true
     * @param {list} list - 目标集合
     * @param {eachCallback} fn - 检测函数
     * @return {boolean} 只要list中有值通过fn的真值检测，则返回true
     * @method some
     * @memberof Collection
     */
    U.some = function(list,fn){
        var keys = U.isObject(list) && U.keys(list),
            length = (keys || list).length;
        for(var i=0;i<length;i++){
            var item = keys ? list[keys[i]] : list[i];
            if(fn(item))return true;
        }
        return false;
    };
    /**
     * 判断list是否包含value
     * @param {list} list - 目标集合
     * @param {*} value -value
     * @return {boolean}
     * @method contains
     * @memberof Collection
     */
    U.contains = function(list,value){
        if(U.isArray(list)){
            //若是array,使用indexOf判定
            return list.indexOf(value) > -1;
        }else{
            var keys = U.isObject(list) && U.keys(list),
                length = (keys || list).length;
            for(var i=0;i<length;i++){
                var item = keys ? list[keys[i]] : list[i];
                if(item === value)return true;
            }
            return false;
        }
    };
    /**
     * 返回list中最大值，若传递fn,则将其返回值作为每个值排序的依据
     * @param {list} list - 目标集合
     * @param {eachCallback} [fn] - 检测函数,可选
     * @return {*} 返回拥有匹配后最大值的项
     * @method max
     * @memberof Collection
     */
    U.max = function(list,fn){
        var nList = [];
        if(fn){
            U.each(list,function(value,index){
                nList[index] = fn(value);
            });
        }else{
            nList = list;
        }
        return U.reduce(nList,function(memo,value){
            return memo >= value ? memo : value;
        },-Infinity);
    };
    /**
     * 返回list中最小值，若传递fn,则将其返回值作为每个值排序的依据
     * @param {list} list - 目标集合
     * @param {eachCallback} [fn] - 检测函数,可选
     * @return {*} 返回拥有匹配后最小值的项
     * @method min
     * @memberof Collection
     */
    U.min = function(list,fn){
        var nList = [];
        if(fn){
            U.each(list,function(value,index){
                nList[index] = fn(value);
            });
        }else{
            nList = list;
        }
        return U.reduce(nList,function(memo,value){
            return memo <= value ? memo : value;
        },Infinity);
    };
    /**
     * 返回一个排序后的list副本，若传递fn,则将其作为排序依据，默认升序
     * @param {list} list - 目标集合
     * @param {sortCallback} [fn] - 检测函数,可选
     * @return {array} 排序后的list副本
     * @method sortBy
     * @memberof Collection
     */
    U.sortBy = function(list,fn){
        var res = list.slice(0);
        return res.sort(fn);
    };
    /**
     * @callback sortCallback
     * @param {*} a - 比较前一个数
     * @param {*} b - 比较后一个数
     * @return {number} 详见js原生sort()，若number<0，则a在b前，升序排列
     */

    /**
     * 对list分组,若fn是函数，list每一项作为参数传入，输出作为分组key
     * 若fn为字符串('length')，使用value.length作为分组标准
     * @param {list} list - 目标集合
     * @param {(eachCallback|string)} fn - 遍历回调函数或string:'length'
     * @return {object} 分组结果
     * @method groupBy
     * @memberof Collection
     */
    U.groupBy = function(list,fn){
        var res = {};
        U.each(list,function(value,index,list){
            var key = fn === 'length' ? 'length' : fn(value,index,list);
            if(res[key] === void 0){
                res[key] = [];
            }
            res[key].push(value);
        });
        return res;
    };
    /**
     * 返回list的随机乱序副本,
     * shuffle详见: https://bost.ocks.org/mike/shuffle/
     * @param {list} list - 目标集合
     * @return {list} 乱序副本
     * @method shuffle
     * @memberof Collection
     */
    U.shuffle = function(list){
        var res = list.slice(0), len = list.length - 1;
        while(len >= 0){
            var index = U.random(len);//0~len随机整数
            var last = res[len];
            res[len] = res[index];
            res[index] = last;
            len -= 1;
        }
        return res;
    };
    /**
     * 返回list中一个长度为n的随机样本，n默认为1
     * @param {list} list - 目标集合
     * @param {number} [n=1] - 样本长度，默认为1
     * @return {array} 样本数组
     * @method sample
     * @memberof Collection
     */
    U.sample = function(list,n){
        n = n || 1;
        var res = new Array(n), nList = list.slice(0);
        for(var i=0;i<n;i++){
            var index = U.random(nList.length - 1);
            res[i] = nList[index];
            nList.splice(index,1);
        }
        return res;
    };
    /**
     * 返回list的长度/属性数量
     * @param {list} list - 目标集合
     * @return {number} 长度or属性数量
     * @method size
     * @memberof Collection
     */
    U.size = function(list){
        if(U.isArrayLike(list))return list.length;
        else{
            return U.keys(list).length;
        }
    };
    /**
     * 返回由list拆分的两个数组，第一个数组内元素均满足fn真值检测，第二个均不满足
     * @param {list} list - 目标集合
     * @param {eachCallback} fn - 真值检测回调函数
     * @return {array} 第一个数组内元素均满足fn真值检测，第二个均不满足
     * @method partition
     * @memberof Collection
     */
    U.partition = function(list,fn){
        var arr1 = [], arr2 = [];
        U.each(list, function(value){
            if(fn(value)){
                arr1.push(value);
            }else{
                arr2.push(value);
            }
        });
        return [arr1,arr2];
    };
    /**
     * 萃取集合对象中某属性值，返回值数组
     * @param {list} list - 目标集合
     * @param {string} key - key
     * @return {array} 对应key的value组成的数组
     * @method pluck
     * @memberof Collection
     */
    U.pluck = function(list, key){
        var res = [];
        for(var i = 0;i<list.length;i++){
            if(list[i][key] !== undefined){
                res.push(list[i][key]);
            }
        }
        return res;
    };
    /** @namespace Array */
    /**
     * 返回array第一个元素，传递n则返回前n个元素
     * @param {array} array - 目标数组
     * @param {number} [n=1] - 前n个元素
     * @return {array} 前n or 1个元素组成的数组
     * @method head
     * @memberof Array
     */
    U.head = function(array, n){
        return array.slice(0, n || 1);
    };
    /**
     * 返回array最后一个元素，传递n则返回后n个元素
     * @param {array} array - 目标数组
     * @param {number} [n=1] - 目标数组
     * @return {array} 后n or 1个元素组成的数组
     * @method tail
     * @memberof Array
     */
    U.tail = function(array, n){
        return U.reverse(array).slice(0, n || 1);
    };
    /**
     * 返回array的倒序副本
     * @param {array} array - 目标数组
     * @return {array} 倒序副本
     * @method reverse
     * @memberof Array
     */
    U.reverse = function(array){
        var arr = [];
        for(var i = array.length - 1;i >= 0;i--){
            arr.push(array[i]);
        }
        return arr;
    };
    /**
     * 返回一个被value填充的array副本
     * @param {array} array - 目标数组
     * @return {*} 准备填充的value
     * @method fill
     * @memberof Array
     */
    U.fill = function(array,value){
        var arr = [];
        for(var i = 0,len = array.length;i<len;i++){
            arr.push(value);
        }
        return arr;
    };
    /**
     * 返回一个除去所有值为false的array副本, (false,undefined,null,0,"",NaN)
     * @param {array} array - 目标数组
     * @return {array} 去false之后的array副本
     * @method compact
     * @memberof Array
     */
    U.compact = function(array){
        var arr = [];
        array.forEach(function(item){
            if(item){
                arr.push(item);
            }
        });
        return arr;
    };
    /**
     * 将嵌套多层的数组展开并返回其副本
     * @param {array} array - 目标数组
     * @return {array} 平坦之后的array副本
     * @method flatten
     * @memberof Array
     */
    U.flatten = function(array){
        var arr = [];
        array.forEach(function(item){
            if(U.isArray(item) || U.isArrayLike(item)){
                arr = arr.concat(U.flatten(item));
            }else{
                arr.push(item);
            }
        });
        return arr;
    };
    /**
     * 返回去掉value的array的副本
     * @param {array} array - 目标数组
     * @param {*} value - 需要去掉的value
     * @return {array} 掉value的array的副本
     * @method without
     * @memberof Array
     */
    U.without = function(array,value){
        var arr = [];
        array.forEach(function(item){
            if(item !== value){
                arr.push(item);
            }
        });
        return arr;
    };
    /**
     * 返回传入一个或多个array的并集(无重复元素）
     * @param {...array} array - 目标数组
     * @return {array} 返回目标数组的并集
     * @method union
     * @memberof Array
     */
    U.union = function(){
        var arrays = [].slice.call(arguments);
        return U.unique(U.flatten(arrays));
    };
    /**
     * 返回传入一个或多个array的交集(无重复元素）
     * @param {...array} array - 目标数组
     * @return {array} 返回目标数组的交集
     * @method intersection
     * @memberof Array
     */
    U.intersection = function(){
        var args = [].slice.call(arguments),
            arr = U.flatten(args),
            res = [], tag = {};
        arr.forEach(function(item){
            if(tag[item] === undefined){
                tag[item] = 1;
            }else{
                tag[item] += 1;
            }
        });
        for(var i in tag){
            if(tag[i] === args.length){
                res.push(parseInt(i));
            }
        }
        return res;
    };
    /**
     * 返回的值来自array,且不存在于other数组
     * @param {array} array - 目标数组
     * @param {...array} other - other数组
     * @return {array} 来自array,且不存在于other的元素集合
     * @method difference
     * @memberof Array
     */
    U.difference = function(array,other){
        var args = [].slice.call(arguments),res = array.slice(0);
        // var arr = args[0];
        args.shift();//=>args=[...other]
        var others = U.flatten(args);
        for(var i = 0,len = res.length;i<len;i++){
            var item = res[i];
            others.forEach(function(value){
                if(item === value){
                    res.splice(i,1);
                    i-=1;len-=1;
                }
            });
        }
        return res;
    };
    /**
     * 返回去重后的新数组
     * @param {array} array - 目标数组
     * @return {array} 去重后的数组副本
     * @method unique
     * @memberof Array
     */
    U.unique = function(array){
        var arr = [];
        loop:for(var i = 0,n = array.length;i<n;i++){
            for(var x = i + 1;x < n; x++){
                if(array[x] === array[i]){
                    continue loop;
                }
            }
            arr.push(array[i]);
        }
        return arr;
    };
    /**
     * 将每个array相应值合并在一起并返回
     * @param {...array} array - 目标数组
     * @return {array} 相应值合并后的数组
     * @example
     * //return [['tom',20,true],['ben',30,false]]
     * U.zip(['tom','ben'],[20,30],[true,false])
     * @method zip
     * @memberof Array
     */
    U.zip = function(){
        return U.unzip(arguments);
    };
    /**
     * zip的反向操作
     * @param {array} array - 目标数组
     * @return {array} 拆分相应值的数组
     * @example
     * //return [['tom',20,true],['ben',30,false]]
     * U.unzip([['tom','ben'],[20,30],[true,false]])
     * @method unzip
     * @memberof Array
     */
    U.unzip = function(array){
        var res = [];
        for (var i = 0; i < array[0].length; i++) {
            res[i] = U.pluck(array, i);
        }
        return res;
    };
    /**
     * 将数组转化为对象并返回
     * @example
     * //return {tom:1,ben:2}
     * U.object(['tom','ben'],[1,2])
     * @example
     * //return {tom:1,ben2}
     * U.object([['tom',1],['ben',2]])
     * @param {array} array - 目标数组
     * @param {array} [value] value数组
     * @return {object} 返回对象
     * @method object
     * @memberof Array
     */
    U.object = function(array,value){
        var res = {};
        array.forEach(function(item,index){
            if(value){
                res[item] = value[index];
            }else{
                res[item[0]] = item[1];
            }
        });
        return res;
    };
    //生成固定step数组
    //省略start默认为0，step默认为1
    //注意若start数值大于end,step需指定为负数，否则返回空数组
    /**
     * 返回去重后的新数组
     * @param {number} [start=0] - range起点,默认为0
     * @param {number} end - range终点
     * @param {number} [step=1] - 步长默认为1
     * @return {array} 固定step数组
     * @method range
     * @memberof Array
     */
    U.range = function(start,end,step){
        var res = [],args = [].slice.call(arguments);
        if(args.length===1){
            start = 0;
            end = args[0];
        }
        if(start === void 0){
            start = 0;
        }
        if(step === void 0){
            step = 1;
        }
        var count = (end - start)/step;//循环次数
        for(var i = 0;i <= count;i++){
            res.push(start + step * i);
        }
        return res;
    };
    /** @namespace Function */
    /**
     * 绑定this, 第三个参数之后作为默认参数传递给fn,返回偏函数
     * @param {fn} fn - 原始函数
     * @param {*} context - 传递的this
     * @return {function}
     * @method bind
     * @memberof Function
     */
    U.bind = function(fn,context){
        if(typeof fn !== 'function'){
            throw new TypeError('bind\'s first parameter should be a function!');
        }
        var oArgs = [].slice.call(arguments,2);
        return function(){
            var args = [].slice.call(arguments);
            return fn.apply(context, oArgs.concat(args));
        };
    };
    /**
     * 类似setTimeout, 等待wait毫秒后调用function, 支持传入参数
     * @param {fn} fn - 原始函数
     * @param {number} wait - 等待时间，单位毫秒ms
     * @return {function}
     * @method delay
     * @memberof Function
     */
    U.delay = function(fn,wait){
        var args = [].slice.call(arguments,2);
        return setTimeout(function(){
            fn.apply(this,args);
        },wait);
    };
    /**
     * 预先定义fn参数，返回包含参数的新函数，可用'_'定义需声明的参数，'_'不可省略
     * @param {fn} fn - 原始函数
     * @param {...*} args - 需要提前声明的参数
     * @return {function} 返回偏函数
     * @method partial
     * @memberof Function
     */
    U.partial = function(fn){
        var args = [].slice.call(arguments,1);
        return function(){
            var self = this, curArgs = [].slice.call(arguments);
            for(var i = 0,len = args.length;i<len;i++){
                if(args[i] === '_'){
                    args[i] = curArgs.shift();
                }
            }
            return fn.apply(self, args);
        };
    };
    /**
     * 函数节流器，主要用于触发频率高的事件，如resize
     * @param {fn} fn - 原始函数
     * @param {number} wait - 节流时间差ms（200-500）
     * @param {object} [option] - option相关设置
     * @param {boolean} [option.leading=true] - false表示禁用第一次调用
     * @param {boolean} [option.trailing=true] - false表示禁用最后一次调用
     * @return {function} 返回节流处理后的函数
     * @method throttle
     * @memberof Function
     */
    U.throttle = function(fn,wait,option){
        var waiting = false;//默认
        option = {
            leading:option.leading === undefined ? true : option.leading,
            trailing:option.trailing === undefined ? true : option.trailing
        };
        return function(){
            var context = this, args = arguments;
            if(!waiting){
                if(option.leading){
                    fn.apply(context, args);
                }
                waiting = true;
                setTimeout(function(){
                    if(option.trailing){
                        fn.apply(context, args);
                    }
                    waiting = false;
                }, wait);
            }
        };
    };
    /**
     * 简易节流器，只支持间隔后调用
     * @param {fn} fn - 原始函数
     * @param {number} wait - 节流时间差ms（200-500）
     * @return {function} 返回节流处理后的函数
     * @method simpleThrottle
     * @memberof Function
     */
    U.simpleThrottle = function(fn, wait){
        var timeout = null;
        return function(){
            var context = this, args = arguments;
            if(timeout !== null){
                clearTimeout(timeout);
            }
            timeout = setTimeout(function(){
                fn.apply(context,args);
            },wait);
        };
    };
    /**
     * debounce 防跳反, 连续在某一时间间隔(wait)内触发的相同事件只在最后一次触发后回调.
     * 多个事件压缩组合为一个事件并触发.
     * 比如搜索输入框，输入结束时发送一次ajax请求，而不是每次改变内容都发送请求
     * @param {fn} fn - 原始函数
     * @param {number} wait - 时间差ms（200-500）
     * @param {boolean} [immediate=true] - 默认为true，会在wait时间间隔开始调用回调，否则只在时间结束时调用
     * @return {function} 返回防跳反处理后的函数
     * @method debounce
     * @memberof Function
     */
    U.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        var later = function() {
            var last = U.now() - timestamp;//last保存 距离上次触发时间差

            if (last < wait && last >= 0) {//时间差<wait,且>0,说明在wait间隔内再次触发事件
                timeout = setTimeout(later, wait - last);//继续利用setTimeout ,延续到 last == wait
            } else {//last<0 or last >= wait,说明wait期间没有再次触发事件
                timeout = null;//清空timeout
                if (!immediate) {//未声明immediate前提下，执行回调
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;//肯定执行到此，为何加判断？
                }
            }
        };
        return function() {
            //保存当前this和接收的参数
            context = this;
            args = arguments;
            timestamp = U.now();//记录最新触发事件时间
            //若之前没有定义过timeout,且immediate声明为true,则在间隔开始前调用一次func
            //若有timeout或未声明immediate,则此时不调用，等待timeout执行later
            var callNow = immediate && !timeout;
            if (!timeout) timeout = setTimeout(later, wait);//wait毫秒后执行later
            if (callNow) {//只有声明immediate=true且在时间间隔前才执行
                result = func.apply(context, args);
                context = args = null;
            }
            return result;
        };
    };
    /**
     * 创建一个只能调用一次fn的函数,重复调用没有效果，只会返回第一次执行的结果
     * @param {function} fn - 目标函数
     * @return {function} 包装后的函数
     * @method once
     * @memberof Function
     */
    U.once = function(fn){
        return U.before(fn,1);
    };
    /**
     * 创建一个基于fn，且被调用不超过count次的函数，在第count次调用时返回结果
     * @param {function} fn - 目标函数
     * @param {number} [count=1] - 最大调用次数count,默认为1
     * @return {function} 包装后的函数
     * @method before
     * @memberof Function
     */
    U.before = function(fn, count){
        var memory = null;
        if(count === void 0){
            count = 1;
        }
        return function(){
            if(count > 0){
                memory = fn.apply(this, arguments);
                count -= 1;
            }else{
                fn = null;
            }
            return memory;
        };
    };
    /**
     * 创建一个函数，只有在运行count次后，才会执行fn
     * @param {function} fn - 目标函数
     * @param {number} [count=0] - 预执行次数count,默认为0
     * @return {function} 包装后的函数
     * @method after
     * @memberof Function
     */
    U.after = function(fn, count){
        if(count === void 0) count = 0;
        return function(){
            if(count < 1){
                return fn.apply(this, arguments);
            }else{
                count -= 1;
            }
        };
    };
    /**
     * 将函数fn封装到函数wrapper里,并把fn作为wrapper第一个参数传入其中
     * @param {function} fn - 需要封装为参数的函数fn
     * @param {function} wrapper - 包裹函数wrapper
     * @return {function} 封装后的wrapper,默认参数为fn
     * @method wrap
     * @memberof Function
     */
    U.wrap = function(fn,wrapper){
        return function(){
            var args = [].slice.call(arguments);
            args.unshift(fn);
            return wrapper.apply(this,args);
        };
    };
    /**
     * 将多个函数组合为一个新函数，上一个函数的输入当做输入传入下一个函数
     * @param {...function} fns - 任意数量的函数
     * @return {function} 封装后的wrapper,默认参数为fn
     * @method compose
     * @memberof Function
     */
    U.compose = function(){
        var funcList = [].slice.call(arguments);
        var count = -1;
        function recru(){
            // console.log(arguments);
            count += 1;
            if(count < funcList.length){
                return recru(funcList[count].apply(null, arguments));
            }
            return arguments[0];
        }
        return function(){
            return recru.apply(this,arguments);
        };
    };

    /** @namespace Object */
    /**
     * 枚举对象属性,返回属性名称数组
     * @param {object} obj - 目标对象
     * @return {array} 属性名称数组
     * @method keys
     * @memberof Object
     */
    U.keys = function(obj){
        if(!U.isObject(obj))return [];
        var keys = [];
        for(var i in obj){
            keys.push(i);
        }
        return keys;
    };
    /**
     * 返回属性对应值的数组
     * @param {object} obj - 目标对象
     * @return {array} 属性值数组
     * @method values
     * @memberof Object
     */
    U.values = function(obj){
        var keys = U.keys(obj),values = [];
        for(var i=0,len=keys.length;i<len;i++){
            values[i] = obj[keys[i]];
        }
        return values;
    };
    //应用于对象的map
    U.mapObject = U.map;
    /**
     * 返回对象中所有方法名，即对应值是函数的属性名
     * @param {object} obj - 目标对象
     * @return {array} 由方法名组成的数组
     * @method functions
     * @memberof Object
     */
    U.functions = function(obj){
        var keys = U.keys(obj), length = keys.length, res = [];
        for(var i=0;i<length;i++){
            if(U.isFunction(obj[keys[i]])){
                res.push(keys[i]);
            }
        }
        return res;
    };
    /**
     * 复制source对象中的属性覆盖至obj,返回obj
     * @param {object} obj - 目标对象
     * @param {object} source - source对象
     * @return {object} 返回指定属性被覆盖的obj
     * @method extend
     * @memberof Object
     */
    U.extend = function(obj,source){
        var keys = U.keys(source);
        for(var i =0,len = keys.length;i<len;i++){
            obj[keys[i]] = source[keys[i]];
        }
        return obj;
    };
    /**
     * 过滤出obj的有效keys，或接受一个判断函数，根据自定义策略返回指定key
     * @param {object} obj - 目标对象
     * @param {(eachCallback|array)} fn - 用于过滤的回调函数或由keys组成的数组[key1,key2,...]
     * @return {obj} 返回满足条件keys组成的object
     * @method pick
     * @memberof Object
     */
    U.pick = function(obj,fn){
        var keys = U.keys(obj), res = {};
        for(var i=0,len = keys.length;i<len;i++){
            var cKey = keys[i];
            if(
                (fn === void 0) ||
                (U.isArray(fn) && U.contains(fn,cKey)) ||
                (U.isFunction(fn) && fn(obj[cKey],cKey,obj))
            )res[cKey] = obj[cKey];
        }
        return res;
    };
    /**
     * 与pick相反，忽略keys，接受参数同pick
     * @param {object} obj - 目标对象
     * @param {(eachCallback|array)} fn - 用于过滤的回调函数或由keys组成的数组[key1,key2,...]
     * @return {obj} 返回不满足条件keys组成的object
     * @method omit
     * @memberof Object
     */
    U.omit = function(obj,fn){
        var keys = U.keys(obj), res = {};
        for(var i=0,len = keys.length;i<len;i++){
            var cKey = keys[i];
            if(
                (U.isArray(fn) && !U.contains(fn,cKey)) ||
                (U.isFunction(fn) && !fn(obj[cKey],cKey,obj))
            )res[cKey] = obj[cKey];
        }
        return res;
    };
    /**
     * 深拷贝（不止对象）,返回一个obj的副本
     * @param {*} obj - 拷贝源对象，任意类型
     * @return {*} obj的副本
     * @method clone
     * @memberof Object
     */
    U.clone = function(obj){
        var res;
        if(U.isArrayLike(obj)){
            [].slice.call(obj);
            res = obj.slice(0);
        }else if(U.isObject(obj)){
            res = U.extend({}, obj);
        }else{
            res = obj;
        }
        return res;
    };
    /**
     * 返回一个断言函数function(obj){}，用来判断给定对象是否匹配attrs包含的键值对
     * @param {object} attrs - 指定属性集合
     * @return {function} 断言函数
     * @method matcher
     * @memberof Object
     */
    U.matcher = function(attrs){
        return function(obj){
            if(!U.isObject(obj)){
                return false;
            }
            for(var key in attrs){
                if(obj[key] === void 0){
                    return false;
                }
                if(obj.hasOwnProperty(key) && obj[key] !== attrs[key]){
                    return false;
                }
            }
            return true;
        };
    };
    /**
     * 判断obj是否包含props({key:value})
     * @param {object} obj - 目标对象
     * @param {object} props - 指定{key:value}
     * @return {boolean} 是否包含
     * @method isMatch
     * @memberof Object
     */
    U.isMatch = function(obj,props){
        return U.matcher(props)(obj);
    };
    /**
     * 两个对象之间的深度比较
     * @param {object} obj - 目标对象
     * @param {object} other - 另一个对象
     * @return {boolean} 是否深度相同
     * @method isEqual
     * @memberof Object
     */
    U.isEqual = function(obj,other){
        return U.isMatch(obj,other);
    };
    //
    /**
     * 判断obj是否为空，若obj没有可枚举的属性，返回true
     * 对于string和arrayLike,length=0则返回true
     * @param {*} obj - 目标对象
     * @return {boolean} 是否为空
     * @method isEmpty
     * @memberof Object
     */
    U.isEmpty = function(obj){
        if((U.isString(obj) || U.isArrayLike(obj)) && obj.length === 0){
            return true;
        }
        if (U.isObject(obj) && U.keys(obj).length === 0) {
            return true;
        }
        return false;
    };

    /** @namespace Date */
    /*
        构造日期主要为以下四种方式：
        new Date()
        new Date(value) 传入毫秒数(以1900-1-1为起点)
        new Date(string) 传入日期字符串
        new Date(year,month,day,*hour,minute,second,millisecond*) 传入年月日时分秒毫秒
    */
    /**
     * 返回当前时间时间戳
     * @return {number} 当前时间戳
     * @method now
     * @memberof Date
     */
    //返回当前时间时间戳
    U.now = Date.now || function(){
        return new Date().getTime();
    };
    /**
     * 传入year(number)，判断是否为闰年
     * @param {number} [year] 若不传year,默认为当前年份
     * @return {boolean} 是否为闰年
     * @method isLeapYear
     * @memberof Date
     */
    U.isLeapYear = function(year){
        if(year === void 0){
            year = 1900 + new Date().getYear();
        }
        return new Date(year,2,0).getDate() === 29;
    };
    /**
     * 传入date对象，返回当月天数
     * @param {date} [date] - 指定date对象，默认为new Date()
     * @return {number} 当月天数
     * @method getDaysInMonth
     * @memberof Date
     */
    U.getDaysInMonth = function(date){
        if(date === void 0){
            date = new Date();
        }
        switch(date.getMonth()+1){
        case 1:
        case 3:
        case 5:
        case 7:
        case 8:
        case 10:
        case 12:
            return 31;
        case 2:
            return U.isLeapYear(date.getYear()) ? 29 : 28;
        default:
            return 30;
        }
    };
    /** @namespace String */
    /**
     * 字符串按word反转："my name is tom" => "ym emna si mot"
     * @param {string} s - 原字符串
     * @return {string} 反转后字符串
     * @method reverseWords
     * @memberof String
     */
    U.reverseWords = function(s){
        var res = s.split(' ');//空格分隔数组
        for(var i = 0,len = res.length;i<len;i++){
            res[i] = res[i].split('').reverse().join('');
        }
        return res.join(' ');
    };
    /**
     * 将用-,_连接的字符串转化为驼峰命名法，并返回
     * @param {string} s - 原字符串
     * @return {string} 转化结果
     * @method camelize
     * @memberof String
     */
    U.camelize = function(s){
        if (s.indexOf('-') < 0 && s.indexOf('_') < 0) {
            return s;
        }
        return s.replace(/[-_][^-_]/g,function(match){
            console.log(match);
            return match.charAt(1).toUpperCase();
        });
    };
    /**
     * 去除字符串两端空格符
     * @param {string} s - 原字符串
     * @return {string} 去除两端空白符后的字符串
     * @method trim
     * @memberof String
     */
    U.trim = function(s){
        return s.replace(/^\s\s*/,'').replace(/\s\s*$/,'');
    };
    /** @namespace Number */
    /**
     * 返回一个随机整数n,min<=n<=max，若只传一个参数，返回0~min的随机整数
     * @param {number} min - 若只传一个参数代表随机上限，下限为0，否则为随机下限
     * @param {number} [max] - 可选，随机上限
     * @return {number} min~max之间的随机整数
     * @method random
     * @memberof Number
     */
    U.random = function(min,max){
        if(max !== undefined){
            if(min === max){
                return min;
            }else{
                var del = Math.abs(max - min);
                return U.min(arguments) + Math.floor(Math.random() * (del + 1));
            }
        }else{
            return Math.floor(Math.random() * (min + 1));
        }
    };
    /**
     * 判断数字是否为奇数
     * @param {number} n - 目标数字
     * @return {boolean}
     * @method isOdd
     * @memberof Number
     */
    U.isOdd = function(n){
        return n % 2 === 1;
    };
    /**
     * 判断数字是否为偶数
     * @param {number} n - 目标数字
     * @return {boolean}
     * @method isEven
     * @memberof Number
     */
    U.isEven = function(n){
        return n % 2 === 0;
    };

}.call(this));
