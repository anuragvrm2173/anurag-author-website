import Container from "../ui/Container/Container";

function AuthorProfile({ name, occupation, shortBio, longBio, basedIn, authorImage }) {
  return (
    <section className="author-profile" aria-labelledby="author-profile-title">
      <Container>
        <div className="author-profile__inner">
          <header className="author-profile__header">
            <h2 id="author-profile-title" className="author-profile__title">
              Author Profile
            </h2>
            <p className="author-profile__name">{name}</p>
            <p className="author-profile__occupation">{occupation}</p>
          </header>

          {authorImage ? (
            <figure className="author-profile__portrait-wrap">
              <img src={authorImage} alt={`${name} portrait`} className="author-profile__portrait" loading="lazy" />
            </figure>
          ) : null}

          <div className="author-profile__bios">
            <div className="author-profile__bio-block" aria-labelledby="author-short-bio-title">
              <h3 id="author-short-bio-title">Short Bio</h3>
              <p>{shortBio}</p>
            </div>

            <div className="author-profile__bio-block" aria-labelledby="author-long-bio-title">
              <h3 id="author-long-bio-title">Long Bio</h3>
              <p>{longBio}</p>
            </div>
          </div>

          <div className="author-profile__meta" aria-label="Author details">
            <section className="author-profile__meta-block" aria-labelledby="author-awards-title">
              <h3 id="author-awards-title">Awards</h3>
              <p>Coming Soon.</p>
            </section>

            <section className="author-profile__meta-block" aria-labelledby="author-based-title">
              <h3 id="author-based-title">Based In</h3>
              <p>{basedIn}</p>
            </section>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AuthorProfile;