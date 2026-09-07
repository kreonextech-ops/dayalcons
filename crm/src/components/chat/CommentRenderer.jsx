import React from 'react';
import { MdAttachFile } from 'react-icons/md';
import { getR2FileUrl } from 'utils/r2Storage';
import R2Image from 'components/R2Image';

export default function CommentRenderer({ text, textClassName = "text-[13px] text-gray-700 whitespace-pre-wrap" }) {
  if (!text) return null;
  const fileMatch = text.match(/\[R2_FILE::(.*?)::(.*?)\]/);
  
  if (fileMatch) {
    const cleanText = text.replace(/\[R2_FILE::(.*?)::(.*?)\]/, '').trim();
    const fileKey = fileMatch[1];
    const fileName = fileMatch[2] || 'attachment';
    const isImage = fileName.match(/\.(jpg|jpeg|png|gif|webp)$/i);

    return (
      <div className="flex flex-col gap-2">
        {cleanText && <p className={textClassName}>{cleanText}</p>}
        <div 
           className="cursor-pointer border border-gray-200 rounded-lg p-2 bg-gray-50 hover:bg-gray-100 transition inline-block max-w-max"
           onClick={async (e) => {
              e.preventDefault();
              e.stopPropagation();
              const url = await getR2FileUrl(fileKey);
              window.open(url, '_blank');
           }}
        >
           {isImage ? (
              <div className="w-48 h-32 rounded overflow-hidden">
                 <R2Image fileKey={fileKey} alt={fileName} className="w-full h-full object-cover" />
              </div>
           ) : (
              <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
                 <MdAttachFile size={16} /> <span className="truncate max-w-[200px]">{fileName}</span>
              </div>
           )}
        </div>
      </div>
    );
  }
  return <p className={textClassName}>{text}</p>;
}
