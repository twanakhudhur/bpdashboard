import { z } from "zod";

// CREATE WASTE SCHEMA
export const createWasteSchema = z.object({
  autoCode: z.string().min(1, "Auto Code is required"),
  weight: z
    .number()
    .min(1, "Weight is required")
    .positive("Weight must be greater than 0"),
  width: z
    .number()
    .min(1, "Width is required")
    .positive("Width must be grater than 0"),
  thickness: z
    .number()
    .min(1, "Thickness is required")
    .positive("Thickness must be greater than 0"),
  typeId: z.string().min(1, "Type is required"),
  madeInId: z.string().min(1, "Made In is required"),
  qualityId: z.string().min(1, "Quality is required"),

  comment: z
    .string()
    .max(255, "Comment must be at most 255 characters")
    .optional(),
  pieceSeries: z
    .number()
    .positive("Piece Series must be greater than 0")
    .optional()
    .nullable(),
  theoryLength: z
    .number()
    .positive("Theory Length must be greater than 0")
    .optional()
    .nullable(),
  actualLength: z
    .number()
    .positive("Actual Length must be greater than 0")
    .optional()
    .nullable(),
});
