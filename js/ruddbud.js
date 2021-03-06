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

    function init (env = 'dev', settings = {}) {
        const config = getConfig(env);
        // console.log(config);

        installAgent(config, settings.skipInitialize);
        appendFonts();
        appendStyles();

        if (!settings.hideNav) {
            appendEnvNav();
        }
    }

    function getConfig (env) {
        const config = (window.location.search || '')
            .slice(1)
            .split('&')
            .map(kv => kv.split('='))
            .filter(([key, value]) => key === 'drop' || !!key && !!value)
            .reduce((memo, [key, value]) => ({...memo, [key]: value}), {
                env,
                ...getPersistedConfig()
            });
        let aid = config.account;

        if (!aid && config.visitor.includes('@')) {
            const [,domain] = config.visitor.split('@');

            [aid] = domain.split('.');
        }

        persistConfig(config.visitor, aid, config.servername);

        return {
            ...config,
            account: aid || 'pendo',
            apiKey: API_KEY_MAP[config.env],
            host: HOST_MAP[config.env]
        };
    }

    function persistConfig (visitor, account, servername) {
        window.localStorage.setItem('log-enabled', false);
        window.localStorage.setItem('vid', visitor);
        window.localStorage.setItem('aid', account);
        window.localStorage.setItem('sname', servername)
    }

    function getPersistedConfig () {
        return {
            account: window.localStorage.getItem('aid') || 'ruddbud',
            servername: window.localStorage.getItem('sname') || 'ruddbud.dev',
            visitor: window.localStorage.getItem('vid') || 'user@ruddbud.dev',
        };
    }

    function installAgent (config, skipInitialize) {
        (function (p, e, n, d, o) {
            var v, w, x, y, z; o = p[d] = p[d] || {}; o._q = [];
            v = ['initialize', 'identify', 'updateOptions', 'pageLoad']; for (w = 0, x = v.length; w < x; ++w)(function (m) {
                o[m] = o[m] || function () {o._q[m === v[0] ? 'unshift' : 'push']([m].concat([].slice.call(arguments, 0)));};
            })(v[w]);
            y = e.createElement(n); y.async = !0; y.src = config.host;
            z = e.getElementsByTagName(n)[0]; z.parentNode.insertBefore(y, z);
        })(window, document, 'script', 'pendo');

        if (skipInitialize) {
            console.log(`pendo installed but not initialized in ${window.location.href}`);

            return;
        }

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
            sanitizeUrl: getSanitizeUrl(),
            annotateUrl () {
                return { annotated: 1 }
            }
        });
    }

    function getSanitizeUrl () {
        const urlCache = new Map();

        return function sanitizeUrl (input) {
            if (urlCache.has(input)) {
                return urlCache.get(input);
            }

            const { host } = new window.URL(input);
            const { servername } = getPersistedConfig();

            const output = input.replace(new RegExp(host), servername);

            urlCache.set(input, output);

            // console.log('sanitzeUrl', { input, output });

            return output;
        }
    }

    function appendEnvNav () {
        const links = ENV_ROUTES.map(([href, textContent]) => h('a', {
            href,
            textContent,
            className: window.location.pathname.includes(href) ? 'active' : ''
        }));
        const nav = h('nav', { className: 'env-switcher' }, links);

        nav.prepend(buildLeftNavButtons())
        document.body.prepend(nav);
    }

    function buildLeftNavButtons () {
        const leftNavWrapper = h('div', {
            style: 'position: absolute; left: 1em; display: flex; flex-flow: row nowrap;',
        });

        [
            buildHostileCssButton(),
            buildSamesiteCookieButton('None'),
            buildSamesiteCookieButton('Lax'),
            buildSamesiteCookieButton('Strict')
        ].forEach((el) => leftNavWrapper.append(el));

        return leftNavWrapper;
    }

    function buildHostileCssButton () {
        return h('button', {
            textContent: 'enable hostile css',
            onclick: () => appendStyle('hostile.css')
        });
    }

    function buildSamesiteCookieButton (samesite) {
        return h('button', {
            textContent: `set SameSite=${samesite}`,
            onclick: () => {
                fetch(`/api/samesite/${samesite}`);
            }
        });
    }

    function appendStyles () {
        const styles = ['style.css'];

        styles.forEach(appendStyle);
    }

    function appendStyle (filename) {
        const link = h('link', {
            href: `/styles/${filename}`,
            type: 'text/css',
            rel: 'stylesheet'
        });

        document.head.appendChild(link);
    }

    function appendFonts () {
        const font = h('link', {
            href: 'https://fonts.googleapis.com/css?family=Roboto&display=swap',
            rel: 'stylesheet'
        });

        document.head.appendChild(font);
    }

    function appendDynamicEl () {
        const id = `dynamic-id-${Math.random().toString(16).slice(2)}`;

        const el = h('p', { id, textContent: 'i have a dynamic id!' });
        const parent = h('div', { className: 'dynamic-parent' });

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
        appendEnvNav,
        appendFonts,
        appendStyles,
        appendStyle,
        appendDynamicEl,
        track,
        getPersistedConfig,
        persistConfig
    };
}(window));
