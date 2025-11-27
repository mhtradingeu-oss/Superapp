export type NotificationFilters = {
  status?: string;
  brandId?: string;
  type?: string;
  page?: number;
  pageSize?: number;
};

export type CreateNotificationInput = {
  userId?: string;
  brandId?: string;
  type?: string;
  title: string;
  message: string;
  data?: Record<string, unknown>;
  status?: string;
};

export type NotificationRecord = {
  id: string;
  brandId?: string;
  userId?: string;
  type?: string;
  title: string;
  message: string;
  status?: string;
  createdAt: Date;
  readAt?: Date;
  data?: Record<string, unknown>;
};
