// 生成设备指纹
// 同一设备同一浏览器生成的值保持一致

function generateFingerprint() {
  var components = [
    navigator.userAgent,
    navigator.language,
    screen.width + 'x' + screen.height,
    screen.colorDepth,
    new Date().getTimezoneOffset(),
    navigator.hardwareConcurrency || 'unknown',
    navigator.platform || 'unknown'
  ];

  var raw = components.join('|');

  // djb2 哈希
  var hash = 5381;
  for (var i = 0; i < raw.length; i++) {
    hash = ((hash << 5) + hash) + raw.charCodeAt(i);
    hash = hash & hash; // 转为32位整数
  }

  return 'FP-' + Math.abs(hash).toString(36).toUpperCase();
}
