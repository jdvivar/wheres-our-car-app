const endpoint = '/api/cars'

async function getCars () {
  const response = await window.fetch(endpoint)
  if (response.status !== 200) {
    return []
  }
  const data = await response.json()
  return data
}

async function createCar (name) {
  await window.fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify({ name })
  })
}

async function removeCar (id) {
  await window.fetch(endpoint, {
    method: 'DELETE',
    body: JSON.stringify({ id })
  })
}

async function renameCar ({ id, name }) {
  await window.fetch(endpoint, {
    method: 'PATCH',
    body: JSON.stringify({ id, name })
  })
}

export {
  getCars,
  createCar,
  removeCar,
  renameCar
}
