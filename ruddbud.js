;(function (global) {
    const API_KEY_MAP = {
        prod: '71b46268-8dea-448f-4879-370c8a3cf01a',
        test: '65535364-7b78-4581-6914-3ef2a2e16130',
        atlas: 'ed7428ed-14fc-47b0-5c3f-5cabed7e34e8',
        magic: '64196e33-3652-480c-7f2a-8c218729145b',
        dev: 'a2ab65c5-c4eb-4a64-45aa-4abee7aabf49'
    };
    const HOST_MAP = {
        prod: `https://cdn.pendo.io/agent/static/${API_KEY_MAP.prod}/pendo.js`,
        test: `https://pendo-test-static.storage.googleapis.com/agent/static/${API_KEY_MAP.test}/pendo.js`,
        atlas: `https://pendo-atlas-static.storage.googleapis.com/agent/static/${API_KEY_MAP.atlas}/pendo.js`,
        magic: `https://pendo-magic-static.storage.googleapis.com/agent/static/${API_KEY_MAP.magic}/pendo.js`,
        dev: `https://pendo-dev-static.storage.googleapis.com/agent/static/${API_KEY_MAP.dev}/pendo.js`
    };
    const ENV_ROUTES = [
        ['/', 'no agent'],
        ['/atlas/', 'atlas'],
        ['/dev/', 'dev'],
        ['/magic/', 'magic'],
        ['/test/', 'test'],
        ['/prod/', 'prod']
    ];

    function init (env = 'atlas') {
        const config = getConfig(env);
        console.log(config);

        redirectOnDrop(config);
        installAgent(config);
        appendStyles();
        appendEnvNav();
    }

    function getConfig (env = 'atlas') {
        const config = (window.location.search || '')
            .slice(1)
            .split('&')
            .map(kv => kv.split('='))
            .filter(([key, value]) => key === 'drop' || !!key && !!value)
            .reduce((memo, [key, value]) => ({...memo, [key]: value}), {
                env,
                ...getVisitorAndAccount()
            });
        let aid = config.account;

        if (!aid && config.visitor.includes('@')) {
            const [,domain] = config.visitor.split('@');

            [aid] = domain.split('.');
        }

        persistConfig(config.visitor, aid);

        return {
            ...config,
            account: aid || 'pendo',
            apiKey: API_KEY_MAP[config.env],
            host: HOST_MAP[config.env]
        };
    }

    function persistConfig (visitor, account) {
        window.localStorage.clear();
        window.localStorage.setItem('via', visitor);
        window.localStorage.setItem('aid', account);
    }

    function getVisitorAndAccount () {
        return {
            visitor: window.localStorage.getItem('vid') || 'ruddy@pendo.io',
            account: window.localStorage.getItem('aid')
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
            apiKey: config.apiKey,
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
        const links = ENV_ROUTES.map(([href, textContent]) => h('a', {
            href,
            textContent,
            className: window.location.pathname === href ? 'active' : ''
        }));
        const nav = h('nav', { className: 'env-switcher' }, links);

        document.body.prepend(nav);
    }

    function appendStyles () {
        const link = h('link', {
            href: '/style.css',
            type: 'text/css',
            rel: 'stylesheet'
        });

        document.head.appendChild(link);
    }

    function appendDynamicEl () {
        const id = `dynamic-id-${Math.random() * 10}`;

        const el = h('p', {id, textContent: 'i have a dynamic id!'});
        const parent = h('div', {className: 'dynamic-parent'});

        parent.appendChild(el);

        const sibling = document.querySelector('.important-links');

        sibling.insertAdjacentElement('afterend', parent);
    }

    function h (tag = 'div', attrs = {}, children = []) {
        const el = document.createElement(tag);

        Object.assign(el, attrs);

        children.forEach((child) => {
            el.appendChild(child);
        });

        return el;
    }

    function track (type, properties = {}) {
        global.pendo && global.pendo.track(type, properties);
    }

    global.ruddbud = global.ruddbudd || {
        init,
        getConfig,
        installAgent,
        redirectOnDrop,
        appendEnvNav,
        appendStyles,
        appendDynamicEl,
        track,
        getVisitorAndAccount,
        persistConfig
    };
}(window));
