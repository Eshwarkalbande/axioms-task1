import { useState } from "react";
import "./App.css";

const INITIAL_LEFT = ["front-end", "back-end", "devops", "database", ];
const VALID_EMAIL = "admin@gmail.com";
const VALID_PASSWORD = "123456";

const avatarClass = (name) => {
  const sum = [...name].reduce((total, ch) => total + ch.charCodeAt(0), 0);
  return `av av-${sum % 6}`;
};

export default function App() {
  const [user, setUser] = useState(null); 

  if (!user) return <Login onLogin={setUser} />;
  return <TransferList user={user} onLogout={() => setUser(null)} />;
}

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");

const handleSubmit = (e) => {
  e.preventDefault();

  if (email.trim() === "" || password === "") {
    setError("Enter your email and password.");
    return;
  }
  if (email.trim().toLowerCase() !== VALID_EMAIL || password !== VALID_PASSWORD) {
    setError("Email or password is incorrect.");
    return;
  }
  setError("");
  onLogin(email.trim());
};

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <div className="login-topbar">
          <div className="login-logo">A</div>
          <span className="login-brand">Axiom</span>
        </div>
        <h1>Welcome back</h1>
        <p className="login-sub">Sign in to build your project team.</p>
        <p className="login-hint">Demo access: admin@gmail.com / 123456</p>

        <label className="field">
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </label>

        <label className="field">
          <span>Password</span>
          <div className="pw-wrap">
            <input
              type={show ? "text" : "password"}
              placeholder="At least 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              className="pw-toggle"
              onClick={() => setShow(!show)}
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </label>

        {error && <p className="login-error" role="alert">{error}</p>}

        <button type="submit" className="login-btn">
          Sign in
        </button>
      </form>
    </main>
  );
}

function TransferList({ user, onLogout }) {
  const [left, setLeft] = useState(INITIAL_LEFT);
  const [right, setRight] = useState([]);
  const [checkedLeft, setCheckedLeft] = useState([]);
  const [checkedRight, setCheckedRight] = useState([]);
  const [newMember, setNewMember] = useState("");

  const toggle = (name, checked, setChecked) =>
    setChecked(
      checked.includes(name)
        ? checked.filter((n) => n !== name)
        : [...checked, name]
    );

  const toggleAll = (items, checked, setChecked) =>
    setChecked(checked.length === items.length ? [] : [...items]);

  const addMember = () => {
    if (newMember.trim()) {
      setLeft([...left, newMember.trim()]);
      setNewMember("");
    }
  };

  const moveRight = () => {
    setRight([...right, ...checkedLeft]);
    setLeft(left.filter((n) => !checkedLeft.includes(n)));
    setCheckedLeft([]);
  };

  const moveLeft = () => {
    setLeft([...left, ...checkedRight]);
    setRight(right.filter((n) => !checkedRight.includes(n)));
    setCheckedRight([]);
  };

  const reset = () => {
    setLeft(INITIAL_LEFT);
    setRight([]);
    setCheckedLeft([]);
    setCheckedRight([]);
  };

  return (
    <main className="page">
      <div className="topbar">
        <div className="brand-mark">
          <span className="brand-badge">A</span>
          <span className="brand-name">Axiom Studio</span>
        </div>
        <div className="user-group">
          <span className="user">{user}</span>
          <button className="logout" onClick={onLogout}>
            Log out
          </button>
        </div>
      </div>

      <header className="head">
        <div className="headline-row">
          <span className="eyebrow">Team builder</span>
          <span className="status-dot" aria-hidden="true" />
        </div>
        <h1>Build your project team</h1>
        <p>
          Tick the people you want, then press the arrow to move them across.
        </p>
        <span className="chip">
          {right.length} of {INITIAL_LEFT.length} on the team
        </span>
      </header>

      <section className="board">
        <Box
          tone="violet"
          title="Available"
          items={left}
          checked={checkedLeft}
          onToggle={(n) => toggle(n, checkedLeft, setCheckedLeft)}
          onToggleAll={() => toggleAll(left, checkedLeft, setCheckedLeft)}
          emptyText="Everyone has joined the team."
          footer={
            <div className="add-form">
              <input
                type="text"
                className="add-input"
                placeholder="Add a new team member..."
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addMember()}
              />
              <button className="add-btn" onClick={addMember}>
                Add
              </button>
            </div>
          }
        />

        <div className="controls">
          <button
            className="arrow"
            onClick={moveRight}
            disabled={left.length === 0 || checkedLeft.length === 0}
            aria-label="Move selected to Project team"
            title="Move to Project team"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h14M13 6l6 6-6 6" />
            </svg>
          </button>
          <button
            className="arrow"
            onClick={moveLeft}
            disabled={right.length === 0 || checkedRight.length === 0}
            aria-label="Move selected back to Available"
            title="Move back to Available"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M20 12H6M11 6l-6 6 6 6" />
            </svg>
          </button>
        </div>

        <Box
          tone="teal"
          title="Project team"
          items={right}
          checked={checkedRight}
          onToggle={(n) => toggle(n, checkedRight, setCheckedRight)}
          onToggleAll={() => toggleAll(right, checkedRight, setCheckedRight)}
          emptyText="No one yet. Select people on the left and move them here."
        />
      </section>

      <button className="reset" onClick={reset}>
        Reset lists
      </button>
    </main>
  );
}

function Box({ tone, title, items, checked, onToggle, onToggleAll, emptyText, footer }) {
  const allChecked = items.length > 0 && checked.length === items.length;

  return (
    <div className={`box box-${tone}`}>
      <div className="box-head">
        <label className="select-all">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={onToggleAll}
            disabled={items.length === 0}
          />
          <span>{title}</span>
        </label>
        <span className="count">
          {checked.length}/{items.length} selected
        </span>
      </div>

      {items.length === 0 ? (
        <p className="empty">{emptyText}</p>
      ) : (
        <ul className="list">
          {items.map((name) => (
            <li key={name}>
              <label className={checked.includes(name) ? "row on" : "row"}>
                <input
                  type="checkbox"
                  checked={checked.includes(name)}
                  onChange={() => onToggle(name)}
                />
                <span className={avatarClass(name)}>{name[0]}</span>
                <span className="name">{name}</span>
              </label>
            </li>
          ))}
        </ul>
      )}

      {footer}
    </div>
  );
}