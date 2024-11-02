import { useCallback } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import { NodePicker } from './controls/node-picker';
import { FlowControls } from './controls/flow-controls';
import { ScrapeNode } from './nodes/scrape-node';
import { TransformNode } from './nodes/transform-node';
import { OutputNode } from './nodes/output-node';
import { useWorkflow } from '@/hooks/use-workflow';
import 'reactflow/dist/style.css';

const nodeTypes = {
  scrape: ScrapeNode,
  transform: TransformNode,
  output: OutputNode,
};

export const FlowBuilder = () => {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect } = useWorkflow();

  return (
    <div className="h-screen w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Background />
        <Controls />
        <NodePicker />
        <FlowControls />
      </ReactFlow>
    </div>
  );
};
