const Shikishima = require("./struct/shikishima");
client = new Shikishima();
client.start();

require("./struct/modules")(client);
require("./struct/extends")(client);