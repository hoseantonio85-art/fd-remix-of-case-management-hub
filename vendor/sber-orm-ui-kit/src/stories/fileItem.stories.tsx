import { Meta, StoryFn } from '@storybook/react';
import { useRef, useState } from 'react';

import {
  Badge,
  FileItem as FileItemComponent,
  Row,
  Popover,
  type IFileProps,
} from '..';
import { DemoContainer, Container, Item } from './utils';
import classes from './styles.module.scss';

const meta: Meta<typeof FileItemComponent> = {
  argTypes: {
    canRemove: {
      description: 'Можно ли удалять файл',
      control: 'boolean',
    },
    canDownload: {
      description: 'Можно ли скачивать файл',
      control: 'boolean',
    },
    file: {
      description: 'Объект с файлом: `IFileProps`',
    },
    error: {
      description:
        'Текст ошибки, если есть - заменяет собой информацию о файле',
    },
    extra: {
      description:
        'Массив дополнительных текстовых данных для вывода `string[]`',
    },
    onDownload: {
      description:
        'Действие для скачивания: `MouseEventHandler<HTMLButtonElement> | undefined`',
    },
    onRemove: {
      description:
        'Действие для удаленя: `MouseEventHandler<HTMLButtonElement> | undefined`',
    },
    progress: {
      control: 'number',
      description: 'Прогресс текущей загрузки',
    },
  },
  args: {
    canDownload: true,
    canRemove: true,
    error: '',
    file: {
      filename: 'Тестовый файл',
      fileId: '1',
      size: 10 * 1024 * 1024,
      extension: 'pdf',
    },
    extra: [
      'Анашин Антон Владимирович',
      '20.02.2024',
      'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum reiciendis magni quo itaque voluptas quibusdam ab provident odit? Temporibus eius nam asperiores voluptatum, assumenda odio recusandae ea? Sit, dolores voluptas?',
    ],
    progress: 30,
    onRemove: () => null,
    onDownload: () => null,
  },
  parameters: {
    controls: {
      expanded: true,
    },
  },
  component: FileItemComponent,
  title: 'components/FileUploader',
};

export default meta;

const fileName = 'Справочник номер 3963';
const fileItem = { fileId: '1', filename: fileName } as IFileProps;

export const FileItem: StoryFn<typeof FileItemComponent> = (arguments_) => {
  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);

  return (
    <>
      <DemoContainer>
        <Item width={500} label={'Default'}>
          <FileItemComponent {...arguments_}>
            {arguments_.file.filename}
          </FileItemComponent>
        </Item>
      </DemoContainer>
      <Container>
        <Row align='top' noFlex gutter={8}>
          <Row direction='column' align='top' gutter={8}>
            <Item width={500} label={'Default'}>
              <Row
                direction='column'
                align='top'
                gutter={8}
                className={classes.fullWidth}
              >
                <FileItemComponent
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={fileItem}
                  onDownload={(e) => console.log(e)}
                  canRemove
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                  canDownload
                  onRemove={(e) => console.log(e)}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                  onDownload={(e) => console.log(e)}
                  onRemove={(e) => console.log(e)}
                  title='200рП472234авыаыапывапвыпривтThisIsAMixOfLatinAndCyrillicText2345ТестДляПроверкиПримерТекстаЛатинскиеБуквыABCEFКириллицаАБВГД200СимволовДополнительныеСимволыДляДли123412213412431241234124укцкопи2.docx'
                >
                  200рП472234авыаыапывапвыпривтThisIsAMixOfLatinAndCyrillicText2345ТестДляПроверкиПримерТекстаЛатинскиеБуквыABCEFКириллицаАБВГД200СимволовДополнительныеСимволыДляДли123412213412431241234124укцкопи2.docx
                </FileItemComponent>
              </Row>
            </Item>
            <Item width={500} label={'Sizes'}>
              <Row
                direction='column'
                align='top'
                gutter={8}
                className={classes.fullWidth}
              >
                <FileItemComponent
                  size='sm'
                  file={fileItem}
                  onRemove={(e) => console.log(e)}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  size='md'
                  file={fileItem}
                  onRemove={(e) => console.log(e)}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  size='lg'
                  file={fileItem}
                  onRemove={(e) => console.log(e)}
                >
                  {fileName}
                </FileItemComponent>
              </Row>
            </Item>
            <Item width={500} label={'Progress'}>
              <Row
                direction='column'
                align='top'
                gutter={8}
                className={classes.fullWidth}
              >
                <FileItemComponent
                  file={fileItem}
                  progress={35}
                  onCancel={(e) => console.log(e)}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                  progress={75}
                  onCancel={(e) => console.log(e)}
                >
                  {fileName}
                </FileItemComponent>
              </Row>
            </Item>
            <Item width={500} label={'Info'}>
              <Row
                direction='column'
                align='top'
                gutter={8}
                className={classes.fullWidth}
              >
                <FileItemComponent
                  file={fileItem}
                  infoPrefix={<Badge>sample</Badge>}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={fileItem}
                  onDownload={(e) => console.log(e)}
                  onRemove={(e) => console.log(e)}
                  infoPrefix={<Badge>sample</Badge>}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                  infoPrefix={<Badge>sample</Badge>}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                  onDownload={(e) => console.log(e)}
                  onRemove={(e) => console.log(e)}
                  infoPrefix={<Badge>sample</Badge>}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                  infoPrefix={<Badge>sample</Badge>}
                  extra={[
                    'Анашин Антон Владимирович',
                    '20.02.2024',
                    'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum reiciendis magni quo itaque voluptas quibusdam ab provident odit? Temporibus eius nam asperiores voluptatum, assumenda odio recusandae ea? Sit, dolores voluptas?',
                  ]}
                >
                  {fileName}
                </FileItemComponent>
              </Row>
            </Item>
          </Row>

          <Row direction='column' align='top' gutter={8}>
            <Item width={500} label={'Help Text'}>
              <Row
                direction='column'
                align='top'
                gutter={8}
                className={classes.fullWidth}
              >
                <FileItemComponent
                  file={fileItem}
                  extra={['Анашин Антон Владимирович', '20.02.2024']}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={fileItem}
                  extra={[
                    'Анашин Антон Владимирович',
                    '20.02.2024',
                    'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum reiciendis magni quo itaque voluptas quibusdam ab provident odit? Temporibus eius nam asperiores voluptatum, assumenda odio recusandae ea? Sit, dolores voluptas?',
                  ]}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                  extra={[
                    'Анашин Антон Владимирович',
                    '20.02.2024',
                    'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum reiciendis magni quo itaque voluptas quibusdam ab provident odit? Temporibus eius nam asperiores voluptatum, assumenda odio recusandae ea? Sit, dolores voluptas?',
                  ]}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                  extra={[
                    'Анашин Антон Владимирович',
                    '20.02.2024',
                    'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum reiciendis magni quo itaque voluptas quibusdam ab provident odit? Temporibus eius nam asperiores voluptatum, assumenda odio recusandae ea? Sit, dolores voluptas?',
                  ]}
                  onDownload={(e) => console.log(e)}
                  onRemove={(e) => console.log(e)}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                  extra={[
                    'Анашин Антон Владимирович',
                    '20.02.2024',
                    'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Cum reiciendis magni quo itaque voluptas quibusdam ab provident odit? Temporibus eius nam asperiores voluptatum, assumenda odio recusandae ea? Sit, dolores voluptas?',
                  ]}
                  onDownload={(e) => console.log(e)}
                  onRemove={(e) => console.log(e)}
                >
                  200рП472234авыаыапывапвыпривтThisIsAMixOfLatinAndCyrillicText2345ТестДляПроверкиПримерТекстаЛатинскиеБуквыABCEFКириллицаАБВГД200СимволовДополнительныеСимволыДляДли123412213412431241234124укцкопи2.docx
                </FileItemComponent>
              </Row>
            </Item>
            <Item width={500} label={'Error'}>
              <Row
                direction='column'
                align='top'
                gutter={8}
                className={classes.fullWidth}
              >
                <FileItemComponent
                  error='Расширение файла не поддерживается'
                  file={fileItem}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  error='Расширение файла не поддерживается'
                  file={{
                    ...fileItem,
                    size: 10 * 1024 * 1024,
                  }}
                >
                  {fileName}
                </FileItemComponent>
                <FileItemComponent
                  error='Расширение файла не поддерживается'
                  file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                  onDownload={(e) => console.log(e)}
                  onRemove={(e) => console.log(e)}
                >
                  {fileName}
                </FileItemComponent>
              </Row>
            </Item>
            <Item width={500} label={'Popover'}>
              <FileItemComponent
                size='sm'
                file={{ ...fileItem, size: 10 * 1024 * 1024 }}
                removeButtonProps={{ ref: anchorRef }}
                onRemove={(e) => {
                  setOpen(!open);
                  console.log(e);
                }}
              >
                {fileName}
              </FileItemComponent>
            </Item>

            <Popover anchor={anchorRef.current} open={open}>
              Content
            </Popover>
          </Row>
        </Row>

        <Row align='top' noFlex gutter={8}>
          <Item width={500} label={'Extension'}>
            <Row
              direction='column'
              align='top'
              gutter={8}
              className={classes.fullWidth}
            >
              <FileItemComponent file={{ ...fileItem, extension: '.xlsx' }}>
                {`${fileName}.xlsx`}
              </FileItemComponent>
              <FileItemComponent file={{ ...fileItem, extension: '.docx' }}>
                {`${fileName}.docx`}
              </FileItemComponent>
              <FileItemComponent file={{ ...fileItem, extension: '.pdf' }}>
                {`${fileName}.pdf`}
              </FileItemComponent>
              <FileItemComponent file={{ ...fileItem, extension: '.zip' }}>
                {`${fileName}.zip`}
              </FileItemComponent>
              <FileItemComponent file={{ ...fileItem, extension: '.pptx' }}>
                {`${fileName}.pptx`}
              </FileItemComponent>
              <FileItemComponent
                file={{ ...fileItem, extension: '.xlsx' }}
                iconProps={{ stroke: true }}
              >
                {`${fileName}.xlsx`}
              </FileItemComponent>
              <FileItemComponent
                file={{ ...fileItem, extension: '.docx' }}
                iconProps={{ stroke: true }}
              >
                {`${fileName}.docx`}
              </FileItemComponent>
              <FileItemComponent
                file={{ ...fileItem, extension: '.pdf' }}
                iconProps={{ stroke: true }}
              >
                {`${fileName}.pdf`}
              </FileItemComponent>
              <FileItemComponent
                file={{ ...fileItem, extension: '.zip' }}
                iconProps={{ stroke: true }}
              >
                {`${fileName}.zip`}
              </FileItemComponent>
              <FileItemComponent
                file={{ ...fileItem, extension: '.pptx' }}
                iconProps={{ stroke: true }}
              >
                {`${fileName}.pptx`}
              </FileItemComponent>
            </Row>
          </Item>
          <Item width={500} label={'Units'}>
            <Row
              direction='column'
              align='top'
              gutter={8}
              className={classes.fullWidth}
            >
              <FileItemComponent file={{ ...fileItem, size: 1 }}>
                {fileName}
              </FileItemComponent>
              <FileItemComponent file={{ ...fileItem, size: 22 }}>
                {fileName}
              </FileItemComponent>
              <FileItemComponent file={{ ...fileItem, size: 314 }}>
                {fileName}
              </FileItemComponent>
              <FileItemComponent file={{ ...fileItem, size: 47 * 1024 }}>
                {fileName}
              </FileItemComponent>
              <FileItemComponent file={{ ...fileItem, size: 15 * 1024 * 1024 }}>
                {fileName}
              </FileItemComponent>
            </Row>
          </Item>
        </Row>
      </Container>
    </>
  );
};
