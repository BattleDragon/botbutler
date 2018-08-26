global.client.on("message", async message => { 
    if (message.author.id === global.client.user.id) { return; } // Ignore self
    if (message.channel.type === 'dm') { return; } //Optionally handle direct messages 
    if (message.content.indexOf("<@"+global.client.user.id) === 0 || message.content.indexOf("<@!"+global.client.user.id) === 0) { // Catch @Mentions
        return message.channel.send(`Use \`${global.config.prefix}\` to interact with me.`); //help people learn your prefix
    } 
    else if (message.content.indexOf(global.config.prefix) === 0) { // Message starts with your prefix        
        let msg = message.content.slice(global.config.prefix.length); // slice of the prefix on the message
        let args = msg.split(" "); // break the message into part by spaces
        let cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case
        args.shift(); // delete the first word from the args
        if (cmd === 'ping') {
            message.channel.send('pong!');   
            return;
        }
        else if (cmd === "eval" && message.author.id === global.config.owner) { // < checks the message author's id to yours in config.json.
            if(message.author.id !== global.config.owner) return;
            try { let evaled = eval(args.join(" ")); } 
            catch (err) { message.channel.send(`\`\`\`xl\n${err}\n\`\`\``); }
        }
        else if (cmd === 'purge') { // This command removes all messages from all users in the channel, up to 100.
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
