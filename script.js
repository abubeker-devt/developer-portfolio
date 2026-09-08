(function () {
  'use strict';

  /* ---------------- Theme toggle ---------------- */
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const STORAGE_KEY = 'portfolio-theme';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    toggleBtn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    toggleBtn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode');
  }

  const saved = localStorage.getItem(STORAGE_KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(saved || (prefersLight ? 'light' : 'dark'));

  toggleBtn.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
    applyTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
  });

  /* ---------------- Live GPA demo ---------------- */
  const creditInput = document.getElementById('demoCredit');
  const gradeSelect = document.getElementById('demoGrade');
  const addBtn = document.getElementById('demoAdd');
  const list = document.getElementById('demoList');
  const gpaOut = document.getElementById('demoGpa');

  let courses = [
    { credit: 3, grade: 4, label: 'A' },
    { credit: 3, grade: 3, label: 'B' },
  ];

  function gradeLabel(value) {
    const opt = Array.from(gradeSelect.options).find(o => o.value === String(value));
    return opt ? opt.textContent : value;
  }

  function render() {
    list.innerHTML = '';

    if (courses.length === 0) {
      const empty = document.createElement('li');
      empty.className = 'demo-list-empty';
      empty.textContent = 'Add a course to see the GPA update.';
      list.appendChild(empty);
    } else {
      courses.forEach((c, i) => {
        const li = document.createElement('li');
        const text = document.createElement('span');
        text.textContent = `${c.credit} credit hrs — grade ${c.label}`;
        const remove = document.createElement('button');
        remove.type = 'button';
        remove.textContent = 'remove';
        remove.setAttribute('aria-label', `Remove course with grade ${c.label}`);
        remove.addEventListener('click', () => {
          courses.splice(i, 1);
          render();
        });
        li.appendChild(text);
        li.appendChild(remove);
        list.appendChild(li);
      });
    }

    const totalCredits = courses.reduce((sum, c) => sum + c.credit, 0);
    const totalPoints = courses.reduce((sum, c) => sum + c.credit * c.grade, 0);
    const gpa = totalCredits > 0 ? totalPoints / totalCredits : 0;
    gpaOut.textContent = gpa.toFixed(2);
  }

  addBtn.addEventListener('click', () => {
    const credit = Math.min(6, Math.max(1, parseInt(creditInput.value, 10) || 1));
    const grade = parseFloat(gradeSelect.value);
    const label = gradeLabel(gradeSelect.value);
    courses.push({ credit, grade, label });
    render();
  });

  render();
})();
