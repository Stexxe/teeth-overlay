import showUpload from "./pages/upload";
import clear from "./pages/clear";
import showSetup from "./pages/setup";
import showPreview from "./pages/preview";
import css from "./style.css";

const imageOverlay = (options) => {
    let cssEl = document.createElement("style");
    cssEl.type = "text/css";
    cssEl.innerHTML = css.toString();
    document.body.appendChild(cssEl);

    const pages = {
        'upload': showUpload,
        'setup': showSetup,
        'preview': showPreview,
    };

    if (options.page) {
        const fn = pages[options.page.name];
        fn({
            ...options.page.state,
            ...options
        });
    } else {
        showUpload(options)
            .then(clear)
            .then(showSetup)
            .then(clear)
            .then(showPreview)
            .catch(err => {
                console.warn(err);
            });
    }
};

export default imageOverlay;