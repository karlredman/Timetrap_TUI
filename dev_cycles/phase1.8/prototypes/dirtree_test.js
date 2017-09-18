var util = require('util'),
	DirTree = require('../dirtree2.js'),
	Configuration = require('../config.js');


function main(argv, callback) {
    let config = new Configuration();
    config.fetch();


    let dirtree = new DirTree(config);
    let proj_tree = dirtree.fetch(config.timetrap_config.tui_projects_template_path);

    //console.log(JSON.stringify(proj_tree, null, 4));
	console.log(util.inspect(proj_tree, false, null));
}

// Process loop
if (!module.parent) {
    process.title = 'testapp';
    main(process.argv.slice(), function(err) {
        if (err) throw err;
        return process.exit(0);
    });
} else {
    module.exports = main;
}
