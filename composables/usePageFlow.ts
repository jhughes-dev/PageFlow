// Some script setup issues won't let this export into Nuxt/Vue components
export type PageFlowOptions = {
    templateNode?: HTMLElement | null;
    height: string;
    width: string;
    margin: string;
    fontSize: string;
    lineHeight: number | string;
    scale: number;
};

const INCH_TO_PT = 72;
const INCH_TO_PX = 96;

export const DefaultOptions: Partial<PageFlowOptions> = {
    height: "100%",
    width: "100%",
    margin: "1rem",
    fontSize: "12pt",
    lineHeight: 1.5,
    scale: 1,
}


export type Flow = {
    content: HTMLElement[][],
    innerHeight: number,
    innerWidth: number,
    rowHeight: number
} & PageFlowParameters

type NumberWithUnit = {
    value: number,
    unit: string
};

type PageFlowParameters = PageFlowOptions & {
    fontPixels: number;
    lineHeight: string;
};

function splitUnits(v: string): NumberWithUnit {
    if (v !== "") {
        const [_, value, unit] = v.match(/^([-\+]?[\d]*[\.]?[\d]*)(.*)$/) || [];
        return {
            value: Number(value?.trim() || 0),
            unit: unit?.trim() || ""
        };
    } else {
        return {
            value: 0,
            unit: ""
        }
    }
}

const getFontPixelSize = ({fontSize, scale}: PageFlowOptions): number => {
    let {value, unit} = splitUnits(fontSize)

    if (typeof document !== "undefined") {
        // If we have access to the document, we can get this exactly
        const temp = document.createElement("div") as HTMLDivElement;
        temp.style.fontSize = fontSize;
        document.body.insertBefore(temp, null);
        // This should always return pixels
        const {value: v, unit: pixels} = splitUnits(window.getComputedStyle(temp, null).getPropertyValue('font-size'));
        document.body.removeChild(temp);
        console.assert(pixels === "px", `Expected "px" saw: ${pixels}`);
        value = v;
    } else {
        // No document available, just assume defaults
        if (unit === "pt") {
            value = scale * INCH_TO_PX * value / INCH_TO_PT;
        } else if (unit === "in") {
            value = scale * INCH_TO_PX * value;
        } else {
            throw `Unimplemented unit: ${unit}. Expected 'pt','px', or 'in'.`
        }
    }

    return value;

}

const scaleUnit = (param: string, scale: number) => {
    const {value, unit} = splitUnits(param);
    return `${value * scale}${unit}`;
}

const applyDefaultOptions = (partial_opts: Partial<PageFlowOptions>): PageFlowParameters => {
    const opts = {...DefaultOptions, templateNode: undefined, ...partial_opts} as PageFlowParameters
    // Scale all params:

    opts.margin = scaleUnit(opts.margin, opts.scale);
    opts.height = scaleUnit(opts.height, opts.scale);
    opts.width = scaleUnit(opts.width, opts.scale);

    if (typeof opts.lineHeight === "number") {
        opts.lineHeight = scaleUnit(opts.fontSize, opts.scale * opts.lineHeight) as string;
    } else if (typeof opts.lineHeight === "string") {
        opts.lineHeight = scaleUnit(opts.lineHeight, opts.scale);
    }
    opts.fontSize = scaleUnit(opts.fontSize, opts.scale);
    const fontPixels = getFontPixelSize({...opts});
    return {...opts, fontPixels};
};

const createPage = (opts: PageFlowParameters) => {
    const page = document.createElement("div") as HTMLDivElement;
    document.body.insertBefore(page, null);

    page.innerHTML = "";
    page.id = "page";

    // (content.parentNode as HTMLElement).removeChild(content);
    page.style.position = "fixed";
    page.style.display = "flex";
    page.style.float = "left";

    // Not sure why, but without this, it basically ignores the min/max sizes.
    page.style.boxSizing = "content-box";

    // What we think of in print as a Margin is really the padding of the container
    page.style.padding = opts.margin;

    // HTML/CSS pushed Margins out from the page, we want the other way around
    adjustMargins(page, opts);

    page.style.lineHeight = opts.lineHeight
    page.style.fontSize = opts.fontSize;

    return page;
}

function adjustMargins(page: HTMLDivElement, opts: PageFlowParameters) {
    // TODO: Find a better way to do this

    // CSS Margin goes outward from the box, so if the element is set to:
    //    (width) by (height)
    // then margin is applied you get a bounding box of:
    //    (margin-left + width + margin-right) by (margin-top + height + margin-bottom)
    // But I want a bounding box of (width) by (height), with an internal usable space thats
    //    (width - margin-left - margin-right) by (height - margin-top - margin-bottom)

    // But also, the page background should look like a page, so instead of margin, use padding
    // The math is essentially the same.

    // This is all to get the height with the internal
    // padding, just to remove the internal padding....
    page.style.height = opts.height;
    page.style.maxHeight = opts.height;
    page.style.minHeight = opts.height;

    page.style.width = opts.width;
    page.style.maxWidth = opts.width;
    page.style.minWidth = opts.width;

    const style = window.getComputedStyle(page, null);

    const padding = {
        left: splitUnits(style.getPropertyValue('padding-left')).value,
        right: splitUnits(style.getPropertyValue('padding-right')).value,
        top: splitUnits(style.getPropertyValue('padding-top')).value,
        bottom: splitUnits(style.getPropertyValue('padding-bottom')).value
    };

    const h = splitUnits(style.getPropertyValue('height')).value - padding.top - padding.bottom;
    const w = splitUnits(style.getPropertyValue('width')).value - padding.left - padding.right;

    // Why everyone gets so frustrated with CSS... is it
    // too much to ask to be able to specify exact sizes
    // and have those get respected. LOL
    // https://css-tricks.com/wp-content/uploads/2021/04/css-is-awesome.jpg
    page.style.height = `${h}px`;
    page.style.maxHeight = `${h}px`;
    page.style.minHeight = `${h}px`;

    page.style.width = `${w}px`;
    page.style.maxWidth = `${w}px`;
    page.style.minWidth = `${w}px`;
}

function cloneChild(child: HTMLElement, opts: PageFlowParameters): HTMLElement {
    const clone = child.cloneNode() as HTMLElement;
    clone.innerHTML = child.innerHTML;
    clone.style.lineHeight = opts.lineHeight;
    clone.style.fontSize = opts.fontSize;
    return clone;
}

function getDimensions(page: HTMLElement, opts: PageFlowParameters): {innerHeight: number, innerWidth: number, rowHeight: number} {
    // Take the external page, and fill it with a div that's 100% width and width.
    const interior_area = document.createElement('div');

    interior_area.style.display = "block"
    interior_area.style.height = "100%";
    interior_area.style.width = "100%";

    page.insertBefore(interior_area, null);

    // Once sized, the interior_area gives the interior dimensions of the page.
    const innerHeight = interior_area.scrollHeight;
    const innerWidth = interior_area.scrollWidth;

    const text = document.createElement('p');
    text.style.boxSizing = "content-box"
    text.style.fontSize = opts.fontSize;
    text.style.lineHeight = opts.lineHeight;
    // Now insert text into the div, and see what it's height becomes
    text.innerText = "A";
    interior_area.insertBefore(text, null);

    const rowHeight = text.scrollHeight;
    page.removeChild(interior_area);
    return {innerHeight, innerWidth, rowHeight};
}

/*
* @param: content - The elements to be paginated
* @param: options
*/
export const pageFlow = (content: HTMLElement | null, options: Partial<PageFlowOptions>): Flow => {

    if (!content) {
        // well that was easy
        return {
            content: [] as HTMLElement[][],
            innerHeight: NaN,
            innerWidth: NaN,
            rowHeight: NaN,
            ...applyDefaultOptions(options)
        };
    }
    console.log("Flowing at " + JSON.stringify(options));

    const opts = applyDefaultOptions(options);

    const page = createPage(opts);

    // page needs to be in the document before it will get sized.
    const {innerHeight, innerWidth, rowHeight} = getDimensions(page, opts);

    const content_children: HTMLElement[] = [...content.children].reverse();

    const page_content: any[] = [];


    const container = document.createElement("div");
    container.style.boxSizing = "content-box"
    container.style.height = innerHeight + 'px'
    container.id = "flow-container"
    page.appendChild(container);

    console.log(`Container Height: ${container.scrollHeight}`);

    function extractTextNodes(inner_content: HTMLElement) {
        const first_child = inner_content.firstChild as HTMLElement;

        const words = first_child?.textContent?.trim().split(" ") || [];
        return words;
    }

    function splitTextIntoRemainingSpace(words: string[], inner_content: HTMLElement) {

        const partial_content = cloneChild(inner_content, opts) as HTMLElement;
        partial_content.style.paddingBottom = '0';
        partial_content.style.marginBottom = '0';
        partial_content.style.boxSizing = "content-box"
        partial_content.innerText = "";

        container.appendChild(partial_content);
        partial_content.innerText += words[0];
        let partial_height = partial_content.scrollHeight;
        const remaining_height = innerHeight - used_height;
        let i = 0;
        while (remaining_height >= partial_height) {
            console.log(remaining_height - partial_height)
            i++;
            partial_content.innerText += " " + words[i];
            partial_height = partial_content.scrollHeight;
        }

        container.removeChild(partial_content);

        // i==0, one word pushed us over.
        const rest = (i == 0) ? words.join(" ") : words.splice(i - 1).join(" ");
        const first = (i == 0) ? null : words.join(" ");

        return {first, rest}
    }

    let used_height = 0;
    let done = content_children.length === 0;

    while (!done) {
        // Fill Each Page
        let force_page = false;
        const inner_content = cloneChild(content_children.pop() as HTMLElement, opts);

        // first, see if the whole node fits.
        container.appendChild(inner_content);

        const node_height = inner_content.scrollHeight;

        if (innerHeight - used_height - node_height > 0) {
            // This will fit
            used_height += node_height;
            console.log(`Added ${node_height} to page ${page_content.length}`)
        } else {
            // Split the node
            container.removeChild(inner_content);
            const words = extractTextNodes(inner_content);
            const parts = splitTextIntoRemainingSpace(words, inner_content);

            if (parts.first) {
                const partial_content = cloneChild(inner_content, opts);
                partial_content.style.paddingBottom = '0';
                partial_content.style.marginBottom = '0';
                partial_content.innerText = parts.first;
                container.appendChild(partial_content);

                console.log(`Added ${partial_content.scrollHeight} of ${container.scrollHeight} to page ${page_content.length} at the end`);

                used_height += partial_content.scrollHeight;
            }

            force_page = true;

            if (parts.rest.length > 0) {
                const nextContent = cloneChild(inner_content, opts);
                nextContent.innerText = parts.rest;
                content_children.push(nextContent);
                console.log(`Pushed remaining content to next page.`)
            }
        }

        done = (content_children.length === 0);

        if (innerHeight - used_height < rowHeight || done || force_page) {
            // Page is full
            console.log(`Finalized page: Remaining rows: ${Math.floor((innerHeight - used_height) / rowHeight)}`)
            page_content.push([...(container.children)]);
            container.innerHTML = "";
            console.log(`Page Added: ${page_content.length}`)
            used_height = 0;
        }
    }

    document.body.removeChild(page);
    return {
        content: page_content,
        innerHeight, innerWidth, rowHeight,
        ...opts
    };
}
