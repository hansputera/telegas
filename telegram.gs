class Telegram {
  /**
   * 
   * @param {String} token - Token bot telegram
   * @param {Number} ownerID - ID Owner dari bot telegram
   */
  constructor(token, ownerID) {
    this.user = {};
    this.ownerID = ownerID;

    this.api = new API(token);
    this.getMe().then(r => {
      Logger.log("Logged in as: " + r.username);
      this.user = r;
    }).catch((e) => {
      Logger.log("Error: " + JSON.stringify(e));
    });

    this.handler = new MyMap();
  }

/**
 * Mengatur webhook
 * 
 * @param {String} url - URL Webhook yang akan di set
 */
  async setWebhook(url) {
    return await new Promise(async (resolve, reject) => {
      const response = await this.api.send("setWebhook", "post", {
        url
      });

      if (response.error) {
        reject(response.data);
      } else {
        resolve(response.data);
      }
    });
  }

  async getMe() {
    return await new Promise(async (resolve, reject) => {
      const response = await this.api.send("getMe", "get");
      if (response.error) {
        reject(response.data);
      } else resolve(response.data.result);
    });
  }

  /**
   * Mengirim pesan ke grup, user, atau channel.
   * 
   * @param {String | Number} chatId - Chat ID Group, User, atau Channel.
   * @param {String} content - Konten yang akan di kirimkan.
   * @param {Object} options - Opsi yang akan digunakan untuk mengirim pesan. Informasi lanjut: https://core.telegram.org/bots/api#sendmessage
   */
  async sendMessage(chatId, content, options) {
    return await new Promise(async (resolve, reject) => {
      const response = await this.api.send("sendMessage", "post", {
        chat_id: chatId,
        text: content,
        ...options
      });

      if (response.error) {
        reject(respose.data);
      } else {
        resolve(response.data.result);
      }
    });
  }

  /**
   * Mengirim pesan ke grup, channel, atau user dengan konteks markdown.
   * 
   * @param {String | Number} chatId - Chat ID Group, User, atau Channel.
   * @param {String} content - Konten yang akan di kirimkan.
   * @param {Object} options - Opsi yang akan digunakan untuk mengirim pesan. Informasi lanjut: https://core.telegram.org/bots/api#sendmessage
 */
  async sendMessageWithMarkdown(chatId, content, options) {
    return await new Promise((resolve, reject) => {
      this.sendMessage(chatId, content, {
        parse_mode: "Markdown",
        ...options
      }).then(resolve).catch(reject);
    });
  }

  /**
   * 
   * @param {String | Number} chatId - ID Grup, user, atau channel. (Bisa opsional tetapi inlineMessageId tidak boleh opsional)
   * @param {Number} messageId - ID Pesan yang akan di edit. (Bisa opsional tetapi inlineMessageId tidak boleh opsional)
   * @param {String} inlineMessageId - Dibutuhkan, jika chatId dan messageId tidak spesifik.
   * @param {String} content - Konten baru yang ingin diberi.
   * @param {Object} options - Opsi lainnya untuk mengedit pesan. Baca lebih lanjut: https://core.telegram.org/bots/api#editmessagetext
   */
  async editMessageText(chatId, messageId, inlineMessageId = "", content, options) {
    return await new Promise(async (resolve, reject) => {
      const response = await this.api.send("editMessageText", "post", {
        chat_id: chatId,
        message_id: messageId,
        inline_message_id: inlineMessageId,
        text: content,
        ...options
      });

      if (response.error) {
        reject(response.data);
      } else {
        resolve(response.data);
      }
    });
  }

  /**
   * 
   * @param {String} handlerName - Nama handler, contoh: "message"
   * @param {Function} handlerFunc - Fungsi untuk mengolah handler tersebut.
   * @param {String} filterUpdate - Disini, bisa diisi dengan objek yang harus ada sehingga fungsi kamu akan dijalankan jika properti itu ada. Contoh: "message". Yang berarti, bahwa properti message harus ada dalam update.
   * @param {String} getObject - Objek yang ingin langsung di dapatkan valuenya.
   */
  setHandlerFunc(handlerName, handlerFunc, filterUpdate = "", getObject = "") {
    this.handler.set(handlerName, { func: handlerFunc, propertyFilter: filterUpdate.length ? filterUpdate : undefined, getObject: getObject.length ? getObject : undefined });
  }

  async handleUpdates(update) {
    /** Handlers */
    const handlers = this.handler.toArray();
    handlers.forEach(async handler => {
      if (handler.value.propertyFilter && Util.isAnyInObject(update, handler.value.propertyFilter)) {
        if (handler.value.getObject && Util.isAnyInObject(update, handler.value.getObject)) handler.value.func(Util.isAnyInObject(update, handler.value.getObject));
        else handler.value.func(update);
      }
    });
  }
}
