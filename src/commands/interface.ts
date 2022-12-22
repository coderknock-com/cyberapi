export interface KVParam {
    key: string;
    value: string;
    enabled: boolean;

    [key: string]: unknown;
}