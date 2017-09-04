var dirTree = require('directory-tree'),
    util = require('util');

tree = dirTree('/home/karl/timetrap_projects', {exclude: /SKIP_THIS_DIR.*|skip.*|.*.timetrap-sheet/});

console.log(util.inspect(tree, false, null));
console.log(JSON.stringify(tree, null, 4));
