(function init () {
    const isTopFrame = window === window.top;
    const params = parseQueryParams();
    console.log(window.location.pathname, params)

    if (isTopFrame) {
        ruddbud.appendDynamicEl();

        const aboutDoc = document.getElementById('about-blank').contentDocument;
        aboutDoc.write('<h1>about:blank!</h1><p>no agent</p>');
        aboutDoc.close();

        if (params.domainmismatch) {
            const iframe = document.createElement('iframe');

            iframe.setAttribute('id', 'domain-mismatch');
            iframe.setAttribute('src', 'https://dev.local:3000/dev/iframe-other-cat-articles.html');

            const grid = document.querySelector('.frame-grid');

            grid && grid.appendChild(iframe);
        }
    }



    ruddbud.init('dev', { hideNav: !isTopFrame });


    function parseQueryParams () {
        const { search } = window.location;

        if (!search) {
            return {};
        }

        return search.replace('?', '').split('&').reduce((map, kv) => {
            const [key, value] = kv.split('=');

            return {
                ...map,
                [key]: value
            };
        }, {})
    }
}());
