/**
 * Тонкие adapters над корпоративным @sber-orm/ui-kit.
 *
 * На первой итерации продуктовая визуальная композиция остаётся на shadcn —
 * это требование «не менять UX». Поэтому большинство shared-компонентов сейчас
 * — re-export shadcn (см. ./legacy/shadcn). Здесь же лежат wrappers, которые
 * выставляют kit-компоненты под именами, ожидаемыми проектом (Text, Title,
 * Chips, Loader, Icon). Когда команда дизайна разрешит визуальный свитч
 * Button/Input/Checkbox на kit, реализация в этом файле меняется без правок
 * call-site.
 */
import * as React from "react";
import {
  Text as KitText,
  Title as KitTitle,
  Chips as KitChips,
  Loader as KitLoader,
  Icon as KitIcon,
} from "@sber-orm/ui-kit";

export const Text = KitText;
export const Title = KitTitle;
export const Chips = KitChips;
export const Loader = KitLoader;
export const Icon = KitIcon;
export { EIconName, ETitleSize, ETextSize } from "@sber-orm/ui-kit";
