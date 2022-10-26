import {Socket} from 'net'

export class DataProtocol {
  private _port: number = 8083
  private _ip: string = '127.0.0.1'

  shutdownServer = () => {
    return this.sendText('shutdownServer', '')
  }

  sendText = (name: string, text: string): Promise<Buffer[]> => {
    const client = new Socket()

    let header = ''
    const h = {
      type: 'text',
      name
    }

    Object.entries(h).forEach(([key, value]) => {
      header += `${key}:${value}\n`
    })

    client.connect(this._port, this._ip, function () {
      client.write(`${header}\n${text}`)
    })

    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = []

      client.on('close', function () {
        resolve(chunks)
      })

      client.on('error', (err) => {
        reject(err)
      })

      client.on('data', function (data) {
        chunks.push(data)
      })
    })
  }

  sendJson = (event: string, data: object) => {
    return this.sendText(event, JSON.stringify(data))
  }

  ping = () => {
    return this.sendText('ping', '')
  }

  requestImage = async (path: string, resize: number): Promise<Blob> => {
    const image = await this.sendJson('requestImage', {
      path,
      resize
    })

    return new Blob(image, {
      type: 'image/jpeg'
    })
  }
}