import {addEvent, appendChildren, appendCSS, createModifiedEl, loadImage} from "./dom";
import {defineStage} from "./stage";
const style = require("./style.css");

interface UploadData {
    root: HTMLElement;
}

interface ResultData {
    root: HTMLElement;
    image: HTMLImageElement;
}

const uploadStage = defineStage<UploadData, ResultData>(({root}, pass, fail) => {
    const createPrefixed = createModifiedEl((attr, val) => {
        if (attr === "className" || attr === "id") { return "io-" + val; }
    });

    appendCSS(style);
    const uploadInput = createPrefixed("input", {type: "file", className: "hidden"});
    const uploadBtn = createPrefixed("button", {className: "btn", innerText: "Upload"});

    appendChildren(root,
        [createPrefixed("div", {className: "text-group"}, [
            createPrefixed("p", {className: "strong", innerText: "Upload before and after png"}),
            createPrefixed("p", {innerText: "(note this is a single png that contains the before and after photos)"}),
        ]),
            createPrefixed("div", {className: "file-upload"}, [
                uploadBtn,
                uploadInput,
            ]),
        ]);

    addEvent(uploadBtn, "click", (e) => {
        e.preventDefault();
        uploadInput.click();
    });

    addEvent(uploadInput, "change", (e) => {
        const files = (e.target as HTMLInputElement).files;

        if (files && files.length > 0) {
            loadImage( files[0] ).then((image) => pass({root, image})).catch(fail);
        }
    });
});

