// Node 24 can fail to read Windows account metadata in restricted shells.
// Capacitor only needs the shell path, so provide a safe fallback for that case.
/* eslint-disable @typescript-eslint/no-require-imports */
const os = require('node:os');

try {
  os.userInfo();
} catch {
  os.userInfo = () => ({
    uid: -1,
    gid: -1,
    username: process.env.USERNAME ?? 'user',
    homedir: process.env.USERPROFILE ?? process.cwd(),
    shell: process.env.ComSpec ?? 'cmd.exe',
  });
}
