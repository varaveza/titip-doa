import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(username, password)
      navigate('/dashboard')
    } catch (err) {
      setError('Username atau password salah!')
    } finally {
      setLoading(false)
    }
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
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">Masuk ke Akun</h1>
          </div>

          <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="username" className="block text-xs font-medium text-emerald-200 uppercase tracking-wider mb-1.5 ml-1">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Masukkan username"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-black/50 transition-all"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-xs font-medium text-emerald-200 uppercase tracking-wider mb-1.5 ml-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:bg-black/50 transition-all"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-50 text-white font-bold py-3 sm:py-4 rounded-xl shadow-lg shadow-emerald-900/20 transform active:scale-[0.98] transition-all duration-200 text-sm sm:text-base"
              >
                {loading ? 'Memproses...' : 'Masuk'}
              </button>
            </form>

            <div className="text-center">
              <Link to="/register" className="text-emerald-200 text-xs sm:text-sm hover:text-white underline">
                Belum punya akun? Daftar
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 text-center">
          <Link to="/" className="text-xs text-emerald-100/40 hover:text-emerald-100">
            ← Kembali ke halaman utama
          </Link>
        </div>
      </div>
    </div>
  )
}

