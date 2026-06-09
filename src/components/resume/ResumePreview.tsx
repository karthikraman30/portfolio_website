import type { ResumeData } from '@/data/resume';

export type ResumeTemplate = 'modern' | 'compact' | 'classic';
export type SectionKey = 'summary' | 'education' | 'experience' | 'projects' | 'skills' | 'codingProfiles';
export type FontFamily = 'sans' | 'serif' | 'mono';
export type Spacing = 'tight' | 'normal' | 'relaxed';
export type FontSize = 'small' | 'medium' | 'large';

export const RESUME_TEMPLATES: { id: ResumeTemplate; label: string }[] = [
    { id: 'modern', label: 'Modern' },
    { id: 'compact', label: 'Compact' },
    { id: 'classic', label: 'Classic' },
];

export const SECTION_LABELS: Record<SectionKey, string> = {
    summary: 'Professional Summary',
    education: 'Education',
    experience: 'Experience',
    projects: 'Projects',
    skills: 'Skills',
    codingProfiles: 'Coding Profiles',
};

export const DEFAULT_SECTION_ORDER: SectionKey[] = [
    'summary', 'education', 'experience', 'projects', 'skills', 'codingProfiles',
];

export interface PreviewOptions {
    template: ResumeTemplate;
    accent: string;
    fontFamily: FontFamily;
    fontSize: FontSize;
    spacing: Spacing;
    sections: Record<SectionKey, boolean>;
    sectionOrder: SectionKey[];
    maxProjects: number;
    emphasizedTech: string[];
    atsPlainMode: boolean;
    showAvailability: boolean;
}

export function defaultPreviewOptions(): PreviewOptions {
    return {
        template: 'modern',
        accent: '#2563eb',
        fontFamily: 'sans',
        fontSize: 'medium',
        spacing: 'normal',
        sections: { summary: true, education: true, experience: true, projects: true, skills: true, codingProfiles: true },
        sectionOrder: [...DEFAULT_SECTION_ORDER],
        maxProjects: 6,
        emphasizedTech: [],
        atsPlainMode: false,
        showAvailability: true,
    };
}

const FONT_BASE: Record<FontSize, number> = { small: 11.5, medium: 12.5, large: 13.5 };
const FONT_CLASS: Record<FontFamily, string> = { sans: 'font-sans', serif: 'font-serif', mono: 'font-mono' };
const SPACE_SECTION: Record<Spacing, string> = { tight: 'space-y-2.5', normal: 'space-y-4', relaxed: 'space-y-6' };
const SPACE_ITEM: Record<Spacing, string> = { tight: 'space-y-1.5', normal: 'space-y-3', relaxed: 'space-y-4' };

interface ResumePreviewProps {
    data: ResumeData;
    options?: PreviewOptions;
}

export function ResumePreview({ data, options }: ResumePreviewProps) {
    const o = options ?? defaultPreviewOptions();
    const plain = o.atsPlainMode;
    const accent = plain ? '#111111' : o.accent;
    const base = FONT_BASE[o.fontSize];

    const projects = data.projects
        .filter((p) => !p.hidden)
        .sort((a, b) => Number(!!b.featured) - Number(!!a.featured))
        .slice(0, o.maxProjects);
    const experience = data.experience.filter((e) => !e.hidden);
    const education = data.education.filter((e) => !e.hidden);
    const codingProfiles = data.codingProfiles.filter((c) => !c.hidden);

    const titleCls = `uppercase tracking-wider ${plain ? 'border-b border-neutral-400' : (o.template === 'modern' ? 'border-b-2' : 'border-b')} font-bold pb-1 mb-2`;
    const titleStyle = { fontSize: '1.05em', borderColor: accent } as const;

    const emph = (items: string[]) => renderTech(items, o.emphasizedTech, accent, plain);

    const contactItems = [data.basics.email, data.basics.phone, data.basics.location].filter(Boolean);

    const renderSection = (key: SectionKey) => {
        if (!o.sections[key]) return null;
        switch (key) {
            case 'summary':
                return data.summary ? (
                    <section key={key}>
                        <h2 className={titleCls} style={titleStyle}>{SECTION_LABELS.summary}</h2>
                        <p className="text-neutral-800">{data.summary}</p>
                    </section>
                ) : null;

            case 'education':
                return education.length ? (
                    <section key={key}>
                        <h2 className={titleCls} style={titleStyle}>{SECTION_LABELS.education}</h2>
                        <div className={SPACE_ITEM[o.spacing]}>
                            {education.map((e, i) => (
                                <div key={i}>
                                    <div className="flex justify-between gap-4">
                                        <span className="font-semibold">{e.institution}</span>
                                        <span className="whitespace-nowrap text-neutral-600">{e.period}</span>
                                    </div>
                                    {(e.score || e.location) && (
                                        <div className="flex justify-between gap-4 italic text-neutral-700">
                                            <span>{e.scoreLabel && e.score ? <><span className="font-semibold">{e.scoreLabel}:</span> {e.score}</> : null}</span>
                                            <span className="whitespace-nowrap">{e.location}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'experience':
                return experience.length ? (
                    <section key={key}>
                        <h2 className={titleCls} style={titleStyle}>{SECTION_LABELS.experience}</h2>
                        <div className={SPACE_ITEM[o.spacing]}>
                            {experience.map((e, i) => (
                                <div key={i}>
                                    <div className="flex justify-between gap-4">
                                        <span className="font-semibold">{e.role} · {e.company}</span>
                                        <span className="whitespace-nowrap text-neutral-600">{e.period}</span>
                                    </div>
                                    {e.location && <div className="italic text-neutral-600">{e.location}</div>}
                                    <ul className="ml-4 mt-0.5 list-disc">
                                        {e.bullets.map((b, j) => <li key={j} className="text-neutral-800">{b}</li>)}
                                    </ul>
                                    {e.tech.length > 0 && (
                                        <div className="mt-0.5 text-neutral-600"><span className="font-medium">Tech: </span>{emph(e.tech)}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'projects':
                return projects.length ? (
                    <section key={key}>
                        <h2 className={titleCls} style={titleStyle}>{SECTION_LABELS.projects}</h2>
                        <div className={SPACE_ITEM[o.spacing]}>
                            {projects.map((p, i) => (
                                <div key={i}>
                                    <div className="flex items-baseline justify-between gap-4">
                                        <span className="font-semibold">
                                            {p.name}
                                            {p.featured && !plain && (
                                                <span className="ml-2 align-middle rounded px-1 py-0.5 font-bold" style={{ fontSize: '0.7em', color: accent, border: `1px solid ${accent}` }}>FEATURED</span>
                                            )}
                                        </span>
                                        <span className="flex gap-2 whitespace-nowrap" style={{ fontSize: '0.8em' }}>
                                            {p.links.demo && <a href={p.links.demo} className="underline" style={{ color: accent }}>Demo</a>}
                                            {p.links.github && <a href={p.links.github} className="underline" style={{ color: accent }}>Code</a>}
                                        </span>
                                    </div>
                                    <ul className="ml-4 mt-0.5 list-disc">
                                        {p.bullets.map((b, j) => <li key={j} className="text-neutral-800">{b}</li>)}
                                    </ul>
                                    {p.tech.length > 0 && (
                                        <div className="mt-0.5 text-neutral-600"><span className="font-medium">Tech: </span>{emph(p.tech)}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;

            case 'skills': {
                const cats = (Array.isArray(data.skills) ? data.skills : []).filter((c) => !c.hidden && c.items.length);
                return cats.length ? (
                    <section key={key}>
                        <h2 className={titleCls} style={titleStyle}>Technical Skills</h2>
                        <div className="space-y-0.5">
                            {cats.map((c, i) => (
                                <div key={i} className="text-neutral-800">
                                    <span className="font-semibold">{c.label}: </span>{emph(c.items)}
                                </div>
                            ))}
                        </div>
                    </section>
                ) : null;
            }

            case 'codingProfiles':
                return codingProfiles.length ? (
                    <section key={key}>
                        <h2 className={titleCls} style={titleStyle}>{SECTION_LABELS.codingProfiles}</h2>
                        <div className="flex flex-wrap gap-x-5 gap-y-1">
                            {codingProfiles.map((c, i) => (
                                <span key={i}>
                                    <span className="font-medium">{c.platform}:</span>{' '}
                                    <a href={c.url} className="underline" style={{ color: accent }}>{c.handle}</a>
                                    {c.stat && <span className="text-neutral-600"> ({c.stat})</span>}
                                </span>
                            ))}
                        </div>
                    </section>
                ) : null;
        }
    };

    return (
        <div
            className={`resume-print-area bg-white text-neutral-900 ${FONT_CLASS[o.fontFamily]} leading-snug mx-auto`}
            style={{ width: '210mm', minHeight: '297mm', padding: '14mm 16mm', boxSizing: 'border-box', fontSize: `${base}px` }}
        >
            {/* Header */}
            <header className={`flex flex-col pb-3 ${o.template === 'classic' ? 'items-center text-center' : 'items-start text-left'}`}>
                <h1 className="font-bold leading-none" style={{ fontSize: '2.2em' }}>{data.basics.name}</h1>
                <p className="mt-1 font-medium" style={{ fontSize: '1.05em', color: accent }}>{data.basics.title}</p>
                <div className={`mt-2 flex flex-wrap gap-x-3 gap-y-0.5 text-neutral-600 ${o.template === 'classic' ? 'justify-center' : ''}`} style={{ fontSize: '0.85em' }}>
                    {contactItems.map((item, i) => <span key={i}>{item}</span>)}
                    {(['portfolio', 'github', 'linkedin'] as const).map((k) => {
                        const url = data.basics.links[k];
                        if (!url || url.includes('TODO')) return null;
                        return <a key={k} href={url} className="underline" style={{ color: accent }}>{cleanUrl(url)}</a>;
                    })}
                </div>
                {o.showAvailability && data.basics.availability && (
                    <p className="mt-1.5 font-semibold text-neutral-800" style={{ fontSize: '0.85em' }}>{data.basics.availability}</p>
                )}
            </header>

            <div className={SPACE_SECTION[o.spacing]}>
                {o.sectionOrder.map((key) => renderSection(key))}
            </div>
        </div>
    );
}

function renderTech(items: string[], emphasized: string[], accent: string, plain: boolean): React.ReactNode {
    return items.map((t, i) => {
        const on = emphasized.includes(t);
        const style = on ? (plain ? { fontWeight: 700 } : { color: accent, fontWeight: 600 }) : undefined;
        return (
            <span key={i}>
                {i > 0 && ', '}
                <span style={style}>{t}</span>
            </span>
        );
    });
}

function cleanUrl(url: string): string {
    return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
}
