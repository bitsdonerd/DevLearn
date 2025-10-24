import { useState, useEffect } from "react";

// Custom hook para gerenciar responsividade
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

// Header Component
const Header = () => {
  const isMobile = useResponsive();
  const [hoveredLink, setHoveredLink] = useState(null);

  const styles = {
    header: {
      borderBottom: "1px solid #eaeaea",
      padding: "1.5rem",
      backgroundColor: "white",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
    },
    content: {
      maxWidth: "1200px",
      margin: "0 auto",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: isMobile ? "column" : "row",
      gap: isMobile ? "1rem" : "0",
    },
    logo: {
      fontSize: "2rem",
      fontWeight: "700",
      color: "#2563eb",
      margin: 0,
      fontFamily: '"Inter", system-ui, sans-serif',
      letterSpacing: "-0.02em",
    },
    nav: {
      display: "flex",
      gap: isMobile ? "1.5rem" : "2.5rem",
    },
  };

  const getLinkStyle = (linkName) => ({
    color: hoveredLink === linkName ? "#2563eb" : "#4b5563",
    textDecoration: "none",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "all 0.2s ease",
    padding: "0.5rem 0",
    borderBottom: "2px solid",
    borderBottomColor: hoveredLink === linkName ? "#2563eb" : "transparent",
    cursor: "pointer",
  });

  return (
    <header style={styles.header}>
      <div style={styles.content}>
        <h1 style={styles.logo}>DevLearn</h1>
        <nav style={styles.nav}>
          {["Home", "Sobre", "Contato"].map((link) => (
            <a
              key={link}
              href="#"
              style={getLinkStyle(link)}
              onMouseEnter={() => setHoveredLink(link)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
};

// PostCard Component
const PostCard = ({ category, readTime, title, description, author, date }) => {
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useResponsive();

  const styles = {
    card: {
      backgroundColor: "white",
      borderRadius: "12px",
      padding: isMobile ? "1.5rem" : "2rem",
      boxShadow: isHovered
        ? "0 8px 16px rgba(0,0,0,0.08)"
        : "0 2px 4px rgba(0,0,0,0.05)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      cursor: "pointer",
      transform: isHovered ? "translateY(-4px)" : "none",
      border: "1px solid",
      borderColor: isHovered ? "#e5e7eb" : "transparent",
    },
    meta: {
      display: "flex",
      gap: "1rem",
      marginBottom: "1.25rem",
      alignItems: "center",
    },
    category: {
      backgroundColor: "#eef2ff",
      color: "#4f46e5",
      padding: "0.375rem 0.75rem",
      borderRadius: "9999px",
      fontSize: "0.875rem",
      fontWeight: "500",
      letterSpacing: "0.025em",
    },
    readTime: {
      color: "#6b7280",
      fontSize: "0.875rem",
    },
    title: {
      fontSize: isMobile ? "1.25rem" : "1.5rem",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "1rem",
      lineHeight: "1.4",
      letterSpacing: "-0.01em",
    },
    description: {
      fontSize: isMobile ? "1rem" : "1.125rem",
      color: "#4b5563",
      lineHeight: "1.75",
      marginBottom: "1.5rem",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      color: "#6b7280",
      fontSize: "0.875rem",
    },
    author: {
      fontWeight: "600",
    },
    date: {
      color: "#9ca3af",
    },
  };

  return (
    <article
      style={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={styles.meta}>
        <span style={styles.category}>{category}</span>
        <span style={styles.readTime}>{readTime}</span>
      </div>
      <h2 style={styles.title}>{title}</h2>
      <p style={styles.description}>{description}</p>
      <div style={styles.footer}>
        <span style={styles.author}>{author}</span>
        <span style={styles.date}>{date}</span>
      </div>
    </article>
  );
};

// Footer Component
const Footer = () => {
  const styles = {
    footer: {
      textAlign: "center",
      padding: "2.5rem",
      backgroundColor: "white",
      borderTop: "1px solid #eaeaea",
      color: "#6b7280",
    },
  };

  return (
    <footer style={styles.footer}>
      <p>&copy; 2025 DevLearn. Construído com ❤️ para desenvolvedores.</p>
    </footer>
  );
};

// Lista de posts mockada
const mockPosts = [
  {
    id: 1,
    title: "Entendendo Closures em JavaScript",
    description:
      "Um guia completo sobre como closures funcionam e por que são importantes para programadores JavaScript.",
    author: "Ana Silva",
    date: "21 Set 2025",
    readTime: "5 min",
    category: "JavaScript",
  },
  {
    id: 2,
    title: "Docker para Iniciantes: Do Zero à Produção",
    description:
      "Aprenda os conceitos fundamentais de containerização e como usar Docker no seu workflow de desenvolvimento.",
    author: "Carlos Santos",
    date: "20 Set 2025",
    readTime: "8 min",
    category: "DevOps",
  },
  {
    id: 3,
    title: "Clean Code: Princípios Fundamentais",
    description:
      "Descubra como escrever código mais limpo e manutenível seguindo princípios de desenvolvimento consolidados.",
    author: "Maria Costa",
    date: "19 Set 2025",
    readTime: "6 min",
    category: "Boas Práticas",
  },
];

// Main Component
export default function Home() {
  const isMobile = useResponsive();

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      backgroundColor: "#f9fafb",
      fontFamily:
        '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
    },
    main: {
      flex: 1,
      padding: isMobile ? "1.5rem" : "3rem 1.5rem",
      maxWidth: "1200px",
      margin: "0 auto",
      width: "100%",
    },
    postsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "2rem",
    },
  };

  return (
    <div style={styles.container}>
      <Header />
      <main style={styles.main}>
        <div style={styles.postsContainer}>
          {mockPosts.map((post) => (
            <PostCard key={post.id} {...post} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
