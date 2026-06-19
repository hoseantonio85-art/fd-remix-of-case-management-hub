import { Meta, StoryFn } from '@storybook/react';

import { Dropzone as DropzoneComponent, EIconName, Row } from '..';
import { DemoContainer, Container, Item } from './utils';

const meta: Meta<typeof DropzoneComponent> = {
  argTypes: {
    fullHeight: {
      control: 'boolean',
      description: 'Растягивать блок по высоте до размеров родителя',
    },
    required: {
      control: 'boolean',
      description: 'Индикатор обязательности поля',
    },
    disabled: {
      control: 'boolean',
      description: 'Флаг отключения поля',
    },
    onUpload: {
      type: 'function',
      description:
        '``` (files: UploaderFile[], \n e: React.ChangeEvent<HTMLInputElement> | React.DragEvent<HTMLElement>)=> void```',
    },
    placeholder: {
      description: 'Текст под призывом к действию',
    },
    helpText: {
      description: 'Текст с помощью под дропзоной',
    },
    linkText: {
      description: 'Текст ссылки-действия',
    },
    label: {
      description: 'Заголовок поля над дропзоной',
    },
    errorText: {
      description: 'Текст ошибки, заменяет `helpText` если есть',
    },
    suffix: {
      description:
        'Любой JSX, размещается внутри дропзоны, если указаны настройки `actionBlock` - не выводится',
    },
    actionBlock: {
      description: `Настройки блока с действием:\n
        {\n
          text: string;\n
          actionText: string;\n
          buttonProps: IButtonProperties;\n
          backgroundIcon?: EIconName;\n
          onClick: () => void;
      }`,
    },
  },
  args: {
    helpText: 'Можно загрузить все что угодно',
    placeholder:
      'doc, docx, pdf, xls, xlsx, ppt, pptx и другие размером до 100ТБ',
    linkText: 'выберите вручную',
    label: 'Вложения',
    errorText: '',
    suffix: '123123123',
    fullHeight: false,
    disabled: false,
    required: true,
    actionBlock: {
      text: 'Мы теперь умеем заполнять форму на основе вложенных файлов',
      actionText: 'Заполнить автоматически',
      buttonProps: {
        variant: 'ai',
        size: 'XS',
        icon: EIconName.generate,
      },
      onClick: () => null,
      backgroundIcon: EIconName.assistantGradient,
    },
    onUpload: (files) => console.log(files),
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: DropzoneComponent,
  title: 'components/FileUploader',
};

export default meta;

export const Dropzone: StoryFn<typeof DropzoneComponent> = (arguments_) => {
  return (
    <>
      <DemoContainer>
        <Item width={650} height={300} label={'Customizable'}>
          <DropzoneComponent {...arguments_} />
        </Item>
      </DemoContainer>
      <Container>
        <Row align='top' gutter={8} wrap>
          <Item width={500} label={'Default'}>
            <Row direction='column' align='top' gutter={16}>
              <DropzoneComponent onUpload={(files) => console.log(files)} />
              <DropzoneComponent
                helpText='Можно загрузить файлы формата PDF и DOCX размером до 15 МБ.'
                onUpload={(files) => console.log(files)}
              />
              <DropzoneComponent
                placeholder='doc, docx, pdf, xls, xlsx, ppt, pptx и другие размером до 15 МБ'
                onUpload={(files) => console.log(files)}
              />
            </Row>
          </Item>

          <Row direction='column' noFlex align='top' gutter={8}>
            <Item width={500} label={'Disabled'}>
              <DropzoneComponent
                disabled
                onUpload={(files) => console.log(files)}
              />
            </Item>
            <Item width={500} label={'Error'}>
              <Row direction='column' align='top' gutter={16}>
                <DropzoneComponent
                  error
                  onUpload={(files) => console.log(files)}
                />
                <DropzoneComponent
                  error
                  errorText='Можно загрузить файлы формата PDF и DOCX размером до 15 МБ.'
                  onUpload={(files) => console.log(files)}
                />
              </Row>
            </Item>
          </Row>

          <Item width={500} label={'Label'}>
            <Row direction='column' align='top' gutter={16}>
              <DropzoneComponent
                label='Label'
                onUpload={(files) => console.log(files)}
              />
              <DropzoneComponent
                label='Label'
                required
                onUpload={(files) => console.log(files)}
              />
              <DropzoneComponent
                label='Label'
                tooltip='Можно загрузить файлы формата PDF и DOCX размером до 15 МБ.'
                onUpload={(files) => console.log(files)}
              />
            </Row>
          </Item>
          <Item width={750} label='With action block'>
            <Row direction='column' align='top' gutter={16}>
              <DropzoneComponent
                label='Label'
                onUpload={(files) => console.log(files)}
                actionBlock={{
                  backgroundIcon: EIconName.assistantGradient,
                  buttonProps: {
                    size: 'S',
                    variant: 'ai',
                    icon: EIconName.generate,
                  },
                  actionText: 'Заполнить автоматически',
                  text: 'Мы теперь умеем заполнять форму на основе вложенных файлов!',
                  onClick: () => console.log('action'),
                }}
              />
              <DropzoneComponent
                label='Label'
                onUpload={(files) => console.log(files)}
                disabled
                actionBlock={{
                  backgroundIcon: EIconName.assistantGradient,
                  buttonProps: {
                    size: 'S',
                    variant: 'ai',
                    icon: EIconName.generate,
                  },
                  actionText: 'Заполнить автоматически',
                  text: 'Мы теперь умеем заполнять форму на основе вложенных файлов!',
                  onClick: () => console.log('action'),
                }}
              />
            </Row>
          </Item>
        </Row>
      </Container>
    </>
  );
};
