import Markdown from 'markdown-to-jsx';

import { IMarkdownViewerProps } from './types';

import classes from './styles.module.scss';

export const MarkdownViewer = ({
  markdown,
  customOptions = {},
}: IMarkdownViewerProps) => {
  if (!markdown) {
    return null;
  }

  return (
    <Markdown
      options={{
        wrapper: ({ children }) => (
          <div className={classes.MDwrapper}>{children}</div>
        ),
        ...customOptions,
        overrides: {
          a: {
            props: {
              className: classes.a,
              target: '_blank',
              rel: 'noreferrer noopener',
            },
          },
          ol: {
            props: { className: classes.ol },
          },
          li: {
            props: { className: classes.li },
          },
          ul: {
            props: { className: classes.ul },
          },
          p: {
            props: { className: classes.p },
          },
          table: {
            props: { className: classes.table },
          },
          ...customOptions?.overrides,
        },
      }}
    >
      {markdown}
    </Markdown>
  );
};
