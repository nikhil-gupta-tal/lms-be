import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { hashPassword, verifyPassword } from "@/common/utils/password";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const newUser = this.userRepo.create(createUserDto);
    return await this.userRepo.save(newUser);
  }

  async findAll() {
    return await this.userRepo.find();
  }

  async findOne(id: string) {
    return await this.userRepo.findOne({ where: { id } });
  }

  async findOneByEmail(email: string) {
    return await this.userRepo.findOne({ where: { email } });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userRepo.update(id, updateUserDto);
  }

  async remove(id: string) {
    return await this.userRepo.delete(id);
  }

  async getProfile(id: string) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException("User not found");
    }
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  async updateProfile(id: string, updateProfileDto: UpdateProfileDto) {
    const { name, email } = updateProfileDto;

    if (email) {
      const existing = await this.findOneByEmail(email);
      if (existing && existing.id !== id) {
        throw new BadRequestException("Email already in use");
      }
    }

    await this.userRepo.update(id, {
      ...(name && { name }),
      ...(email && { email }),
    });
    return await this.getProfile(id);
  }

  async changePassword(id: string, changePasswordDto: ChangePasswordDto) {
    const user = await this.findOne(id);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    if (
      changePasswordDto.newPassword !== changePasswordDto.confirmNewPassword
    ) {
      throw new BadRequestException(
        "New password and confirmation do not match",
      );
    }

    const isCurrentPasswordValid = await verifyPassword(
      changePasswordDto.currentPassword,
      user.password,
    );
    if (!isCurrentPasswordValid) {
      throw new BadRequestException("Current password is incorrect");
    }

    const hashedPassword = await hashPassword(changePasswordDto.newPassword);
    await this.userRepo.update(id, { password: hashedPassword });

    return { message: "Password changed successfully" };
  }
}
