export const STATUS = {
  active: "active",
  inactive: "inactive",
  deleted: "deleted",
} as const;
export type IStatus = (typeof STATUS)[keyof typeof STATUS];
