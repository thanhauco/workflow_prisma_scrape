import { FlowBuilder } from '@/components/flow/flow-builder';
import { api } from '@/utils/api';

export default async function WorkflowPage({
  params,
}: {
  params: { id: string };
}) {
  const workflow = await api.workflow.getById.query({ id: params.id });

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="p-4 border-b">
        <h1 className="text-2xl font-bold">{workflow.name}</h1>
      </div>
      <div className="flex-1">
        <FlowBuilder />
      </div>
    </div>
  );
}
