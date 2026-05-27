import { Body, Controller, Get, Patch, Post } from "@nestjs/common";
import { UsersService } from "./users.service";
import { CurrentUser } from "@/auth/decorators/current-user.decorator";
import { User } from "./entities/user.entity";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("profile")
  async getProfile(@CurrentUser() user: User) {
    return await this.usersService.getProfile(user.id);
  }

  @Patch("profile")
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return await this.usersService.updateProfile(user.id, updateProfileDto);
  }

  @Post("change-password")
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.usersService.changePassword(user.id, changePasswordDto);
  }
}
