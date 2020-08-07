(function () {

    const paletteId = "mcpPalette";
    const contextMenuId = "mcpContextMenu";

    function getPaletteElement() {
        return document.getElementById(paletteId);
    }

    function getContextMenuElement() {
        return document.getElementById(contextMenuId);
    }

    function paletteOpen() {
        const body = document.getElementsByTagName("body")[0];
        fetch(chrome.runtime.getURL("colors.json")).then(response => {

            let dragged = null;

            const palette = document.createElement("div");
            palette.setAttribute("id", paletteId);
            palette.style.setProperty("top", "0");

            palette.addEventListener("mousedown", event => {
                event.preventDefault();
                dragged = [event.offsetX, event.offsetY];
                contextMenuClose();
            });
            document.addEventListener("mousemove", event => {
                if (dragged === null) {
                    return;
                }
                palette.style.setProperty("left", (event.clientX - dragged[0]) + "px");
                palette.style.setProperty("top", (event.clientY - dragged[1]) + "px");
            });
            document.addEventListener("mouseup", _ => {
                dragged = null;
            })

            palette.addEventListener("contextmenu", event => {
                event.preventDefault();
                contextMenuOpen(event.clientX, event.clientY);
            });

            palette.addEventListener("wheel", event => {
                event.preventDefault();
                const scrollDir = event.deltaY / Math.abs(event.deltaY);
                palette.scroll(0, palette.scrollTop + scrollDir * 50)
            });

            body.appendChild(palette);

            const contextMenu = document.createElement("div");
            contextMenu.setAttribute("id", contextMenuId);
            contextMenu.style.setProperty("top", "0");
            contextMenu.style.setProperty("display", "none");
            body.appendChild(contextMenu);

            response.json().then(colors => {
                Object.getOwnPropertyNames(colors).forEach(color => {
                    const colorEl = document.createElement("div");
                    palette.appendChild(colorEl);

                    const contextMenuEntry = document.createElement("span");
                    contextMenuEntry.style.setProperty("background-color", colors[color]["500"][0]);
                    contextMenuEntry.style.setProperty("color", colors[color]["500"][1]);
                    contextMenuEntry.innerText = color;
                    contextMenuEntry.addEventListener("click", event => {
                        event.stopPropagation();
                        console.log()
                        palette.scroll(0, colorEl.offsetTop);
                        contextMenuClose();
                    });
                    contextMenu.appendChild(contextMenuEntry);

                    Object.getOwnPropertyNames(colors[color]).forEach(subColor => {
                        const subColorEl = document.createElement("div");
                        subColorEl.classList.add("color");
                        subColorEl.style.setProperty("background-color", colors[color][subColor][0]);
                        subColorEl.style.setProperty("color", colors[color][subColor][1]);
                        colorEl.appendChild(subColorEl);

                        const nameSpan = document.createElement("span");
                        nameSpan.classList.add("color-name");
                        nameSpan.innerText = color + " " + subColor
                        subColorEl.appendChild(nameSpan);

                        const hexSpan = document.createElement("span");
                        hexSpan.classList.add("color-hex");
                        hexSpan.innerText = colors[color][subColor][0]
                        hexSpan.addEventListener("click", _ => {
                            navigator.clipboard.writeText(colors[color][subColor][0]).catch(error => {
                                console.error(error);
                                alert("Failed to access clipboard!");
                            });
                        });
                        subColorEl.appendChild(hexSpan);
                    });
                });
            });
        }, error => {
            console.error(error);
            alert("Failed to retrieve colors");
        });
    }

    function paletteClose() {
        const paletteElement = getPaletteElement();
        if (paletteElement) {
            paletteElement.parentElement.removeChild(paletteElement);
        }
        const contextMenu = getContextMenuElement();
        if (contextMenu) {
            contextMenu.parentElement.removeChild(contextMenu);
        }
    }

    function contextMenuOpen(x, y) {
        const contextMenu = getContextMenuElement();
        contextMenu.style.setProperty("display", "block");
        const offsetX = window.innerWidth < x + contextMenu.clientWidth ? x + contextMenu.clientWidth - window.innerWidth : 0;
        const offsetY = window.innerHeight < y + contextMenu.clientHeight ? y + contextMenu.clientHeight - window.innerHeight : 0;
        contextMenu.style.setProperty("left", (x - offsetX) + "px");
        contextMenu.style.setProperty("top", (y - offsetY) + "px");
    }

    function contextMenuClose() {
        const contextMenu = getContextMenuElement();
        contextMenu.style.setProperty("display", "none");
    }

    function paletteToggle() {
        if (getPaletteElement()) {
            paletteClose();
        } else {
            paletteOpen();
        }
    }

    paletteToggle();

})();
