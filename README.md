# Anurag Verma Author Website

A premium editorial React application for books, essays, and reader connection.

## Core Routes
- `/`
- `/about`
- `/library`
- `/library/:bookId`
- `/reviews`
- `/blog`
- `/contact`
- `/search`
- `/privacy`
- `/terms`
- `*` (404)

## Design System
- Background: `#F8F6F1`
- Primary text: `#111111`
- Body text: `#2B2B2B`
- Accent: `#C9A34E`
- Heading font: `Cormorant Garamond`
- Body font: `Inter`
- Principles: editorial spacing, luxury typography, minimal motion, responsive-first

## Book Data Model
Each book in `src/data/books.js` follows a complete launch schema:

```js
{
  id,
  slug,
  title,
  subtitle,
  shortDescription,
  longDescription,
  description,
  genres: [],
  themes: [],
  status,
  publicationDate,
  pages,
  language,
  isbn,
  publisher,
  formats: {
    paperback,
    ebook
  },
  purchaseLinks: {},
  sampleId,
  relatedBooks: [],
  seo: {},
  synopsis: [],
  discoveries: [],
  editions: {
    english: {},
    hindi: {}
  }
}
```

## Content Architecture
- One source of truth for books: `src/data/books.js`
- One source of truth for reviews: `src/data/reviews.js`
- One source of truth for timeline milestones: `src/data/timeline.js`
- One source of truth for social links: `src/data/socialLinks.js`
- One source of truth for blog posts: `src/data/blog.js`

## Reader
- Keyboard navigation (`ArrowLeft`, `ArrowRight`)
- Swipe navigation on touch devices
- Focus-trapped modal with Escape support
- Edition-specific sample previews

## Contact
- Form submission to FormSubmit endpoint
- Success and error feedback states

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```
