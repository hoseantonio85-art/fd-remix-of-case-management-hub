import React, { useMemo } from 'react';

interface ICompoundNameProps {
  name: string;
  search: string;
}

interface ISplitPart {
  text: string;
  isHighlighted: boolean;
}

function highlightAllOccurrences(str: string, search: string): ISplitPart[] {
  if (!search.trim() || !str.trim()) {
    return [{ text: str, isHighlighted: false }];
  }

  const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(${escapedSearch})`, 'gi');
  const testRegex = new RegExp(`^${escapedSearch}$`, 'i');

  return str
    .split(regex)
    .map((part, index) => ({
      text: part,
      isHighlighted: index % 2 === 1 && testRegex.test(part),
    }))
    .filter((part) => part.text !== '');
}

export const CompoundName = (props: ICompoundNameProps) => {
  const { name, search } = props;

  const highlightedParts = useMemo(
    () => highlightAllOccurrences(name, search),
    [name, search],
  );

  if (!search) {
    return name;
  }

  return (
    <>
      {highlightedParts.map((part, index) =>
        part.isHighlighted ? (
          <span key={index}>{part.text}</span>
        ) : (
          <React.Fragment key={index}>{part.text}</React.Fragment>
        ),
      )}
    </>
  );
};
