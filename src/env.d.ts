/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_LOCAL_PUBLIC_FOLDER: string;
  // その他の環境変数...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
