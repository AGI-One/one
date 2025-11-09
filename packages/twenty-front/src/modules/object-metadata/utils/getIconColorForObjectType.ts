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
    case 'employee':
      return theme.color.blue;
    case 'department':
      return theme.color.purple;
    case 'team':
      return theme.color.green;
    case 'organizationPosition':
      return theme.color.orange;
    case 'employmentType':
      return theme.color.turquoise;
    case 'employeeLevel':
      return theme.color.red;
    case 'employeeAward':
      return theme.color.yellow;
    default:
      return 'currentColor';
  }
};
