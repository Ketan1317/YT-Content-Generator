export const RunStatus = async (runId: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_INNGEST_SERVER_URL}/${runId}/runs`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_INNGEST_SIGNING_KEY}`,
    },
  });

  const json = await res.json();
  return json.data;
};
