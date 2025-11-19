import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { prayerService } from '../services/prayerService'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export default function Profile() {
  const { username } = useParams()
  const [user, setUser] = useState(null)
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadUser()
  }, [username])

  const loadUser = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/user/${username}`, {
        withCredentials: true
      })
      setUser(response.data)
    } catch (error) {
      setError('User tidak ditemukan!')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!senderName.trim() || !message.trim()) {
      setError('Nama pengirim dan isi doa harus diisi!')
      return
    }

    if (!user) {
      setError('User tidak ditemukan!')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      await prayerService.submitPrayer(user.id, senderName, message)
      setSuccess(true)
      setSenderName('')
      setMessage('')
    } catch (error) {
      setError('Terjadi kesalahan saat menyimpan doa')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden">
        <div className="text-white">Memuat...</div>
      </div>
    )
  }

  if (error && !user) {
    return (
      <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden">
        <div className="text-white">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('https://samiratravel-cirebon.com/12.jpg')" }}
      ></div>
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-0 backdrop-blur-[2px]"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-md flex flex-col px-4">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="pt-6 sm:pt-8 px-4 sm:px-6 pb-2 text-center">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Titip Doa Tanah Suci</h1>
            {user && (
              <p className="text-emerald-200 text-xs sm:text-sm mt-2">Untuk: {user.full_name}</p>
            )}
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            {success ? (
              <div className="py-8 flex flex-col items-center justify-center text-center">
                <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.4)]">
                  <svg className="text-white w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Alhamdulillah</h3>
                <p className="text-emerald-100 text-sm leading-relaxed max-w-[240px] mx-auto">
                  Doamu telah tersimpan. InsyaAllah akan tersampaikan di tempat mustajab ini.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-8 px-6 py-2 bg-white/10 hover:bg-white/20 rounded-full text-sm text-emerald-200 hover:text-white transition-colors"
                >
                  Kirim doa lagi
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="sender_name" className="block text-xs font-medium text-emerald-200 uppercase tracking-wider mb-1.5 ml-1">
                    Nama Pengirim
                  </label>
                  <input
                    type="text"
                    id="sender_name"
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="Contoh: Ardan"
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-black/50 transition-all"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-xs font-medium text-emerald-200 uppercase tracking-wider mb-1.5 ml-1">
                    Isi Doa
                  </label>
                  <textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows="5"
                    placeholder="Tuliskan harapan dan doamu disini..."
                    className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-black/50 transition-all resize-none"
                    required
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg shadow-emerald-900/20 transform active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  {submitting ? 'Mengirim...' : (
                    <>
                      <span>Titipkan Doa</span>
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-emerald-100/40">Dibuat dengan tulus untuk para tamu Allah</p>
        </div>
      </div>
    </div>
  )
}

