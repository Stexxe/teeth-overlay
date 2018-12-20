import {addEvent, appendChildren, createEl} from "./dom";

const root = document.getElementById("root") as HTMLElement;

const createPrefixed = createEl((attr, val) => {
    if (attr === "className" || attr === "id") { return "io-" + val; }
});

const uploadInput = createPrefixed("input", {type: "file", className: "hidden"});
const uploadBtn = createPrefixed("button", {className: "btn", innerText: "Upload"});

addEvent(uploadBtn, "click", (e) => {
    e.preventDefault();
    uploadInput.click();
});

addEvent(uploadInput, "change", (e) => {

});

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
