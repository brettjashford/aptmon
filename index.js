require('dotenv').config()
const {CronJob} = require('cron');
const Hue = require('./lib/hue');
const {info, success, inspect} = require('./lib/log');

(async () => {
    const hue = new Hue();
    await hue.init();
    const temps = await hue.getTemps();
    inspect(temps);

    // const job = new CronJob({
    //     cronTime: '* * * * * *',
    //     start: false,
    //     timeZone: 'America/New_York',
    //     onTick() {
    //
    //     }
    // });
    // job.start();

})();
