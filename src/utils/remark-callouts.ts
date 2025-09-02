import { visit } from 'unist-util-visit';
import type { Root, Blockquote, Paragraph, Text } from 'mdast';

export interface CalloutConfig {
  [key: string]: {
    icon: string;
    color: string;
    bgColor: string;
    borderColor: string;
  };
}

const defaultCallouts: CalloutConfig = {
  NOTE: {
    icon: '📝',
    color: 'text-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-l-blue-500',
  },
  TIP: {
    icon: '💡',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-l-green-500',
  },
  IMPORTANT: {
    icon: '❗',
    color: 'text-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-l-purple-500',
  },
  WARNING: {
    icon: '⚠️',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-l-yellow-500',
  },
  CAUTION: {
    icon: '🔥',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-l-red-500',
  },
  INFO: {
    icon: 'ℹ️',
    color: 'text-cyan-700',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-l-cyan-500',
  },
  SUCCESS: {
    icon: '✅',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-l-green-500',
  },
  DANGER: {
    icon: '🚫',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-l-red-500',
  },
};

const remarkCallouts = (callouts: CalloutConfig = defaultCallouts) => {
  return (tree: Root) => {
    visit(tree, 'blockquote', (node: Blockquote, index: number | undefined, parent: any) => {
      const firstChild = node.children[0];
      if (firstChild?.type !== 'paragraph') return;

      const paragraph = firstChild as Paragraph;
      const firstText = paragraph.children[0];
      if (firstText?.type !== 'text') return;

      const text = firstText as Text;
      const match = text.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION|INFO|SUCCESS|DANGER)\]\s*/);
      
      if (!match) return;

      const calloutType = match[1];
      const config = callouts[calloutType];
      if (!config) return;

      // Remove the callout syntax from the text
      text.value = text.value.replace(match[0], '');
      
      // If the text becomes empty, remove it
      if (text.value === '') {
        paragraph.children.shift();
      }

      // Transform the blockquote into a custom callout
      (node as any).data = {
        hName: 'div',
        hProperties: {
          className: `callout callout-${calloutType.toLowerCase()} ${config.bgColor} ${config.borderColor} ${config.color}`,
          'data-callout': calloutType.toLowerCase(),
        },
      };

      // Add the icon and title
      const titleParagraph: Paragraph = {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            value: `${config.icon} ${calloutType}`,
          },
        ],
        data: {
          hName: 'div',
          hProperties: {
            className: 'callout-title',
          },
        },
      };

      // Add content wrapper
      const contentDiv = {
        type: 'div' as const,
        children: node.children,
        data: {
          hName: 'div',
          hProperties: {
            className: 'callout-content',
          },
        },
      };

      node.children = [titleParagraph, contentDiv as any];
    });
  };
};

export default remarkCallouts;
