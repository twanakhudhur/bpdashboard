import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// formErrorHandler.js

export function handleFormErrors(form, response, fields) {
  const { error } = response;

  // Clear all errors before setting new ones (optional but helpful for UX)
  form.clearErrors();

  if (!error) return;

  // Handle 400 status (validation errors)
  if (error.status === 400 && error.data?.errors) {
    error.data.errors.forEach((error) => {
      form.setError(error.path, { message: error.message });
    });
  }

  // Handle 409 status (conflict errors, e.g., duplicates)
  if (error.status === 409) {
    fields.forEach((field) => {
      if (error.data.path.includes(field.name)) {
        form.setError(field.name, {
          message: `${field.label} already exists`,
        });
      }
    });
  }
}
