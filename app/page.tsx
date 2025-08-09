"use client";
import React, { useEffect, useMemo, useState, createContext, useContext } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { ArrowUpRight, Mail, Play, Sparkles, Instagram, Twitter, Send, MoveRight, Laptop, Clapperboard, Wand2, Stars, Check, Settings, Plus, Trash2, Save, Upload, Download, Link as LinkIcon, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const LS_KEY = "lukesite_v2";
const DEFAULT_CONTENT: any = {
  hero: { h1Line1: "Minimal edits.", h1Line2: "Maximum impact.", blurb: "I’m Luke — a freelance video editor focused on clean storytelling, punchy pacing, and intentional design. Scandinavian vibe. Zero clutter.", reelUrl: "" },
  contact: { email: "hello@lukeday.studio", instagram: "#", twitter: "#" },
  services: [
    { icon: "clapper", title: "Edit & Story", desc: "Tight, rhythm-driven cuts that keep people watching.", points: ["Narrative shaping", "Vertical & 16:9", "Social-first pacing"] },
    { icon: "wand", title: "Polish & Finishing", desc: "Color, sound, and motion details that quietly elevate.", points: ["Color balancing", "Mix & cleanup", "Motion touches"] },
    { icon: "laptop", title: "Ad Creative", desc: "Snappy, conversion-minded edits for brands and creators.", points: ["UGC & product", "Hooks & CTAs", "Export packages"] },
  ],
  projects: [
    { title: "IFC – Social Cut", tags: ["Ad", "Social"], year: "2025", link: "" },
    { title: "Cafe Launch – UGC", tags: ["UGC", "Product"], year: "2025", link: "" },
    { title: "Event Recap", tags: ["Short", "YouTube"], year: "2024", link: "" },
    { title: "Beauty – TikTok Series", tags: ["Series", "TikTok"], year: "2024", link: "" },
    { title: "SaaS App – Promo", tags: ["App", "Promo"], year: "2025", link: "" },
    { title: "Brand Reel", tags: ["Reel", "Montage"], year: "2023", link: "" },
  ],
  pricing: { hourly: 25, projectFrom: 200, retainerNote: "Reserved hours each month for fast turnarounds." },
  quote: { text: "Luke nailed the cut on the first pass — crisp pacing, clean polish, and thoughtful details that made a real difference.", author: "Agency Producer" },
  admin: { passphrase: "changeme", supabase: { url: "", anonKey: "", table: "site_content", rowId: "default", enabled: false } },
};

function loadFromLocal(){ try{ const s=localStorage.getItem(LS_KEY); if(!s) return DEFAULT_CONTENT; const parsed=JSON.parse(s); return { ...DEFAULT_CONTENT, ...parsed }; }catch{ return DEFAULT_CONTENT; } }
function saveToLocal(d:any){ localStorage.setItem(LS_KEY, JSON.stringify(d)); }

async function supaLoad(cfg:any){ if(!cfg?.enabled||!cfg?.url||!cfg?.anonKey) return null; try{
  const res=await fetch(`${cfg.url}/rest/v1/${cfg.table}?id=eq.${encodeURIComponent(cfg.rowId)}&select=payload`, { headers:{ apikey:cfg.anonKey, Authorization:`Bearer ${cfg.anonKey}` } });
  if(!res.ok) return null; const rows=await res.json(); if(Array.isArray(rows) && rows[0]?.payload) return rows[0].payload;
}catch{} return null;}
async function supaSave(cfg:any, data:any){ if(!cfg?.enabled||!cfg?.url||!cfg?.anonKey) return false; try{
  const res=await fetch(`${cfg.url}/rest/v1/${cfg.table}`, { method:"POST", headers:{ apikey:cfg.anonKey, Authorization:`Bearer ${cfg.anonKey}`, "Content-Type":"application/json", Prefer:"resolution=merge-duplicates,return=representation" }, body: JSON.stringify([{ id: cfg.rowId, payload: data }]) });
  return res.ok;
}catch{ return false; }}

const ContentCtx = createContext<any>({ data: DEFAULT_CONTENT, setData:(_:any)=>{}, authed:false, setAuthed:(_:boolean)=>{}, syncing:false, setSyncing:(_:boolean)=>{}, syncNow: async()=>{} });
function useContent(){ return useContext(ContentCtx); }

function TopProgress(){ const {scrollYProgress}=useScroll(); const scaleX=useSpring(scrollYProgress,{stiffness:120,damping:20,mass:0.2}); return <motion.div className="fixed left-0 right-0 top-0 z-50 h-px origin-left bg-neutral-900/70 dark:bg-neutral-100/70" style={{scaleX}}/>; }
function Background(){ return (<div className="pointer-events-none fixed inset-0 z-0">
  <div className="absolute inset-0 opacity-[0.06] [background:radial-gradient(circle_at_1px_1px,theme(colors.neutral.700/.5)_1px,transparent_1px)] [background-size:24px_24px] dark:opacity-[0.08]" />
  <motion.div aria-hidden className="absolute -top-32 -left-24 h-96 w-96 rounded-full blur-3xl" style={{background:"radial-gradient(closest-side, #0ea5e9 0%, transparent 60%)"}} animate={{ y:[0,20,0], x:[0,10,0] }} transition={{ duration:16, repeat:Infinity, ease:"easeInOut" }}/>
  <motion.div aria-hidden className="absolute bottom-[-12rem] right-[-8rem] h-[28rem] w-[28rem] rounded-full blur-3xl" style={{background:"radial-gradient(closest-side, #a78bfa 0%, transparent 60%)"}} animate={{ y:[0,-16,0], x:[0,-12,0] }} transition={{ duration:20, repeat:Infinity, ease:"easeInOut" }}/>
</div>);}

function Section({id,eyebrow,title,children}:{id?:string;eyebrow?:string;title?:string;children:any}){ return (<section id={id} className="relative z-10 mx-auto max-w-6xl px-4 py-20 md:py-28">
  {eyebrow && <div className="mb-3 text-xs uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">{eyebrow}</div>}
  {title && <h2 className="mb-8 text-3xl font-medium leading-tight tracking-tight text-neutral-900 dark:text-neutral-50 md:text-5xl">{title}</h2>}
  {children}
</section>);}

function ServiceIcon({kind}:{kind:string}){ if(kind==="clapper") return <Clapperboard className="h-5 w-5"/>; if(kind==="wand") return <Wand2 className="h-5 w-5"/>; return <Laptop className="h-5 w-5"/>; }

function Nav(){ return (<div className="sticky top-6 z-40 mx-auto max-w-6xl px-4">
  <div className="flex items-center justify-between rounded-full border border-neutral-200/60 bg-white/70 px-3 py-2 shadow-sm backdrop-blur-md dark:border-neutral-800/60 dark:bg-neutral-900/60">
    <a href="#home" className="inline-flex items-center gap-2 text-sm font-medium text-neutral-900 dark:text-neutral-100"><div className="h-6 w-6 rounded-full bg-neutral-900 dark:bg-neutral-100" /><span>Luke</span></a>
    <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-300">
      <a className="rounded-full px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="#work">Work</a>
      <a className="rounded-full px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="#services">Services</a>
      <a className="rounded-full px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="#about">About</a>
      <a className="rounded-full px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800" href="#contact">Contact</a>
    </div>
    <div className="flex items-center gap-2">
      <Button asChild={true} size="sm" variant="ghost" className="rounded-full"><a href="#contact" className="inline-flex items-center gap-1"><Mail className="h-4 w-4"/><span>Reach out</span></a></Button>
    </div>
  </div>
</div>);}

function youtubeIdFromUrl(url:string){ if(!url) return ""; try{ const u=new URL(url); if(u.hostname.includes("youtu.be")) return u.pathname.slice(1); if(u.searchParams.get("v")) return String(u.searchParams.get("v")); const parts=u.pathname.split("/"); const idx=parts.findIndex(p=>p==="embed"); if(idx>=0 && parts[idx+1]) return parts[idx+1]; }catch{} return ""; }

function Hero(){ const {data}=useContent(); const {scrollY}=useScroll(); const ySlow=useTransform(scrollY,[0,600],[0,-20]); const ySlower=useTransform(scrollY,[0,600],[0,-40]); const [open,setOpen]=useState(false); const vid=youtubeIdFromUrl(data.hero.reelUrl);
  return (<section id="home" className="relative z-10 mx-auto max-w-6xl px-4 pt-36 md:pt-40">
    <div className="grid grid-cols-1 items-end gap-10 md:grid-cols-12">
      <motion.div style={{y:ySlow}} className="md:col-span-7">
        <h1 className="text-[10vw] leading-[0.9] tracking-tight text-neutral-900 dark:text-neutral-50 md:text-7xl">{data.hero.h1Line1}<br/>{data.hero.h1Line2}</h1>
        <p className="mt-5 max-w-xl text-base text-neutral-600 dark:text-neutral-300">{data.hero.blurb}</p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Button asChild={true} className="rounded-full"><a href="#work" className="inline-flex items-center gap-2"><Play className="h-4 w-4"/>See work<ArrowUpRight className="h-4 w-4"/></a></Button>
          <Button asChild={true} variant="ghost" className="rounded-full"><a href="#contact" className="inline-flex items-center gap-2">Book a project<MoveRight className="h-4 w-4"/></a></Button>
          {vid && (<Button onClick={()=>setOpen(true as any)} variant="secondary" className="rounded-full"><Play className="mr-1 h-4 w-4"/>Watch reel</Button>)}
        </div>
        <div className="mt-10 flex items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <div className="flex items-center gap-2"><Stars className="h-4 w-4"/> Quick turnarounds</div>
          <div className="flex items-center gap-2"><Wand2 className="h-4 w-4"/> Detail-obsessed</div>
          <div className="flex items-center gap-2"><Clapperboard className="h-4 w-4"/> Ads • Social • Shorts</div>
        </div>
      </motion.div>
      <motion.div style={{y:ySlower}} className="md:col-span-5">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-neutral-200 bg-white/70 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/60">
          <div className="absolute inset-0 grid grid-cols-3 gap-2 p-3">
            {Array.from({length:9}).map((_,i)=>(<motion.div key={i} className="rounded-xl border border-neutral-200/70 bg-neutral-100/80 dark:border-neutral-800/70 dark:bg-neutral-800/70" animate={{opacity:[0.7,1,0.7]}} transition={{duration:3+i*0.15, repeat:Infinity, ease:"easeInOut"}}/>))}
          </div>
          {vid && (<div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <div className="rounded-full bg-neutral-900/90 px-3 py-1 text-xs text-white dark:bg-white/90 dark:text-neutral-900">Reel ready</div>
            <Button variant="secondary" size="sm" className="rounded-full" onClick={()=> setOpen(true)}><Play className="mr-1 h-4 w-4"/> Watch</Button>
          </div>)}
        </div>
      </motion.div>
    </div>
    {open && (<div className="fixed inset-0 z-[70] grid place-items-center bg-black/60 p-4" onClick={()=> setOpen(false)}>
      <div className="aspect-video w-full max-w-4xl overflow-hidden rounded-2xl bg-black" onClick={(e)=> e.stopPropagation()}>
        <iframe className="h-full w-full" src={`https://www.youtube.com/embed/${vid}?autoplay=1&rel=0`} title="Luke reel" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/>
      </div>
    </div>)}
  </section>);
}

function Work(){ const { data } = useContent(); return (<Section id="work" eyebrow="Selected" title="Work">
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {data.projects.map((p:any,i:number)=>(<motion.a key={(p.title||"")+i} href={p.link || "#"} target={p.link?"_blank":undefined} rel={p.link?"noopener noreferrer":undefined}
      className="group relative block overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/60 p-4 backdrop-blur transition-colors hover:bg-white/80 dark:border-neutral-800/70 dark:bg-neutral-900/50 dark:hover:bg-neutral-900/70"
      initial={{opacity:0, y:16}} whileInView={{opacity:1, y:0}} viewport={{once:true, amount:0.3}} transition={{delay:i*0.04, duration:0.5}}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800">
        <div className="absolute inset-0 grid grid-cols-4 gap-1 p-2 opacity-90">
          {Array.from({length:16}).map((_,idx)=>(<motion.div key={idx} className="rounded-md bg-neutral-200/80 dark:bg-neutral-700/80" animate={{opacity:[0.5,1,0.5]}} transition={{duration:2.5+(idx%4)*0.2, repeat:Infinity}}/>))}
        </div>
        <motion.div className="absolute inset-0" initial={{opacity:0}} whileHover={{opacity:1}}>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
            <div className="text-sm opacity-90">{(p.tags||[]).join(" • ")}</div>
            <Button size="sm" variant="secondary" className="rounded-full">{p.link? "Open":"Play"}</Button>
          </div>
        </motion.div>
      </div>
      <div className="mt-3 flex items-center justify-between"><div><div className="text-sm text-neutral-500 dark:text-neutral-400">{p.year}</div><h3 className="text-lg text-neutral-900 dark:text-neutral-100">{p.title}</h3></div><ArrowUpRight className="h-5 w-5 text-neutral-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></div>
    </motion.a>))}
  </div>
  <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400"><LinkIcon className="h-4 w-4"/> Tip: add full URLs (https://…) in Admin → Work. Links open in a new tab.</div>
</Section>); }

function Quote(){ const { data } = useContent(); return (<Section eyebrow="Notes" title="Clients say">
  <Card className="overflow-hidden rounded-3xl border-neutral-200/70 bg-white/60 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-900/50">
    <CardContent className="p-8">
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <p className="max-w-3xl text-xl leading-relaxed text-neutral-800 dark:text-neutral-100">“{data.quote.text}”</p>
        <div className="text-sm text-neutral-500 dark:text-neutral-400">— {data.quote.author}</div>
      </div>
    </CardContent>
  </Card>
</Section>); }

function Services(){ const { data } = useContent(); return (<Section id="services" eyebrow="Capabilities" title="What I do">
  <div className="grid gap-4 md:grid-cols-3">
    {data.services.map((s:any, idx:number)=>(<Card key={s.title+idx} className="group relative overflow-hidden rounded-3xl border-neutral-200/70 bg-white/60 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-900/50">
      <CardHeader><CardTitle className="flex items-center gap-2 text-lg">
        <span className="grid h-9 w-9 place-items-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">
          <ServiceIcon kind={s.icon} />
        </span>{s.title}
      </CardTitle></CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">{s.desc}</p>
        <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">{s.points.map((p:string)=>(<li key={p} className="flex items-center gap-2"><Check className="h-4 w-4 opacity-60"/> {p}</li>))}</ul>
        <motion.div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full opacity-0 blur-2xl" style={{background:"radial-gradient(closest-side, #0ea5e9 0%, transparent 70%)"}} whileHover={{opacity:0.4, y:-8}} transition={{ type:"spring", stiffness:120, damping:18}}/>
      </CardContent>
    </Card>))}
  </div>
</Section>); }

function About(){ return (<Section id="about" eyebrow="About" title="A detail-first approach">
  <div className="grid items-start gap-10 md:grid-cols-12">
    <div className="md:col-span-7">
      <p className="mb-6 text-neutral-700 dark:text-neutral-200">I’m a freelance editor based in Winter Garden, FL → moving to Orange, CA. I focus on minimalist, story-forward edits for ads, social, and short-form.
        I love subtle touches — tiny sounds, clean motion, balanced color — that you feel more than you notice.</p>
      <ul className="grid gap-3 text-sm text-neutral-700 dark:text-neutral-200 md:grid-cols-2">
        <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 opacity-60"/> Premiere, Final Cut, Resolve</li>
        <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 opacity-60"/> Motion graphics & cleanup</li>
        <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 opacity-60"/> Color balancing & light grade</li>
        <li className="flex items-center gap-2"><Sparkles className="h-4 w-4 opacity-60"/> Fast, clear communication</li>
      </ul>
    </div>
    <div className="md:col-span-5">
      <div className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/60 p-6 shadow-sm backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mb-3 text-xs uppercase tracking-[0.22em] text-neutral-500 dark:text-neutral-400">Toolbox</div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {["Final Cut Pro","Premiere Pro","DaVinci Resolve","After Effects","Logic Pro","Audition"].map(tool=>(<div key={tool} className="rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-neutral-700 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-200">{tool}</div>))}
        </div>
      </div>
    </div>
  </div>
</Section>); }

function Pricing(){ const { data } = useContent(); return (<Section eyebrow="Simple" title="Rates">
  <div className="grid gap-4 md:grid-cols-3">
    <Card className="rounded-3xl border-neutral-200/70 bg-white/60 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-900/50">
      <CardHeader><CardTitle>Hourly</CardTitle></CardHeader>
      <CardContent>
        <div className="mb-3 text-3xl">${'{'}data.pricing.hourly{'}'}<span className="text-base text-neutral-500">/hr</span></div>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">Best for exploratory edits, cleanup, and ongoing support.</p>
        <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
          <li className="flex items-center gap-2"><Check className="h-4 w-4 opacity-60"/> Flexible scope</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 opacity-60"/> Weekly updates</li>
        </ul>
      </CardContent>
    </Card>
    <Card className="rounded-3xl border-neutral-200/70 bg-white/60 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-900/50">
      <CardHeader><CardTitle>Per Project</CardTitle></CardHeader>
      <CardContent>
        <div className="mb-3 text-3xl">From ${'{'}data.pricing.projectFrom{'}'}</div>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">Define scope up front; flat fee with agreed deliverables.</p>
        <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
          <li className="flex items-center gap-2"><Check className="h-4 w-4 opacity-60"/> Clear milestones</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 opacity-60"/> Two revision rounds</li>
        </ul>
      </CardContent>
    </Card>
    <Card className="rounded-3xl border-neutral-200/70 bg-white/60 backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-900/50">
      <CardHeader><CardTitle>Retainer</CardTitle></CardHeader>
      <CardContent>
        <div className="mb-3 text-3xl">Custom</div>
        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-300">{'{'}data.pricing.retainerNote{'}'}</p>
        <ul className="space-y-2 text-sm text-neutral-700 dark:text-neutral-200">
          <li className="flex items-center gap-2"><Check className="h-4 w-4 opacity-60"/> Priority queue</li>
          <li className="flex items-center gap-2"><Check className="h-4 w-4 opacity-60"/> Dedicated support</li>
        </ul>
      </CardContent>
    </Card>
  </div>
</Section>); }

function Contact(){ const { data } = useContent(); return (<Section id="contact" eyebrow="Start a project" title="Let’s make something clean">
  <div className="grid gap-8 md:grid-cols-12">
    <div className="md:col-span-6">
      <form className="space-y-4" onSubmit={(e)=>e.preventDefault()}>
        <div className="grid gap-3 md:grid-cols-2">
          <input className="rounded-2xl border border-neutral-300/80 bg-white/70 px-4 py-3 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-100" placeholder="Your name" />
          <input className="rounded-2xl border border-neutral-300/80 bg-white/70 px-4 py-3 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-100" placeholder="Email" />
        </div>
        <input className="w-full rounded-2xl border border-neutral-300/80 bg-white/70 px-4 py-3 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-100" placeholder="Project link or brief (optional)" />
        <textarea rows={5} className="w-full rounded-2xl border border-neutral-300/80 bg-white/70 px-4 py-3 text-sm outline-none ring-0 placeholder:text-neutral-400 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900/50 dark:text-neutral-100" placeholder="What are we making?" />
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500 dark:text-neutral-400">Typical reply within 1–2 days.</div>
          <Button asChild={true} className="rounded-full"><a href={`mailto:${'{'}data.contact.email{'}'}`}><span className="inline-flex items-center">Send <Send className="ml-2 h-4 w-4" /></span></a></Button>
        </div>
      </form>
    </div>
    <div className="md:col-span-5 md:col-start-8">
      <div className="rounded-3xl border border-neutral-200 bg-white/60 p-6 backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/50">
        <div className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">Email</div>
        <a href={`mailto:${data.contact.email}`} className="text-lg text-neutral-900 underline-offset-4 hover:underline dark:text-neutral-100">{data.contact.email}</a>
        <div className="mt-6 flex items-center gap-3 text-neutral-600 dark:text-neutral-300">
          <a href={data.contact.instagram || "#"} className="rounded-full border border-neutral-200 bg-white/70 p-2 dark:border-neutral-800 dark:bg-neutral-800"><Instagram className="h-4 w-4" /></a>
          <a href={data.contact.twitter || "#"} className="rounded-full border border-neutral-200 bg-white/70 p-2 dark:border-neutral-800 dark:bg-neutral-800"><Twitter className="h-4 w-4" /></a>
        </div>
      </div>
    </div>
  </div>
</Section>); }

function Footer(){ const { syncing } = useContent(); return (<footer className="relative z-10 mx-auto max-w-6xl px-4 py-14">
  <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
    <div className="text-sm text-neutral-500 dark:text-neutral-400">© {new Date().getFullYear()} Luke — Editor</div>
    <div className="flex items-center gap-3 text-sm text-neutral-600 dark:text-neutral-300">
      <a href="#services" className="rounded-full px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">Services</a>
      <a href="#work" className="rounded-full px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">Work</a>
      <a href="#contact" className="rounded-full px-3 py-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">Contact</a>
      {syncing && <span className="text-xs opacity-70">Syncing…</span>}
    </div>
  </div>
</footer>); }

function AdminPanel(){ const { data, setData, setAuthed } = useContent(); const [tab, setTab] = useState<string>('work');
  const update=(partial:any)=>{ const next={...data, ...partial}; setData(next); saveToLocal(next); };
  const addProject=()=> update({ projects:[...data.projects, { title:"New Project", tags:["Tag"], year:String(new Date().getFullYear()), link:"" }] });
  const removeProject=(idx:number)=>{ const copy=[...data.projects]; copy.splice(idx,1); update({projects:copy}); };
  const exportJSON=()=>{ const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='lukesite-content.json'; a.click(); URL.revokeObjectURL(url); };
  const importJSON=(file: File)=>{ const reader=new FileReader(); reader.onload=()=>{ try{ const next=JSON.parse(String(reader.result)); setData(next); saveToLocal(next);}catch{ alert('Invalid JSON'); } }; reader.readAsText(file); };
  return (<div className="fixed inset-4 z-[60] mx-auto max-w-5xl overflow-hidden rounded-3xl border border-neutral-200 bg-white/90 shadow-2xl backdrop-blur dark:border-neutral-800 dark:bg-neutral-900/90">
    <div className="flex h-12 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
      <div className="flex items-center gap-2 text-sm"><Settings className="h-4 w-4"/> <b>Admin</b></div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="ghost" onClick={exportJSON} className="rounded-full"><Download className="h-4 w-4 mr-1" />Export</Button>
        <label className="inline-flex items-center"><input type="file" accept="application/json" className="hidden" onChange={(e:any)=> e.target.files && importJSON(e.target.files[0])} /><Button size="sm" variant="ghost" className="rounded-full"><Upload className="h-4 w-4 mr-1" />Import</Button></label>
        <Button size="sm" variant="ghost" className="rounded-full" onClick={()=> setAuthed(false)}>Logout</Button>
      </div>
    </div>
    <div className="grid h-[70vh] grid-cols-5">
      <div className="border-r border-neutral-200 p-3 text-sm dark:border-neutral-800">
        {(['work','pricing','quote','hero','contact','security']).map((t)=> (<button key={t} onClick={()=>setTab(t)} className={`mb-1 w-full rounded-xl px-3 py-2 text-left hover:bg-neutral-100 dark:hover:bg-neutral-800 ${tab===t?'bg-neutral-100 dark:bg-neutral-800':''}`}>{t[0].toUpperCase()+t.slice(1)}</button>))}
      </div>
      <div className="col-span-4 overflow-auto p-4">
        {tab==='work' && (<div><div className="mb-3 flex items-center justify-between"><div className="text-sm text-neutral-600 dark:text-neutral-300">Add links to YouTube/Vimeo/Drive/etc. They’ll open in a new tab.</div><Button size="sm" className="rounded-full" onClick={addProject}><Plus className="h-4 w-4 mr-1"/>Add</Button></div>
        <div className="space-y-3">{data.projects.map((p:any,i:number)=>(<div key={i} className="rounded-2xl border border-neutral-200 p-3 dark:border-neutral-800"><div className="grid gap-2 md:grid-cols-5">
          <input value={p.title} onChange={(e)=>{ const copy=[...data.projects]; copy[i]={...p,title:(e.target as HTMLInputElement).value}; update({projects:copy}); }} className="rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" placeholder="Title"/>
          <input value={(p.tags||[]).join(', ')} onChange={(e)=>{ const copy=[...data.projects]; copy[i]={...p,tags:(e.target as HTMLInputElement).value.split(',').map((s)=>s.trim()).filter(Boolean)}; update({projects:copy}); }} className="rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" placeholder="Tags (comma)"/>
          <input value={p.year} onChange={(e)=>{ const copy=[...data.projects]; copy[i]={...p,year:(e.target as HTMLInputElement).value}; update({projects:copy}); }} className="rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" placeholder="Year"/>
          <input value={p.link||''} onChange={(e)=>{ const copy=[...data.projects]; copy[i]={...p,link:(e.target as HTMLInputElement).value}; update({projects:copy}); }} className="rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" placeholder="Full URL (https://…)"/>
          <div className="flex items-center justify-end"><Button size="sm" variant="ghost" className="rounded-full" onClick={()=>{ const copy=[...data.projects]; copy.splice(i,1); update({projects:copy}); }}><Trash2 className="h-4 w-4 mr-1"/>Remove</Button></div>
        </div></div>))}</div></div>)}
        {tab==='pricing' && (<div className="grid gap-3 md:max-w-md">
          <label className="text-sm">Hourly ($/hr)
            <input type="number" value={data.pricing.hourly} onChange={(e)=> update({pricing:{...data.pricing, hourly:Number((e.target as HTMLInputElement).value)}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
          <label className="text-sm">Per Project (From $)
            <input type="number" value={data.pricing.projectFrom} onChange={(e)=> update({pricing:{...data.pricing, projectFrom:Number((e.target as HTMLInputElement).value)}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
          <label className="text-sm">Retainer note
            <input value={data.pricing.retainerNote} onChange={(e)=> update({pricing:{...data.pricing, retainerNote:(e.target as HTMLInputElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
        </div>)}
        {tab==='quote' && (<div className="grid gap-3 md:max-w-2xl">
          <label className="text-sm">Quote text
            <textarea rows={4} value={data.quote.text} onChange={(e)=> update({quote:{...data.quote, text:(e.target as HTMLTextAreaElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
          <label className="text-sm">Author
            <input value={data.quote.author} onChange={(e)=> update({quote:{...data.quote, author:(e.target as HTMLInputElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
        </div>)}
        {tab==='hero' && (<div className="grid gap-3 md:max-w-2xl">
          <label className="text-sm">Headline line 1
            <input value={data.hero.h1Line1} onChange={(e)=> update({hero:{...data.hero, h1Line1:(e.target as HTMLInputElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
          <label className="text-sm">Headline line 2
            <input value={data.hero.h1Line2} onChange={(e)=> update({hero:{...data.hero, h1Line2:(e.target as HTMLInputElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
          <label className="text-sm">Blurb
            <textarea rows={3} value={data.hero.blurb} onChange={(e)=> update({hero:{...data.hero, blurb:(e.target as HTMLTextAreaElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
          <label className="text-sm">YouTube reel URL (optional)
            <input value={data.hero.reelUrl} onChange={(e)=> update({hero:{...data.hero, reelUrl:(e.target as HTMLInputElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" placeholder="https://youtu.be/… or https://www.youtube.com/watch?v=…" />
          </label>
        </div>)}
        {tab==='contact' && (<div className="grid gap-3 md:max-w-lg">
          <label className="text-sm">Public email
            <input value={data.contact.email} onChange={(e)=> update({contact:{...data.contact, email:(e.target as HTMLInputElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
          <label className="text-sm">Instagram URL
            <input value={data.contact.instagram} onChange={(e)=> update({contact:{...data.contact, instagram:(e.target as HTMLInputElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
          <label className="text-sm">Twitter/X URL
            <input value={data.contact.twitter} onChange={(e)=> update({contact:{...data.contact, twitter:(e.target as HTMLInputElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
        </div>)}
        {tab==='security' && (<div className="grid gap-3 md:max-w-md">
          <p className="text-sm text-neutral-600 dark:text-neutral-300">Set a custom passphrase to open Admin. (Press <kbd>Shift</kbd>+<kbd>L</kbd>.)</p>
          <label className="text-sm">Passphrase
            <input type="password" defaultValue={DEFAULT_CONTENT.admin.passphrase} onChange={(e)=> update({admin:{...data.admin, passphrase:(e.target as HTMLInputElement).value}})} className="mt-1 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900/60" />
          </label>
        </div>)}
      </div>
    </div>
  </div>);
}

function AdminGate() {
  const { authed, setAuthed, data } = useContent();
  const [showLogin, setShowLogin] = useState(false);
  const [pass, setPass] = useState("");

  useEffect(() => {
    const hashAdmin = window.location.hash.includes("admin");
    if (hashAdmin) setShowLogin(true);
    const onKey = (e: KeyboardEvent) => {
      if (e.shiftKey && e.key.toLowerCase() === "l") setShowLogin((s) => !s);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!showLogin && !authed) return null;

  return (
    <div className="fixed inset-0 z-[55] grid place-items-center bg-black/30 p-4 backdrop-blur-sm">
      {!authed ? (
        <div className="w-full max-w-sm rounded-2xl border border-neutral-200 bg-white p-5 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-2 text-sm text-neutral-500 dark:text-neutral-400">Enter passphrase to edit content</div>
          <input
            type="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            className="mb-3 w-full rounded-xl border border-neutral-300 bg-white/70 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-800/80"
            placeholder="Passphrase"
          />
          <div className="flex items-center justify-between">
            <Button variant="ghost" className="rounded-full" onClick={() => setShowLogin(false)}>
              Cancel
            </Button>
            <Button
              className="rounded-full"
              onClick={() => {
                if (pass === (data.admin?.passphrase || "changeme")) {
                  setAuthed(true);
                  setShowLogin(false);
                } else {
                  alert("Wrong passphrase");
                }
              }}
            >
              <Save className="mr-1 h-4 w-4" />
              Login
            </Button>
          </div>
        </div>
      ) : (
        <AdminPanel />
      )}
    </div>
  );
}


export default function Page(){ const [data,setData]=useState<any>(loadFromLocal()); const [authed,setAuthed]=useState<boolean>(false); const [syncing,setSyncing]=useState<boolean>(false);
  useEffect(()=>{ (async()=>{ const cfg=data.admin?.supabase; if(cfg?.enabled && cfg?.url && cfg?.anonKey){ setSyncing(true); const remote=await supaLoad(cfg); setSyncing(false); if(remote){ setData(remote); saveToLocal(remote);} } })(); saveToLocal(data); },[]);
  const ctx = useMemo(()=>({ data, setData, authed, setAuthed, syncing, setSyncing, syncNow: async()=>{} }), [data, authed, syncing]);
  return (<ContentCtx.Provider value={ctx}>
    <div className="relative min-h-screen scroll-smooth bg-neutral-50 text-neutral-900 antialiased dark:bg-neutral-950 dark:text-neutral-50">
      <TopProgress/><Background/><Nav/><Hero/><Services/><Work/><Quote/><About/><Pricing/><Contact/>
      <AdminGate/>
    </div>
  </ContentCtx.Provider>);
}
