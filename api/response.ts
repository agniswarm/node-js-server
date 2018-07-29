class Response {
    public error: Array<String>;
    public result: Array<any>;
    public message: Array<String>;
    public token: String;
    constructor() {
        this.error = []
        this.result = []
        this.message = []
        this.token = "";
    }
}

export default Response;
