import { useEffect, useState } from "react";
import { ShowClipboard } from "./components/ShowClipboard/ShowClipboard";
import "./Popup.css";
import { SparkleIcon } from "./ui/SparkleIcon";
import { generateText } from "ai";
import { createOpenAI } from "@ai-sdk/openai";
import { IsEmpty } from "./helpers";
import { Loader } from "./ui/Loader/Loader";
import LogoPNG from "./assets/logo.svg";

const openai = createOpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  headers: { "openai-dangerous-direct-browser-access": "true" },
});
function Popup() {
  const [copying, setCopying] = useState(false);
  const [tldr, setTldr] = useState(false);
  const [summary, setSummary] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [generating, setGenerating] = useState(false);

  const handleTLDRChange = () => {
    setTldr(!tldr);
  };

  const generateSummary = async () => {
    setGenerating(true);
    const pageContent = await getPageContent();
    const { text: summary } = await generateText({
      model: openai("gpt-5-nano"),
      prompt: tldr
        ? `Summarize the following text in max 280 characters. Be extremely concise, like a tweet: ${pageContent}`
        : `Summarize the following text in max 1000 characters. Be clear and informative: ${pageContent}`,
    });

    setTimeout(() => {
      setGenerating(false);
      setSummary(summary);
    }, 500);
  };

  const getPageContent = async () => {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });

    if (!tab?.url || tab.url.startsWith("chrome://")) {
      setSummary("Cannot summarize this page.");
      return;
    }

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id! },
      func: () => document.body.innerText,
    });

    return result.result;
  };

  useEffect(() => {
    if (summary) {
      typeWrite(summary);
    }
  }, [summary]);

  const typeWrite = (text: string, speed: number = 20) => {
    for (let i = 0; i < text.length; i++) {
      const t = setTimeout(() => {
        setDisplayedText((prev) => prev + text[i]);
      }, i * speed);

      if (i >= text.length - 1) {
        clearTimeout(t);
      }
    }
  };

  const copySummaryToClipboard = () => {
    setCopying(true);
    navigator.clipboard.writeText(summary);

    setTimeout(() => {
      setCopying(false);
    }, 1000);
  };

  return (
    <>
      <section className="popup bg-c-dark w-100 min-h-125 pb-8">
        <div className="heading flex items-center">
          <img className="mx-2.5" src={LogoPNG} width={40} height={40} alt="logo PNG" />
          <h1 className="text-2xl text-white text-center py-4">
            AI Page Assistant
          </h1>
        </div>
        <div className="divider w-full h-2 border-b border-gray-400"></div>
        <div className="px-8 grid  pt-8">
          <p className="text-white text-base">
            Navigate to a website and click the button below to summarize the
            page content.
          </p>
          <div className="action flex items-center gap-x-2.5">
            <button
              onClick={generateSummary}
              className="btn-primary px-2.5 py-1.5 w-max rounded-md flex items-center text-white c-shadow-md cursor-pointer">
              Summarize
              <SparkleIcon className="ms-2 size-5" />
            </button>
            <div className="flex items-center text-white m-5 gap-x-2.5">
              <div className="checkbox-apple">
                <input
                  onChange={handleTLDRChange}
                  className="yep"
                  id="check-apple"
                  type="checkbox"
                />
                <label htmlFor="check-apple"></label>
              </div>
              <span className="text ms-2">TLDR Mode</span>
            </div>
          </div>

          {generating ? (
            <Loader />
          ) : (
            <div
              className={`summary p-6 border text-white border-gray-400 rounded-xl relative ${!IsEmpty(summary) ? "opacity-100" : "opacity-0"} transition-opacityt duration-300 ease-in-out`}>
              <ShowClipboard
                copying={copying}
                onClick={copySummaryToClipboard}
              />
              {displayedText}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Popup;
