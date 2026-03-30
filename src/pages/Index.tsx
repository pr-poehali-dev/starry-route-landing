import { useState, useEffect, useRef } from 'react';
import StarField from '@/components/StarField';
import Icon from '@/components/ui/icon';

type Step = 'hero' | 1 | 2 | 3 | 4 | 5 | 'success';

interface OrderData {
  name: string;
  style: string;
  distance: string;
  time: string;
}

const STYLES = [
  {
    id: 'cosmic-blue',
    label: 'Космический синий',
    gradient: 'from-blue-950 via-blue-800 to-cyan-700',
    glow: 'shadow-[0_0_30px_rgba(59,130,246,0.4)]',
    border: 'border-blue-500/40',
    accent: '#3b82f6',
  },
  {
    id: 'cosmic-violet',
    label: 'Космический фиолетовый',
    gradient: 'from-violet-950 via-purple-800 to-fuchsia-700',
    glow: 'shadow-[0_0_30px_rgba(124,58,237,0.4)]',
    border: 'border-violet-500/40',
    accent: '#7c3aed',
  },
  {
    id: 'dark-navy',
    label: 'Темно-синий',
    gradient: 'from-slate-950 via-slate-800 to-blue-900',
    glow: 'shadow-[0_0_30px_rgba(15,23,42,0.6)]',
    border: 'border-slate-500/40',
    accent: '#334155',
  },
];

const DISTANCES = ['3 км', '5 км', '10 км', '21.1 км'];

const HOW_IT_WORKS = [
  { icon: 'Pencil', num: '01', title: 'Оставьте данные', desc: 'Введите имя, выберите стиль, дистанцию и ваше время забега.' },
  { icon: 'Palette', num: '02', title: 'Оплатите заказ', desc: 'Безопасная оплата. Ваши данные под защитой.' },
  { icon: 'Layers', num: '03', title: 'Создаём картину', desc: 'Художник создаёт уникальное произведение с 3D-маршрутом.' },
  { icon: 'Package', num: '04', title: 'Получите шедевр', desc: 'Доставим печатную версию или пришлём цифровой файл.' },
];

const FAQS = [
  { q: 'Сколько времени занимает создание картины?', a: 'Обычно 3–5 рабочих дней. После готовности мы свяжемся с вами.' },
  { q: 'В каком формате доставляется картина?', a: 'Доступны цифровой файл высокого разрешения и печатная версия с доставкой по России.' },
  { q: 'Можно ли заказать картину в подарок?', a: 'Да! Укажите имя получателя и любое время — мы оформим всё как подарок.' },
  { q: 'Что такое 3D-маршрут?', a: 'Это художественная визуализация GPS-трека вашего забега в объёмном, минималистичном стиле.' },
  { q: 'Возможен ли возврат?', a: 'Если картина не соответствует описанию — мы бесплатно переделаем или вернём деньги.' },
];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

function FadeSection({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function StepCard({
  step,
  order,
  setOrder,
  onNext,
  onBack,
}: {
  step: 1 | 2 | 3 | 4 | 5;
  order: OrderData;
  setOrder: (d: Partial<OrderData>) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const [localName, setLocalName] = useState(order.name);
  const [localTime, setLocalTime] = useState(order.time);

  if (step === 1) {
    return (
      <div className="animate-slide-in">
        <p className="text-blue-400/70 font-body text-sm uppercase tracking-widest mb-4">Шаг 1 из 4</p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-2">Ваше имя</h2>
        <p className="text-slate-400 font-body mb-10">Оно будет напечатано на картине</p>
        <input
          type="text"
          value={localName}
          onChange={e => setLocalName(e.target.value)}
          placeholder="Иван Иванов"
          className="w-full bg-transparent border-b border-blue-500/40 text-white text-2xl font-display py-4 outline-none placeholder:text-slate-600 focus:border-blue-400 transition-colors"
          autoFocus
        />
        <div className="flex gap-4 mt-12">
          <button onClick={onBack} className="btn-outline-neon px-8 py-3 rounded-full font-body text-sm">Назад</button>
          <button
            onClick={() => { setOrder({ name: localName }); onNext(); }}
            disabled={!localName.trim()}
            className="btn-neon px-10 py-3 rounded-full font-body text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            Далее
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="animate-slide-in">
        <p className="text-blue-400/70 font-body text-sm uppercase tracking-widest mb-4">Шаг 2 из 4</p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-2">Стиль картины</h2>
        <p className="text-slate-400 font-body mb-8">Выберите цветовую палитру</p>
        <div className="grid grid-cols-1 gap-3">
          {STYLES.map(s => (
            <button
              key={s.id}
              onClick={() => setOrder({ style: s.id })}
              className={`relative overflow-hidden rounded-2xl p-4 text-left transition-all duration-300 border ${
                order.style === s.id ? `${s.border} ${s.glow}` : 'border-white/5 hover:border-white/15'
              }`}
              style={{ background: order.style === s.id ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.02)' }}
            >
              <div className={`w-full h-14 rounded-xl bg-gradient-to-r ${s.gradient} mb-3 opacity-80`} />
              <span className="font-body text-white/90 font-medium text-sm">{s.label}</span>
              {order.style === s.id && (
                <span className="absolute top-4 right-4 w-5 h-5 rounded-full flex items-center justify-center bg-blue-500">
                  <Icon name="Check" size={11} className="text-white" />
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex gap-4 mt-8">
          <button onClick={onBack} className="btn-outline-neon px-8 py-3 rounded-full font-body text-sm">Назад</button>
          <button onClick={onNext} disabled={!order.style} className="btn-neon px-10 py-3 rounded-full font-body text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">Далее</button>
        </div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="animate-slide-in">
        <p className="text-blue-400/70 font-body text-sm uppercase tracking-widest mb-4">Шаг 3 из 4</p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-2">Дистанция</h2>
        <p className="text-slate-400 font-body mb-10">Какую дистанцию вы пробежали?</p>
        <div className="grid grid-cols-2 gap-4">
          {DISTANCES.map(d => (
            <button
              key={d}
              onClick={() => setOrder({ distance: d })}
              className={`rounded-2xl py-8 text-center font-display text-3xl font-light transition-all duration-300 border ${
                order.distance === d
                  ? 'border-blue-500/60 text-blue-300 shadow-[0_0_30px_rgba(59,130,246,0.25)] bg-blue-500/10'
                  : 'border-white/5 text-white/60 hover:border-white/20 hover:text-white/80'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
        <div className="flex gap-4 mt-10">
          <button onClick={onBack} className="btn-outline-neon px-8 py-3 rounded-full font-body text-sm">Назад</button>
          <button onClick={onNext} disabled={!order.distance} className="btn-neon px-10 py-3 rounded-full font-body text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none">Далее</button>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="animate-slide-in">
        <p className="text-blue-400/70 font-body text-sm uppercase tracking-widest mb-4">Шаг 4 из 4</p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-2">Ваше время</h2>
        <p className="text-slate-400 font-body mb-10">Формат: часы:минуты:секунды</p>
        <input
          type="text"
          value={localTime}
          onChange={e => setLocalTime(e.target.value)}
          placeholder="00:45:30"
          className="w-full bg-transparent border-b border-blue-500/40 text-white text-3xl font-display py-4 outline-none placeholder:text-slate-600 focus:border-blue-400 transition-colors tracking-widest"
          autoFocus
        />
        <div className="flex gap-4 mt-12">
          <button onClick={onBack} className="btn-outline-neon px-8 py-3 rounded-full font-body text-sm">Назад</button>
          <button
            onClick={() => { setOrder({ time: localTime }); onNext(); }}
            disabled={!localTime.trim()}
            className="btn-neon px-10 py-3 rounded-full font-body text-sm disabled:opacity-30 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
          >
            Перейти к оплате
          </button>
        </div>
      </div>
    );
  }

  if (step === 5) {
    const styleName = STYLES.find(s => s.id === order.style)?.label || order.style;
    return (
      <div className="animate-slide-in">
        <p className="text-blue-400/70 font-body text-sm uppercase tracking-widest mb-4">Подтверждение</p>
        <h2 className="font-display text-4xl md:text-5xl font-light text-white mb-8">Ваш заказ</h2>
        <div className="space-y-4 mb-8">
          {[
            { label: 'Имя', val: order.name },
            { label: 'Стиль', val: styleName },
            { label: 'Дистанция', val: order.distance },
            { label: 'Время', val: order.time },
          ].map(row => (
            <div key={row.label} className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="font-body text-slate-400 text-sm uppercase tracking-wider">{row.label}</span>
              <span className="font-display text-xl text-white">{row.val}</span>
            </div>
          ))}
        </div>
        <div className="glass rounded-2xl p-5 mb-8 flex items-center justify-between">
          <span className="font-body text-slate-300 text-sm">Стоимость</span>
          <span className="font-display text-3xl text-white glow-text">2 990 ₽</span>
        </div>
        <div className="flex gap-4">
          <button onClick={onBack} className="btn-outline-neon px-8 py-3 rounded-full font-body text-sm">Назад</button>
          <button onClick={onNext} className="btn-neon px-10 py-3 rounded-full font-body text-sm flex-1 flex items-center justify-center gap-2">
            <Icon name="CreditCard" size={16} />
            Оплатить
          </button>
        </div>
      </div>
    );
  }

  return null;
}

const MOCK_ORDERS = [
  { id: 1, name: 'Анна Михайлова', style: 'Космический синий', distance: '10 км', time: '00:52:14', status: 'paid' },
  { id: 2, name: 'Дмитрий Козлов', style: 'Космический фиолетовый', distance: '21.1 км', time: '01:58:40', status: 'pending' },
  { id: 3, name: 'Юлия Васильева', style: 'Темно-синий', distance: '5 км', time: '00:28:05', status: 'paid' },
  { id: 4, name: 'Сергей Попов', style: 'Космический синий', distance: '3 км', time: '00:18:22', status: 'processing' },
];

export default function Index() {
  const [step, setStep] = useState<Step>('hero');
  const [order, setOrderRaw] = useState<OrderData>({ name: '', style: '', distance: '', time: '' });
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [adminMode, setAdminMode] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [heroVisible, setHeroVisible] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const setOrder = (d: Partial<OrderData>) => setOrderRaw(prev => ({ ...prev, ...d }));

  const startJourney = () => {
    setStep(1);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
  };

  const nextStep = () => {
    const map: Record<string, Step> = { '1': 2, '2': 3, '3': 4, '4': 5, '5': 'success' };
    setStep(prev => map[String(prev)] ?? prev);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const prevStep = () => {
    const map: Record<string, Step> = { '2': 1, '3': 2, '4': 3, '5': 4 };
    const next = map[String(step)];
    if (next) setStep(next);
    else setStep('hero');
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 50);
  };

  const filtered = statusFilter === 'all' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === statusFilter);

  if (adminMode) {
    return (
      <div className="min-h-screen gradient-bg font-body">
        <StarField />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="font-display text-4xl text-white">Панель заказов</h1>
              <p className="text-slate-400 text-sm mt-1">Управление заказами картин</p>
            </div>
            <button onClick={() => setAdminMode(false)} className="btn-outline-neon px-5 py-2 rounded-full text-sm flex items-center gap-2">
              <Icon name="ArrowLeft" size={14} />
              На сайт
            </button>
          </div>

          <div className="flex gap-3 mb-8 flex-wrap">
            {[
              { val: 'all', label: 'Все заказы' },
              { val: 'paid', label: 'Оплачено' },
              { val: 'pending', label: 'Ожидает' },
              { val: 'processing', label: 'В работе' },
            ].map(f => (
              <button
                key={f.val}
                onClick={() => setStatusFilter(f.val)}
                className={`px-5 py-2 rounded-full text-sm font-body transition-all ${
                  statusFilter === f.val ? 'btn-neon' : 'btn-outline-neon'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="glass rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    {['Имя клиента', 'Стиль', 'Дистанция', 'Время', 'Статус'].map(h => (
                      <th key={h} className="text-left py-4 px-6 text-slate-400 text-xs uppercase tracking-widest font-body">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(o => (
                    <tr key={o.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                      <td className="py-4 px-6 text-white font-body">{o.name}</td>
                      <td className="py-4 px-6 text-slate-300 text-sm">{o.style}</td>
                      <td className="py-4 px-6 text-slate-300 text-sm">{o.distance}</td>
                      <td className="py-4 px-6 text-slate-300 font-display text-lg">{o.time}</td>
                      <td className="py-4 px-6">
                        <span className={`px-3 py-1 rounded-full text-xs font-body font-medium ${
                          o.status === 'paid' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                          o.status === 'processing' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                          'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                        }`}>
                          {o.status === 'paid' ? 'Оплачено' : o.status === 'processing' ? 'В работе' : 'Ожидает'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div className="py-16 text-center text-slate-500 font-body">Нет заказов</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg relative overflow-x-hidden">
      <StarField />

      {/* Nav */}
      <nav className="relative z-20 flex items-center justify-between px-6 md:px-12 py-6">
        <div className="font-display text-xl text-white tracking-wide">
          <span className="text-neon">RUN</span>ART
        </div>
        <div className="flex items-center gap-6">
          <a href="#gallery" className="font-body text-sm text-slate-400 hover:text-white transition-colors hidden md:block">Примеры</a>
          <a href="#how" className="font-body text-sm text-slate-400 hover:text-white transition-colors hidden md:block">Как это работает</a>
          <a href="#contacts" className="font-body text-sm text-slate-400 hover:text-white transition-colors hidden md:block">Контакты</a>
          <button onClick={() => setAdminMode(true)} className="font-body text-xs text-slate-700 hover:text-slate-500 transition-colors">
            ···
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative z-10 min-h-[90vh] flex flex-col items-center justify-center text-center px-6 py-20">
        {step === 'hero' && (
          <div style={{
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? 'translateY(0)' : 'translateY(30px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}>
            <p className="font-body text-blue-400/50 text-xs uppercase tracking-[0.35em] mb-8 font-light">
              Персонализированные картины
            </p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-white leading-[1.1] mb-6 tracking-tight">
              Создай свою уникальную<br />
              <span className="text-violet-glow italic font-light">картину маршрута забега</span>
            </h1>
            <p className="font-body text-slate-500 text-base md:text-lg mb-12 max-w-md mx-auto leading-relaxed font-light">
              Преврати свой забег в произведение искусства
            </p>
            <button
              onClick={startJourney}
              className="btn-neon px-10 py-3.5 rounded-sm font-body text-sm tracking-widest uppercase"
            >
              Создать картину
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="animate-slide-in text-center max-w-lg mx-auto">
            <div className="w-20 h-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-8">
              <Icon name="Check" size={32} className="text-emerald-400" />
            </div>
            <h2 className="font-display text-5xl font-light text-white mb-4">Спасибо за заказ!</h2>
            <p className="font-body text-slate-400 text-lg mb-10 leading-relaxed">
              Ваша картина уже в работе.<br />Мы свяжемся с вами в течение 24 часов.
            </p>
            <button
              onClick={() => { setStep('hero'); setOrderRaw({ name: '', style: '', distance: '', time: '' }); }}
              className="btn-neon px-10 py-3 rounded-full font-body text-sm"
            >
              Вернуться на главную
            </button>
          </div>
        )}

        {typeof step === 'number' && (
          <div ref={formRef} className="w-full max-w-md mx-auto mt-6">
            <div className="glass rounded-3xl p-8 md:p-10 text-left">
              <div className="flex gap-2 mb-8">
                {[1, 2, 3, 4].map(n => (
                  <div
                    key={n}
                    className="h-0.5 flex-1 rounded-full transition-all duration-500"
                    style={{
                      background: (step as number) >= n
                        ? 'linear-gradient(90deg, #3b82f6, #7c3aed)'
                        : 'rgba(255,255,255,0.08)',
                    }}
                  />
                ))}
              </div>
              <StepCard
                step={step as 1 | 2 | 3 | 4 | 5}
                order={order}
                setOrder={setOrder}
                onNext={nextStep}
                onBack={prevStep}
              />
            </div>
          </div>
        )}
      </section>

      {/* Gallery */}
      <section id="gallery" className="relative z-10 px-6 md:px-12 py-24">
        <FadeSection>
          <div className="text-center mb-16">
            <p className="font-body text-blue-400/50 text-xs uppercase tracking-[0.35em] mb-4 font-light">Наши работы</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white tracking-tight">Примеры картин</h2>
          </div>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {STYLES.map((s, i) => (
            <FadeSection key={s.id} delay={i * 120}>
              <div className={`group relative rounded-3xl overflow-hidden aspect-[3/4] cursor-pointer transition-all duration-500 hover:-translate-y-3 border ${s.border}`}
                style={{ boxShadow: 'none' }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = `0 0 40px ${s.accent}44`)}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${s.gradient} opacity-90`} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <svg viewBox="0 0 200 280" className="w-4/5 opacity-50 group-hover:opacity-80 transition-opacity duration-500" fill="none">
                    <path
                      d="M100 240 C60 220 30 180 40 140 C50 100 90 80 100 60 C110 40 130 20 150 40 C170 60 160 100 140 120 C120 140 80 150 90 180 C100 210 140 200 150 220"
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeDasharray="4 4"
                    />
                    <circle cx="100" cy="240" r="5" fill="white" opacity="0.8" />
                    <circle cx="100" cy="60" r="4" fill="white" opacity="0.5" />
                    <circle cx="150" cy="220" r="4" fill="white" opacity="0.4" />
                    {[40, 80, 120, 160, 200].map((y, idx) => (
                      <circle key={idx} cx={80 + idx * 10} cy={y} r="1.5" fill="white" opacity="0.3" />
                    ))}
                  </svg>
                  <div className="absolute bottom-6 left-6 right-6">
                    <p className="font-body text-white/40 text-xs uppercase tracking-widest mb-1">Стиль</p>
                    <p className="font-display text-white text-xl">{s.label}</p>
                  </div>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative z-10 px-6 md:px-12 py-24">
        <FadeSection>
          <div className="text-center mb-16">
            <p className="font-body text-blue-400/50 text-xs uppercase tracking-[0.35em] mb-4 font-light">Процесс</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white tracking-tight">Как это работает</h2>
          </div>
        </FadeSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {HOW_IT_WORKS.map((item, i) => (
            <FadeSection key={item.num} delay={i * 100}>
              <div className="glass rounded-2xl p-7 h-full hover:border-blue-500/20 transition-all duration-300 group">
                <div className="font-display text-6xl text-white/5 group-hover:text-white/10 transition-colors mb-4 leading-none">{item.num}</div>
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-5">
                  <Icon name={item.icon} size={18} className="text-blue-400" />
                </div>
                <h3 className="font-display text-xl text-white mb-3">{item.title}</h3>
                <p className="font-body text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative z-10 px-6 md:px-12 py-16">
        <FadeSection>
          <div className="max-w-2xl mx-auto text-center py-8 border-t border-b border-white/5">
            <h2 className="font-display text-3xl md:text-4xl font-light text-white mb-4 tracking-tight">
              Каждый забег — это история.<br /><span className="text-violet-glow italic font-light">Пусть твоя останется навсегда.</span>
            </h2>
            <p className="font-body text-slate-500 mb-8 text-sm font-light">Получи персональную картину с 3D-маршрутом</p>
            <button onClick={startJourney} className="btn-neon px-10 py-3.5 rounded-sm font-body text-sm tracking-widest uppercase">
              Создать картину
            </button>
          </div>
        </FadeSection>
      </section>

      {/* FAQ */}
      <section className="relative z-10 px-6 md:px-12 py-24">
        <FadeSection>
          <div className="text-center mb-16">
            <p className="font-body text-blue-400/50 text-xs uppercase tracking-[0.35em] mb-4 font-light">Вопросы</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white tracking-tight">Частые вопросы</h2>
          </div>
        </FadeSection>

        <div className="max-w-2xl mx-auto space-y-3">
          {FAQS.map((faq, i) => (
            <FadeSection key={i} delay={i * 60}>
              <div
                className="glass rounded-2xl px-7 py-5 cursor-pointer hover:border-blue-500/20 transition-all duration-300 group"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-body text-white/90 font-medium group-hover:text-white transition-colors">{faq.q}</span>
                  <Icon
                    name={openFaq === i ? 'Minus' : 'Plus'}
                    size={16}
                    className="text-blue-400 shrink-0 transition-transform duration-300"
                  />
                </div>
                <div
                  style={{
                    maxHeight: openFaq === i ? '200px' : '0',
                    opacity: openFaq === i ? 1 : 0,
                    marginTop: openFaq === i ? '12px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.35s ease, opacity 0.3s ease, margin 0.3s ease',
                  }}
                >
                  <p className="font-body text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                </div>
              </div>
            </FadeSection>
          ))}
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="relative z-10 px-6 md:px-12 py-24">
        <FadeSection>
          <div className="text-center mb-16">
            <p className="font-body text-blue-400/50 text-xs uppercase tracking-[0.35em] mb-4 font-light">Связаться</p>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white tracking-tight">Контакты</h2>
          </div>
        </FadeSection>

        <div className="max-w-lg mx-auto">
          <FadeSection>
            <div className="grid grid-cols-1 gap-4">
              {[
                { icon: 'Mail', label: 'Email', val: 'hello@runart.ru' },
                { icon: 'MessageCircle', label: 'Telegram', val: '@runart' },
                { icon: 'Instagram', label: 'Instagram', val: '@runart.studio' },
              ].map(c => (
                <div
                  key={c.label}
                  className="glass rounded-2xl p-6 flex items-center gap-5 hover:border-blue-500/20 transition-all duration-300 group cursor-pointer"
                >
                  <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0 group-hover:bg-blue-500/20 transition-colors">
                    <Icon name={c.icon} size={18} className="text-blue-400" />
                  </div>
                  <div>
                    <p className="font-body text-slate-500 text-xs uppercase tracking-wider">{c.label}</p>
                    <p className="font-body text-white/90 font-medium">{c.val}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeSection>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 md:px-12 py-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display text-lg text-white/40">
          <span className="text-neon">RUN</span>ART
        </div>
        <p className="font-body text-slate-600 text-xs">© 2024 RunArt. Все права защищены.</p>
        <div className="flex gap-6">
          <a href="#" className="font-body text-slate-600 text-xs hover:text-slate-400 transition-colors">Конфиденциальность</a>
          <a href="#" className="font-body text-slate-600 text-xs hover:text-slate-400 transition-colors">Условия</a>
        </div>
      </footer>
    </div>
  );
}