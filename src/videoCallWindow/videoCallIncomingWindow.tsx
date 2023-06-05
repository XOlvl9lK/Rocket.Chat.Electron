import React, { useCallback, useEffect, useState } from 'react';
import { ipcRenderer } from 'electron';

function VideoCallIncomingWindow() {
  const [png, setPng] = useState<string>()
  const [sender, setSender] = useState<string>()

  useEffect(() => {
    ipcRenderer.once('video-call-incoming/avatar', (_event, png: string) => {
      setPng(png)
    })
    ipcRenderer.once('video-call-incoming/sender', (_event, sender: string) => {
      setSender(sender)
    })
  }, [])

  const applyCall = useCallback(() => {
    ipcRenderer.send('video-call-incoming/apply-call')
  }, [])

  const dismissCall = useCallback(() => {
    ipcRenderer.send('video-call-incoming/dismiss-call')
  }, [])

  return (
    <div className='incoming-call-wrap'>
      <div className='incoming-call-header'>
        {png && <img className='incoming-call-avatar' src={png} />}
        <p>{sender}</p>
      </div>
      <div className='incoming-call-buttons-wrap'>
        <button className='incoming-call-button incoming-call-button-apply' onClick={applyCall}>Принять</button>
        <button className='incoming-call-button incoming-call-button-dismiss' onClick={dismissCall}>Отклонить</button>
      </div>
    </div>
  )
}

export default VideoCallIncomingWindow;
