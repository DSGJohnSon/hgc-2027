import { Metadata } from "next";
import { documentsData } from "./content";

export const metadata: Metadata = {
  title: "Documents officiels | Holiday Geek Cup",
  description:
    "Consultez les documents officiels de l'association Holiday Geek Cup : statuts, règlements intérieurs, règlements des tournois et autres documents officiels.",
};

export default function DocumentsPage() {
  return (
    <div className="min-h-screen bg-gray-950 pt-72 pb-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto bg-gray-900/50 backdrop-blur-sm border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl">
          <header className="mb-12 border-b border-theme/30 pb-8">
            <h1 className="font-goldman text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-tight mb-4 tracking-tight text-balance">
              Documents officiels{" "}
              <span className="text-theme">Holiday Geek Cup</span>
            </h1>
            <div className="flex flex-wrap gap-4 text-gray-400 font-rajdhani uppercase tracking-wider text-sm">
              <span>Association loi 1901</span>
              <span className="text-theme">•</span>
              <span>SIRET : 909 762 288 00027</span>
            </div>
          </header>

          <div className="space-y-10">
            {documentsData.sections.map((section, sectionIndex) => (
              <section key={sectionIndex}>
                <h2 className="font-rajdhani font-bold text-2xl text-white uppercase mb-5 flex items-center gap-3">
                  <span className="w-6 h-0.5 bg-theme shrink-0" />
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.documents.map((doc, docIndex) => (
                    <li key={docIndex}>
                      <a
                        href={doc.file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-4 p-4 rounded-xl bg-gray-800/50 border border-white/5 hover:border-theme/40 hover:bg-gray-800 transition-all group"
                      >
                        <span className="text-theme text-2xl shrink-0">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6 h-6"
                          >
                            <path d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0 0 16.5 9h-1.875a1.875 1.875 0 0 1-1.875-1.875V5.25A3.75 3.75 0 0 0 9 1.5H5.625Z" />
                            <path d="M12.971 1.816A5.23 5.23 0 0 1 14.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 0 1 3.434 1.279 9.768 9.768 0 0 0-6.963-6.963Z" />
                          </svg>
                        </span>
                        <span className="font-rajdhani text-white font-semibold text-lg group-hover:text-theme transition-colors flex-1">
                          {doc.title}
                        </span>
                        <span className="text-gray-500 text-xs uppercase font-rajdhani tracking-widest shrink-0 group-hover:text-theme transition-colors">
                          PDF
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
