const { z } = require("zod");

const createProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters"),
    price: z.union([z.string(), z.number()]).transform((val) => Number(val)),
    stock: z.union([z.string(), z.number()]).transform((val) => Number(val)),
    images: z.any().optional(),
  }),
});

const updateProductSchema = z.object({
  body: z.object({
    name: z.string().min(3, "Name must be at least 3 characters").optional(),
    description: z
      .string()
      .min(10, "Description must be at least 10 characters")
      .optional(),
    price: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .optional(),
    stock: z
      .union([z.string(), z.number()])
      .transform((val) => Number(val))
      .optional(),
    images: z.any().optional(),
  }),
});

module.exports = {
  createProductSchema,
  updateProductSchema,
};
