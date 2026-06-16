'use client'
export default function ReportsPage() {
  return (
    <div>
      <div className="mb-6"><h2 className="text-lg font-bold" style={{color:'#14120E'}}>Reports & Analytics</h2></div>
      <div className="bg-white rounded-xl border p-10 text-center" style={{borderColor:'#DDD0B0'}}>
        <div className="text-4xl mb-4">📊</div>
        <p className="font-semibold text-sm" style={{color:'#5C4D2A'}}>State-wise, Branch-wise, Edition-wise reports</p>
        <p className="text-xs mt-2" style={{color:'#8C7A50'}}>Add video entries and connect YouTube API to generate reports</p>
      </div>
    </div>
  )
}
