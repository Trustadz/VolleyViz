
import React, { useState, useEffect, useRef } from 'react';
import { useUI } from '../context/UIContext';

const Modal: React.FC = () => {
    const { modalState, closeModal } = useUI();
    const [inputValue, setInputValue] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const confirmBtnRef = useRef<HTMLButtonElement>(null);

    // Reset input when modal opens
    useEffect(() => {
        if (modalState?.type === 'prompt') {
            setInputValue(modalState.defaultValue || '');
            // Small timeout to allow render before focus
            setTimeout(() => inputRef.current?.focus(), 50);
        } else if (modalState) {
            setTimeout(() => confirmBtnRef.current?.focus(), 50);
        }
    }, [modalState]);

    if (!modalState) return null;

    const handleConfirm = () => {
        if (modalState.type === 'prompt') {
            modalState.resolve(inputValue);
        } else if (modalState.type === 'confirm') {
            modalState.resolve(true);
        } else {
            modalState.resolve(undefined);
        }
        closeModal();
    };

    const handleCancel = () => {
        if (modalState.type === 'prompt') {
            modalState.resolve(null);
        } else if (modalState.type === 'confirm') {
            modalState.resolve(false);
        } else {
            modalState.resolve(undefined);
        }
        closeModal();
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleConfirm();
        if (e.key === 'Escape') handleCancel();
    };

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={handleCancel}
            ></div>

            {/* Modal Card */}
            <div 
                className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95 slide-in-from-bottom-2 duration-200"
                onKeyDown={handleKeyDown}
            >
                {/* Header / Icon */}
                <div className="mb-4">
                    {modalState.type === 'confirm' && (
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" /></svg>
                        </div>
                    )}
                    {modalState.type === 'alert' && (
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M11.25 4.5h1.5a1.5 1.5 0 011.5 1.5v8.25a1.5 1.5 0 01-1.5 1.5h-1.5a1.5 1.5 0 01-1.5-1.5V6a1.5 1.5 0 011.5-1.5zm0 13.5h1.5a1.25 1.25 0 11-1.5 0 1.25 1.25 0 010-1.25z" clipRule="evenodd" /></svg>
                        </div>
                    )}
                     
                     <h3 className="text-lg font-black text-slate-900 leading-snug">
                        {modalState.type === 'prompt' ? 'Input Required' : (modalState.type === 'confirm' ? 'Confirm Action' : 'Notice')}
                     </h3>
                     <p className="text-sm text-slate-500 mt-2 font-medium">
                        {modalState.message}
                     </p>
                </div>

                {/* Prompt Input */}
                {modalState.type === 'prompt' && (
                    <div className="mb-6">
                        <input
                            ref={inputRef}
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-all font-bold text-slate-800"
                        />
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 justify-end mt-6">
                    {modalState.type !== 'alert' && (
                        <button 
                            onClick={handleCancel}
                            className="px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100 transition-colors"
                        >
                            Cancel
                        </button>
                    )}
                    <button 
                        ref={confirmBtnRef}
                        onClick={handleConfirm}
                        className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                    >
                        {modalState.type === 'confirm' ? 'Confirm' : 'OK'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Modal;
