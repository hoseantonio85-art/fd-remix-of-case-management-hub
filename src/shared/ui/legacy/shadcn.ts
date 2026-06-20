/**
 * Legacy shadcn-слой.
 *
 * Поверх shadcn-примитивов из `src/components/ui/*` собран единственный
 * допустимый barrel. Продуктовый код импортирует их ТОЛЬКО через `@/shared/ui`
 * (что внутри ре-экспортирует отсюда). Прямые импорты `@/components/ui/*` и
 * `@radix-ui/*` запрещены ESLint-правилом.
 *
 * Сюда же временно вынесены Select / Dialog / Sheet / Tabs / Drawer — их API
 * сильнее всего расходится с kit, миграция отдельной итерацией.
 */
export { Button, buttonVariants, type ButtonProps } from "@/components/ui/button";
export { Input } from "@/components/ui/input";
export { Textarea } from "@/components/ui/textarea";
export { Checkbox } from "@/components/ui/checkbox";
export { Switch } from "@/components/ui/switch";
export { Badge, badgeVariants } from "@/components/ui/badge";
export { Skeleton } from "@/components/ui/skeleton";
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export { Label } from "@/components/ui/label";
export { Separator } from "@/components/ui/separator";

// Композитные компоненты — пока без kit-замены (см. MIGRATION_REPORT)
export {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
export * as DialogPrimitive from "@radix-ui/react-dialog";
export {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetTrigger,
} from "@/components/ui/sheet";
export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
export { Toaster } from "@/components/ui/sonner";
