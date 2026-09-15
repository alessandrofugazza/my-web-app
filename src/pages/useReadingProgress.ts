import { useCallback, useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { supabase } from '../supabase'
import type { ReadingProgress } from '../types/readingProgress'

interface Message {
  type: 'success' | 'danger'
  text: string
}

export function useReadingProgress() {
  const [record, setRecord] = useState<ReadingProgress | null>(null)
  const [startingPage, setStartingPage] = useState<number | ''>('')
  const [currentPage, setCurrentPage] = useState<number | ''>('')
  const [yesterdayProgress, setYesterdayProgress] = useState<number | ''>('')
  const [totalPages, setTotalPages] = useState<number | ''>('')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)

  const applyData = useCallback((data: ReadingProgress | null) => {
    if (data) {
      setRecord(data)
      setStartingPage(data.starting_page ?? 0)
      setCurrentPage(data.current_page ?? 0)
      setYesterdayProgress(data.yesterday_progress ?? 0)
      setTotalPages(data.total_pages ?? 0)
    } else {
      setStartingPage(0)
      setCurrentPage(0)
      setYesterdayProgress(0)
      setTotalPages(0)
    }
  }, [])

  const loadProgressData = useCallback(async () => {
    const { data, error } = await supabase.from('reading_progress').select('*').limit(1).maybeSingle()

    if (error) {
      setMessage({ type: 'danger', text: `Failed to load progress: ${error.message}` })
    } else {
      applyData(data)
    }

    setLoading(false)
  }, [applyData])

  useEffect(() => {
    let ignore = false

    async function initialFetch() {
      const { data, error } = await supabase.from('reading_progress').select('*').limit(1).maybeSingle()

      if (ignore) return

      if (error) {
        setMessage({ type: 'danger', text: `Failed to load progress: ${error.message}` })
      } else {
        applyData(data)
      }

      setLoading(false)
    }

    initialFetch()

    return () => {
      ignore = true
    }
  }, [applyData])

  async function handleSave(e: FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage(null)

    const startVal = startingPage === '' ? 0 : Number(startingPage)
    const currentVal = currentPage === '' ? 0 : Number(currentPage)
    const yesterdayVal = yesterdayProgress === '' ? 0 : Number(yesterdayProgress)
    const totalVal = totalPages === '' ? 0 : Number(totalPages)

    if (currentVal < startVal) {
      setMessage({ type: 'danger', text: 'Current page cannot be less than starting page.' })
      setSaving(false)
      return
    }

    if (totalVal > 0 && currentVal > totalVal) {
      setMessage({ type: 'danger', text: 'Current page cannot exceed total pages.' })
      setSaving(false)
      return
    }

    const payload = {
      starting_page: startVal,
      current_page: currentVal,
      yesterday_progress: yesterdayVal,
      total_pages: totalVal,
    }

    if (record?.id) {
      const { data, error } = await supabase
        .from('reading_progress')
        .update(payload)
        .eq('id', record.id)
        .select()
        .single()

      if (error) {
        setMessage({ type: 'danger', text: `Failed to update: ${error.message}` })
      } else if (data) {
        setRecord(data)
        setMessage({ type: 'success', text: 'Reading progress updated successfully!' })
      }
    } else {
      const { data, error } = await supabase.from('reading_progress').insert([payload]).select().single()

      if (error) {
        setMessage({ type: 'danger', text: `Failed to save: ${error.message}` })
      } else if (data) {
        setRecord(data)
        setMessage({ type: 'success', text: 'Reading progress created and saved successfully!' })
      }
    }

    setSaving(false)
  }

  return {
    startingPage,
    setStartingPage,
    currentPage,
    setCurrentPage,
    yesterdayProgress,
    setYesterdayProgress,
    totalPages,
    setTotalPages,
    loading,
    saving,
    message,
    setMessage,
    loadProgressData,
    handleSave,
  }
}
