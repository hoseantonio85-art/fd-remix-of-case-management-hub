/**
 * Legacy shadcn-слой.
 *
 * Поверх shadcn-примитивов из `src/components/ui/*`. Продуктовый код импортирует
 * их ТОЛЬКО через `@/shared/ui`. Прямые импорты `@/components/ui/*` и
 * `@radix-ui/*` запрещены ESLint-правилом.
 *
 * После Iteration 4 базовые controls (Button, Input, Textarea, Checkbox, Switch,
 * Badge, Loader) переехали на корпоративный @sber-orm/ui-kit через
 * `adapters/kit.tsx`. Здесь оставлены только композитные компоненты, для которых
 * безопасной замены на kit пока нет:
 *
 * - Dialog / Sheet — Modal/Drawer kit имеет иную композицию, миграция отдельной
 *   итерацией затронула бы крупные модальные окна;
 * - Tabs — kit аналога нет, используется shadcn Tabs;
 * - Sonner / Toaster — используется shadcn sonner;
 * - Select (Radix) — продуктовые случаи используют ContractDrawer-композицию
 *   с Trigger/Content/Item, миграция на kit Select требует переписывания на
 *   options[]; вынесена в следующую итерацию;
 * - Tooltip — продуктовое использование требует asChild + composition, kit
 *   Tooltip имеет иной API;
 * - Skeleton / Separator / Label — нет прямого аналога в kit;
 * - DialogPrimitive — нужен для совместимости с InModalDrawer.
 */
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
export { Label } from "@/components/ui/label";
export { Separator } from "@/components/ui/separator";
export { Skeleton } from "@/components/ui/skeleton";

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
