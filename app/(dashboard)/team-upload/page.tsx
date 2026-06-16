'use client'
import { useState, useRef } from 'react'
import { Upload, Download, CheckCircle, XCircle } from 'lucide-react'
import * as XLSX from 'xlsx'
import Papa from 'papaparse'

const SAMPLE_HEADERS = ['employee_id','name','username','password','role','state','branch','edition','email','mobile']
const SAMPLE_ROWS = [
  ['EMP001','Rahul Sharma','rahul','Welcome@123','PRODUCER','Rajasthan','Jaipur','Jaipur City','rahul@patrika.com','9876543210'],
  ['EMP002','Priya Singh','priya','Welcome@123','VIDEO_EDITOR','','','','priya@patrika.com',''],
]

export default function TeamUploadPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [rows, setRows] = useState<any[]>([])
  const [filename, setFilename] = useState('')
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const downloadTemplate = () => {
    const wb = XLSX.utils.book_new()
    const ws = XLSX.utils.aoa_to_sheet([SAMPLE_HEADERS, ...SAMPLE_ROWS])
    ws['!cols'] = SAMPLE_HEADERS.map(()=>({wch:18}))
    XLSX.utils.book_append_sheet(wb, ws, 'Team')
    XLSX.writeFile(wb, 'team_upload_template.xlsx')
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]; if(!file) return
    setFilename(file.name); setResult(null)
    const ext = file.name.split('.').pop()?.toLowerCase()
    if (ext==='csv') {
      Papa.parse(file,{ header:true, skipEmptyLines:true, complete:(r)=>setRows(r.data as any[]) })
    } else {
      const reader = new FileReader()
      reader.onload = ev => {
        const wb = XLSX.read(ev.target?.result, {type:'array'})
        const ws = wb.Sheets[wb.SheetNames[0]]
        setRows(XLSX.utils.sheet_to_json(ws))
      }
      reader.readAsArrayBuffer(file)
    }
  }

  const upload = async () => {
    if(!rows.length) return
    setLoading(true)
    const res = await fetch('/api/upload/bulk',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({rows,filename})})
    setResult(await res.json())
    setLoading(false)
  }

  return (
    <div className="max-w-3xl">
      <div className="mb-6">
        <h2 className="text-lg font-bold" style={{color:'#14120E'}}>Bulk Team Upload</h2>
        <p className="text-xs mt-0.5" style={{color:'#8C7A50'}}>Upload Excel or CSV to add multiple team members at once</p>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-4" style={{borderColor:'#DDD0B0'}}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm" style={{color:'#14120E'}}>Step 1: Download Template</h3>
          <button onClick={downloadTemplate} className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border" style={{borderColor:'#B48C28',color:'#B48C28'}}>
            <Download className="w-4 h-4"/>Download Template
          </button>
        </div>
        <div className="p-3 rounded-lg text-xs" style={{background:'#FAF5EB',color:'#5C4D2A'}}>
          <strong>Required columns:</strong> employee_id, name, username, password, role<br/>
          <strong>Optional:</strong> state, branch, edition, email, mobile<br/>
          <strong>Valid roles:</strong> ADMIN, INCHARGE, PRODUCER, VIDEO_EDITOR, GRAPHIC_DESIGNER<br/>
          <strong>Note:</strong> All imported users will have "Force password change on next login" enabled.
        </div>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-4" style={{borderColor:'#DDD0B0'}}>
        <h3 className="font-semibold text-sm mb-4" style={{color:'#14120E'}}>Step 2: Upload File</h3>
        <div className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer hover:bg-[#FAF5EB] transition-colors" style={{borderColor:'#DDD0B0'}} onClick={()=>fileRef.current?.click()}>
          <Upload className="w-8 h-8 mx-auto mb-3" style={{color:'#8C7A50'}}/>
          <p className="text-sm font-semibold" style={{color:'#5C4D2A'}}>{filename || 'Click to upload Excel or CSV'}</p>
          <p className="text-xs mt-1" style={{color:'#8C7A50'}}>.xlsx, .xls, .csv supported</p>
          {rows.length>0 && <p className="text-xs mt-2 font-bold" style={{color:'#B48C28'}}>{rows.length} rows detected</p>}
          <input ref={fileRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={handleFile}/>
        </div>
      </div>

      {rows.length>0 && !result && (
        <div className="bg-white rounded-xl border p-6 mb-4" style={{borderColor:'#DDD0B0'}}>
          <h3 className="font-semibold text-sm mb-3" style={{color:'#14120E'}}>Preview ({rows.length} rows)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-xs border-collapse">
              <thead><tr style={{background:'#FAF5EB'}}>{SAMPLE_HEADERS.map(h=><th key={h} className="text-left px-3 py-2 border" style={{borderColor:'#DDD0B0',color:'#8C7A50'}}>{h}</th>)}</tr></thead>
              <tbody>{rows.slice(0,5).map((r,i)=><tr key={i}>{SAMPLE_HEADERS.map(h=><td key={h} className="px-3 py-2 border" style={{borderColor:'#EBE1C8'}}>{(r as any)[h]||''}</td>)}</tr>)}</tbody>
            </table>
            {rows.length>5 && <p className="text-xs mt-2" style={{color:'#8C7A50'}}>...and {rows.length-5} more rows</p>}
          </div>
          <button onClick={upload} disabled={loading} className="mt-4 px-6 py-2.5 rounded-lg text-sm font-semibold" style={{background:'#B48C28',color:'#fff',opacity:loading?0.6:1}}>
            {loading?'Importing...':'Import '+rows.length+' Members'}
          </button>
        </div>
      )}

      {result && (
        <div className="bg-white rounded-xl border p-6" style={{borderColor:'#DDD0B0'}}>
          <h3 className="font-semibold text-sm mb-4" style={{color:'#14120E'}}>Import Result</h3>
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="p-3 rounded-lg text-center" style={{background:'#FAF5EB'}}><div className="text-xl font-bold" style={{color:'#14120E'}}>{result.total}</div><div className="text-xs" style={{color:'#8C7A50'}}>Total Rows</div></div>
            <div className="p-3 rounded-lg text-center" style={{background:'#E8F5EE'}}><div className="text-xl font-bold" style={{color:'#2D6A4F'}}>{result.imported}</div><div className="text-xs" style={{color:'#2D6A4F'}}>Imported</div></div>
            <div className="p-3 rounded-lg text-center" style={{background:'#FFF0F0'}}><div className="text-xl font-bold" style={{color:'#78141E'}}>{result.failed}</div><div className="text-xs" style={{color:'#78141E'}}>Failed</div></div>
          </div>
          {result.errors?.length>0 && (
            <div>
              <p className="text-xs font-bold mb-2" style={{color:'#78141E'}}>Failed Rows:</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {result.errors.map((e:any,i:number)=>(
                  <div key={i} className="flex items-center gap-2 text-xs px-3 py-1.5 rounded" style={{background:'#FFF0F0'}}>
                    <XCircle className="w-3.5 h-3.5 flex-shrink-0" style={{color:'#78141E'}}/>
                    <span style={{color:'#78141E'}}>Row {e.row}: {e.username} — {e.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
