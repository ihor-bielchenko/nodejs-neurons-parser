const utils = require('../utils.js');
const layers = require('./layers.json');
const neurons = require('./neurons.json');
const patterns = require('./patterns.json');

const _layers = { ...layers };
const _neurons = { ...neurons };
const _patterns = { ...patterns };

const getLayers = () => _layers;

const getLayer = (id) => _layers[id];

const setLayer = (id = '0', body = '') => (_layers[id] = {
	id,
	body,
	neurons: [],
});

const getNeurons = () => _neurons;

const getNeuron = (id) => _neurons[id];

const setNeuron = (id = '0', body = '') => (_neurons[id] = body);

const getLayerNeurons = (layerId = '0') => _layers[layerId].neurons;

const setLayerNeuron = (layerId = '0', neuronId = '0') => (_layers[layerId].neurons = Array.from(new Set([
	..._layers[layerId].neurons,
	neuronId,
])));

const getPatterns = () => _patterns;

const getPattern = (key = '') => _patterns[key];

const setPattern = (key = '', layerId = '0') => (_patterns[key] = layerId);

module.exports = {
	layers,
	neurons,
	patterns,
	getLayers,
	getLayer,
	setLayer,
	getNeurons,
	getNeuron,
	setNeuron,
	getLayerNeurons,
	setLayerNeuron,
	getPatterns,
	getPattern,
	setPattern,
};

process.on('exit', () => {
	console.log('Saving data...');
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/layers.json`, JSON.stringify(_layers));
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/neurons.json`, JSON.stringify(_neurons));
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/patterns.json`, JSON.stringify(_patterns));
	console.log('Saving successed!');
});
process.on('cleanup', () => {
	console.log('Saving data...');
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/layers.json`, JSON.stringify(_layers));
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/neurons.json`, JSON.stringify(_neurons));
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/patterns.json`, JSON.stringify(_patterns));
	console.log('Saving successed!');
});
process.on('SIGINT', () => {
	console.log('Saving data...');
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/layers.json`, JSON.stringify(_layers));
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/neurons.json`, JSON.stringify(_neurons));
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/patterns.json`, JSON.stringify(_patterns));
	console.log('Saving successed!');
});
process.on('SIGUSR1', () => {
	console.log('Saving data...');
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/layers.json`, JSON.stringify(_layers));
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/neurons.json`, JSON.stringify(_neurons));
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/patterns.json`, JSON.stringify(_patterns));
	console.log('Saving successed!');
});
process.on('SIGUSR2', () => {
	console.log('Saving data...');
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/layers.json`, JSON.stringify(_layers));
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/neurons.json`, JSON.stringify(_neurons));
	utils.setFileSync(`/home/ihor/Documents/@nest-datum-lib/parser3/src/model/patterns.json`, JSON.stringify(_patterns));
	console.log('Saving successed!');
});
process.on('uncaughtException', () => {});
