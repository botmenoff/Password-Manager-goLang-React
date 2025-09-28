// src/services/api.services.ts
import type { LoginRequest } from "../models/LoginRequest.models";
import type { LoginResponse } from "../models/LoginRequest.models";
import type { RegisterRequest } from "../models/RegisterRequest.model";
import type { RegisterResponse } from "../models/RegisterRequest.model";
import type { User } from "../models/User.model";
import type { Note } from '../models/Notes.model'
import { cookieService } from "./cookie.service";

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
  const token = cookieService.getToken()
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/users/me`, {
    headers: {
      Authorization: token,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error fetching user data");
  }

  return res.json();
}


export async function updateUser(id: number, data: Partial<User>): Promise<{ message: string }> {
  const token = cookieService.getToken()
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error al actualizar usuario");
  }

  return res.json();
}

export async function getAllUsers(): Promise<User[]> {
  const token = cookieService.getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/users/`, {
    headers: {
      Authorization: token,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error fetching user data");
  }

  return res.json(); // ahora será User[]
}


export async function deleteUser(id: number): Promise<void> {
  const token = cookieService.getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/users/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error eliminando usuario");
  }
}

export async function getMyNotes(): Promise<Note[]> {
  const token = cookieService.getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/notes/my`, {
    headers: {
      Authorization: token,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error obteniendo notas");
  }

  return res.json();
}

export async function getNoteById(id: number): Promise<Note> {
  const token = cookieService.getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/notes/${id}`, {
    headers: {
      Authorization: token,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error obteniendo nota");
  }

  return res.json();
}

export async function createNote(noteText: string, username: string, password: string): Promise<Note> {
  const token = cookieService.getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/notes/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    credentials: "include",
    body: JSON.stringify({ note_text: noteText, username, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error creando nota");
  }

  return res.json();
}


export async function updateNote(id: number, noteText: string, username: string, password: string): Promise<Note> {
  const token = cookieService.getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    credentials: "include",
    body: JSON.stringify({ note_text: noteText, username, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error actualizando nota");
  }

  return res.json();
}

export async function deleteNote(id: number): Promise<void> {
  const token = cookieService.getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/notes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error eliminando nota");
  }
}

export async function verifyNotePassword(noteId: number, password: string): Promise<boolean> {
  const token = cookieService.getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/notes/verify-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    credentials: "include",
    body: JSON.stringify({ note_id: noteId, password }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error verificando contraseña");
  }

  return true;
}

export async function getMyNotesSortedByPassword(order: "ASC" | "DESC" = "ASC"): Promise<Note[]> {
  const token = cookieService.getToken();
  if (!token) throw new Error("No token found");

  const res = await fetch(`${API_BASE}/notes/sorted-password?order=${order}`, {
    headers: { Authorization: token },
    credentials: "include",
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Error obteniendo notas ordenadas por contraseña");
  }

  return res.json();
}
