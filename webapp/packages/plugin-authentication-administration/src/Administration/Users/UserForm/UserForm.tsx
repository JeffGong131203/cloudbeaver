/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { observer } from 'mobx-react-lite';
import styled, { css } from 'reshadow';

import { Button, Loader, StatusMessage, SubmittingForm, useFocus, useStyles, useTranslate } from '@cloudbeaver/core-blocks';
import { useController, useService } from '@cloudbeaver/core-di';
import type { AdminUserInfo } from '@cloudbeaver/core-sdk';
import { BASE_TAB_STYLES, TabList, TabPanelList, TabsState, UNDERLINE_TAB_BIG_STYLES, UNDERLINE_TAB_STYLES } from '@cloudbeaver/core-ui';

import { UserFormController } from './UserFormController';
import { UserFormService } from './UserFormService';

const tabsStyles = css`
  TabList {
    position: relative;
    flex-shrink: 0;
    align-items: center;
  }
`;

const formStyles = css`
  FormBox {
    composes: theme-background-secondary theme-text-on-secondary from global;
  }
  box {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 100%;
    overflow: auto;
  }
  content-box {
    composes: theme-background-secondary theme-text-on-secondary theme-border-color-background from global;
    display: flex;
    flex: 1;
    flex-direction: column;
    overflow: auto;
  }
  SubmittingForm {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
  }
`;

const topBarStyles = css`
  connection-top-bar {
    composes: theme-border-color-background theme-background-secondary theme-text-on-secondary from global;
    position: relative;
    display: flex;
    padding-top: 16px;
    margin-bottom: 24px;

    &:before {
      content: '';
      position: absolute;
      bottom: 0;
      width: 100%;
      border-bottom: solid 2px;
      border-color: inherit;
    }
  }
  connection-top-bar-tabs {
    overflow: hidden;
    flex: 1;
  }
  StatusMessage {
    padding: 0 16px;
  }
  connection-top-bar-actions {
    display: flex;
    align-items: center;
    padding: 0 24px;
    gap: 16px;
  }
`;

interface Props {
  user: AdminUserInfo;
  editing?: boolean;
  onCancel: () => void;
}

export const UserForm = observer<Props>(function UserForm({ user, editing = false, onCancel }) {
  const style = [BASE_TAB_STYLES, tabsStyles, UNDERLINE_TAB_STYLES, UNDERLINE_TAB_BIG_STYLES];
  const styles = useStyles(style, topBarStyles, formStyles);
  const translate = useTranslate();
  const service = useService(UserFormService);
  const controller = useController(UserFormController);
  const [focusedRef] = useFocus<HTMLFormElement>({ focusFirstChild: true });

  controller.update(user, editing, onCancel);

  return styled(styles)(
    <TabsState localState={controller.partsState} container={service.tabsContainer} user={user} controller={controller} editing={editing}>
      <box>
        <connection-top-bar>
          <connection-top-bar-tabs>
            <StatusMessage
              status={controller.statusMessage?.status}
              message={controller.statusMessage?.message}
              onShowDetails={controller.error.hasDetails ? controller.showDetails : undefined}
            />
            <TabList style={style} />
          </connection-top-bar-tabs>
          <connection-top-bar-actions>
            <Button type="button" disabled={controller.isSaving} mod={['outlined']} onClick={onCancel}>
              {translate('ui_processing_cancel')}
            </Button>
            <Button type="button" disabled={controller.isSaving} mod={['unelevated']} onClick={controller.save}>
              {translate(!editing ? 'ui_processing_create' : 'ui_processing_save')}
            </Button>
          </connection-top-bar-actions>
        </connection-top-bar>
        <content-box>
          <SubmittingForm ref={focusedRef}>
            <Loader loading={controller.isLoading || !controller.configured}>
              <TabPanelList style={style} />
            </Loader>
          </SubmittingForm>
        </content-box>
      </box>
    </TabsState>,
  );
});
