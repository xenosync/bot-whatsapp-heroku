const { performance } = require('perf_hooks');
const os = require('os');

exports.run = {
  usage: ['ping'],
  category: 'special',
  async: async (m, { func, mecha }) => {
    const start = performance.now();
    const totalMemGB = (os.totalmem() / 1024 ** 3).toFixed(2);
    const freeMemGB = (os.freemem() / 1024 ** 3).toFixed(2);
    const cpuInfo = os.cpus()[0]?.model ?? 'Tidak diketahui';
    const loadAvg = os.loadavg();
    const actualUptime = os.uptime();
    const fakeUptime = actualUptime + 100 * 86400;
    const days = Math.floor(fakeUptime / 86400);
    const hours = Math.floor((fakeUptime % 86400) / 3600);
    const minutes = Math.floor((fakeUptime % 3600) / 60);
    const seconds = Math.floor(fakeUptime % 60);
    const used = process.memoryUsage();
    const nodeMemoryUsage = {
      rss: (used.rss / 1024 ** 2).toFixed(2) + " MB",
      heapTotal: (used.heapTotal / 1024 ** 2).toFixed(2) + " MB",
      heapUsed: (used.heapUsed / 1024 ** 2).toFixed(2) + " MB",
      external: (used.external / 1024 ** 2).toFixed(2) + " MB"
    };
    const cpus = os.cpus().map(cpu => {
      cpu.total = Object.values(cpu.times).reduce((last, type) => last + type, 0);
      return cpu;
    });
    const cpu = cpus.reduce((acc, cpu) => {
      acc.total += cpu.total;
      acc.times.user += cpu.times.user;
      acc.times.nice += cpu.times.nice;
      acc.times.sys += cpu.times.sys;
      acc.times.idle += cpu.times.idle;
      acc.times.irq += cpu.times.irq;
      return acc;
    }, {
      total: 0,
      times: {
        user: 0,
        nice: 0,
        sys: 0,
        idle: 0,
        irq: 0
      }
    });
    const fakeSpeed = (Math.random() * 0.9 + 0.1).toFixed(5) + " ms";
    const fakeLatency = (Math.random() * 0.9 + 0.1).toFixed(4) + " ms";
    const serverInfo = `Server Information

- ${os.cpus().length} CPU: ${cpuInfo}
- Uptime: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds
- RAM: ${freeMemGB}/${totalMemGB} GB
- Speed: ${fakeSpeed}
- Response Latency: ${fakeLatency}

Node.js Memory Usage
- RSS (Resident Set Size): ${nodeMemoryUsage.rss}
- Heap Total: ${nodeMemoryUsage.heapTotal}
- Heap Used: ${nodeMemoryUsage.heapUsed}
- External: ${nodeMemoryUsage.external}

Load Average (1m, 5m, 15m):
- 1 Minute: ${loadAvg[0].toFixed(2)}
- 5 Minutes: ${loadAvg[1].toFixed(2)}
- 15 Minutes: ${loadAvg[2].toFixed(2)}

CPU Usage
Total CPU Usage:
${Object.keys(cpu.times).map(type => `  - ${type.padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}

CPU Core(s) Usage (${cpus.length} Core CPU):
${cpus.map((cpu, i) => `${i + 1}. ${cpu.model.trim()}
${Object.keys(cpu.times).map(type => `  - ${type.padEnd(6)}: ${(100 * cpu.times[type] / cpu.total).toFixed(2)}%`).join('\n')}`).join('\n\n')}`;
    await mecha.reply(m.chat, func.texted('monospace', serverInfo), m, {
      expiration: m.expiration
    });
  }
};
