"use strict";

var myclass = require('./thing.js')

myclass = new myclass({});

console.log("this.this_var = 1"+":"+myclass.this_var);
console.log("_this.uthis_var = 1"+":"+myclass.uthis_var);

console.log("struct1.someval = 1"+":"+myclass.struct1.someval);
console.log("struct1.inner.value = 1"+":"+myclass.struct1.inner.value);
console.log("struct1.inner.val = 1"+":"+myclass.struct1.inner.val);

console.log("struct2.someval = 1"+":"+myclass.struct2.someval);
console.log("struct2.inner.value = 1"+":"+myclass.struct2.inner.value);
console.log("struct2.inner.val = 1"+":"+myclass.struct2.inner.val);

console.log("struct3.someval = 1"+":"+myclass.struct3.someval);
console.log("struct3.value = 1"+":"+myclass.struct3.inner.value);
console.log("struct3.inner.val = 1"+":"+myclass.struct3.inner.val);

console.log("struct4.someval = 1"+":"+myclass.struct4.someval);
console.log("struct4.inner.value = 1"+":"+myclass.struct4.inner.value);
console.log("struct4.inner.val = 1"+":"+myclass.struct4.inner.val);
