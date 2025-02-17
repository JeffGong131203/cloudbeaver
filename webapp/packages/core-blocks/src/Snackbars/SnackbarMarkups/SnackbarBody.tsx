/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { s } from '../../s';
import { useS } from '../../useS';
import style from './SnackbarBody.m.css';

interface Props {
  title: string;
  className?: string;
}

export const SnackbarBody: React.FC<React.PropsWithChildren<Props>> = function SnackbarBody({ title, className, children }) {
  const styles = useS(style);
  return (
    <div data-testid="notification-body" className={s(styles, { notificationBody: true }, className)}>
      <div data-testid="body-text-block" className={styles.bodyTextBlock}>
        <h2 data-testid="text-block-title" title={title} className={styles.textBlockTitle}>
          {title}
        </h2>
        <div data-testid="message" className={styles.message}>
          {children}
        </div>
      </div>
    </div>
  );
};
