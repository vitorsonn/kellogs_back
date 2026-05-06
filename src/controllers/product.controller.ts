import prisma from "../../lib/prisma";
import { Request, Response } from "express";

const create = async (req: Request, res: Response) => {
  try {
    const { name, price, categoryId } = req.body;

    if (!name || !price || !categoryId) {
      return res
        .status(400)
        .json({ error: "Nome, preço e categoria são obrigatórios" });
    }

    const product = await prisma.product.create({
      data: { name, price: Number(price), categoryId: Number(categoryId) },
    });
    return res.status(201).json(product);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar produto" });
  }
};

const list = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });
    return res.json(products);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao listar os produtos" });
  }
};

const getById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id: Number(id) },
      include: {
        category: true,
      },
    });
    if (!product) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar produto" });
  }
};

const update = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, categoryId } = req.body;

    const productId = Number(id);

    if (isNaN(productId)) {
      return res.status(400).json({ error: "ID inválido" });
    }

    const exists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!exists) {
      return res.status(404).json({ error: "Produto não encontrado" });
    }

    const product = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(name && { name }),
        ...(price !== undefined && { price }),
        ...(categoryId && { categoryId }),
      },
    });

    return res.json(product);
  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar o produto" });
  }
};


const remove = async (req: Request, res: Response) => {
  try{
    const {id} = req.params
    const productId = Number(id)

    if(isNaN(productId)){
      return res.status(400).json({error: "ID inválido"})
    }

    const exists = await prisma.product.findUnique({
      where: {id: productId},
    })

    if(!exists){
      return res.status(404).json({error: "Produto não encontrado"})
    }

    await prisma.product.delete({
      where:{id: productId},
    })

    return res.status(204).send()
  } catch(error){
    return res.status(500).json({error: "Erro ao deletar o produto"})
  }
}




export default {
  create,
  list,
  getById,
  update,
  remove
};
