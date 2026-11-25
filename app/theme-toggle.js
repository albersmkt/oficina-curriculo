'use client';
import {useEffect,useState} from 'react';
export default function ThemeToggle(){
 const [theme,setTheme]=useState('light');
 useEffect(()=>{
  let saved;try{saved=localStorage.getItem('oficina-theme');}catch{}
  const current=saved==='dark'||saved==='light'?saved:(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');
  document.documentElement.dataset.theme=current;setTheme(current);
 },[]);
 function toggle(){
  const next=theme==='dark'?'light':'dark';
  document.documentElement.dataset.theme=next;setTheme(next);
  try{localStorage.setItem('oficina-theme',next);}catch{}
 }
 return <button type="button" className="secondary theme-toggle" onClick={toggle} aria-label={theme==='dark'?'Ativar tema claro':'Ativar tema escuro'}><span aria-hidden="true">{theme==='dark'?'☀':'☾'}</span> {theme==='dark'?'Tema claro':'Tema escuro'}</button>;
}
