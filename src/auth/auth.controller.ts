import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { Public } from "./decorators/public.decorator";
import { TokenExpiry } from "./constants/token-expiry.constants";
import type { Response } from "express";

@Public()
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  private setAccessTokenCookie(res: Response, token: string) {
    res.cookie("access_token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: TokenExpiry.access.ms,
    });
  }

  @Post("register")
  async registerUser(
    @Body() registerAuthDto: RegisterAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, userId } =
      await this.authService.registerUser(registerAuthDto);

    this.setAccessTokenCookie(res, accessToken);

    return { userId, message: "Registration successful" };
  }

  @Post("login")
  async loginUser(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, userId } =
      await this.authService.loginUser(loginAuthDto);

    this.setAccessTokenCookie(res, accessToken);

    return { userId, message: "Login successful" };
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  logoutUser(@Res({ passthrough: true }) res: Response) {
    res.clearCookie("access_token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    });

    return { message: "Logout successful" };
  }
}
