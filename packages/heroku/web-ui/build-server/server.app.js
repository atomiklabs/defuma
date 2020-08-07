"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const koa_1 = __importDefault(require("koa"));
const koa_websocket_1 = __importDefault(require("koa-websocket"));
const koa_static_1 = __importDefault(require("koa-static"));
const dotenv_1 = __importDefault(require("dotenv"));
const wss_1 = __importDefault(require("./wss"));
dotenv_1.default.config();
if (!process.env.USER_API_KEY || !process.env.USER_API_SECRET)
    console.log('Missing hub keys...');
const PORT = process.env.PORT || 3001;
const app = koa_websocket_1.default(new koa_1.default());
app.ws.use(wss_1.default);
app.use(koa_static_1.default(path_1.default.join(__dirname, '../build')));
app.listen(PORT, () => console.log('Web-ui server started on ' + PORT));
//# sourceMappingURL=server.app.js.map