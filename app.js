const API_BASE = ""; // Jika backend terpisah, isi URL worker, contoh https://nama-worker.workers.dev
const $ = (id) => document.getElementById(id);
const STORAGE_KEY = "pc3000-ai-history-v1";

function readHistory(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)||"[]")}catch{return []}}
function saveHistory(items){localStorage.setItem(STORAGE_KEY,JSON.stringify(items.slice(0,15)));renderHistory()}
function renderHistory(){
 const h=$("history"), items=readHistory();
 if(!items.length){h.innerHTML='<p class="hint">Belum ada riwayat tersimpan.</p>';return}
 h.innerHTML="";
 items.forEach((item,i)=>{
  const div=document.createElement("div");div.style.cssText="border-top:1px solid #e1e4e8;padding:10px 0";
  const title=document.createElement("strong");title.textContent=`${item.date} • ${item.system} • ${item.unit||"Unit belum diisi"}`;
  const p=document.createElement("p");p.textContent=item.symptom;p.style.margin="4px 0";
  const b=document.createElement("button");b.className="secondary";b.textContent="Lihat hasil";b.onclick=()=>{$("result").textContent=item.answer;$("status").textContent="Menampilkan riwayat lokal."; $("copyBtn").style.display="inline-block"};
  div.append(title,p,b);h.append(div);
 });
}
$("caseForm").addEventListener("submit",async(e)=>{
 e.preventDefault();
 const data={
  system:$("system").value,unit:$("unit").value.trim(),symptom:$("symptom").value.trim(),
  conditions:$("conditions").value.trim(),codes:$("codes").value.trim(),
  measurements:$("measurements").value.trim(),work:$("work").value.trim(),question:$("question").value.trim()
 };
 $("askBtn").disabled=true;$("askBtn").textContent="Sedang menganalisis…";
 $("status").textContent="Menghubungi backend AI. Mohon tunggu."; $("result").textContent="";
 try{
  const res=await fetch(`${API_BASE}/api/diagnose`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(data)});
  const body=await res.json().catch(()=>({error:"Respons server tidak valid"}));
  if(!res.ok)throw new Error(body.error||`Server error (${res.status})`);
  const answer=body.answer||"AI tidak mengembalikan teks.";
  $("result").textContent=answer;$("status").textContent=body.manualEnabled?"Analisis selesai • pencarian manual aktif":"Analisis selesai • manual belum terhubung; jawaban AI umum";
  $("copyBtn").style.display="inline-block";
  const items=readHistory();items.unshift({...data,answer,date:new Date().toLocaleString("id-ID")});saveHistory(items);
 }catch(err){
  $("status").textContent="Belum berhasil menghubungi AI.";
  $("result").textContent=`${err.message}\n\nPeriksa apakah backend sudah dipublikasikan, URL backend pada app.js sudah diisi, dan konfigurasi API tersedia. Jangan memasukkan API key ke halaman ini.`;
 }finally{$("askBtn").disabled=false;$("askBtn").textContent="Analisis dengan AI"}
});
$("copyBtn").addEventListener("click",async()=>{try{await navigator.clipboard.writeText($("result").textContent);$("status").textContent="Hasil disalin."}catch{$("status").textContent="Salin manual dengan menekan lama teks hasil."}});
$("clearBtn").addEventListener("click",()=>{if(confirm("Hapus semua riwayat troubleshooting di perangkat ini?")){localStorage.removeItem(STORAGE_KEY);renderHistory()}});
if("serviceWorker" in navigator && location.protocol.startsWith("http"))navigator.serviceWorker.register("./sw.js").catch(()=>{});
renderHistory();