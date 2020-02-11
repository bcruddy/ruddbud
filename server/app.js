const uuid = require('uuid/v4');
const bodyparser = require('body-parser');
const app = require('express')();

app.use(bodyparser.json());

app.get('/api/samesite', (req, res) => {
    console.log('[ruddbud server/app.js] /api/samesite');

    const cookie = {
        name: 'ruddbud.sess.uuid',
        value: uuid(),
        options: { httpOnly: true, sameSite: 'None', secure: true }
    };

    res.cookie(cookie.name, cookie.value, cookie.options).json({ ok: true, cookie });
});

module.exports = app;
