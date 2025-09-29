import { ConnectorClient } from "./Client";

/**
 * PUBLIC_INTERFACE
 * Connector detail page entry (Server Component).
 * Extracts dynamic route params and renders the client-side UI wrapper.
 */
export default function ConnectorDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  return <ConnectorClient id={id} />;
}
