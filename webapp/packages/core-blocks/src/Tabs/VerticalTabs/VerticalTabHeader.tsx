/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2021 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */

import { observer } from 'mobx-react-lite';
import styled from 'reshadow';

import { useStyles, ComponentStyle } from '@cloudbeaver/core-theming';

import type { ITab } from '../ITab';
import { Tab } from '../Tab/Tab';
import { TabIcon } from '../Tab/TabIcon';
import { TabTitle } from '../Tab/TabTitle';
import { verticalTabStyles } from './verticalTabStyles';

interface IProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style'> {
  tab: ITab;
  style: ComponentStyle;
}

export const VerticalTabHeader: React.FC<IProps> = observer(function VerticalTabHeader({ tab, style, ...props }) {
  return styled(useStyles(verticalTabStyles, style))(
    <Tab
      tabId={tab.tabId}
      onOpen={tab.onActivate}
      onClose={tab.onClose}
      {...props}
    >
      {tab.icon && <TabIcon icon={tab.icon} />}
      <TabTitle>{tab.title}</TabTitle>
    </Tab>
  );
});
