import { Meta, StoryFn } from '@storybook/react';
import { useRef, useState } from 'react';

import { DemoContainer, Container, Item } from './utils';
import {
  ButtonUploader as ButtonUploaderComponent,
  Popover,
  Row,
  EIconName,
  type TButtonSizes,
  type TButtonVariants,
} from '..';

const meta: Meta<typeof ButtonUploaderComponent> = {
  argTypes: {
    loading: {
      description: 'Индиактор загрузки',
      control: { type: 'boolean' },
    },
    iconOnly: {
      description: 'Стили для отображения только иконки',
      control: { type: 'boolean' },
    },
    fullWidth: {
      description: 'Растянуть на всю ширину',
      control: { type: 'boolean' },
    },
    children: {
      description: 'Текст кнопки',
    },
    size: {
      description: 'Размер: `TButtonSizes`',
      control: { type: 'select' },
      options: ['XXS', 'XS', 'S', 'M', 'L', 'XL'],
    },
    variant: {
      description: 'Размер: `TButtonVariants`',
      control: { type: 'select' },
      options: [
        'primary',
        'secondary',
        'tertiary',
        'warning',
        'danger',
        'ghost',
        'ellipse',
        'function',
        'ai',
      ],
    },
    icon: {
      description: 'Иконка загрузчика',
      control: { type: 'select' },
      options: ['', ...Object.values(EIconName)],
    },
    disabled: {
      description: 'Недоступность кнопки',
      control: { type: 'boolean' },
    },
    onUpload: {
      type: 'function',
      description:
        'Обработчик загрузки: `(files: UploaderFile[], e: React.ChangeEvent<HTMLInputElement>) => void`',
    },
  },
  args: {
    loading: false,
    disabled: false,
    iconOnly: false,
    size: 'XXS',
    variant: 'primary',
    icon: EIconName.uploadFile,
    children: 'Button',
    fullWidth: false,
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: ButtonUploaderComponent,
  title: 'components/FileUploader',
};

export default meta;

const sizes: TButtonSizes[] = ['XXS', 'XS', 'S', 'M', 'L', 'XL'];
const variants: TButtonVariants[] = [
  'primary',
  'secondary',
  'tertiary',
  'warning',
  'danger',
  'ghost',
  'ellipse',
  'function',
];
const iconUpload = 'uploadFile';

export const ButtonUploader: StoryFn<typeof ButtonUploaderComponent> = (
  arguments_,
) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  return (
    <>
      <DemoContainer>
        <Item width={500} label='Customizable'>
          <ButtonUploaderComponent {...arguments_} />
        </Item>
      </DemoContainer>
      <Container>
        <Row wrap align='top' justify='center' gutter={8}>
          <Item width={500} label={'Sizes'}>
            <Row gutter={8}>
              <Row direction='column' align='top' gutter={8}>
                {sizes.map((size, idx) => (
                  <ButtonUploaderComponent
                    key={idx}
                    icon={iconUpload}
                    size={size}
                    onUpload={(files, e) => console.log(files, e)}
                  >
                    Upload File
                  </ButtonUploaderComponent>
                ))}
              </Row>
              <Row direction='column' align='top' gutter={8}>
                {sizes.map((size, idx) => (
                  <ButtonUploaderComponent
                    key={idx}
                    icon={iconUpload}
                    size={size}
                    iconOnly
                    onUpload={(files, e) => console.log(files, e)}
                  />
                ))}
              </Row>
            </Row>
          </Item>
          <Item width={500} label={'Variants'}>
            <Row gutter={8}>
              <Row direction='column' align='top' gutter={8}>
                {variants.map((variant, idx) => (
                  <ButtonUploaderComponent
                    key={idx}
                    icon={iconUpload}
                    variant={variant}
                    onUpload={(files, e) => console.log(files, e)}
                  >
                    Upload File
                  </ButtonUploaderComponent>
                ))}
                <ButtonUploaderComponent
                  icon={iconUpload}
                  disabled
                  onUpload={(files, e) => console.log(files, e)}
                >
                  Upload File
                </ButtonUploaderComponent>
              </Row>
              <Row direction='column' align='top' gutter={8}>
                {variants.map((variant, idx) => (
                  <ButtonUploaderComponent
                    key={idx}
                    icon={iconUpload}
                    variant={variant}
                    iconOnly
                    onUpload={(files, e) => console.log(files, e)}
                  />
                ))}
                <ButtonUploaderComponent
                  onUpload={(files, e) => console.log(files, e)}
                  icon={iconUpload}
                  disabled
                  iconOnly
                />
              </Row>
            </Row>
          </Item>
          <Item width={1024} label={'Full Width'}>
            <ButtonUploaderComponent
              icon={iconUpload}
              fullWidth
              onUpload={(files, e) => console.log(files, e)}
            >
              Upload File
            </ButtonUploaderComponent>
          </Item>
          <Item width={1024} label={'Popover'}>
            <ButtonUploaderComponent
              ref={anchorRef}
              icon={iconUpload}
              iconAfter='cross'
              onUpload={(files, e) => {
                setOpen(!open);
                console.log(files, e);
              }}
            >
              Upload File
            </ButtonUploaderComponent>
          </Item>

          <Popover anchor={anchorRef.current} open={open}>
            Content
          </Popover>
        </Row>
      </Container>
    </>
  );
};
