class ErrorHandler extends Error{
    constructor(message,statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

export const errorMiddleware = (err, req , res , next) =>{
    err.message = err.message || "Internal Server Error";
    //this.statusCode = statusCode;
    err.statusCode = err.statusCode || 500;

    if(err.name === "CaseError"){
        err.message = `Resources not found , Invalid ${err.path}`;
        err= new ErrorHandler(message, 400);
    }

    if(err.name === 11000){
        err.message = `Duplicate ${Object,keys(err.keyValue)} Entered`;
        err= new ErrorHandler(message, 400);
    }
    if(err.name === "JsonWebToken"){
        err.message = `Json web Token is invalid , try again`;
        err= new ErrorHandler(message, 400);
    }
    if(err.name === "TokenExpiredError"){
        err.message =`Json web Token expired , try again`;
        err= new ErrorHandler(message, 400);
    }
    return res.status(err.statusCode).json ({
        success:false,
        message: err.message,
    });
};

export default ErrorHandler;