import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase'
import type { Note, Topic } from '../types/topics'

interface Message {
  type: 'success' | 'danger'
  text: string
}

export function useTopics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null)
  const [notes, setNotes] = useState<Note[]>([])

  const [loadingTopics, setLoadingTopics] = useState(true)
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [savingTopic, setSavingTopic] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [message, setMessage] = useState<Message | null>(null)

  const loadTopics = useCallback(async () => {
    setLoadingTopics(true)
    const { data, error } = await supabase.from('topics').select('*').order('created_at', { ascending: true })

    if (error) {
      setMessage({ type: 'danger', text: `Failed to load topics: ${error.message}` })
    } else {
      setTopics(data ?? [])
    }

    setLoadingTopics(false)
  }, [])

  useEffect(() => {
    loadTopics()
  }, [loadTopics])

  const loadNotes = useCallback(async (topicId: string) => {
    setLoadingNotes(true)
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('topic_id', topicId)
      .order('created_at', { ascending: false })

    if (error) {
      setMessage({ type: 'danger', text: `Failed to load notes: ${error.message}` })
    } else {
      setNotes(data ?? [])
    }

    setLoadingNotes(false)
  }, [])

  useEffect(() => {
    if (selectedTopicId) {
      loadNotes(selectedTopicId)
    } else {
      setNotes([])
    }
  }, [selectedTopicId, loadNotes])

  async function addTopic(title: string) {
    const trimmed = title.trim()
    if (!trimmed) return

    setSavingTopic(true)
    setMessage(null)

    const { data, error } = await supabase
      .from('topics')
      .insert([{ title: trimmed }])
      .select()
      .single()

    if (error) {
      setMessage({ type: 'danger', text: `Failed to create topic: ${error.message}` })
    } else if (data) {
      setTopics((prev) => [...prev, data])
      setMessage({ type: 'success', text: 'Topic created successfully!' })
    }

    setSavingTopic(false)
  }

  async function deleteTopic(topicId: string) {
    setMessage(null)

    const { error } = await supabase.from('topics').delete().eq('id', topicId)

    if (error) {
      setMessage({ type: 'danger', text: `Failed to delete topic: ${error.message}` })
      return
    }

    setTopics((prev) => prev.filter((topic) => topic.id !== topicId))
    if (selectedTopicId === topicId) {
      setSelectedTopicId(null)
    }
    setMessage({ type: 'success', text: 'Topic deleted successfully!' })
  }

  async function addNote(content: string) {
    const trimmed = content.trim()
    if (!trimmed || !selectedTopicId) return

    setSavingNote(true)
    setMessage(null)

    const { data, error } = await supabase
      .from('notes')
      .insert([{ topic_id: selectedTopicId, content: trimmed }])
      .select()
      .single()

    if (error) {
      setMessage({ type: 'danger', text: `Failed to save note: ${error.message}` })
    } else if (data) {
      setNotes((prev) => [data, ...prev])
      setMessage({ type: 'success', text: 'Note saved successfully!' })
    }

    setSavingNote(false)
  }

  async function deleteNote(noteId: string) {
    setMessage(null)

    const { error } = await supabase.from('notes').delete().eq('id', noteId)

    if (error) {
      setMessage({ type: 'danger', text: `Failed to delete note: ${error.message}` })
      return
    }

    setNotes((prev) => prev.filter((note) => note.id !== noteId))
    setMessage({ type: 'success', text: 'Note deleted successfully!' })
  }

  return {
    topics,
    selectedTopicId,
    setSelectedTopicId,
    notes,
    loadingTopics,
    loadingNotes,
    savingTopic,
    savingNote,
    message,
    setMessage,
    addTopic,
    deleteTopic,
    addNote,
    deleteNote,
  }
}
