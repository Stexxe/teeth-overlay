import {addEvent, appendChildren, loadImageFromBlob} from "../dom";
import {defineStage} from "../stage";
import {appendStyles, createEl} from "./common";

interface InputType {
    root: HTMLElement;
    maxHeight?: number;
}

interface OutputType {
    root: HTMLElement;
    maxHeight?: number;
    image: HTMLImageElement;
}

export const stage = defineStage<InputType, OutputType>(({root, maxHeight}, pass) => {
    appendStyles();

    const uploadInput = createEl("input", {type: "file", className: "hidden"});
    const uploadBtn = createEl("button", {className: "btn", innerText: "Upload"});

    appendChildren(root,
        [createEl("div", {className: "text-group"}, [
            createEl("p", {className: "strong", innerText: "Upload before and after png"}),
            createEl("p", {innerText: "(note this is a single png that contains the before and after photos)"}),
        ]),
            createEl("div", {className: "file-upload"}, [uploadBtn, uploadInput]),
        ]);

    addEvent(uploadBtn, "click", (e) => {
        e.preventDefault();
        uploadInput.click();
    });

    addEvent(uploadInput, "change", (e) => {
        const files = (e.target as HTMLInputElement).files;

        if (files && files.length > 0) {
            loadImageFromBlob(files[0]).then((image) => pass({root, image, maxHeight}));
        }
    });
});
