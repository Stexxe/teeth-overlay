import {loadImage} from "./dom";
import {previewStage} from "./stages/preview";
import {setupStage} from "./stages/setup";
import {uploadStage} from "./stages/upload";

/*uploadStage({
    root: document.getElementById("root") as HTMLElement,
}).then((x) => console.log(x));*/

/*loadImage("assets/man.png").then((image) => {
    setupStage({
        image,
        root: document.getElementById("root") as HTMLElement,
    }).then((x) => console.log(x));
});*/

loadImage("assets/man.png").then((image) => {
    previewStage({
        image,
        marks: [[123, 108], [519, 108], [397, 279]],
        maxHeight: 300,
        root: document.getElementById("root") as HTMLElement,
    }).then((x) => console.log(x));
});




