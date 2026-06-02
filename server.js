const express = require("express");
const cors = require("cors");
const { Client, GatewayIntentBits } = require("discord.js");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

client.login(process.env.TOKEN);

app.get("/members", async (req, res) => {
  const guild = client.guilds.cache.get("1498763376598319116");

  if (!guild) {
    return res.json({ error: "Guild not found" });
  }

  await guild.members.fetch();

  const members = guild.members.cache.map(member => ({
    name: member.user.username,
    avatar: member.user.displayAvatarURL(),
    roles: member.roles.cache
      .filter(r => r.name !== "@everyone")
      .map(r => r.name)
  }));

  res.json(members);
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

app.listen(process.env.PORT || 3000);
