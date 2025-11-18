import React, { useState, useMemo, useCallback } from 'react';
import { quranicGuideData } from './data';
import type { Chapter, Lesson } from './types';

// Helper function to process multi-line strings for display
const formatText = (text: string) => {
    return text.split('\n').map((line, index) => (
        <span key={index} className="block mb-2">{line}</span>
    ));
};

// Component to render Arabic tables
const ArabicTable: React.FC<{ tableString: string; isComplex?: boolean }> = ({ tableString, isComplex = false }) => {
    const gridItems = useMemo(() => {
        if (!tableString || tableString.trim() === '') return [];
        return tableString.trim().split('\n').map(row => row.trim().split(/\s+/)).flat();
    }, [tableString]);

    if (gridItems.length === 0) return null;

    const gridClass = isComplex ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' : 'grid-cols-3 sm:grid-cols-5 md:grid-cols-7';

    return (
        <div dir="rtl" className={`grid ${gridClass} gap-2 mt-4`}>
            {gridItems.map((item, index) => (
                <div key={index} className="font-amiri text-3xl md:text-4xl text-center bg-emerald-50 text-emerald-800 p-3 rounded-lg shadow-sm hover:bg-emerald-100 transition-colors duration-200">
                    {item}
                </div>
            ))}
        </div>
    );
};

// Component for additional examples
const AdditionalExamples: React.FC<{ title: string; content: string }> = ({ title, content }) => {
    const examples = useMemo(() => {
        return content.trim().split('\n').map(line => {
            if (line.includes('/')) {
                const parts = line.split('/');
                return {
                    name: parts[0]?.trim() || null,
                    arabic: parts[1]?.trim() || '',
                };
            }
            return {
                name: null,
                arabic: line.trim(),
            };
        });
    }, [content]);

    return (
        <div className="mt-6">
            <h3 className="text-xl font-bold mb-3 text-gray-800">{title}</h3>
            <div className="space-y-4">
                 {examples.map((ex, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                        {ex.name && <p dir="ltr" className="text-md font-semibold text-gray-700 mb-2">{ex.name}</p>}
                        <p dir="rtl" className="font-amiri text-3xl text-emerald-800 text-right">{ex.arabic}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

// Sidebar Component
const Sidebar: React.FC<{
    chapters: Chapter[];
    activeLessonId: string | null;
    onSelectLesson: (chapterIndex: number, lessonIndex: number) => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}> = ({ chapters, activeLessonId, onSelectLesson, isOpen, setIsOpen }) => {
    return (
        <>
            <aside className={`fixed top-0 right-0 h-full bg-gray-800 text-white w-72 md:w-80 shadow-lg p-4 transform transition-transform duration-300 ease-in-out z-40 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0`}>
                <div className="flex justify-between items-center md:justify-center mb-6">
                    <h1 className="text-2xl font-bold text-emerald-400 text-center">دليل القرآن</h1>
                    <button onClick={() => setIsOpen(false)} className="md:hidden text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <nav className="overflow-y-auto h-[calc(100vh-80px)] pr-2">
                    {chapters.map((chapter, chapIndex) => (
                        <div key={chapter.id} className="mb-6">
                            <h2 dir="ltr" className="text-lg font-semibold text-gray-300 mb-3 border-b-2 border-gray-700 pb-2">{chapter.title}</h2>
                            <ul>
                                {chapter.lessons.map((lesson, lessIndex) => (
                                    <li key={lesson.id}>
                                        <button
                                            onClick={() => {
                                                onSelectLesson(chapIndex, lessIndex);
                                                setIsOpen(false);
                                            }}
                                            className={`w-full text-right p-3 my-1 rounded-md text-base transition-all duration-200 ${activeLessonId === lesson.id ? 'bg-emerald-600 font-semibold shadow-md' : 'hover:bg-gray-700 hover:translate-x-[-4px]'}`}
                                        >
                                            <span dir="ltr">{lesson.title}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </aside>
            {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"></div>}
        </>
    );
};

// Lesson Content Component
const LessonContent: React.FC<{ lesson: Lesson | null }> = ({ lesson }) => {
    if (!lesson) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
                 <div dir="rtl">
                    <h2 className="text-3xl font-bold text-gray-700 mb-4">أهلاً بك في الدليل القرآني المتكامل</h2>
                    <p className="text-lg text-gray-500 max-w-2xl">اختر درسًا من القائمة للبدء. تم تصميم هذا الدليل لمساعدتك على إتقان قراءة القرآن الكريم خطوة بخطوة.</p>
                 </div>
                 <div dir="rtl" className="font-amiri text-8xl mt-8 text-emerald-500 opacity-20">
                    بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ
                </div>
            </div>
        );
    }
    
    return (
        <div className="p-6 md:p-8 lg:p-10" dir="ltr">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 border-b-2 border-emerald-500 pb-4 mb-6">{lesson.title}</h1>
            
            <div className="space-y-8">
                {lesson.rule && (
                    <section>
                        <h2 className="text-2xl font-semibold text-emerald-700 mb-3">1. La Regla:</h2>
                        <p className="text-lg text-gray-700 leading-relaxed">{formatText(lesson.rule)}</p>
                    </section>
                )}

                {lesson.studentTip && (
                    <section>
                        <h2 className="text-2xl font-semibold text-emerald-700 mb-3">2. Consejo para el estudiante:</h2>
                        <div className="text-lg text-gray-700 leading-relaxed bg-amber-50 p-4 border-r-4 border-amber-400">
                            {formatText(lesson.studentTip)}
                        </div>
                    </section>
                )}

                {lesson.originalTable && (
                     <section>
                        <h2 className="text-2xl font-semibold text-emerald-700 mb-3">3. Tabla Original:</h2>
                        <ArabicTable tableString={lesson.originalTable} />
                    </section>
                )}

                {lesson.quranicExamples && lesson.quranicExamples.table && (
                     <section>
                        <h2 className="text-2xl font-semibold text-emerald-700 mb-3">4. Ejemplos Coránicos Adicionales:</h2>
                        {lesson.quranicExamples.note && <p className="text-md italic text-gray-600 mb-4">{lesson.quranicExamples.note}</p>}
                        <ArabicTable tableString={lesson.quranicExamples.table} isComplex={true}/>
                    </section>
                )}

                {lesson.additionalExamples && (
                     <section>
                        <AdditionalExamples title={lesson.additionalExamples.title} content={lesson.additionalExamples.content} />
                    </section>
                )}
            </div>
        </div>
    );
};

// Main App Component
const App: React.FC = () => {
    const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
    const [selectedIndices, setSelectedIndices] = useState<{ chapter: number; lesson: number } | null>(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSelectLesson = useCallback((chapterIndex: number, lessonIndex: number) => {
        const lesson = quranicGuideData[chapterIndex]?.lessons[lessonIndex];
        if (lesson) {
            setActiveLessonId(lesson.id);
            setSelectedIndices({ chapter: chapterIndex, lesson: lessonIndex });
        }
    }, []);

    const currentLesson = useMemo(() => {
        if (selectedIndices === null) return null;
        return quranicGuideData[selectedIndices.chapter].lessons[selectedIndices.lesson];
    }, [selectedIndices]);

    return (
        <div className="relative min-h-screen md:pr-80">
            <Sidebar 
                chapters={quranicGuideData} 
                activeLessonId={activeLessonId} 
                onSelectLesson={handleSelectLesson}
                isOpen={isSidebarOpen}
                setIsOpen={setIsSidebarOpen}
            />
            
            <main className="transition-all duration-300">
                 <button onClick={() => setIsSidebarOpen(true)} className="md:hidden fixed top-4 right-4 bg-gray-800 text-white p-2 rounded-md shadow-lg z-20">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                 </button>
                 <div className="bg-white min-h-screen shadow-lg">
                    <LessonContent lesson={currentLesson} />
                 </div>
            </main>
        </div>
    );
};

export default App;