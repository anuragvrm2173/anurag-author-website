import Container from "../ui/Container/Container";

function AuthorProfile({ name, occupation, shortBio, longBio, basedIn, authorImage, writingThemes = [] }) {
  return (
    <section className="author-profile" aria-labelledby="author-profile-title">
      <Container>
        <div className="author-profile__inner">
          <h2 id="author-profile-title" className="author-profile__title">
            AUTHOR
          </h2>

          <div className="author-profile__layout">
            {authorImage ? (
              <figure className="author-profile__portrait-wrap">
                <picture>
                  <source
                    type="image/avif"
                    srcSet="/images/optimized/author/author-400.avif 400w, /images/optimized/author/author-800.avif 800w, /images/optimized/author/author-1200.avif 1200w"
                    sizes="(max-width: 768px) 88vw, 640px"
                  />
                  <source
                    type="image/webp"
                    srcSet="/images/optimized/author/author-400.webp 400w, /images/optimized/author/author-800.webp 800w, /images/optimized/author/author-1200.webp 1200w"
                    sizes="(max-width: 768px) 88vw, 640px"
                  />
                  <img src={authorImage} alt={`${name} portrait`} className="author-profile__portrait" loading="lazy" width="640" height="640" />
                </picture>
              </figure>
            ) : null}

            <div className="author-profile__content">
              <header className="author-profile__header">
                <p className="author-profile__name">{name}</p>
                <p className="author-profile__occupation">{occupation}</p>
                <p className="author-profile__based">Based in {basedIn}</p>
              </header>

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

              {writingThemes.length > 0 ? (
                <section className="author-profile__themes" aria-labelledby="author-themes-title">
                  <h3 id="author-themes-title">Writing Themes</h3>
                  <div className="author-profile__theme-list" role="list">
                    {writingThemes.map((theme) => (
                      <span key={theme} className="author-profile__theme-item" role="listitem">
                        {theme}
                      </span>
                    ))}
                  </div>
                </section>
              ) : null}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default AuthorProfile;