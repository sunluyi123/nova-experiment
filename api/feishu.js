// api/feishu.js  —  Vercel Serverless Function
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const APP_ID     = 'cli_aaa793338238dbd6';
  const APP_SECRET = 'C4INKk3eHqVe1tt3Zqc8dfnratvoeLl2';
  const APP_TOKEN  = 'OeoEb6NlEa5SdFsCz3ycMROnnNf';
  const TABLE_ID   = 'tblV4AtOVfMPBcfk';

  try {
    // Step 1: 获取 token
    const tokenRes = await fetch(
      'https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal',
      { method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }) }
    );
    const tokenData = await tokenRes.json();
    const token = tokenData.tenant_access_token;
    if (!token) {
      res.status(500).json({ error: 'token获取失败', detail: tokenData });
      return;
    }

    // Step 2: 整理字段，数字字段保持数字类型
    const body = req.body;
    const fields = {
      uname:       String(body.uname       || ''),
      seq:         Number(body.seq         || 0),
      pid:         String(body.pid         || ''),
      group:       String(body.group       || ''),
      role:        String(body.role        || ''),
      requestMode: String(body.requestMode || ''),
      mentionMode: String(body.mentionMode || ''),
      elapsed_min: Number(body.elapsed_min || 0),
      xp:          Number(body.xp          || 0),
      timestamp:   String(body.timestamp   || ''),
      iuipc:       String(body.iuipc       || ''),
      calMeasures: String(body.calMeasures || ''),
      p2Measures:  String(body.p2Measures  || ''),
      calAnswers:  String(body.calAnswers  || ''),
    };

    // Step 3: 写入多维表格
    const writeRes = await fetch(
      `https://open.feishu.cn/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`,
      { method: 'POST',
        headers: { 'Content-Type': 'application/json',
                   'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ fields }) }
    );
    const result = await writeRes.json();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
