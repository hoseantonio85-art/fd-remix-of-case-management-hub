import React from 'react';

import { EIconName } from '@/icons';

export interface INoticeProps {
  title: React.ReactNode;
  description?: string;
  opened?: boolean;
  iconName?: EIconName;
}
