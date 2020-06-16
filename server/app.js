const uuid = require('uuid/v4');
const bodyparser = require('body-parser');
const app = require('express')();

app.use(bodyparser.json());

app.get('/api/samesite/:value?', (req, res) => {
    console.log('[ruddbud server/app.js] /api/samesite');

    const sameSite = req.params.value || 'None';
    const cookie = [
        'ruddbud.sess.uuid',
        uuid(),
        { sameSite, httpOnly: true, secure: true }
    ];

    res.cookie(...cookie).json({ cookie });
});

module.exports = app;
