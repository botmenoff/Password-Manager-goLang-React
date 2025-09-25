// src/services/api.services.ts
import type { LoginRequest } from "../models/LoginRequest.models";
import type { LoginResponse } from "../models/LoginRequest.models";
import type { RegisterRequest } from "../models/RegisterRequest.model";
import type { RegisterResponse } from "../models/RegisterRequest.model";
import type { User } from "../models/User.model";

const API_BASE = "http://localhost:8080/api/v1";

export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE}/users/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include", // si usas cookies HttpOnly
  });
  console.log(res);
  
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.error || "Error en login");
  }

  return res.json();
}

export async function registerUser(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE}/users/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error en el registro");
  }

  return res.json();
}

export async function getMe(): Promise<User> {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error fetching user data");
  }

  return res.json();
}
