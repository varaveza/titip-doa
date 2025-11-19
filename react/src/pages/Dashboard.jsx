import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { prayerService } from '../services/prayerService'

export default function Dashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [prayers, setPrayers] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [activeTab, setActiveTab] = useState('unread')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    loadPrayers()
  }, [user, activeTab])

  const loadPrayers = async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await prayerService.getPrayers(activeTab)
      setPrayers(data.prayers || [])
      setUnreadCount(data.unread_count || 0)
    } catch (error) {
      console.error('Error loading prayers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (prayerId) => {
    try {
      await prayerService.markAsRead(prayerId)
      loadPrayers()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const profileUrl = `${window.location.origin}/profile/${user?.username}`
  const whatsappMessage = `Assalamu'alaikum, saya sedang ibadah Umrah. Silakan titip doa melalui link ini: ${profileUrl}`

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('Link berhasil disalin!')
    }).catch(() => {
      alert('Gagal menyalin link. Silakan salin manual.')
    })
  }

  if (!user) return null

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      {/* Background Image */}
      <div 
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-0"
        style={{ backgroundImage: "url('https://samiratravel-cirebon.com/12.jpg')" }}
      ></div>
      
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-0 backdrop-blur-[2px]"></div>

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen p-3 sm:p-4 md:p-6 flex flex-col space-y-3 sm:space-y-4">
        {/* Share Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">Bagikan Link Profil Anda</h2>
            <div className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4 mb-3 sm:mb-4">
              <p className="text-xs text-emerald-200 uppercase tracking-wider mb-2">Link Profil Anda:</p>
              <p className="text-emerald-50 text-xs sm:text-sm break-all font-mono leading-relaxed">{profileUrl}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button
                onClick={() => copyToClipboard(profileUrl)}
                className="flex-1 px-4 py-2.5 sm:py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                </svg>
                Copy Link
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-4 py-2.5 sm:py-3 bg-[#25D366] hover:bg-[#20BA5A] text-white rounded-lg transition-colors text-xs sm:text-sm font-medium flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                Share via WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Prayer Checklist */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden flex-1 flex flex-col">
          <div className="pt-4 sm:pt-6 px-4 sm:px-6 pb-3 sm:pb-4 border-b border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Daftar Titipan Doa</h1>
                <p className="text-emerald-200 text-xs sm:text-sm">
                  {activeTab === 'unread' 
                    ? `Anda memiliki ${unreadCount} doa yang belum dibaca`
                    : 'Riwayat doa yang sudah dibaca'}
                </p>
              </div>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-xs sm:text-sm"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10">
            <button
              onClick={() => setActiveTab('unread')}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold transition-colors text-xs sm:text-sm ${
                activeTab === 'unread' 
                  ? 'bg-emerald-600/30 text-white border-b-2 border-emerald-400' 
                  : 'text-emerald-200 hover:bg-white/5'
              }`}
            >
              Belum Dibaca
              {unreadCount > 0 && activeTab === 'unread' && (
                <span className="ml-1 sm:ml-2 bg-emerald-500 text-white text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('read')}
              className={`flex-1 px-3 sm:px-6 py-3 sm:py-4 text-center font-semibold transition-colors text-xs sm:text-sm ${
                activeTab === 'read' 
                  ? 'bg-emerald-600/30 text-white border-b-2 border-emerald-400' 
                  : 'text-emerald-200 hover:bg-white/5'
              }`}
            >
              Sudah Dibaca
            </button>
          </div>

          {/* Prayer List */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 350px)', minHeight: '200px' }}>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-emerald-100">Memuat...</p>
              </div>
            ) : prayers.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">📿</div>
                <p className="text-emerald-100 text-base sm:text-lg">
                  {activeTab === 'read' ? 'Belum ada doa yang sudah dibaca' : 'Belum ada doa yang dititipkan'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {prayers.map((prayer) => (
                  <div key={prayer.id} className="bg-white/5 border border-white/10 rounded-lg sm:rounded-xl p-4 sm:p-5 backdrop-blur-sm">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <h3 className="font-semibold text-white text-sm sm:text-base">{prayer.sender_name}</h3>
                          {!prayer.is_read && (
                            <span className="bg-emerald-500/30 text-emerald-100 text-xs px-2 py-0.5 sm:py-1 rounded-full font-medium whitespace-nowrap">
                              Baru
                            </span>
                          )}
                        </div>
                        <p className="text-emerald-50 leading-relaxed whitespace-pre-wrap text-sm sm:text-base break-words">
                          {prayer.message}
                        </p>
                        <p className="text-xs text-emerald-200/60 mt-2 sm:mt-3">
                          {new Date(prayer.created_at).toLocaleString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    {!prayer.is_read ? (
                      <button
                        onClick={() => handleMarkAsRead(prayer.id)}
                        className="w-full px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-lg transition-colors text-sm sm:text-base font-medium"
                      >
                        Selesai / Amiin
                      </button>
                    ) : (
                      <div className="mt-3 sm:mt-4">
                        <span className="px-4 py-2.5 sm:py-3 bg-white/10 text-emerald-200 rounded-lg text-sm sm:text-base font-medium inline-block w-full text-center">
                          ✓ Sudah Dibaca
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

