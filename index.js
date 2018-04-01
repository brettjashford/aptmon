const {CronJob} = require('cron');


const job = new CronJob({
    cronTime: '* * * * * *',
    start: false,
    timeZone: 'America/New_York',
    onTick() {
        
    }
});

job.start();
