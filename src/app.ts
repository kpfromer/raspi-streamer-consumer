import WebSocket from 'ws';
import path from 'path';
import play from 'audio-play';
import loadAudio from 'audio-loader';
import chalk from 'chalk';
import open from 'open';

const address = '192.168.0.100';
const port = 8083;

type ConsumerOptions = {
  address: string;
  port: number;
  openBrowser?: boolean;
}

const run = async ({ address, port, openBrowser = true }: ConsumerOptions) => {
  const url = `ws://${address}:${port}`;

  const ws = new WebSocket(url);

  ws.on('open', () => {
    console.log(chalk.green(`Connected to WebSocket at "${url}"`));
  });

  ws.onmessage = async event => {
    console.log('Data');
    if (!event) {
      throw new Error('Invalid data.');
    }
    const parsed = JSON.parse(event.data.toString());

    console.log(parsed.motion);

    const audioBuffer = await loadAudio(path.join(__dirname, 'beep.mp3'));

    if (parsed.motion) {
      const pause = play(audioBuffer, {
        start: 0,
        end: audioBuffer.duration,
        volume: 1,
        autoplay: true
      });

      if (openBrowser) {
        await open(`http://${address}:3000`);
      }
    }
  }
}

run({ address, port });