import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
    Download, Upload, FileJson, RotateCcw, ArrowLeft, Eye, EyeOff, Star,
    ChevronUp, ChevronDown, Trash2, Plus, ZoomIn, ZoomOut, Link2, Save, Clipboard,
} from 'lucide-react';
import {
    resumeData as defaultResume,
    type ResumeData, type ProjectItem, type ExperienceItem, type CodingProfile,
} from '@/data/resume';
import {
    ResumePreview, RESUME_TEMPLATES, SECTION_LABELS, DEFAULT_SECTION_ORDER,
    defaultPreviewOptions, type PreviewOptions, type SectionKey,
    type ResumeTemplate, type FontFamily, type FontSize, type Spacing,
} from '@/components/resume/ResumePreview';

const STATE_KEY = 'resume-maker-state-v5';
const SAVED_KEY = 'resume-maker-saved-v2';
const RECENT_KEY = 'resume-maker-recent-v2';

interface BuilderConfig {
    data: ResumeData;
    options: PreviewOptions;
}

interface SavedConfig {
    id: string;
    name: string;
    savedAt: number;
    config: BuilderConfig;
}
interface RecentUrl {
    id: string;
    label: string;
    savedAt: number;
    url: string;
}

const COLOR_SCHEMES: { label: string; value: string }[] = [
    { label: 'Professional', value: '#2563eb' },
    { label: 'Slate', value: '#334155' },
    { label: 'Emerald', value: '#059669' },
    { label: 'Violet', value: '#7c3aed' },
    { label: 'Crimson', value: '#dc2626' },
    { label: 'Black (ATS)', value: '#111111' },
];

// ---------- persistence / encoding ----------
function encodeConfig(cfg: BuilderConfig): string {
    return btoa(unescape(encodeURIComponent(JSON.stringify(cfg))));
}
function decodeConfig(s: string): BuilderConfig {
    return JSON.parse(decodeURIComponent(escape(atob(s)))) as BuilderConfig;
}
function loadJson<T>(key: string, fallback: T): T {
    try {
        const raw = localStorage.getItem(key);
        if (raw) return JSON.parse(raw) as T;
    } catch { /* ignore */ }
    return fallback;
}
function loadInitial(): BuilderConfig {
    // 1. URL config wins
    try {
        const c = new URLSearchParams(window.location.search).get('c');
        if (c) return normalize(decodeConfig(c));
    } catch { /* ignore bad url */ }
    // 2. localStorage
    const stored = loadJson<BuilderConfig | null>(STATE_KEY, null);
    if (stored) return normalize(stored);
    // 3. defaults
    return { data: structuredClone(defaultResume), options: defaultPreviewOptions() };
}
function normalize(cfg: BuilderConfig): BuilderConfig {
    return {
        data: migrateData(cfg?.data),
        options: { ...defaultPreviewOptions(), ...(cfg?.options ?? {}) },
    };
}

// Coerce older/foreign data shapes into the current ResumeData so stale localStorage,
// shared URLs, or old JSON imports never crash the page.
function migrateData(d: unknown): ResumeData {
    const base = structuredClone(defaultResume);
    if (!d || typeof d !== 'object') return base;
    const obj = d as Record<string, unknown>;
    let skills = obj.skills as unknown;
    if (!Array.isArray(skills)) {
        if (skills && typeof skills === 'object') {
            // Old shape: { languages, frameworks, tools, cloudAndDb } → labeled categories
            const labels: Record<string, string> = {
                languages: 'Programming Languages', frameworks: 'Frameworks & Libraries',
                tools: 'Developer Tools', cloudAndDb: 'Databases & Cloud',
            };
            skills = Object.entries(skills as Record<string, unknown>)
                .filter(([, v]) => Array.isArray(v))
                .map(([k, v]) => ({ label: labels[k] ?? k, items: v as string[] }));
        } else {
            skills = base.skills;
        }
    }
    return { ...base, ...(obj as Partial<ResumeData>), skills: skills as ResumeData['skills'] };
}

function moveInArray<T>(arr: T[], i: number, dir: -1 | 1): T[] {
    const j = i + dir;
    if (j < 0 || j >= arr.length) return arr;
    const copy = [...arr];
    [copy[i], copy[j]] = [copy[j], copy[i]];
    return copy;
}

// ---------- quality score ----------
function hasTodo(s?: string): boolean {
    return !!s && s.includes('TODO');
}
function dataHasTodo(d: ResumeData): boolean {
    const blobs = [d.basics.location, d.basics.phone ?? '', d.summary];
    d.education.forEach((e) => blobs.push(e.score ?? ''));
    d.experience.forEach((e) => blobs.push(e.company, e.role, ...e.bullets));
    d.codingProfiles.forEach((c) => blobs.push(c.handle, c.stat ?? ''));
    return blobs.some((b) => b.includes('TODO'));
}
function computeQuality(d: ResumeData, o: PreviewOptions) {
    const visibleProjects = d.projects.filter((p) => !p.hidden).slice(0, o.maxProjects);
    const bullets = [
        ...visibleProjects.flatMap((p) => p.bullets),
        ...d.experience.filter((e) => !e.hidden).flatMap((e) => e.bullets),
    ];
    const quantified = bullets.filter((b) => /\d/.test(b)).length;
    const everyProjectLinked = visibleProjects.length > 0 && visibleProjects.every((p) => p.links.demo || p.links.github);
    const linkCount = [d.basics.links.portfolio, d.basics.links.github, d.basics.links.linkedin].filter((u) => u && !u.includes('TODO')).length;
    const contactOk = !!d.basics.email && !hasTodo(d.basics.location) && linkCount >= 2;
    const summaryOk = d.summary.length > 80 && !hasTodo(d.summary);
    const eduOk = d.education.some((e) => e.score && !hasTodo(e.score));
    const profOk = d.codingProfiles.some((c) => !hasTodo(c.handle));
    const noTodo = !dataHasTodo(d);

    const metrics = [
        { label: 'Contact & Links', value: contactOk ? 20 : 8 },
        { label: 'Summary', value: summaryOk ? 20 : 6 },
        { label: 'Projects', value: Math.min(20, visibleProjects.length * 5) },
        { label: 'Quantified Impact', value: Math.min(20, quantified * 5) },
        { label: 'Education & Profiles', value: (eduOk ? 12 : 4) + (profOk ? 8 : 0) },
    ];
    let score = metrics.reduce((a, m) => a + m.value, 0);
    if (!noTodo) score = Math.max(0, score - 15);

    const checks = [
        { label: 'No placeholder TODOs left', ok: noTodo },
        { label: 'Every shown project has a link', ok: everyProjectLinked },
        { label: 'Has quantified impact', ok: quantified > 0 },
    ];
    return { score: Math.round(score), metrics, checks };
}

export default function ResumeMaker() {
    const initial = useMemo(loadInitial, []);
    const [data, setData] = useState<ResumeData>(initial.data);
    const [options, setOptions] = useState<PreviewOptions>(initial.options);
    const [zoom, setZoom] = useState(0.62);
    const [saved, setSaved] = useState<SavedConfig[]>(() => loadJson<SavedConfig[]>(SAVED_KEY, []));
    const [recent, setRecent] = useState<RecentUrl[]>(() => loadJson<RecentUrl[]>(RECENT_KEY, []));
    const [saveName, setSaveName] = useState('');
    const [pasteOpen, setPasteOpen] = useState(false);
    const [pasteText, setPasteText] = useState('');
    const fileRef = useRef<HTMLInputElement>(null);

    useEffect(() => { document.title = 'Resume Maker'; }, []);
    useEffect(() => {
        localStorage.setItem(STATE_KEY, JSON.stringify({ data, options }));
    }, [data, options]);

    const quality = useMemo(() => computeQuality(data, options), [data, options]);
    const techPool = useMemo(() => {
        const set = new Set<string>();
        data.projects.forEach((p) => p.tech.forEach((x) => set.add(x)));
        data.experience.forEach((e) => e.tech.forEach((x) => set.add(x)));
        data.skills.forEach((c) => c.items.forEach((x) => set.add(x)));
        return [...set].sort((a, b) => a.localeCompare(b));
    }, [data]);

    // ---- update helpers ----
    const setOpt = (patch: Partial<PreviewOptions>) => setOptions((o) => ({ ...o, ...patch }));
    const patchBasics = (patch: Partial<ResumeData['basics']>) => setData((d) => ({ ...d, basics: { ...d.basics, ...patch } }));
    const patchLinks = (patch: Partial<ResumeData['basics']['links']>) => setData((d) => ({ ...d, basics: { ...d.basics, links: { ...d.basics.links, ...patch } } }));
    const patchProject = (i: number, patch: Partial<ProjectItem>) => setData((d) => ({ ...d, projects: d.projects.map((p, idx) => (idx === i ? { ...p, ...patch } : p)) }));
    const patchExperience = (i: number, patch: Partial<ExperienceItem>) => setData((d) => ({ ...d, experience: d.experience.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) }));
    const patchProfile = (i: number, patch: Partial<CodingProfile>) => setData((d) => ({ ...d, codingProfiles: d.codingProfiles.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) }));
    const patchSkill = (i: number, patch: Partial<{ label: string; items: string[]; hidden: boolean }>) => setData((d) => ({ ...d, skills: d.skills.map((c, idx) => (idx === i ? { ...c, ...patch } : c)) }));
    const patchEducation = (i: number, patch: Partial<ResumeData['education'][number]>) => setData((d) => ({ ...d, education: d.education.map((e, idx) => (idx === i ? { ...e, ...patch } : e)) }));
    const toggleTech = (t: string) => setOpt({ emphasizedTech: options.emphasizedTech.includes(t) ? options.emphasizedTech.filter((x) => x !== t) : [...options.emphasizedTech, t] });

    // ---- actions ----
    const exportJson = (resolved: boolean) => {
        const payload = resolved ? { data, options } : data;
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = resolved ? 'resume-config.json' : 'resume.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    // Accepts either a full ResumeData ({ basics, projects, ... }) or a
    // BuilderConfig ({ data, options }). Returns true on success.
    const applyJsonText = (text: string): boolean => {
        try {
            const parsed = JSON.parse(text);
            if (parsed.data && parsed.options) {
                const n = normalize(parsed as BuilderConfig);
                setData(n.data); setOptions(n.options);
            } else if (parsed.basics && parsed.projects) {
                setData(parsed as ResumeData);
            } else {
                throw new Error('JSON must contain either { basics, projects, ... } or { data, options }');
            }
            return true;
        } catch (err) {
            alert('Could not import: ' + (err as Error).message);
            return false;
        }
    };
    const importJson = (file: File) => {
        const reader = new FileReader();
        reader.onload = () => applyJsonText(String(reader.result));
        reader.readAsText(file);
    };
    const loadPastedJson = () => {
        if (applyJsonText(pasteText)) {
            setPasteText('');
            setPasteOpen(false);
        }
    };
    const copyUrl = async () => {
        const url = `${window.location.origin}/resume-maker?c=${encodeConfig({ data, options })}`;
        await navigator.clipboard.writeText(url);
        const entry: RecentUrl = {
            id: crypto.randomUUID(),
            label: `${data.basics.name} — ${options.template}`,
            savedAt: Date.now(),
            url,
        };
        const next = [entry, ...recent].slice(0, 5);
        setRecent(next);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
        alert('Shareable URL copied to clipboard.');
    };
    const saveConfig = () => {
        const name = saveName.trim() || `Config ${saved.length + 1}`;
        const entry: SavedConfig = { id: crypto.randomUUID(), name, savedAt: Date.now(), config: { data, options } };
        const next = [entry, ...saved];
        setSaved(next);
        localStorage.setItem(SAVED_KEY, JSON.stringify(next));
        setSaveName('');
    };
    const restoreConfig = (c: SavedConfig) => { const n = normalize(c.config); setData(n.data); setOptions(n.options); };
    const deleteConfig = (id: string) => {
        const next = saved.filter((s) => s.id !== id);
        setSaved(next);
        localStorage.setItem(SAVED_KEY, JSON.stringify(next));
    };
    const reset = () => {
        if (confirm('Reset everything back to the original resume?')) {
            setData(structuredClone(defaultResume));
            setOptions(defaultPreviewOptions());
        }
    };

    const scoreColor = quality.score >= 75 ? '#4ade80' : quality.score >= 50 ? '#facc15' : '#f87171';

    return (
      <>
        <div className="screen-only min-h-screen bg-[#0a0a0c] font-mono text-neutral-200">
            {/* Top bar */}
            <header className="no-print sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-neutral-800 bg-[#0a0a0c]/95 px-4 py-2.5 backdrop-blur">
                <div className="flex items-center gap-3">
                    <Link to="/" className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-white"><ArrowLeft size={16} /> Portfolio</Link>
                    <span className="text-neutral-700">/</span>
                    <Link to="/resume" className="text-sm text-neutral-400 hover:text-white">View Resume</Link>
                    <span className="text-neutral-700">/</span>
                    <h1 className="text-sm font-bold tracking-wider text-white">RESUME MAKER</h1>
                </div>
                <button onClick={() => window.print()} className="flex items-center gap-1.5 rounded-md bg-[#3b82f6] px-4 py-1.5 text-sm font-semibold text-white hover:bg-[#2563eb]">
                    <Download size={15} /> Generate PDF
                </button>
            </header>

            <div className="mx-auto grid max-w-[1700px] grid-cols-1 gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_640px]">
                {/* ============ LEFT: controls ============ */}
                <div className="space-y-5">
                    {/* Basic Information */}
                    <Card title="Basic Information">
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Name" value={data.basics.name} onChange={(v) => patchBasics({ name: v })} />
                            <Field label="Title / Target Role" value={data.basics.title} onChange={(v) => patchBasics({ title: v })} />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <Field label="Email" value={data.basics.email} onChange={(v) => patchBasics({ email: v })} />
                            <Field label="Phone" value={data.basics.phone ?? ''} onChange={(v) => patchBasics({ phone: v })} />
                        </div>
                        <Field label="Location" value={data.basics.location} onChange={(v) => patchBasics({ location: v })} />
                        <div className="mb-2 flex items-center justify-between">
                            <span className="text-[11px] text-neutral-500">Availability / Visa line (UAE)</span>
                            <Check label="Show on resume" checked={options.showAvailability} onChange={(v) => setOpt({ showAvailability: v })} />
                        </div>
                        <Field label="" value={data.basics.availability ?? ''} onChange={(v) => patchBasics({ availability: v })} />
                        <TextArea label="Professional Summary (tailor to the role; toggle the section on/off under 'Sections to Include')" rows={5} value={data.summary} onChange={(v) => setData((d) => ({ ...d, summary: v }))} />
                        <div className="grid grid-cols-3 gap-3">
                            <Field label="Portfolio" value={data.basics.links.portfolio} onChange={(v) => patchLinks({ portfolio: v })} />
                            <Field label="GitHub" value={data.basics.links.github} onChange={(v) => patchLinks({ github: v })} />
                            <Field label="LinkedIn" value={data.basics.links.linkedin} onChange={(v) => patchLinks({ linkedin: v })} />
                        </div>
                    </Card>

                    {/* Sections to include */}
                    <Card title="Sections to Include">
                        <div className="grid grid-cols-2 gap-2">
                            {DEFAULT_SECTION_ORDER.map((key) => (
                                <Check
                                    key={key}
                                    label={SECTION_LABELS[key]}
                                    checked={options.sections[key]}
                                    onChange={(v) => setOpt({ sections: { ...options.sections, [key]: v } })}
                                />
                            ))}
                        </div>
                    </Card>

                    {/* Projects */}
                    <Card
                        title="Projects Selection"
                        action={
                            <div className="flex gap-2">
                                <ActionBtn onClick={() => setData((d) => ({ ...d, projects: d.projects.map((p) => ({ ...p, hidden: false })) }))}>Select all</ActionBtn>
                                <ActionBtn onClick={() => setData((d) => ({ ...d, projects: d.projects.map((p) => ({ ...p, hidden: true })) }))}>Clear</ActionBtn>
                            </div>
                        }
                    >
                        <p className="mb-2 text-xs text-neutral-500">Tick the projects to include for this JD. {data.projects.filter((p) => !p.hidden).length} of {data.projects.length} selected.</p>
                        <SliderRow label={`Maximum projects to show: ${options.maxProjects}`} min={1} max={Math.max(1, data.projects.length)} value={options.maxProjects} onChange={(v) => setOpt({ maxProjects: v })} />
                        <div className="mt-3 space-y-2">
                            {data.projects.map((p, i) => (
                                <ItemCard
                                    key={i}
                                    title={p.name || 'Project'}
                                    featured={p.featured}
                                    index={i}
                                    count={data.projects.length}
                                    selectable
                                    selected={!p.hidden}
                                    onToggleSelect={() => patchProject(i, { hidden: !p.hidden })}
                                    onMove={(dir) => setData((d) => ({ ...d, projects: moveInArray(d.projects, i, dir) }))}
                                    onToggleFeature={() => patchProject(i, { featured: !p.featured })}
                                    onDelete={() => setData((d) => ({ ...d, projects: d.projects.filter((_, idx) => idx !== i) }))}
                                >
                                    <Field label="Name" value={p.name} onChange={(v) => patchProject(i, { name: v })} />
                                    <Lines label="Bullets (one per line)" value={p.bullets} onChange={(arr) => patchProject(i, { bullets: arr })} />
                                    <Comma label="Tech (comma-separated)" value={p.tech} onChange={(arr) => patchProject(i, { tech: arr })} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Demo URL" value={p.links.demo ?? ''} onChange={(v) => patchProject(i, { links: { ...p.links, demo: v } })} />
                                        <Field label="GitHub URL" value={p.links.github ?? ''} onChange={(v) => patchProject(i, { links: { ...p.links, github: v } })} />
                                    </div>
                                </ItemCard>
                            ))}
                        </div>
                    </Card>

                    {/* Experience */}
                    <Card title="Experience" action={<AddBtn onClick={() => setData((d) => ({ ...d, experience: [...d.experience, blankExperience()] }))} />}>
                        <div className="space-y-2">
                            {data.experience.map((e, i) => (
                                <ItemCard
                                    key={i}
                                    title={`${e.role || 'Role'} · ${e.company || 'Company'}`}
                                    hidden={e.hidden}
                                    index={i}
                                    count={data.experience.length}
                                    onMove={(dir) => setData((d) => ({ ...d, experience: moveInArray(d.experience, i, dir) }))}
                                    onToggleHide={() => patchExperience(i, { hidden: !e.hidden })}
                                    onDelete={() => setData((d) => ({ ...d, experience: d.experience.filter((_, idx) => idx !== i) }))}
                                >
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Role" value={e.role} onChange={(v) => patchExperience(i, { role: v })} />
                                        <Field label="Company" value={e.company} onChange={(v) => patchExperience(i, { company: v })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Period" value={e.period} onChange={(v) => patchExperience(i, { period: v })} />
                                        <Field label="Location" value={e.location} onChange={(v) => patchExperience(i, { location: v })} />
                                    </div>
                                    <Lines label="Bullets (one per line)" value={e.bullets} onChange={(arr) => patchExperience(i, { bullets: arr })} />
                                    <Comma label="Tech (comma-separated)" value={e.tech} onChange={(arr) => patchExperience(i, { tech: arr })} />
                                </ItemCard>
                            ))}
                        </div>
                    </Card>

                    {/* Education */}
                    <Card title="Education" action={<AddBtn onClick={() => setData((d) => ({ ...d, education: [...d.education, blankEducation()] }))} />}>
                        <div className="space-y-2">
                            {data.education.map((e, i) => (
                                <ItemCard
                                    key={i}
                                    title={e.institution || 'Institution'}
                                    hidden={e.hidden}
                                    index={i}
                                    count={data.education.length}
                                    onMove={(dir) => setData((d) => ({ ...d, education: moveInArray(d.education, i, dir) }))}
                                    onToggleHide={() => patchEducation(i, { hidden: !e.hidden })}
                                    onDelete={() => setData((d) => ({ ...d, education: d.education.filter((_, idx) => idx !== i) }))}
                                >
                                    <Field label="Institution" value={e.institution} onChange={(v) => patchEducation(i, { institution: v })} />
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Period" value={e.period} onChange={(v) => patchEducation(i, { period: v })} />
                                        <Field label="Location" value={e.location} onChange={(v) => patchEducation(i, { location: v })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Score label (CPI / Percentage)" value={e.scoreLabel ?? ''} onChange={(v) => patchEducation(i, { scoreLabel: v })} />
                                        <Field label="Score (7.48 / 87.2%)" value={e.score ?? ''} onChange={(v) => patchEducation(i, { score: v })} />
                                    </div>
                                </ItemCard>
                            ))}
                        </div>
                    </Card>

                    {/* Coding profiles */}
                    <Card title="Coding Profiles" action={<AddBtn onClick={() => setData((d) => ({ ...d, codingProfiles: [...d.codingProfiles, blankProfile()] }))} />}>
                        <div className="space-y-2">
                            {data.codingProfiles.map((c, i) => (
                                <ItemCard
                                    key={i}
                                    title={c.platform || 'Profile'}
                                    hidden={c.hidden}
                                    index={i}
                                    count={data.codingProfiles.length}
                                    onMove={(dir) => setData((d) => ({ ...d, codingProfiles: moveInArray(d.codingProfiles, i, dir) }))}
                                    onToggleHide={() => patchProfile(i, { hidden: !c.hidden })}
                                    onDelete={() => setData((d) => ({ ...d, codingProfiles: d.codingProfiles.filter((_, idx) => idx !== i) }))}
                                >
                                    <div className="grid grid-cols-2 gap-3">
                                        <Field label="Platform" value={c.platform} onChange={(v) => patchProfile(i, { platform: v })} />
                                        <Field label="Handle" value={c.handle} onChange={(v) => patchProfile(i, { handle: v })} />
                                    </div>
                                    <Field label="URL" value={c.url} onChange={(v) => patchProfile(i, { url: v })} />
                                    <Field label="Stat (rating / solved)" value={c.stat ?? ''} onChange={(v) => patchProfile(i, { stat: v })} />
                                </ItemCard>
                            ))}
                        </div>
                    </Card>

                    {/* Skills */}
                    <Card title="Skills" action={<AddBtn onClick={() => setData((d) => ({ ...d, skills: [...d.skills, { label: 'New Category', items: [] }] }))} />}>
                        <div className="space-y-2">
                            {data.skills.map((c, i) => (
                                <ItemCard
                                    key={i}
                                    title={c.label || 'Category'}
                                    hidden={c.hidden}
                                    index={i}
                                    count={data.skills.length}
                                    onMove={(dir) => setData((d) => ({ ...d, skills: moveInArray(d.skills, i, dir) }))}
                                    onToggleHide={() => patchSkill(i, { hidden: !c.hidden })}
                                    onDelete={() => setData((d) => ({ ...d, skills: d.skills.filter((_, idx) => idx !== i) }))}
                                >
                                    <Field label="Category label" value={c.label} onChange={(v) => patchSkill(i, { label: v })} />
                                    <Comma label="Items (comma-separated)" value={c.items} onChange={(arr) => patchSkill(i, { items: arr })} />
                                </ItemCard>
                            ))}
                        </div>
                    </Card>

                    {/* Emphasized technologies */}
                    <Card title="Emphasized Technologies">
                        <p className="mb-3 text-xs text-neutral-500">Selected technologies are highlighted in the resume.</p>
                        <div className="flex flex-wrap gap-2">
                            {techPool.map((t) => (
                                <Pill key={t} label={t} active={options.emphasizedTech.includes(t)} onClick={() => toggleTech(t)} />
                            ))}
                        </div>
                    </Card>

                    {/* Formatting */}
                    <Card title="Formatting">
                        <div className="grid grid-cols-2 gap-3">
                            <Select label="Template" value={options.template} onChange={(v) => setOpt({ template: v as ResumeTemplate })} opts={RESUME_TEMPLATES.map((t) => [t.id, t.label])} />
                            <Select label="Color Scheme" value={options.accent} onChange={(v) => setOpt({ accent: v })} opts={COLOR_SCHEMES.map((c) => [c.value, c.label])} />
                            <Select label="Font Size" value={options.fontSize} onChange={(v) => setOpt({ fontSize: v as FontSize })} opts={[['small', 'Small'], ['medium', 'Medium'], ['large', 'Large']]} />
                            <Select label="Spacing" value={options.spacing} onChange={(v) => setOpt({ spacing: v as Spacing })} opts={[['tight', 'Tight'], ['normal', 'Normal'], ['relaxed', 'Relaxed']]} />
                            <Select label="Font Family" value={options.fontFamily} onChange={(v) => setOpt({ fontFamily: v as FontFamily })} opts={[['sans', 'Sans'], ['serif', 'Serif'], ['mono', 'Mono']]} />
                            <div className="flex items-end pb-2.5">
                                <Check label="ATS Plain Mode" checked={options.atsPlainMode} onChange={(v) => setOpt({ atsPlainMode: v })} />
                            </div>
                        </div>
                        <Field
                            label="Section Order (comma-separated)"
                            value={options.sectionOrder.join(',')}
                            onChange={(v) => {
                                const order = v.split(',').map((s) => s.trim()).filter((s): s is SectionKey => (DEFAULT_SECTION_ORDER as string[]).includes(s));
                                if (order.length) setOpt({ sectionOrder: order });
                            }}
                        />
                    </Card>
                </div>

                {/* ============ RIGHT: actions / score / preview / saved ============ */}
                <div className="space-y-5">
                    {/* Actions */}
                    <Card title="Actions">
                        <div className="space-y-2">
                            <button onClick={() => window.print()} className="flex w-full items-center justify-center gap-2 rounded-md bg-[#3b82f6] py-2.5 text-sm font-semibold text-white hover:bg-[#2563eb]"><Download size={15} /> Generate Resume PDF</button>
                            <button onClick={() => setPasteOpen((v) => !v)} className="flex w-full items-center justify-center gap-2 rounded-md border border-[#28c840]/60 bg-[#28c840]/10 py-2 text-sm font-medium text-[#28c840] hover:bg-[#28c840]/20"><Clipboard size={15} /> Paste JSON to Build Resume</button>
                            {pasteOpen && (
                                <div className="rounded-md border border-neutral-700 bg-neutral-900 p-2">
                                    <textarea
                                        value={pasteText}
                                        onChange={(e) => setPasteText(e.target.value)}
                                        rows={8}
                                        placeholder={'Paste resume JSON here.\nAccepts the "Export Resume" shape ({ basics, projects, ... })\nor the "Export Config" shape ({ data, options }).'}
                                        className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-2 py-1.5 font-mono text-xs text-neutral-100 placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none"
                                    />
                                    <div className="mt-2 flex gap-2">
                                        <button onClick={loadPastedJson} className="flex-1 rounded-md bg-[#28c840] py-1.5 text-xs font-semibold text-black hover:bg-[#22b038]">Load JSON</button>
                                        <ActionBtn onClick={() => exportJson(false)}><FileJson size={14} /> Get template</ActionBtn>
                                    </div>
                                </div>
                            )}
                            <div className="grid grid-cols-2 gap-2">
                                <ActionBtn onClick={() => fileRef.current?.click()}><Upload size={14} /> Import File</ActionBtn>
                                <ActionBtn onClick={copyUrl}><Link2 size={14} /> Copy URL</ActionBtn>
                                <ActionBtn onClick={() => exportJson(false)}><FileJson size={14} /> Export Resume</ActionBtn>
                                <ActionBtn onClick={() => exportJson(true)}><FileJson size={14} /> Export Config</ActionBtn>
                                <ActionBtn onClick={reset}><RotateCcw size={14} /> Reset</ActionBtn>
                            </div>
                            <input ref={fileRef} type="file" accept="application/json" className="hidden" onChange={(e) => e.target.files?.[0] && importJson(e.target.files[0])} />
                            <div className="flex gap-2 pt-1">
                                <input value={saveName} onChange={(e) => setSaveName(e.target.value)} placeholder="Configuration name" className="min-w-0 flex-1 rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm placeholder:text-neutral-600 focus:border-neutral-500 focus:outline-none" />
                                <ActionBtn onClick={saveConfig}><Save size={14} /> Save</ActionBtn>
                            </div>
                        </div>
                    </Card>

                    {/* Quality score */}
                    <Card title="Quality Score" headerExtra={<span className="text-3xl font-bold" style={{ color: scoreColor }}>{quality.score}</span>}>
                        <div className="space-y-1 text-sm">
                            {quality.metrics.map((m) => (
                                <div key={m.label} className="flex justify-between">
                                    <span className="text-neutral-400">{m.label}</span>
                                    <span style={{ color: m.value >= 16 ? '#4ade80' : m.value >= 8 ? '#facc15' : '#f87171' }}>{m.value}</span>
                                </div>
                            ))}
                        </div>
                        <div className="mt-3 space-y-1 border-t border-neutral-800 pt-3 text-sm">
                            {quality.checks.map((c) => (
                                <div key={c.label} className="flex items-center gap-2">
                                    <span style={{ color: c.ok ? '#4ade80' : '#f87171' }}>{c.ok ? '✓' : '✗'}</span>
                                    <span className="text-neutral-300">{c.label}</span>
                                </div>
                            ))}
                        </div>
                    </Card>

                    {/* Live preview */}
                    <Card title="Live Preview" headerExtra={
                        <div className="flex items-center gap-1">
                            <button onClick={() => setZoom((z) => Math.max(0.4, +(z - 0.08).toFixed(2)))} className="p-1 text-neutral-400 hover:text-white"><ZoomOut size={15} /></button>
                            <span className="w-10 text-center text-xs tabular-nums text-neutral-400">{Math.round(zoom * 100)}%</span>
                            <button onClick={() => setZoom((z) => Math.min(1, +(z + 0.08).toFixed(2)))} className="p-1 text-neutral-400 hover:text-white"><ZoomIn size={15} /></button>
                        </div>
                    }>
                        <div className="resume-preview-scroll max-h-[80vh] overflow-auto rounded-md bg-neutral-700/40 p-3">
                            <div className="resume-zoom-wrap mx-auto w-fit shadow-xl" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                                <ResumePreview data={data} options={options} />
                            </div>
                        </div>
                    </Card>

                    {/* Saved configurations + recent URLs */}
                    <Card title="Saved Configurations">
                        {saved.length === 0 && <p className="text-sm text-neutral-500">No saved configurations yet.</p>}
                        <div className="space-y-2">
                            {saved.map((c) => (
                                <div key={c.id} className="flex items-center justify-between rounded-md border border-neutral-800 px-3 py-2">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-medium text-white">{c.name}</div>
                                        <div className="text-xs text-neutral-500">{new Date(c.savedAt).toLocaleString()}</div>
                                    </div>
                                    <div className="flex shrink-0 gap-1">
                                        <ActionBtn onClick={() => restoreConfig(c)}>Restore</ActionBtn>
                                        <button onClick={() => deleteConfig(c.id)} className="rounded-md border border-neutral-700 p-1.5 text-neutral-400 hover:text-red-400"><Trash2 size={14} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {recent.length > 0 && (
                            <div className="mt-4 border-t border-neutral-800 pt-3">
                                <div className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-500">Recent URL Configs</div>
                                <div className="space-y-2">
                                    {recent.map((r) => (
                                        <div key={r.id} className="flex items-center justify-between gap-2 rounded-md border border-neutral-800 px-3 py-2">
                                            <div className="min-w-0">
                                                <div className="truncate text-sm text-neutral-300">{r.label}</div>
                                                <div className="text-xs text-neutral-500">{new Date(r.savedAt).toLocaleTimeString()}</div>
                                            </div>
                                            <ActionBtn onClick={() => navigator.clipboard.writeText(r.url)}>Copy URL</ActionBtn>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>

        {/* Print-only copy — the only thing that goes to the PDF */}
        <div className="print-only">
            <ResumePreview data={data} options={options} />
        </div>
      </>
    );
}

// ===================== dark UI primitives =====================

function Card({ title, action, headerExtra, children }: { title: string; action?: React.ReactNode; headerExtra?: React.ReactNode; children: React.ReactNode }) {
    return (
        <section className="overflow-hidden rounded-lg border border-neutral-800 bg-[#0e0e11]">
            <div className="flex items-center gap-1.5 border-b border-neutral-800 px-3 py-2">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]" />
            </div>
            <div className="p-4">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-lg font-bold uppercase tracking-wider text-white">{title}</h2>
                    {headerExtra ?? action}
                </div>
                {children}
            </div>
        </section>
    );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    const todo = value.includes('TODO');
    return (
        <label className="mb-2 block">
            <span className="mb-0.5 block text-[11px] text-neutral-500">{label}</span>
            <input value={value} onChange={(e) => onChange(e.target.value)} className={`w-full rounded-md border bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 focus:outline-none ${todo ? 'border-amber-600/60' : 'border-neutral-700 focus:border-neutral-500'}`} />
        </label>
    );
}
function TextArea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
    const todo = value.includes('TODO');
    return (
        <label className="mb-2 block">
            <span className="mb-0.5 block text-[11px] text-neutral-500">{label}</span>
            <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} className={`w-full rounded-md border bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 focus:outline-none ${todo ? 'border-amber-600/60' : 'border-neutral-700 focus:border-neutral-500'}`} />
        </label>
    );
}
function Comma({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
    return (
        <label className="mb-2 block">
            <span className="mb-0.5 block text-[11px] text-neutral-500">{label}</span>
            <input value={value.join(', ')} onChange={(e) => onChange(e.target.value.split(',').map((s) => s.trim()).filter(Boolean))} className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none" />
        </label>
    );
}
function Lines({ label, value, onChange }: { label: string; value: string[]; onChange: (v: string[]) => void }) {
    return (
        <label className="mb-2 block">
            <span className="mb-0.5 block text-[11px] text-neutral-500">{label}</span>
            <textarea rows={Math.max(2, value.length)} value={value.join('\n')} onChange={(e) => onChange(e.target.value.split('\n').map((s) => s.trim()).filter(Boolean))} className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none" />
        </label>
    );
}
function Select({ label, value, onChange, opts }: { label: string; value: string; onChange: (v: string) => void; opts: string[][] }) {
    return (
        <label className="mb-2 block">
            <span className="mb-0.5 block text-[11px] text-neutral-500">{label}</span>
            <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1.5 text-sm text-neutral-100 focus:border-neutral-500 focus:outline-none">
                {opts.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
        </label>
    );
}
function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
    return (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-300">
            <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="h-4 w-4 accent-[#3b82f6]" />
            {label}
        </label>
    );
}
function Pill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} className={`rounded-full border px-3 py-1 text-xs transition-colors ${active ? 'border-[#28c840] bg-[#28c840]/80 font-medium text-black' : 'border-neutral-700 text-neutral-300 hover:border-neutral-500'}`}>
            {label}
        </button>
    );
}
function SliderRow({ label, min, max, value, onChange }: { label: string; min: number; max: number; value: number; onChange: (v: number) => void }) {
    return (
        <div>
            <div className="mb-1 text-sm text-neutral-400">{label}</div>
            <input type="range" min={min} max={max} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[#3b82f6]" />
        </div>
    );
}
function ActionBtn({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
    return (
        <button onClick={onClick} className="flex items-center justify-center gap-1.5 rounded-md border border-neutral-700 px-3 py-1.5 text-xs text-neutral-300 hover:bg-neutral-800 hover:text-white">
            {children}
        </button>
    );
}
function AddBtn({ onClick }: { onClick: () => void }) {
    return <button onClick={onClick} className="flex items-center gap-1 rounded-md border border-neutral-700 px-2 py-1 text-xs text-neutral-300 hover:bg-neutral-800"><Plus size={13} /> Add</button>;
}

function ItemCard({
    title, hidden, featured, index, count, children, onMove, onToggleHide, onToggleFeature, onDelete,
    selectable, selected, onToggleSelect,
}: {
    title: string; hidden?: boolean; featured?: boolean; index: number; count: number; children: React.ReactNode;
    onMove: (dir: -1 | 1) => void; onToggleHide?: () => void; onToggleFeature?: () => void; onDelete: () => void;
    selectable?: boolean; selected?: boolean; onToggleSelect?: () => void;
}) {
    const [open, setOpen] = useState(false);
    const dimmed = selectable ? !selected : hidden;
    return (
        <div className={`rounded-md border border-neutral-800 bg-neutral-900/40 ${dimmed ? 'opacity-60' : ''}`}>
            <div className="flex items-center gap-2 px-2 py-1.5">
                {selectable && (
                    <input
                        type="checkbox"
                        title={selected ? 'Included — click to exclude' : 'Excluded — click to include'}
                        checked={!!selected}
                        onChange={onToggleSelect}
                        className="h-4 w-4 shrink-0 cursor-pointer accent-[#28c840]"
                    />
                )}
                <button onClick={() => setOpen((o) => !o)} className="min-w-0 flex-1 truncate text-left text-xs font-medium text-neutral-200">{title}</button>
                <div className="flex shrink-0 items-center gap-0.5 text-neutral-500">
                    {onToggleFeature && <IconBtn title="Feature" active={featured} onClick={onToggleFeature}><Star size={14} fill={featured ? 'currentColor' : 'none'} /></IconBtn>}
                    {onToggleHide && <IconBtn title={hidden ? 'Show' : 'Hide'} onClick={onToggleHide}>{hidden ? <EyeOff size={14} /> : <Eye size={14} />}</IconBtn>}
                    <IconBtn title="Up" disabled={index === 0} onClick={() => onMove(-1)}><ChevronUp size={14} /></IconBtn>
                    <IconBtn title="Down" disabled={index === count - 1} onClick={() => onMove(1)}><ChevronDown size={14} /></IconBtn>
                    <IconBtn title="Delete" onClick={onDelete}><Trash2 size={14} /></IconBtn>
                </div>
            </div>
            {open && <div className="border-t border-neutral-800 p-2">{children}</div>}
        </div>
    );
}
function IconBtn({ children, title, onClick, disabled, active }: { children: React.ReactNode; title: string; onClick: () => void; disabled?: boolean; active?: boolean }) {
    return <button title={title} disabled={disabled} onClick={onClick} className={`rounded p-1 hover:bg-neutral-800 disabled:opacity-30 ${active ? 'text-amber-400' : ''}`}>{children}</button>;
}

function blankExperience(): ExperienceItem {
    return { company: '', role: '', location: '', period: '', bullets: [''], tech: [], hidden: false };
}
function blankEducation(): ResumeData['education'][number] {
    return { institution: '', period: '', location: '', scoreLabel: '', score: '' };
}
function blankProfile(): CodingProfile {
    return { platform: '', handle: '', url: '', stat: '' };
}
