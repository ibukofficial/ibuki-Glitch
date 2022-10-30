require('dotenv').config();
const { Client, GatewayIntentBits, Partials, EmbedBuilder, BaseChannel, ApplicationCommandType, ApplicationCommandOptionType, ChannelType, SlashCommandBuilder, PresenceUpdateStatus, DMChannel } = require("discord.js"),
{ entersState, createAudioPlayer, createAudioResource, joinVoiceChannel, StreamType, AudioPlayerStatus } = require("@discordjs/voice"),
	client = new Client({
		partials: [Partials.Channel, Partials.GuildMember, Partials.GuildScheduledEvent, Partials.Message, Partials.Reaction, Partials.ThreadMember, Partials.User],
		intents: [GatewayIntentBits.DirectMessageReactions, GatewayIntentBits.DirectMessageTyping, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildBans, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildMessageTyping, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildScheduledEvents, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent]
	}),
	ytdl = require('ytdl-core'), //YouTube Downloadのコア
	data = require("./data.json");
let scommand = [
	new SlashCommandBuilder()
		.setName("help")
		.setDescription("ヘルプを表示します。")
];

for (let i = 0; i != data.data.length; i++) { scommand.push(new SlashCommandBuilder().setName(data.data[i].command).setDescription(data.data[i].name)); };

client.on('ready', () => {
	try {
		client.user.setPresence({ activities: [{ name: data.playing }], status: "online" }); //ステータス設定
		client.application.commands.set(scommand); //botにセット
		console.log("Bot準備完了～\nnode.js:" + process.version + "\nDiscord.js:v" + require('discord.js').version); //ログインできたか確認＆バージョン参照
	} catch (e) {
		console.log(e);
	};
});
client.on('interactionCreate', interaction => {
	try {
		if (!interaction.isCommand()) return; //これちょっとわからない
		console.log(interaction.commandName); //出力
		switch (interaction.commandName) {
			case "help": {
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle("ヘルプ")
							.setDescription("今調べられる都道府県の数は、`" + data.data.length + "`個調べられます")
							.setColor(0x7289da)
							.addFields({ name: "botについて", value: autobr(data.texts[0]) })
					]
				}); //送信
				break;
			}
			default: {
				var set = false; //これコマンドがjsonの中から当たらなかったかどうか判断するために使う
				for (let i = 0; i != data.data.length; i++) { //dataの数だけ
					if (interaction.commandName == data.data[i].command) { //コマンドがあってるか繰り返す(ループして一つ一つ当たるかifで判断)
						interaction.reply({ //当たったら返信する
							embeds: [
								new EmbedBuilder()
									.setTitle(data.data[i].name)
									.setDescription(data.data[i].explanation)
									.setColor(0x7289da)
							]
						});
						set = true; //当たったことにする
						break;
					};
				};
				if (set != true) { //当たらなかったらif実行。でも他のコマンドはないから、下の文字列を返す
					interaction.reply({ content: autobr(data.texts[1]), ephemeral: true });
				};
				break;
			}
		};
	} catch (e) {
		console.log(e);
	};
});
client.on('messageCreate', message => {
	try {
		if (message.author.bot) return; //bot自身なら実行停止
		if (message.mentions.users.has(client.user.id) || message.mentions.roles.some(r => [client.user.username].includes(r.name)) ? true : false) {
			message.reply("呼びましたか？コマンド使ってくれないと怒りますっ！");
		};
		for (let i = 0; data.reply.length != i; i++) {
			for (let Ii = 0; data.reply[i].message.length != Ii; Ii++) {
				if (message.content.match(data.reply[i].message[Ii])) {
					message.channel.send(data.reply[i].reply[Math.floor(Math.random() * data.reply[i].reply.length)]);
				};
			};
		};
	} catch (e) {
		console.log(e);
	};
});
client.on("guildMemberAdd", async member => {
	try {
		for (let i = 0; i != (Object.keys(data.replychannels.channel).length); i++) {
			let id = Object.keys(data.replychannels.channel)[i];
			if (member.guild.id == id) {
				client.channels.fetch(data.replychannels.channel[id].welcome).then(channel => {
					let message = "**" + member.user.username + "**さんようこそ" + member.guild.name + "へ！\nあなたは" + member.guild.memberCount + "人目のメンバーです！";
					channel.send(message);
				});
			};
		};
	} catch (e) {
		console.log(e);
	};
});
function autobr(textdata) {
	let outdata = "";
	for (let i = 0; i != textdata.length; i++) {
		if (outdata != "") outdata += "\n";
		outdata += textdata[i];
	};
	return outdata;
};
if (process.env.IBUKI_BOT_TOKEN) {
	client.login(process.env.IBUKI_BOT_TOKEN);
} else {
	console.log('トークンがundefinedとなっていたため、実行を停止します。');
	process.exit(0);
};