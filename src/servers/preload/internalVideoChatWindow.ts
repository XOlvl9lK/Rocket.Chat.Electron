import { ipcRenderer, shell } from 'electron';

import { select } from '../../store';
import { getServerUrl } from './urls';

export const getInternalVideoChatWindowEnabled = (): boolean =>
  select(({ isInternalVideoChatWindowEnabled }) => ({
    isInternalVideoChatWindowEnabled,
  })).isInternalVideoChatWindowEnabled;

export type OpenInternalVideoChatWindowProps = {
  onClose?: () => void;
  serverUrl?: string
  userId?: string
  callId?: string
};

export const openInternalVideoChatWindow = (
  url: string,
  userId?: string,
  callId?: string
): void => {
  if (!process.mas && getInternalVideoChatWindowEnabled()) {
    ipcRenderer.invoke('video-call-window/open-window', url, { serverUrl: getServerUrl(), userId, callId });
  } else {
    const validUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    if (allowedProtocols.includes(validUrl.protocol)) {
      shell.openExternal(validUrl.href);
    }
  }
};
