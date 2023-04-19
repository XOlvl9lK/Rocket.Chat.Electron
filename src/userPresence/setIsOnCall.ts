import fetch from 'electron-fetch'

type SetIsOnCallProps = {
  serverUrl?: string
  userId?: string
  isOnCall: boolean
}

export const setIsOnCall = async ({ isOnCall, userId, serverUrl }: SetIsOnCallProps) => {
  if (userId && serverUrl) {
    await fetch(`${serverUrl}api/v1/users.setIsOnCall`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify({
        isOnCall,
        userId,
      })
    })
  }
}
