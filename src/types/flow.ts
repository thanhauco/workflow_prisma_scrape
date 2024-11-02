export interface Node {
  id: string;
  type: 'scrape' | 'transform' | 'output';
  position: { x: number; y: number };
  data: NodeData;
}

export interface NodeData {
  label: string;
  config: ScrapeConfig | TransformConfig | OutputConfig;
}

export interface ScrapeConfig {
  url: string;
  selector: string;
  method: 'GET' | 'POST';
  headers?: Record<string, string>;
}

export interface TransformConfig {
  type: 'map' | 'filter' | 'reduce';
  function: string;
}

export interface OutputConfig {
  type: 'file' | 'database' | 'api';
  format: 'json' | 'csv' | 'xml';
  destination: string;
}

export interface Edge {
  id: string;
  source: string;
  target: string;
}
