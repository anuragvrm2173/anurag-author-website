import "./Heading.css";

function Heading({ as: Component = "h2", children, className = "" }) {
  return <Component className={`heading ${className}`.trim()}>{children}</Component>;
}

export default Heading;
