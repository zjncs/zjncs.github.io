var OriginTitle = document.title;
var titleTime;
document.addEventListener('visibilitychange', function () {
  if (document.hidden) {
    // 用户离开页面时显示
    document.title = '⚠️ SYSTEM ALERT: Signal Lost';
    clearTimeout(titleTime);
  } else {
    // 用户回来时恢复
    document.title = '⚡ Connection Restored';
    titleTime = setTimeout(function () {
      document.title = OriginTitle;
    }, 2000);
  }
});