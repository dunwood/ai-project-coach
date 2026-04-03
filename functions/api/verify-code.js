// Cloudflare Pages Function
// 路径：/api/verify-code（POST）
// 处理服务端注册码验证（一机一码，KV 存储绑定关系）

const CORS_HEADERS = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { codeHash, fingerprint } = body;

    if (!codeHash || !fingerprint) {
      return new Response(JSON.stringify({
        success: false,
        message: "参数缺失"
      }), { headers: CORS_HEADERS, status: 400 });
    }

    const kvKey = `BIND:${codeHash}`;
    const existing = await env.ACCESS_CODES.get(kvKey);

    if (existing) {
      const data = JSON.parse(existing);

      if (data.fingerprint === fingerprint) {
        // 同一设备，验证通过
        return new Response(JSON.stringify({
          success: true,
          message: "欢迎回来！设备已验证",
          activated_at: data.activated_at
        }), { headers: CORS_HEADERS });
      } else {
        // 不同设备，拒绝
        return new Response(JSON.stringify({
          success: false,
          message: "此注册码已在其他设备上激活，无法重复使用"
        }), { headers: CORS_HEADERS, status: 403 });
      }
    }

    // 未绑定，首次激活
    const now = new Date();
    const bindData = {
      fingerprint: fingerprint,
      activated_at: now.toISOString(),
      user_agent: request.headers.get("User-Agent") || "unknown"
    };

    await env.ACCESS_CODES.put(kvKey, JSON.stringify(bindData));

    return new Response(JSON.stringify({
      success: true,
      message: "激活成功！欢迎使用 AI 项目教练",
      activated_at: bindData.activated_at
    }), { headers: CORS_HEADERS });

  } catch (err) {
    return new Response(JSON.stringify({
      success: false,
      message: "服务器错误，请稍后再试"
    }), { headers: CORS_HEADERS, status: 500 });
  }
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
