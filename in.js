const dotenv = require('dotenv');
const result = dotenv.config();
console.log("ローカルでbotを実行しています。" + process.env.IBUKI_BOT_TOKEN);