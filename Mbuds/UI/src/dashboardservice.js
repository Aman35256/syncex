const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\$/, '')

const apiEndpoints = {
    dashboard: `/moodbudsv1/:userid/dashboard`,
    bluetoothconnect: `moodbudsv1/:userid/connect`

}
async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: 'include',
        ...options,
    })

    const contentType = response.headers.get('content-type') || ''
    const payload = contentType.includes('application/json') ? await response.json()
        : { message: response.ok ? 'Success' : 'Something went wrong' }

    if (!response.ok) {
        throw new Error(payload.message || 'Something went wrong.Please try again')
    }
    return payload
}




