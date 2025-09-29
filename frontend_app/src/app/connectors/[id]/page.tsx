import { ConnectorClient } from "./Client";

/**
 * PUBLIC_INTERFACE
 * Connector detail page entry (Server Component).
 * Extracts dynamic route params and renders the client-side UI wrapper.
 *
 * Use a minimal prop type to avoid PageProps constraint conflicts in this environment.
 */
type RouteParams = { id: string };
type RouteProps = { params: RouteParams };

export default function Page(props: RouteProps) {
  const { id } = props.params;
  return <ConnectorClient id={id} />;
}
