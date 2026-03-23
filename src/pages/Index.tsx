import { useState, useEffect, useRef } from "react";

import Icon from "@/components/ui/icon";

const SEND_APPLICATION_URL = "https://functions.poehali.dev/7e73bbac-1fcb-407f-880c-185014e33431";

const LOGO_URL = "https://cdn.poehali.dev/projects/65ca4191-e228-49b4-a044-e9d1a57b79de/bucket/02c20da7-59e5-43f7-812f-a7b1d78df118.png";
const FOUNDER_URL = "https://cdn.poehali.dev/projects/65ca4191-e228-49b4-a044-e9d1a57b79de/bucket/c7012271-cfd1-4083-8d86-270e446b08d2.jpg";

const NAV_ITEMS = [
  { label: "Идеология", href: "#ideology" },
  { label: "Студия", href: "#studio" },
  { label: "Регламент", href: "#rules" },
  { label: "Бонусы", href: "#bonuses" },
  { label: "Вступить", href: "#join" },
];

const IDEOLOGY = [
  {
    icon: "Music",
    title: "Музыка — это сила",
    text: "Мы создаём не просто звук, а послание. Каждый трек — манифест. Каждое выступление — событие.",
  },
  {
    icon: "Users",
    title: "Братство прежде всего",
    text: "BANNDA82 — это семья. Мы поддерживаем друг друга на каждом этапе: от первого demo до большой сцены.",
  },
  {
    icon: "Shield",
    title: "Честность и уважение",
    text: "Никаких закрытых дверей. Прозрачные правила, справедливое распределение, уважение к творчеству каждого.",
  },
  {
    icon: "Zap",
    title: "Постоянный рост",
    text: "Мы не останавливаемся. Обучение, эксперименты, новые форматы — движение вперёд заложено в ДНК команды.",
  },
];

const STUDIO_FEATURES = [
  { title: "Запись", desc: "Профессиональное оборудование, акустически обработанные помещения" },
  { title: "Сведение", desc: "Опытные звукорежиссёры, современные DAW и плагины" },
  { title: "Мастеринг", desc: "Финальная обработка для стриминговых платформ и физических носителей" },
  { title: "Репетиции", desc: "Оборудованные репетиционные залы, доступные участникам команды" },
];

const RULES = [
  {
    num: "01",
    title: "Участие",
    items: [
      "Вступление — через собеседование с советом команды",
      "Испытательный период — 3 месяца активного участия",
      "Обязательное посещение не менее 2 командных событий в месяц",
      "Уведомление о временном отсутствии за 7 дней",
    ],
  },
  {
    num: "02",
    title: "Студия",
    items: [
      "Бронирование через общий календарь — минимум за 48 часов",
      "Участники приоритетно занимают слоты в рабочее время",
      "Уборка помещения после каждой сессии обязательна",
      "Гости — только с разрешения действующего участника",
    ],
  },
  {
    num: "03",
    title: "Финансы",
    items: [
      "Распределение доходов от совместных проектов — по вкладу",
      "Ежеквартальный отчёт совета перед всей командой",
      "Студийное время для участников — со скидкой 50%",
      "Взносы на развитие — только по решению большинства",
    ],
  },
  {
    num: "04",
    title: "Этика",
    items: [
      "Запрет на дискриминацию в любой форме",
      "Конфиденциальность внутренних обсуждений",
      "Публичная критика другого участника — основание для исключения",
      "Решение конфликтов — через совет команды",
    ],
  },
];

const BONUS_TIERS = [
  {
    level: "STARTER",
    points: "0 — 499",
    color: "#666",
    perks: [
      "Доступ к студии со скидкой 50%",
      "Участие в командных событиях",
      "Базовая промо-поддержка релизов",
    ],
    featured: false,
  },
  {
    level: "CREW",
    points: "500 — 1499",
    color: "#999",
    perks: [
      "Всё из Starter",
      "2 бесплатных студийных часа в месяц",
      "Приоритетное бронирование залов",
      "Фича в командных плейлистах",
    ],
    featured: false,
  },
  {
    level: "CORE",
    points: "1500 — 3999",
    color: "#FFD000",
    perks: [
      "Всё из Crew",
      "5 бесплатных студийных часов в месяц",
      "Право голоса в ключевых решениях",
      "Персональное продвижение в соцсетях",
      "Участие в совете команды",
    ],
    featured: false,
  },
  {
    level: "LEGEND",
    points: "4000+",
    color: "#FFD000",
    perks: [
      "Всё из Core",
      "Неограниченное студийное время",
      "Co-founder права на совместные проекты",
      "Пожизненное членство в BANNDA82",
      "Именной сертификат основателя",
    ],
    featured: true,
  },
];

const HOW_TO_EARN = [
  { action: "Запись трека в студии BANNDA82", pts: "+50 pts" },
  { action: "Участие в командном мероприятии", pts: "+30 pts" },
  { action: "Совместный трек с участником команды", pts: "+100 pts" },
  { action: "Приведённый новый участник", pts: "+200 pts" },
  { action: "Релиз на стриминговых платформах", pts: "+150 pts" },
  { action: "Представление команды на внешних событиях", pts: "+80 pts" },
];

function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  const { ref, inView } = useInView();
  return (
    <section
      id={id}
      ref={ref}
      className={`transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} ${className}`}
    >
      {children}
    </section>
  );
}

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", about: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim()) return;
    setFormStatus("loading");
    try {
      const res = await fetch(SEND_APPLICATION_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFormStatus("success");
        setForm({ name: "", contact: "", about: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F5] font-ibm">
      <div className="grain" />

      {/* NAV */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#1a1a1a]" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3">
            <img src={LOGO_URL} alt="BANNDA82" className="h-10 w-auto" />
          </a>

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) =>
              item.label === "Вступить" ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-oswald text-sm tracking-widest uppercase bg-[#FFD000] text-[#0A0A0A] px-5 py-2 font-semibold hover:bg-white transition-colors"
                >
                  {item.label}
                </a>
              ) : (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-ibm text-sm text-[#666] hover:text-[#FFD000] transition-colors tracking-wider uppercase"
                >
                  {item.label}
                </a>
              )
            )}
          </div>

          <button
            className="md:hidden text-[#F5F5F5] p-2"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <Icon name={menuOpen ? "X" : "Menu"} size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-[#0D0D0D] border-t border-[#1a1a1a] px-6 py-6 flex flex-col gap-5">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`font-oswald text-lg uppercase tracking-widest ${
                  item.label === "Вступить" ? "text-[#FFD000]" : "text-[#888] hover:text-white"
                } transition-colors`}
              >
                {item.label}
              </a>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <div className="relative min-h-screen flex flex-col justify-end pb-20 px-6 md:px-16 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none" style={{ zIndex: 1 }}>
          <span
            className="font-oswald font-bold leading-none text-white"
            style={{
              opacity: 0.025,
              fontSize: "clamp(120px, 25vw, 380px)",
              letterSpacing: "-0.02em",
            }}
          >
            BANNDA
          </span>
        </div>

        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#FFD000]" style={{ zIndex: 2 }} />

        {/* Founder photo */}
        <div className="absolute right-0 bottom-0 top-0 w-[45%] md:w-[42%] hidden md:block" style={{ zIndex: 2 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" style={{ zIndex: 1 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/60" style={{ zIndex: 1 }} />
          <img
            src={FOUNDER_URL}
            alt="Основатель BANNDA82"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-10 right-8 text-right" style={{ zIndex: 2 }}>
            <span className="font-oswald text-[#FFD000] text-xl font-bold tracking-widest uppercase block">BANNGUN</span>
            <span className="font-ibm text-white text-sm opacity-70 block mt-1">Баннов Александр Анатольевич</span>
            <span className="font-ibm text-[#555] text-xs tracking-wider block mt-2">Основатель Nemezido Records</span>
            <span className="font-ibm text-[#555] text-xs tracking-wider block">Создатель системы BANNDA82</span>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto w-full" style={{ zIndex: 3 }}>
          <span className="font-ibm text-[#FFD000] text-xs tracking-[0.4em] uppercase mb-6 block animate-fade-up delay-100">
            Крымская музыкальная организация · Основана в 2024
          </span>

          <h1
            className="font-oswald font-bold leading-none text-white mb-8 animate-fade-up delay-200"
            style={{ fontSize: "clamp(56px, 11vw, 150px)", letterSpacing: "-0.01em" }}
          >
            BANNDA
            <span className="text-[#FFD000]">82</span>
          </h1>

          <div className="animate-fade-up delay-300 max-w-lg">
            <p className="font-ibm text-[#666] text-lg leading-relaxed mb-10">
              Студия звукозаписи. Команда музыкантов. Система поддержки.
              <br />
              Мы строим экосистему для тех, кто живёт музыкой.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 animate-fade-up delay-400">
            <a
              href="#join"
              className="font-oswald text-sm tracking-widest uppercase bg-[#FFD000] text-[#0A0A0A] px-8 py-4 font-bold hover:bg-white transition-colors inline-block text-center"
            >
              Вступить в команду
            </a>
            <a
              href="#ideology"
              className="font-oswald text-sm tracking-widest uppercase border border-[#2a2a2a] text-[#666] px-8 py-4 hover:border-[#FFD000] hover:text-[#FFD000] transition-colors inline-block text-center"
            >
              Узнать больше
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 right-8 flex items-center gap-3 text-[#333] animate-fade-in delay-700" style={{ zIndex: 3 }}>
          <span className="font-ibm text-xs tracking-widest uppercase">Скролл</span>
          <Icon name="ArrowDown" size={14} />
        </div>
      </div>

      {/* IDEOLOGY */}
      <Section id="ideology" className="py-28 px-6 md:px-16 border-t border-[#141414]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="font-ibm text-[#FFD000] text-xs tracking-[0.4em] uppercase mb-4 block">01 / Идеология</span>
            <h2 className="font-oswald font-bold text-5xl md:text-7xl text-white leading-none">
              Во что мы<br />верим
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#141414]">
            {IDEOLOGY.map((item, i) => (
              <div key={i} className="bg-[#0A0A0A] p-10 group hover:bg-[#0D0D0D] transition-colors">
                <div className="w-10 h-10 border border-[#222] flex items-center justify-center mb-6 group-hover:border-[#FFD000] transition-colors">
                  <Icon name={item.icon} fallback="Music" size={18} className="text-[#FFD000]" />
                </div>
                <h3 className="font-oswald text-xl font-semibold text-white mb-3 tracking-wide">{item.title}</h3>
                <p className="font-ibm text-[#555] leading-relaxed text-sm">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* STUDIO */}
      <Section id="studio" className="py-28 px-6 md:px-16 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <span className="font-ibm text-[#FFD000] text-xs tracking-[0.4em] uppercase mb-4 block">02 / Студия</span>
              <h2 className="font-oswald font-bold text-5xl md:text-7xl text-white leading-none mb-8">
                Наша<br />студия
              </h2>
              <p className="font-ibm text-[#555] leading-relaxed mb-10 text-sm">
                Собственная студия звукозаписи BANNDA82 — место, где рождаются треки. Профессиональное оборудование, акустически обработанные помещения и опытная команда — всё для того, чтобы ваш звук звучал так, как вы задумали.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-[2px] bg-[#FFD000]" />
                <span className="font-ibm text-[#444] text-xs tracking-widest uppercase">Доступно участникам команды</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a1a1a]">
              {STUDIO_FEATURES.map((f, i) => (
                <div key={i} className="bg-[#0D0D0D] p-8 hover:bg-[#111] transition-colors">
                  <span className="font-oswald text-[#FFD000] text-4xl font-bold block mb-3">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h4 className="font-oswald text-lg font-semibold text-white mb-2 tracking-wide">{f.title}</h4>
                  <p className="font-ibm text-[#444] text-sm leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* RULES */}
      <Section id="rules" className="py-28 px-6 md:px-16 border-t border-[#141414]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="font-ibm text-[#FFD000] text-xs tracking-[0.4em] uppercase mb-4 block">03 / Регламент</span>
            <h2 className="font-oswald font-bold text-5xl md:text-7xl text-white leading-none">
              Правила<br />команды
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {RULES.map((rule, i) => (
              <div key={i} className="border border-[#1a1a1a] p-8 hover:border-[#252525] transition-colors">
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="font-oswald text-[#FFD000] text-5xl font-bold leading-none" style={{ opacity: 0.3 }}>
                    {rule.num}
                  </span>
                  <h3 className="font-oswald text-2xl font-semibold text-white tracking-wide">{rule.title}</h3>
                </div>
                <ul className="space-y-3">
                  {rule.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3">
                      <span className="text-[#FFD000] mt-0.5 shrink-0 font-ibm">—</span>
                      <span className="font-ibm text-[#666] text-sm leading-relaxed">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 p-8 border border-[#FFD000]/15 bg-[#FFD000]/3">
            <div className="flex items-start gap-4">
              <Icon name="AlertTriangle" size={18} className="text-[#FFD000] shrink-0 mt-0.5" />
              <p className="font-ibm text-[#555] text-sm leading-relaxed">
                Нарушение регламента рассматривается советом команды. За систематические нарушения предусмотрено временное отстранение или исключение. Регламент пересматривается ежегодно и утверждается голосованием участников уровня CORE и выше.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* BONUSES */}
      <Section id="bonuses" className="py-28 px-6 md:px-16 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="font-ibm text-[#FFD000] text-xs tracking-[0.4em] uppercase mb-4 block">04 / Бонусная программа</span>
            <h2 className="font-oswald font-bold text-5xl md:text-7xl text-white leading-none">
              Расти<br />вместе с нами
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1a1a1a] mb-14">
            {BONUS_TIERS.map((tier, i) => (
              <div
                key={i}
                className={`p-8 flex flex-col relative ${tier.featured ? "bg-[#0F0F00]" : "bg-[#0D0D0D]"} hover:bg-[#111] transition-colors`}
              >
                {tier.featured && (
                  <span className="absolute top-4 right-4 font-oswald text-[10px] tracking-widest uppercase bg-[#FFD000] text-[#0A0A0A] px-2 py-1 font-bold">
                    ТОП
                  </span>
                )}
                <div className="mb-6">
                  <h3 className="font-oswald text-2xl font-bold mb-1" style={{ color: tier.color }}>
                    {tier.level}
                  </h3>
                  <span className="font-ibm text-[#333] text-xs tracking-widest">{tier.points} баллов</span>
                </div>
                <ul className="space-y-3 flex-1">
                  {tier.perks.map((perk, j) => (
                    <li key={j} className="flex items-start gap-2">
                      <Icon name="Check" size={13} className="mt-0.5 shrink-0" style={{ color: tier.color }} />
                      <span className="font-ibm text-[#555] text-xs leading-relaxed">{perk}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-oswald text-xl font-semibold text-white mb-6 tracking-wide uppercase">
              Как зарабатывать баллы
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-[#1a1a1a]">
              {HOW_TO_EARN.map((item, i) => (
                <div key={i} className="bg-[#0D0D0D] p-6 flex items-center justify-between gap-4 hover:bg-[#111] transition-colors">
                  <span className="font-ibm text-[#555] text-sm">{item.action}</span>
                  <span className="font-oswald text-[#FFD000] font-bold text-lg shrink-0">{item.pts}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* JOIN */}
      <Section id="join" className="py-28 px-6 md:px-16 border-t border-[#141414]">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-xl">
            <span className="font-ibm text-[#FFD000] text-xs tracking-[0.4em] uppercase mb-4 block">05 / Вступление</span>
            <h2 className="font-oswald font-bold text-5xl md:text-7xl text-white leading-none mb-8">
              Стань частью<br />
              <span className="text-[#FFD000]">BANNDA82</span>
            </h2>
            <p className="font-ibm text-[#555] leading-relaxed mb-10 text-sm">
              Заполни заявку — совет команды свяжется с тобой в течение 3 рабочих дней. Мы открыты для музыкантов любых жанров и уровня подготовки.
            </p>

            {formStatus === "success" ? (
              <div className="border border-[#FFD000] px-6 py-8 text-center">
                <p className="font-oswald text-[#FFD000] text-2xl font-bold mb-2">Заявка отправлена!</p>
                <p className="font-ibm text-[#555] text-sm">Совет команды свяжется с тобой в течение 3 рабочих дней.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="space-y-4 mb-8">
                  <input
                    type="text"
                    placeholder="Твоё имя / псевдоним"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                    className="w-full bg-transparent border border-[#1a1a1a] text-[#F5F5F5] placeholder-[#333] px-5 py-4 font-ibm text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                  />
                  <input
                    type="text"
                    placeholder="Контакт (Telegram / телефон)"
                    value={form.contact}
                    onChange={e => setForm(f => ({ ...f, contact: e.target.value }))}
                    required
                    className="w-full bg-transparent border border-[#1a1a1a] text-[#F5F5F5] placeholder-[#333] px-5 py-4 font-ibm text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                  />
                  <textarea
                    placeholder="Расскажи о себе: жанр, инструменты, опыт"
                    rows={4}
                    value={form.about}
                    onChange={e => setForm(f => ({ ...f, about: e.target.value }))}
                    className="w-full bg-transparent border border-[#1a1a1a] text-[#F5F5F5] placeholder-[#333] px-5 py-4 font-ibm text-sm focus:outline-none focus:border-[#FFD000] transition-colors resize-none"
                  />
                </div>

                {formStatus === "error" && (
                  <p className="font-ibm text-red-500 text-sm mb-4">Что-то пошло не так. Попробуй ещё раз.</p>
                )}

                <button
                  type="submit"
                  disabled={formStatus === "loading"}
                  className="font-oswald text-sm tracking-widest uppercase bg-[#FFD000] text-[#0A0A0A] px-10 py-4 font-bold hover:bg-white transition-colors w-full sm:w-auto disabled:opacity-50"
                >
                  {formStatus === "loading" ? "Отправляем..." : "Отправить заявку"}
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-[#141414] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={LOGO_URL} alt="BANNDA82" className="h-8 w-auto" />
          <span className="font-ibm text-[#2a2a2a] text-xs tracking-widest uppercase">
            © 2024 BANNDA82 — Все права защищены
          </span>
          <div className="flex items-center gap-6">
            {[
              { l: "Идеология", h: "ideology" },
              { l: "Студия", h: "studio" },
              { l: "Регламент", h: "rules" },
              { l: "Бонусы", h: "bonuses" },
            ].map(({ l, h }) => (
              <a key={l} href={`#${h}`} className="font-ibm text-[#2a2a2a] text-xs hover:text-[#FFD000] transition-colors tracking-widest uppercase">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}