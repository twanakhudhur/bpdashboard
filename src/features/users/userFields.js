import { roles } from "@/lib/constants";

export const updateUserFields = [
  {
    type: "text",
    label: "Username",
    name: "username",
    placeholder: "Username",
  },
  {
    type: "text",
    label: "Phone",
    name: "phone",
    placeholder: "Phone",
  },
  {
    type: "select",
    label: "Role",
    name: "role",
    options: roles,
    column: "right",
  },
];

export const addUserFields = [
  {
    type: "text",
    label: "Username",
    name: "username",
    placeholder: "Username",
  },
  {
    type: "text",
    label: "Password",
    name: "password",
    placeholder: "Password",
  },
  {
    type: "text",
    label: "Phone",
    name: "phone",
    placeholder: "Phone",
  },
  {
    type: "select",
    label: "Role",
    name: "role",
    options: roles,
    column: "right",
  },
];
