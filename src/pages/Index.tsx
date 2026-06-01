import { useState, useEffect, useRef } from "react";

import Icon from "@/components/ui/icon";



const SEND_APPLICATION_URL = "https://functions.poehali.dev/7e73bbac-1fcb-407f-880c-185014e33431";
const TEAM_URL = "https://functions.poehali.dev/5d2cea8e-d6d9-4b46-86e7-60b2f2b6c006";

const LOGO_URL = "https://cdn.poehali.dev/projects/65ca4191-e228-49b4-a044-e9d1a57b79de/bucket/b37bbf17-d860-439b-8a2b-931277c3e39c.png";
const FOUNDER_URL = "https://cdn.poehali.dev/projects/65ca4191-e228-49b4-a044-e9d1a57b79de/bucket/43c7d1d4-6696-4497-ba5f-668c893ad42c.jpg";

const NAV_ITEMS = [
  { label: "Идеология", href: "#ideology" },
  { label: "Студия", href: "#studio" },
  { label: "Регламент", href: "#rules" },
  { label: "Команда", href: "#bonuses" },
  { label: "Галерея", href: "#gallery" },
  { label: "Вступить", href: "#join" },
];

const IDEOLOGY = [
  {
    icon: "Users",
    title: "Один за всех",
    text: "Успех одного участника — это успех всей команды. BANNDA82 — творческое объединение, где каждый соратник, а не конкурент.",
  },
  {
    icon: "Star",
    title: "Качество без компромиссов",
    text: "Мы не выпускаем материал, за который стыдно. Музыка рождается в сообществе единомышленников, где стандарты не снижаются.",
  },
  {
    icon: "Zap",
    title: "Рост через действие",
    text: "Мы ценим практику выше теории. Каждый жанр имеет право на существование — уважение к звуку заложено в ДНК команды.",
  },
  {
    icon: "Shield",
    title: "Прозрачность и передай дальше",
    text: "Все финансовые и организационные процессы открыты для участников. Опытные помогают новичкам — так растёт вся команда.",
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
    title: "Условия приёма",
    items: [
      "Подача заявки (анкета + демо-материал: минимум 2 трека)",
      "Рекомендация одного действующего участника уровня Member+ (или прослушивание перед Советом)",
      "Личная встреча / собеседование с HR-координатором",
      "Пробный джем / совместная сессия",
      "Голосование Совета (простое большинство)",
      "Назначение ментора на период стажёрства",
    ],
  },
  {
    num: "02",
    title: "Студия",
    items: [
      "Бронирование через общий календарь — минимум за 48 часов",
      "Участники приоритетно занимают слоты в рабочее время",
      "Круглосуточный доступ к студии — для участников проекта",
      "Сведение, мастеринг, биты, аранжировки — у каждого своя скидка",
    ],
  },
  {
    num: "03",
    title: "Финансы",
    items: [
      "Распределение доходов от совместных проектов — по вкладу",
      "Вступительный взнос",
      "Ежемесячный членский взнос — у каждого свой",
      "Всегда можно запросить статистику",
      "Ежеквартальный отчёт совета перед командой",
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
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "scale(1) translateY(0)" : "scale(0.95) translateY(24px)",
        transition: "opacity 0.7s cubic-bezier(0.22,1,0.36,1), transform 0.7s cubic-bezier(0.22,1,0.36,1)",
      }}
    >
      {children}
    </section>
  );
}

type TeamMember = { id: number; name: string; real: string; role: string };

function TeamMemberRow({ member, onDelete, adminMode }: { member: TeamMember; onDelete: (id: number) => void; adminMode: boolean }) {
  const [open, setOpen] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleToggle = () => {
    if (animating) return;
    if (!open) {
      setOpen(true);
      setAnimating(true);
      setVisible(false);
      setTimeout(() => setVisible(true), 10);
      setTimeout(() => setAnimating(false), 350);
    } else {
      setAnimating(true);
      setVisible(false);
      setTimeout(() => { setOpen(false); setAnimating(false); }, 300);
    }
  };

  return (
    <div className="bg-[#0D0D0D] hover:bg-[#111] transition-colors">
      <button
        onClick={handleToggle}
        className="w-full flex items-center justify-between px-8 py-6 text-left"
      >
        <div className="flex items-center gap-6">
          <span className="font-oswald text-[#FFD000] text-lg font-bold tracking-widest uppercase">{member.name}</span>
          <span className="font-ibm text-[#444] text-xs tracking-widest uppercase hidden sm:block">{member.role}</span>
        </div>
        <Icon name={open ? "ChevronUp" : "ChevronDown"} size={18} className="text-[#FFD000] shrink-0" />
      </button>
      {open && (
        <div
          className="px-8 pb-6 border-t border-[#1a1a1a]"
          style={{
            transition: "opacity 0.3s ease, transform 0.3s ease",
            opacity: visible ? 1 : 0,
            transform: visible ? "scale(1)" : "scale(0.93)",
            transformOrigin: "top center",
          }}
        >
          <div className="pt-5 flex flex-col gap-2">
            <span className="font-ibm text-[#F5F5F5] text-sm">{member.real}</span>
            <span className="font-ibm text-[#555] text-xs tracking-widest uppercase sm:hidden">{member.role}</span>
            {adminMode && (
              <button
                onClick={() => onDelete(member.id)}
                className="mt-2 font-ibm text-xs text-red-500 hover:text-red-400 text-left"
              >
                Удалить участника
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const GALLERY_PHOTOS = [
  "https://cdn.poehali.dev/projects/65ca4191-e228-49b4-a044-e9d1a57b79de/bucket/43c7d1d4-6696-4497-ba5f-668c893ad42c.jpg",
  "https://cdn.poehali.dev/projects/65ca4191-e228-49b4-a044-e9d1a57b79de/bucket/e90db170-1c2b-466f-9e37-a03bc4a37585.jpg",
  "https://cdn.poehali.dev/projects/65ca4191-e228-49b4-a044-e9d1a57b79de/bucket/960f7617-9b70-44c7-9e41-3c142acf6e27.png",
  "https://cdn.poehali.dev/projects/65ca4191-e228-49b4-a044-e9d1a57b79de/bucket/dfde49e1-db44-4e92-a3a0-94ff0718a670.jpg",
  "https://cdn.poehali.dev/projects/65ca4191-e228-49b4-a044-e9d1a57b79de/bucket/01bf8128-106e-42ed-9af7-b59d8f1ac5eb.jpg",
];

export default function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [form, setForm] = useState({ name: "", contact: "", about: "" });
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [lightbox, setLightbox] = useState<string | null>(null);

  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [adminMode, setAdminMode] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [adminError, setAdminError] = useState("");
  const [newMember, setNewMember] = useState({ name: "", real: "", role: "" });
  const [addingMember, setAddingMember] = useState(false);
  const [addError, setAddError] = useState("");

  useEffect(() => {
    fetch(TEAM_URL)
      .then(r => r.json())
      .then(data => setTeamMembers(data.members || []))
      .catch(() => {});
  }, []);

  async function handleAdminLogin() {
    setAdminError("");
    const res = await fetch(TEAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: adminPassword, action: "check" }),
    });
    const data = await res.json();
    if (res.status === 403 || data.error) {
      setAdminError("Неверный пароль");
    } else {
      setAdminMode(true);
      setShowAdminLogin(false);
    }
  }

  async function handleAddMember() {
    if (!newMember.name.trim() || !newMember.real.trim()) return;
    setAddingMember(true);
    setAddError("");
    const res = await fetch(TEAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newMember, password: adminPassword, action: "add" }),
    });
    const data = await res.json();
    if (data.ok) {
      setTeamMembers(m => [...m, { id: data.id, ...newMember }]);
      setNewMember({ name: "", real: "", role: "" });
    } else {
      setAddError(data.error || "Ошибка");
    }
    setAddingMember(false);
  }

  async function handleDeleteMember(id: number) {
    await fetch(TEAM_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", id, password: adminPassword }),
    });
    setTeamMembers(m => m.filter(x => x.id !== id));
  }

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
          <a href="#" />

          <div className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) =>
              item.label === "Вступить" ? (
                <a
                  key={item.label}
                  href={item.href}
                  className="font-oswald text-sm tracking-widest uppercase bg-[#FFD000] text-[#0A0A0A] px-5 py-2 font-semibold hover:bg-white transition-colors"
                  style={{ display: "inline-block", transition: "transform 0.2s ease, background 0.2s ease" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.07)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
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
          <div
            className="md:hidden bg-[#0D0D0D] border-t border-[#1a1a1a] px-6 py-6 flex flex-col gap-5"
            style={{
              animation: "zoomIn 0.28s cubic-bezier(0.22,1,0.36,1) both",
            }}
          >
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
        <div className="absolute right-0 bottom-0 top-0 w-[45%] md:w-[42%]" style={{ zIndex: 2 }}>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0A] via-[#0A0A0A]/30 to-transparent" style={{ zIndex: 1, pointerEvents: "none" }} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A]/60" style={{ zIndex: 1, pointerEvents: "none" }} />
          <img
            src={FOUNDER_URL}
            alt="Основатель BANNDA82"
            className="w-full h-full object-cover object-top"
          />
          <div className="absolute bottom-10 right-8 text-right" style={{ zIndex: 10 }}>
            <a
              href="https://vk.ru/banngun"
              target="_blank"
              rel="noopener noreferrer"
              className="font-oswald text-[#FFD000] text-xl font-bold tracking-widest uppercase block cursor-pointer"
              style={{ display: "inline-block", transition: "transform 0.2s ease, text-decoration 0.2s ease" }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1.1)"; (e.currentTarget as HTMLElement).style.textDecoration = "underline"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = "scale(1)"; (e.currentTarget as HTMLElement).style.textDecoration = "none"; }}
            >
              BANNGUN
            </a>
            <span className="font-ibm text-white text-sm opacity-70 block mt-1">Баннов Александр Анатольевич</span>
            <span className="font-ibm text-[#555] text-xs tracking-wider block mt-2">Основатель Nemezido Records</span>
            <span className="font-ibm text-[#555] text-xs tracking-wider block">Создатель системы BANNDA82</span>
            <div className="flex gap-2 mt-4 justify-end">
              {GALLERY_PHOTOS.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`Фото ${i + 1}`}
                  onClick={() => setLightbox(src)}
                  className="w-20 h-20 object-cover border border-[#2a2a2a] hover:border-[#FFD000] transition-colors cursor-pointer hover-zoom"
                />
              ))}
            </div>
          </div>
        </div>

        <div className="relative max-w-7xl mx-auto w-full" style={{ zIndex: 3 }}>
          <span className="font-ibm text-[#FFD000] text-xs tracking-[0.4em] uppercase mb-6 block animate-fade-up delay-100">
            Крымская музыкальная организация · Основана в 2026
          </span>

          <h1
            className="font-oswald font-bold leading-none text-white mb-4 animate-fade-up delay-200"
            style={{ fontSize: "clamp(56px, 11vw, 150px)", letterSpacing: "-0.01em" }}
          >
            BANNDA
            <span className="text-[#FFD000]">82</span>
          </h1>

          <p className="font-oswald font-bold text-[#FFD000] uppercase tracking-widest mb-6 animate-fade-up delay-250" style={{ fontSize: "clamp(18px, 2.5vw, 36px)" }}>
            Первый крымский музыкальный лейбл
          </p>

          <div className="mb-8 animate-fade-up delay-280">
            <img src={LOGO_URL} alt="BANNDA82" style={{ height: 120, width: "auto", mixBlendMode: "multiply", filter: "contrast(1.1)" }} />
          </div>

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
              style={{ transition: "transform 0.2s ease, background 0.2s ease" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
            >
              Вступить в команду
            </a>
            <a
              href="#ideology"
              className="font-oswald text-sm tracking-widest uppercase border border-[#2a2a2a] text-[#666] px-8 py-4 hover:border-[#FFD000] hover:text-[#FFD000] transition-colors inline-block text-center"
              style={{ transition: "transform 0.2s ease, color 0.2s ease, border-color 0.2s ease" }}
              onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"}
              onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
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
            <h2 className="font-oswald font-bold text-5xl md:text-7xl text-white leading-none mb-8">
              Во что мы<br />верим
            </h2>
            <p className="font-ibm text-[#555] leading-relaxed text-sm max-w-2xl">
              BANNDA82 — это творческое объединение музыкантов, созданное для взаимной поддержки, профессионального роста и совместного создания музыки. Мы верим, что музыка рождается в сообществе единомышленников, где каждый участник — не конкурент, а соратник.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[#141414]">
            {IDEOLOGY.map((item, i) => (
              <div key={i} className="bg-[#0A0A0A] p-10 group hover:bg-[#0D0D0D] transition-colors hover-zoom-sm">
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
                Собственная студия звукозаписи{" "}
                <a href="https://vk.ru/nemezidorecords" target="_blank" rel="noopener noreferrer" className="text-[#FFD000] hover:underline">
                  NEMEZIDO RECORDS
                </a>
                {" "}— место, где рождаются треки. Профессиональное оборудование, акустически обработанные помещения и опытная команда — всё для того, чтобы ваш звук звучал так, как вы задумали.
              </p>
              <div className="flex items-center gap-4 mb-10">
                <div className="w-10 h-[2px] bg-[#FFD000]" />
                <span className="font-ibm text-[#444] text-xs tracking-widest uppercase">Доступно участникам команды</span>
              </div>
              <div className="flex flex-col items-start gap-3">
                <span className="font-ibm text-[#444] text-xs tracking-widest uppercase">Перейти в студию</span>
                <a href="https://vk.ru/nemezidorecords" target="_blank" rel="noopener noreferrer">
                  <img
                    src="https://cdn.poehali.dev/projects/65ca4191-e228-49b4-a044-e9d1a57b79de/bucket/4d55cce6-1afb-4652-a653-5e140f52cce0.png"
                    alt="QR NEMEZIDO RECORDS"
                    className="w-36 h-36 hover:opacity-80 transition-opacity"
                  />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-[#1a1a1a]">
              {STUDIO_FEATURES.map((f, i) => (
                <div key={i} className="bg-[#0D0D0D] p-8 hover:bg-[#111] transition-colors hover-zoom-sm">
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
              <div key={i} className="border border-[#1a1a1a] p-8 hover:border-[#252525] transition-colors hover-zoom-sm">
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

      {/* TEAM */}
      <Section id="bonuses" className="py-28 px-6 md:px-16 bg-[#0D0D0D]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="font-ibm text-[#FFD000] text-xs tracking-[0.4em] uppercase mb-4 block">04 / Команда</span>
            <h2 className="font-oswald font-bold text-5xl md:text-7xl text-white leading-none">
              Наша<br />команда
            </h2>
          </div>

          <div className="flex flex-col gap-px bg-[#1a1a1a] mb-8">
            {teamMembers.length === 0 && (
              <div className="bg-[#0D0D0D] px-8 py-6 font-ibm text-[#444] text-sm">Участники не добавлены</div>
            )}
            {teamMembers.map((member) => (
              <TeamMemberRow key={member.id} member={member} adminMode={adminMode} onDelete={handleDeleteMember} />
            ))}
          </div>

          {!adminMode ? (
            <button
              onClick={() => setShowAdminLogin(v => !v)}
              className="font-ibm text-xs text-[#333] hover:text-[#FFD000] transition-colors tracking-widest uppercase"
            >
              + Управление командой
            </button>
          ) : (
            <button
              onClick={() => { setAdminMode(false); setShowAdminLogin(false); }}
              className="font-ibm text-xs text-[#FFD000] tracking-widest uppercase"
            >
              Выйти из режима управления
            </button>
          )}

          {showAdminLogin && !adminMode && (
            <div
              className="mt-4 flex gap-3 items-center"
              style={{ animation: "zoomIn 0.25s cubic-bezier(0.22,1,0.36,1) both" }}
            >
              <input
                type="password"
                placeholder="Пароль"
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                className="bg-transparent border border-[#1a1a1a] text-[#F5F5F5] placeholder-[#333] px-4 py-2 font-ibm text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
              />
              <button
                onClick={handleAdminLogin}
                className="font-oswald text-xs tracking-widest uppercase bg-[#FFD000] text-[#0A0A0A] px-4 py-2 font-bold hover:bg-white transition-colors"
                style={{ transition: "transform 0.2s ease, background 0.2s ease" }}
                onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.07)"}
                onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
              >
                Войти
              </button>
              {adminError && <span className="font-ibm text-red-500 text-xs">{adminError}</span>}
            </div>
          )}

          {adminMode && (
            <div className="mt-6 border border-[#1a1a1a] p-6">
              <h4 className="font-oswald text-white text-lg font-semibold mb-4 tracking-wide uppercase">Добавить участника</h4>
              <div className="flex flex-col gap-3 max-w-md">
                <input
                  type="text"
                  placeholder="Псевдоним (например: BANNGUN)"
                  value={newMember.name}
                  onChange={e => setNewMember(m => ({ ...m, name: e.target.value }))}
                  className="bg-transparent border border-[#1a1a1a] text-[#F5F5F5] placeholder-[#333] px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Настоящее имя"
                  value={newMember.real}
                  onChange={e => setNewMember(m => ({ ...m, real: e.target.value }))}
                  className="bg-transparent border border-[#1a1a1a] text-[#F5F5F5] placeholder-[#333] px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                />
                <input
                  type="text"
                  placeholder="Роль (например: Битмейкер)"
                  value={newMember.role}
                  onChange={e => setNewMember(m => ({ ...m, role: e.target.value }))}
                  className="bg-transparent border border-[#1a1a1a] text-[#F5F5F5] placeholder-[#333] px-4 py-3 font-ibm text-sm focus:outline-none focus:border-[#FFD000] transition-colors"
                />
                <button
                  onClick={handleAddMember}
                  disabled={addingMember}
                  className="font-oswald text-sm tracking-widest uppercase bg-[#FFD000] text-[#0A0A0A] px-6 py-3 font-bold hover:bg-white transition-colors disabled:opacity-50"
                  style={{ transition: "transform 0.2s ease, background 0.2s ease" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.05)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
                >
                  {addingMember ? "Добавляем..." : "Добавить"}
                </button>
                {addError && <span className="font-ibm text-red-500 text-xs">{addError}</span>}
              </div>
            </div>
          )}
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
              Заполни заявку — совет команды свяжется с тобой в течение 3 рабочих дней. В ответ придет файл с условиями, регламентом, правилами оплаты и взаимодействия. Мы открыты для музыкантов любых жанров и уровня подготовки.
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
                  style={{ transition: "transform 0.2s ease, background 0.2s ease" }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.transform = "scale(1.03)"}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.transform = "scale(1)"}
                >
                  {formStatus === "loading" ? "Отправляем..." : "Отправить заявку"}
                </button>
              </form>
            )}
          </div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section id="gallery" className="py-28 px-6 md:px-16 border-t border-[#141414]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <span className="font-ibm text-[#FFD000] text-xs tracking-[0.4em] uppercase mb-4 block">06 / Галерея</span>
            <h2 className="font-oswald font-bold text-5xl md:text-7xl text-white leading-none">
              Фото
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[#1a1a1a]">
            {GALLERY_PHOTOS.map((src, i) => (
              <div
                key={i}
                className="aspect-square overflow-hidden cursor-pointer group bg-[#0D0D0D]"
                onClick={() => setLightbox(src)}
              >
                <img
                  src={src}
                  alt={`Галерея ${i + 1}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="border-t border-[#141414] py-10 px-6 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <img src={LOGO_URL} alt="BANNDA82" style={{ height: 48, width: "auto", mixBlendMode: "multiply", filter: "contrast(1.1)" }} />
          <div className="flex flex-col items-center gap-1">
            <span className="font-ibm text-[#2a2a2a] text-xs tracking-widest uppercase">
              © 2026 BANNDA82 — Все права защищены
            </span>
            <span className="font-ibm text-[#333] text-xs flex items-center gap-1">
              <Icon name="MapPin" size={11} className="text-[#FFD000]" />
              Симферополь, ул. Тренева 21
            </span>
          </div>
          <div className="flex items-center gap-6">
            {[
              { l: "Идеология", h: "ideology" },
              { l: "Студия", h: "studio" },
              { l: "Регламент", h: "rules" },
              { l: "Команда", h: "bonuses" },
            ].map(({ l, h }) => (
              <a key={l} href={`#${h}`} className="font-ibm text-[#2a2a2a] text-xs hover:text-[#FFD000] transition-colors tracking-widest uppercase">
                {l}
              </a>
            ))}
          </div>
        </div>
      </footer>

      {lightbox && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[9999] cursor-pointer"
          style={{ animation: "zoomIn 0.22s cubic-bezier(0.22,1,0.36,1) both" }}
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-8 text-white text-3xl font-bold hover:text-[#FFD000] transition-colors"
            onClick={() => setLightbox(null)}
          >
            ✕
          </button>
          <img
            src={lightbox}
            alt="Просмотр"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            style={{ animation: "zoomIn 0.3s cubic-bezier(0.22,1,0.36,1) both" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}