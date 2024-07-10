const fs = require('fs');
const reserved = require('./reserved.js');
const {
	unicode1,
	unicode2,
} = require('./unicode.js');

const readFile = async (filePath = '') => {
	return new Promise((resolve, reject) => {
		fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
			if (err) {
				return reject(err);
			}
			return resolve(data);
		});
	});
};

const setFileSync = (filePath = '', content = '') => {
	return fs.writeFileSync(filePath, content, { encoding: 'utf8', flag: 'w' });
};

const findWordBorders = (body = '', index = 0) => {
	if (!unicode1.includes(body[index]) && !unicode2.includes(body[index])) {
		return [ -1, -1 ];
	}
	let i = index,
		ii = index,
		start = -1,
		end = -1;

	while (i >= 0) {
		if (body[i] === ' '
			|| body[i] === `\t`
			|| body[i] === `\n`) {
			break;
		}
		start = i;
		i--;
	}
	while (ii < body.length) {
		if (body[ii] === ' '
			|| body[ii] === `\t`
			|| body[ii] === `\n`) {
			break;
		}
		end = ii;
		ii++;
	}
	return [ 
		start,
		end,
	];
};

const findNextNotEmptyChar = (body = '', index = 0) => {
	let i = index;

	while (i < body.length) {
		if (body[i] !== ' '
			&& body[i] !== `\t`
			&& body[i] !== `\n`) {
			return i;
		}
		i++;
	}
	return -1;
};

const findPrevNotEmptyChar = (body = '', index = 0) => {
	let i = index;

	while (i >= 0) {
		if (body[i] !== ' '
			&& body[i] !== `\t`
			&& body[i] !== `\n`) {
			return i;
		}
		i--;
	}
	return -1;
};

const findNextChars = (body = '', index = 0, chars = []) => {
	let i = index;

	while (i < body.length) {
		if (chars.includes(body[i])) {
			return i;
		}
		i++;
	}
	return -1;
};

const findQuotesCloser = (body = '', index = 0, char) => {
	let i = index + 1,
		charProcessed = char ?? body[index];

	while (i < body.length) {
		if (body[i] === charProcessed) {
			return i;
		}
		i++;
	}
	return -1;
};

const isCharOfReserved = (body = '', index = 0) => {
	return !!reserved.find((item) => item.includes(body[index]));
};

const isPrevAndNextCharsIsUnicode1And2 = (body = '', index = 0) => {
	return (index === 0 && unicode1.includes(body[index + 1])) 
		|| (index === 0 && unicode2.includes(body[index + 1])) 
		|| (body.length - 1 === index && unicode1.includes(body[index - 1])) 
		|| (body.length - 1 === index && unicode2.includes(body[index - 1])) 
		|| (unicode1.includes(body[index - 1]) && unicode1.includes(body[index + 1])) 
		|| (unicode2.includes(body[index - 1]) && unicode2.includes(body[index + 1]));
};

const isVarName = (value = '') => {
	return /^[a-zA-Z0-9_.$]+$/.test(value) 
		&& !(Number(value[0]) >= 0
			|| Number(value[0]) < 0);
};

const isImportPath = (value = '') => {
	const valueSplit = value.split('/');

	return valueSplit
		.filter((item, i) => ((item.length > 0 || i === 0) 
			&& !item.includes(`\t`) 
			&& !item.includes(`\n`)))
		.length === valueSplit.length;
};

module.exports = {
	readFile,
	setFileSync,
	findWordBorders,
	findPrevNotEmptyChar,
	findNextNotEmptyChar,
	findQuotesCloser,
	findNextChars,
	isCharOfReserved,
	isPrevAndNextCharsIsUnicode1And2,
	isVarName,
	isImportPath,
};
