const huejay = require('huejay');
const {info, success, inspect} = require('./log');
const get = require('lodash.get');
const pick = require('lodash.pick');
const cToF = require('./cToF');

module.exports = class Hue {
    constructor() {
        this.config = {
            port: process.env.HUE_PORT,
            username: process.env.HUE_USER,
            timeout:  process.env.HUE_TIMEOUT
        };
        info(`config:`);
        inspect(this.config);
        this.init = this.init.bind(this);
        this.getSensors = this.getSensors.bind(this);
        this.getTemps = this.getTemps.bind(this);
    }

    async init() {
        info('searching for bridge...');
        const bridges = await huejay.discover();
        if (!bridges || !bridges.length) {
            throw new Error('no hue bridges found');
        }
        this.bridge = bridges[0];
        success(`bridge found (ip: ${this.bridge.ip})`)
        this.client = new huejay.Client({
            host: this.bridge.ip,
            ...this.config
        });
    }

    async getSensors() {
        const sensors = await this.client.sensors.getAll();
        const tempSensors = sensors.filter(sensor =>
            get(sensor, 'attributes.attributes.type') === 'ZLLTemperature');
        if (!tempSensors.length) {
            throw new Error('no temperature sensors found');
        }
        return tempSensors;
    }

    async getTemps() {
        const sensors = await this.getSensors();
        const temps = [];
        sensors.forEach(sensor => {
            const attributes = get(sensor, 'attributes.attributes') || {};
            const state = get(sensor, 'state.attributes.attributes') || {};
            const temperatureC = state.temperature / 100;
            temps.push({
                ...pick(attributes, 'name', 'uniqueid'),
                sensorId: attributes.id,
                lastupdated: state.lastupdated,
                temperatureF: cToF(temperatureC),
                temperatureC
            })
        });
        return temps;
    }
}
