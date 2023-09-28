// Some script setup issues won't let this export into Nuxt/Vue components
export type PageFlowProps = {
    height: string;
    width: string;
    margin: string;
    fontSize: string;
    lineHeight: number | string;
    scale: number;
};

const INCH_TO_PT = 72;
const INCH_TO_PX = 96;

type PageFlowOptions = PageFlowProps & {
    pageTemplate?: HTMLElement
    contentTemplate?: HTMLElement
}
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
    const opts = {...DefaultOptions, ...partial_opts} as PageFlowParameters
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

const getNumericStyleValue = (style: CSSStyleDeclaration, property: string) => splitUnits(style.getPropertyValue(property)).value;

function getPaddingValues(style: CSSStyleDeclaration) {
    return {
        left: getNumericStyleValue(style, 'padding-left'),
        right: getNumericStyleValue(style, 'padding-right'),
        top: getNumericStyleValue(style, 'padding-top'),
        bottom: getNumericStyleValue(style, 'padding-bottom')
    };
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

    const padding = getPaddingValues(style);

    const h = getNumericStyleValue(style, 'height') - padding.top - padding.bottom;
    const w = getNumericStyleValue(style, 'width') - padding.left - padding.right;

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

function cloneElement(original: HTMLElement): HTMLElement {
    const clone = original.cloneNode() as HTMLElement;
    clone.innerHTML = original.innerHTML;
    return clone;
}

function getRowHeight(container: HTMLElement, opts: PageFlowParameters) {
    const text = document.createElement('p');
    text.style.boxSizing = "content-box";
    text.style.fontSize = opts.fontSize;
    text.style.lineHeight = opts.lineHeight;
    // Now insert text into the div, and see what it's height becomes
    text.innerText = "A";
    container.insertBefore(text, null);

    const rowHeight = text.scrollHeight;
    return rowHeight;
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
    const rowHeight = getRowHeight(interior_area, opts);

    page.removeChild(interior_area);
    return {innerHeight, innerWidth, rowHeight};


}

function extractWords(inner_content: HTMLElement) {
    // This is not exactly correct, but it will do for now.
    return inner_content?.firstChild?.textContent?.trim().split(" ") || [];;
}

/*
* @param: content - The elements to be paginated
* @param: options
*/
export const pageFlow = (content: HTMLElement | null, options: Partial<PageFlowOptions>): Flow => {

    // TODO: Will need to get this out of Nuxt eventually, but this is easier for now. Probably won't use logging in the future
    const {$logger} = useNuxtApp();

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

    $logger("pageflow", "Flowing at " + JSON.stringify(options));

    const opts = applyDefaultOptions(options);

    // If we're using tghe pageTemplate, we'll ignore the height/width/margin
    const page = (opts.pageTemplate) ? cloneElement(opts.pageTemplate) : createPage(opts);

    // page needs to be in the document before it will get sized.
    const {innerHeight, innerWidth, rowHeight} = getDimensions(page, opts);

    const content_children: HTMLElement[] = [...content.children].reverse();

    const page_content: any[] = [];


    const container = document.createElement("div");
    container.style.boxSizing = "content-box"
    container.style.height = innerHeight + 'px'
    container.id = "flow-container"
    page.appendChild(container);

    $logger("pageflow", `Container Height: ${container.scrollHeight}`);

    function splitTextIntoRemainingSpace(words: string[], inner_content: HTMLElement) {

        const partial_content = cloneElement(inner_content) as HTMLElement;
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
            i++;
            partial_content.innerText += " " + words[i];
            partial_height = partial_content.scrollHeight;
        }
        $logger("pageflow", `Split Content Height: ${partial_height}, ${i - 1} words`);
        container.removeChild(partial_content);

        // i==0, one word pushed us over.
        const rest = (i == 0) ? words.join(" ") : words.splice(i - 1).join(" ");
        const first = (i == 0) ? null : words.join(" ");

        return {first, rest}
    }


    function breakNodeOnWords(inner_content: HTMLElement) {
        container.removeChild(inner_content);
        const words = extractWords(inner_content);
        const parts = splitTextIntoRemainingSpace(words, inner_content);

        if (parts.first) {
            const partial_content = cloneElement(inner_content);
            partial_content.style.paddingBottom = '0';
            partial_content.style.marginBottom = '0';
            partial_content.innerText = parts.first;
            container.appendChild(partial_content);

            $logger("pageflow", `Added ${partial_content.scrollHeight} of ${container.scrollHeight} to page ${page_content.length} at the end`);

            used_height += partial_content.scrollHeight;
        }

        if (parts.rest.length > 0) {
            const nextContent = cloneElement(inner_content);
            nextContent.innerText = parts.rest;
            content_children.push(nextContent);
            $logger("pageflow", `Pushed remaining content to next page.`);
        }

    }

    function startNewPage() {
        $logger("pageflow", `Finalized page: Remaining rows: ${Math.floor((innerHeight - used_height) / rowHeight)}`);
        pages.push(cloneElement(page));
        page_content.push([...(container.children)]);
        container.innerHTML = "";
        $logger("pageflow", `Page Added: ${page_content.length}`);
        used_height = 0;
    }

    let used_height = 0;
    let done = content_children.length === 0;
    const pages: HTMLElement[] = [];
    while (!done) {
        // Fill Each Page
        const inner_content = cloneElement(content_children.pop() as HTMLElement);

        // first, see if the whole node fits.
        container.appendChild(inner_content);

        const node_height = inner_content.scrollHeight;

        // The entire block fit on the page.
        const fit_on_page = (innerHeight - used_height - node_height > 0);

        if (fit_on_page) {
            used_height += node_height;
            $logger("pageflow", `Added ${node_height} to page ${page_content.length}`);
        } else {
            breakNodeOnWords(inner_content);
        }

        done = (content_children.length === 0);

        if (innerHeight - used_height < rowHeight || done || !fit_on_page) {
            // Page is full
            startNewPage();
        }
    }

    document.body.removeChild(page);
    return {
        content: page_content,
        pages,
        innerHeight, innerWidth, rowHeight,
        ...opts
    };
}
