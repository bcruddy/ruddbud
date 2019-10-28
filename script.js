;(function () {
    const API_KEY_MAP = {
        prod: '71b46268-8dea-448f-4879-370c8a3cf01a',
        test: '65535364-7b78-4581-6914-3ef2a2e16130',
        atlas: 'ed7428ed-14fc-47b0-5c3f-5cabed7e34e8'
    };
    const HOST_MAP = {
        prod: `https://cdn.pendo.io/agent/static/${API_KEY_MAP.prod}/pendo.js`,
        test: `https://pendo-test-static.storage.googleapis.com/agent/static/${API_KEY_MAP.test}/pendo.js`,
        atlas: `https://pendo-atlas-static.storage.googleapis.com/agent/static/${API_KEY_MAP.atlas}/pendo.js`
    };
    const ENV_ROUTES = [
        ['/', 'no agent'],
        ['/atlas/', 'atlas'],
        ['/test/', 'test'],
        ['/prod/', 'prod'],
    ];

    function init (env = 'atlas') {
        const config = getConfig(env);
        console.log(config);

        redirectOnDrop(config);
        installAgent(config);
        appendEnvNav();
        appendStyles();
    }

    function getConfig (env = 'atlas') {
        const config = (window.location.search || '')
            .slice(1)
            .split('&')
            .map(kv => kv.split('='))
            .filter(([key, value]) => key === 'drop' || !!key && !!value)
            .reduce((memo, [key, value]) => ({...memo, [key]: value}), {
                env,
                visitor: 'ruddy@pendo.io',
                account: 'pendo'
            });

        return {
            ...config,
            apiKey: API_KEY_MAP[config.env],
            host: HOST_MAP[config.env]
        };
    }

    function installAgent (config) {
        (function (p, e, n, d, o) {
            var v, w, x, y, z; o = p[d] = p[d] || {}; o._q = [];
            v = ['initialize', 'identify', 'updateOptions', 'pageLoad']; for (w = 0, x = v.length; w < x; ++w)(function (m) {
                o[m] = o[m] || function () {o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));};
            })(v[w]);
            y = e.createElement(n); y.async = !0; y.src = config.host;
            z = e.getElementsByTagName(n)[0]; z.parentNode.insertBefore(y, z);
        })(window, document, 'script', 'pendo');

        pendo.initialize({
            visitor: {
                id: config.visitor,
                email: config.visitor,
                isruddy: config.visitor.includes('ruddy'),
                widgets: !!Math.round(Math.random()) ? ['foo', 'bar'] : ['baz', 'quux'],
                idlen: config.visitor.length,
                arr: parseFloat(config.visitor.length + 0.5)
            },
            account: {
                id: config.account
            },
            sanitizeUrl (url) {
                return url.replace(/localhost:3000/, 'ruddbud.pizza');
            }
        });
    }

    function redirectOnDrop (config) {
        if (!config.hasOwnProperty('drop')) {
            return;
        }

        const params = JSON.parse(JSON.stringify(config));
        delete params['pendo-designer'];
        delete params.drop;

        if (params.user === 'ruddy@pendo.io') {
            delete params.user;
        }

        if (params.account === 'pendo') {
            delete params.account;
        }

        if (params.env === 'atlas') {
            delete params.app;
        }

        const query = Object.entries(params)
            .reduce((qs, [key, value]) => {
                if (!qs) {
                    qs = '?';
                } else {
                    qs += '&';
                }

                qs += [key, value].join('=');

                return qs;
            }, '');

        window.location = window.location.origin + query;
    }

    function appendEnvNav () {
        const nav = document.createElement('nav');
        nav.classList.add('env-switcher');

        ENV_ROUTES.forEach(([route, name]) => {
            const a = document.createElement('a');
            a.setAttribute('href', route);
            a.textContent = name;

            if (window.location.pathname === route) {
                a.classList.add('active');
            }

            nav.appendChild(a);
        });

        document.body.prepend(nav);
    }

    function appendStyles () {
        const link = document.createElement('link');

        link.setAttribute('href', '/style.css');
        link.setAttribute('type', 'text/css');
        link.setAttribute('rel', 'stylesheet');

        document.head.appendChild(link);
    }

    window.ruddbud = window.ruddbudd || {
        init,
        getConfig,
        installAgent,
        redirectOnDrop,
        appendEnvNav,
        appendStyles
    };
}());
