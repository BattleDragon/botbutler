global.config = require('./config.json');
global.Discord = require('discord.js');
global.client = new Discord.Client();
global.commands = require('commands.js');
global.events = require('events.js');
client.login(process.env.token);
