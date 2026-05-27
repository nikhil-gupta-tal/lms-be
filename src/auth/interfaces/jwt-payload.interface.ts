import { User } from "@/users/entities/user.entity";

export interface JwtPayload {
  userId: User["id"];
}
