import { type Theme } from '@emotion/react';

export const getIconColorForObjectType = ({
  objectType,
  theme,
}: {
  objectType: string;
  theme: Theme;
}): string => {
  switch (objectType) {
    case 'note':
      return theme.color.yellow;
    case 'task':
      return theme.color.blue;
    case 'warehouse':
      return theme.color.purple;
    case 'inventory':
      return theme.color.orange;
    default:
      return 'currentColor';
  }
};
