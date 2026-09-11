import { useEffect, useState } from 'react'
import { supabase } from '../supabase'

type TestString = {
  id: number
  value: string
}

function Supabase() {
  const [strings, setStrings] = useState<TestString[]>([])

  useEffect(() => {
    async function loadStrings() {
      const { data, error } = await supabase.from('test_strings').select('id, value')

      if (error) {
        console.error(error)
        return
      }

      setStrings(data)
    }

    loadStrings()
  }, [])

  return (
    <div>
      <h1>Supabase Test</h1>

      {strings.map((item) => (
        <p key={item.id}>{item.value}</p>
      ))}
    </div>
  )
}

export default Supabase
