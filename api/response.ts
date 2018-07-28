class Response {
    public error: Array<String>;
    public result: Array<any>;
    public message: Array<String>;
    constructor() {
        this.error = []
        this.result = []
        this.message = []
    }
}

export default Response;