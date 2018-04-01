require('dotenv').config()
const {CronJob} = require('cron');
const Hue = require('./lib/hue');
const {info, success, inspect, error} = require('./lib/log');

(async () => {
    const hue = new Hue();
    try {
        await hue.init();
    } catch (e) {
        error(`initialization error: ${e.message}`)
    }

    const onTick = async () => {
        try {
            const temps = await hue.getTemps();
            inspect(temps);
        } catch (e) {
            error(`onTick error: ${e.message}`)
        }
    };
    onTick();

    // const cronTime = process.env.CRON_TIME;
    // info(`starting cron: ${cronTime}`);
    // new CronJob({
    //     start: true,
    //     timeZone: 'America/New_York',
    //     cronTime,
    //     onTick
    // });
})();
