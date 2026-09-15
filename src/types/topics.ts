export interface Topic {
  id: string
  title: string
  created_at: string
}

export interface Note {
  id: string
  topic_id: string
  content: string
  created_at: string
}
