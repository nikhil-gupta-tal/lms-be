import { Column, Entity } from "typeorm";
import { BaseModel } from "@/common/entities/base.entity";
import { Role } from "@/common/entities/role.enum";

@Entity("users")
export class User extends BaseModel {
  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false, default: false })
  isVerified: boolean;

  @Column({
    enum: Role,
    enumName: "role",
    default: Role.USER,
    nullable: false,
  })
  role: string;
}
