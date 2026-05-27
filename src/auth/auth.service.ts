import { BadRequestException, Injectable } from "@nestjs/common";
import { LoginAuthDto } from "./dto/login-auth.dto";
import { UsersService } from "@/users/users.service";
import { hashPassword, verifyPassword } from "@/common/utils/password";
import { RegisterAuthDto } from "./dto/register-auth.dto";
import { JwtService, JwtSignOptions } from "@nestjs/jwt";
import { User } from "@/users/entities/user.entity";
import { TokenExpiry } from "./constants/token-expiry.constants";
import { JwtPayload } from "./interfaces/jwt-payload.interface";

interface AuthResponse {
  accessToken: string;
  userId: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  private generateToken(user: User, options?: JwtSignOptions) {
    const payload: JwtPayload = { userId: user.id };
    const token = this.jwtService.sign(payload, {
      ...options,
      expiresIn: options?.expiresIn || TokenExpiry.default.jwt,
    });

    return token;
  }

  async registerUser(registerAuthDto: RegisterAuthDto): Promise<AuthResponse> {
    const user = await this.userService.findOneByEmail(registerAuthDto.email);

    if (user) {
      throw new BadRequestException("Email already exists");
    }

    const newUser = await this.userService.create({
      name: registerAuthDto.name,
      email: registerAuthDto.email,
      password: await hashPassword(registerAuthDto.password),
    });

    const accessToken = this.generateToken(newUser, {
      expiresIn: TokenExpiry.access.jwt,
    });

    return { accessToken, userId: newUser.id };
  }

  async loginUser(loginAuthDto: LoginAuthDto): Promise<AuthResponse> {
    const user = await this.userService.findOneByEmail(loginAuthDto.email);

    if (
      !user ||
      !(await verifyPassword(loginAuthDto.password, user.password))
    ) {
      throw new BadRequestException("Invalid Credentials");
    }

    const accessToken = this.generateToken(user, {
      expiresIn: TokenExpiry.access.jwt,
    });

    return { accessToken, userId: user.id };
  }
}
