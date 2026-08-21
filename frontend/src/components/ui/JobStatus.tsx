import type { JobStatus as Status } from "../../types";
import { Badge } from "./Badge";

export function JobStatus({ status }: { status: Status }) {
  const tone = status === "COMPLETED" ? "success" : status === "FAILED" || status === "CANCELLED" ? "danger" : "warning";
  return <Badge tone={tone}>{status}</Badge>;
}
