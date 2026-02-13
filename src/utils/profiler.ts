export class Profiler {
  private records: Map<string, number[]> = new Map();

  track(name: string, duration: number) {
    const durations = this.records.get(name);

    if (durations) {
      durations.push(duration);
    } else {
      this.records.set(name, [duration]);
    }
  }

  getSummary() {
    const stats: { name: string; duration: number }[] = [];

    for (const [name, durations] of this.records) {
      const total = durations.reduce((sum, duration) => sum + duration, 0);
      const average = total / durations.length;

      stats.push({ name, duration: average });
    }

    return stats;
  }
}
