import { z } from "zod";

export const createRollSchema = z.object({
  rollCode: z.string().min(1, "Roll Code is required"),
  img: z.string().optional(),
  thickness: z
    .number()
    .min(1, "Thickness is required")
    .positive("Thickness must be greater than 0"),
  width: z
    .number()
    .min(1, "Width is required")
    .positive("Width must be greater than 0"),
  netWeight: z
    .number()
    .min(1, "Net Weight is required")
    .positive("Net Weight must be greater than 0"),
  grossWeight: z
    .number()
    .min(1, "Gross Weight is required")
    .positive("Gross Weight must be greater than 0"),

  typeId: z.string().min(1, "Type is required"),
  madeInId: z.string().min(1, "Made In is required"),
  qualityId: z.string().min(1, "Quality is required"),

  comment: z
    .string()
    .max(255, "Comment must be at most 255 characters")
    .optional(),
  theoryLength: z
    .number()
    .nonnegative("Theory Length must be greater than 0")
    .optional()
    .nullable(),
  actualLength: z
    .number()
    .nonnegative("Actual Length must be greater than 0")
    .optional()
    .nullable(),
});
