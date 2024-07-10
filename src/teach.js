const chalk = require('chalk');
const inquirer = require('inquirer');
const model = require('./model');
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
	let i = 0;

	while (i < fileContent.length) {
		await viewCursor(fileContent, i);
		await calc(fileContent, i, '0', [], ask);
		i++;
	}
	return;
};

const viewCursor = async (body = '', index = 0) => {
	const startIndexPrepare = (index - 255);
	const startIndex = (startIndexPrepare >= 0)
		? startIndexPrepare
		: 0;
	const endIndex = index + 255;

	console.log(body
		.split('')
		.map((char, i) => {
			return (index === i)
				? ((char === ` `
					|| char === `\t`
					|| char === `\n`)
					? chalk.bgRed(chalk.bold(char))
					: chalk.red(chalk.bold(char)))
				: chalk.grey(char);
		})
		.slice(startIndex, endIndex)
		.join(''));
	console.log('Index:', index);
};

const ask = async (body = '', index = 0, colleactor = [], _buffer = {}, _result = {}) => {
	const prompData = await inquirer.prompt([{
		type: 'list',
		name: 'result',
		message: `Actions:`,
		choices: [ 
			'Approve result and go to next char', 
			'Approve result and continue logic',
			'Calculated result is wrong so to create new', 
		],
	}]);

	switch (prompData.result) {
		case 'Approve result and continue logic':
			return await askContinueLogic(body, index, colleactor, _buffer, _result);
		case 'Calculated result is wrong so to create new':
			return await askContinueLogic(body, index, colleactor.slice(0, -1), _buffer, _result);
	}
	process.stdout.write('\x1Bc');

	if (body.length - 1 <= index) {
		console.log('Result:');
		console.log(_result);
	}
	return;
};

const askContinueLogic = async (body = '', index = 0, colleactor = [], _buffer = {}, _result = {}) => {
	const promptData = await inquirer.prompt([{
		type: 'input',
		name: 'result',
		message: `Layer body:`,
	}]);
	const layers = model.getLayers();
	const layerKeys = Object.keys(layers);
	const fromLayerId = colleactor[colleactor.length - 1].layerId;
	let nextLayerId = layerKeys.find((layerId) => (layers[layerId].body === promptData.result));

	if (!nextLayerId) {
		model.setLayer((nextLayerId = String(layerKeys.length)), promptData.result)
	}
	const prompData = await inquirer.prompt([{
		type: 'list',
		name: 'result',
		message: `Add neurons to current layer ("${fromLayerId}" -> "${nextLayerId}")?`,
		choices: [
			'Yes',
			'No',
		],
	}]);

	if (prompData.result === 'No') {
		process.stdout.write('\x1Bc');

		if (body.length - 1 <= index) {
			console.log('Result:');
			console.log(_result);
		}
		return await savePattern(body, index, colleactor, fromLayerId, nextLayerId, _buffer, _result);
	}
	await askAddNeurons(body, index, colleactor, fromLayerId, nextLayerId, _buffer, _result);
	
	return await savePattern(body, index, colleactor, fromLayerId, nextLayerId, _buffer, _result);
};

const askAddNeurons = async (body = '', index = 0, colleactor = [], fromLayerId = '', nextLayerId = '', _buffer = {}, _result = {}) => {
	const promptData1 = await inquirer.prompt([{
		type: 'input',
		name: 'result',
		message: `Neuron body:`,
	}]);
	const neurons = model.getNeurons();
	const neuronKeys = Object.keys(neurons);
	let neuronId = neuronKeys.find((neuronId) => (neurons[neuronId] === promptData1.result));

	if (!neuronId) {
		model.setNeuron((neuronId = String(neuronKeys.length)), promptData1.result);
	}
	model.setLayerNeuron(fromLayerId, neuronId);

	const promptData2 = await inquirer.prompt([{
		type: 'list',
		name: 'result',
		message: `Add one more neuron to current layer ("${fromLayerId}" -> "${nextLayerId}")?:`,
		choices: [
			'Yes',
			'No',
		],
	}]);

	if (promptData2.result === 'No') {
		process.stdout.write('\x1Bc');

		if (body.length - 1 <= index) {
			console.log('Result:');
			console.log(_result);
		}
		return;
	}
	return await askAddNeurons(body, index, colleactor, fromLayerId, nextLayerId, _buffer, _result);
};

const savePattern = async (body = '', index = 0, colleactor = [], fromLayerId = '', nextLayerId = '', _buffer = {}, _result = {}) => {
	const neuronIds = model.getLayerNeurons(fromLayerId);
	let i = 0,
		template = [];

	while (i < neuronIds.length) {
		try {
			if (await eval(model.getNeuron(neuronIds[i]))) {
				template.push(neuronIds[i]);
			}
		}
		catch (err) {
		}
		i++;
	}
	process.stdout.write('\x1Bc');

	if (body.length - 1 <= index) {
		console.log('Result:');
		console.log(_result);
	}
	return model.setPattern(`${fromLayerId}:${template.join('-')}`, nextLayerId);
};
