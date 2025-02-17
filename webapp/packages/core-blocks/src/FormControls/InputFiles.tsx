/*
 * CloudBeaver - Cloud Database Manager
 * Copyright (C) 2020-2023 DBeaver Corp and others
 *
 * Licensed under the Apache License, Version 2.0.
 * you may not use this file except in compliance with the License.
 */
import { observer } from 'mobx-react-lite';
import { forwardRef, useContext, useEffect, useState } from 'react';
import styled, { css, use } from 'reshadow';

import type { ComponentStyle } from '@cloudbeaver/core-theming';

import { Button } from '../Button';
import { getLayoutProps } from '../Containers/filterLayoutFakeProps';
import type { ILayoutSizeProps } from '../Containers/ILayoutSizeProps';
import elementsSizeStyles from '../Containers/shared/ElementsSize.m.css';
import { useTranslate } from '../localization/useTranslate';
import { s } from '../s';
import { Tag } from '../Tags/Tag';
import { Tags } from '../Tags/Tags';
import { UploadArea } from '../UploadArea';
import { useCombinedHandler } from '../useCombinedHandler';
import { useRefInherit } from '../useRefInherit';
import { useS } from '../useS';
import { useStateDelay } from '../useStateDelay';
import { useStyles } from '../useStyles';
import { baseFormControlStyles, baseInvalidFormControlStyles, baseValidFormControlStyles } from './baseFormControlStyles';
import { FormContext } from './FormContext';
import { isControlPresented } from './isControlPresented';

const INPUT_FIELD_STYLES = css`
  field-label {
    display: block;
    composes: theme-typography--body1 from global;
    font-weight: 500;
  }
  field-label:not(:empty) {
    padding-bottom: 10px;
  }
  input-container {
    position: relative;
  }
  Tags {
    padding-top: 8px;

    &:empty {
      display: none;
    }
  }
`;

type BaseProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'name' | 'value' | 'style'> &
  ILayoutSizeProps & {
    error?: boolean;
    loading?: boolean;
    description?: string;
    labelTooltip?: string;
    hideTags?: boolean;
    mod?: 'surface';
    ref?: React.Ref<HTMLInputElement>;
    style?: ComponentStyle;
    aggregate?: boolean;
    onDuplicate?: (files: File[]) => void;
  };

type ControlledProps = BaseProps & {
  name?: string;
  value?: FileList | null;
  onChange?: (value: FileList | null, name?: string) => any;
  state?: never;
  autoHide?: never;
};

type ObjectProps<TKey extends keyof TState, TState> = BaseProps & {
  name: TKey;
  state: TState;
  onChange?: (value: TState[TKey], name: TKey) => any;
  autoHide?: boolean;
  value?: never;
};

interface InputFilesType {
  (props: ControlledProps): React.ReactElement<any, any> | null;
  <TKey extends keyof TState, TState>(props: ObjectProps<TKey, TState>): React.ReactElement<any, any> | null;
}

export const InputFiles: InputFilesType = observer(
  forwardRef(function InputFiles(
    {
      name,
      style,
      value: valueControlled,
      required,
      state,
      children,
      className,
      error,
      loading,
      description,
      labelTooltip,
      hideTags,
      mod,
      autoHide,
      aggregate,
      onChange,
      onDuplicate,
      ...rest
    }: ControlledProps | ObjectProps<any, any>,
    refInherit: React.Ref<HTMLInputElement>,
  ) {
    const layoutProps = getLayoutProps(rest);
    const ref = useRefInherit<HTMLInputElement>(refInherit);
    const [innerState, setInnerState] = useState<FileList | null>(null);
    const translate = useTranslate();
    const styles = useStyles(baseFormControlStyles, error ? baseInvalidFormControlStyles : baseValidFormControlStyles, INPUT_FIELD_STYLES, style);
    const sizeStyles = useS(elementsSizeStyles);
    const context = useContext(FormContext);
    loading = useStateDelay(loading ?? false, 300);

    let value = valueControlled ?? innerState;

    if (state && name !== undefined && name in state) {
      value = state[name];
    }

    function setValue(value: FileList | null) {
      if (aggregate) {
        if (value) {
          const currentFiles = Array.from(innerState || []);
          const newFiles = Array.from(value);
          const existingFiles = new Set();
          const aggregation = new DataTransfer();

          for (const file of [...currentFiles, ...newFiles]) {
            if (!existingFiles.has(file.name)) {
              aggregation.items.add(file);
              existingFiles.add(file.name);
            }
          }

          const duplication = newFiles.filter(n => currentFiles.some(c => c.name === n.name));

          if (duplication.length > 0) {
            onDuplicate?.(duplication);
          }

          value = aggregation.files;
        }
      }

      setInnerState(value);
      if (state) {
        state[name] = value;
      }
      if (onChange) {
        onChange(value, name);
      }
      if (context) {
        context.change(value, name);
      }
    }

    const removeFile = useCombinedHandler(function removeFile(index: number): void {
      if (!value) {
        return;
      }

      const dt = new DataTransfer();

      for (let i = 0; i < value.length; i++) {
        const file = value[i];
        if (index !== i) {
          dt.items.add(file);
        }
      }

      setValue(dt.files.length === 0 ? null : dt.files);
    });

    const handleChange = useCombinedHandler((event: React.ChangeEvent<HTMLInputElement>) => {
      setValue(event.target.files);
    });

    useEffect(() => {
      if (value !== innerState) {
        setInnerState(value);
      }
    });

    if (autoHide && !isControlPresented(name, state)) {
      return null;
    }

    const files = Array.from(value ?? []);

    return styled(styles)(
      <field className={s(sizeStyles, { ...layoutProps }, className)}>
        <field-label title={labelTooltip || rest.title}>
          {children}
          {required && ' *'}
        </field-label>
        <input-container>
          <UploadArea ref={ref} {...rest} name={name} value={value} {...use({ mod })} required={required} onChange={handleChange}>
            <Button icon="/icons/import.svg" tag="div" loading={loading} mod={['outlined']}>
              {translate(rest.multiple ? 'ui_upload_files' : 'ui_upload_file')}
            </Button>
          </UploadArea>
          {!hideTags && (
            <Tags>
              {files.map((file, i) => (
                <Tag key={file.name} id={i} label={file.name} onRemove={removeFile} />
              ))}
            </Tags>
          )}
        </input-container>
        {description && <field-description>{description}</field-description>}
      </field>,
    );
  }),
);
