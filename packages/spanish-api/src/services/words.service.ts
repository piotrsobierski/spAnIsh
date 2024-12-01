import { Repository } from "typeorm";
import { Word } from "../entities/Word";
import { IsNull, LessThan } from "typeorm";
import { AIService } from "../services/ai.service";

type WordWithExample = Word & {
  aiExample: { original: string; english: string } | null;
};

export class WordsService {
  constructor(
    private wordRepository: Repository<Word>,
    private aiService: AIService
  ) {}

  async findAll(limit: number = 10): Promise<Word[]> {
    return this.wordRepository.find({
      take: limit,
      relations: ["category"],
    });
  }

  async findNotLearned(limit: number = 10): Promise<Word[]> {
    return this.wordRepository.find({
      where: [
        {
          goodAnswersStreak: LessThan(3),
          isSkipped: false,
        },
      ],
      take: limit,
      relations: ["category"],
    });
  }

  async saveAnswer(wordId: number, isCorrect: boolean): Promise<Word> {
    const word = await this.wordRepository.findOneBy({ id: wordId });
    if (!word) {
      throw new Error("Word not found");
    }

    if (isCorrect) {
      word.goodAnswers += 1;
      word.goodAnswersStreak += 1;
    } else {
      word.badAnswers += 1;
      word.goodAnswersStreak = 0;
    }

    word.lastAnswerTime = new Date();
    return this.wordRepository.save(word);
  }

  async getStats(
    wordId: number
  ): Promise<Word & { totalAnswers: number; successRate: number }> {
    const word = await this.wordRepository.findOne({
      where: { id: wordId },
      select: [
        "id",
        "word",
        "translation",
        "goodAnswers",
        "badAnswers",
        "lastAnswerTime",
      ],
    });

    if (!word) {
      throw new Error("Word not found");
    }

    const totalAnswers = word.goodAnswers + word.badAnswers;
    const successRate =
      totalAnswers > 0 ? (word.goodAnswers / totalAnswers) * 100 : 0;

    return {
      ...word,
      totalAnswers,
      successRate: Math.round(successRate * 100) / 100,
    };
  }

  async skipWord(wordId: number): Promise<Word> {
    const word = await this.wordRepository.findOneBy({ id: wordId });
    if (!word) {
      throw new Error("Word not found");
    }

    word.isSkipped = true;
    return this.wordRepository.save(word);
  }

  async findNotLearnedWithExamples(limit: number = 10): Promise<Word[]> {
    const words = await this.findNotLearned(limit);

    console.log("words", words);
    // Filter words that need examples
    const wordsNeedingExamples = words.filter(
      (word) => !word.example || !word.exampleTranslation
    );

    console.log("wordsNeedingExamples", wordsNeedingExamples);

    if (wordsNeedingExamples.length > 0) {
      try {
        // Single API call for all words needing examples
        const examples = await this.aiService.generateExamples(
          wordsNeedingExamples.map((w) => w.word),
          "Spanish",
          1
        );

        // Update words with their examples
        wordsNeedingExamples.forEach((word, index) => {
          word.example = examples.examples[index]?.sentences[0]?.original || "";
          word.exampleTranslation =
            examples.examples[index]?.sentences[0]?.english || "";
        });

        // Save all updated words
        await this.wordRepository.save(wordsNeedingExamples);
        console.log("saving words", wordsNeedingExamples);
      } catch (error) {
        console.error("Failed to get examples:", error);
      }
    }

    return words;
  }
}
