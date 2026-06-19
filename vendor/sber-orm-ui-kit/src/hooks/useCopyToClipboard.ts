import { INotificationOptions } from '../components/Notification';

type TClipBoardValueType = string | null;
type TCopyFunctionType = (
  text: TClipBoardValueType,
  options?: {
    silent?: boolean;
    addNotification?: (content: string, options?: INotificationOptions) => void;
    successMessage?: string;
    errorMessage?: string;
  },
) => Promise<boolean>;

const copy: TCopyFunctionType = async (text, options) => {
  let result = false;

  if (navigator?.clipboard) {
    try {
      await navigator.clipboard.writeText(text || '');

      result = true;
    } catch {
      result = false;
    }
  } else {
    // Hack with textarea method if clipboard not supported
    const textArea = document.createElement('textarea');

    textArea.value = text || '';
    textArea.style.position = 'fixed';
    document.body.append(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand('copy');
      result = true;
    } catch {
      result = false;
    } finally {
      textArea.remove();
    }
  }

  if (!options?.silent) {
    result
      ? options?.addNotification?.(options?.successMessage ?? '', {
          type: 'success',
        })
      : options?.addNotification?.(options?.errorMessage ?? '', {
          type: 'error',
        });
  }

  return result;
};

export const useCopyToClipboard = (): TCopyFunctionType => copy;
