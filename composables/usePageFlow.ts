// Some script setup issues won't let this export into Nuxt/Vue components
export type PageFlowOptions = {
    templateNode: HTMLElement | undefined;
    aspect: string;
    height: string;
    margin: string;
    fontSize: string;
    lineHeight: number | string;
    scale: number;
    PPI: number;
};

const INCH_TO_PT = 72;
const INCH_TO_PX = 96;

export const DefaultOptions: PageFlowOptions = {
    templateNode: undefined,
    aspect: "1/1",
    height: "100%",
    margin: "1rem",
    fontSize: "12pt",
    lineHeight: 1.5,
    scale: 1,
    PPI: INCH_TO_PX,
}

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

const getFontPixelSize = ({fontSize, PPI, scale}: PageFlowOptions): number => {
    const temp = document.createElement("div") as HTMLDivElement;
    temp.style.fontSize = fontSize;
    document.body.insertBefore(temp, null);
    // This should always return pixels
    const {value: size, unit: pixels} = splitUnits(window.getComputedStyle(temp, null).getPropertyValue('font-size'));
    document.body.removeChild(temp);
    console.assert(pixels === "px", `Expected "px" saw: ${pixels}`);

    const expected = splitUnits(fontSize);
    if (expected.unit === "pt") {
        expected.value = INCH_TO_PX * expected.value / INCH_TO_PT;
        expected.unit = 'px'
    }
    return (size);
}

const scaleUnit = (param: string, scale: number) => {
    const {value, unit} = splitUnits(param);
    return `${value * scale}${unit}`;
}

const applyDefaultOptions = (partial_opts: Partial<PageFlowOptions>): PageFlowParameters => {
    const opts = {...DefaultOptions, ...partial_opts}
    // Scale all params:

    opts.height = scaleUnit(opts.height, opts.scale);
    opts.margin = scaleUnit(opts.margin, opts.scale);
    if (typeof opts.lineHeight === "number") {
        opts.lineHeight = scaleUnit(opts.fontSize, opts.scale * opts.lineHeight) as string;
    } else if (typeof opts.lineHeight === "string") {
        opts.lineHeight = scaleUnit(opts.lineHeight, opts.scale);
    }
    opts.fontSize = scaleUnit(opts.fontSize, opts.scale);
    const fontPixels = getFontPixelSize({...opts});
    return {...opts, fontPixels};
};

const createFrame = (opts: PageFlowParameters) => {
    const frame = document.createElement("div") as HTMLDivElement;
    frame.innerHTML = "";
    frame.id = "frame";

    // (content.parentNode as HTMLElement).removeChild(content);
    frame.style.position = "fixed";
    frame.style.display = "flex";
    frame.style.float = "left";

    frame.style.boxSizing = "content-box"  // Maybe dont' need this, can get from template

    frame.style.aspectRatio = opts.aspect;
    // Why everyone gets so frustrated with CSS
    frame.style.height = opts.height;
    frame.style.maxHeight = opts.height;
    frame.style.minHeight = opts.height;
    // What we think of in print as a Margin is really the padding of the container
    frame.style.padding = opts.margin;

    frame.style.lineHeight = opts.lineHeight
    frame.style.fontSize = opts.fontSize;

    return frame;
}

function getDimensions(page: HTMLElement, opts: PageFlowParameters): {innerHeight: number, innerWidth: number, rowHeight: number} {
    // Take the external page, and fill it with a div that's 100% width and height.
    const interior_area = document.createElement('div');

    interior_area.style.boxSizing = "content-box" // Maybe this comes from template
    interior_area.style.display = "block"
    interior_area.style.height = "100%";
    interior_area.style.width = "100%";

    page.insertBefore(interior_area, null);
    // page needs to be in the document before it will get sized.
    document.body.insertBefore(page, null);

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
    document.body.removeChild(page);
    page.removeChild(interior_area);
    return {innerHeight, innerWidth, rowHeight};
}

type Flow = {
    content: HTMLElement[],
    innerHeight: number,
    innerWidth: number,
    rowHeight: number
} & PageFlowParameters
/*
* @param: content - This should contain all the elements we want to paginate
*/
export const pageFlow = (content: HTMLElement | null, options: Partial<PageFlowOptions>): Flow => {

    if (!content) {
        // well that was easy
        return {content: [], innerHeight: NaN, innerWidth: NaN, rowHeight: NaN};
    }
    console.log("Flowing at " + JSON.stringify(options));

    const opts = applyDefaultOptions(options);

    const page = createFrame(opts);

    const {innerHeight, innerWidth, rowHeight} = getDimensions(page, opts);

    const content_children = [...content.children];

    const page_content: any[] = [];

    document.body.insertBefore(page, null);

    const container = document.createElement("div");
    container.style.height = 'inheirit';
    page.appendChild(container);

    let used_height = 0
    content_children.forEach((child, idx) => {

        const inner_content = child.cloneNode();
        inner_content.innerHTML = child.innerHTML;

        inner_content.style.lineHeight = opts.lineHeight;
        inner_content.style.fontSize = opts.fontSize;

        const remaining_height = innerHeight - used_height;
        // first, see if the whole node fits.
        container.appendChild(inner_content);
        const node_height = inner_content.scrollHeight;

        if (node_height === 0) {
            // Just ignore this one.
            container.removeChild(inner_content);
            return
        }



        if (remaining_height - node_height > rowHeight) {
            // Will keep this node
            used_height += node_height;
            console.log(`Node: ${idx} Page: ${page_content.length} Remaining Rows: ${Math.floor(remaining_height / rowHeight)} Full Node Append`);
            return
        }

        // Overflow Occurred
        container.removeChild(inner_content);

        // At least one row remains
        if (remaining_height - rowHeight > 1) {
            console.log("Attempt to break paragraph!")
            console.log(`Node: ${idx} Page: ${page_content.length} Remaining Rows: ${Math.floor(remaining_height / rowHeight)} `);

            const first = inner_content.firstChild;
            const partial_content = inner_content.cloneNode();
            partial_content.style.lineHeight = opts.lineHeight;
            partial_content.style.fontSize = opts.fontSize;
            partial_content.innerText = "";
            container.appendChild(partial_content);
            let partial_height = partial_content.scrollHeight;

            if (first.nodeType === 3) {
                const words = (first.textContent.split(" "))
                partial_content.innerText += words[0];
                partial_height = partial_content.scrollHeight;
                console.log(`Partial Height After First Word added ${partial_height} vs ${rowHeight}`)
                let i = 0;
                while (remaining_height - partial_height >= rowHeight) {
                    i++;
                    partial_content.innerText += " " + words[i];
                    partial_height = partial_content.scrollHeight;
                }

                if (i == 0) {
                    // Didn't manage to add the row, don't bother keeping it
                    container.removeChild(partial_content)
                } else {
                    // TODO: Need to handle orphan words here too, but fine for now
                    console.log(`Node: ${idx} Page: ${page_content.length} Added ${i - 1} Words!`);
                    inner_content.innerText = words.splice(i - 1).join(" ");
                }

                partial_content.innerText = words.join(" ");
            } else {
                throw "Deep Nesting Not Implemented"
            }
        }

        page_content.push([...(container.children)]);

        container.innerHTML = "";
        container.appendChild(inner_content);
        console.log(`Node ${idx} Page:${page_content.length} Actual Height: ${inner_content.scrollHeight} Calculated Height: ${inner_content.getBoundingClientRect().height}`);
        used_height = inner_content.scrollHeight;
    })

    document.body.removeChild(page);
    return {
        content: page_content,
        innerHeight, innerWidth, rowHeight,
        ...opts
    };
}
