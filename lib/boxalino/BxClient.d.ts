import { BxChooseResponse } from './BxChooseResponse';
export declare class BxClient {
    private account;
    private password;
    private isDev;
    private host;
    private apiKey;
    private apiSecret;
    private port;
    private uri;
    private schema;
    private p13n_username;
    private p13n_password;
    private domain;
    private isTest;
    private debugOutput;
    private debugOutputActive;
    private autocompleteRequests;
    private autocompleteResponses;
    private chooseRequests;
    private chooseResponses;
    private bundleChooseRequests;
    private _timeout;
    private requestContextParameters;
    private sessionId;
    private profileId;
    private requestMap;
    private socketHost;
    private socketPort;
    private socketSendTimeout;
    private socketRecvTimeout;
    private notifications;
    private request;
    private choiceIdOverwrite;
    constructor(account: string, password: string, domain: string, isDev?: boolean, host?: string, request?: {}, port?: number, uri?: string, schema?: string, p13n_username?: string, p13n_password?: string, apiKey?: any, apiSecret?: any);
    setHost(host: any): void;
    setApiKey(apiKey: any): void;
    setApiSecret(apiSecret: any): void;
    setTestMode(isTest: any): void;
    setSocket(socketHost: any, socketPort?: any, socketSendTimeout?: any, socketRecvTimeout?: any): void;
    setRequestMap(requestMap: any): void;
    getChoiceIdOverwrite(): any;
    getRequestMap(): any;
    addToRequestMap(key: any, value: any): void;
    getAccount(checkDev?: boolean): string;
    getUsername(): string;
    getPassword(): string;
    getApiKey(): any;
    getApiSecret(): any;
    setSessionAndProfile(sessionId: string, profileId: string): void;
    getSessionAndProfile(): any[];
    private getUserRecord;
    private getP13n;
    getChoiceRequest(inquiries: any, requestContext?: any): any;
    protected getIP(): any;
    protected getCurrentURL(): string;
    forwardRequestMapAsContextParameters(filterPrefix?: any, setPrefix?: any): void;
    addRequestContextParameter(name: any, values: any): void;
    resetRequestContextParameter(): void;
    protected getBasicRequestContextParameters(): {
        'User-Agent': string[];
        'User-Host': any[];
        'User-SessionId': any[];
        'User-Referer': string[];
        'User-URL': string[];
        'X-BX-PROFILEID': any[];
    };
    getRequestContextParameters(): any;
    protected getRequestContext(): any;
    private throwCorrectP13nException;
    private p13nchoose;
    private p13nchooseAll;
    addRequest(request: any): number;
    addBundleRequest(requests: any): void;
    resetRequests(): void;
    getRequest(index?: number): any;
    getChoiceIdRecommendationRequest(choiceId: any): null;
    getRecommendationRequests(): any;
    getThriftChoiceRequest(size?: number): any;
    getBundleChoiceRequest(inquiries: any, requestContext?: any): any;
    getThriftBundleChoiceRequest(): any;
    choose(chooseAll?: boolean, size?: number): Promise<void>;
    flushResponses(): void;
    getResponse(chooseAll?: boolean): Promise<BxChooseResponse>;
    getNotificationMode(): boolean;
    setAutocompleteRequest(request: any): void;
    setAutocompleteRequests(requests: any): void;
    private enhanceAutoCompleterequest;
    private p13nautocomplete;
    autocomplete(): Promise<void>;
    getAutocompleteResponse(): any;
    private p13nautocompleteAll;
    getAutocompleteResponses(): any;
    setTimeout(timeout: any): this;
    getDebugOutput(): any;
    setDebugOutputActive(debugOutputActive: any): void;
    notifyWarning(warning: any): void;
    addNotification(type: any, notification: any): void;
    getNotifications(): Promise<any>;
    finalNotificationCheck(force?: boolean, requestMapKey?: string): any;
}
