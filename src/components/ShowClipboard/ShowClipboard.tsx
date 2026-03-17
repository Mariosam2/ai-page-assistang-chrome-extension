import { CheckedClipboard } from "../../ui/CheckedClipboard";
import { ClipboardCopy } from "../../ui/ClipboardCopy";
import "./ShowClipboard.css";

interface ShowClipboardProps {
  copying: boolean;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export const ShowClipboard = ({ copying, onClick }: ShowClipboardProps) => {
  return (
    <button
      type="button"
      className="clipboard-btn absolute top-1.5 right-1.5 transition-transform duration-200 active:scale-125 cursor-pointer"
      onClick={onClick}
      title="Copy">
      {copying ? (
        <CheckedClipboard className="size-6 text-green-400 animate-[pop_0.3s_ease-out]" />
      ) : (
        <ClipboardCopy className="size-6" />
      )}
    </button>
  );
};
