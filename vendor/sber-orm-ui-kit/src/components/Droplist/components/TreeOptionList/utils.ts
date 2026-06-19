import { Options } from '@v-uik/combo-box';
import { ListItemProps } from '@v-uik/list';

export const findNodeKeysToExpand = (
  selectedNodes: Options<ListItemProps<'li'>>,
  nodes: Options<ListItemProps<'li'>>,
  path: React.Key[] = [],
): React.Key[] => {
  const keysSet = new Set<React.Key>();

  if (!nodes) {
    return [];
  }

  for (const node of nodes) {
    if (selectedNodes.some((selectedNode) => node.key === selectedNode.key)) {
      for (const item of path) {
        keysSet.add(item);
      }
    }
    if (node.children) {
      const childKeys = findNodeKeysToExpand(
        selectedNodes,
        node.children as Options<ListItemProps<'li'>>,
        [...path, node.key as React.Key],
      );

      for (const item of childKeys) {
        keysSet.add(item);
      }
    }
  }

  return [...keysSet];
};
