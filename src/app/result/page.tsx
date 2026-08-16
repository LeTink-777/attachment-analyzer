'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Check, Brain, FileSearch, ArrowRight, BadgeCheck } from 'lucide-react';
import {
  PLANS,
  STORAGE_KEY,
  TYPES,
  scoreQuiz,
  parseAnswers,
  SITE,
  type AttachmentType,
  type TypeId,
} from '@/lib/content';
import type { PlanId, UserData } from '@/lib/types';

const PAGE_COUNT = [1, 3, 5];

export default function ResultPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [type, setType] = useState<AttachmentType | null>(null);
  const [breakdown, setBreakdown] = useState<{ type: TypeId; percent: number }[]>([]);
  const [paying, setPaying] = useState<PlanId | null>(null);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    let data: UserData = {};
    try {
      data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as UserData;
    } catch {
      data = {};
    }
    const answers = parseAnswers(data.answers);
    if (!answers) {
      router.replace('/');
      return;
    }
    const result = scoreQuiz(answers);
    setUser(data);
    setType(result.type);
    setBreakdown(result.breakdown);
  }, [router]);

  const pay = async (plan: PlanId) => {
    if (!user) return;
    setPaying(plan);
    setPayError('');
    localStorage.setItem('selected_plan', plan);
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userData: user }),
      });
      const data = await res.json();
      if (data?.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }
      setPayError(data?.error || 'Не удалось создать платёж. Попробуйте ещё раз.');
    } catch {
      setPayError('Сервис оплаты временно недоступен. Попробуйте через минуту.');
    }
    setPaying(null);
  };

  if (!user || !type) {
    return (
      <main className="shell" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Готовим заключение...</p>
      </main>
    );
  }

  return (
    <>
      <main className="shell" style={{ paddingTop: 48 }}>
        <motion.section
          className="report"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="report-head">
            <span>Заключение по стилю переписки</span>
            <span>Форма 01/ТП</span>
          </div>
          <div className="report-body">
            <p className="report-sub">Определённый тип привязанности партнёра</p>
            <h1 className="report-verdict">{type.name}</h1>

            <div className="report-field">
              <span className="k">Ключевая черта</span>
              <span className="v" style={{ fontWeight: 400 }}>
                {type.keyTrait}
              </span>
            </div>

            <div style={{ marginTop: 22 }}>
              {breakdown.map((b) => (
                <div
                  className="dist-row"
                  key={b.type}
                  data-primary={b.type === type.id ? 'true' : 'false'}
                >
                  <div className="dist-head">
                    <span>{TYPES[b.type].name}</span>
                    <span>{b.percent}%</span>
                  </div>
                  <div className="dist-bar">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: `${b.percent}%` }}
                      transition={{ duration: 0.9, delay: 0.25 }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="report-stamp">
              <BadgeCheck size={15} strokeWidth={2.2} />
              Предварительное
            </div>
          </div>
        </motion.section>

        <div className="rule">
          <FileSearch size={17} strokeWidth={1.8} />
        </div>

        <section className="narrow">
          <div className="lock-stack">
            <div className="lock-veil">
              <Lock size={26} strokeWidth={1.7} color="var(--accent)" />
              <h3>Полное заключение закрыто</h3>
              <p>
                Почему он так себя ведёт, что запускает реакцию, как общаться и чего не
                делать — в развёрнутом отчёте.
              </p>
            </div>

            <div className="locked-blur" aria-hidden="true">
              <div className="info-card">
                <h3>
                  <Brain size={17} strokeWidth={1.9} />
                  Почему он ведёт себя именно так
                </h3>
                <p>{type.why}</p>
              </div>
              <div className="info-card">
                <h3>
                  <Brain size={17} strokeWidth={1.9} />
                  Что запускает реакцию
                </h3>
                <p>{type.triggers}</p>
              </div>
              <div className="info-card">
                <h3>
                  <Brain size={17} strokeWidth={1.9} />
                  Как общаться с этим типом
                </h3>
                <p>{type.howTo}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="rule">
          <FileSearch size={17} strokeWidth={1.8} />
        </div>

        <section>
          <h2 className="section-title">Глубина заключения</h2>
          <p className="section-lead">
            Чем больше страниц в отчёте, тем подробнее разбор — вплоть до стратегии общения
            на месяц и готовых скриптов.
          </p>

          <div className="reports">
            {PLANS.map((plan, index) => {
              const discount = Math.round((1 - plan.price / plan.oldPrice) * 100);
              return (
                <div
                  key={plan.id}
                  className="report-card"
                  data-featured={plan.featured ? 'true' : 'false'}
                >
                  {plan.featured ? <span className="report-badge">Выбор большинства</span> : null}

                  <div className="pages" aria-hidden="true">
                    {Array.from({ length: 5 }, (_, i) => (
                      <i key={i} data-on={i < PAGE_COUNT[index] ? 'true' : 'false'} />
                    ))}
                  </div>

                  <h3>{plan.name}</h3>
                  <p className="report-tagline">{plan.tagline}</p>

                  <div className="report-price">
                    <span className="now">{plan.price} ₽</span>
                    <span className="was">{plan.oldPrice} ₽</span>
                    <span className="off">−{discount}%</span>
                  </div>

                  <ul className="report-features">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <Check size={15} strokeWidth={2.4} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="report-cta"
                    disabled={paying !== null}
                    onClick={() => pay(plan.id)}
                  >
                    {paying === plan.id ? (
                      'Открываем оплату...'
                    ) : (
                      <>
                        Получить отчёт
                        <ArrowRight size={16} strokeWidth={2} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {payError ? (
            <p className="field-error" style={{ textAlign: 'center', marginTop: 20 }}>
              {payError}
            </p>
          ) : null}

          <p
            style={{
              textAlign: 'center',
              marginTop: 26,
              fontSize: 13.5,
              color: 'var(--text-secondary)',
            }}
          >
            Оплата через ЮKassa. Доступны карты, СБП, кошельки и рассрочка.
            <br />
            Заключение открывается сразу после оплаты и дублируется на почту.
          </p>
        </section>
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
          {SITE.name} — развлекательный сервис. Заключение не является психологической
          диагностикой.
        </p>
      </footer>
    </>
  );
}
