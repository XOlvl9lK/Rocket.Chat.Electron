import { NsisUpdater } from 'electron-updater';
import { GenericServerOptions } from 'builder-util-runtime/out/publishOptions';
import fetch, { RequestInit } from 'electron-fetch'

type GitFlicGetReleasesResponse = {
  _embedded: {
    releaseTagModelList: Array<Release>
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

type Release = {
  id: string
  title: string
  projectId: string
  authorId: string
  description: string
  tagName: string
  commitId: string,
  createdAt: string,
  updatedAt: string,
  attachmentFiles: Array<{ name: string, link: string }>,
  preRelease: boolean
}

export class WindowsUpdater {
  private updater?: NsisUpdater
  private projectUrl = 'https://api.gitflic.ru/project/codemark-team/rocket-chat-electron'

  constructor() {}

  async createUpdater() {
    const latestRelease = await this.getLatestRelease()

    if (latestRelease) {
      const url = `${this.projectUrl}/release/${latestRelease.id}/file`

      this.updater = new NsisUpdater({
        provider: 'generic',
        url,
      } as GenericServerOptions)
    } else {
      throw new Error('Release not found')
    }
  }

  getUpdater() {
    return this.updater
  }

  private async getLatestRelease(): Promise<Release | undefined> {
    const pageSize = 10

    const getUrl = (page: number) => `${this.projectUrl}/release?page=${page}&size=${pageSize}`

    const fetchOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'token 00a83fa3-1b8c-4ed3-995a-79691e6dbc1e'
      },
      method: 'GET',
    }

    const response = await fetch(getUrl(0), fetchOptions)
      .then(res => res.json<GitFlicGetReleasesResponse>())

    if (response.page.totalPages === 1) {
      return response._embedded.releaseTagModelList.pop()
    }

    const latestPage = await fetch(getUrl(response.page.totalPages), fetchOptions)
      .then(res => res.json<GitFlicGetReleasesResponse>())

    return latestPage._embedded.releaseTagModelList.pop()
  }
}
