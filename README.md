<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>booting...</title>
<style>
  body {
    margin: 0;
    background: black;
    color: #cfcfcf;
    font-family: monospace;
    font-size: 14px;
    padding: 20px;
    overflow: hidden;
  }
  .red { color: #ff4444; }
  .green { color: #33ff33; }
  .yellow { color: #ffaa00; }
  .dim { color: #888; }
  #screen {
    white-space: pre-wrap;
  }
</style>
</head>

<body>
<div id="screen"></div>

<script>
/* fullscreen lock illusion */
document.documentElement.requestFullscreen?.();
document.addEventListener("keydown", e => e.preventDefault());
document.addEventListener("contextmenu", e => e.preventDefault());

const lines = [
"[    0.000000] Linux version 6.5.0 (gcc version 13.2.0)",
"[    0.000004] Command line: BOOT_IMAGE=/vmlinuz root=/dev/sda1 ro quiet",
"[    0.231441] Initializing cgroup subsys cpuset",
"[    0.381221] Initializing memory management",
"[    1.022114] Detected CPU: Intel(R) x86_64",
"[    1.331104] Mounting root filesystem...",
"[    1.882331] systemd[1]: Starting system initialization",
"[    2.441002] systemd[1]: Started Journal Service",
"[    3.110443] systemd[1]: Starting Network Manager",
"[    3.881991] systemd[1]: Reached target Network",
"",
"[    5.004221] kernel warning: unexpected process state",
"[    5.004229] kernel warning: retrying",
"",
"[    6.551882] fsck: recovering journal",
"[    7.118002] fsck: clean",
"",
"[    8.771442] systemd[1]: Starting User Manager",
"[    9.662991] systemd[1]: Started User Manager",
"",
"[   11.004222] audit: backlog limit exceeded",
"[   11.004229] audit: rate limit applied",
"",
"[   13.441220] systemd[1]: Starting Security Scan",
"[   14.118991] security: verifying system integrity",
"",
"[   16.772114] security: anomaly detected",
"[   16.772119] security: isolating session",
"",
"🔒 SYSTEM LOCKED",
"Session temporarily restricted",
"",
"Do not power off...",
"",
"...",
"...",
"...",
"...",
"...",
"...",
"...",
"...",
"...",
"...",
"",
"got you."
];

let i = 0;
const screen = document.getElementById("screen");

function printLine() {
  if (i < lines.length) {
    let line = lines[i];

    if (line.includes("warning") || line.includes("LOCKED")) {
      screen.innerHTML += `<span class="red">${line}</span>\n`;
    } else if (line.includes("security") || line.includes("audit")) {
      screen.innerHTML += `<span class="yellow">${line}</span>\n`;
    } else if (line.includes("Started") || line.includes("Reached")) {
      screen.innerHTML += `<span class="green">${line}</span>\n`;
    } else if (line === "...") {
      screen.innerHTML += `<span class="dim">${line}</span>\n`;
    } else {
      screen.innerHTML += line + "\n";
    }

    window.scrollTo(0, document.body.scrollHeight);
    i++;
    setTimeout(printLine, Math.random() * 400 + 300);
  }
}

printLine();
</script>
</body>
</html>
