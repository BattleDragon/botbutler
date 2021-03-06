const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.token);

//--------------------------- C O M M A N D S ---------------------------
client.on("message", async message => { 
    if (message.author.id === client.user.id) { return; } // Ignore self
    if (message.channel.type === 'dm') { return; } //Optionally handle direct messages 
    if (message.content.indexOf("<@"+client.user.id) === 0 || message.content.indexOf("<@!"+client.user.id) === 0) { // Catch @Mentions
        return message.channel.send(`Use \`${config.prefix}\` to interact with me.`); //help people learn your prefix
    } 
    else if (message.content.indexOf(config.prefix) === 0) { // Message starts with your prefix        
        let msg = message.content.slice(config.prefix.length); // slice of the prefix on the message
        let args = msg.split(" "); // break the message into part by spaces
        let cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case
        args.shift(); // delete the first word from the args
        if (cmd === 'ping') { message.channel.send('pong!'); }
        else if (cmd === 'source') { message.channel.send('https://discord.js.org/#/docs/main/stable/general/welcome'); }
        else if (cmd === "eval" && message.author.id === config.owner) { // < checks the message author's id is yours in config.json.
            try { let evaled = eval(args.join(" ")); } 
            catch (err) { message.channel.send(`\`\`\`xl\n${err}\n\`\`\``); }
        }
        else if (cmd === 'purge' && message.author.id === config.owner) { // This command removes all messages from all users in the channel, up to 100.
            const deleteCount = parseInt(args[0], 10); // get the delete count, as an actual number.
            if(!deleteCount || deleteCount < 1 || deleteCount > 100) // Ooooh nice, combined conditions. <3
                return message.reply("Please provide a number between 1 and 100 for the number of messages to delete");
            // So we get our messages, and delete them. Simple enough, right?
            const fetched = await message.channel.fetchMessages({limit: deleteCount + 1});
            message.channel.bulkDelete(fetched)
                .catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
        }
        else { // if the command doesn't match anything you can say something or just ignore it
            message.channel.send(`I don't know what command that is.`);
            return;
        }
    }
});

//--------------------------- E V E N T S ---------------------------
client.on('ready', () => { 
    client.user.setActivity('you...', {type: 'WATCHING'});
});

client.on('voiceStateUpdate', function(oldMemberState, newMemberState){
    if ((oldMemberState.voiceChannel == null) && (newMemberState.voiceChannel != oldMemberState.voiceChannel)){
        // If the member was previously not in a voice channel, and now is in one . . .
        newMemberState.addRole('483014771818364948');
    } else if ((oldMemberState.voiceChannel != null) && (newMemberState.voiceChannel == null)){
        // If the user was previously in a channel and is now not in one . . .
        newMemberState.removeRole('483014771818364948');
    }
});
