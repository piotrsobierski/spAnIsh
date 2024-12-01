import { Repository } from "typeorm";
import { Word } from "../entities/Word";
import { IsNull, LessThan } from "typeorm";

export class WordsService {
  constructor(private wordRepository: Repository<Word>) {}

  async findAll(limit: number = 10): Promise<Word[]> {
    return this.wordRepository.find({
      take: limit,
      relations: ["category"],
    });
  }

  async findNotLearned(limit: number = 10): Promise<Word[]> {
    return this.wordRepository.find({
      where: [
        { lastAnswerTime: IsNull() },
        { goodAnswersStreak: LessThan(3) },
        { isSkipped: false },
        {
          lastAnswerTime: LessThan(
            new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ),
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
}
