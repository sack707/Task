'use client';

import React from 'react';
import { Badge } from '../ui/badge';
import { TaskPriority } from '../../types';
import { AlertTriangle, ArrowUp, ArrowDown } from 'lucide-react';

export function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  switch (priority) {
    case 'HIGH':
      return (
        <Badge variant="danger" size="sm">
          <AlertTriangle className="w-3 h-3" /> High
        </Badge>
      );
    case 'MEDIUM':
      return (
        <Badge variant="info" size="sm">
          <ArrowUp className="w-3 h-3" /> Medium
        </Badge>
      );
    case 'LOW':
    default:
      return (
        <Badge variant="outline" size="sm">
          <ArrowDown className="w-3 h-3" /> Low
        </Badge>
      );
  }
}
