import { h } from "hastscript"

interface TimelineBlockProperties {
	time?: string;
	title?: string;
	detail?: string;
	image?: string;
	imageAlt?: string;
	hideTime?: string | boolean;
	[key: string]: any;
}

function parseBoolean(value: unknown, defaultValue = false): boolean {
	if (typeof value === "boolean") return value;
	if (typeof value === "string") {
		const normalized = value.trim().toLowerCase();
		if (["true", "1", "yes", "on", "y"].includes(normalized)) return true;
		if (["false", "0", "no", "off", "n"].includes(normalized)) return false;
	}
	return defaultValue;
}

/**
 * Creates a Timeline Block component.
 *
 * @param properties - The properties of the component.
 * @param properties.time - The timestamp in ISO format.
 * @param properties.title - The title of the timeline block.
 * @param properties.detail - The detail text of the timeline block.
 * @param properties.image - The image URL for the timeline block.
 * @param properties.imageAlt - The alt text for the image.
 * @param children - The children elements of the component.
 * @returns The created Timeline Block component.
 */
export function TimelineBlockComponent(
	properties: TimelineBlockProperties,
	children: any[]
): any {
	const {
		time = "",
		title = "",
		detail = "",
		image = "",
		imageAlt = "",
		hideTime = false,
	} = properties;

	const shouldHideTime = parseBoolean(hideTime, false);

	// Parse the timestamp
	let formattedDate = "";
	let formattedTime = "";

	if (time) {
		try {
			const date = new Date(time);
			formattedDate = date.toLocaleDateString('zh-CN', {
				year: 'numeric',
				month: '2-digit',
				day: '2-digit'
			});
			formattedTime = date.toLocaleTimeString('zh-CN', {
				hour: '2-digit',
				minute: '2-digit'
			});
		} catch (error) {
			formattedDate = time;
		}
	}

	const timeChildren: any[] = [];
	if (formattedDate) {
		timeChildren.push(h("div", { class: "timeline-date" }, formattedDate));
	}
	if (!shouldHideTime && formattedTime) {
		timeChildren.push(h("div", { class: "timeline-clock" }, formattedTime));
	}


	// 处理 detail 内容：
	// 1. 若传入 children（指令体内容），优先使用 children 作为富文本内容。
	// 2. 若无 children 且 detail 含 HTML 标签，注入 raw 节点交由后续 rehype-raw 处理。
	// 3. 否则按纯文本字符串渲染。
	let detailNodes: any[] | string = detail;
	if (children && children.length > 0) {
		detailNodes = children; // 外层 markdown/指令体提供的内容
	} else if (typeof detail === 'string' && /<[^>]+>/.test(detail)) {
		// 简单判断含 HTML 标签；插入 raw 节点（需在管线中使用 rehype-raw 才能解析为真正节点）
		detailNodes = [{ type: 'raw', value: detail }];
	}

	return h("div", { class: "timeline-block" }, [
		h("div", { class: "timeline-line" }),
		h("div", { class: "timeline-marker" }),
		h("div", { class: "timeline-content" }, [
			timeChildren.length
				? h("div", { class: "timeline-time" }, timeChildren)
				: null,
			h("div", { class: "timeline-content-card" }, [
				h("h3", { class: "timeline-title" }, title),
				h("hr", { class: "mb-4"}),
				image && h("div", { class: "timeline-image-container" }, [
					h("img", { 
						src: image, 
						alt: imageAlt || title,
						class: "timeline-image"
					})
				]),
				h("div", { class: "timeline-detail"}, detailNodes)
			].filter(Boolean)),
		].filter(Boolean))
	]);
}