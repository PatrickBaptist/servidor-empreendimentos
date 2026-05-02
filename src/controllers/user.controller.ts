import { Request, Response } from "express";
import { ZodError } from "zod";
import { createUserSchema } from "../validations/user";
import { userService, EmailAlreadyExistsError } from "../services/user.service";

export const userController = {
  async create(req: Request, res: Response): Promise<void> {
    try {
      const data = createUserSchema.parse(req.body);
      const user = await userService.create(data);

      res.status(201).json({
        success: true,
        message: "Usuário cadastrado com sucesso!",
        data: user,
      });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(422).json({
          success: false,
          error: "Dados inválidos",
          details: error.errors.map((e) => ({
            field: e.path.join("."),
            message: e.message,
          })),
        });
        return;
      }

      if (error instanceof EmailAlreadyExistsError) {
        res.status(409).json({ success: false, error: error.message });
        return;
      }

      console.error("[UserController]", error);
      res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
  },

  async findAll(_req: Request, res: Response): Promise<void> {
    try {
      const users = await userService.findAll();
      res.status(200).json({ success: true, data: users });
    } catch (error) {
      console.error("[UserController]", error);
      res.status(500).json({ success: false, error: "Erro interno do servidor" });
    }
  },
};