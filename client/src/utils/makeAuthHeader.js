/**
 * Helper fn for Axios - creates a proper auth header
 */
export default function makeAuthHeader() {
    return { Authorization: `Bearer ${localStorage.getItem('token')}` }
}