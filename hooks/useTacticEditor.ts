
// This hook is deprecated and has been replaced by the EditorContext and TacticModel pattern.
// Please use useEditorContext() instead.
export const useTacticEditor = () => {
    throw new Error("useTacticEditor is deprecated. Use useEditorContext() via EditorProvider.");
};
