const { performance } = require('perf_hooks');
const os = require('os');

exports.run = {
  usage: ['ping'],
  category: 'special',
  async: async (m, { func, mecha }) => {
    const start = performance.now();

    // Retrieve system information
    const [totalMemGB, freeMemGB, uptime, cpuInfo, loadAvg] = await Promise.all([
      (os.totalmem() / 1024 ** 3).toFixed(2) + " GB",
      (os.freemem() / 1024 ** 3).toFixed(2) + " GB",
      os.uptime(),
      os.cpus()[0]?.model ?? 'Tidak diketahui',
      os.loadavg()
    ]);

    // Calculate uptime components
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);

    // Memory usage
    const used = process.memoryUsage();
    const nodeMemoryUsage = {
      rss: (used.rss / 1024 ** 2).toFixed(2) + " MB",
      heapTotal: (used.heapTotal / 1024 ** 2).toFixed(2) + " MB",
      heapUsed: (used.heapUsed / 1024 ** 2).toFixed(2) + " MB",
      external: (used.external / 1024 ** 2).toFixed(2) + " MB"
    };

    // CPU usage calculation
    const cpus = os.cpus().map(cpu => {
      cpu.total = Object.keys(cpu.times).reduce((last, type) => last + cpu.times[type], 0);
      return cpu;
    });

    const cpu = cpus.reduce((last, cpu, _, { length }) => {
      last.total += cpu.total;
      last.times.user += cpu.times.user;
      last.times.nice += cpu.times.nice;
      last.times.sys += cpu.times.sys;
      last.times.idle += cpu.times.idle;
      last.times.irq += cpu.times.irq;
      return last;
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

    // Calculate speed and latency
    const speed = (performance.now() - start).toFixed(5) + " ms";
    const latency = (performance.now() - start).toFixed(4) + " ms";

    // Format server information
    const serverInfo = `Server Information

- ${os.cpus().length} CPU: ${cpuInfo}
- Uptime: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds
- RAM: ${freeMemGB}/${totalMemGB}
- Speed: ${speed}
- Response Latency: ${latency}

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