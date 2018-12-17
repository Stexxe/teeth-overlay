import showUpload from './pages/upload';
import showSetup from './pages/setup';
import showPreview from './pages/preview';

const root = document.getElementById('root');

const clearPage = (state) => {
    root.innerHTML = '';
    return state;
};

showUpload({
    root: root,
}).then(clearPage)
    .then(showSetup)
    .then(clearPage)
    .then(showPreview)
    .catch(err => {
        console.warn(err);
    });
