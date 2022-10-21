/**
 * 本番環境ではログ出力されないように環境変数でLogを切り替え
 */
if (process.env.NODE_ENV === 'production') {
  module.exports = require('./Log.prod.ts');
} else {
  module.exports = require('./Log.dev.ts');
}
