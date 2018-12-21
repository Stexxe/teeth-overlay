type AttrModify = (attr: string, val: any) => any;

export const createModifiedEl =
    (modifyAttr: AttrModify) => (tag: string, attrs: any = {}, children: HTMLElement[] = []) => {

    const el = document.createElement(tag);

    Object.entries(attrs).forEach(([key, val]) => {
        const modifiedVal = modifyAttr(key as string, val);
        (el as any)[key] = typeof modifiedVal === "undefined" ? val : modifiedVal;
    });

    return appendChildren(el, children);
};

export const createEl = createModifiedEl((n, v) => v);

const insertAfter = (parent: HTMLElement, newElem: HTMLElement, refElem: HTMLElement | null = null): HTMLElement => {
    if (refElem === null) {
        parent.appendChild(newElem);
    } else {
        parent.insertBefore(newElem, refElem.nextSibling);
    }

    return newElem;
};

export const appendChildren = (parent: HTMLElement, children: HTMLElement[]): HTMLElement => {
    let inserted: HTMLElement | null = null;
    children.forEach((child) => {
        inserted = insertAfter(parent, child, inserted);
    });

    return parent;
};

export const addEvent = (el: HTMLElement, type: string, fn: (event: Event) => void) => {
    el.addEventListener(type, fn);
};

export const appendCSS = (css: object) => {
    return appendChildren(document.head, [
        createEl("style", {innerHTML: css.toString()}),
    ]);
};

export const loadImage = (file: File): Promise<HTMLImageElement> => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    return new Promise((resolve, reject) => {
        reader.onload = () => {
            if (reader.result) {
                const image = new Image();
                image.src = reader.result as string;
                image.onload = (e) => resolve(e.target as HTMLImageElement);
            }
        };

        reader.onerror = reject;
    });
};
