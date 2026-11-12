import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import Alert from 'react-bootstrap/Alert'
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import ListGroup from 'react-bootstrap/ListGroup'
import Modal from 'react-bootstrap/Modal'
import Row from 'react-bootstrap/Row'
import Spinner from 'react-bootstrap/Spinner'
import Table from 'react-bootstrap/Table'
import { useAuth } from '../AuthContext'
import type { Building, ContainerType, Room, WarehouseContainer, WarehouseItem } from '../types/warehouse'
import { useWarehouse } from './useWarehouse'

interface Location {
  buildingId: string
  roomId: string
  containerId: string
}

const emptyLocation: Location = { buildingId: '', roomId: '', containerId: '' }

type EditLocation =
  | { kind: 'building'; id: string; name: string }
  | { kind: 'type'; id: string; name: string }
  | { kind: 'room'; id: string; name: string; buildingId: string; originalBuildingId: string }
  | { kind: 'container'; id: string; number: string; typeId: string; buildingId: string; roomId: string; originalBuildingId: string; originalRoomId: string }

interface LocationFieldsProps {
  prefix: string
  location: Location
  onChange: (location: Location) => void
  buildings: Building[]
  rooms: Room[]
  containers: WarehouseContainer[]
  containerTypes: ContainerType[]
  required?: boolean
}

function LocationFields({ prefix, location, onChange, buildings, rooms, containers, containerTypes, required = false }: LocationFieldsProps) {
  return (
    <>
      <Col md={4}>
        <Form.Group controlId={`${prefix}-building`}>
          <Form.Label>Building</Form.Label>
          <Form.Select value={location.buildingId} required={required} onChange={(e) => onChange({ buildingId: e.target.value, roomId: '', containerId: '' })}>
            <option value="">{required ? 'Select a building' : 'All buildings'}</option>
            {buildings.map((building) => <option key={building.id} value={building.id}>{building.name}</option>)}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId={`${prefix}-room`}>
          <Form.Label>Room</Form.Label>
          <Form.Select value={location.roomId} required={required} disabled={!location.buildingId} onChange={(e) => onChange({ ...location, roomId: e.target.value, containerId: '' })}>
            <option value="">{required ? 'Select a room' : 'All rooms'}</option>
            {rooms.filter((room) => room.building_id === location.buildingId).map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
          </Form.Select>
        </Form.Group>
      </Col>
      <Col md={4}>
        <Form.Group controlId={`${prefix}-container`}>
          <Form.Label>Container</Form.Label>
          <Form.Select value={location.containerId} required={required} disabled={!location.roomId} onChange={(e) => onChange({ ...location, containerId: e.target.value })}>
            <option value="">{required ? 'Select a container' : 'All containers'}</option>
            {containers.filter((container) => container.room_id === location.roomId).map((container) => <option key={container.id} value={container.id}>#{container.number} - {containerTypes.find((type) => type.id === container.type_id)?.name ?? 'Type not assigned'}</option>)}
          </Form.Select>
        </Form.Group>
      </Col>
    </>
  )
}

function Warehouse() {
  const { session } = useAuth()
  const userId = session?.user.id ?? ''
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filterLocation, setFilterLocation] = useState<Location>(emptyLocation)
  const [page, setPage] = useState(0)
  const [formLocation, setFormLocation] = useState<Location>(emptyLocation)
  const [manageBuilding, setManageBuilding] = useState('')
  const [manageRoom, setManageRoom] = useState('')
  const [buildingName, setBuildingName] = useState('')
  const [roomName, setRoomName] = useState('')
  const [containerNumber, setContainerNumber] = useState('')
  const [newTypeName, setNewTypeName] = useState('')
  const [newContainerType, setNewContainerType] = useState('')
  const [itemName, setItemName] = useState('')
  const [quantity, setQuantity] = useState('1')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLocation, setEditLocation] = useState<EditLocation | null>(null)

  const warehouse = useWarehouse(userId, { search: debouncedSearch, ...filterLocation, page })
  const { buildings, rooms, containers, containerTypes, items, count, pageSize, loadingLists, loadingItems, saving, error, setError, mutate } = warehouse

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  function resetItemForm() {
    setEditingId(null)
    setItemName('')
    setQuantity('1')
    setFormLocation(emptyLocation)
  }

  async function saveItem(e: FormEvent) {
    e.preventDefault()
    if (!itemName.trim()) {
      setError('Enter an item name.')
      return
    }
    if (!formLocation.buildingId || !formLocation.roomId || !formLocation.containerId) {
      setError('Select a building, room, and container.')
      return
    }
    const success = await mutate('warehouse_items', editingId ? 'update' : 'insert', {
      name: itemName.trim(), quantity: Number(quantity),
      building_id: formLocation.buildingId, room_id: formLocation.roomId, container_id: formLocation.containerId,
    }, editingId ?? undefined)
    if (success) {
      resetItemForm()
      setPage(0)
    }
  }

  function editItem(item: WarehouseItem) {
    setEditingId(item.id)
    setItemName(item.name)
    setQuantity(String(item.quantity))
    setFormLocation({ buildingId: item.building_id, roomId: item.room_id, containerId: item.container_id })
    document.getElementById('warehouse-item-form')?.scrollIntoView({ behavior: 'smooth' })
  }

  async function deleteItem(item: WarehouseItem) {
    if (!window.confirm(`Delete "${item.name}" from the inventory?`)) return
    if (await mutate('warehouse_items', 'delete', {}, item.id)) {
      if (editingId === item.id) resetItemForm()
      if (page > 0 && items.length === 1) setPage(page - 1)
    }
  }

  async function addLocation(e: FormEvent, kind: 'building' | 'room' | 'container') {
    e.preventDefault()
    if (kind === 'building') {
      if (!buildingName.trim()) { setError('Enter a building name.'); return }
      if (await mutate('warehouse_buildings', 'insert', { name: buildingName.trim() })) setBuildingName('')
    } else if (kind === 'room') {
      if (!roomName.trim() || !manageBuilding) { setError('Select a building and enter a room name.'); return }
      if (await mutate('warehouse_rooms', 'insert', { name: roomName.trim(), building_id: manageBuilding })) setRoomName('')
    } else {
      if (!manageBuilding || !manageRoom || containerNumber === '' || !newContainerType) { setError('Select a building, room, and container type and enter a container number.'); return }
      if (await mutate('warehouse_containers', 'insert', { number: Number(containerNumber), building_id: manageBuilding, room_id: manageRoom, type_id: newContainerType })) setContainerNumber('')
    }
  }

  async function addContainerType(e: FormEvent) {
    e.preventDefault()
    if (!newTypeName.trim()) { setError('Enter a container type name.'); return }
    if (await mutate('warehouse_container_types', 'insert', { name: newTypeName.trim() })) setNewTypeName('')
  }

  async function deleteContainerType(type: ContainerType) {
    if (!window.confirm(`Delete container type "${type.name}"? Types in use cannot be deleted.`)) return
    if (await mutate('warehouse_container_types', 'delete', {}, type.id) && newContainerType === type.id) setNewContainerType('')
  }

  async function deleteLocation(kind: 'building' | 'room' | 'container', id: string, label: string) {
    if (!window.confirm(`Delete ${label}? Locations in use cannot be deleted.`)) return
    const table = kind === 'building' ? 'warehouse_buildings' : kind === 'room' ? 'warehouse_rooms' : 'warehouse_containers'
    if (await mutate(table, 'delete', {}, id)) {
      if (kind === 'building' && manageBuilding === id) { setManageBuilding(''); setManageRoom('') }
      if (kind === 'room' && manageRoom === id) setManageRoom('')
      if (Object.values(filterLocation).includes(id)) { setFilterLocation(emptyLocation); setPage(0) }
      if (Object.values(formLocation).includes(id)) setFormLocation(emptyLocation)
    }
  }

  async function saveLocationEdit(e: FormEvent) {
    e.preventDefault()
    if (!editLocation) return
    const edit = editLocation
    let success: boolean
    if (edit.kind === 'building' || edit.kind === 'type') {
      if (!edit.name.trim()) { setError('Enter a name.'); return }
      success = await mutate(edit.kind === 'building' ? 'warehouse_buildings' : 'warehouse_container_types', 'update', { name: edit.name.trim() }, edit.id)
    } else if (edit.kind === 'room') {
      if (!edit.name.trim() || !edit.buildingId) { setError('Enter a room name and select a building.'); return }
      success = await mutate('warehouse_rooms', 'update', { name: edit.name.trim(), building_id: edit.buildingId }, edit.id)
    } else {
      if (edit.number === '' || !edit.buildingId || !edit.roomId || !edit.typeId) {
        setError('Enter a container number and select its type, building, and room.')
        return
      }
      success = await mutate('warehouse_containers', 'update', {
        number: Number(edit.number), type_id: edit.typeId, building_id: edit.buildingId, room_id: edit.roomId,
      }, edit.id)
    }
    if (!success) return
    const moved = (edit.kind === 'room' && edit.buildingId !== edit.originalBuildingId)
      || (edit.kind === 'container' && (edit.buildingId !== edit.originalBuildingId || edit.roomId !== edit.originalRoomId))
    if (moved) {
      setFilterLocation(emptyLocation)
      setPage(0)
      if (edit.kind === 'room' && manageRoom === edit.id) setManageRoom('')
      if (edit.kind === 'room' && formLocation.roomId === edit.id) {
        setFormLocation({ ...formLocation, buildingId: edit.buildingId })
      }
      if (edit.kind === 'container' && formLocation.containerId === edit.id) {
        setFormLocation({ ...formLocation, buildingId: edit.buildingId, roomId: edit.roomId })
      }
    }
    setEditLocation(null)
  }

  const names = {
    building: new Map(buildings.map((building) => [building.id, building.name])),
    room: new Map(rooms.map((room) => [room.id, room.name])),
    container: new Map(containers.map((container) => [container.id, container])),
    type: new Map(containerTypes.map((type) => [type.id, type.name])),
  }
  const totalPages = Math.max(1, Math.ceil(count / pageSize))
  const untypedCount = containers.filter((container) => !container.type_id).length

  return (
    <div className="my-4">
      <h1 className="mb-4 text-center">Warehouse</h1>
      {error && <Alert variant="danger" dismissible onClose={() => setError(null)}>{error}</Alert>}

      <Card className="shadow-sm mb-4">
        <Card.Header><h2 className="h5 mb-0">Container types</h2></Card.Header>
        <Card.Body>
          <Form onSubmit={addContainerType} className="d-flex gap-2 mb-2">
            <Form.Control aria-label="New container type" placeholder="Container type name" maxLength={200} required value={newTypeName} onChange={(e) => setNewTypeName(e.target.value)} />
            <Button type="submit" disabled={saving || loadingLists}>Add</Button>
          </Form>
          <ListGroup className="warehouse-location-list">
            {containerTypes.map((type) => <ListGroup.Item key={type.id} className="d-flex justify-content-between align-items-center gap-2"><span className="text-break">{type.name}</span><div className="d-flex gap-2"><Button variant="outline-primary" size="sm" disabled={saving} onClick={() => setEditLocation({ kind: 'type', id: type.id, name: type.name })} aria-label={`Edit container type ${type.name}`}>Edit</Button><Button variant="outline-danger" size="sm" disabled={saving} onClick={() => deleteContainerType(type)} aria-label={`Delete container type ${type.name}`}>Delete</Button></div></ListGroup.Item>)}
          </ListGroup>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Header><h2 className="h5 mb-0">Manage locations</h2></Card.Header>
        <Card.Body>
          <p className="text-secondary">Create a building, then a room in that building, then a numbered container in the room. Locations in use cannot be deleted.</p>
          {untypedCount > 0 && <Alert variant="warning">{untypedCount} {untypedCount === 1 ? 'container needs' : 'containers need'} a type. Select each building and room below to assign one.</Alert>}
          {loadingLists && <p><Spinner animation="border" size="sm" role="status" /> Loading locations...</p>}
          <Row className="g-4">
            <Col lg={4}>
              <h3 className="h6">Buildings</h3>
              <Form onSubmit={(e) => addLocation(e, 'building')} className="d-flex gap-2 mb-2">
                <Form.Control aria-label="New building name" placeholder="Building name" maxLength={200} required value={buildingName} onChange={(e) => setBuildingName(e.target.value)} />
                <Button type="submit" disabled={saving || loadingLists}>Add</Button>
              </Form>
              <ListGroup className="warehouse-location-list">
                {buildings.map((building) => <ListGroup.Item key={building.id} className="d-flex justify-content-between align-items-center gap-2"><span className="text-break">{building.name}</span><div className="d-flex gap-2"><Button variant="outline-primary" size="sm" disabled={saving} onClick={() => setEditLocation({ kind: 'building', id: building.id, name: building.name })} aria-label={`Edit building ${building.name}`}>Edit</Button><Button variant="outline-danger" size="sm" disabled={saving} onClick={() => deleteLocation('building', building.id, `building "${building.name}"`)} aria-label={`Delete building ${building.name}`}>Delete</Button></div></ListGroup.Item>)}
              </ListGroup>
            </Col>
            <Col lg={4}>
              <h3 className="h6">Rooms</h3>
              <Form.Select aria-label="Building for room management" className="mb-2" value={manageBuilding} onChange={(e) => { setManageBuilding(e.target.value); setManageRoom('') }}>
                <option value="">Select a building</option>
                {buildings.map((building) => <option key={building.id} value={building.id}>{building.name}</option>)}
              </Form.Select>
              <Form onSubmit={(e) => addLocation(e, 'room')} className="d-flex gap-2 mb-2">
                <Form.Control aria-label="New room name" placeholder="Room name" maxLength={200} required value={roomName} onChange={(e) => setRoomName(e.target.value)} />
                <Button type="submit" disabled={saving || loadingLists || !manageBuilding}>Add</Button>
              </Form>
              <ListGroup className="warehouse-location-list">
                {rooms.filter((room) => room.building_id === manageBuilding).map((room) => <ListGroup.Item key={room.id} className="d-flex justify-content-between align-items-center gap-2"><span className="text-break">{room.name}</span><div className="d-flex gap-2"><Button variant="outline-primary" size="sm" disabled={saving} onClick={() => setEditLocation({ kind: 'room', id: room.id, name: room.name, buildingId: room.building_id, originalBuildingId: room.building_id })} aria-label={`Edit room ${room.name}`}>Edit</Button><Button variant="outline-danger" size="sm" disabled={saving} onClick={() => deleteLocation('room', room.id, `room "${room.name}"`)} aria-label={`Delete room ${room.name}`}>Delete</Button></div></ListGroup.Item>)}
              </ListGroup>
            </Col>
            <Col lg={4}>
              <h3 className="h6">Containers</h3>
              <Form.Select aria-label="Room for container management" className="mb-2" value={manageRoom} disabled={!manageBuilding} onChange={(e) => setManageRoom(e.target.value)}>
                <option value="">Select a room</option>
                {rooms.filter((room) => room.building_id === manageBuilding).map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
              </Form.Select>
              <Form onSubmit={(e) => addLocation(e, 'container')} className="mb-2">
                <Form.Select aria-label="New container type" className="mb-2" required value={newContainerType} onChange={(e) => setNewContainerType(e.target.value)}>
                  <option value="">Select a container type</option>
                  {containerTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                </Form.Select>
                <div className="d-flex gap-2">
                  <Form.Control aria-label="New container number" type="number" placeholder="Container number" min={0} max={2147483647} step={1} required value={containerNumber} onChange={(e) => setContainerNumber(e.target.value)} />
                  <Button type="submit" disabled={saving || loadingLists || !manageRoom}>Add</Button>
                </div>
              </Form>
              <ListGroup className="warehouse-location-list">
                {containers.filter((container) => container.room_id === manageRoom).map((container) => <ListGroup.Item key={container.id}>
                  <div className="d-flex justify-content-between align-items-center gap-2 mb-2">
                    <span>#{container.number}{!container.type_id && <span className="text-danger"> - Type required</span>}</span>
                    <div className="d-flex gap-2"><Button variant="outline-primary" size="sm" disabled={saving} onClick={() => setEditLocation({ kind: 'container', id: container.id, number: String(container.number), typeId: container.type_id ?? '', buildingId: container.building_id, roomId: container.room_id, originalBuildingId: container.building_id, originalRoomId: container.room_id })} aria-label={`Edit container ${container.number}`}>Edit</Button><Button variant="outline-danger" size="sm" disabled={saving} onClick={() => deleteLocation('container', container.id, `container #${container.number}`)} aria-label={`Delete container ${container.number}`}>Delete</Button></div>
                  </div>
                  <Form.Select aria-label={`Type for container ${container.number}`} value={container.type_id ?? ''} disabled={saving || loadingLists} onChange={(e) => { if (e.target.value) void mutate('warehouse_containers', 'update', { type_id: e.target.value }, container.id) }}>
                    <option value="" disabled>Select a type</option>
                    {containerTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                  </Form.Select>
                </ListGroup.Item>)}
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Modal show={editLocation !== null} onHide={() => { if (!saving) setEditLocation(null) }} centered>
        <Form onSubmit={saveLocationEdit}>
          <Modal.Header closeButton={!saving}>
            <Modal.Title>Edit {editLocation?.kind === 'type' ? 'container type' : editLocation?.kind}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {error && <Alert variant="danger">{error}</Alert>}
            {editLocation && editLocation.kind !== 'container' && (
              <Form.Group controlId="edit-location-name" className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control required maxLength={200} value={editLocation.name} onChange={(e) => setEditLocation({ ...editLocation, name: e.target.value })} />
              </Form.Group>
            )}
            {editLocation?.kind === 'container' && (
              <>
                <Form.Group controlId="edit-container-number" className="mb-3">
                  <Form.Label>Container number</Form.Label>
                  <Form.Control type="number" min={0} max={2147483647} step={1} required value={editLocation.number} onChange={(e) => setEditLocation({ ...editLocation, number: e.target.value })} />
                </Form.Group>
                <Form.Group controlId="edit-container-type" className="mb-3">
                  <Form.Label>Type</Form.Label>
                  <Form.Select required value={editLocation.typeId} onChange={(e) => setEditLocation({ ...editLocation, typeId: e.target.value })}>
                    <option value="">Select a type</option>
                    {containerTypes.map((type) => <option key={type.id} value={type.id}>{type.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </>
            )}
            {editLocation && (editLocation.kind === 'room' || editLocation.kind === 'container') && (
              <Form.Group controlId="edit-location-building" className="mb-3">
                <Form.Label>Building</Form.Label>
                <Form.Select required value={editLocation.buildingId} onChange={(e) => setEditLocation(editLocation.kind === 'container' ? { ...editLocation, buildingId: e.target.value, roomId: '' } : { ...editLocation, buildingId: e.target.value })}>
                  <option value="">Select a building</option>
                  {buildings.map((building) => <option key={building.id} value={building.id}>{building.name}</option>)}
                </Form.Select>
              </Form.Group>
            )}
            {editLocation?.kind === 'container' && (
              <Form.Group controlId="edit-container-room" className="mb-3">
                <Form.Label>Room</Form.Label>
                <Form.Select required disabled={!editLocation.buildingId} value={editLocation.roomId} onChange={(e) => setEditLocation({ ...editLocation, roomId: e.target.value })}>
                  <option value="">Select a room</option>
                  {rooms.filter((room) => room.building_id === editLocation.buildingId).map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
                </Form.Select>
              </Form.Group>
            )}
            {(editLocation?.kind === 'room' || editLocation?.kind === 'container') && <p className="text-secondary mb-0">Moving this location also moves everything inside it.</p>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="outline-secondary" disabled={saving} onClick={() => setEditLocation(null)}>Cancel</Button>
            <Button type="submit" disabled={saving || loadingLists}>Save changes</Button>
          </Modal.Footer>
        </Form>
      </Modal>

      <Card id="warehouse-item-form" className="shadow-sm mb-4">
        <Card.Header><h2 className="h5 mb-0">{editingId ? 'Edit item' : 'Add item'}</h2></Card.Header>
        <Card.Body>
          <Form onSubmit={saveItem}>
            <Row className="g-3">
              <Col md={8}><Form.Group controlId="warehouse-name"><Form.Label>Item name</Form.Label><Form.Control required maxLength={200} value={itemName} onChange={(e) => setItemName(e.target.value)} /></Form.Group></Col>
              <Col md={4}><Form.Group controlId="warehouse-quantity"><Form.Label>Quantity</Form.Label><Form.Control type="number" required min={0} max={2147483647} step={1} value={quantity} onChange={(e) => setQuantity(e.target.value)} /></Form.Group></Col>
              <LocationFields prefix="item" location={formLocation} onChange={setFormLocation} buildings={buildings} rooms={rooms} containers={containers} containerTypes={containerTypes} required />
            </Row>
            <div className="d-flex gap-2 mt-3">
              <Button type="submit" disabled={saving || loadingLists}>{editingId ? 'Save changes' : 'Add item'}</Button>
              {editingId && <Button variant="outline-secondary" onClick={resetItemForm} disabled={saving}>Cancel editing</Button>}
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Card className="shadow-sm mb-4">
        <Card.Header><h2 className="h5 mb-0">Inventory</h2></Card.Header>
        <Card.Body>
          <Row className="g-3 mb-3">
            <Col xs={12}><Form.Group controlId="warehouse-search"><Form.Label>Search item names</Form.Label><Form.Control type="search" value={search} onChange={(e) => { setSearch(e.target.value); setPage(0) }} placeholder="Search inventory" /></Form.Group></Col>
            <LocationFields prefix="filter" location={filterLocation} onChange={(location) => { setFilterLocation(location); setPage(0) }} buildings={buildings} rooms={rooms} containers={containers} containerTypes={containerTypes} />
          </Row>
          {loadingItems ? <p><Spinner animation="border" size="sm" role="status" /> Loading inventory...</p> : (
            <>
              <p className="text-secondary">{count} {count === 1 ? 'item' : 'items'} found</p>
              {items.length === 0 ? <p>No items match these filters.</p> : (
                <Table responsive striped hover>
                  <thead><tr><th>Item</th><th>Quantity</th><th>Building</th><th>Room</th><th>Container</th><th>Actions</th></tr></thead>
                  <tbody>{items.map((item) => <tr key={item.id}>
                    <td className="text-break">{item.name}</td><td>{item.quantity}</td>
                    <td>{names.building.get(item.building_id) ?? 'Unavailable'}</td>
                    <td>{names.room.get(item.room_id) ?? 'Unavailable'}</td>
                    <td>{(() => { const container = names.container.get(item.container_id); return container ? `#${container.number} - ${container.type_id ? names.type.get(container.type_id) ?? 'Unavailable' : 'Type not assigned'}` : 'Unavailable' })()}</td>
                    <td><div className="d-flex gap-2"><Button variant="outline-primary" size="sm" disabled={saving} onClick={() => editItem(item)} aria-label={`Edit ${item.name}`}>Edit</Button><Button variant="outline-danger" size="sm" disabled={saving} onClick={() => deleteItem(item)} aria-label={`Delete ${item.name}`}>Delete</Button></div></td>
                  </tr>)}</tbody>
                </Table>
              )}
              <div className="d-flex align-items-center gap-3">
                <Button variant="outline-secondary" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</Button>
                <span>Page {page + 1} of {totalPages}</span>
                <Button variant="outline-secondary" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</Button>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  )
}

export default Warehouse
