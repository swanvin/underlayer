export type ModuleStatus = "LIVE" | "SPEC" | "COMING";

export type Law = { title: string; statement: string; };

export type Module = {
  id: string;
  slug: string;
  name: string;
  status: ModuleStatus;
  law: Law;
  summary: string;
  does: string[];
  doesNot: string[];
  route?: string;
};