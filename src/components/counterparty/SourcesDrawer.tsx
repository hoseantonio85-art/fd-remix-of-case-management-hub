import { Download, FileText } from "@/shared/ui";
import { InModalDrawer } from "./InModalDrawer";

export type SourceFile = {
  name: string;
  author: string;
  date: string;
  size: string;
};

export type SourcesSection = {
  title: string;
  files: SourceFile[];
};

function FileCard({ file }: { file: SourceFile }) {
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-rose-50 text-rose-600">
        <FileText className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm text-foreground">{file.name}</div>
        <div className="mt-0.5 truncate text-[12px] text-muted-foreground">
          {file.author} · {file.date}
        </div>
      </div>
      <div className="shrink-0 text-[12px] text-muted-foreground">{file.size}</div>
      <button
        type="button"
        aria-label="Скачать"
        onClick={(e) => e.preventDefault()}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-foreground hover:bg-slate-200 transition"
      >
        <Download className="h-4 w-4" />
      </button>
    </div>
  );
}

export function SourcesDrawer({
  open,
  onOpenChange,
  sections,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  sections: SourcesSection[];
}) {
  return (
    <InModalDrawer open={open} onOpenChange={onOpenChange}>
      <div className="px-6 pt-6 pb-4 pr-16">
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">Источники</h3>
      </div>
      <div className="space-y-6 px-6 pb-6">
        {sections.map((section) => (
          <div key={section.title}>
            <div className="mb-1 text-sm font-semibold text-foreground">{section.title}</div>
            <div className="divide-y divide-slate-100">
              {section.files.map((f) => (
                <FileCard key={f.name} file={f} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </InModalDrawer>
  );
}

export const DEFAULT_CONTRACT_SOURCE: SourceFile = {
  name: "dogovor_uslugi_v3.pdf",
  author: "Анашин Антон Владимирович",
  date: "20.02.2024",
  size: "10 Мб",
};
