
// Some script setup issues won't let this export into Nuxt/Vue components
interface PageFlowOptions {
    aspect?: string;
    height?: string;
    margin?: string;
};

/*
* @param: node - The Input Node should be the
*   containing element all subsequent pages
*   will be inserted as siblings of this node
*/
const usePageFlow = () => ((source: HTMLElement, dest: HTMLElement, {aspect, height, margin}: PageFlowOptions) => {

    const children: HTMLElement[] = [];
    for (let k = 0; k < source.children.length; ++k) {
        const node = source.children.item(k).cloneNode(true) as HTMLElement;
        node.classList.remove('invisible');
        children.push(node)
    }
    source.innerHTML = "";

    // Create a node that is fixed in width, and let each element fill the size.
    const blankPage = source.parentElement.cloneNode(true) as HTMLElement;
    blankPage.style.padding = margin;
    blankPage.style.aspectRatio = aspect;
    blankPage.style.height = height;
    blankPage.innerHTML = "";
    //blankPage.classList.add('invisible')
    // const [w, h] = aspect.split('/').map(n => Number(n));
    const {innerHeight, innerWidth} = getDimensions(blankPage);

    source.parentElement.removeChild(source);

    console.log({innerHeight, innerWidth})
    document.body.insertBefore(blankPage, null);

    const container = dest.parentElement;
    let numPages = 1;
    dest.id = `page-flow-${numPages}`;
    let remaining = innerHeight;
    for (let i = 0; i < children.length; ++i) {

        console.log(`loop ${i}`)
        const node = children[i];

        blankPage.insertBefore(node, null);
        if (node.offsetHeight < remaining) {
            blankPage.removeChild(node);
            dest.insertBefore(node, null);
            remaining -= node.offsetHeight;
            // } else if (false) {
            //     // Need to split the node by text if possible.
        } else {
            let newPage = blankPage.cloneNode() as HTMLDivElement;
            numPages++;
            newPage.id = `page-flow-${numPages}`;
            container.insertBefore(newPage, null);
            dest = newPage;
            dest.insertBefore(node, null);
            remaining = innerHeight - node.offsetHeight;
        }
    }

    document.body.removeChild(blankPage);
    //dest.parentNode.insertBefore(node,null);
})

export default usePageFlow;
function getDimensions(blankPage: HTMLElement): {innerHeight: number, innerWidth: number} {
    let fauxPage = blankPage.cloneNode() as HTMLDivElement;
    fauxPage.id = "faux-page";
    fauxPage.style.position = "absolute";
    fauxPage.style.display = "flex";
    const expander = document.createElement('div');
    expander.style.height = "100%";
    expander.style.width = "100%";
    fauxPage.insertBefore(expander, null);
    document.body.insertBefore(fauxPage, null);

    const innerHeight = expander.offsetHeight;
    const innerWidth = expander.offsetWidth;

    document.body.removeChild(fauxPage);

    return {innerHeight, innerWidth};
}
