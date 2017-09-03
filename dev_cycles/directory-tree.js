var PATH = require('path'),
    util = require('util'),
    dirTree = require('directory-tree');

const tree = dirTree('/home/karl/timetrap_projects', {exclude: /\*SKIP\*/});

console.log(util.inspect(tree));
