declare type FetchFunction = typeof window.fetch;
declare type CreateUseFetch = (fetch?: FetchFunction) => UseFetch;
interface Export extends UseFetch {
    createUseFetch: CreateUseFetch;
    default: UseFetch;
}
declare type FetchResponse = Object | string;
interface FetchResponseMetadata {
    bodyUsed: boolean;
    contentType: null | string;
    headers: Headers;
    ok: boolean;
    redirected: boolean;
    response: FetchResponse;
    status: number;
    statusText: string;
    url: string;
}
interface Options {
    evict?: true;
    lifespan?: number;
    metadata?: boolean;
}
interface OptionsWithMetadata extends Options {
    metadata: true;
}
interface OptionsWithoutMetadata extends Options {
    metadata?: false;
}
interface UseFetch {
    (input: RequestInfo, init?: RequestInit | undefined, options?: number | OptionsWithoutMetadata): FetchResponse;
    (input: RequestInfo, init: RequestInit | undefined, options: OptionsWithMetadata): FetchResponseMetadata;
}
declare const _export: Export;
export = _export;
