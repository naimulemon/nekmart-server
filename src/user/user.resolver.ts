import { Resolver, Mutation, Query, Args, Context, ID } from "@nestjs/graphql";
import { UseGuards } from "@nestjs/common";
import { ObjectId } from "mongoose";

//Service
import { UserService } from "./user.service";

//Entity
import { SuccessInfo } from "./entities/success.entity";
import { SignupInfo } from "./entities/signup.entity";
import { RegisterInfo } from "./entities/register.entity";
import { User, GetUsers } from "./entities/user.entity";

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
import { UserPrams } from "./dto/get-users.dto";

//Guard
import { Roles } from "src/auth/decorator/auth.decorator";
import { Role } from "src/auth/enum/auth.enum";
import { AuthGuard } from "src/auth/auth.guard";
import { RolesGuard } from "src/auth/roles.guard";

//Req User Types
import { ReqUser } from "src/auth/types/user.types";

@Resolver()
export class UserResolver {
    //Constructor
    constructor(private readonly userService: UserService) { };

    //Get Profile
    @Query(() => User, { name: "getProfile" })
    @UseGuards(AuthGuard)
    getProfile(
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.getProfile(reqUser);
    };

    //Get Users
    @Query(() => GetUsers, { name: "getUsers" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    getUsers(
        @Args("userPrams") userPrams: UserPrams
    ) {
        return this.userService.getUsers(userPrams);
    };

    //Signup
    @Mutation(() => SignupInfo, { name: "signup" })
    signup(
        @Args("signupInput") signupInput: SignupInput
    ) {
        return this.userService.signup(signupInput);
    };

    //Resend otp
    @Mutation(() => SuccessInfo, { name: "resendOtp" })
    resend(
        @Args("phone", { type: () => String }) phone: string
    ) {
        return this.userService.resend(phone);
    }

    //Phone login
    @Mutation(() => SignupInfo, { name: "phoneLogin" })
    phoneLogin(
        @Args("phone", { type: () => String }) phone: string
    ) {
        return this.userService.phoneLogin(phone);
    }

    //Phone verify
    @Mutation(() => RegisterInfo, { name: "verifyPhone" })
    verify(
        @Args("verifyPhoneInput") verifyPhoneInput: VerifyPhoneInput
    ) {
        return this.userService.verify(verifyPhoneInput);
    };

    //Login with phone and password
    @Mutation(() => RegisterInfo, { name: "login" })
    login(
        @Args("loginInput") loginInput: LoginInput
    ) {
        return this.userService.login(loginInput);
    };

    //Login with phone and password for admin
    @Mutation(() => RegisterInfo, { name: "loginAdmin" })
    adminLogin(
        @Args("loginInput") loginInput: LoginInput
    ) {
        return this.userService.adminLogin(loginInput)
    }

    //Login or signup with google service
    @Mutation(() => RegisterInfo, { name: "googleLogin" })
    google(
        @Args("googleInput") googleInput: GoogleInput
    ) {
        return this.userService.google(googleInput);
    };

    //Login or signup with facebook service
    @Mutation(() => RegisterInfo, { name: "facebookLogin" })
    facebook(
        @Args("facebookInput") facebookInput: FacebookInput
    ) {
        return this.userService.facebook(facebookInput);
    };

    //Update Profile
    @Mutation(() => SuccessInfo, { name: "updateProfile" })
    @UseGuards(AuthGuard)
    update(
        @Args("updateUserInput") updateUserInput: UpdateUserInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.update(updateUserInput, reqUser);
    };

    //Change Password
    @Mutation(() => SuccessInfo, { name: "chanegPassword" })
    @UseGuards(AuthGuard)
    changePassword(
        @Args("changePasswordInput") chanegPasswordInput: ChangePassowrdInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.changePassword(chanegPasswordInput, reqUser);
    };

    //Forget Password
    @Mutation(() => SignupInfo, { name: "forgetPassword" })
    forgetPassword(
        @Args("forgetPasswordInput") forgetPasswordInput: ForgetPasswordInput
    ) {
        return this.userService.forgetPassword(forgetPasswordInput);
    };

    //Reset Password
    @Mutation(() => SuccessInfo, { name: "resetPassword" })
    resetPassword(
        @Args("resetPasswordInput") resetPasswordInput: ResetPasswordInput
    ) {
        return this.userService.resetPassword(resetPasswordInput);
    };

    //Phone Availability
    @Mutation(() => SuccessInfo, { name: "phoneAvailability" })
    @UseGuards(AuthGuard)
    available(
        @Args("phoneInput") phoneInput: PhoneInput
    ) {
        return this.userService.available(phoneInput);
    };

    //Phone Change
    @Mutation(() => SuccessInfo, { name: "changePhone" })
    @UseGuards(AuthGuard)
    changePhone(
        @Args("phoneInput") phoneInput: PhoneInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.phoneChange(phoneInput, reqUser);
    };

    //Phone Verify an Change
    @Mutation(() => SuccessInfo, { name: "changePhoneVerify" })
    @UseGuards(AuthGuard)
    changePhoneVerify(
        @Args("verifyPhoneInput") verifyPhoneInput: VerifyPhoneInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.changePhoneVerify(verifyPhoneInput, reqUser);
    };


    //Role Change
    @Mutation(() => SuccessInfo, { name: "changeRole" })
    @Roles(Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    role(
        @Args("roleInput") roleInput: RoleInput,
        @Context("user") reqUser: ReqUser
    ) {
        return this.userService.role(roleInput, reqUser);
    };

    //Check token
    @Mutation(() => SuccessInfo, { name: "checkToken" })
    @UseGuards(AuthGuard)
    checkToken(
        @Context("user") reqUser: ReqUser
    ) {
        if (reqUser) {
            return {
                success: true,
                message: "Token is verified!"
            }
        } else {
            return {
                success: false,
                message: "Token is not verified!"
            }
        }
    }

    //Delete profile
    @Mutation(() => SuccessInfo, { name: "deleteUser" })
    @Roles(Role.MODERATOR, Role.ADMIN)
    @UseGuards(AuthGuard, RolesGuard)
    delete(
        @Args("id", { type: () => ID }) id: ObjectId
    ) {
        return this.userService.delete(id);
    }
}