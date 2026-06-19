# @sber-orm/ui-kit

Cloud UI Kit. Основан на [UI Kit Platform V](http://kit.cmp.sbc.space/v-uik/1.4.0/?path=/story/%D0%BD%D0%B0%D1%87%D0%B0%D0%BB%D0%BE-%D1%80%D0%B0%D0%B1%D0%BE%D1%82%D1%8B-%D1%83%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BA%D0%B0--page)

Используется Cloud [дизайн система](https://pixso.design.sber.ru/app/editor/iKsfzBDEweSvdZwuytK8IA?) и [система токенов](https://pixso.design.sber.ru/app/editor/Fnh2TkqLhOMBN67ZlDdl4Q)

## установка

`$ npm i -D @sber-orm/ui-kit`
или
`$ yarn add @sber-orm/ui-kit`

## использование

1. Импортировать стили

```scss
@use "@sber-orm/ui-kit/src/colors.module.scss" as *;
@use "@sber-orm/ui-kit/style.css";
```

2. Импортировать компонент `<файл компонента>.tsx`

```ts
import { Button, Checkbox, Input } from "@sber-orm/ui-kit";
```

## разработка

1. Установить зависимости из папки ui-kit
   `yarn install`
2. Запустить сторибук
   `npm run storybook`
