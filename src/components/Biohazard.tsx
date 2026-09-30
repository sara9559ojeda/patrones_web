import { Biohazard as BiohazardIcon } from "lucide-react";

export function Biohazard({ className = "size-6" }: { className?: string }) {
  return <BiohazardIcon className={className} strokeWidth={1.5} />;
}
