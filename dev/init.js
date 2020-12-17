ruddbud.init('dev');
ruddbud.appendDynamicEl();

if (window.location.pathname.includes('iframe')) {
    setTimeout(() => {
        window.pendo.track('kitties-500');
    }, 500);

    setTimeout(() => {
        window.pendo.track('kitties-1500');
    }, 1500);
}
