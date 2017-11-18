"use strict";
function atest() {
    let _this = this;

    this.x = 4;
    _this.y = this.x;

    console.log("x: "+this.x)
    console.log("y: "+_this.y)

    console.log("-------")
    this.x += 1;
    console.log("x += 1");

    console.log("-------")
    console.log("x: "+this.x)
    console.log("y: "+_this.y)


    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
}


function MyClass(option){
    let local_var = 1;

    let _this = this;

    this.this_var = 1;
    _this.uthis_var = 1;

    this.struct1 = {
        someval: 1,
        inner: {
            value: 1,
            val: 1
        }
    }

    this.struct2 = {};
    this.struct2.someval = 1;
    this.struct2.inner = {};
    this.struct2.inner.value = 1;
    this.struct2.inner.val = 1;

    _this.struct3 = {
        someval: 1,
        inner: {
            value: 1,
            val: 1
        }
    }

    _this.struct4 = {};
    _this.struct4.someval = 1;
    _this.struct4.inner = {};
    _this.struct4.inner.value = 1;
    _this.struct4.inner.val = 1;
}


MyClass.prototype.type = 'MyClass';
module.exports = MyClass;
