import { useState, cloneElement, isValidElement } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./dialog";

export default function CustomUpdateDialog({ trigger, title, children }) {
  const [open, setOpen] = useState(false);

  const closeDialog = () => setOpen(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="w-full text-start text-sm py-1.5">{trigger}</button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {isValidElement(children)
          ? cloneElement(children, { closeDialog })
          : children}
      </DialogContent>
    </Dialog>
  );
}
