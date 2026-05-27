import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { IS_PUBLIC_KEY } from "../decorators/public.decorator";
import { Reflector } from "@nestjs/core";
import { UsersService } from "@/users/users.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector,
    private readonly usersService: UsersService,
  ) {}

  private extractToken(request: Request): string | undefined {
    return request.cookies?.access_token as string | undefined;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractToken(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token);
      const user = await this.usersService.findOne(payload.userId);
      if (!user) {
        throw new UnauthorizedException();
      }
      request.user = user;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }
}
