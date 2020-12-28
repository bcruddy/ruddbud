(function init () {
    const isTopFrame = window === window.top;

    ruddbud.init('dev', { hideNav: !isTopFrame });

    if (isTopFrame) {
        ruddbud.appendDynamicEl();
    }
}());
