// initia
let habits = JSON.parse(localStorage.getItem("habits")) || [
  {
    id: "alcool",
    name: "Sem álcool",
    cleanSince: Date.now(),
    history: []
  },
  {
    id: "acucar",
    name: "Sem açúcar",
    cleanSince: Date.now(),
    history: []
  }
];

const container = document.getElementById("habits-container");
const emptyState = document.getElementById("empty-state");

// save
function save() {
  localStorage.setItem("habits", JSON.stringify(habits));
}

// show time
function formatTime(ms) {
  let d = Math.floor(ms / 86400000);
  let h = Math.floor((ms % 86400000) / 3600000);
  let m = Math.floor((ms % 3600000) / 60000);
  let s = Math.floor((ms % 60000) / 1000);
  return `${d}d ${h}h ${m}m ${s}s`;
}

// Render
function render() {
  container.innerHTML = "";

  if (!habits.length) {
    emptyState.style.display = "block";
    return;
  }

  emptyState.style.display = "none";

  habits.forEach(h => {
    const card = document.createElement("div");
    card.className = "habit-card";

    const icon = document.createElement("div");
    icon.className = "habit-icon";
    icon.textContent = "⭐";

    const info = document.createElement("div");
    info.className = "habit-main";

    const name = document.createElement("div");
    name.className = "habit-name";
    name.textContent = h.name;

    const time = document.createElement("div");
    time.className = "habit-time";
    time.textContent = formatTime(Date.now() - h.cleanSince);

    info.appendChild(name);
    info.appendChild(time);

    const actions = document.createElement("div");
    actions.className = "habit-actions";

    const reset = document.createElement("button");
    reset.className = "btn-reset";
    reset.textContent = "Reiniciar";
    reset.onclick = () => {
      h.history.push({ from: h.cleanSince, to: Date.now() });
      h.cleanSince = Date.now();
      save();
      render();
    };

    const del = document.createElement("button");
    del.className = "btn-delete";
    del.textContent = "Excluir";
    del.onclick = () => {
      const confirmar = confirm("Tem certeza de que deseja remover este vício?");
  if (!confirmar) return;
      habits = habits.filter(x => x.id !== h.id);
      save();
      render();
    };

    actions.appendChild(reset);
    actions.appendChild(del);

    card.appendChild(icon);
    card.appendChild(info);
    card.appendChild(actions);

    container.appendChild(card);
  });
}

// add new
document.getElementById("habit-form").addEventListener("submit", e => {
  e.preventDefault();

  const input = document.getElementById("habit-name");
  if (!input.value.trim()) return;

  habits.push({
    id: Date.now().toString(),
    name: input.value,
    cleanSince: Date.now(),
    history: []
  });

  input.value = "";
  save();
  render();
});

setInterval(render, 1000);

// first render
render();
