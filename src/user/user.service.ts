import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, ObjectId } from "mongoose";
import * as otpGenerator from "otp-generator";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import { OAuth2Client, LoginTicket } from "google-auth-library";
import axios from "axios";
import omitEmpty from "omit-empty";

//StringBase
import { stringToBase64 } from "src/helpers/base";

//Schema
import { User, UserDocument } from "./model/user.schema";

//Entity
import { SuccessInfo } from "./entities/success.entity";
import { SignupInfo } from "./entities/signup.entity";
import { RegisterInfo } from "./entities/register.entity";

//Google oAuth Authentication
const client = new OAuth2Client(
    "342777733000-ceu60md3s942jl51a41pemje6s9jcfav.apps.googleusercontent.com",
    "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",
    "postmessage"
);

//Dto
import { SignupInput } from "./dto/signup.dto";
import { VerifyPhoneInput } from "./dto/verify-phone.dto";
import { LoginInput } from "./dto/login.dto";
import { GoogleInput } from "./dto/google.dto";
import { FacebookInput } from "./dto/facebook.dto";
import { UpdateUserInput } from "./dto/update.dto";
import { ChangePassowrdInput } from "./dto/change-password.dto";
import { ForgetPasswordInput } from "./dto/forget-password.dto";
import { ResetPasswordInput } from "./dto/reset-password.dto";
import { PhoneInput } from "./dto/phone.dto";
import { RoleInput } from "./dto/role.dto";

//Req User Types
import { ReqUser } from "src/auth/types/user.types";
import { UserPrams } from "./dto/get-users.dto";

@Injectable()
export class UserService {
    //Constructor
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>
    ) { };

    //Get Profile
    async getProfile(reqUser: ReqUser) {
        const user = await this.userModel.findById(reqUser._id);
        return user;
    };

    //Get Users
    async getUsers(userPrams: UserPrams) {
        let users = await this.userModel.find({
            $or: [{
                phone: {
                    '$regex': userPrams.search ? new RegExp(userPrams.search.replace("+", "").replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")) : "",
                    '$options': 'i',
                    '$nin': "8801611994403"
                }
            }, {
                email: {
                    '$regex': userPrams.search ? new RegExp(userPrams.search.replace("+", "").replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")) : "",
                    '$options': 'i',
                    '$nin': "siamahnaf198@gmail.com"
                }
            }]
        }).sort({ _id: -1 }).limit(userPrams.limit + 1).skip(userPrams.skip);
        const count = await this.userModel.countDocuments({
            $or: [{
                phone: {
                    '$regex': userPrams.search ? new RegExp(userPrams.search.replace("+", "").replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")) : "",
                    '$options': 'i',
                    '$nin': "8801611994403"
                }
            }, {
                email: {
                    '$regex': userPrams.search ? new RegExp(userPrams.search.replace("+", "").replace(/[-[\]{}()*+?.,\\/^$|#\s]/g, "\\$&")) : "",
                    '$options': 'i',
                    '$nin': "siamahnaf198@gmail.com"
                }
            }]
        });
        const hasNextPage = users.length > userPrams.limit;
        users = hasNextPage ? users.slice(0, -1) : users;
        return {
            success: true,
            users,
            pageInfos: {
                hasNextPage,
                count
            }
        }
    }

    //Signup
    async signup(signupInput: SignupInput): Promise<SignupInfo> {
        signupInput = await omitEmpty(signupInput) as SignupInput;
        const user = await this.userModel.findOne({
            $or: [{
                phone: signupInput.phone
            }, {
                email: {
                    $exists: true,
                    $eq: signupInput.email
                }
            }]
        });
        if (user) throw new NotFoundException("User already registered!");
        let otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        const greenwebsms = new URLSearchParams();
        greenwebsms.append('token', process.env.SMS_TOKEN);
        greenwebsms.append('to', `+${signupInput.phone}`);
        greenwebsms.append('message', `${otp} is your security code for nekmart. Do not share security code with others. This code will be expired in 5 minutes.`);
        const { data } = await axios.post('http://api.greenweb.com.bd/api.php', greenwebsms)
        if (data.includes("Error")) throw new NotFoundException("Number is wrong!")
        console.log(otp)
        const password = await bcrypt.hash(signupInput.password, 12);
        otp = await bcrypt.hash(otp, 12);
        await this.userModel.create({
            ...signupInput,
            password: password,
            otp
        })
        return {
            success: true,
            message: "Code sent to your phone successfully!",
            phone: signupInput.phone
        }
    };

    //Resend otp
    async resend(phone: string) {
        const user = await this.userModel.findOne({
            phone: phone
        }).select("+otp");
        if (!user) throw new NotFoundException("User not found!");
        let otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        const greenwebsms = new URLSearchParams();
        greenwebsms.append('token', process.env.SMS_TOKEN);
        greenwebsms.append('to', `+${phone}`);
        greenwebsms.append('message', `${otp} is your security code for nekmart. Do not share security code with others. This code will be expired in 5 minutes.`);
        const { data } = await axios.post('http://api.greenweb.com.bd/api.php', greenwebsms)
        if (data.includes("Error")) throw new NotFoundException("Number is wrong!");
        user.otp = await bcrypt.hash(otp, 12);
        await user.save();
        return {
            success: true,
            message: "Otp send successfully!"
        }
    }

    //Phone login
    async phoneLogin(phone: string): Promise<SignupInfo> {
        const user = await this.userModel.findOne({
            phone: phone
        });
        let otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        const greenwebsms = new URLSearchParams();
        greenwebsms.append('token', process.env.SMS_TOKEN);
        greenwebsms.append('to', `+${phone}`);
        greenwebsms.append('message', `${otp} is your security code for nekmart. Do not share security code with others. This code will be expired in 5 minutes.`);
        const { data } = await axios.post('http://api.greenweb.com.bd/api.php', greenwebsms)
        if (data.includes("Error")) throw new NotFoundException("Number is wrong!");
        const hashOtp = await bcrypt.hash(otp, 12);
        if (user) {
            user.otp = hashOtp;
            await user.save();
        } else {
            await this.userModel.create({ phone: phone, otp: hashOtp });
        }
        return {
            success: true,
            message: "Code send successfully!",
            phone,
        }
    }

    //Verify Phone
    async verify(verifyPhoneInput: VerifyPhoneInput): Promise<RegisterInfo> {
        const user = await this.userModel.findOne({
            phone: verifyPhoneInput.phone
        }).select("+otp");
        if (!user) throw new NotFoundException("You use an expired code!");
        const verifyOtp = await bcrypt.compare(verifyPhoneInput.otp, user.otp);
        if (!verifyOtp) throw new NotFoundException("You use wrong code!");
        const token = jwt.sign({
            info: stringToBase64(verifyPhoneInput.phone),
        }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        let expire: any = new Date();
        user.verified = true;
        user.otp = "";
        await user.save();
        expire.setDate(expire.getDate() + 30);
        return {
            success: true,
            message: "User registered successfully!",
            token,
            expire
        }
    };

    //Login with phone or password
    async login(loginInput: LoginInput): Promise<RegisterInfo> {
        const user = await this.userModel.findOne({
            $or: [{
                phone: loginInput.phoneOrEmail
            }, {
                email: loginInput.phoneOrEmail
            }]
        }).select("+password");
        if (!user) throw new NotFoundException("Wrong email or password!");
        const verifyPass = await bcrypt.compare(loginInput.password, user.password);
        if (!verifyPass) throw new NotFoundException("Wrong email or password!");
        const token = jwt.sign({
            info: stringToBase64(user.phone)
        }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        let expire: any = new Date();
        expire.setDate(expire.getDate() + 30);
        return {
            success: true,
            message: "User login successfully!",
            token,
            expire
        }
    };

    //Login with email and password for admin
    async adminLogin(loginInput: LoginInput): Promise<RegisterInfo> {
        const user = await this.userModel.findOne({
            $or: [{
                phone: loginInput.phoneOrEmail
            }, {
                email: loginInput.phoneOrEmail
            }]
        }).select("+password");
        if (!user) throw new NotFoundException("Wrong email or password!");
        const verifyPass = await bcrypt.compare(loginInput.password, user.password);
        if (!verifyPass) throw new NotFoundException("Wrong email or password!");
        if (user.role === "user") throw new NotFoundException("You can't login here!");
        const token = jwt.sign({
            info: stringToBase64(user.phone)
        }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        let expire: any = new Date();
        expire.setDate(expire.getDate() + 30);
        return {
            success: true,
            message: "User login successfully!",
            token,
            expire
        }
    }

    //Login or signup with google service
    async google({ code, idToken }: GoogleInput) {
        if (code && idToken) throw new NotFoundException("You can sent only code or idToken")
        let id_token
        if (code) {
            const { tokens } = await client.getToken(code)
            id_token = tokens.id_token
        } else {
            id_token = idToken
        }
        const clientId = process.env.GOOGLE_ID
        const ticket: LoginTicket = await client.verifyIdToken({ idToken: id_token, audience: clientId });
        const payload = ticket.getPayload();
        const user = await this.userModel.findOne({
            email: payload.email
        })
        let expire: any = new Date();
        expire.setDate(expire.getDate() + 30);
        const token = jwt.sign({
            info: stringToBase64(payload.email),
        }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        if (!user) {
            await this.userModel.create({
                name: payload.name,
                email: payload.email,
                verified: true,
                avatar: payload.picture,
                provider: {
                    name: payload.iss,
                    id: payload.sub
                }
            });
            return {
                success: true,
                message: "Authentication successful!",
                token,
                expire
            }
        } else {
            return {
                success: true,
                message: "Authentication successful!",
                token,
                expire
            }
        }
    };

    //Login or signup with facebook service
    async facebook({ userId, accessToken }: FacebookInput): Promise<RegisterInfo> {
        let urlGraphFacebook = `https://graph.facebook.com/v2.11/${userId}/?fields=id,name,picture,email&access_token=${accessToken}`;
        const { data } = await axios.get(urlGraphFacebook);
        const user = await this.userModel.findOne({
            email: data.id
        })
        let expire: any = new Date();
        expire.setDate(expire.getDate() + 30);
        const token = jwt.sign({
            info: stringToBase64(data.id),
        }, process.env.JWT_SECRET_KEY, { expiresIn: "30d" });
        if (!user) {
            await this.userModel.create({
                name: data.name,
                email: data.id,
                avatar: data.picture.data.url,
                verified: true,
                provider: {
                    name: "graph.facebook.com",
                    id: data.id
                }
            })
            return {
                success: true,
                message: "Authentication successful!",
                token,
                expire
            }
        } else {
            return {
                success: true,
                message: "Authentication successful!",
                token,
                expire
            }
        }
    };

    //Update Profile
    async update(updateUserInput: UpdateUserInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const user = await this.userModel.findById(reqUser._id);
        if (!user) throw new NotFoundException("User update failed!");
        if (user.email !== updateUserInput.email) {
            const hasEmail = await this.userModel.findOne({
                email: updateUserInput.email
            })
            if (hasEmail) throw new NotFoundException("Email is already in use!")
        }
        await this.userModel.findByIdAndUpdate(reqUser._id, updateUserInput, { new: true });
        return {
            success: true,
            message: "User updated successfully!"
        }
    };

    //Change Password
    async changePassword(chanegPasswordInput: ChangePassowrdInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const user = await this.userModel.findOne({
            _id: reqUser._id
        }).select("+password");
        const verifyPass = await bcrypt.compare(chanegPasswordInput.oldPassword, user.password);
        if (!verifyPass) throw new NotFoundException("Your password is wrong");
        user.password = await bcrypt.hash(chanegPasswordInput.newPassword, 12);
        await user.save();
        return {
            success: true,
            message: "Password changed successfully!"
        }
    };

    //Forget Password
    async forgetPassword(forgetPasswordInput: ForgetPasswordInput): Promise<SignupInfo> {
        const user = await this.userModel.findOne({
            phone: forgetPasswordInput.phone
        });
        if (!user) throw new NotFoundException("No user found with this phone!");
        let otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        const greenwebsms = new URLSearchParams();
        greenwebsms.append('token', process.env.SMS_TOKEN);
        greenwebsms.append('to', `+${forgetPasswordInput.phone}`);
        greenwebsms.append('message', `${otp} is your security code for nekmart. Do not share security code with others. This code will be expired in 5 minutes.`);
        const { data } = await axios.post('http://api.greenweb.com.bd/api.php', greenwebsms);
        if (data.includes("Error")) throw new NotFoundException("Number is wrong!");
        otp = await bcrypt.hash(otp, 12);
        user.otp = otp;
        await user.save();
        return {
            success: true,
            message: "Verification code sent successfully!",
            phone: forgetPasswordInput.phone
        }
    };

    //Reset Password
    async resetPassword(resetPasswordInput: ResetPasswordInput): Promise<SuccessInfo> {
        const user = await this.userModel.findOne({
            phone: resetPasswordInput.phone
        }).select("+otp").select("+password");
        if (!user) throw new NotFoundException("No user found with this phone!");
        if (user.otp === "") throw new NotFoundException("Something went wrong!")
        const verifyOtp = await bcrypt.compare(resetPasswordInput.code, user.otp);
        if (!verifyOtp) throw new NotFoundException("You use wrong code!");
        user.password = await bcrypt.hash(resetPasswordInput.password, 12);
        user.otp = "";
        await user.save();
        return {
            success: true,
            message: "Password resets successfully!"
        }
    };

    //Phone Availability
    async available(phoneInput: PhoneInput): Promise<SuccessInfo> {
        const user = await this.userModel.findOne({
            phone: phoneInput.phone
        });
        if (user) return {
            success: false,
            message: "Phone is already in use!"
        }
        return {
            success: true,
            message: "Phone can be used!"
        }
    };

    //Phone Change
    async phoneChange(phoneInput: PhoneInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const user = await this.userModel.findOne({
            phone: phoneInput.phone
        });
        if (user) throw new NotFoundException("Phone is already in use!");
        let otp = otpGenerator.generate(6, {
            digits: true,
            lowerCaseAlphabets: false,
            upperCaseAlphabets: false,
            specialChars: false
        });
        const greenwebsms = new URLSearchParams();
        greenwebsms.append('token', process.env.SMS_TOKEN);
        greenwebsms.append('to', `+${phoneInput.phone}`);
        greenwebsms.append('message', `${otp} is your security code for nekmart. Do not share security code with others. This code will be expired in 5 minutes.`);
        const { data } = await axios.post('http://api.greenweb.com.bd/api.php', greenwebsms)
        if (data.includes("Error")) throw new NotFoundException("Number is wrong!");
        otp = await bcrypt.hash(otp, 12);
        await this.userModel.findByIdAndUpdate(reqUser._id, { otp: otp });
        return {
            success: true,
            message: "Verification code sent"
        }
    };

    //Phone Change Verify
    async changePhoneVerify(verifyPhoneInput: VerifyPhoneInput, reqUser: ReqUser): Promise<SuccessInfo> {
        const usedPhone = await this.userModel.findOne({
            phone: verifyPhoneInput.phone
        });
        if (usedPhone) throw new NotFoundException("Phone is alreay in use!");
        const user = await this.userModel.findById(reqUser._id).select("+otp");
        const verifyOtp = await bcrypt.compare(verifyPhoneInput.otp, user.otp);
        if (!verifyOtp) throw new NotFoundException("You use wrong code!");
        user.otp = "";
        user.phone = verifyPhoneInput.phone;
        await user.save();
        return {
            success: true,
            message: "Phone Changed successfully!"
        }
    };

    //Role Change
    async role(roleInput: RoleInput, reqUser: ReqUser): Promise<SuccessInfo> {
        if (roleInput.role === "admin") throw new NotFoundException("It has a admin already!");
        const user = await this.userModel.findById(roleInput.id);
        if (!user) throw new NotFoundException("User not found!");
        if (user.role === "admin") throw new NotFoundException("You can't change a amdin role!");
        await this.userModel.findByIdAndUpdate(roleInput.id, { role: roleInput.role });
        return {
            success: true,
            message: "Role changed successfully!"
        }
    };

    //Delete User
    async delete(id: ObjectId): Promise<SuccessInfo> {
        const result = await this.userModel.findOneAndDelete({
            _id: id,
            role: "user"
        })
        if (!result) throw new NotFoundException("Something went wrong!")
        return {
            success: true,
            message: "Account deleted successfully!"
        }
    }

    //Get User by Batch
    async findUserByBatch(Ids: ObjectId[]): Promise<(User | Error)[]> {
        const users = await this.userModel.find({ _id: { $in: Ids } });
        const mappedResults = Ids.map(
            (id) =>
                users.find((result) => result.id === id.toString())
        );
        return mappedResults;
    }
}