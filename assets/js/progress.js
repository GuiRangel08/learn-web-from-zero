(() => {
  const F = FirstCode;
  F.progress = {
    entry(state, lesson) {
      if (!state.lessons[lesson.id]) state.lessons[lesson.id] = { code: { ...lesson.starterCode }, completed: false, attempts: 0, hints: 0, solutionViewed: false, percentage: 0 };
      return state.lessons[lesson.id];
    },
    isUnlocked(state, lesson) {
      if (!lesson.available) return false;
      const available = F.lessons.filter(l => l.available);
      const index = available.findIndex(l => l.id === lesson.id);
      return available.slice(0, index).every(l => state.lessons[l.id]?.completed);
    },
    languages(state, lesson) {
      const allDone = module => F.lessons.filter(l => l.moduleId === module).every(l => l.available && state.lessons[l.id]?.completed);
      const result = ['html'];
      if (lesson.moduleId !== 'html' && allDone('html')) result.push('css');
      if (lesson.moduleId === 'javascript' && allDone('html') && allDone('css')) result.push('javascript');
      return result;
    },
    touch(state) {
      const now = new Date(); state.lastActivity = now.toISOString();
      const day = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      if (!state.activityDays.includes(day)) state.activityDays.push(day);
      state.activityDays = state.activityDays.slice(-366);
      state.percentage = Math.round(Object.values(state.lessons).filter(l => l.completed).length / F.lessons.length * 100);
    },
    streak(state) {
      const date = new Date(); let count = 0;
      for (let i = 0; i < 367; i++) {
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        if (state.activityDays.includes(key)) count++; else if (i > 0) break;
        date.setDate(date.getDate() - 1);
      }
      return count;
    },
    restore(state, lesson) { this.entry(state, lesson).code = { ...lesson.starterCode }; return this.entry(state, lesson).code; },
    moduleStats(state, id) {
      const lessons = F.lessons.filter(l => l.moduleId === id);
      return { completed: lessons.filter(l => state.lessons[l.id]?.completed).length, total: lessons.length, available: lessons.filter(l => l.available).length };
    }
  };
})();
