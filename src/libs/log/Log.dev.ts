function debug(message?: any, ...params: any[]): void {
  const messages = message ? [message, ...params] : [];
  console.info(...messages);
}

const Log = { debug };

export default Log;
