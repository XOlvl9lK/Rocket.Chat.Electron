import { handle } from '../ipc/main';
import { dialog } from 'electron';
import { getRootWindow } from '../ui/main/rootWindow';

export const handleShowDirectoryPicker = () => {
  handle('settings/show-directory-picker', async () => {
    console.log('handle settings/show-directory-picker')
    const rootWindow = await getRootWindow();
    if (rootWindow) {
      const directory = dialog.showOpenDialog(rootWindow, {
        properties: ['openDirectory']
      });
      console.log('directory', directory);
    }
  });
}
