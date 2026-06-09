import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Download, ArrowLeft, Pencil } from 'lucide-react';
import { resumeData } from '@/data/resume';
import { ResumePreview } from '@/components/resume/ResumePreview';

export default function Resume() {
    useEffect(() => {
        document.title = `${resumeData.basics.name} — Resume`;
    }, []);

    return (
      <>
        <div className="screen-only min-h-screen bg-neutral-200 py-8 px-4">
            {/* Toolbar (hidden when printing) */}
            <div className="no-print mx-auto mb-6 flex max-w-[210mm] items-center justify-between">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-sm font-medium text-neutral-700 hover:text-neutral-900"
                >
                    <ArrowLeft size={16} /> Back to portfolio
                </Link>
                <div className="flex items-center gap-2">
                    <Link
                        to="/resume-maker"
                        className="flex items-center gap-2 rounded-md border border-neutral-400 bg-white px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-50"
                    >
                        <Pencil size={16} /> Edit in Resume Maker
                    </Link>
                    <button
                        onClick={() => window.print()}
                        className="flex items-center gap-2 rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800"
                    >
                        <Download size={16} /> Download PDF
                    </button>
                </div>
            </div>

            {/* Resume sheet */}
            <div className="mx-auto w-fit shadow-xl">
                <ResumePreview data={resumeData} />
            </div>
        </div>

        {/* Print-only copy — the only thing that goes to the PDF */}
        <div className="print-only">
            <ResumePreview data={resumeData} />
        </div>
      </>
    );
}
