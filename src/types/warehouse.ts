export interface Building {
  id: string
  name: string
}

export interface Room {
  id: string
  building_id: string
  name: string
}

export interface WarehouseContainer {
  id: string
  building_id: string
  room_id: string
  name: string
  number: number
  type_id: string | null
}

export interface ContainerType {
  id: string
  name: string
}

export interface WarehouseItem {
  id: string
  name: string
  number: number | null
  quantity: number
  notes: string | null
  building_id: string
  room_id: string
  container_id: string
}
