const config = require('./config.json');
const Discord = require('discord.js');
const client = new Discord.Client();
const commands = require('commands.js');
const util = require('util');
bot.on("message", async message => { 
if(message.author.id === '481979680061259786') { return; } // Ignore self
if(message.channel.type === 'dm') { return; } //Optionally handle direct messages 
if (message.content.indexOf(config.prefix) === 0) { // Message starts with your prefix        
    let msg = message.content.slice(config.prefix.length); // slice of the prefix on the message
    let args = msg.split(" "); // break the message into part by spaces
    let cmd = args[0].toLowerCase(); // set the first word as the command in lowercase just in case
    args.shift(); // delete the first word from the args
    if (cmd === 'help') {
        message.channel.send(`
        -
        
        HELP MESSAGE INCOMPLETE
        
        -
        `);
            return; 
        }
        else if (cmd === 'ping') { // ping > pong just in case..
            return message.channel.send('pong');
        }
        // Make sure this command always checks for you. YOU NEVER WANT ANYONE ELSE TO USE THIS COMMAND
        else if (cmd === "eval" && message.author.id === '389295881687531531'){ // < checks the message author's id to yours in config.json.
            const code = args.join(" ");
            return evalCmd(message, code);
        }
        else { // if the command doesn't match anything you can say something or just ignore it
            message.channel.send(`I don't know what command that is.`);
            return;
        }
    } else if (message.content.indexOf("<@"+bot.user.id) === 0 || message.content.indexOf("<@!"+bot.user.id) === 0) { // Catch @Mentions
        return message.channel.send(`Use \`${config.prefix}\` to interact with me.`); //help people learn your prefix
    }
    return;
});

function evalCmd(message, code) {
    if(message.author.id !== '389295881687531531') return;
    try {
        let evaled = eval(code);
        if (typeof evaled !== "string")
            evaled = util.inspect(evaled);
            message.channel.send(clean(evaled), {code:"xl"});
    } catch (err) {
        message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    }
}
function clean(text) {
    if (typeof(text) !== 'string') {
        text = util.inspect(text, { depth: 0 });
    }
    text = text
        .replace(/`/g, '`' + String.fromCharCode(8203))
        .replace(/@/g, '@' + String.fromCharCode(8203))
        .replace(config.token, 'mfa.VkO_2G4Qv3T--NO--lWetW_tjND--TOKEN--QFTm6YGtzq9PH--4U--tG0') //Don't let it post your token
    return text;
}

// Catch Errors before they crash the app.
process.on('uncaughtException', (err) => {
    const errorMsg = err.stack.replace(new RegExp(`${__dirname}/`, 'g'), './');
    console.error('Uncaught Exception: ', errorMsg);
    // process.exit(1); //Eh, should be fine, but maybe handle this?
});

process.on('unhandledRejection', err => {
    console.error('Uncaught Promise Error: ', err);
    // process.exit(1); //Eh, should be fine, but maybe handle this?
});

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

client.login(process.env.token);
