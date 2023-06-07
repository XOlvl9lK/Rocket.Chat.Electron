import path from 'path';
import {
  app,
  BrowserWindow,
  desktopCapturer,
  ipcMain,
  WebContents,
  screen,
  systemPreferences,
} from 'electron';

import { handle } from '../ipc/main';
import { getRootWindow } from '../ui/main/rootWindow';
import { setIsOnCall } from '../userPresence/setIsOnCall';
import { dismissCall } from './dismissCall';

export const handleDesktopCapturerGetSources = () => {
  handle('desktop-capturer-get-sources', async (_event, opts) =>
    desktopCapturer.getSources(opts[0])
  );
};

const openVideoCallWindow = async (url: string, options?: { userId?: string, serverUrl?: string, callId?: string }) => {
  console.log('[Rocket.Chat Desktop] open-internal-video-chat-window', url);
  const validUrl = new URL(url);
  const allowedProtocols = ['http:', 'https:'];
  if (allowedProtocols.includes(validUrl.protocol)) {
    const mainWindow = await getRootWindow();
    const winBounds = await mainWindow.getNormalBounds();

    const centeredWindowPosition = {
      x: winBounds.x + winBounds.width / 2,
      y: winBounds.y + winBounds.height / 2,
    };

    const actualScreen = screen.getDisplayNearestPoint({
      x: centeredWindowPosition.x,
      y: centeredWindowPosition.y,
    });

    let { x, y } = actualScreen.bounds;
    let { width, height } = actualScreen.bounds;

    width = Math.round(actualScreen.workAreaSize.width * 0.8);
    height = Math.round(actualScreen.workAreaSize.height * 0.8);

    x = Math.round(
      (actualScreen.workArea.width - width) / 2 + actualScreen.workArea.x
    );
    y = Math.round(
      (actualScreen.workArea.height - height) / 2 + actualScreen.workArea.y
    );

    await setIsOnCall({
      userId: options?.userId,
      serverUrl: options?.serverUrl,
      isOnCall: true,
      callId: options?.callId
    })

    const videoCallWindow = new BrowserWindow({
      width,
      height,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        contextIsolation: false,
        webviewTag: true,
        // preload: `${__dirname}/video-call-window.js`,
      },

      show: false,
    });

    videoCallWindow.setBounds({
      width,
      height,
      x,
      y,
    });

    videoCallWindow.loadFile(
      path.join(app.getAppPath(), 'app/video-call-window.html')
    );
    videoCallWindow.once('ready-to-show', () => {
      console.log('[Rocket.Chat Desktop] ready-to-show', url);
      videoCallWindow.webContents.send('video-call-window/open-url', url);
      videoCallWindow.show();
    });
    videoCallWindow.on('close', async () => {
      await setIsOnCall({
        userId: options?.userId,
        serverUrl: options?.serverUrl,
        isOnCall: false,
        callId: options?.callId
      })
    })

    // videoCallWindow.webContents.openDevTools();

    const handleDidAttachWebview = (
      _event: Event,
      webContents: WebContents
    ): void => {
      // console.log('[Rocket.Chat Desktop] did-attach-webview');
      // webContents.openDevTools();
      webContents.session.setDisplayMediaRequestHandler((_request, cb) => {
        videoCallWindow.webContents.send(
          'video-call-window/open-screen-picker'
        );
        ipcMain.once(
          'video-call-window/screen-sharing-source-responded',
          (_event, id) => {
            if (!id) {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              cb(null);
              return;
            }

            desktopCapturer
              .getSources({ types: ['window', 'screen'] })
              .then((sources) => {
                cb({ video: sources.find((s) => s.id === id) });
              });
          }
        );
      });
    };

    videoCallWindow.webContents.addListener(
      'did-attach-webview',
      handleDidAttachWebview
    );
  }
};

export const startVideoCallWindowHandler = (): void => {
  handle(
    'video-call-window/screen-recording-is-permission-granted',
    async () => {
      const permission = systemPreferences.getMediaAccessStatus('screen');
      return permission === 'granted';
    }
  );

  handle('video-call-window/open-window', async (_event, url, options) => {
    await openVideoCallWindow(url, options);
  });
};

export const incomingCallWindowHandler = () => {
  handle('video-call/incoming', async (_event, url, { serverUrl, userId, png, callId, rid, sender }) => {
    const incomingCallWindow = new BrowserWindow({
      width: 300,
      height: 350,
      webPreferences: {
        nodeIntegration: true,
        nodeIntegrationInSubFrames: true,
        contextIsolation: false,
        webviewTag: true,
      },
      show: false,
      alwaysOnTop: true,
    });

    incomingCallWindow.loadFile(
      path.join(app.getAppPath(), 'app/video-call-incoming-window.html')
    );

    incomingCallWindow.once('ready-to-show', () => {
      incomingCallWindow.webContents.send('video-call-incoming/avatar', png)
      incomingCallWindow.webContents.send('video-call-incoming/sender', sender)
      incomingCallWindow.show()
      incomingCallWindow.focus()
      incomingCallWindow.center()
    });

    ipcMain.once('video-call-incoming/apply-call', async () => {
      incomingCallWindow.close()
      await openVideoCallWindow(url, { serverUrl, userId, callId })
    });

    ipcMain.once('video-call-incoming/dismiss-call', async () => {
      if (serverUrl && callId && rid && userId) {
        await dismissCall({ serverUrl, calleeId: userId, rid, callId })
      }
      incomingCallWindow.close()
    });
  })
};
