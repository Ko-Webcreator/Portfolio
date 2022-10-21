// prod環境では何も出力させない
function debug(message?: any, ...optionalParams: any[]): void {}

const Logger = { debug };

export default Logger;
