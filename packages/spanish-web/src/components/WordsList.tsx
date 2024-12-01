import {
  useGetWords,
  usePostAiGenerateRelatedWords,
} from "../api/generated/spanishLearningAPI";
import { useState } from "react";

export const WordsList = () => {
  const { data: words, isLoading, error } = useGetWords();
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [relatedWords, setRelatedWords] = useState<any>(null);

  const { mutate: postAiRelatedWords, isPending: isLoadingRelated } =
    usePostAiGenerateRelatedWords({
      mutation: {
        onSuccess: (data) => {
          setRelatedWords(data);
        },
        onError: (error) => {
          console.error("Failed to get related words:", error);
        },
      },
    });

  const handleGetRelatedWords = (word: string) => {
    setSelectedWord(word);
    postAiRelatedWords({ data: { word, targetLang: "Spanish" } });
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="p-4">
      {words?.map((word) => (
        <div
          key={word.id}
          className="flex items-center gap-4 p-2 border-b border-gray-200"
        >
          <div>
            {word.word} - {word.translation}
          </div>
          <button
            onClick={() => word.word && handleGetRelatedWords(word.word)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
            disabled={isLoadingRelated && selectedWord === word.word}
          >
            {isLoadingRelated && selectedWord === word.word
              ? "Loading..."
              : "Get Related Words"}
          </button>
          {selectedWord === word.word && relatedWords && (
            <div className="ml-4">
              <h4 className="font-semibold">Related Words:</h4>
              <ul className="list-disc list-inside">
                {relatedWords.related_words.map(
                  (related: any, index: number) => (
                    <li key={index}>
                      {related.spanish} - {related.english}
                      {related.explanation && (
                        <span className="text-gray-500 text-sm">
                          {" "}
                          ({related.explanation})
                        </span>
                      )}
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
