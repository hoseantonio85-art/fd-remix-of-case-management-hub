import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sparkles, Upload, X, Info, FileText } from "lucide-react";

export function RunCheckDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onSubmit: (inn: string, files: File[]) => void;
}) {
  const [inn, setInn] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [isSending, setIsSending] = useState(false);
  const [flying, setFlying] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const reset = () => {
    setInn("");
    setError(null);
    setFiles([]);
    setIsSending(false);
    setFlying(false);
    setDragOver(false);
  };

  const innDigits = inn.replace(/\D/g, "");
  const isValid = innDigits.length === 10 || innDigits.length === 12;

  const handleClose = (o: boolean) => {
    if (isSending) return;
    onOpenChange(o);
    if (!o) reset();
  };

  const handleStart = () => {
    if (!isValid) {
      setError("Введите корректный ИНН");
      return;
    }
    setError(null);
    setIsSending(true);
    setFlying(true);
    const innSnap = innDigits;
    const filesSnap = files;
    setTimeout(() => {
      onSubmit(innSnap, filesSnap);
      reset();
    }, 700);
  };

  const addFiles = (list: FileList | null) => {
    if (!list) return;
    setFiles((prev) => [...prev, ...Array.from(list)]);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md gap-0 rounded-2xl p-0 [&>button]:hidden">
        <div className="flex items-start gap-3 border-b border-border px-5 pt-5 pb-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-foreground">Запуск проверки</div>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Укажите ИНН и/или загрузите документы для анализа. Система автоматически определит тип проверки.
            </p>
          </div>
          {!isSending && (
            <button
              onClick={() => handleClose(false)}
              className="rounded p-1 text-muted-foreground hover:bg-muted"
              aria-label="Закрыть"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="space-y-4 px-5 py-4">
          <div>
            <label className="text-[11px] font-medium text-muted-foreground">ИНН</label>
            <Input
              value={inn}
              onChange={(e) => {
                setInn(e.target.value);
                if (error) setError(null);
              }}
              placeholder="Введите ИНН"
              className="mt-1 bg-white"
              disabled={isSending}
              onKeyDown={(e) => {
                if (e.key === "Enter" && isValid && !isSending) handleStart();
              }}
            />
            {error && <div className="mt-1.5 text-[12px] text-rose-600">{error}</div>}
          </div>

          <div>
            <label className="text-[11px] font-medium text-muted-foreground">Документы</label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                addFiles(e.dataTransfer.files);
              }}
              disabled={isSending}
              className={`mt-1 flex w-full flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed px-4 py-5 text-center transition ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 bg-slate-50/60 hover:bg-slate-50"
              }`}
            >
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div className="text-[13px] font-medium text-foreground">
                Перетащите файлы сюда или выберите на компьютере
              </div>
              <div className="text-[11px] text-muted-foreground">
                Необязательно · PDF, DOCX, XLSX до 25 МБ
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              className="hidden"
              accept=".pdf,.docx,.xlsx"
              onChange={(e) => addFiles(e.target.files)}
            />
            {files.length > 0 && (
              <ul className="mt-2 space-y-1">
                {files.map((f, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 rounded-lg border border-border bg-white px-2.5 py-1.5 text-[12px]"
                  >
                    <FileText className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1 truncate">{f.name}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setFiles((prev) => prev.filter((_, j) => j !== i));
                      }}
                      className="rounded p-0.5 text-muted-foreground hover:bg-muted"
                      aria-label="Удалить"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div className="min-w-0 text-[12px]">
              <div className="font-medium text-foreground">Проверка займёт до 10 минут</div>
              <p className="mt-0.5 text-muted-foreground">
                Когда оценка будет готова, мы отправим уведомление на почту.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-3">
          <Button variant="ghost" size="sm" onClick={() => handleClose(false)} disabled={isSending}>
            Отменить
          </Button>
          <Button size="sm" onClick={handleStart} disabled={isSending || !isValid}>
            {isSending ? "Запуск…" : "Запустить проверку"}
          </Button>
        </div>
      </DialogContent>
      {flying && typeof document !== "undefined" &&
        createPortal(
          <div className="pointer-events-none fixed inset-0 z-[100]">
            <div
              className="absolute left-1/2 top-1/2 flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-primary to-violet-500 px-3 text-white shadow-lg shadow-primary/30"
              style={{
                animation: "flyToChecks 700ms cubic-bezier(0.4, 0, 0.2, 1) forwards",
              }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="text-[12px] font-medium">Проверка</span>
            </div>
            <style>{`
              @keyframes flyToChecks {
                0% {
                  transform: translate(-50%, -50%) scale(1);
                  opacity: 0;
                }
                15% {
                  transform: translate(-50%, -50%) scale(1);
                  opacity: 1;
                }
                100% {
                  transform: translate(calc(50vw - 80px), calc(-50vh + 40px)) scale(0.3);
                  opacity: 0;
                }
              }
            `}</style>
          </div>,
          document.body,
        )}
    </Dialog>
  );
}
