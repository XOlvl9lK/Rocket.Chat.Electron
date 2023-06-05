import { ipcRenderer, shell } from 'electron';
import { getServerUrl } from './urls';
import { getInternalVideoChatWindowEnabled } from './internalVideoChatWindow';

export const openIncomingCallWindow = (url: string, png: string, userId?: string, callId?: string, rid?: string, sender?: string) => {
  if (!process.mas && getInternalVideoChatWindowEnabled()) {
    ipcRenderer.invoke('video-call/incoming', url, { serverUrl: getServerUrl(), userId, png, callId, rid, sender });
  } else {
    const validUrl = new URL(url);
    const allowedProtocols = ['http:', 'https:'];
    if (allowedProtocols.includes(validUrl.protocol)) {
      shell.openExternal(validUrl.href);
    }
  }
}
