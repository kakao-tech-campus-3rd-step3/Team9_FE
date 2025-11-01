declare module 'sockjs-client' {
  interface SockJSOptions {
    server?: string;
    sessionId?: number | (() => number);
    transports?: string | string[];
    timeout?: number;
    devel?: boolean;
    debug?: boolean;
    protocol_whitelist?: string[];
    info?: {
      websocket?: boolean;
      cookie_needed?: boolean;
      null_origin?: boolean;
    };
  }

  interface SockJS extends EventTarget {
    readyState: number;
    url: string;
    protocol: string;
    extensions: string;
    bufferedAmount: number;
    onopen: ((event: Event) => void) | null;
    onclose: ((event: CloseEvent) => void) | null;
    onmessage: ((event: MessageEvent) => void) | null;
    onerror: ((event: Event) => void) | null;
    send(data: string | ArrayBuffer | Blob): void;
    close(code?: number, reason?: string): void;
  }

  interface SockJSConstructor {
    new (
      url: string,
      protocols?: string | string[],
      options?: SockJSOptions,
    ): SockJS;
    (
      url: string,
      protocols?: string | string[],
      options?: SockJSOptions,
    ): SockJS;
    CONNECTING: number;
    OPEN: number;
    CLOSING: number;
    CLOSED: number;
  }

  const SockJS: SockJSConstructor;
  export = SockJS;
}
