import { Reducer } from 'redux';
import { ActionOf } from '../../store/actions';
import { DOWNLOAD_PATH_TYPE_CHANGED, DOWNLOAD_STATIC_PATH_CHANGED } from '../actions';
import { APP_SETTINGS_LOADED } from '../../app/actions';

export enum DownloadPathType {
  ALWAYS_SELECT,
  STATIC
}

type DownloadPathSettings = {
  downloadPathType: DownloadPathType
  downloadStaticPath: string
}

export type DownloadPathSettingsPayloadMap = {
  [DOWNLOAD_PATH_TYPE_CHANGED]: DownloadPathType
  // @ts-ignore
  [DOWNLOAD_STATIC_PATH_CHANGED]: string
}

export const downloadPathSettings: Reducer<
  DownloadPathSettings, any
  | ActionOf<typeof DOWNLOAD_PATH_TYPE_CHANGED>
  | ActionOf<typeof DOWNLOAD_STATIC_PATH_CHANGED>
  | ActionOf<typeof APP_SETTINGS_LOADED>
> = (state: DownloadPathSettings = { downloadPathType: DownloadPathType.ALWAYS_SELECT, downloadStaticPath: '' }, action) => {
  if (action.type === DOWNLOAD_PATH_TYPE_CHANGED || action.type === DOWNLOAD_STATIC_PATH_CHANGED) {
    console.log('downloadPathSettings reducer', action.type, action.payload)
  }
  switch (action.type) {
    case DOWNLOAD_PATH_TYPE_CHANGED:
      return {
        ...state,
        downloadPathType: action.payload.downloadPathType || DownloadPathType.ALWAYS_SELECT,
      }
    case DOWNLOAD_STATIC_PATH_CHANGED:
      return {
        ...state,
        downloadStaticPath: action.payload.downloadStaticPath || ''
      }
    case APP_SETTINGS_LOADED:
      return {
        ...state,
        ...action.payload.downloadPathSettings,
      }
    default:
      return state
  }
}
