import { ConnectorClient } from "./Client";

/**
 * PUBLIC_INTERFACE
 * Connector detail page entry (Server Component).
 * Extracts dynamic route params and renders the client-side UI wrapper.
 *
 * We align with Next.js PageProps where params may be Promise-typed.
 */
type IdParams = { id: string };

export default async function Page(props: { params: Promise<IdParams> | undefined }) {
  const params = props.params ? await props.params : ({ id: "" } as IdParams);
  return <ConnectorClient id={params.id} />;
}
