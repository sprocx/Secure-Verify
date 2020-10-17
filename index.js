const Discord = require('discord.js')
const bot = new Discord.Client()
const prefix = "v-"

bot.on("ready", () => {
    console.log("Online...")
    bot.user.setActivity(`v-help`, { type: "STREAMING", url: "https://www.twitch.tv/shocolatee"}).catch(console.error)
})

bot.on("message", async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/g);
    const command = args.shift();

    if (command == `help`) {
        const helpEmbed = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.avatarURL())
        .setTitle("Help Embed!")
        .setDescription("**Setup Commands:** \n \n v-setup | Sets up the channel, role and also the bot! \n \n **Verify Commands:** \n \n v-verify | Go through the verify procedure. (**ONLY WORKS IN VERIFY CHANNEL**) \n v-verifycheck | Checks if you are verified. \n v-unverify | unVerify (**YOU HAVE TO REDO THE VERIFY COMMAND TO REVERIFY**)")
        message.channel.send(helpEmbed)
    }

    if (command == `setup`) {
        if(message.member.hasPermission("MANAGE_CHANNELS")) {
        const loading = new Discord.MessageEmbed()
        .setDescription("Creating the channels and roles... Please give at least 1 minute for complete setup.")
        msg = await message.channel.send(loading)
        message.guild.channels.create("secure-verify", { reason: "Setup for Secure Verify Bot"}).then(a => {
            message.guild.roles.create({
                data: {
                    name: 'Securely Verified',
                    color: 'GREEN',
                  },
                  reason: 'Setup for Secure Verify Bot',
            }).then(b => {
                const done = new Discord.MessageEmbed()
                .setDescription(`Completed! Your new verify channel is: ${a}! Your new role is: ${b}!`)
                msg.edit(done)
            })
        })
    } else {
        const error = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription("ERROR OCCURED: \n \n ```You do not have permissions. Permissions required: ADMINISTRATOR```")
        message.channel.send(error)
    }
    }

    if (command == `verify`) {
        if(message.channel.name === "secure-verify") {
        if(message.member.roles.cache.find(r => r.name === "Securely Verified")) {
            const yourole = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription("You already have the Verified role, you do not need to verify.")
            msg = await message.channel.send(yourole)
            message.delete()
        } else {
        if(message.member.guild.roles.cache.find(role => role.name === "Securely Verified")) {
        let nums = ['1',  '2', '3', '4', '5', '6', '7', '8', '9']
        let rand = `${nums[Math.floor(Math.random() * nums.length)]}${nums[Math.floor(Math.random() * nums.length)]}${nums[Math.floor(Math.random() * nums.length)]}${nums[Math.floor(Math.random() * nums.length)]}`
        const verif = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setTitle("Verify")
        .setDescription(`With this verification please reply with this code below in under 30 seconds: \n \n ***__${rand}__***`)
        msg3 = await message.channel.send(verif)

        const filter = (m) => m.author.id === message.author.id
      message.channel.awaitMessages(filter, {max: 1, time: 30000})
          .then(async collected => {
              const msg = collected.first()
              var number2 = msg.content.split(' ').slice(0).join(' ');
              if(msg.content.toLowerCase() === `${rand}`) {
                const complete = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription("You completed the verification! Please wait a while to get your role...")
                msg3.edit(complete)
                msg.delete()
                message.delete()
                var role = message.member.guild.roles.cache.find(role => role.name === "Securely Verified");
                message.member.roles.add(role).then(a => {
                    const roleAdded = new Discord.MessageEmbed()
                    .setAuthor(message.author.username, message.author.displayAvatarURL())
                    .setDescription(`Your role has been added! Role added: ${role}`)
                    msg3.edit(roleAdded)
                })
              } else {
                const incorrect = new Discord.MessageEmbed()
                .setAuthor(message.author.username, message.author.displayAvatarURL())
                .setDescription("You have failed the verification. To try again, please use the command: `v-verify`")
                msg3.edit(incorrect)
                msg.delete()
                message.delete()
              }
          })
        } else {
            const error = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription("ERROR OCCURED: \n \n ```Your server has not been setup with the Verified Role.```")
            msg4 = await message.channel.send(error)
            message.delete()
        }
        }
    } else {
        message.delete()
    }
    }
    
    if (command == `verifycheck`) {
        if(message.member.roles.cache.find(r => r.name === "Securely Verified")) {
            const Approved = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription("Verify Check Results: \n \n ```True, you are verified.```")
            msg = await message.channel.send(Approved)
            message.delete()
        } else {
            const Denied = new Discord.MessageEmbed()
            .setAuthor(message.author.username, message.author.displayAvatarURL())
            .setDescription("Verify Check Results: \n \n ```False, you are not verified.```")
            msg = await message.channel.send(Denied)
            message.delete()
        }
    }

    if (command == `unverify`) {
        if(message.member.roles.cache.find(r => r.name === "Securely Verified")) {
        const areyousure = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription("Are you sure you want to unVerify?")
        msg5 = await message.channel.send(areyousure)
        msg5.react('✅').then(e => {
            msg5.react('❌')
        })

        msg5.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '✅' || reaction.emoji.name == '❌'),
            { max: 1, time: false }).then(async collected => {
                    if (collected.first().emoji.name == '✅') {
                        var ro = message.member.roles.cache.find(r => r.name === "Securely Verified")
                        message.member.roles.remove(ro)
                        const success = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setDescription("You have been unVerified.")
                        msg5.edit(success)
                        msg5.reactions.removeAll()
                        message.delete()
                    }
                    if (collected.first().emoji.name == '❌') {
                        const ok = new Discord.MessageEmbed()
                        .setAuthor(message.author.username, message.author.displayAvatarURL())
                        .setDescription("You have been kept verified.")
                        msg5.edit(ok)
                        msg5.reactions.removeAll()
                        message.delete()
                    }
            }).catch(() => {
                    msg.reply('No reaction after 30 seconds, operation canceled');
                    msg.reactions.removeAll()
            });
    } else {
        const error4 = new Discord.MessageEmbed()
        .setAuthor(message.author.username, message.author.displayAvatarURL())
        .setDescription("ERROR OCCURED: \n \n ```You are not verified.```")
        message.channel.send(error4)
    }
}
});

bot.login(process.env.token)