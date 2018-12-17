import {assert} from "../utils";

const showUpload = state => {
    return new Promise((resolve) => {
        assert(state.root, 'I need root element');

        state.root.innerHTML = `
        <label for="photo">Upload before and after PNG</label>
        <input id="photo" type="file">
        `;

        document.getElementById('photo').addEventListener('change', e => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onload = (e) => {
                const image = new Image();
                image.src = e.target.result;

                image.addEventListener('load', e => {
                    resolve({
                        ...state,
                        image: e.target,
                        scale: state.maxHeight ? state.maxHeight / e.target.height : 1.0
                    })
                });
            }
        });

    });
};

export default showUpload;