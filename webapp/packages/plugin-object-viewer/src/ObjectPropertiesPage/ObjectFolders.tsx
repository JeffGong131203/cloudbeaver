/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import styled, { css } from 'reshadow';

import type { ITab } from '@cloudbeaver/core-app';
import { VerticalTabs } from '@cloudbeaver/core-blocks';
import { useController } from '@cloudbeaver/core-di';
import { useStyles, composes } from '@cloudbeaver/core-theming';

import type { IObjectViewerTabState } from '../IObjectViewerTabState';
import { ObjectFoldersController } from './ObjectFoldersController';

const styles = composes(
  css`
    TabList {
      composes: theme-background-surface theme-text-on-surface theme-border-color-background from global;
    }
    VerticalTabs {
      composes: theme-border-color-background from global;
    }
    Tab {
      composes: theme-ripple theme-background-background theme-ripple-selectable from global;
    }
  `,
  css`
    Tab {
      color: inherit;
    }
    VerticalTabs {
      border-top: 1px solid;
      flex: 1;
    }
    TabPanel {
      overflow: auto !important;
    }
    TabList {
      border-right: 1px solid;
    }
  `
);

interface IProps {
  tab: ITab<IObjectViewerTabState>;
}

export const ObjectFolders: React.FC<IProps> = observer(function ObjectFolders({ tab }) {
  const controller = useController(ObjectFoldersController, tab);

  return styled(useStyles(styles))(<VerticalTabs tabContainer={controller.getTabContainer()} style={styles} />);
});
