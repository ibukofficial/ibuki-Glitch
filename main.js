require("./in.js");
const { Client, GatewayIntentBits, Partials, EmbedBuilder, ApplicationCommandType, ApplicationCommandOptionType } = require('discord.js'), //これ使って一部の機能が使える。
	client = new Client({
		partials: [Partials.Channel],
		intents: [GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
		GatewayIntentBits.DirectMessages, GatewayIntentBits.MessageContent]
	}), //インテントとは、メッセージにが送信されたことを取得したり、最近だとメッセージ内容を取得するかどうがを決める
	data = require("./data.json"); //json取り込み
var args, cmdname, channellog,
	br = "\n",
	bro = "```",
	scommand = [
		{
			name: "help",
			description: "ヘルプを表示します。"
		},
		{
			type: ApplicationCommandOptionType.SubcommandGroup,
			name: "psb",
			description: "各地の情報を表示します。",
			options: []
		}
	],
	helpdata = "```",
	texts = data.texts;
for (var i = 0; i != data.data.length; i++) {
	scommand[1].options.push({
		type: ApplicationCommandOptionType.Subcommand,
		name: data.data[i].command,
		description: data.data[i].name,
	});
};
console.log(scommand[1]);
for (var ig = 0; ig != data.data.length; ig++) {
	if (helpdata != bro) { helpdata = helpdata + br; };
	helpdata = helpdata + data.data[ig].name + ":" + data.data[ig].command; //ヘルプを１列追加
}; helpdata = helpdata + bro;
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
				embeds: [{
					title: "ヘルプ",
					description: "今調べられる都道府県の数は、`" + data.data.length + "`個調べられます",
					color: 0x7289da,
					fields: [
						{ name: "一覧", value: helpdata },
						{ name: "botについて", value: helpnotes }
					]
				}]
			}); //送信
		} else if (cmdname == "psb") {
			var cmdsubname = interaction.options.getString("select")
			console.log(cmdsubname); //出力
			var set = false; //これコマンドがjsonの中から当たらなかったかどうか判断するために使う
			for (let i = 0; i != data.data.length; i++) { //dataの数だけ
				if (cmdsubname == data.data[i].command) { //コマンドがあってるか繰り返す(ループして一つ一つ当たるかifで判断)
					interaction.reply({ //当たったら返信する
						embeds: [{
							title: data.data[i].name, //当たった時の番号でjson指定
							description: data.data[i].explanation,
							color: 0x7289da //色ぬり
						}]
					});
					set = true; //当たったことにする
				};;
			};
			if (set != true) { //当たらなかったらif実行。でも他のコマンドはないから、下の文字列を返す
				let errornotes = autobr(texts[1]);
				interaction.reply({ content: errornotes, ephemeral: true });
			};
		} else {
			var set = false; //これコマンドがjsonの中から当たらなかったかどうか判断するために使う
			if (set != true) { //当たらなかったらif実行。でも他のコマンドはないから、下の文字列を返す
				let errornotes = autobr(texts[1]);
				interaction.reply({ content: errornotes, ephemeral: true });
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