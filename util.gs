class API {
  /**
   * 
   * @param {String} token - Telegram bot token
   */
  constructor(token) {
    this.token = token;
    this.methods = ["get","post"];

    /** URL */
    this.baseURL = "https://api.telegram.org";
    this.url = `${this.baseURL}/bot${this.token}`;
  }

/**
 * Send a request to telegram bot api.
 * 
 * @param {String} endpoint - Endpoint method bot API
 * @param {"get"|"post"} method - Request method
 * @param {Any} body - Body request bot API
 */
  async send(endpoint, method = "get", body) {
    if (!this.methods.includes(method)) {
      Logger.log("Fail to request because invalid request method");
      return undefined;
    }
    const options = {};
    if (body) options.payload = JSON.stringify(body);
    try {
      const resp = UrlFetchApp.fetch(this.url + "/" + endpoint, {
        method,
        contentType: "application/json",
        ...options
      });
      const statusCode = Math.floor(resp.getResponseCode());
      const json = JSON.parse(resp.getContentText());
      if (statusCode == 200 || statusCode == 201 || statusCode == 204 || (json && json.ok)) {
        return this.buildResult(false, { data: json });
      } else return this.buildResult(1, { data: json });
    } catch(e) {
      Logger.log(e);
      return this.buildResult(true, { data: e });
    }
  }

/**
 * 
 * @param {Boolean} error
 * @param {Any} data
 */
  buildResult(error, data) {
    return { error: error ? 1 : 0, ...data };
  }
}

class Util {
  /**
   * 
   * @param {String} text - Teks yang akan di parse
   * @param {Object} entities - Message entities
   */
  static parseCommand(text, entities) {
    const command = entities.find(e => e.type == "bot_command");
    if (!command) return undefined;

    const cmd = text.slice(command.offset, command.length);
    const args = text.replace(cmd, "").split(/ +/g).map(t => t.trim()).filter(x => x.length);
    return { commmand: cmd.slice(1), args };
  }

  /**
   * 
   * @param {Object} object - Objek yang akan di digunakan
   * @param {String} filters
   */
  static isAnyInObject(object, filters) {
    if (typeof object != "object" || typeof filters != "string" || object == {}) return undefined;
    const filters_split = filters.split(/\./);
    const brackets = filters_split.map(x => `["${x}"]`).join("");
    try {
      return eval(`object${brackets}`);
    } catch {
      return undefined;
    }
  }

  /**
   * Memberi efek sleep.
   * 
   * @param {Number} ms - Miliseconds sleep effect.
   */
  static sleepEffect(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Random array
   * 
   * @param {Object} array - Array yang akan di random
   */
  static randomArray(array) {
    const index = Math.floor(Math.random() * array.length);
    return array[index];
  }

  /**
   * Mengetahui teks apakah ada di dalam teks tersebut.
   * 
   * @param {String} text - Teks yang akan di eksekusi.
   * @param {String} matches - Teks yang akan diketahui jika ada di dalam text.
   */
  static matchContext(text, matches) {
    const obj = {};
    const matchees = matches.split(/\|/);
    const texts = text.split(/\s/);
    for (let index = 0; index < matchees.length; index++) {
      const match = matchees[index];
      const isMatch = texts.find(t => t == match);
      if (isMatch) obj[match] = 1;
      else obj[match] = 0;
    }

    return obj;
  }
}

class MyMap extends Map {
  constructor() {
    super();
  }

  toArray() {
    return Array.from(this, ([name, value]) => ({ name, value }));
  }

  first() {
    const array = this.toArray();
    return array.shift();
  }

  last() {
    const array = this.toArray();
    return array.pop();
  }

  search(key) {
    const data = this.toArray().find(x => x.name == key);
    return data ? data.value : undefined;
  }
}
