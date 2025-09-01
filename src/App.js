import { useState } from "react";

export default function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function searchBooks() {
    if (!query.trim()) {
      setError("⚠️ Please enter a book title.");
      return;
    }

    setLoading(true);
    setError("");
    setBooks([]);

    try {
      const res = await fetch(
        `https://openlibrary.org/search.json?title=${encodeURIComponent(query)}`
      );
      const data = await res.json();

      if (!data.docs || data.docs.length === 0) {
        setError("📭 No books found.");
        setLoading(false);
        return;
      }

      const mapped = data.docs.slice(0, 12).map((b) => ({
        key: b.key ?? `${b.title}-${b.first_publish_year ?? ""}`,
        title: b.title ?? "Untitled",
        author: b.author_name?.[0] ?? "Unknown",
        year: b.first_publish_year ?? "N/A",
        cover: b.cover_i
          ? `https://covers.openlibrary.org/b/id/${b.cover_i}-M.jpg`
          : null,
      }));

      setBooks(mapped);
    } catch (e) {
      setError("❌ Failed to fetch books. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📚 Book Finder</h1>

      <div style={styles.searchRow}>
        <input
          type="text"
          placeholder="Search by title (e.g. Harry Potter)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={styles.input}
        />
        <button onClick={searchBooks} style={styles.button}>
          🔍 Search
        </button>
      </div>

      {loading && <p style={styles.info}>⏳ Loading...</p>}
      {error && <p style={styles.error}>{error}</p>}

      <div style={styles.grid}>
        {books.map((b) => (
          <div key={b.key} style={styles.card}>
            {b.cover ? (
              <img src={b.cover} alt={b.title} style={styles.cover} />
            ) : (
              <div style={styles.noCover}>No Cover</div>
            )}
            <h2 style={styles.cardTitle}>{b.title}</h2>
            <p style={styles.text}>👤 {b.author}</p>
            <p style={styles.text}>📅 {b.year}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 20,
    fontFamily: "Segoe UI, Roboto, sans-serif",
    color: "#fff",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    marginBottom: 20,
  },
  searchRow: {
    display: "flex",
    gap: 10,
    marginBottom: 30,
    width: "100%",
    maxWidth: 500,
  },
  input: {
    flex: 1,
    padding: "12px 15px",
    borderRadius: 12,
    border: "none",
    fontSize: 16,
    outline: "none",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
  },
  button: {
    padding: "12px 20px",
    borderRadius: 12,
    border: "none",
    background: "#fff",
    color: "#764ba2",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.3s",
  },
  info: {
    fontSize: "1rem",
    marginBottom: 20,
  },
  error: {
    color: "#ffdddd",
    background: "rgba(255,0,0,0.2)",
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
    gap: 20,
    width: "100%",
    maxWidth: 900,
  },
  card: {
    background: "#fff",
    color: "#333",
    borderRadius: 14,
    padding: 15,
    textAlign: "center",
    boxShadow: "0 6px 15px rgba(0,0,0,0.15)",
    transition: "transform 0.2s",
  },
  cover: {
    width: "100%",
    height: 220,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 12,
  },
  noCover: {
    width: "100%",
    height: 220,
    background: "#eee",
    borderRadius: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: "1.1rem",
    fontWeight: "bold",
    marginBottom: 6,
  },
  text: {
    margin: 0,
    fontSize: "0.9rem",
  },
};
