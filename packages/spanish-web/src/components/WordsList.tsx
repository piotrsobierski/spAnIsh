import { useGetWords } from "../api/generated/spanishLearningAPI";

export const WordsList = () => {
  const { data: words, isLoading, error } = useGetWords();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div>
      {words?.map((word) => (
        <div key={word.id}>
          {word.word} - {word.translation}
        </div>
      ))}
    </div>
  );
};
