const config = require('./config');
const koa = require('koa');
const router = require('koa-router')();
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const serve = require('koa-static');
const { downloadFiles } = require('./download');

const app = new koa();

app.use(cors());
app.use(serve(config.server.www, {
	index: config.server.index, 
	maxage: (1000 * 60 * 30),
	hidden: true,
	gzip: config.server.gzip	
}));
app.use(bodyParser());
app.use(router.routes());
app.use(router.allowedMethods());

router.post('/download',  async (ctx, next) => {
  let urls = ctx.request.body.urls;
  console.log('urls=', urls);
  downloadFiles(urls);
  ctx.body = '{"data": {"succ": true}, "status": 1}';
});

app.listen(config.server.listen);
console.log(`server has started.  http://localhost:${config.server.listen}`);