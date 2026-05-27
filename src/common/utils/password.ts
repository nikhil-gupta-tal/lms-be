import argon2 from "argon2";

export const hashPassword = async (plainPassword: string) => {
  return await argon2.hash(plainPassword);
};

export const verifyPassword = async (
  plainPassword: string,
  hashToBeVerified: string,
) => {
  return await argon2.verify(hashToBeVerified, plainPassword);
};
