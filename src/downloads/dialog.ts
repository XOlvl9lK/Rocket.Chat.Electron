import { dialog } from 'electron';
import { getRootWindow } from '../ui/main/rootWindow';

export const showDownloadFolderDialog = async () => {
  const rootWindow = await getRootWindow()

  return await dialog.showOpenDialog(rootWindow, {
    properties: ['openDirectory']
  });
}
