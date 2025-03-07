import cx from 'clsx';
import { ReactNode } from 'react';
import classes from './DescriptionList.module.css';

export interface DescriptionListProps {
  children: ReactNode;
  compact?: boolean;
}

export function DescriptionList(props: DescriptionListProps): JSX.Element {
  const { children, compact } = props;
  return <dl className={cx(classes.root, { [classes.compact]: compact })}>{children}</dl>;
}

export interface DescriptionListEntryProps {
  term: string;
  children: ReactNode;
}

export function DescriptionListEntry(props: DescriptionListEntryProps): JSX.Element {
  return (
    <>
      <dt>{props.term}</dt>
      <dd>{props.children}</dd>
    </>
  );
}
