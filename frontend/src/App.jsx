import { useEffect, useState } from "react";
import {
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock,
  LayoutDashboard,
  Plus,
  Search,
  Settings,
  Sparkles,
  Tag,
  Trash2,
  UserRound,
} from "lucide-react";
import "./App.css";

const STORAGE_KEY = "chronovault-events";

const initialEvents = [
  {
    id: 1,
    title: "Pay electricity bill",
    category: "Bills",
    date: "2026-10-15",
    time: "10:00",
    priority: "High",
    completed: false,
  },
  {
    id: 2,
    title: "Project submission",
    category: "Work",
    date: "2026-10-17",
    time: "14:00",
    priority: "High",
    completed: false,
  },
  {
    id: 3,
    title: "Friend's birthday",
    category: "Personal",
    date: "2026-10-20",
    time: "09:00",
    priority: "Medium",
    completed: false,
  },
];

// Load saved events from browser storage.
function loadEvents() {
  try {
    const savedEvents = localStorage.getItem(STORAGE_KEY);

    if (savedEvents !== null) {
      const parsedEvents = JSON.parse(savedEvents);

      if (Array.isArray(parsedEvents)) {
        return parsedEvents;
      }
    }

    return initialEvents;
  } catch (error) {
    console.error("Could not load saved events:", error);
    return initialEvents;
  }
}

function App() {
  const [events, setEvents] = useState(loadEvents);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    category: "Personal",
    date: "",
    time: "09:00",
    priority: "Medium",
  });

  // Save the event list whenever it changes.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (error) {
      console.error("Could not save events:", error);
    }
  }, [events]);

  const today = new Date().toISOString().slice(0, 10);

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(search.toLowerCase())
  );

  const upcomingEvents = events.filter(
    (event) => !event.completed && event.date >= today
  );

  const completedCount = events.filter(
    (event) => event.completed
  ).length;

  function addEvent(e) {
    e.preventDefault();

    const title = form.title.trim();

    if (!title || !form.date) {
      return;
    }

    const newEvent = {
      ...form,
      title,
      id: Date.now(),
      completed: false,
    };

    setEvents((current) => [...current, newEvent]);

    setForm({
      title: "",
      category: "Personal",
      date: "",
      time: "09:00",
      priority: "Medium",
    });

    setShowForm(false);
  }

  function toggleComplete(id) {
    setEvents((current) =>
      current.map((event) =>
        event.id === id
          ? { ...event, completed: !event.completed }
          : event
      )
    );
  }

  function deleteEvent(id) {
    setEvents((current) =>
      current.filter((event) => event.id !== id)
    );
  }

  function formatDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#dashboard">
          <span className="brand-icon">
            <Clock size={24} />
          </span>

          <span>
            <strong>ChronoVault</strong>
            <small>Never forget what matters</small>
          </span>
        </a>

        <p className="nav-label">WORKSPACE</p>

        <nav className="navigation">
          <a className="nav-item active" href="#dashboard">
            <LayoutDashboard size={19} />
            Dashboard
          </a>

          <a className="nav-item" href="#events">
            <CalendarDays size={19} />
            My events
          </a>

          <a className="nav-item" href="#categories">
            <Tag size={19} />
            Categories
          </a>
        </nav>

        <div className="sidebar-bottom">
          <div className="upgrade-card">
            <Sparkles size={21} />
            <strong>Your time matters.</strong>
            <p>
              Keep your important moments organized in one place.
            </p>
          </div>

          <a className="nav-item" href="#settings">
            <Settings size={19} />
            Settings
          </a>

          <div className="profile">
            <div className="avatar">
              <UserRound size={20} />
            </div>

            <div>
              <strong>ChronoVault User</strong>
              <small>Personal workspace</small>
            </div>
          </div>
        </div>
      </aside>

      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div>
            <p className="eyebrow">YOUR PERSONAL ORGANIZER</p>

            <h1>
              Good day! <span>✦</span>
            </h1>

            <p className="subtitle">
              Keep track of the moments and tasks that matter.
            </p>
          </div>

          <button
            className="icon-button"
            aria-label="Notifications"
            type="button"
          >
            <Bell size={20} />
          </button>
        </header>

        <section className="welcome-banner">
          <div>
            <span className="banner-tag">
              <Sparkles size={14} />
              YOUR TIME, ORGANIZED
            </span>

            <h2>Make room for what matters.</h2>

            <p>
              One place for your reminders, important dates and everyday
              plans.
            </p>

            <button
              className="primary-button"
              type="button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={18} />
              Create an event
            </button>
          </div>

          <div className="banner-art">
            <CalendarDays size={94} strokeWidth={1.1} />
          </div>
        </section>

        <section className="stats-grid">
          <article className="stat-card">
            <div className="stat-icon purple">
              <CalendarDays size={21} />
            </div>

            <p>Total events</p>
            <strong>{events.length}</strong>
            <small>All your plans in one place</small>
          </article>

          <article className="stat-card">
            <div className="stat-icon blue">
              <Clock size={21} />
            </div>

            <p>Upcoming</p>
            <strong>{upcomingEvents.length}</strong>
            <small>Events still to come</small>
          </article>

          <article className="stat-card">
            <div className="stat-icon green">
              <CheckCircle2 size={21} />
            </div>

            <p>Completed</p>
            <strong>{completedCount}</strong>
            <small>Tasks you've finished</small>
          </article>
        </section>

        {showForm && (
          <section className="form-card">
            <div className="section-heading">
              <div>
                <h2>Create an event</h2>
                <p>Add something important to your schedule.</p>
              </div>

              <button
                className="text-button"
                type="button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>
            </div>

            <form onSubmit={addEvent} className="event-form">
              <label>
                Event title
                <input
                  required
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="e.g. Pay internet bill"
                />
              </label>

              <div className="form-row">
                <label>
                  Date
                  <input
                    type="date"
                    required
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                  />
                </label>

                <label>
                  Time
                  <input
                    type="time"
                    value={form.time}
                    onChange={(e) =>
                      setForm({ ...form, time: e.target.value })
                    }
                  />
                </label>
              </div>

              <div className="form-row">
                <label>
                  Category
                  <select
                    value={form.category}
                    onChange={(e) =>
                      setForm({ ...form, category: e.target.value })
                    }
                  >
                    <option>Personal</option>
                    <option>Work</option>
                    <option>Bills</option>
                    <option>Health</option>
                    <option>Other</option>
                  </select>
                </label>

                <label>
                  Priority
                  <select
                    value={form.priority}
                    onChange={(e) =>
                      setForm({ ...form, priority: e.target.value })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </label>
              </div>

              <button className="primary-button" type="submit">
                <Plus size={18} />
                Save event
              </button>
            </form>
          </section>
        )}

        <section className="events-section" id="events">
          <div className="section-heading">
            <div>
              <h2>Your events</h2>
              <p>Everything important, at a glance.</p>
            </div>

            <button
              className="secondary-button"
              type="button"
              onClick={() => setShowForm(true)}
            >
              <Plus size={17} />
              Add event
            </button>
          </div>

          <div className="search-box">
            <Search size={18} />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your events..."
              aria-label="Search your events"
            />
          </div>

          <div className="event-list">
            {filteredEvents.map((event) => (
              <article
                className={`event-row ${
                  event.completed ? "is-complete" : ""
                }`}
                key={event.id}
              >
                <button
                  className="complete-button"
                  type="button"
                  onClick={() => toggleComplete(event.id)}
                  aria-label={
                    event.completed ? "Mark incomplete" : "Mark complete"
                  }
                >
                  <CheckCircle2 size={22} />
                </button>

                <div className="event-details">
                  <strong>{event.title}</strong>

                  <div className="event-meta">
                    <span>
                      <CalendarDays size={14} />
                      {formatDate(event.date)}
                    </span>

                    <span>
                      <Clock size={14} />
                      {event.time}
                    </span>

                    <span>{event.category}</span>
                  </div>
                </div>

                <span
                  className={`priority priority-${event.priority.toLowerCase()}`}
                >
                  {event.priority}
                </span>

                <button
                  className="delete-button"
                  type="button"
                  onClick={() => deleteEvent(event.id)}
                  aria-label={`Delete ${event.title}`}
                >
                  <Trash2 size={17} />
                </button>
              </article>
            ))}

            {filteredEvents.length === 0 && (
              <div className="empty-state">
                No matching events. Try another search or add an event.
              </div>
            )}
          </div>
        </section>

        <footer className="footer">
          ChronoVault · A little more time for what matters.
        </footer>
      </main>
    </div>
  );
}

export default App;