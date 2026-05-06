import prisma from "../../lib/prisma";
import { Request, Response } from "express";

const create = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: "Nome é obrigatório!" });
    }

    const category = await prisma.category.create({
      data: { name },
    });

    return res.status(201).json(category);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar categoria..." });
  }
};

const list = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany();
    return res.json(categories);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar categorias" });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const category = await prisma.category.findUnique({
      where: { id: Number(id) }, 
    });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada..." });
    }

    return res.json(category);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar categoria" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

      if (!name) {
      return res.status(400).json({ error: "Nome é obrigatório" });
    }

    const exists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!exists) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

    const category = await prisma.category.update({
      where: { id: categoryId },
      data:{name}
    });

    return res.json(category);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar a categoria" });
  }
};

const remove = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const categoryId = Number(id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }

        const hasProducts = await prisma.product.findFirst({
      where: { categoryId },
    });

        if (hasProducts) {
      return res.status(409).json({
        error: "Categoria possui produtos vinculados e não pode ser removida",
      });
    }
    

    await prisma.category.delete({
      where: { id: categoryId },
    });

    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar a categoria" });
  }
};

export default {
  create,
  list,
  getById,
  update,
  remove,
};
