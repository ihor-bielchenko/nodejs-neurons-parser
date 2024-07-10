const chalk = require('chalk');
const model = require('./model');
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
let _buffer = {},
	_result = {
		bracketOpened: 0,
		bracketArrOpened: 0,
		bracketObjOpened: 0,
		quotesOpened: 0,
		bracketClosed: 0,
		bracketArrClosed: 0,
		bracketObjClosed: 0,
		quotesClosed: 0,
	};

const calc = async (body = '', index = 0, layerId = '0', colleactor = [], callback) => {
	const layer = model.getLayer(layerId);
	let i = 0,
		template = [];

	try {
		await eval(layer.body);
	}
	catch (err) {
		console.log('ERROR0', layerId, layer, err);
	}
	while (i < layer.neurons.length) {
		const neuronId = layer.neurons[i];
		const neuronBody = model.getNeuron(neuronId);

		try {
			if (await eval(neuronBody)) {
				template.push(neuronId);
			}
		}
		catch (err) {
			console.log('ERROR1', layerId, layer, neuronId, neuronBody, err);
		}
		i++;
	}
	const templateStr = `${layerId}:${template.join('-')}`;
	const nextLayerId = model.getPattern(templateStr);

	colleactor.push({ layerId, template });

	if (nextLayerId) {
		if (typeof callback === 'function') {
			console.log(chalk.blue(chalk.bold(`Now layer id:`)), layerId);
			console.log(chalk.blue(chalk.bold(`Next layer id:`)), nextLayerId);
			console.log(chalk.blue(chalk.bold(`Found pattern:`)), templateStr);

			if (layer.body) {
				console.log(chalk.blue(chalk.bold(`Layer body:`)), layer.body);
			}
			console.log(chalk.blue(chalk.bold(`Buffer:`)));
			console.log({ ..._buffer });
			console.log(`\t`, `|`);
			console.log(`\t`, `|`);
			console.log(`\t`, `▼`);
		}
		return await calc(body, index, nextLayerId, colleactor, callback);
	}
	if (typeof callback === 'function') {
		const buffer = { ..._buffer };

		console.log(chalk.blue(chalk.bold(`Result layer id:`)), layerId);
		console.log(chalk.blue(chalk.bold(`Found pattern:`)), templateStr);

		if (layer.body) {
			console.log(chalk.blue(chalk.bold(`Layer body:`)), layer.body);
		}
		console.log(chalk.blue(chalk.bold(`Buffer:`)));
		console.log(buffer);
		console.log(`\t`, `|`);
		console.log(`\t`, `|`);
		console.log(`\t`, `▼`);

		_buffer = {};

		return await callback(body, index, colleactor, buffer, { ..._result });
	}
	_buffer = {};

	return { ..._result };
};

module.exports = calc;
