import { ObjectId } from "mongoose";

//DateScalar
import { DateScalar } from "src/date.scalar";

export interface ReqUser {
    _id: ObjectId;
    name: string;
    phone: string;
    email: string;
    verified: boolean;
    role: string;
    createdAt: DateScalar;
    updatedAt: DateScalar;
}