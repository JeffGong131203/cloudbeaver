/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import type React from 'react';
import styled, { css } from 'reshadow';

import { App, useService } from '@cloudbeaver/core-di';

const style = css`
  button {
    color: white;
    font-weight: 500;
    background-color: #2a7cb4;
    padding: 5px 16px;
    border-radius: 4px;
    letter-spacing: 0.08929em;
    font-size: 0.875rem;
    text-transform: uppercase;
    cursor: pointer;
    outline: none;
    border: none;
    &:hover,
    &:focus {
      opacity: 0.8;
    }
    &:active {
      opacity: 0.5;
    }
  }
`;

interface IProps {
  className?: string;
}

export const AppRefreshButton: React.FC<IProps> = function AppRefreshButton({ className }) {
  const app = useService(App);

  function refresh() {
    app.start();
  }

  return styled(style)(
    <button className={className} onClick={refresh}>
      Refresh
    </button>,
  );
};
