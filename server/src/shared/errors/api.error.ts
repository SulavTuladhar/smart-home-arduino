export abstract class ApiError extends Error {
    constructor(
        message: string,
        public readonly statusCode: number,
        public readonly details?: unknown
    ){
        super(message);

        this.name = new.target.name;

        Object.setPrototypeOf(this, new.target.prototype)

        Error.captureStackTrace(
            this,
            new.target
        );
    }

}