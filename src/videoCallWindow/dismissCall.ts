import fetch from 'electron-fetch';

type DismissCallProps = {
  rid: string
  calleeId: string
  callId: string
  serverUrl: string
}

export const dismissCall = async ({ callId, rid, calleeId, serverUrl }: DismissCallProps) => {
  await fetch(`${serverUrl}api/v1/video-conference.dismiss`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify({
      callId,
      rid,
      calleeId,
    })
  })
}
