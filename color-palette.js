(function () {

    function openColorPalette() {
        let currentScroll = 0;
        $.get(chrome.runtime.getURL('template.html')).then(data => {
            $('body').append(data);
            const palette = $('#colorPalette');
            palette.draggable();
            palette.on('mousedown', event => {
                if (event.button === 1) {
                    closeColorPalette();
                }
            });
            $(document).on('mousedown', event => {
                closeColorPaletteMenu();
            });
            palette.on('contextmenu', event => {
                event.preventDefault();
                openColorPaletteMenu(event.clientX, event.clientY);
            });
            palette.on('scroll', event => {
                palette.scrollTop(currentScroll < palette.scrollTop() ? Math.ceil(palette.scrollTop() / 50) * 50 : Math.floor(palette.scrollTop() / 50) * 50);
                currentScroll = palette.scrollTop();
            });
        });
    }

    function closeColorPalette() {
        $('#colorPalette').remove();
        $('#colorPaletteMenu').remove();
        $('link[id="colorPaletteLink"]').remove();
    }

    function openColorPaletteMenu(x, y) {
        if ($('#colorPaletteMenu').length === 0) {
            $.get(chrome.runtime.getURL('menuTemplate.html'), data => {
                $('body').append(data);
                const menu = $('#colorPaletteMenu');
                menu.css({
                    top: y + 'px',
                    left: x + 'px'
                });
                menu.on('mousedown', event => {
                    if (event.button === 0) {
                        if (event.target.nodeName === 'SPAN') {
                            scrollToColor(event.target.innerHTML.replace(/ /g, '-').toLowerCase());
                            closeColorPaletteMenu();
                        }
                    } else if (event.button === 1) {
                        closeColorPaletteMenu();
                    }
                });
            });
        }
    }

    function closeColorPaletteMenu() {
        $('#colorPaletteMenu').remove();
    }

    function scrollToColor(color) {
        $('#colorPalette').scrollTop($('#colorPalette').scrollTop() + $('#colorPalette #' + color).position().top);
    }

    if ($('#colorPalette').length === 0) {
        $('head').append('<link href="https://fonts.googleapis.com/css?family=Roboto:500" rel="stylesheet" id="colorPaletteLink">');
        openColorPalette();
    } else {
        closeColorPalette();
    }
})();
