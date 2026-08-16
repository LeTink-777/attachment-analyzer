'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Brain, ArrowLeft, FileSearch, ArrowRight } from 'lucide-react';
import { QUESTIONS, TYPES, STORAGE_KEY, SITE } from '@/lib/content';

export default function HomePage() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const choose = (index: number) => {
    const next = [...answers];
    next[step] = index;
    setAnswers(next);
    setStep(step + 1);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@') || !email.includes('.')) {
      setError('Укажите корректный e-mail — на него придёт заключение.');
      return;
    }
    setError('');
    setBusy(true);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers: JSON.stringify(answers),
        name: name.trim() || 'Клиент',
        email: email.trim(),
      })
    );
    router.push('/result');
  };

  const done = step >= QUESTIONS.length;

  return (
    <>
      <main className="shell">
        {!started ? (
          <>
            <section className="hero">
              <span className="hero-mark">
                <Brain size={14} strokeWidth={1.9} />
                10 вопросов · 2 минуты
              </span>
              <h1>
                Какой у него тип привязанности — <em>определи по переписке</em>
              </h1>
              <p className="hero-sub">
                Стиль переписки выдаёт тип привязанности точнее слов. Десять вопросов о том,
                как он себя ведёт в сообщениях, — и заключение о том, почему он так делает.
              </p>
              <div style={{ maxWidth: 340, margin: '30px auto 0' }}>
                <button className="btn-primary" onClick={() => setStarted(true)}>
                  <FileSearch size={18} strokeWidth={1.9} />
                  Определить тип
                </button>
              </div>
              <p className="hero-note" style={{ marginTop: 14 }}>
                Без регистрации. Тип и ключевая черта — бесплатно.
              </p>
            </section>

            <div className="rule">
              <Brain size={17} strokeWidth={1.7} />
            </div>

            <section>
              <h2 className="section-title">Три типа привязанности</h2>
              <p className="section-lead">
                Теория привязанности описывает, как человек ведёт себя в близких отношениях —
                и почему одни исчезают, а другие пишут каждые пять минут.
              </p>
              <div className="reports" style={{ marginTop: 28 }}>
                {Object.values(TYPES).map((t) => (
                  <article className="report-card" key={t.id}>
                    <h3>{t.name}</h3>
                    <p className="report-tagline">{t.keyTrait}</p>
                  </article>
                ))}
              </div>
            </section>

            <div className="rule">
              <Brain size={17} strokeWidth={1.7} />
            </div>

            <section className="narrow">
              <h2 className="section-title">Частые вопросы</h2>
              <div style={{ marginTop: 26 }}>
                <div className="faq-item">
                  <h3>Насколько это точно?</h3>
                  <p>
                    Тест отражает то, что вы наблюдаете в переписке. Это тенденция, а не
                    диагноз: один и тот же человек может вести себя по-разному в разных
                    отношениях.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Тип привязанности можно изменить?</h3>
                  <p>
                    Да, и это происходит чаще, чем принято думать. Рядом с предсказуемым
                    партнёром тревожный и избегающий типы постепенно смещаются к
                    безопасному — на это уходит от полугода до пары лет.
                  </p>
                </div>
                <div className="faq-item">
                  <h3>Это психологическая диагностика?</h3>
                  <p>
                    Нет. Материал носит просветительский и развлекательный характер и не
                    заменяет консультацию специалиста.
                  </p>
                </div>
              </div>
            </section>
          </>
        ) : (
          <section className="narrow" style={{ paddingTop: 56 }}>
            <div className="quiz-progress">
              {QUESTIONS.map((_, i) => (
                <span key={i} data-done={i < step ? 'true' : 'false'} />
              ))}
            </div>

            {!done ? (
              <>
                <p className="quiz-step">
                  Вопрос {step + 1} из {QUESTIONS.length}
                </p>
                <h2 className="quiz-question">{QUESTIONS[step].q}</h2>
                <div className="quiz-options">
                  {QUESTIONS[step].options.map((o, i) => (
                    <button className="quiz-option" key={i} onClick={() => choose(i)}>
                      {o.text}
                    </button>
                  ))}
                </div>
                {step > 0 ? (
                  <button className="quiz-back" onClick={() => setStep(step - 1)}>
                    <ArrowLeft size={15} strokeWidth={2} />
                    Назад
                  </button>
                ) : null}
              </>
            ) : (
              <form className="form-card" onSubmit={submit}>
                <h2 className="quiz-question" style={{ marginBottom: 8 }}>
                  Опрос завершён
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: 0, marginBottom: 22 }}>
                  Укажите почту — отправим заключение и PDF после открытия доступа.
                </p>

                <div className="field">
                  <label htmlFor="name">Имя</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Как к вам обращаться"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    maxLength={40}
                  />
                </div>

                <div className="field">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {error ? <p className="field-error">{error}</p> : null}

                <button className="btn-primary" type="submit" disabled={busy}>
                  <FileSearch size={18} strokeWidth={1.9} />
                  {busy ? 'Готовим заключение...' : 'Показать заключение'}
                </button>

                <p className="consent">
                  Нажимая кнопку, вы соглашаетесь с{' '}
                  <Link href="/privacy">политикой конфиденциальности</Link> и{' '}
                  <Link href="/offer">условиями оферты</Link>.
                </p>
              </form>
            )}
          </section>
        )}

        {!started ? (
          <section className="narrow" style={{ marginTop: 48, textAlign: 'center' }}>
            <button
              className="btn-primary"
              style={{ maxWidth: 380, margin: '0 auto' }}
              onClick={() => setStarted(true)}
            >
              Определить тип
              <ArrowRight size={18} strokeWidth={1.9} />
            </button>
          </section>
        ) : null}
      </main>

      <footer className="site-foot shell">
        <p>
          <Link href="/privacy">Политика конфиденциальности</Link>
          <Link href="/offer">Публичная оферта</Link>
        </p>
        <p>
          Евдокимов Даниил Владимирович · ИНН 381928138362 · Самозанятый
          <br />
          danyavdkmvv3@gmail.com · @dvdkmv
        </p>
        <p className="disclaimer">
          {SITE.name} — развлекательный сервис. Тест не является психологической
          диагностикой и не заменяет консультацию специалиста.
        </p>
      </footer>
    </>
  );
}
