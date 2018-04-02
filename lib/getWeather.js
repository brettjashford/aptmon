const fetch = require('node-fetch');
const get = require('lodash.get');
const cToF = require('./cToF');

const openWeatherUrl = `${process.env.OPEN_WEATHER_URL}?units=metric&zip=${process.env.OPEN_WEATHER_ZIP},${process.env.OPEN_WEATHER_COUNTRY}&APPID=${process.env.OPEN_WEATHER_API_KEY}`;

module.exports = async () => {
    const resp = await fetch(openWeatherUrl);
    const json = await resp.json();
    const outsideC = get(json, 'main.temp');
    if (!outsideC) {
        throw new Error('could not load outside temperature');
    }
    return {
        outsideF: cToF(outsideC),
        outsideC
    };
};
