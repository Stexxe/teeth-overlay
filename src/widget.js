import showUpload from "./pages/upload";
import clear from "./pages/clear";
import showSetup from "./pages/setup";
import showPreview from "./pages/preview";

const imageOverlay = (options) => {
    showUpload(options)
        .then(clear)
        .then(showSetup)
        .then(clear)
        .then(showPreview)
        .catch(err => {
            console.warn(err);
        });
};

export default imageOverlay;