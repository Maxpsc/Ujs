describe("Type judgement",function(){
    it("U.getType",function(){
        expect(U.getType(1)).toEqual('number');
        expect(U.getType('1')).toEqual('string');
        expect(U.getType([1,2,3])).toEqual('array');
    });
    it("U.isFunction",function(){
        expect(U.isFunction(function(){})).toBeTruthy();
        expect(U.isFunction({})).toBeFalsy();
    });
    it("U.isUndefined",function(){
        var a;
        expect(U.isUndefined(a)).toBeTruthy();
    });
    it("U.isObject",function(){
        expect(U.isObject({})).toBeTruthy();
        expect(U.isObject({id:1})).toBeTruthy();
        expect(U.isObject(function(){})).toBeTruthy();
    });
    it("U.isElement",function(){
        expect(U.isElement(document.createElement('div'))).toBeTruthy();
    });

    it("U.isNaN",function(){
        expect(U.isNaN(1*'a')).toBeTruthy();
        expect(U.isNaN(1*'1')).toBeFalsy();
    });
    it("U.isArray",function(){
        expect(U.isArray([1,2,3])).toBeTruthy();
    });
    it("U.isArrayLike",function(){
        var arr1 = (function(){
            return arguments;
        })(1,'two',{'id':3});

        var arr2 = {length:2};
        expect(U.isArrayLike(arr1)).toBeTruthy();
        expect(U.isArrayLike(arr2)).toBeTruthy();
    });
});

describe("Collection functions",function(){
    beforeEach(function(){
        //example collection
        this.memList = [
            {
                "id":1,
                'name':'tom',
                'age':10
            },
            {
                'id':2,
                'name':'peter',
                'age':22
            },
            {
                'id':3,
                'name':'lilei',
                'age':16
            }];
        this.arr = [1,2,3,4,5];
    });
    it("U.each",function(){
        var allAge = 0;
        U.each(this.memList,function(value,index){
            value.name += value.id;
            allAge += value.age;
        });
        var averAge = allAge / this.memList.length;
        var info = [];
        U.each(this.memList[0],function(value,key){
            info.push(value);
        });
        expect(this.memList).toEqual([
            {
                "id":1,
                'name':'tom1',
                'age':10
            },
            {
                'id':2,
                'name':'peter2',
                'age':22
            },
            {
                'id':3,
                'name':'lilei3',
                'age':16
            }]);
        expect(averAge).toEqual(16);
        expect(info).toEqual([1,'tom1',10]);
    });

    it("U.map",function(){
        expect(U.map(this.arr,function(value){
            return value * value;
        })).toEqual([1,4,9,16,25]);

        expect(U.map(this.memList[0],function(value,key){
            return value + "";
        })).toEqual({
            id:"1",
            name:'tom',
            age:"10"
        });
    });

    it("U.reduce",function(){
        expect(U.reduce(this.arr,function(memo,value){
            return memo + value;
        },0)).toEqual(15);
    });
    it("U.find",function(){
        expect(U.find(this.memList,function(value){
            return value.age > 12;
        })).toEqual({
            id:2,
            name:'peter',
            age:22
        });
    });
    it("U.filter",function(){
        expect(U.filter(this.memList,function(value){
            return value.age > 12;
        })).toEqual([
            {
                id:2,
                name:'peter',
                age:22
            },
            {
                id:3,
                name:'lilei',
                age:16
            }
        ]);
    });
    it("U.reject",function(){
        expect(U.reject(this.memList,function(value){
            return value.age > 12;
        })).toEqual([
            {
                id:1,
                name:'tom',
                age:10
            }
        ]);
    });

    it("U.where",function(){
        this.memList.push({
            id:4,
            name:"hanmeimei",
            age:16
        });
        expect(U.where(this.memList,{age:16})).toEqual([
            {
                id:3,
                name:'lilei',
                age:16
            },
            {
                id:4,
                name:"hanmeimei",
                age:16
            }
        ]);
    });
    it("U.every",function(){
        expect(U.every(this.arr,function(value){return value > 0;})).toBeTruthy();
        expect(U.every(this.arr,function(value){return value > 1;})).toBeFalsy();
    });
    it("U.some",function(){
        expect(U.some(this.arr,function(value){return value > 4;})).toBeTruthy();
        expect(U.some(this.arr,function(value){return value > 5;})).toBeFalsy();
    });
    it("U.contains",function(){
        expect(U.contains(this.arr,3)).toBeTruthy();
        expect(U.contains(this.arr,0)).toBeFalsy();
        expect(U.contains(this.memList[0],'tom')).toBeTruthy();
        expect(U.contains(this.memList[0],'peter')).toBeFalsy();
    });
    it("U.max",function(){
        expect(U.max(this.arr)).toEqual(5);
        expect(U.max(this.arr,function(value){return -value;})).toEqual(-1);
    });
    it("U.min",function(){
        expect(U.min(this.arr)).toEqual(1);
        expect(U.min(this.arr,function(value){return -value;})).toEqual(-5);
    });
    it("U.sortBy",function(){
        expect(U.sortBy([2,1,5,3,4])).toEqual([1,2,3,4,5]);
    });
    it("U.groupBy",function(){
        function getChild(value){
            return value.age > 18 ? 'adult' : 'child';
        }
        expect(U.groupBy(this.memList,getChild)).toEqual({
            'adult':[
            {
                'id':2,
                'name':'peter',
                'age':22
            }],
            'child':[{
                "id":1,
                'name':'tom',
                'age':10
            },
            {
                'id':3,
                'name':'lilei',
                'age':16
            }]
        });
    });
    it("U.shuffle",function(){
        var arr = U.shuffle(this.arr);
        expect(U.contains(arr,1)).toBeTruthy();
        expect(U.contains(arr,2)).toBeTruthy();
        expect(U.contains(arr,3)).toBeTruthy();
        expect(U.contains(arr,4)).toBeTruthy();
        expect(U.contains(arr,5)).toBeTruthy();
    });
    it("U.sample",function(){
        console.log(U.sample(this.arr,3));
        expect(U.sample(this.arr,3).length).toBe(3);
    });
    it("U.size",function(){
        expect(U.size(this.memList)).toBe(3);
        expect(U.size(this.memList[0])).toBe(3);
        expect(U.size(this.arr)).toBe(5);
    });
    it("U.partition",function(){
        function isOdd(n){
            return n % 2 !== 0;
        }
        expect(U.partition(this.arr,isOdd)).toEqual([[1,3,5],[2,4]]);
    });
    it("U.pluck",function(){
        expect(U.pluck(this.memList,'id')).toEqual([1,2,3]);
        expect(U.pluck(this.memList,'name')).toEqual(['tom','peter','lilei']);
    });
});

describe("Array functions",function(){
    beforeEach(function(){
        //example array
        this.arr1 = [1,2,3,4,5];
    });
    it("U.head",function(){
        expect(U.head(this.arr1)).toEqual([1]);
        expect(U.head(this.arr1,3)).toEqual([1,2,3]);
    });
    it("U.tail",function(){
        expect(U.tail(this.arr1)).toEqual([5]);
        expect(U.tail(this.arr1,3)).toEqual([5,4,3]);
    });
    it("U.reverse", function(){
        expect(U.reverse(this.arr1)).toEqual([5,4,3,2,1]);
    });
    it("U.fill",function(){
        expect(U.fill(this.arr1,0)).toEqual(new Array(5).fill(0));
    });
    it("U.compact",function(){
        var arr = [0,1,undefined,3,null,5,"",7];
        expect(U.compact(arr)).toEqual([1,3,5,7]);
    });
    it("U.flatten",function(){
        var arr = [1,[2,3],[4,[5,[6,7]],8],9];
        expect(U.flatten(arr)).toEqual([1,2,3,4,5,6,7,8,9]);
    });
    it("U.without",function(){
        expect(U.without(this.arr1,3)).toEqual([1,2,4,5]);
    });
    it("U.union",function(){
        expect(U.union([1,2],[2,3],[2,4])).toEqual([1,3,2,4]);
    });
    it("U.intersection",function(){
        expect(U.intersection([1,2],[2,3],[2,4])).toEqual([2]);
    });
    it("U.difference",function(){
        expect(U.difference(this.arr1,[3,4],[5,6])).toEqual([1,2]);
    });
    it("U.unique",function(){
        expect(U.unique([1,2,2,3,4,4,5])).toEqual([1,2,3,4,5]);
    });
    it("U.zip",function(){
        expect(U.zip(['tom','ben'],[20,30],[true,false])).toEqual([['tom',20,true],['ben',30,false]]);
    });
    it("U.unzip",function(){
        expect(U.unzip([['tom','ben'],[20,30],[true,false]])).toEqual([['tom',20,true],['ben',30,false]]);
    });
    it("U.object",function(){
        expect(U.object(['id','name','age'],[1,'tom',20])).toEqual({'id':1,'name':'tom','age':20});
        expect(U.object([['id',1],['name','tom'],['age',20]])).toEqual({'id':1,'name':'tom','age':20});
    });
    it("U.range",function(){
        expect(U.range(9)).toEqual([0,1,2,3,4,5,6,7,8,9]);
        expect(U.range(2,5)).toEqual([2,3,4,5]);
        expect(U.range(10,50,10)).toEqual([10,20,30,40,50]);
        expect(U.range(0,-10,-3)).toEqual([0,-3,-6,-9]);
    });
});

describe("Function functions",function(){
    it("U.bind",function(){
        function func(){
            return this.name + arguments[0] + arguments[1] + arguments[2];
        }
        var context = {
            'name':'context'
        };
        var funcB = U.bind(func,context,1,2);
        expect(funcB(3)).toEqual('context123');
    });

    it("U.delay",function(){
        var count = 0;
        function func(){
            count += 1;
        }
        jasmine.clock().install();
        U.delay(func,1000);
        // funcD
        expect(count).toEqual(0);
        jasmine.clock().tick(1001);
        expect(count).toEqual(1);
        jasmine.clock().uninstall();
    });

    it("U.partial",function(){
        function func(place,name){
            return "Welcome to "+ place +", "+ name + "!";
        }
        var test = U.partial(func, '_', 'my friend');
        expect(test('Beijing')).toEqual('Welcome to Beijing, my friend!');
    });
    it("U.once",function(){
        var count = 0;
        function addOne(){
            count += 1;
            return count;
        }
        var test = U.once(addOne);
        expect(test()).toEqual(1);
        expect(test()).toEqual(1);
        expect(test()).toEqual(1);
        expect(count).toEqual(1);
    });
    it("U.before",function(){
        var count = 0;
        function addOne(){
            count += 1;
            return count;
        }
        var test = U.before(addOne,2);
        expect(test()).toEqual(1);
        expect(count).toEqual(1);
        expect(test()).toEqual(2);
        expect(count).toEqual(2);
        expect(test()).toEqual(2);
        expect(count).toEqual(2);
    });

    it("U.after",function(){
        function func(){
            return 'finally';
        }
        var test = U.after(func,2);
        expect(test()).not.toBeDefined();
        expect(test()).not.toBeDefined();
        expect(test()).toEqual('finally');
    });

    it("U.wrap",function(){
        function hello(name){
            return "hello: "+ name;
        }
        test = U.wrap(hello, function(fn){
            return "before, " + fn('U') + ", after";
        });
        expect(test()).toEqual("before, hello: U, after");
    });

    it("U.compose",function(){
        var add = function(a,b){
            return a + b;
        };
        var multiTen = function(c){
            return c * 10;
        };
        var show = function(n){
            return "Final result is " + n;
        };
        var composeFunc = U.compose(add, multiTen, show);
        expect(composeFunc(1,2)).toEqual("Final result is 30");
    });

});

describe("Object functions",function(){
    beforeEach(function(){
        this.obj = {
            id:1,
            name:'tom',
            age:20
        };
    });
    it("U.keys",function(){
        expect(U.keys(this.obj)).toEqual(['id','name','age']);
        expect(U.keys(1)).toEqual([]);
    });
    it("U.values",function(){
        expect(U.values(this.obj)).toEqual([1,'tom',20]);
    });
    it("U.functions",function(){
        this.obj.say = function(){
            console.log('hi');
        };
        expect(U.functions(this.obj)).toEqual(['say']);
    });
    it("U.extend",function(){
        var target = {
            id:1,
            name:'tom',
            age:18,
            sex:'male'
        };
        expect(U.extend(this.obj,{age:18,sex:'male'})).toEqual(target);
        expect(this.obj).toEqual(target);
    });
    it("U.pick",function(){
        function getKey(value,key){
            return key.length >= 3 ? true : false;
        }
        expect(U.pick(this.obj)).toEqual(this.obj);
        expect(U.pick(this.obj,['id','name'])).toEqual({id:1,name:'tom'});
        expect(U.pick(this.obj,getKey)).toEqual({age:20,name:'tom'});
    });
    it("U.omit",function(){
        function getKey(value,key){
            return key.length >= 3 ? true : false;
        }
        expect(U.omit(this.obj)).toEqual({});
        expect(U.omit(this.obj,['id','name'])).toEqual({age:20});
        expect(U.omit(this.obj,getKey)).toEqual({id:1});
    });
    it("U.clone",function(){
        expect(U.clone(1)).toBe(1);
        expect(U.clone('a')).toBe('a');
        expect(U.clone(true)).toBeTruthy();
        expect(U.clone(this.obj)).toEqual({
            id:1,
            name:'tom',
            age:20
        });
        expect(U.clone([1,2,3])).toEqual([1,2,3]);

    });
    it("U.matcher" , function(){
        var matcher = U.matcher({age:20});
        expect(matcher(this.obj)).toBeTruthy();
        expect(matcher({age:18})).toBeFalsy();
        expect(matcher(18)).toBeFalsy();
    });
    it("U.isMatch",function(){
        expect(U.isMatch(this.obj,{age:20})).toBeTruthy();
        expect(U.isMatch(this.obj,{id:2})).toBeFalsy();
        expect(U.isMatch(this.obj,{country:'CHINA'})).toBeFalsy();
    });
    it("U.isEqual",function(){
        var nObj = U.clone(this.obj);
        expect(U.isEqual(this.obj,nObj)).toBeTruthy();
    });
    it("U.isEmpty",function(){
        expect(U.isEmpty("")).toBeTruthy();
        expect(U.isEmpty([])).toBeTruthy();
        expect(U.isEmpty({})).toBeTruthy();
        expect(U.isEmpty(this.obj)).toBeFalsy();
    });
});

describe("Date functions",function(){
    it("U.now",function(){
        expect(U.now()).toEqual(new Date().getTime());
    });
    it("U.isLeapYear",function(){
        expect(U.isLeapYear(2016)).toBeTruthy();
        expect(U.isLeapYear(2017)).toBeFalsy();
    });
    it("U.getDaysInMonth",function(){
        //leap year
        expect(U.getDaysInMonth(new Date(2016,1,1))).toEqual(29);

        expect(U.getDaysInMonth(new Date(2017,0,1))).toEqual(31);
        expect(U.getDaysInMonth(new Date(2017,1,1))).toEqual(28);
        expect(U.getDaysInMonth(new Date(2017,2,1))).toEqual(31);
        expect(U.getDaysInMonth(new Date(2017,3,1))).toEqual(30);
        expect(U.getDaysInMonth(new Date(2017,4,1))).toEqual(31);
        expect(U.getDaysInMonth(new Date(2017,5,1))).toEqual(30);
        expect(U.getDaysInMonth(new Date(2017,6,1))).toEqual(31);
        expect(U.getDaysInMonth(new Date(2017,7,1))).toEqual(31);
        expect(U.getDaysInMonth(new Date(2017,8,1))).toEqual(30);
        expect(U.getDaysInMonth(new Date(2017,9,1))).toEqual(31);
        expect(U.getDaysInMonth(new Date(2017,10,1))).toEqual(30);
        expect(U.getDaysInMonth(new Date(2017,11,1))).toEqual(31);
    });
});

describe("String functions",function(){
    it("U.reverseWords",function(){
        expect(U.reverseWords("Welcome to Beijing")).toEqual("emocleW ot gnijieB");
    });
    it("U.camelize",function(){
        expect(U.camelize("string-function")).toEqual("stringFunction");
        expect(U.camelize("string_function")).toEqual("stringFunction");
        expect(U.camelize("stringfunction")).toEqual("stringfunction");
    });
    it("U.trim",function(){
        expect(U.trim("   string    ")).toEqual("string");
    });
});

describe("Number functions",function(){
    it("U.random",function(){
        var a = U.random(5);
        var b = U.random(10,5);
        var c = U.random(-5);
        var d = U.random(1,1);
        expect(a).toBeGreaterThanOrEqual(0);
        expect(a).toBeLessThanOrEqual(5);
        expect(b).toBeGreaterThanOrEqual(5);
        expect(b).toBeLessThanOrEqual(10);
        expect(c).toBeGreaterThanOrEqual(-5);
        expect(c).toBeLessThanOrEqual(0);
        expect(d).toEqual(1);
    });
    it("U.isOdd",function(){
        expect(U.isOdd(1)).toBeTruthy();
        expect(U.isOdd(2)).toBeFalsy();
    });
    it("U.isEven",function(){
        expect(U.isEven(1)).toBeFalsy();
        expect(U.isEven(2)).toBeTruthy();
    });
});
