import { Node, Edge } from './flow';

export interface Workflow {
  id: string;
  name: string;
  description?: string;
  nodes: Node[];
  edges: Edge[];
  userId: string;
  isPublic: boolean;
  lastRunAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
