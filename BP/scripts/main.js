import { world, system } from "@minecraft/server";
import { JsonDatabase } from "./database/database";
import { getMoney, setMoney, addMoney, removeMoney } from "./economy/money";

const db = new JsonDatabase("database");
db.load();

const commandPrefix = "#";

world.beforeEvents.chatSend.subscribe(event => {
    var sender = event.sender;
    var msg = event.message;

    if (msg[0] == commandPrefix) {
        msg = msg.substring(1);
        var msgList = msg.split(" ");

        switch (msgList[0]) {
            case "param":
                sender.sendMessage("Paran: " + getMoney(sender.name) + "TL");
                break;
            case "paraayarla":
                sender.sendMessage(setMoney(sender.name, Number(msgList[1])));
                break;
            case "paraekle":
                sender.sendMessage(addMoney(sender.name, Number(msgList[1])));
                break;
            case "parasil":
                sender.sendMessage(removeMoney(sender.name, Number(msgList[1])));
                break;
        }
    }

    // var kgBlocks = db.get("kgBlocks") ?? [];

    // if (msgList.length == 5 && msgList.includes("#kazgelis")) {
    //     msgList.shift();
    //     kgBlocks.push(msgList.join(","));
    //     db.set("kgBlocks", kgBlocks);
    // }

    // if (msg == "clear") {
    //     db.set("kgBlocks", []);
    // }

    // sender.sendMessage(kgBlocks.toString());
});

system.runInterval(() => {
    var kgBlocks = db.get("kgBlocks") ?? [];

    kgBlocks.forEach(value => {
        var valueList = value.split(",");
        if (world.getDimension("overworld").getBlock({ x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }).isAir) {
            world.getDimension("overworld").fillBlocks({ x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }, { x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }, "bedrock");
            system.runTimeout(() => {
                world.sendMessage("bitti");
                world.getDimension("overworld").fillBlocks({ x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }, { x: parseInt(valueList[0], 10), y: parseInt(valueList[1], 10), z: parseInt(valueList[2], 10) }, valueList[3]);
            }, 60);
        }
    });
})
