import { z } from "zod";

// COUNTRY SCHEMAS
export const countryCreateSchema = z.object({
  country: z.string().min(1, "Country name is required"),
});

// ROLLTYPE SCHEMAS
export const rollTypeCreateSchema = z.object({
  type: z.string().min(1, "Roll Type is required"),
});

// ROLLQUALITY SCHEMAS
export const rollQualityCreateSchema = z.object({
  quality: z.string().min(1, "Roll Quality is required"),
});

// LINE SCHEMAS
export const lineCreateSchema = z.object({
  line: z.string().min(1, "Line name is required"),
});
