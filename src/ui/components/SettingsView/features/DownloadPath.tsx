import React, { useCallback } from 'react';
import { Field, RadioButton, Box, Button } from '@rocket.chat/fuselage';
import { dispatch } from '../../../../store';
import { DOWNLOAD_PATH_TYPE_CHANGED, SETTINGS_SHOW_DIRECTORY_PICKER } from '../../../actions';
import { DownloadPathType } from '../../../reducers/downloadPathSettings';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store/rootReducer';

export const DownloadPath = () => {
  const { downloadPathType, downloadStaticPath } = useSelector(
    ({ downloadPathSettings }: RootState) =>
      downloadPathSettings
  );

  const onChoseFolder = useCallback(() => {
    dispatch({ type: SETTINGS_SHOW_DIRECTORY_PICKER })
  }, [])

  const onDownloadPathTypeChange = useCallback((type: DownloadPathType) => {
    // @ts-ignore
    dispatch({ type: DOWNLOAD_PATH_TYPE_CHANGED, payload: { downloadPathType: type }})
  }, [])

  return (
    <Field margin='15px 0'>
      <Field.Row>
        <Field.Label>
          Настройка сохранения файлов
        </Field.Label>
      </Field.Row>
      <Field.Row>
        <Box display='flex' flexDirection='column' margin='10px 0'>
          <Box display='flex' mie='12px'>
            <RadioButton onChange={() => onDownloadPathTypeChange(DownloadPathType.ALWAYS_SELECT)} checked={downloadPathType === DownloadPathType.ALWAYS_SELECT} />
            <Box mis='8px'>Всегда спрашивать, куда сохранять файлы</Box>
          </Box>
          <Box display='flex' mie='20px' margin='8px 0 0 0' alignItems='center'>
            <RadioButton onChange={() => onDownloadPathTypeChange(DownloadPathType.STATIC)} checked={downloadPathType === DownloadPathType.STATIC} />
            <Box mis='8px' mie='16px' style={{ color: downloadPathType === DownloadPathType.STATIC ? 'auto' : 'edede9' }}>Сохранять в: {downloadStaticPath}</Box>
            <Button disabled={downloadPathType === DownloadPathType.ALWAYS_SELECT} onClick={onChoseFolder} small>Изменить</Button>
          </Box>
        </Box>
      </Field.Row>
    </Field>
  );
};
