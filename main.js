const Discord = require('discord.js');
const client = new Discord.Client();
client.login(process.env.token);

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

client.on('message', msg => {
  if (msg.content.includes('ping')) {
    msg.channel.send('pong');
  }
});
