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
    case 'quotation':
      return theme.color.blue;
    case 'quotationItem':
      return theme.color.turquoise;
    case 'materialPurchaseRequest':
      return theme.color.green;
    case 'materialOrder':
      return theme.color.purple;
    case 'materialPrice':
      return theme.color.green;
    case 'materialPriceHistory':
      return theme.color.yellow;
    case 'priceContract':
      return theme.color.blue;
    case 'materialRequest':
      return theme.color.turquoise;
    case 'materialApproval':
      return theme.color.green;
    case 'boQ':
      return theme.color.orange;
    default:
      return 'currentColor';
  }
};
