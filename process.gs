const tg = new Telegram("BOT TOKEN", 1803044735);

function doGet() {
  return ContentService.createTextOutput("who r u");
}

function doPost(e) {
  Logger.log("Incoming request");
  if (e.postData.type == "application/json") {
    try {
      const update = JSON.parse(e.postData.contents);
      if (update.update_id) {
        Logger.log("Request valid");
        tg.handleUpdates(update);
      }
    } catch {
      Logger.log("Request is invalid");
      return ContentService.createTextOutput("Invalid JSON");
    }
  }
}
