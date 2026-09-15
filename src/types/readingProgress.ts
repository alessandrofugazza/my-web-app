export interface ReadingProgress {
  id: string
  starting_page: number
  current_page: number
  yesterday_progress: number
  total_pages?: number | null
}
