import { AnyAction } from 'redux';

import { Download } from '../downloads/common';
import { Server } from '../servers/common';
import { SystemIdleState } from '../userPresence/common';
import { OpenInternalVideoChatWindowProps } from '../servers/preload/internalVideoChatWindow';

type ChannelToArgsMap = {
  'redux/get-initial-state': () => unknown;
  'redux/action-dispatched': (action: AnyAction) => void;
  'servers/fetch-info': (urlHref: string) => [urlHref: string, version: string];
  'notifications/fetch-icon': (urlHref: string) => string;
  'power-monitor/get-system-idle-state': (
    idleThreshold: number
  ) => SystemIdleState;
  'downloads/show-in-folder': (itemId: Download['itemId']) => void;
  'downloads/copy-link': (itemId: Download['itemId']) => void;
  'downloads/pause': (itemId: Download['itemId']) => void;
  'downloads/resume': (itemId: Download['itemId']) => void;
  'downloads/cancel': (itemId: Download['itemId']) => void;
  'downloads/retry': (itemId: Download['itemId']) => void;
  'downloads/remove': (itemId: Download['itemId']) => void;
  'certificatesManager/remove': (domain: string) => void;
  'server-view/get-url': () => Server['url'] | undefined;
  'server-view/ready': () => void;
  'video-call-window/open-window': (url: string, options?: OpenInternalVideoChatWindowProps) => void;
  'video-call-window/open-url': (url: string) => void;
  'video-call-window/web-contents-id': (webContentsId: number) => void;
  'video-call-window/open-screen-picker': () => void;
  'video-call-window/screen-sharing-source-responded': (source: string) => void;
  'video-call-window/screen-recording-is-permission-granted': () => boolean;
  'video-call/incoming': (url: string, options: { png?: string, serverUrl?: string, userId?: string, callId?: string, rid?: string, sender?: string }) => void
  'jitsi-desktop-capturer-get-sources': (
    options: Electron.SourcesOptions
  ) => Electron.DesktopCapturerSource[];
  'desktop-capturer-get-sources': (
    options: Electron.SourcesOptions
  ) => Electron.DesktopCapturerSource[];
  'settings/show-directory-picker': () => void
};

export type Channel = keyof ChannelToArgsMap;
export type Handler<N extends Channel> = ChannelToArgsMap[N];
