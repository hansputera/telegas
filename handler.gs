async function messageEntityHandler(message) {
  /** Commands */
  const command = Util.parseCommand(message.text, message.entities);
  if (command) {
    switch(command.commmand) {
      case "ping":
        await tg.sendMessage(message.chat.id, "Pong!");
        break;
    }
  }
}

tg.setHandlerFunc("messageEntity", messageEntityHandler, "message.entities", "message");
