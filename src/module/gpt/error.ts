export class HTTPError extends Error {
    public readonly status: number;
    public readonly statusText: string;
    public readonly response: Response;
    public readonly hint: any;

    constructor(
        response: Response,
        hint: any = null,
        message?: string
    ) {
        super(message || `HTTP ${response.status} ${response.statusText}`);
        this.name = 'HTTPError';
        Object.setPrototypeOf(this, new.target.prototype);

        this.status = response.status;
        this.statusText = response.statusText;
        this.response = response;
        this.hint = hint;
    }
}

export class StreamError extends Error {
    constructor(message: string, options?: ErrorOptions) {
        super(message, options);
        this.name = 'StreamError';

        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export class ParseError extends Error {
    public readonly data: any;

    constructor(data: any, options?: ErrorOptions) {
        super('Failed to parse stream response.', options);
        this.name = 'ParseError';

        Object.setPrototypeOf(this, new.target.prototype);
        this.data = data;
    }
}