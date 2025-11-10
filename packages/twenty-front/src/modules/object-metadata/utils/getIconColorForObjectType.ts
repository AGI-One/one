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
    case 'product':
      return theme.color.purple; // Main product - purple for premium feel
    case 'productCategory':
      return theme.color.blue; // Category - blue for organization
    case 'productVariant':
      return theme.color.orange; // Variant/SKU - orange for inventory
    case 'productOption':
      return theme.color.green; // Option - green for choices
    case 'productOptionGroup':
      return theme.color.green; // Option Group - green (same family)
    case 'productOptionGroupLink':
      return theme.color.turquoise; // Junction - turquoise for linking
    case 'productVariantOptionValue':
      return theme.color.yellow; // Junction - yellow for values
    case 'warehouse':
      return theme.color.purple; // Warehouse - purple for facilities
    case 'inventory':
      return theme.color.orange; // Inventory - orange for stock tracking
    default:
      return 'currentColor';
  }
};
