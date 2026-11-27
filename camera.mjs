// Browser camera access is invoked immediately from the user's tap.
export function requestCamera(mediaDevices) {
  if (!mediaDevices || typeof mediaDevices.getUserMedia !== 'function') {
    return Promise.reject(Object.assign(new Error('camera API unavailable'), {name:'CameraUnavailableError'}));
  }
  let initial;
  try {
    initial = mediaDevices.getUserMedia({video:{facingMode:{ideal:'user'},width:{ideal:640},height:{ideal:480}}, audio:false});
  } catch (err) {
    return Promise.reject(err);
  }
  return Promise.resolve(initial).catch(err => {
    if (err && (err.name === 'OverconstrainedError' || err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError')) {
      return mediaDevices.getUserMedia({video:true,audio:false});
    }
    throw err;
  });
}

export function cameraErrorMessage(err) {
  switch (err?.name) {
    case 'CameraUnavailableError': case 'SecurityError':
      return '当前浏览器无法使用摄像头，请用 Safari 或 Chrome 打开 HTTPS 链接。';
    case 'NotAllowedError': case 'PermissionDeniedError':
      return '摄像头权限未允许，请在浏览器或手机设置中允许摄像头后重试。';
    case 'NotFoundError': case 'DevicesNotFoundError':
      return '未找到可用摄像头，请检查设备后重试。';
    case 'NotReadableError': case 'TrackStartError':
      return '摄像头可能被其他应用占用，请关闭其他应用后重试。';
    case 'AbortError':
      return '摄像头启动中断，请重试。';
    default:
      return '摄像头启动失败，请使用 Safari 或 Chrome 检查摄像头权限后重试。';
  }
}

export function stopCamera(stream) {
  if (!stream || typeof stream.getTracks !== 'function') return;
  stream.getTracks().forEach(track => track.stop());
}
