type Props = {
  params: {
    workspaceId: string;
  };
};

export default async function WorkspacePage({ params }: Props) {
  const { workspaceId } = params;

  return (
    <main>
      <p>ID: {workspaceId}</p>
    </main>
  );
}
