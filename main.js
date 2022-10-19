require('dotenv').config();
const { Client, GatewayIntentBits, Partials, SlashCommandBuilder, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType, SnowflakeUtil } = require('discord.js'), //これ使って一部の機能が使える。
	client = new Client({
		partials: [Partials.Channel],
		intents: [
			GatewayIntentBits.Guilds,
			GatewayIntentBits.GuildVoiceStates,
			GatewayIntentBits.GuildMessages,
			GatewayIntentBits.GuildMessageReactions,
			GatewayIntentBits.DirectMessages,
			GatewayIntentBits.MessageContent
		]
	}),
	data = require("./data.json");
let channellog,
	br = "\n",
	bro = "```",
	scommand = [
		new SlashCommandBuilder()
			.setName("help")
			.setDescription("ヘルプを表示します。")
	],
	texts = data.texts;
for (let i = 0; i != data.data.length; i++) {
	scommand.push(new SlashCommandBuilder()
		.setName(data.data[i].command)
		.setDescription(data.data[i].name));
};
client.on('ready', () => {
	try {
		channellog = client.channels.cache.get(data.channel_log);
		client.user.setPresence({ activities: [{ name: data.playing }], status: "online" }); //ステータス設定
		client.application.commands.set(scommand); //botにセット
		console.log("Bot準備完了～\nnode.js:" + process.version + "\nDiscord.js:v" + require('discord.js').version); //ログインできたか確認＆バージョン参照
	} catch (e) {
		errorsend("ready", e);
	};
});
client.on('interactionCreate', interaction => {
	try {
		if (!interaction.isCommand()) return; //これちょっとわからない
		var cmdname = interaction.commandName; //入力されたコマンド
		console.log(cmdname); //出力
		if (cmdname == "help") {
			let helpnotes = autobr(texts[0]);
			interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle("ヘルプ")
						.setDescription("今調べられる都道府県の数は、`" + data.data.length + "`個調べられます")
						.setColor(0x7289da)
						.addFields({ name: "botについて", value: helpnotes })
				]
			}); //送信
		} else if (cmdname == "psb") {
			var cmdsubname = interaction.options.getString("select");
			console.log(cmdsubname); //出力
			var set = false; //これコマンドがjsonの中から当たらなかったかどうか判断するために使う
			for (let i = 0; i != data.data.length; i++) { //dataの数だけ
				if (cmdsubname == data.data[i].command) { //コマンドがあってるか繰り返す(ループして一つ一つ当たるかifで判断)
					interaction.reply({ //当たったら返信する
						embeds: [
							new EmbedBuilder()
								.setTitle(data.data[i].name)
								.setDescription(data.data[i].explanation)
								.setColor(0x7289da)
								.addFields({ name: "botについて", value: helpnotes })
						]
					});
					set = true; //当たったことにする
				};
			};
			if (set != true) { //当たらなかったらif実行。でも他のコマンドはないから、下の文字列を返す
				interaction.reply({ content: autobr(texts[1]), ephemeral: true });
			};
		} else {
			var set = false; //これコマンドがjsonの中から当たらなかったかどうか判断するために使う
			if (set != true) { //当たらなかったらif実行。でも他のコマンドはないから、下の文字列を返す
				interaction.reply({ content: autobr(texts[1]), ephemeral: true });
			};
		};
	} catch (e) {
		errorsend("interactionCreate", e);
	};
});
client.on('messageCreate', message => {
	try {
		if (message.author.bot) return; //bot自身なら実行停止
		if (message.mentions.users.has(client.user.id) || message.mentions.roles.some(r => [client.user.username].includes(r.name)) ? true : false) {
			message.reply("呼びましたか？コマンド使ってくれないと怒りますっ！");
		};
	} catch (e) {
		errorsend("messageCreate", e);
	};
});
function autobr(textdata) {
	var outdata = "";
	for (var i = 0; i != textdata.length; i++) {
		if (outdata != "") {
			outdata = outdata + br;
		};
		outdata = outdata + textdata[i];
	};
	return outdata;
};
function errorsend(set, e) {
	console.log(e); console.log(set); let errornotes = autobr(texts[2]);
	channellog.send({
		embeds: [{
			title: "エラー検知",
			description: set + errornotes,
			fields: [{
				name: "内容",
				value: bro + e + bro
			}],
			timestamp: new Date()
		}]
	});
};
if (process.env.IBUKI_BOT_TOKEN == undefined || process.env.IBUKI_BOT_TOKEN == "") {
	console.log('トークンがundefinedとなっていたため、実行を停止します。');
	process.exit(0);
};
client.login(process.env.IBUKI_BOT_TOKEN);