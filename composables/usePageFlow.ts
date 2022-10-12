
// Some script setup issues won't let this export into Nuxt/Vue components
export interface PageFlowOptions {
    aspect?: string;
    height?: string;
    margin?: string;
};

/*
* @param: node - The Input Node should be the
*   containing element all subsequent pages
*   will be inserted as siblings of this node
*/
export default () => (node: HTMLElement, opts?: PageFlowOptions) => {
    const parent = node;

    const children = parent.children;
    for (let i = 0; i < children.length; ++i){
        parent.removeChild(children[i]);
    }

}
