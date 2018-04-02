require('dotenv').config()
const {CronJob} = require('cron');
const Hue = require('./lib/hue');
const {info, success, inspect, error} = require('./lib/log');
const saveTemps = require('./lib/saveTemps');
const getWeather = require('./lib/getWeather');

(async () => {
    const hue = new Hue();
    try {
        await hue.init();
    } catch (e) {
        error(`initialization error: ${e.message}`)
    }

    const onTick = async () => {
        try {
            info('new tick');
            const [insideTemps, weather] = await Promise.all([hue.getTemps(), getWeather()]);
            const aptMonData = insideTemps.map(insideTemp => ({
                ...insideTemp,
                ...weather
            }));
            info('saving aptMonData to server');
            inspect(aptMonData);
            saveTemps(aptMonData);
            success('tick complete');
        } catch (e) {
            error(`onTick error: ${e.message}`)
            error(e.stack);
        }
    };

    const cronTime = process.env.CRON_TIME;
    info(`starting cron: ${cronTime}`);
    new CronJob({
        start: true,
        timeZone: 'America/New_York',
        cronTime,
        onTick
    });
})();
