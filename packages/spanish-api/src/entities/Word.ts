import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from "typeorm";
import { Category } from "./Category";

@Entity()
export class Word {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  word!: string;

  @Column()
  translation!: string;

  @Column({ nullable: true })
  example!: string;

  @Column({ nullable: true })
  exampleTranslation!: string;

  @Column({ nullable: true })
  notes!: string;

  @Column({ name: "good_answers", default: 0 })
  goodAnswers!: number;

  @Column({ name: "bad_answers", default: 0 })
  badAnswers!: number;

  @Column({ name: "last_answer_time", nullable: true })
  lastAnswerTime!: Date;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @Column({ nullable: true })
  categoryId!: number;

  @ManyToOne(() => Category, (category) => category.words)
  @JoinColumn({ name: "categoryId" })
  category!: Category;
}
