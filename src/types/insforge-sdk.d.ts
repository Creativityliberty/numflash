declare module '@insforge/sdk' {
  export function createClient(options: { baseUrl: string; anonKey?: string; edgeFunctionToken?: string }): InsForgeClient;

  export interface InsForgeClient {
    database: {
      from<T = any>(table: string): QueryBuilder<T>;
      rpc<T = any>(functionName: string, args?: any): Promise<{ data: T | null; error: any }>;
    };
    auth: {
      getCurrentSession(): Promise<{ data: { session: { user: { id: string } } | null }; error: any }>;
      signInWithOAuth(options: { provider: string; redirectTo?: string }): Promise<{ data: { url: string }; error: any }>;
    };
    storage: {
      from(bucket: string): StorageBucket;
    };
    ai: {
      chat: {
        completions: {
          create(options: {
            model: string;
            messages: Array<{ role: string; content: string }>;
            stream?: boolean;
            response_format?: { type: 'json_object' };
          }): Promise<any>;
        };
      };
    };
    realtime: {
      connect(): Promise<void>;
      disconnect(): void;
      subscribe(channel: string): Promise<{ ok: boolean }>;
      unsubscribe(channel: string): void;
      publish(channel: string, event: string, payload: any): Promise<void>;
      on(event: string, callback: (payload: any) => void): void;
      off(event: string, callback: (payload: any) => void): void;
    };
    functions: {
      invoke<T = any>(functionName: string, options?: { body?: any; method?: string }): Promise<{ data: T | null; error: any }>;
    };
  }

  interface QueryBuilder<T> {
    select(columns?: string): QueryBuilder<T>;
    eq(column: string, value: any): QueryBuilder<T>;
    insert(values: any[]): Promise<{ data: T[] | null; error: any }>;
    update(values: any): QueryBuilder<T>;
    delete(): QueryBuilder<T>;
    single(): Promise<{ data: T | null; error: any }>;
    order(column: string, options?: { ascending: boolean }): QueryBuilder<T>;
    then<R>(onfulfilled?: (value: { data: T[] | null; error: any }) => R | PromiseLike<R>): Promise<R>;
  }

  interface StorageBucket {
    upload(path: string, file: Blob | File): Promise<{ data: { key: string; url: string }; error: any }>;
    uploadAuto(file: Blob | File): Promise<{ data: { key: string; url: string }; error: any }>;
    download(path: string): Promise<{ data: Blob | null; error: any }>;
  }
}

declare module '@insforge/nextjs';
