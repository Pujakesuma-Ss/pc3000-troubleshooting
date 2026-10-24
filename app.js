const $ = id => document.getElementById(id);
const steps = [
 {id:"s1",title:"Langkah 1 — Konfirmasi kondisi dan keselamatan",text:"Catat kondisi saat alarm B15 muncul, temperatur yang terbaca, beban kerja, dan apakah alarm berulang. Amankan unit sesuai prosedur site/LOTOTO sebelum pemeriksaan fisik.",next:"Jika kondisi tidak aman atau temperatur berpotensi merusak komponen, hentikan pemeriksaan dan ikuti prosedur site. Jangan lanjut ke pengukuran sebelum unit aman."},
 {id:"s2",title:"Langkah 2 — Periksa informasi konstruksi / bulletin",text:"Manual menyebut kemungkinan masalah yang bergantung pada konstruksi unit terkait sensor temperatur oli B15, relay, dan wiring. Periksa Parts & Service News AH07527 serta prosedur terbaru untuk konfigurasi unit.",next:"Jika bulletin/prosedur terbaru berlaku, ikuti prosedur tersebut. Jika tidak tersedia atau belum dipastikan, eskalasi ke foreman/engineering sebelum menyimpulkan."},
 {id:"s3",title:"Langkah 3 — Periksa setelan temperature switch K100",text:"Dengan motor berhenti dan key switch 1S1 OFF, periksa setelan K100. Cocokkan titik switching dengan grafik, viskositas oli, dan O&M Manual yang berlaku.",next:"Jika setelan tidak sesuai, koreksi hanya mengikuti manual/grafik yang benar lalu catat setelan sebelum dan sesudah. Jika sesuai, lanjut ke langkah sensor."},
 {id:"s4",title:"Langkah 4 — Uji sensor temperatur B75 (PT100)",text:"Ukur sensor sesuai standard value table dan prosedur pada manual. Catat temperatur saat pengukuran, alat ukur, titik ukur, dan hasil aktual.",next:"Bandingkan hasil hanya dengan standard value table resmi. Jika di luar spesifikasi, sensor dapat menjadi kandidat penggantian sesuai manual. Jika sesuai, lanjutkan diagnosis."},
 {id:"s5",title:"Langkah 5 — Periksa solenoid Y101",text:"Uji solenoid valve Y101 untuk kontrol back pressure valve sesuai prosedur dan standard value table dalam manual.",next:"Jika hasil uji tidak sesuai spesifikasi, tindak lanjuti sesuai manual. Jika sesuai, lanjut ke pemeriksaan setelan back pressure valve."},
 {id:"s6",title:"Langkah 6 — Periksa setelan back pressure valve",text:"Periksa penyetelan back pressure valve menurut Service Manual bagian 4.3 BACK PRESSURE VALVE ADJUSTMENT.",next:"Jika setelan salah, lakukan penyetelan hanya sesuai prosedur resmi. Langkah berikutnya dalam manual B15 harus dibaca dari halaman lanjutan yang sesuai; aplikasi ini tidak mengarang langkah tersebut."}
];
const resultOptions = [["Belum diperiksa","pending"],["OK / sesuai","ok"],["Tidak OK / tidak sesuai","bad"],["Tidak dapat diuji","na"]];
function renderSteps(){
 const host=$("steps"); host.innerHTML="";
 steps.forEach((s,i)=>{
  const div=document.createElement("div"); div.className="check-step";
  div.innerHTML=`<div class="check-title">${s.title}</div><p>${s.text}</p><div class="step-controls">${resultOptions.map((o,j)=>`<label><input type="radio" name="${s.id}" value="${o[1]}" ${j===0?"checked":""}> ${o[0]}</label>`).join("")}</div><label class="step-note">Catatan langkah ini<textarea id="${s.id}note" rows="2" placeholder="Hasil observasi / referensi halaman manual"></textarea></label>`;
  host.appendChild(div);
  div.querySelectorAll("input").forEach(el=>el.addEventListener("change",updateNext));
 });
 updateNext();
}
function getChoice(id){const el=document.querySelector(`input[name="${id}"]:checked`);return el?el.value:"pending"}
function updateNext(){
 const bad=steps.find(s=>getChoice(s.id)==="bad");
 const pending=steps.find(s=>getChoice(s.id)==="pending");
 const na=steps.find(s=>getChoice(s.id)==="na");
 let msg;
 if(bad) msg=`Tindak lanjut: ${bad.title}. Hasil “Tidak OK” tercatat. Ikuti prosedur diagnosis/perbaikan pada manual yang sesuai, catat bukti pengukuran, dan jangan otomatis mengganti komponen tanpa verifikasi.`;
 else if(na) msg=`Tindak lanjut: ${na.title}. Pemeriksaan tidak dapat dilakukan. Catat alasannya dan eskalasi ke foreman/engineering untuk menentukan metode aman berikutnya.`;
 else if(pending) msg=`Langkah berikutnya: ${pending.title}. Selesaikan langkah berurutan dan catat hasil aktual.`;
 else msg="Semua langkah awal telah diberi status. Verifikasi langkah lanjutan B15 pada manual lengkap sebelum menyatakan penyebab atau penutupan alarm.";
 $("nextAction").textContent=msg;
}
function val(id){return ($(id).value||"").trim()||"-"}
function reportText(){
 const out=[
 "PC3000-6E TROUBLESHOOTING REPORT",
 "================================",
 `Tanggal: ${val("date")}`,`Unit: ${val("unit")}`,`HM: ${val("hm")}`,`Mekanik: ${val("mechanic")}`,
 `Trouble code: B15 — Hydraulic oil temperature too high`,
 `Gejala awal: ${val("symptom")}`,"",
 "CHECKLIST BERTAHAP"
 ];
 steps.forEach(s=>{out.push(s.title,`Hasil: ${resultOptions.find(o=>o[1]===getChoice(s.id))?.[0]||"Belum diperiksa"}`,`Catatan: ${val(s.id+"note")}`,`Arahan manual: ${s.next}`,"");});
 out.push("DATA PENGUKURAN",`Temperatur oli hidrolik: ${val("oilTemp")} °C`,`Sensor B75/PT100: ${val("sensorResult")}`,`Setelan K100: ${val("k100")}`,`Solenoid Y101: ${val("y101")}`,`Data tambahan: ${val("measureNotes")}`,"","ANALISIS DAN TINDAK LANJUT",`Dugaan penyebab: ${val("cause")}`,`Tindakan perbaikan: ${val("action")}`,`Status akhir: ${val("status")}`,`Disetujui oleh: ${val("approver")}`,"","RUJUKAN: Shop Manual PC3000E-6, Troubleshooting by Trouble Code, B15, halaman cetak 83–88. Nomor halaman PDF dapat berbeda.","CATATAN: Prototype ini hanya menstrukturkan pemeriksaan awal yang teridentifikasi. Lengkapi langkah B15 lanjutan dari manual lengkap dan verifikasi standard value table sebelum digunakan sebagai keputusan teknis.");
 return out.join("\n");
}
$("generate").addEventListener("click",()=>{$("report").value=reportText();$("saveMsg").textContent="Laporan diperbarui. Periksa kembali data sebelum disalin atau dicetak."});
function collect(){const d={};document.querySelectorAll("input,select,textarea").forEach(el=>{if(!el.id && el.name){if(el.checked)d[el.name]=el.value}else if(el.id && el.id!=="report")d[el.id]=el.value});d._savedAt=new Date().toISOString();return d}
function restore(d){document.querySelectorAll("input,select,textarea").forEach(el=>{if(!el.id&&el.name){el.checked=d[el.name]===el.value}else if(el.id&&Object.prototype.hasOwnProperty.call(d,el.id))el.value=d[el.id]});updateNext()}
$("save").addEventListener("click",()=>{localStorage.setItem("pc3000TroubleshootingV2",JSON.stringify(collect()));$("saveMsg").textContent="Data disimpan di penyimpanan browser HP ini."});
$("load").addEventListener("click",()=>{const s=localStorage.getItem("pc3000TroubleshootingV2");if(!s){$("saveMsg").textContent="Belum ada simpanan pada browser ini.";return}try{restore(JSON.parse(s));$("saveMsg").textContent="Simpanan dimuat."}catch(e){$("saveMsg").textContent="Simpanan tidak dapat dibaca."}});
$("copy").addEventListener("click",async()=>{if(!$("report").value)$("report").value=reportText();try{await navigator.clipboard.writeText($("report").value);$("saveMsg").textContent="Laporan disalin."}catch(e){$("report").focus();$("report").select();$("saveMsg").textContent="Pilih teks laporan lalu gunakan Salin dari menu HP."}});
$("download").addEventListener("click",()=>{if(!$("report").value)$("report").value=reportText();const blob=new Blob([$("report").value],{type:"text/plain;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download=`Troubleshooting_B15_${val("unit").replace(/[^a-z0-9_-]/gi,"_")||"unit"}.txt`;a.click();URL.revokeObjectURL(a.href)});
$("print").addEventListener("click",()=>{if(!$("report").value)$("report").value=reportText();window.print()});
$("reset").addEventListener("click",()=>{if(!confirm("Hapus isian pada formulir ini? Data simpanan lokal tidak ikut terhapus."))return;document.querySelectorAll("input,textarea").forEach(el=>{if(el.type==="radio")el.checked=el.value==="pending";else el.value=""});$("date").value=new Date().toISOString().slice(0,10);$("status").selectedIndex=0;$("report").value="";updateNext();$("saveMsg").textContent="Formulir direset."});
$("date").value=new Date().toISOString().slice(0,10);
renderSteps();
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
