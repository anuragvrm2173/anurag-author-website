import "./Book.css";

import { Link } from "react-router-dom";

import Container from "../../components/ui/Container/Container";

function Book() {
  return (
    <section className="book-page" aria-labelledby="book-page-title">
      <Container>
        <h1 id="book-page-title">Books now live in the Library.</h1>
        <p>Visit the library to explore all titles and open each book detail page.</p>
        <Link to="/library">Go to Library</Link>
      </Container>
    </section>
  );
}

export default Book;
