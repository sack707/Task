'use client';

import React from 'react';
import { Badge } from '../ui/badge';
import { TaskStatus } from '../../types';
import { CheckCircle2, Clock, CircleDashed } from 'lucide-react';

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  switch (status) {
    case 'DONE':
      return (
        <Badge variant="success" size="sm">
          <CheckCircle2 className="w-3 h-3" /> Completed
        </Badge>
      );
    case 'IN_PROGRESS':
      return (
        <Badge variant="warning" size="sm">
          <Clock className="w-3 h-3" /> In Progress
        </Badge>
      );
    case 'TODO':
    default:
      return (
        <Badge variant="default" size="sm">
          <CircleDashed className="w-3 h-3" /> To Do
        </Badge>
      );
  }
}
