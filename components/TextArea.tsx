import React from 'react';

interface TextAreaProps {
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  readOnly?: boolean;
  disabled?: boolean;
  isTranslated?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
  value,
  onChange,
  placeholder,
  readOnly = false,
  disabled = false,
  isTranslated = false,
}) => {
  const baseClasses = "w-full h-48 p-4 bg-slate-900/80 border border-slate-700 rounded-lg resize-none focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/50 transition-all duration-300 text-slate-200 pr-16";
  const readOnlyClasses = isTranslated ? "text-cyan-300" : "";
  const disabledClasses = "disabled:opacity-60 disabled:cursor-not-allowed";

  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={readOnly}
      disabled={disabled}
      className={`${baseClasses} ${readOnlyClasses} ${disabledClasses}`}
    />
  );
};

export default TextArea;