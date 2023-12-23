import { world, system } from "@minecraft/server";
import { JsonDatabase } from "./database";

const db = new JsonDatabase("database");
db.load();

system.runInterval(() => {
    var kgBlocks = db.get("kgBlocks") ?? [];

    kgBlocks.forEach(value => {
        var valueList = value.split(",");
        if (world.getDimension("overworld").getBlock({ x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }).isAir) {
            world.getDimension("overworld").fillBlocks({ x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }, { x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }, "bedrock");
        }
    });
})

world.beforeEvents.playerBreakBlock.subscribe((event) => {
    var player = event.player;
    var block = event.block;
    var kgBlocks = db.get("kgBlocks") ?? [];

    kgBlocks.forEach(value => {
        var valueList = value.split(",");
        // player.sendMessage(valueList.toString());
        // player.sendMessage(block.location.x.toString());
        // player.sendMessage(block.location.y.toString());
        // player.sendMessage(block.location.z.toString());
        // player.sendMessage({ x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }.toString());
        if (block.location.x == parseInt(valueList[0], 10) &&
            block.location.y == parseInt(valueList[1], 10) &&
            block.location.z == parseInt(valueList[2], 10)) {
            player.sendMessage(event.block.typeId + " " + "minecraft:" + valueList[3] + " " + (event.block.typeId == "minecraft:" + valueList[3]).toString());
            if (event.block.typeId == "minecraft:" + valueList[3]) {
                system.runTimeout(() => {
                    world.sendMessage("bitti");
                    world.getDimension("overworld").fillBlocks({ x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }, { x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }, valueList[3]);
                }, 60);
            } else {
                event.cancel = true;
            }
        }
    });
});

world.beforeEvents.chatSend.subscribe(event => {
    var sender = event.sender;
    var msg = event.message;
    var msgList = msg.split(" ");

    var kgBlocks = db.get("kgBlocks") ?? [];

    if (msgList.length == 5 && msgList.includes("deneme")) {
        msgList.shift();
        kgBlocks.push(msgList.join(","));
        db.set("kgBlocks", kgBlocks);
    }

    if (msg == "clear") {
        db.set("kgBlocks", []);
    }

    sender.sendMessage(kgBlocks.toString());
});