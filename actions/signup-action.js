"use server";

import { hashUserPassword } from "@/lib/hash";
import createUser from "@/lib/user";
import { redirect } from "next/navigation";

export async function signup(prevState, formData) {
  console.log(formData);
  const email = formData.get("email");
  const password = formData.get("password");

  let errors = {};

  if (!email.includes("@")) {
    errors.email = "Please enter a valid email address.";
  }

  if (password.trim().length < 8) {
    errors.password = "Password must be at least 8 characters long.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      errors,
    };
  }

  try {
    createUser(email, hashUserPassword(password));
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      errors.email = "This email is already in use.";

      return {
        errors,
      };
    }
  }

  redirect("/login");
}
