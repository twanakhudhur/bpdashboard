import { HardDrive } from "lucide-react";

export default function EmptyData({ message = "No data found!" }) {
  return (
    <div className="opacity-75 text-center ">
      <HardDrive size={40} className="mx-auto " />
      <p className="text-sm mt-3">{message}</p>
    </div>
  );
}
