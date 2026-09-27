const NIGHT_START = 23;
const NIGHT_END = 6;

const CLOSED_HTML = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>夜间关闭 · 八年级14班</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#1a1a2e;color:#F7F4ED;font-family:Georgia,serif;display:flex;align-items:center;justify-content:center;min-height:100vh;text-align:center;padding:2rem}
.wrap{max-width:480px}
.icon{width:80px;height:80px;margin:0 auto 1.5rem;border:3px solid #B23A2E;border-radius:50%;display:flex;align-items:center;justify-content:center}
.icon span{font-size:2.4rem;color:#B23A2E;line-height:1}
h1{font-size:1.6rem;color:#B23A2E;margin-bottom:1rem;letter-spacing:.1em}
p{font-size:1.05rem;line-height:1.9;color:#bbb}
.note{margin-top:1.5rem;font-size:.85rem;color:#666;border-top:1px solid #333;padding-top:1rem}
</style>
</head>
<body>
<div class="wrap">
<div class="icon"><span>月</span></div>
<h1>夜间关闭中</h1>
<p>八年级14班班级文化网站<br>已进入夜间休息时间</p>
<p style="margin-top:.5rem">请在每天 06:00 后再来访问</p>
<div class="note">关闭时段 23:00 — 06:00（北京时间）</div>
</div>
</body>
</html>`;

const ASSET_RE = /\.(js|css|jpg|jpeg|png|gif|svg|ico|woff2?|ttf|otf|mp4|webm|map|json|txt|webp|avif)$/i;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (ASSET_RE.test(url.pathname)) {
      return env.ASSETS.fetch(request);
    }

    const hour = parseInt(
      new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Shanghai',
        hour: 'numeric',
        hour12: false
      }).format(new Date()),
      10
    ) % 24;

    if (hour >= NIGHT_START || hour < NIGHT_END) {
      return new Response(CLOSED_HTML, {
        status: 503,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Retry-After': '21600'
        }
      });
    }

    const response = await env.ASSETS.fetch(request);

    if (response.status === 404) {
      const indexReq = new Request(new URL('/', url.origin), request);
      return env.ASSETS.fetch(indexReq);
    }

    return response;
  }
};
