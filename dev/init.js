(function init () {
    const isTopFrame = window === window.top;

    if (isTopFrame) {
        ruddbud.appendDynamicEl();
        // document.getElementById('about-blank').contentDocument.write('<h1>about:blank!</h1><p>no agent</p>');
    }

    ruddbud.init('dev', { hideNav: !isTopFrame });
}());
