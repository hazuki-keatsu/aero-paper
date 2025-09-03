import { visit } from 'unist-util-visit';
import type { Root, Blockquote, Paragraph, Text } from 'mdast';

export interface CalloutConfig {
  [key: string]: {
    icon: string;
  };
}

const defaultCallouts: CalloutConfig = {
  NOTE: {
    icon: '📝',
  },
  TIP: {
    icon: '💡',
  },
  IMPORTANT: {
    icon: '❗',
  },
  WARNING: {
    icon: '⚠️',
  },
  CAUTION: {
    icon: '🔥',
  },
  INFO: {
    icon: 'ℹ️',
  },
  SUCCESS: {
    icon: '✅',
  },
  DANGER: {
    icon: '🚫',
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
          className: `callout callout-${calloutType.toLowerCase()}`,
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
