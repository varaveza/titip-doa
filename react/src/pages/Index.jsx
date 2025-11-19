import { Link } from 'react-router-dom'

export default function Index() {
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
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-xl sm:rounded-2xl shadow-2xl overflow-hidden transition-all">
          <div className="pt-6 sm:pt-8 px-4 sm:px-6 pb-6 sm:pb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              Titip Doa Tanah Suci
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed px-2">
              Silakan minta link khusus kepada kerabat Anda yang berangkat Umrah untuk menitipkan doa.
            </p>
          </div>
        </div>
        
        <div className="mt-4 sm:mt-6 text-center">
          <p className="text-xs text-emerald-100/40">Dibuat dengan tulus untuk para tamu Allah</p>
        </div>
      </div>
    </div>
  )
}

