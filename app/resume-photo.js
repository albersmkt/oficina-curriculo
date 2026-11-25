'use client';
import {useEffect,useRef,useState} from 'react';
export default function ResumePhoto(){
 const [photo,setPhoto]=useState(''),[source,setSource]=useState(null),[zoom,setZoom]=useState(1),[x,setX]=useState(50),[y,setY]=useState(50);
 const [camera,setCamera]=useState(false),[busy,setBusy]=useState(false),[ready,setReady]=useState(false),[error,setError]=useState('');
 const stream=useRef(null),video=useRef(null),canvas=useRef(null),file=useRef(null),generation=useRef(0);
 function stopCamera(){generation.current++;stream.current?.getTracks().forEach(t=>t.stop());stream.current=null;setCamera(false);setBusy(false);setReady(false);}
 useEffect(()=>()=>{generation.current++;stream.current?.getTracks().forEach(t=>t.stop());},[]);
 useEffect(()=>{if(camera && video.current && stream.current){video.current.srcObject=stream.current;video.current.play().catch(()=>setError('Não foi possível iniciar a câmera. Escolha uma foto do dispositivo.'));}},[camera]);
 useEffect(()=>{
  if(!source || !canvas.current)return;
  const scale=Math.max(600/source.width,800/source.height)*zoom;
  const width=600/scale,height=800/scale;
  canvas.current.getContext('2d').drawImage(source,(source.width-width)*x/100,(source.height-height)*y/100,width,height,0,0,600,800);
 },[source,zoom,x,y]);
 function preview(image){setSource(image);setZoom(1);setX(50);setY(50);setError('');}
 async function choose(event){
  const selected=event.target.files?.[0];event.target.value='';if(!selected)return;
  stopCamera();const ticket=++generation.current;setError('');
  if(!['image/jpeg','image/png','image/webp'].includes(selected.type)){setError('Escolha uma imagem JPG, PNG ou WebP.');return;}
  if(selected.size>10*1024*1024){setError('Escolha uma foto de até 10 MB.');return;}
  setBusy(true);const url=URL.createObjectURL(selected);
  try{
   const image=new Image();image.src=url;await image.decode();
   if(ticket!==generation.current)return;
   // Keep only a resized pixel copy, without the file metadata.
   const resized=document.createElement('canvas');const ratio=Math.min(1,1600/Math.max(image.width,image.height));resized.width=Math.round(image.width*ratio);resized.height=Math.round(image.height*ratio);resized.getContext('2d').drawImage(image,0,0,resized.width,resized.height);preview(resized);
  }catch{if(ticket===generation.current)setError('Não foi possível abrir esta foto. Escolha outro arquivo.');}
  finally{URL.revokeObjectURL(url);if(ticket===generation.current)setBusy(false);}
 }
 async function openCamera(){
  stopCamera();const ticket=++generation.current;setSource(null);setError('');
  if(!navigator.mediaDevices?.getUserMedia){setError('A câmera não está disponível neste navegador. Use Escolher foto.');return;}
  setBusy(true);
  try{const media=await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'},audio:false});
   if(ticket!==generation.current){media.getTracks().forEach(t=>t.stop());return;}
   stream.current=media;setCamera(true);
  }catch{if(ticket===generation.current)setError('Não foi possível acessar a câmera. Verifique a permissão ou use Escolher foto.');}
  finally{if(ticket===generation.current)setBusy(false);}
 }
 function capture(){
  if(!video.current?.videoWidth)return;
  const captured=document.createElement('canvas');const ratio=Math.min(1,1600/video.current.videoWidth);captured.width=Math.round(video.current.videoWidth*ratio);captured.height=Math.round(video.current.videoHeight*ratio);captured.getContext('2d').drawImage(video.current,0,0,captured.width,captured.height);stopCamera();preview(captured);
 }
 return <div className="resume-photo">
  {photo&&<img className="approved-photo" src={photo} alt="Foto do currículo" width="150" height="200"/>}
  <div className="photo-controls">
   <h3>Foto (opcional)</h3><p>Inclua somente se desejar. A foto fica neste navegador e no PDF; não é enviada à IA.</p>
   <input ref={file} type="file" accept="image/jpeg,image/png,image/webp" onChange={choose} hidden aria-label="Escolher arquivo de foto"/>
   <div className="actions"><button type="button" className="secondary" disabled={busy} onClick={()=>file.current.click()}>Escolher foto</button><button type="button" className="secondary" disabled={busy||camera} onClick={openCamera}>Tirar foto</button>{photo&&<button type="button" className="secondary" onClick={()=>{stopCamera();setPhoto('');setSource(null);setError('');}}>Remover foto</button>}</div>
   {busy&&<p role="status">Aguardando… <button type="button" className="secondary" onClick={stopCamera}>Cancelar</button></p>}
   {error&&<p role="alert" className="error">{error}</p>}
   {camera&&<div className="camera-preview"><video ref={video} muted playsInline autoPlay onLoadedData={()=>setReady(true)}/><div className="actions"><button type="button" disabled={!ready} onClick={capture}>Capturar foto</button><button type="button" className="secondary" onClick={stopCamera}>Cancelar câmera</button></div></div>}
   {source&&<div className="photo-editor"><h4>Ajuste o enquadramento</h4><canvas ref={canvas} width="600" height="800" aria-label="Prévia do recorte da foto"/><label>Zoom<input type="range" min="1" max="3" step="0.05" value={zoom} onChange={e=>setZoom(Number(e.target.value))}/></label><label>Posição horizontal<input type="range" min="0" max="100" value={x} onChange={e=>setX(Number(e.target.value))}/></label><label>Posição vertical<input type="range" min="0" max="100" value={y} onChange={e=>setY(Number(e.target.value))}/></label><div className="actions"><button type="button" onClick={()=>{setPhoto(canvas.current.toDataURL('image/jpeg',0.9));setSource(null);}}>Usar foto</button><button type="button" className="secondary" onClick={()=>setSource(null)}>Descartar foto</button></div></div>}
  </div>
 </div>;
}
