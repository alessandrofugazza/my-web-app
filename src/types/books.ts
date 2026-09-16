export interface Source {
  id: string
  name: string
}

export interface Genre {
  id: string
  name: string
}

export interface Book {
  id: string
  title: string
  author: string | null
  notes: string | null
  source_id: string
  genre_id: string
  created_at: string
  source?: Source
  genre?: Genre
}
