import * as Preview from "./stages/preview";
import * as Setup from "./stages/setup";
import * as Upload from "./stages/upload";

interface WidgetOptions {
    root: HTMLElement;
    maxHeight?: number;
}

interface WithRootElement {
    root: HTMLElement;
}

function clearStage<InputT extends WithRootElement>(state: InputT) {
    state.root.innerHTML = "";
    return state;
}

const imageOverlay = (options: WidgetOptions) => {
    Upload.stage(options)
        .then((s) => clearStage<Setup.InputType>(s))
        .then(Setup.stage)
        .then((s) => clearStage<Preview.InputType>(s))
        .then(Preview.stage)
        .catch((err) => {
            console.warn(err);
        });
};

export default imageOverlay;
