const teach = require('./teach.js');
const parse = require('./parse.js');

const command = process.argv[2].trim();
const filePath = process.argv[3].trim();

if (filePath) {
	if (command === 'teach') {
		teach(filePath);
	}
	else if (command === 'parse') {
		parse(filePath);
	}
}
