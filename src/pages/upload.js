const showUpload = state => {
    return new Promise((resolve, reject) => {
        if ( !(state.root) ) {
            return reject('I need root element');
        }

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
                        image: e.target
                    })
                });
            }
        });

    });
};

export default showUpload;