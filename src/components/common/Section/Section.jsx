import "./Section.css";

function Section({ children, className = "" }) {
  return <section className={`section ${className}`.trim()}>{children}</section>;
}

export default Section;
