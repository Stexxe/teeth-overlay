import {assert} from "../utils";

const showUpload = state => {
    return new Promise((resolve) => {
        assert(state.root, 'I need root element');

        state.root.innerHTML = `
        <div class="io-text-group">
            <p><strong>Upload before and after png</strong></p>
            <p>(note this is a single png that contains the before and after photos)</p>
        </div>
        <div class="io-file-upload">
            <button class="io-btn" id="io-upload-btn">Upload</button>
            <input id="io-photo" type="file">
        </div>
        `;

        const photoUploader = document.getElementById('io-photo');

        document.getElementById('io-upload-btn').addEventListener('click', () => {
            photoUploader.click();
        });

        photoUploader.addEventListener('change', e => {
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
                    })
                });
            }
        });

    });
};

export default showUpload;