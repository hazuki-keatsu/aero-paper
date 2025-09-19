import { h } from "hastscript";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";
import type { Plugin } from "unified";

export const parseDirectiveNode: Plugin<[], Root> = () => {
	return (tree: Root) => {
		visit(tree, (node: any) => {
			if (
				node.type === "containerDirective" ||
				node.type === "leafDirective" ||
				node.type === "textDirective"
			) {
				// biome-ignore lint/suspicious/noAssignInExpressions: <check later>
				const data = node.data || (node.data = {});
				node.attributes = node.attributes || {};
				
				// Special handling for time-block directive
				if (node.name === "time-block") {
					// Extract attributes from the directive
					const { time, title, detail } = node.attributes;
					
					// Create the hast element for time-block component
					const hast = h("time-block", {
						time: time || "",
						title: title || "",
						detail: detail || "",
					}) as any;

					data.hName = hast.tagName;
					data.hProperties = hast.properties;
				} else {
					// Default handling for other directives (like github)
					if (
						node.children.length > 0 &&
						node.children[0].data &&
						node.children[0].data.directiveLabel
					) {
						// Add a flag to the node to indicate that it has a directive label
						node.attributes["has-directive-label"] = "true";
					}
					const hast = h(node.name, node.attributes) as any;

					data.hName = hast.tagName;
					data.hProperties = hast.properties;
				}
			}
		});
	};
}