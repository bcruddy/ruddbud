(function init () {
    const isTopFrame = window === window.top;

    if (isTopFrame) {
        ruddbud.appendDynamicEl();
        const aboutDoc = document.getElementById('about-blank').contentDocument;
        aboutDoc.write('<h1>about:blank!</h1><p>no agent</p>');
        aboutDoc.close();
    }

    ruddbud.init('dev', { hideNav: !isTopFrame });
}());
