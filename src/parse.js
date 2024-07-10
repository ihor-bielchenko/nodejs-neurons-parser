const calc = require('./calc.js');
const utils = require('./utils.js');
const reserved = require('./reserved.js');
const {
	unicode0,
	unicode1,
	unicode2,
	unicode3,
} = require('./unicode.js');

const _utils = utils;
const _unicode0 = [ ...unicode0 ];
const _unicode1 = [ ...unicode1 ];
const _unicode2 = [ ...unicode2 ];
const _unicode3 = [ ...unicode3 ];
const _reserved = [ ...reserved ];

module.exports = async (filePath = '') => {
	const fileContent = await utils.readFile(filePath);
	let i = 0,
		result;

	while (i < fileContent.length) {
		result = await calc(fileContent, i);
		i++;
	}
	delete result.bracketOpened;
	delete result.bracketArrOpened;
	delete result.bracketObjOpened;
	delete result.quotesOpened;
	delete result.bracketClosed;
	delete result.bracketArrClosed;
	delete result.bracketObjClosed;
	delete result.quotesClosed;
	delete result.currentExpression;

	console.log(result);

	return result;
};
