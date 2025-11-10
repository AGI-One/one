//the higher the number, the higher the priority
export const STANDARD_OBJECTS_BY_PRIORITY_RANK = {
  person: 5,
  company: 4,
  opportunity: 3,
  product: 3, // High priority - core inventory item
  employee: 2,
  note: 2,
  productVariant: 2, // Medium priority - SKU level
  task: 1,
  department: 1,
  team: 1,
  productCategory: 1, // Low priority - organizational
  productOptionGroup: 0, // Lowest priority - configuration
  productOption: 0, // Lowest priority - configuration
  warehouse: 2, // Medium priority - inventory location
  organizationPosition: 0,
  employeeLevel: 0,
  employmentType: 0,
  employeeAward: 0,
};
