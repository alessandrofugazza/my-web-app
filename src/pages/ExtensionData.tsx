import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Modal from 'react-bootstrap/Modal'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import { useAuth } from '../AuthContext'
import ConfirmDeleteModal from '../components/ConfirmDeleteModal'
import { supabase } from '../supabase'

const pageSize = 25
type Section = 'pages' | 'page_notes' | 'reading_locations'
type SortOrder = 'default' | 'newest' | 'oldest'

interface Page {
  id: number
  user_id: string
  url: string
  is_read: boolean
  completed_at: string | null
  created_at: string
  noteCount: number
}

interface PageNote {
  id: number
  page_id: number
  note: string
  created_at: string
  pages: { url: string }
}

interface ReadingLocation {
  id: string
  user_id: string
  url: string
  quote: string
  prefix: string
  suffix: string
  created_at: string
}

type Entry =
  | { kind: 'pages'; item: Page }
  | { kind: 'page_notes'; item: PageNote }
  | { kind: 'reading_locations'; item: ReadingLocation }

const labels: Record<Section, string> = {
  pages: 'Pages',
  page_notes: 'Page notes',
  reading_locations: 'Reading locations',
}

function localDate() {
  const date = new Date()
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function ExtensionData() {
  const { session } = useAuth()
  const userId = session?.user.id ?? ''
  const [section, setSection] = useState<Section>('pages')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('default')
  const [page, setPage] = useState(0)
  const [revision, setRevision] = useState(0)
  const [loaded, setLoaded] = useState<{ key: string; failed: boolean } | null>(null)
  const [pages, setPages] = useState<Page[]>([])
  const [notes, setNotes] = useState<PageNote[]>([])
  const [locations, setLocations] = useState<ReadingLocation[]>([])
  const [count, setCount] = useState(0)
  const [edit, setEdit] = useState<Entry | null>(null)
  const [pendingDelete, setPendingDelete] = useState<Entry | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  const loadKey = JSON.stringify([userId, section, page, revision, debouncedSearch, sortOrder])
  useEffect(() => {
    let active = true
    async function load() {
      let failed = false
      try {
        const rangeStart = page * pageSize
        const searchPattern = `%${debouncedSearch.trim().replace(/[\\%_*]/g, '\\$&')}%`
        const ascending = sortOrder === 'oldest'
        if (section === 'pages') {
          let query = supabase.from('pages')
            .select('id, user_id, url, is_read, completed_at, created_at', { count: 'exact' })
            .eq('user_id', userId)
          if (debouncedSearch.trim()) query = query.ilike('url', searchPattern)
          const ordered = sortOrder === 'default' ? query.order('id', { ascending: false })
            : query.order('created_at', { ascending }).order('id', { ascending })
          const { data, error, count: total } = await ordered.range(rangeStart, rangeStart + pageSize - 1)
          if (error) throw error
          if (total === null) throw new Error('The server did not return a result count.')
          if (!active) return
          const pagesWithCounts = await Promise.all(data.map(async (item) => {
            const { count: noteCount, error: countError } = await supabase.from('page_notes')
              .select('id', { count: 'exact', head: true }).eq('page_id', item.id)
            if (countError) throw new Error(`Could not count notes for ${item.url}: ${countError.message}`)
            if (noteCount === null) throw new Error(`The server did not return a note count for ${item.url}.`)
            return { ...item, noteCount }
          }))
          if (active) { setPages(pagesWithCounts); setCount(total) }
        } else if (section === 'page_notes') {
          let query = supabase.from('page_notes')
            .select('id, page_id, note, created_at, pages!inner(url, user_id)', { count: 'exact' })
            .eq('pages.user_id', userId)
          if (debouncedSearch.trim()) query = query.ilike('pages.url', searchPattern)
          const ordered = sortOrder === 'default' ? query.order('id', { ascending: false })
            : query.order('created_at', { ascending }).order('id', { ascending })
          const { data, error, count: total } = await ordered
            .range(rangeStart, rangeStart + pageSize - 1).overrideTypes<PageNote[], { merge: false }>()
          if (error) throw error
          if (total === null) throw new Error('The server did not return a result count.')
          if (active) { setNotes(data); setCount(total) }
        } else {
          let query = supabase.from('reading_locations')
            .select('id, user_id, url, quote, prefix, suffix, created_at', { count: 'exact' })
            .eq('user_id', userId)
          if (debouncedSearch.trim()) query = query.ilike('url', searchPattern)
          const ordered = sortOrder === 'default' ? query.order('created_at', { ascending: false }).order('id')
            : query.order('created_at', { ascending }).order('id', { ascending })
          const { data, error, count: total } = await ordered
            .range(rangeStart, rangeStart + pageSize - 1)
          if (error) throw error
          if (total === null) throw new Error('The server did not return a result count.')
          if (active) { setLocations(data); setCount(total) }
        }
      } catch (reason: unknown) {
        if (active) {
          failed = true
          const detail = typeof reason === 'object' && reason !== null && 'message' in reason
            ? String(reason.message) : String(reason)
          setMessage({ type: 'danger', text: `Could not load ${labels[section].toLowerCase()}: ${detail}` })
          setCount(0)
          setPages([])
          setNotes([])
          setLocations([])
        }
      } finally {
        if (active) setLoaded({ key: loadKey, failed })
      }
    }
    void load()
    return () => { active = false }
  }, [userId, section, page, loadKey, debouncedSearch, sortOrder])

  async function save(event: FormEvent) {
    event.preventDefault()
    if (!edit) return
    setSaving(true)
    setMessage(null)
    try {
      const result = edit.kind === 'pages'
        ? await supabase.from('pages').update({
          url: edit.item.url, is_read: edit.item.is_read, completed_at: edit.item.completed_at,
        }).eq('id', edit.item.id).eq('user_id', userId).select('id').single()
        : edit.kind === 'page_notes'
          ? await supabase.from('page_notes').update({ note: edit.item.note })
            .eq('id', edit.item.id).eq('page_id', edit.item.page_id).select('id').single()
          : await supabase.from('reading_locations').update({
            url: edit.item.url, quote: edit.item.quote, prefix: edit.item.prefix, suffix: edit.item.suffix,
          }).eq('id', edit.item.id).eq('user_id', userId).select('id').single()
      if (result.error) throw result.error
      setEdit(null)
      setMessage({ type: 'success', text: 'Entry updated.' })
      setPage(0)
      setRevision((value) => value + 1)
    } catch (reason: unknown) {
      const detail = typeof reason === 'object' && reason !== null && 'message' in reason
        ? String(reason.message) : String(reason)
      setMessage({ type: 'danger', text: `Could not update entry: ${detail}` })
    } finally {
      setSaving(false)
    }
  }

  const loading = loaded?.key !== loadKey || search !== debouncedSearch
  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  const rows = section === 'pages' ? pages : section === 'page_notes' ? notes : locations

  async function deleteEntry(entry: Entry) {
    setSaving(true)
    setMessage(null)
    try {
      const result = entry.kind === 'pages'
        ? await supabase.from('pages').delete().eq('id', entry.item.id).eq('user_id', userId).select('id').single()
        : entry.kind === 'page_notes'
          ? await supabase.from('page_notes').delete().eq('id', entry.item.id).eq('page_id', entry.item.page_id).select('id').single()
          : await supabase.from('reading_locations').delete().eq('id', entry.item.id).eq('user_id', userId).select('id').single()
      if (result.error) throw result.error
      setPendingDelete(null)
      if (page > 0 && rows.length === 1) setPage(page - 1)
      setRevision((value) => value + 1)
      setMessage({ type: 'success', text: 'Entry deleted.' })
    } catch (reason: unknown) {
      const detail = typeof reason === 'object' && reason !== null && 'message' in reason
        ? String(reason.message) : String(reason)
      setMessage({ type: 'danger', text: `Could not delete entry: ${detail}` })
    } finally {
      setSaving(false)
    }
  }

  function requestDelete(entry: Entry) {
    setMessage(null)
    setPendingDelete(entry)
  }

  const deleteMessage = pendingDelete?.kind === 'pages'
    ? `Delete the page "${pendingDelete.item.url}"? Its notes may also be deleted if the database cascades deletions; otherwise they may prevent deletion. Reading locations are not deleted.`
    : pendingDelete?.kind === 'page_notes'
      ? `Delete this note for "${pendingDelete.item.pages.url}"?`
      : pendingDelete?.kind === 'reading_locations'
        ? `Delete the reading location for "${pendingDelete.item.url}"?`
        : ''

  function changeSection(next: Section) {
    setSection(next)
    setPage(0)
    setMessage(null)
  }

  return (
    <div className="my-4">
      <h1 className="mb-4 text-center">Extension Data</h1>
      <p className="text-secondary">View, edit, and delete the data saved by your Chrome extension. Sign in with the same account used in the extension.</p>
      {message && <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>{message.text}</Alert>}
      <div className="d-flex gap-2 flex-wrap mb-3" role="group" aria-label="Extension data tables">
        {(Object.keys(labels) as Section[]).map((key) => (
          <Button key={key} variant={section === key ? 'primary' : 'outline-primary'} aria-pressed={section === key} disabled={saving} onClick={() => changeSection(key)}>{labels[key]}</Button>
        ))}
      </div>
      <Card className="shadow-sm">
        <Card.Header><h2 className="h5 mb-0">{labels[section]}</h2></Card.Header>
        <Card.Body>
          <Form.Group controlId="extension-url-search" className="mb-3">
            <Form.Label>Search URLs</Form.Label>
            <Form.Control type="search" placeholder="Search by URL" value={search} disabled={saving} onChange={(event) => { setSearch(event.target.value); setPage(0) }} />
          </Form.Group>
          <Form.Group controlId="extension-sort" className="mb-3">
            <Form.Label>Sort by</Form.Label>
            <Form.Select value={sortOrder} disabled={saving} onChange={(event) => {
              const value = event.target.value
              if (value === 'default' || value === 'newest' || value === 'oldest') {
                setSortOrder(value)
                setPage(0)
              }
            }}>
              <option value="default">Default order</option>
              <option value="newest">Creation date: newest first</option>
              <option value="oldest">Creation date: oldest first</option>
            </Form.Select>
          </Form.Group>
          {loading ? <div><Spinner animation="border" size="sm" role="status" /> Loading...</div> : loaded?.failed ? (
            <Button variant="outline-secondary" onClick={() => { setMessage(null); setRevision((value) => value + 1) }}>Retry loading</Button>
          ) : (
            <>
              <p className="text-secondary">{count} {count === 1 ? 'entry' : 'entries'}</p>
              {rows.length === 0 ? <p>No entries found.</p> : (
                <Table responsive striped hover>
                  <thead><tr>
                    {section === 'pages' && <><th>URL</th><th>Notes</th><th>Read</th><th>Completed</th></>}
                    {section === 'page_notes' && <><th>Page URL</th><th>Note</th></>}
                    {section === 'reading_locations' && <><th>URL</th><th>Quote</th><th>Prefix</th><th>Suffix</th></>}
                    <th>Created</th><th><span className="visually-hidden">Actions</span></th>
                  </tr></thead>
                  <tbody>
                    {section === 'pages' && pages.map((item) => <tr key={item.id}>
                      <td className="text-break">{item.url}</td><td>{item.noteCount}</td><td>{item.is_read ? 'Yes' : 'No'}</td><td>{item.completed_at ?? 'Unknown'}</td>
                      <td>{new Date(item.created_at).toLocaleString()}</td>
                      <td><div className="d-flex gap-2"><Button size="sm" variant="outline-primary" disabled={saving} onClick={() => setEdit({ kind: 'pages', item })} aria-label={`Edit page ${item.id}`}>Edit</Button><Button size="sm" variant="outline-danger" disabled={saving} onClick={() => requestDelete({ kind: 'pages', item })} aria-label={`Delete page ${item.id}`}>Delete</Button></div></td>
                    </tr>)}
                    {section === 'page_notes' && notes.map((item) => <tr key={item.id}>
                      <td className="text-break">{item.pages.url}</td><td className="text-break" style={{ whiteSpace: 'pre-wrap' }}>{item.note}</td>
                      <td>{new Date(item.created_at).toLocaleString()}</td>
                      <td><div className="d-flex gap-2"><Button size="sm" variant="outline-primary" disabled={saving} onClick={() => setEdit({ kind: 'page_notes', item })} aria-label={`Edit note ${item.id}`}>Edit</Button><Button size="sm" variant="outline-danger" disabled={saving} onClick={() => requestDelete({ kind: 'page_notes', item })} aria-label={`Delete note ${item.id}`}>Delete</Button></div></td>
                    </tr>)}
                    {section === 'reading_locations' && locations.map((item) => <tr key={item.id}>
                      <td className="text-break">{item.url}</td>
                      <td className="text-break" style={{ whiteSpace: 'pre-wrap' }}>{item.quote}</td>
                      <td className="text-break" style={{ whiteSpace: 'pre-wrap' }}>{item.prefix}</td>
                      <td className="text-break" style={{ whiteSpace: 'pre-wrap' }}>{item.suffix}</td>
                      <td>{new Date(item.created_at).toLocaleString()}</td>
                      <td><div className="d-flex gap-2"><Button size="sm" variant="outline-primary" disabled={saving} onClick={() => setEdit({ kind: 'reading_locations', item })} aria-label={`Edit reading location ${item.id}`}>Edit</Button><Button size="sm" variant="outline-danger" disabled={saving} onClick={() => requestDelete({ kind: 'reading_locations', item })} aria-label={`Delete reading location ${item.id}`}>Delete</Button></div></td>
                    </tr>)}
                  </tbody>
                </Table>
              )}
              <div className="d-flex align-items-center gap-3">
                <Button variant="outline-secondary" disabled={saving || page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
                <span>Page {page + 1} of {totalPages}</span>
                <Button variant="outline-secondary" disabled={saving || page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>

      <ConfirmDeleteModal
        show={pendingDelete !== null}
        message={deleteMessage}
        error={message?.type === 'danger' ? message.text : null}
        busy={saving}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => { if (pendingDelete) void deleteEntry(pendingDelete) }}
      />

      <Modal show={edit !== null} onHide={() => { if (!saving) setEdit(null) }} centered>
        <Form onSubmit={save}>
          <Modal.Header closeButton={!saving}><Modal.Title>Edit {edit ? labels[edit.kind].toLowerCase() : 'entry'}</Modal.Title></Modal.Header>
          <Modal.Body>
            {message?.type === 'danger' && <Alert variant="danger">{message.text}</Alert>}
            {edit?.kind === 'pages' && <>
              <Form.Group controlId="extension-page-url" className="mb-3">
                <Form.Label>URL</Form.Label>
                <Form.Control required value={edit.item.url} onChange={(event) => setEdit({ ...edit, item: { ...edit.item, url: event.target.value } })} />
                <Form.Text>Changing this URL does not change any reading location. The extension matches exact URLs.</Form.Text>
              </Form.Group>
              <Form.Check id="extension-page-read" className="mb-3" label="Read" checked={edit.item.is_read} onChange={(event) => setEdit({
                ...edit, item: { ...edit.item, is_read: event.target.checked, completed_at: event.target.checked ? localDate() : null },
              })} />
              {edit.item.is_read && <Form.Group controlId="extension-page-completed">
                <Form.Label>Completion date (optional)</Form.Label>
                <Form.Control type="date" value={edit.item.completed_at ?? ''} onChange={(event) => setEdit({ ...edit, item: { ...edit.item, completed_at: event.target.value || null } })} />
              </Form.Group>}
            </>}
            {edit?.kind === 'page_notes' && <Form.Group controlId="extension-note">
              <Form.Label>Note</Form.Label>
              <Form.Control as="textarea" rows={5} required value={edit.item.note} onChange={(event) => setEdit({ ...edit, item: { ...edit.item, note: event.target.value } })} />
            </Form.Group>}
            {edit?.kind === 'reading_locations' && <>
              <Form.Group controlId="extension-location-url" className="mb-3">
                <Form.Label>URL</Form.Label>
                <Form.Control required value={edit.item.url} onChange={(event) => setEdit({ ...edit, item: { ...edit.item, url: event.target.value } })} />
                <Form.Text>Changing this URL does not change any page. The extension matches exact URLs.</Form.Text>
              </Form.Group>
              {(['quote', 'prefix', 'suffix'] as const).map((field) => <Form.Group key={field} controlId={`extension-location-${field}`} className="mb-3">
                <Form.Label className="text-capitalize">{field}</Form.Label>
                <Form.Control as="textarea" rows={3} required={field === 'quote'} value={edit.item[field]} onChange={(event) => setEdit({ ...edit, item: { ...edit.item, [field]: event.target.value } })} />
              </Form.Group>)}
            </>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" disabled={saving} onClick={() => setEdit(null)}>Cancel</Button>
            <Button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  )
}

export default ExtensionData
