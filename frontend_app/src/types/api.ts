export type Connector = {
  id: string;
  provider: string;
  auth_method: "api_key" | "oauth" | string;
  label?: string | null;
  status: "connected" | "error" | "pending" | string;
  tenant_id: string;
  config?: Record<string, unknown>;
};

export type ConnectorListResponse = {
  items: Connector[];
  total: number;
};

export type ApiKeyAuthResponse = {
  message: string;
  provider: string;
  tenant_id: string;
  token_id: string;
};

export type OAuthInitResponse = {
  authorization_url: string;
  state: string;
};

export type OAuthCallbackResponse = {
  message: string;
  provider: string;
  tenant_id: string;
  token_id: string;
};

export type LLMToolResponse = {
  provider: string;
  tool: string;
  result: unknown;
};

export type RegistryConnector = {
  provider: string;
  display_name: string;
  auth_methods: string[];
  metadata?: Record<string, unknown>;
};

export type RegistryListResponse = {
  items: RegistryConnector[];
  total: number;
};

export type ApiResult<T> = T | { [key: string]: unknown };
