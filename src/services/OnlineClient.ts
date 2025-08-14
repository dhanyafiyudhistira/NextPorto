export type Message = { type: string; payload?: any };

type Listener = (msg: Message) => void;

export class OnlineClient {
  private ws?: WebSocket;
  private listener?: Listener;

  connect(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onmessage = (e) => {
      if (this.listener) {
        this.listener(JSON.parse(e.data));
      }
    };
  }

  onMessage(listener: Listener) {
    this.listener = listener;
  }

  send(msg: Message) {
    this.ws?.send(JSON.stringify(msg));
  }
}
