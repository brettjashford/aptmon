var fetch = require('node-fetch');

const aptMonServerUrl = `${process.env.APTMON_SERVER_HOST}:${process.env.APTMON_SERVER_PORT}/temperature`;

module.exports = async temps => {
    const resp = await fetch(aptMonServerUrl, {
        method: 'POST',
        body: JSON.stringify(temps),
        headers: { 'Content-Type': 'application/json' }
    });
    return await resp.json();
};
