import { memo } from 'react';
import { Handle, Position } from 'reactflow';
import type { ScrapeConfig } from '@/types/flow';

interface ScrapeNodeProps {
  data: {
    label: string;
    config: ScrapeConfig;
  };
}

export const ScrapeNode = memo(({ data }: ScrapeNodeProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <Handle type="target" position={Position.Top} />
      <div className="flex flex-col gap-2">
        <div className="font-semibold text-lg">{data.label}</div>
        <div className="text-sm text-gray-600">
          <div>URL: {data.config.url}</div>
          <div>Selector: {data.config.selector}</div>
          <div>Method: {data.config.method}</div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
});

ScrapeNode.displayName = 'ScrapeNode';
