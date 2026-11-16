import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../supabase'
import type { Building, ContainerType, Room, WarehouseContainer, WarehouseItem } from '../types/warehouse'

const PAGE_SIZE = 25
const LIST_PAGE_SIZE = 500
type ListTable = 'warehouse_buildings' | 'warehouse_rooms' | 'warehouse_containers' | 'warehouse_container_types'
type Table = ListTable | 'warehouse_items'
type Values = Record<string, string | number | null>

interface Filters {
  search: string
  buildingId: string
  roomId: string
  containerId: string
  page: number
}

async function loadList<T>(table: ListTable, userId: string): Promise<T[]> {
  const result: T[] = []
  for (let offset = 0; ; offset += LIST_PAGE_SIZE) {
    const { data, error } = await supabase.from(table).select('*').eq('user_id', userId)
      .order('id').range(offset, offset + LIST_PAGE_SIZE - 1)
    if (error) throw error
    result.push(...(data as T[]))
    if (data.length < LIST_PAGE_SIZE) return result
  }
}

export function useWarehouse(userId: string, filters: Filters) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [containers, setContainers] = useState<WarehouseContainer[]>([])
  const [containerTypes, setContainerTypes] = useState<ContainerType[]>([])
  const [items, setItems] = useState<WarehouseItem[]>([])
  const [count, setCount] = useState(0)
  const [loadedListKey, setLoadedListKey] = useState('')
  const [loadedItemKey, setLoadedItemKey] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [listRevision, setListRevision] = useState(0)
  const [itemRevision, setItemRevision] = useState(0)

  const listKey = JSON.stringify([userId, listRevision])
  useEffect(() => {
    let active = true
    Promise.all([
      loadList<Building>('warehouse_buildings', userId),
      loadList<Room>('warehouse_rooms', userId),
      loadList<WarehouseContainer>('warehouse_containers', userId),
      loadList<ContainerType>('warehouse_container_types', userId),
    ]).then(([nextBuildings, nextRooms, nextContainers, nextTypes]) => {
      if (!active) return
      setBuildings(nextBuildings.sort((a, b) => a.name.localeCompare(b.name)))
      setRooms(nextRooms.sort((a, b) => a.name.localeCompare(b.name)))
      setContainers(nextContainers.sort((a, b) => a.number - b.number))
      setContainerTypes(nextTypes.sort((a, b) => a.name.localeCompare(b.name)))
    }).catch((reason: unknown) => {
      if (active) {
        const detail = typeof reason === 'object' && reason !== null && 'message' in reason
          ? String(reason.message) : String(reason)
        setError(`Failed to load locations: ${detail}`)
      }
    }).finally(() => {
      if (active) setLoadedListKey(listKey)
    })
    return () => { active = false }
  }, [userId, listKey])

  const { search, buildingId, roomId, containerId, page } = filters
  const itemKey = JSON.stringify([userId, search, buildingId, roomId, containerId, page, itemRevision])
  useEffect(() => {
    let active = true
    let query = supabase.from('warehouse_items').select('*', { count: 'exact' }).eq('user_id', userId)
    if (search.trim()) query = query.ilike('name', `%${search.trim().replace(/[\\%_]/g, '\\$&')}%`)
    if (buildingId) query = query.eq('building_id', buildingId)
    if (roomId) query = query.eq('room_id', roomId)
    if (containerId) query = query.eq('container_id', containerId)
    query.order('name').order('id').range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1)
      .then(({ data, error: queryError, count: nextCount }) => {
        if (!active) return
        if (queryError || nextCount === null) {
          setError(`Failed to load inventory: ${queryError?.message ?? 'The server did not return a result count.'}`)
          setItems([])
          setCount(0)
        } else {
          setItems(data ?? [])
          setCount(nextCount)
        }
        setLoadedItemKey(itemKey)
      })
    return () => { active = false }
  }, [userId, search, buildingId, roomId, containerId, page, itemKey])

  const mutate = useCallback(async (table: Table, operation: 'insert' | 'update' | 'delete', values: Values, id?: string) => {
    setSaving(true)
    setError(null)
    const base = supabase.from(table)
    const query = operation === 'insert'
      ? base.insert({ ...values, user_id: userId })
      : operation === 'update'
        ? base.update(values).eq('id', id ?? '').eq('user_id', userId)
        : base.delete().eq('id', id ?? '').eq('user_id', userId)
    const { error: mutationError } = await query.select('id').single()
    setSaving(false)
    if (mutationError) {
      const detail = mutationError.code === '23503'
        ? 'This location or container type is still in use. Remove or reassign its dependent records first.'
        : mutationError.code === '23505' && table === 'warehouse_containers' && mutationError.message.includes('name')
          ? 'A container with this name already exists. Choose a different name.'
          : mutationError.message
      setError(`Could not ${operation} ${table.replace('warehouse_', '')}: ${detail}`)
      return false
    }
    if (table !== 'warehouse_items') setListRevision((value) => value + 1)
    if (table === 'warehouse_items' || (operation === 'update' && (table === 'warehouse_rooms' || table === 'warehouse_containers'))) {
      setItemRevision((value) => value + 1)
    }
    return true
  }, [userId])

  return {
    buildings, rooms, containers, containerTypes, items, count, pageSize: PAGE_SIZE,
    loadingLists: loadedListKey !== listKey, loadingItems: loadedItemKey !== itemKey,
    saving, error, setError, mutate,
  }
}
