import { EFileType } from './types';

export function checkFileType(extension: string) {
  if (/(xls|xlsb|xlsm|xlsx)$/i.test(extension)) {
    return EFileType.excel;
  }
  if (/(doc|docm|docx)$/i.test(extension)) {
    return EFileType.word;
  }
  if (/(pdf|ppdf)$/i.test(extension)) {
    return EFileType.pdf;
  }
  if (/(ppt|pptm|pptx)$/i.test(extension)) {
    return EFileType.powerPoint;
  }
  if (/(zip|rar)$/i.test(extension)) {
    return EFileType.archive;
  }

  return extension;
}

export const KBYTES_PER_BYTE = 1024;
export const MBYTES_PER_BYTE = 1024 * 1024;

export const bytesMoreOneMB = (bytes: number) => !(bytes < MBYTES_PER_BYTE);

export const bytesMoreOneKB = (bytes: number) => !(bytes < KBYTES_PER_BYTE);

export const convertBytesToMB = (bytes: number) => {
  if (bytesMoreOneMB(bytes)) {
    return Math.round(bytes / MBYTES_PER_BYTE);
  }
  if (bytesMoreOneKB(bytes)) {
    return Math.round(bytes / KBYTES_PER_BYTE);
  }

  return Math.round(bytes);
};

export const pluralizeBytes = (bytes: number) => {
  const byteWords = {
    single: 'байт',
    few: 'байта',
    many: 'байтов',
  };

  const lastDigit = bytes % 10;
  const lastTwoDigits = bytes % 100;

  // Определяем форму
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return byteWords.many;
  }

  if (lastDigit === 1) {
    return byteWords.single;
  }

  if (lastDigit >= 2 && lastDigit <= 4) {
    return byteWords.few;
  }

  return byteWords.many;
};
