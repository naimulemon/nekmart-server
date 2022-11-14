import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { GqlExecutionContext } from "@nestjs/graphql";
import * as jwt from "jsonwebtoken";

//Schema and Model
import { User, UserDocument } from "src/user/model/user.schema";

//Base
import { base64ToString } from "src/helpers/base";

@Injectable()
export class AuthGuard implements CanActivate {
    //Constructor
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }
    async canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context).getContext();
        if (!ctx.headers.authorization) {
            return false;
        }
        ctx.user = await this.validToken(ctx.headers.authorization);
        return true;
    }

    //Valid token
    async validToken(auth: String) {
        if (auth.split(' ')[0] !== 'Bearer') {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        const token = auth.split(' ')[1];
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
            const emailOrPhone = base64ToString((decode as jwt.JwtPayload).info);
            const user = await this.userModel.findOne({
                $or: [{
                    phone: emailOrPhone
                }, {
                    email: emailOrPhone
                }]
            });
            if (!user) throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
            return user;
        } catch (err) {
            throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
    }
}