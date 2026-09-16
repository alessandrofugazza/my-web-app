import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase'
import type { Book, Genre, Source } from '../types/books'

interface Message {
  type: 'success' | 'danger'
  text: string
}

const BOOK_SELECT = '*, source:sources(*), genre:genres(*)'

export function useBooks() {
  const [sources, setSources] = useState<Source[]>([])
  const [genres, setGenres] = useState<Genre[]>([])
  const [books, setBooks] = useState<Book[]>([])

  const [loadingLists, setLoadingLists] = useState(true)
  const [loadingBooks, setLoadingBooks] = useState(true)
  const [savingBook, setSavingBook] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)

  const loadSources = useCallback(async () => {
    const { data, error } = await supabase.from('sources').select('*').order('name', { ascending: true })

    if (error) {
      setMessage({ type: 'danger', text: `Failed to load sources: ${error.message}` })
    } else {
      setSources(data ?? [])
    }
  }, [])

  const loadGenres = useCallback(async () => {
    const { data, error } = await supabase.from('genres').select('*').order('name', { ascending: true })

    if (error) {
      setMessage({ type: 'danger', text: `Failed to load genres: ${error.message}` })
    } else {
      setGenres(data ?? [])
    }
  }, [])

  const loadBooks = useCallback(async () => {
    setLoadingBooks(true)
    const { data, error } = await supabase.from('books').select(BOOK_SELECT).order('created_at', { ascending: false })

    if (error) {
      setMessage({ type: 'danger', text: `Failed to load books: ${error.message}` })
    } else {
      setBooks((data as unknown as Book[]) ?? [])
    }

    setLoadingBooks(false)
  }, [])

  useEffect(() => {
    async function loadAll() {
      setLoadingLists(true)
      await Promise.all([loadSources(), loadGenres(), loadBooks()])
      setLoadingLists(false)
    }

    loadAll()
  }, [loadSources, loadGenres, loadBooks])

  async function addSource(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return

    setMessage(null)
    const { data, error } = await supabase
      .from('sources')
      .insert([{ name: trimmed }])
      .select()
      .single()

    if (error) {
      setMessage({ type: 'danger', text: `Failed to add source: ${error.message}` })
    } else if (data) {
      setSources((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    }
  }

  async function deleteSource(sourceId: string) {
    setMessage(null)
    const { error } = await supabase.from('sources').delete().eq('id', sourceId)

    if (error) {
      setMessage({ type: 'danger', text: `Failed to delete source: ${error.message}` })
      return
    }

    setSources((prev) => prev.filter((source) => source.id !== sourceId))
  }

  async function addGenre(name: string) {
    const trimmed = name.trim()
    if (!trimmed) return

    setMessage(null)
    const { data, error } = await supabase
      .from('genres')
      .insert([{ name: trimmed }])
      .select()
      .single()

    if (error) {
      setMessage({ type: 'danger', text: `Failed to add genre: ${error.message}` })
    } else if (data) {
      setGenres((prev) => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)))
    }
  }

  async function deleteGenre(genreId: string) {
    setMessage(null)
    const { error } = await supabase.from('genres').delete().eq('id', genreId)

    if (error) {
      setMessage({ type: 'danger', text: `Failed to delete genre: ${error.message}` })
      return
    }

    setGenres((prev) => prev.filter((genre) => genre.id !== genreId))
  }

  async function addBook(book: { title: string; author: string; notes: string; sourceId: string; genreId: string }) {
    const title = book.title.trim()
    if (!title || !book.sourceId || !book.genreId) return

    setSavingBook(true)
    setMessage(null)

    const payload = {
      title,
      author: book.author.trim() || null,
      notes: book.notes.trim() || null,
      source_id: book.sourceId,
      genre_id: book.genreId,
    }

    const { data, error } = await supabase.from('books').insert([payload]).select(BOOK_SELECT).single()

    if (error) {
      setMessage({ type: 'danger', text: `Failed to save book: ${error.message}` })
    } else if (data) {
      setBooks((prev) => [data as unknown as Book, ...prev])
      setMessage({ type: 'success', text: 'Book added successfully!' })
    }

    setSavingBook(false)
  }

  async function deleteBook(bookId: string) {
    setMessage(null)
    const { error } = await supabase.from('books').delete().eq('id', bookId)

    if (error) {
      setMessage({ type: 'danger', text: `Failed to delete book: ${error.message}` })
      return
    }

    setBooks((prev) => prev.filter((book) => book.id !== bookId))
  }

  return {
    sources,
    genres,
    books,
    loadingLists,
    loadingBooks,
    savingBook,
    message,
    setMessage,
    addSource,
    deleteSource,
    addGenre,
    deleteGenre,
    addBook,
    deleteBook,
  }
}
