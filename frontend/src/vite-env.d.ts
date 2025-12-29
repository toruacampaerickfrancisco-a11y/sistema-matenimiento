/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_SOCKET_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_COMPANY_NAME: string;
  readonly VITE_COMPANY_FULL_NAME: string;
  readonly VITE_COMPANY_ADDRESS: string;
  readonly VITE_COMPANY_PHONE: string;
  readonly VITE_COMPANY_EMAIL: string;
  readonly VITE_MAX_FILE_SIZE: string;
  readonly VITE_ALLOWED_FILE_TYPES: string;
  readonly VITE_TICKET_PREFIX: string;
  readonly VITE_DEBUG: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}