import prisma from "../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import { Request, Response } from "express";

export async function login(req: Request, res: Response) {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Credenciais inválidas" });
  }


  console.log(process.env.JWT_SECRET);
  
  const token = jwt.sign(
    {userId: user.id},
    process.env.JWT_SECRET!,
    {expiresIn: "1d"}
  )

  return res.json({token})
}


export async function register(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email e senha são obrigatórios" });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: "Senha deve ter no mínimo 6 caracteres" });
  }

  const userExists = await prisma.user.findUnique({
    where: { email },
  });

  if (userExists) {
    return res.status(409).json({ error: "Usuário já existe" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "1d" }
  );


  return res.status(201).json({
    user: {
      id: user.id,
      email: user.email,
    },
    token,
  });
}

export function logout() {
  localStorage.removeItem("token");
}

export default {login, register,logout}
