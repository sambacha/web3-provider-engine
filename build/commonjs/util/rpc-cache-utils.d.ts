export declare function cacheIdentifierForPayload(payload: any, opts?: any): string;
export declare function canCache(payload: any): boolean;
export declare function blockTagForPayload(payload: any): any;
export declare function paramsWithoutBlockTag(payload: any): any;
export declare function blockTagParamIndex(payload: any): 1 | 0 | 2;
export declare function cacheTypeForPayload(payload: any): "fork" | "block" | "perma" | "never";
