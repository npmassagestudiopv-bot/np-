export interface ServiceDetail {
  slug: string;
  bg: {
    title: string;
    subtitle: string;
    heroDescription: string;
    fullDescription: string;
    benefits: string[];
    techniques: string[];
    whoFor: string[];
    faqs: { q: string; a: string }[];
    relatedServices: string[];
    relatedBlogSlugs: string[];
  };
  en: {
    title: string;
    subtitle: string;
    heroDescription: string;
    fullDescription: string;
    benefits: string[];
    techniques: string[];
    whoFor: string[];
    faqs: { q: string; a: string }[];
    relatedServices: string[];
    relatedBlogSlugs: string[];
  };
}

export const serviceDetails: ServiceDetail[] = [
  {
    slug: 'klasicheski-masazh',
    bg: {
      title: 'Класически и релаксиращ масаж',
      subtitle: 'Традиционна техника за пълна релаксация на тялото и ума',
      heroDescription: 'Класическият масаж в NP Massage Studio е основата на професионалната масажна терапия — 60 минути пълна релаксация във Велико Търново и Павликени.',
      fullDescription: `Класическият масаж е най-популярната и универсална масажна процедура, предлагана в NP Massage Studio — професионален масажен салон във Велико Търново и Павликени. Той съчетава петте основни масажни техники, разработени и усъвършенствани през вековете: ефлораж (поглаждане), петрисаж (месене), фрикция (триене), тапотемент (потупване) и вибрация.

По време на 60-минутната сесия опитният терапевт работи систематично върху всички основни мускулни групи — гръб, рамене, врат, ръце, крака и стъпала. Процедурата започва с нежни ефлоражи за загряване на тъканите, преминава през по-дълбоки петрисажи за освобождаване на мускулното напрежение и завършва с успокояващи движения за пълна релаксация.

Всеки класически масаж в NP Massage Studio е персонализиран според индивидуалните нужди на клиента. Терапевтът адаптира интензитета — от много нежен за хора, чувствителни към натиск, до по-дълбок за тези с хронично мускулно напрежение. Използваме висококачествени натурални масла, които подхранват кожата и улесняват плавните движения.

Класическият масаж е идеален избор за хора, които търсят пълна релаксация, облекчаване на стреса, подобряване на кръвообращението и общо благосъстояние. Подходящ е както за първо посещение в масажен салон, така и за редовна поддръжка на физическото и психическото здраве.`,
      benefits: [
        'Подобрява кръвообращението и снабдяването на тъканите с кислород',
        'Стимулира лимфната система и подпомага извеждането на токсини',
        'Намалява нивата на кортизол (хормона на стреса) с до 30%',
        'Освобождава ендорфини и окситоцин — хормоните на щастието',
        'Облекчава мускулното напрежение и подобрява гъвкавостта',
        'Подобрява качеството на съня и намалява тревожността',
        'Намалява главоболието, причинено от напрежение',
        'Подпомага възстановяването след физическо натоварване',
      ],
      techniques: [
        'Ефлораж — нежни, плавни поглаждания за загряване на мускулите',
        'Петрисаж — дълбоко месене за освобождаване на напрежението',
        'Фрикция — кръгови движения с натиск за разбиване на възли',
        'Тапотемент — ритмично потупване за стимулиране на кръвообращението',
        'Вибрация — фини трептящи движения за дълбока релаксация',
      ],
      whoFor: [
        'Хора с хроничен стрес и напрежение от ежедневието',
        'Офис работници със заседнал начин на живот',
        'Всеки, който търси пълна релаксация и възстановяване',
        'Хора с безсъние или тревожност',
        'Клиенти, които посещават масаж за първи път',
        'Всеки, който иска да подобри общото си физическо състояние',
      ],
      faqs: [
        { q: 'Колко продължава класическият масаж?', a: 'Класическият масаж в NP Massage Studio продължава 60 минути. Това време е оптимално за работа върху всички основни мускулни групи и постигане на пълна релаксация.' },
        { q: 'Болезнен ли е класическият масаж?', a: 'Класическият масаж не трябва да бъде болезнен. Терапевтът адаптира интензитета според вашите предпочитания — от много нежен до среден или по-дълбок натиск. Винаги можете да комуникирате с терапевта по време на процедурата.' },
        { q: 'Колко често трябва да ходя на класически масаж?', a: 'За оптимални резултати препоръчваме веднъж седмично или поне веднъж на две седмици. При хроничен стрес или мускулно напрежение може да се наложи по-често в началото.' },
        { q: 'Трябва ли да се подготвя по някакъв начин преди масажа?', a: 'Препоръчваме да пристигнете 5-10 минути по-рано, да не ядете тежка храна поне час преди процедурата и да пиете достатъчно вода. Носете удобни дрехи.' },
        { q: 'Кой е най-добрият масаж за пълна релаксация и облекчаване на стреса?', a: 'Класическият масаж е най-добрият избор за пълна релаксация и облекчаване на стреса. Той съчетава нежни, плавни движения върху цялото тяло, които активират парасимпатиковата нервна система, намаляват кортизола и отделят ендорфини. За още по-дълбок релакс можете да комбинирате класическия масаж с ароматерапия, която добавя терапевтичния ефект на етеричните масла.' },
        { q: 'Какви са ползите от редовния класически масаж?', a: 'Редовният класически масаж (поне веднъж седмично) подобрява кръвообращението, намалява хроничното мускулно напрежение, подобрява качеството на съня, засилва имунната система чрез стимулиране на лимфния дренаж и намалява нивата на тревожност и стрес. Много клиенти на NP Massage Studio споделят, че след 4-5 редовни сесии се чувстват значително по-енергични и с по-малко болки.' },
        { q: 'Каква е разликата между класическия и спортния масаж?', a: 'Класическият масаж е релаксиращ и работи с умерен натиск върху цялото тяло, идеален за стрес и общо благосъстояние. Спортният масаж е по-интензивен, използва дълбоки техники и разтягания, и е създаден специално за спортисти и хора с активен начин на живот. Ако търсите релакс — изберете класически; ако тренирате редовно — спортният е за вас.' },
      ],
      relatedServices: ['sporten-masazh', 'aromaterapiya', 'masazh-na-grab'],
      relatedBlogSlugs: ['polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni', 'kolko-chesto-masazh-rutina-np-massage', 'masazh-stres-oblekchavane-veliko-tarnovo', 'kolko-vreme-trae-edin-masazh', 'razlika-lecheben-sporten-masazh', 'naj-dobar-masazh-veliko-tarnovo', 'polzi-ot-redoven-masazh'],
    },
    en: {
      title: 'Classical & Relaxing Massage',
      subtitle: 'Traditional technique for complete relaxation of body and mind',
      heroDescription: 'Classical massage at NP Massage Studio is the foundation of professional massage therapy — 60 minutes of complete relaxation in Veliko Tarnovo and Pavlikeni.',
      fullDescription: `Classical massage is the most popular and versatile massage procedure offered at NP Massage Studio — a professional massage salon in Veliko Tarnovo and Pavlikeni. It combines the five basic massage techniques developed and perfected over centuries: effleurage (stroking), petrissage (kneading), friction (rubbing), tapotement (tapping), and vibration.

During the 60-minute session, the experienced therapist works systematically on all major muscle groups — back, shoulders, neck, arms, legs, and feet. The procedure begins with gentle effleurages to warm the tissues, transitions to deeper petrissages to release muscle tension, and ends with soothing movements for complete relaxation.

Each classical massage at NP Massage Studio is personalized according to the individual needs of the client. The therapist adjusts the intensity — from very gentle for people sensitive to pressure, to deeper for those with chronic muscle tension. We use high-quality natural oils that nourish the skin and facilitate smooth movements.

Classical massage is an ideal choice for people seeking complete relaxation, stress relief, improved blood circulation, and overall well-being. It is suitable for both first visits to a massage salon and regular maintenance of physical and mental health.`,
      benefits: [
        'Improves blood circulation and oxygen supply to tissues',
        'Stimulates the lymphatic system and helps remove toxins',
        'Reduces cortisol (stress hormone) levels by up to 30%',
        'Releases endorphins and oxytocin — the happiness hormones',
        'Relieves muscle tension and improves flexibility',
        'Improves sleep quality and reduces anxiety',
        'Reduces tension-related headaches',
        'Supports recovery after physical exertion',
      ],
      techniques: [
        'Effleurage — gentle, flowing strokes to warm the muscles',
        'Petrissage — deep kneading to release tension',
        'Friction — circular pressure movements to break down knots',
        'Tapotement — rhythmic tapping to stimulate circulation',
        'Vibration — fine oscillating movements for deep relaxation',
      ],
      whoFor: [
        'People with chronic stress and daily tension',
        'Office workers with a sedentary lifestyle',
        'Anyone seeking complete relaxation and recovery',
        'People with insomnia or anxiety',
        'First-time massage clients',
        'Anyone looking to improve their overall physical condition',
      ],
      faqs: [
        { q: 'How long does a classical massage last?', a: 'A classical massage at NP Massage Studio lasts 60 minutes. This time is optimal for working on all major muscle groups and achieving complete relaxation.' },
        { q: 'Is classical massage painful?', a: 'Classical massage should not be painful. The therapist adjusts the intensity according to your preferences — from very gentle to medium or deeper pressure. You can always communicate with the therapist during the procedure.' },
        { q: 'How often should I get a classical massage?', a: 'For optimal results, we recommend once a week or at least once every two weeks. For chronic stress or muscle tension, more frequent sessions may be needed initially.' },
        { q: 'Should I prepare in any way before the massage?', a: 'We recommend arriving 5-10 minutes early, not eating heavy food at least an hour before the procedure, and drinking enough water. Wear comfortable clothing.' },
        { q: 'What is the best massage for complete relaxation and stress relief?', a: 'Classical massage is the best choice for complete relaxation and stress relief. It combines gentle, flowing movements across the entire body that activate the parasympathetic nervous system, reduce cortisol, and release endorphins. For even deeper relaxation, you can combine classical massage with aromatherapy, which adds the therapeutic effect of essential oils.' },
        { q: 'What are the benefits of regular classical massage?', a: 'Regular classical massage (at least once a week) improves blood circulation, reduces chronic muscle tension, improves sleep quality, strengthens the immune system by stimulating lymphatic drainage, and reduces anxiety and stress levels. Many NP Massage Studio clients report feeling significantly more energetic and with less pain after 4-5 regular sessions.' },
        { q: 'What is the difference between classical and sports massage?', a: 'Classical massage is relaxing and works with moderate pressure on the entire body, ideal for stress and general well-being. Sports massage is more intensive, uses deep techniques and stretching, and is specifically created for athletes and people with an active lifestyle. If you seek relaxation — choose classical; if you train regularly — sports is for you.' },
      ],
      relatedServices: ['sporten-masazh', 'aromaterapiya', 'masazh-na-grab'],
      relatedBlogSlugs: ['polzi-klasicheski-masazh-veliko-tarnovo-pavlikeni', 'kolko-chesto-masazh-rutina-np-massage', 'masazh-stres-oblekchavane-veliko-tarnovo', 'kolko-vreme-trae-edin-masazh', 'razlika-lecheben-sporten-masazh', 'naj-dobar-masazh-veliko-tarnovo', 'polzi-ot-redoven-masazh'],
    },
  },
  {
    slug: 'sporten-masazh',
    bg: {
      title: 'Спортен и терапевтичен масаж',
      subtitle: 'Целенасочена терапия за спортисти и активни хора',
      heroDescription: 'Спортният масаж в NP Massage Studio е специализирана терапия за мускулно възстановяване, превенция на травми и подобряване на спортното представяне във Велико Търново и Павликени.',
      fullDescription: `Спортният масаж е високоспециализирана масажна терапия, предназначена за спортисти, фитнес ентусиасти и хора с активен начин на живот. В NP Massage Studio — масажен салон във Велико Търново и Павликени — предлагаме професионален спортен масаж, който комбинира дълбока тъканна работа, миофасциално освобождаване и спортно разтягане за оптимални резултати.

Процедурата продължава 60 минути и започва с детайлна консултация, по време на която терапевтът обсъжда вашия тренировъчен режим, спортни цели, текущи болки или травми и зони на напрежение. Въз основа на тази информация се изготвя персонализиран план за сесията.

Спортният масаж използва комбинация от техники: дълбока фрикция за разбиване на мускулни adhesions (сраствания), компресия за подобряване на кръвообращението, пасивно и активно разтягане за увеличаване на обхвата на движение, и тригерна точкова терапия за облекчаване на специфични болкови точки.

Редовният спортен масаж не само ускорява възстановяването след тренировка, но и намалява риска от спортни травми, подобрява гъвкавостта и еластичността на мускулите и подпомага премахването на метаболитни отпадъци (млечна киселина) след интензивно натоварване. Професионални атлети, аматьори и хора, които тренират редовно във фитнеса, ще усетят значителна разлика в представянето и възстановяването си.`,
      benefits: [
        'Ускорява мускулното възстановяване след тренировка или състезание',
        'Намалява мускулната болка и скованост (DOMS) с до 50%',
        'Подобрява обхвата на движение и гъвкавостта на ставите',
        'Предотвратява спортни травми чрез намаляване на мускулния дисбаланс',
        'Разбива мускулни adhesions и белегна тъкан',
        'Подобрява циркулацията и ускорява отстраняването на метаболитни отпадъци',
        'Намалява тревожността преди състезание и подобрява фокуса',
        'Подпомага рехабилитацията след спортни травми',
      ],
      techniques: [
        'Дълбока тъканна фрикция — интензивно триене за разбиване на мускулни възли',
        'Миофасциално освобождаване — работа със съединителната тъкан',
        'Спортно разтягане — пасивно и активно за увеличаване на гъвкавостта',
        'Тригерна точкова терапия — натиск върху специфични болкови точки',
        'Компресия — ритмичен натиск за стимулиране на кръвообращението',
      ],
      whoFor: [
        'Професионални спортисти и атлети',
        'Фитнес ентусиасти и хора, трениращи редовно',
        'Бегачи, колоездачи и триатлонисти',
        'Хора с хронично мускулно напрежение от физическа работа',
        'Спортисти, възстановяващи се след травма',
        'Всеки, който иска да подобри спортното си представяне',
      ],
      faqs: [
        { q: 'Каква е разликата между спортен и класически масаж?', a: 'Спортният масаж е по-интензивен и целенасочен. Използва по-дълбок натиск и специфични техники като разтягане и тригерна терапия, докато класическият масаж е по-релаксиращ и работи с по-плавни движения.' },
        { q: 'Трябва ли да съм професионален спортист за спортен масаж?', a: 'Не! Спортният масаж е подходящ за всеки, който тренира редовно — дори и аматьорски. Ако бягате, ходите на фитнес или карате колело, спортният масаж ще ви помогне да се възстановявате по-бързо.' },
        { q: 'Кога е най-добре да си направя спортен масаж — преди или след тренировка?', a: 'За възстановяване — след тренировка (в рамките на 24-48 часа). За подготовка преди състезание — 2-3 дни преди това, с по-лек натиск. Попитайте вашия терапевт в NP Massage Studio за персонализиран график.' },
        { q: 'Колко често трябва да правя спортен масаж?', a: 'При интензивни тренировки — 1-2 пъти седмично. При умерена активност — веднъж на 1-2 седмици. По време на състезателен сезон може да се наложи по-често.' },
        { q: 'Помага ли спортният масаж при болки в кръста и мускулни схващания?', a: 'Да, спортният масаж е много ефективен при болки в кръста и мускулни схващания. Чрез дълбока тъканна работа и миофасциално освобождаване, терапевтът разбива мускулни възли (trigger points) и облекчава напрежението, което причинява болката. При хронични болки в кръста обаче, препоръчваме да се консултирате първо с лекар.' },
        { q: 'Каква е разликата между спортен и лечебен масаж?', a: 'Спортният масаж е проактивен — подобрява спортната функция, ускорява възстановяването и предотвратява травми. Лечебният (терапевтичен) масаж е реактивен — третира вече съществуващи здравословни проблеми като дископатия, схванат врат или ставни болки. И двата вида използват дълбоки техники, но с различна цел и подход.' },
        { q: 'Колко време след тренировка трябва да изчакам за спортен масаж?', a: 'Оптималното време е 2-6 часа след тренировка, когато мускулите са все още топли, но острата умора е преминала. Можете да направите масаж и на следващия ден. Не препоръчваме спортен масаж веднага след изключително интензивна тренировка или състезание — дайте на тялото си 24 часа да се успокои.' },
      ],
      relatedServices: ['klasicheski-masazh', 'masazh-na-grab', 'aromaterapiya'],
      relatedBlogSlugs: ['sporten-masazh-vazstanovyavane-veliko-tarnovo', 'kolko-chesto-masazh-rutina-np-massage', 'masazh-stres-oblekchavane-veliko-tarnovo', 'razlika-lecheben-sporten-masazh', 'kolko-vreme-trae-edin-masazh', 'koj-masazh-pri-bolki-v-krasta'],
    },
    en: {
      title: 'Sports & Therapeutic Massage',
      subtitle: 'Targeted therapy for athletes and active people',
      heroDescription: 'Sports massage at NP Massage Studio is a specialized therapy for muscle recovery, injury prevention, and improved athletic performance in Veliko Tarnovo and Pavlikeni.',
      fullDescription: `Sports massage is a highly specialized massage therapy designed for athletes, fitness enthusiasts, and people with an active lifestyle. At NP Massage Studio — a massage salon in Veliko Tarnovo and Pavlikeni — we offer professional sports massage that combines deep tissue work, myofascial release, and sports stretching for optimal results.

The procedure lasts 60 minutes and begins with a detailed consultation, during which the therapist discusses your training regimen, sports goals, current pains or injuries, and areas of tension. Based on this information, a personalized session plan is created.

Sports massage uses a combination of techniques: deep friction to break down muscle adhesions, compression to improve blood circulation, passive and active stretching to increase range of motion, and trigger point therapy to relieve specific pain points.

Regular sports massage not only accelerates post-workout recovery but also reduces the risk of sports injuries, improves muscle flexibility and elasticity, and helps remove metabolic waste (lactic acid) after intense exertion. Professional athletes, amateurs, and people who train regularly at the gym will feel a significant difference in their performance and recovery.`,
      benefits: [
        'Accelerates muscle recovery after training or competition',
        'Reduces muscle pain and stiffness (DOMS) by up to 50%',
        'Improves range of motion and joint flexibility',
        'Prevents sports injuries by reducing muscle imbalance',
        'Breaks down muscle adhesions and scar tissue',
        'Improves circulation and speeds up removal of metabolic waste',
        'Reduces pre-competition anxiety and improves focus',
        'Supports rehabilitation after sports injuries',
      ],
      techniques: [
        'Deep tissue friction — intense rubbing to break down muscle knots',
        'Myofascial release — work on connective tissue',
        'Sports stretching — passive and active to increase flexibility',
        'Trigger point therapy — pressure on specific pain points',
        'Compression — rhythmic pressure to stimulate circulation',
      ],
      whoFor: [
        'Professional athletes and sportspeople',
        'Fitness enthusiasts and regular exercisers',
        'Runners, cyclists, and triathletes',
        'People with chronic muscle tension from physical work',
        'Athletes recovering from injury',
        'Anyone looking to improve their athletic performance',
      ],
      faqs: [
        { q: "What's the difference between sports and classical massage?", a: 'Sports massage is more intense and targeted. It uses deeper pressure and specific techniques such as stretching and trigger therapy, while classical massage is more relaxing and works with smoother movements.' },
        { q: 'Do I need to be a professional athlete for sports massage?', a: 'No! Sports massage is suitable for anyone who trains regularly — even casually. If you run, go to the gym, or cycle, sports massage will help you recover faster.' },
        { q: 'When is the best time to get a sports massage — before or after training?', a: 'For recovery — after training (within 24-48 hours). For pre-competition preparation — 2-3 days before, with lighter pressure. Ask your therapist at NP Massage Studio for a personalized schedule.' },
        { q: 'How often should I get a sports massage?', a: 'With intense training — 1-2 times per week. With moderate activity — once every 1-2 weeks. During the competitive season, more frequent sessions may be needed.' },
        { q: 'Does sports massage help with lower back pain and muscle stiffness?', a: 'Yes, sports massage is very effective for lower back pain and muscle stiffness. Through deep tissue work and myofascial release, the therapist breaks down muscle knots (trigger points) and relieves tension causing the pain. For chronic lower back pain, however, we recommend consulting a doctor first.' },
        { q: 'What is the difference between sports and therapeutic massage?', a: 'Sports massage is proactive — it improves sports function, accelerates recovery, and prevents injuries. Therapeutic massage is reactive — it treats existing health problems such as discopathy, stiff neck, or joint pain. Both types use deep techniques, but with different goals and approaches.' },
        { q: 'How long after training should I wait for a sports massage?', a: 'The optimal time is 2-6 hours after training, when muscles are still warm but acute fatigue has passed. You can also get a massage the next day. We do not recommend sports massage immediately after extremely intense training or competition — give your body 24 hours to settle.' },
      ],
      relatedServices: ['klasicheski-masazh', 'masazh-na-grab', 'aromaterapiya'],
      relatedBlogSlugs: ['sporten-masazh-vazstanovyavane-veliko-tarnovo', 'kolko-chesto-masazh-rutina-np-massage', 'masazh-stres-oblekchavane-veliko-tarnovo', 'razlika-lecheben-sporten-masazh', 'kolko-vreme-trae-edin-masazh', 'koj-masazh-pri-bolki-v-krasta'],
    },
  },
  {
    slug: 'anticeluliten-masazh',
    bg: {
      title: 'Антицелулитен масаж',
      subtitle: 'Ефективна процедура за гладка и стегната кожа чрез специализирани техники',
      heroDescription: 'Антицелулитният масаж в NP Massage Studio е интензивна 40-минутна процедура за намаляване на целулита и подобряване на кожата във Велико Търново и Павликени.',
      fullDescription: `Антицелулитният масаж е една от най-търсените естетични процедури в NP Massage Studio — професионален масажен салон във Велико Търново и Павликени. Това е целенасочена, интензивна терапия, която работи върху проблемните зони — бедра, хълбоци, корем и седалище — за намаляване на видимия целулит и подобряване на текстурата и еластичността на кожата.

Процедурата продължава 40 минути и използва комбинация от дълбоки манипулации, специализиран антицелулитен масаж и лимфен дренаж. Терапевтът работи интензивно с продукти, съдържащи активни съставки като кофеин, ретинол, екстракт от зелен чай и етерични масла, които подпомагат разбиването на мастните депозити, стимулират микроциркулацията и подобряват лимфния дренаж.

Целулитът засяга над 90% от жените и значителен процент от мъжете, независимо от теглото и физическата активност. Той се образува, когато мастните клетки (адипоцити) се разширяват и натискат съединителната тъкан нагоре, докато фиброзните връзки я дърпат надолу, създавайки характерния неравен вид на "портокалова кожа".

Антицелулитният масаж работи на няколко нива: подобрява кръвообращението в засегнатите зони, стимулира лимфния дренаж за отстраняване на токсини и излишни течности, разбива мастните депозити и подобрява еластичността на съединителната тъкан. За оптимални резултати препоръчваме пакет от 10 процедури (175 €), който предлага значителна отстъпка спрямо единичните сесии (20 €).`,
      benefits: [
        'Намалява видимия целулит и подобрява текстурата на кожата',
        'Стимулира микроциркулацията в проблемните зони',
        'Подобрява лимфния дренаж и намалява задръжката на течности',
        'Разбива мастните депозити и подобрява метаболизма на мастните клетки',
        'Повишава еластичността и стегнатостта на кожата',
        'Подобрява тонуса и гладкостта на кожата',
        'Намалява усещането за тежест в краката',
      ],
      techniques: [
        'Дълбок петрисаж — интензивно месене на проблемните зони',
        'Лимфен дренаж — нежни, ритмични движения за оттичане на течности',
        'Фрикция с антицелулитен продукт — активно триене с активни съставки',
        'Мануална липолиза — техника за разбиване на мастни клетки',
        'Моделиращи движения — за оформяне на силуета',
      ],
      whoFor: [
        'Жени и мъже с видим целулит',
        'Хора, които искат да подобрят текстурата на кожата си',
        'Клиенти след бременност или отслабване',
        'Хора с намалена еластичност на кожата',
        'Всеки, който иска по-гладка и стегната кожа',
      ],
      faqs: [
        { q: 'Колко процедури са необходими за видими резултати?', a: 'Първите резултати се забелязват след 3-4 процедури. За оптимални и трайни резултати препоръчваме пакет от 10 процедури, комбиниран с правилно хранене, физическа активност и достатъчен прием на вода.' },
        { q: 'Болезнен ли е антицелулитният масаж?', a: 'Антицелулитният масаж е по-интензивен от класическия и може да причини лек дискомфорт при първите процедури, особено в зоните с повече целулит. С времето кожата се адаптира и усещането става по-приятно.' },
        { q: 'Колко често трябва да правя антицелулитен масаж?', a: 'За оптимални резултати — 2 пъти седмично. След постигане на желаните резултати — веднъж седмично или веднъж на две седмици за поддръжка.' },
        { q: 'Мога ли да комбинирам антицелулитен масаж с други процедури?', a: 'Да! Много клиенти комбинират антицелулитен масаж с класически масаж за релаксация или ароматерапия. Консултирайте се с терапевта в NP Massage Studio за персонализирана програма.' },
        { q: 'Какви са резултатите от антицелулитния масаж при редовна употреба?', a: 'При редовна употреба (2 пъти седмично, минимум 10 процедури) антицелулитният масаж видимо намалява портокаловата кожа, подобрява еластичността и стегнатостта на кожата, стимулира лимфния дренаж и подобрява микроциркулацията. Резултатите са трайни при поддържащ режим и здравословен начин на живот.' },
        { q: 'Помага ли антицелулитният масаж при отслабване?', a: 'Антицелулитният масаж не води директно до отслабване, но подобрява вида на кожата, намалява задръжката на течности и стимулира метаболизма на мастните клетки. В комбинация с правилно хранене и физическа активност, резултатите са значително по-добри.' },
      ],
      relatedServices: ['klasicheski-masazh', 'aromaterapiya', 'sporten-masazh'],
      relatedBlogSlugs: ['anticeluliten-masazh-rezultati-pavlikeni', 'kolko-chesto-masazh-rutina-np-massage', 'masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo', 'kolko-vreme-trae-edin-masazh'],
    },
    en: {
      title: 'Anti-cellulite Massage',
      subtitle: 'Effective procedure for smooth and firm skin using specialized techniques',
      heroDescription: 'Anti-cellulite massage at NP Massage Studio is an intensive 40-minute procedure for reducing cellulite and improving skin in Veliko Tarnovo and Pavlikeni.',
      fullDescription: `Anti-cellulite massage is one of the most sought-after aesthetic procedures at NP Massage Studio — a professional massage salon in Veliko Tarnovo and Pavlikeni. This is a targeted, intensive therapy that works on problem areas — thighs, hips, abdomen, and buttocks — to reduce visible cellulite and improve skin texture and elasticity.

The procedure lasts 40 minutes and uses a combination of deep manipulations, specialized anti-cellulite massage, and lymphatic drainage. The therapist works intensively with products containing active ingredients such as caffeine, retinol, green tea extract, and essential oils that help break down fat deposits, stimulate microcirculation, and improve lymphatic drainage.

Cellulite affects over 90% of women and a significant percentage of men, regardless of weight and physical activity. It forms when fat cells (adipocytes) expand and push connective tissue upward, while fibrous bands pull it downward, creating the characteristic uneven "orange peel" appearance.

Anti-cellulite massage works on several levels: improves blood circulation in affected areas, stimulates lymphatic drainage to remove toxins and excess fluids, breaks down fat deposits, and improves the elasticity of connective tissue. For optimal results, we recommend a package of 10 procedures (175 €), which offers a significant discount compared to individual sessions (20 €).`,
      benefits: [
        'Reduces visible cellulite and improves skin texture',
        'Stimulates microcirculation in problem areas',
        'Improves lymphatic drainage and reduces fluid retention',
        'Breaks down fat deposits and improves fat cell metabolism',
        'Increases skin elasticity and firmness',
        'Improves skin tone and smoothness',
        'Reduces the feeling of heaviness in the legs',
      ],
      techniques: [
        'Deep petrissage — intensive kneading of problem areas',
        'Lymphatic drainage — gentle, rhythmic movements for fluid drainage',
        'Friction with anti-cellulite product — active rubbing with active ingredients',
        'Manual lipolysis — technique for breaking down fat cells',
        'Sculpting movements — for body contouring',
      ],
      whoFor: [
        'Women and men with visible cellulite',
        'People looking to improve their skin texture',
        'Clients after pregnancy or weight loss',
        'People with reduced skin elasticity',
        'Anyone seeking smoother and firmer skin',
      ],
      faqs: [
        { q: 'How many procedures are needed for visible results?', a: 'First results are noticeable after 3-4 procedures. For optimal and lasting results, we recommend a package of 10 procedures combined with proper nutrition, physical activity, and adequate water intake.' },
        { q: 'Is anti-cellulite massage painful?', a: 'Anti-cellulite massage is more intense than classical massage and may cause slight discomfort during the first procedures, especially in areas with more cellulite. Over time, the skin adapts and the sensation becomes more pleasant.' },
        { q: 'How often should I get anti-cellulite massage?', a: 'For optimal results — 2 times per week. After achieving desired results — once a week or once every two weeks for maintenance.' },
        { q: 'Can I combine anti-cellulite massage with other procedures?', a: 'Yes! Many clients combine anti-cellulite massage with classical massage for relaxation or aromatherapy. Consult with the therapist at NP Massage Studio for a personalized program.' },
        { q: 'What are the results of anti-cellulite massage with regular use?', a: 'With regular use (2 times per week, minimum 10 procedures), anti-cellulite massage visibly reduces orange peel skin, improves skin elasticity and firmness, stimulates lymphatic drainage, and improves microcirculation. Results are lasting with a maintenance regimen and a healthy lifestyle.' },
        { q: 'Does anti-cellulite massage help with weight loss?', a: 'Anti-cellulite massage does not directly lead to weight loss, but it improves skin appearance, reduces fluid retention, and stimulates fat cell metabolism. Combined with proper nutrition and physical activity, results are significantly better.' },
      ],
      relatedServices: ['klasicheski-masazh', 'aromaterapiya', 'sporten-masazh'],
      relatedBlogSlugs: ['anticeluliten-masazh-rezultati-pavlikeni', 'kolko-chesto-masazh-rutina-np-massage', 'masazhi-veliko-tarnovo-pavlikeni-pulno-rukovodstvo', 'kolko-vreme-trae-edin-masazh'],
    },
  },
  {
    slug: 'aromaterapiya',
    bg: {
      title: 'Ароматерапия',
      subtitle: 'Съчетание на масаж и етерични масла за дълбок релакс и хармонизиране',
      heroDescription: 'Ароматерапията в NP Massage Studio е 60-минутно сетивно пътешествие с чисти етерични масла за пълно психо-емоционално балансиране във Велико Търново и Павликени.',
      fullDescription: `Ароматерапията е една от най-изтънчените и приятни процедури, които предлагаме в NP Massage Studio — масажен салон във Велико Търново и Павликени. Тя съчетава изкуството на масажа с науката за етеричните масла, създавайки мощен терапевтичен ефект, който работи едновременно на физическо, емоционално и психическо ниво.

Процедурата започва с персонализирана консултация, по време на която терапевтът обсъжда вашето текущо състояние — нива на стрес, качество на съня, енергийни нива, мускулно напрежение и емоционален баланс. Въз основа на тази информация се избира уникална комбинация от етерични масла:

• Лавандула — за дълбок релакс, по-добър сън и облекчаване на тревожността
• Евкалипт — за подобряване на дишането, облекчаване на синусови проблеми и пречистване
• Розмарин — за стимулиране на кръвообращението, паметта и концентрацията
• Цитрусови масла (портокал, бергамот, лимон) — за енергия, настроение и жизненост
• Иланг-иланг — за хормонален баланс и емоционална стабилност
• Чайено дърво — за пречистване и подкрепа на имунната система

Избраните масла се смесват с висококачествено базово масло (бадемово, жожоба или кокосово) и се затоплят до приятна температура. Самият масаж е нежен, плавен и ритмичен, с дълги ефлоражи, които позволяват на маслата да проникнат в кожата и да влязат в кръвообращението. Ароматите работят директно върху лимбичната система — най-старата част от мозъка, която контролира емоциите, паметта и хормоналния баланс.

60-минутната процедура е истинско сетивно пътешествие, което оставя тялото отпуснато, ума спокоен и духа балансиран. Ароматерапията в NP Massage Studio е особено ефективна при безсъние, тревожност, хроничен стрес, умора и емоционално прегаряне.`,
      benefits: [
        'Дълбок релакс чрез директно въздействие върху лимбичната система',
        'Подобрява качеството на съня и помага при безсъние',
        'Намалява тревожността и нивата на кортизол',
        'Повишава енергийните нива и подобрява настроението',
        'Подпомага имунната система чрез антибактериални свойства на маслата',
        'Облекчава дихателни проблеми и синусови инфекции',
        'Хармонизира хормоналния баланс',
        'Подобрява кръвообращението и подхранва кожата',
      ],
      techniques: [
        'Персонализирана маслена комбинация според нуждите на клиента',
        'Нежни ефлоражи по цялото тяло за равномерно нанасяне',
        'Кръгови движения за стимулиране на абсорбцията',
        'Ритмични петрисажи за дълбока мускулна релаксация',
        'Финална фаза на покой за пълно сетивно интегриране',
      ],
      whoFor: [
        'Хора с хроничен стрес и емоционално прегаряне',
        'Хора, страдащи от безсъние или неспокоен сън',
        'Клиенти с тревожност или депресивни състояния',
        'Хора, търсещи холистичен подход към здравето',
        'Всеки, който иска уникално сетивно изживяване',
        'Хора с дихателни проблеми или чести настинки',
      ],
      faqs: [
        { q: 'Какви етерични масла използвате?', a: 'В NP Massage Studio използваме 100% чисти, натурални етерични масла от проверени производители. Изборът включва лавандула, евкалипт, розмарин, цитрусови масла, иланг-иланг, чайено дърво и много други. Комбинацията се избира персонализирано според вашите нужди.' },
        { q: 'Мога ли да избера сам маслата?', a: 'Да, можете да изразите предпочитания. Терапевтът ще ви консултира и ще предложи най-подходящата комбинация според вашето състояние и цели.' },
        { q: 'Има ли противопоказания за ароматерапия?', a: 'Ароматерапията не се препоръчва през първия триместър на бременността, при алергия към конкретни масла или при определени медицински състояния. Моля, информирайте терапевта за всички здравословни проблеми преди процедурата.' },
        { q: 'Колко време продължава ефектът от ароматерапията?', a: 'Непосредственият релаксиращ ефект се усеща веднага и продължава 24-48 часа. При редовни процедури (веднъж седмично) ефектът става кумулативен и траен.' },
        { q: 'Какви са ползите от редовната ароматерапия?', a: 'Редовната ароматерапия намалява хроничния стрес и тревожността, подобрява качеството на съня, балансира хормоните, подпомага имунната система чрез антибактериалните свойства на маслата и подобрява цялостното психо-емоционално състояние. Много клиенти съобщават за по-дълбок сън и повече енергия след 4-5 редовни сесии.' },
        { q: 'Кой е най-добрият масаж за безсъние и тревожност?', a: 'Ароматерапията с лавандула и бергамот е най-ефективна при безсъние и тревожност. Комбинацията от нежен масаж и успокояващи етерични масла действа директно върху лимбичната система, намалявайки нивата на кортизол и подготвяйки тялото и ума за дълбок, възстановяващ сън.' },
      ],
      relatedServices: ['klasicheski-masazh', 'masazh-na-grab', 'anticeluliten-masazh'],
      relatedBlogSlugs: ['aromaterapiya-eterichni-masla-veliko-tarnovo', 'masazh-stres-oblekchavane-veliko-tarnovo', 'kolko-chesto-masazh-rutina-np-massage', 'kolko-vreme-trae-edin-masazh', 'polzi-ot-redoven-masazh'],
    },
    en: {
      title: 'Aromatherapy',
      subtitle: 'Combination of massage and essential oils for deep relaxation and harmonizing',
      heroDescription: 'Aromatherapy at NP Massage Studio is a 60-minute sensory journey with pure essential oils for complete psycho-emotional balancing in Veliko Tarnovo and Pavlikeni.',
      fullDescription: `Aromatherapy is one of the most refined and pleasant procedures we offer at NP Massage Studio — a massage salon in Veliko Tarnovo and Pavlikeni. It combines the art of massage with the science of essential oils, creating a powerful therapeutic effect that works simultaneously on physical, emotional, and mental levels.

The procedure begins with a personalized consultation, during which the therapist discusses your current state — stress levels, sleep quality, energy levels, muscle tension, and emotional balance. Based on this information, a unique combination of essential oils is selected:

• Lavender — for deep relaxation, better sleep, and anxiety relief
• Eucalyptus — for improved breathing, sinus relief, and purification
• Rosemary — for stimulating circulation, memory, and concentration
• Citrus oils (orange, bergamot, lemon) — for energy, mood, and vitality
• Ylang-ylang — for hormonal balance and emotional stability
• Tea tree — for purification and immune system support

The chosen oils are mixed with a high-quality base oil (almond, jojoba, or coconut) and warmed to a pleasant temperature. The massage itself is gentle, fluid, and rhythmic, with long effleurages that allow the oils to penetrate the skin and enter the bloodstream. The aromas work directly on the limbic system — the oldest part of the brain that controls emotions, memory, and hormonal balance.

The 60-minute procedure is a true sensory journey that leaves the body relaxed, the mind calm, and the spirit balanced. Aromatherapy at NP Massage Studio is particularly effective for insomnia, anxiety, chronic stress, fatigue, and emotional burnout.`,
      benefits: [
        'Deep relaxation through direct impact on the limbic system',
        'Improves sleep quality and helps with insomnia',
        'Reduces anxiety and cortisol levels',
        'Boosts energy levels and improves mood',
        'Supports the immune system through antibacterial oil properties',
        'Relieves respiratory issues and sinus infections',
        'Harmonizes hormonal balance',
        'Improves circulation and nourishes the skin',
      ],
      techniques: [
        'Personalized oil blend according to client needs',
        'Gentle effleurages across the entire body for even application',
        'Circular movements to stimulate absorption',
        'Rhythmic petrissages for deep muscle relaxation',
        'Final rest phase for complete sensory integration',
      ],
      whoFor: [
        'People with chronic stress and emotional burnout',
        'People suffering from insomnia or restless sleep',
        'Clients with anxiety or depressive states',
        'People seeking a holistic approach to health',
        'Anyone wanting a unique sensory experience',
        'People with respiratory issues or frequent colds',
      ],
      faqs: [
        { q: 'What essential oils do you use?', a: 'At NP Massage Studio, we use 100% pure, natural essential oils from verified manufacturers. The selection includes lavender, eucalyptus, rosemary, citrus oils, ylang-ylang, tea tree, and many more. The blend is chosen personally according to your needs.' },
        { q: 'Can I choose the oils myself?', a: 'Yes, you can express preferences. The therapist will consult you and suggest the most suitable blend according to your condition and goals.' },
        { q: 'Are there any contraindications for aromatherapy?', a: 'Aromatherapy is not recommended during the first trimester of pregnancy, in case of allergy to specific oils, or with certain medical conditions. Please inform the therapist of all health issues before the procedure.' },
        { q: 'How long does the effect of aromatherapy last?', a: 'The immediate relaxing effect is felt right away and lasts 24-48 hours. With regular procedures (once a week), the effect becomes cumulative and lasting.' },
        { q: 'What are the benefits of regular aromatherapy?', a: 'Regular aromatherapy reduces chronic stress and anxiety, improves sleep quality, balances hormones, supports the immune system through the antibacterial properties of oils, and improves overall psycho-emotional well-being. Many clients report deeper sleep and more energy after 4-5 regular sessions.' },
        { q: 'What is the best massage for insomnia and anxiety?', a: 'Aromatherapy with lavender and bergamot is most effective for insomnia and anxiety. The combination of gentle massage and calming essential oils acts directly on the limbic system, reducing cortisol levels and preparing the body and mind for deep, restorative sleep.' },
      ],
      relatedServices: ['klasicheski-masazh', 'masazh-na-grab', 'anticeluliten-masazh'],
      relatedBlogSlugs: ['aromaterapiya-eterichni-masla-veliko-tarnovo', 'masazh-stres-oblekchavane-veliko-tarnovo', 'kolko-chesto-masazh-rutina-np-massage', 'kolko-vreme-trae-edin-masazh', 'polzi-ot-redoven-masazh'],
    },
  },
  {
    slug: 'masazh-na-grab',
    bg: {
      title: 'Частичен масаж на гръб',
      subtitle: 'Целенасочена терапия за облекчаване на напрежението в гърба, раменете и врата',
      heroDescription: 'Частичният масаж на гръб в NP Massage Studio е 40-минутна фокусирана терапия за бързо облекчаване на напрежението — перфектен за офис работници във Велико Търново и Павликени.',
      fullDescription: `Частичният масаж на гръб е една от най-практичните и търсени процедури в NP Massage Studio — масажен салон във Велико Търново и Павликени. Това е целенасочена, фокусирана терапия, която работи интензивно върху горната част на тялото — гръб, рамене, врат и кръст — за бързо и ефективно облекчаване на натрупаното напрежение.

В днешния дигитален свят, където повечето от нас прекарват часове пред компютъра, смартфона или зад волана, проблемите с гърба и врата са достигнали епидемични размери. "Технологичният врат" (Tech Neck) — състояние, причинено от постоянно навеждане напред към екрани — засяга милиони хора и води до хронично напрежение, главоболие и болка.

40-минутната сесия започва с кратък разговор за проблемните зони, след което терапевтът прилага комбинация от техники: дълбоко триене за загряване и отпускане на мускулите, петрисаж за разбиване на мускулни възли, мобилизация на раменните стави за подобряване на подвижността, и точкова терапия върху тригерни точки за облекчаване на специфични болки.

Фокусът е върху трапецовидните мускули (които често са пренапрегнати при стрес), раменните пояси, мускулите около лопатките, вратните мускули и лумбалната област. Терапевтът използва различна интензивност в зависимост от състоянието на мускулите и предпочитанията на клиента.

Частичният масаж на гръб е идеален избор за хора с ограничено време, които търсят бързо, но ефективно решение на мускулното напрежение. Може да се направи през обедната почивка, след работа или като допълнение към по-дългите процедури.`,
      benefits: [
        'Незабавно облекчаване на напрежението в горната част на гърба',
        'Намалява болката във врата и раменете, причинена от работа с компютър',
        'Подобрява стойката и намалява "прегърбването"',
        'Облекчава главоболие, причинено от мускулно напрежение',
        'Подобрява подвижността на раменните стави',
        'Намалява сковаността след дълго седене',
        'Бърза процедура — само 40 минути — идеална за натоварен график',
      ],
      techniques: [
        'Дълбоко триене — интензивно загряване и отпускане на напрегнатите зони',
        'Петрисаж — месене на мускулите за разбиване на възли',
        'Мобилизация на ставите — подобряване на подвижността на раменете',
        'Тригерна точкова терапия — натиск върху специфични болкови точки',
        'Разтягане на вратните мускули — за облекчаване на сковаността',
      ],
      whoFor: [
        'Офис работници и хора с компютърна работа',
        'Шофьори на дълги разстояния',
        'Хора, прекарващи много време пред смартфон',
        'Всеки с хронично напрежение в горната част на гърба',
        'Хора с ограничено време, търсещи бърз резултат',
        'Клиенти, които искат допълнителен фокус върху гърба',
      ],
      faqs: [
        { q: 'Каква е разликата между частичен масаж на гръб и пълен класически масаж?', a: 'Частичният масаж на гръб е с продължителност 40 минути и фокусира само върху гърба, раменете, врата и кръста. Класическият масаж е 60 минути и работи върху цялото тяло. И двете процедури са професионални и персонализирани.' },
        { q: 'Може ли частичният масаж на гръб да помогне при дискова херния?', a: 'Масажът може да облекчи мускулния спазъм около засегнатата зона, но при дискова херния е задължително да се консултирате с лекар преди процедурата. Информирайте терапевта за всички диагностицирани състояния.' },
        { q: 'Колко често мога да правя частичен масаж на гръб?', a: 'Можете да го правите толкова често, колкото е необходимо — дори всеки ден при силно напрежение. Много клиенти идват веднъж седмично като част от рутината си за поддръжка на здрав гърб.' },
        { q: 'Трябва ли да се събличам напълно за частичен масаж на гръб?', a: 'Не е необходимо. Достатъчно е да свалите горната част на дрехите, тъй като работим само върху гърба и раменете. Останалата част от тялото остава покрита.' },
        { q: 'Помага ли частичният масаж на гръб при схванат врат и болки в раменете?', a: 'Да, частичният масаж на гръб е изключително ефективен при схванат врат и болки в раменете. Терапевтът работи целенасочено върху трапецовидните мускули, вратните мускули и раменните пояси, използвайки дълбоко триене и мобилизация на ставите. Повечето клиенти усещат значително облекчение още след първата сесия.' },
        { q: 'Кой е най-добрият масаж за офис работници със заседнал начин на живот?', a: 'Частичният масаж на гръб е идеален за офис работници — той е само 40 минути (перфектен за обедна почивка), достъпен (15 €) и работи точно върху зоните, които страдат от продължително седене — врата, раменете и кръста. За по-пълна релаксация, редувайте частичен масаж на гръб с класически масаж веднъж месечно.' },
      ],
      relatedServices: ['klasicheski-masazh', 'sporten-masazh', 'aromaterapiya'],
      relatedBlogSlugs: ['chastichen-masazh-grab-oblekchavane-veliko-tarnovo', 'masazh-stres-oblekchavane-veliko-tarnovo', 'kolko-chesto-masazh-rutina-np-massage', 'pomaga-li-masazhat-pri-diskopatiya', 'kolko-vreme-trae-edin-masazh', 'koj-masazh-pri-bolki-v-krasta'],
    },
    en: {
      title: 'Partial Back Massage',
      subtitle: 'Targeted therapy for relieving tension in the back, shoulders, and neck',
      heroDescription: 'Partial back massage at NP Massage Studio is a 40-minute focused therapy for quick tension relief — perfect for office workers in Veliko Tarnovo and Pavlikeni.',
      fullDescription: `Partial back massage is one of the most practical and sought-after procedures at NP Massage Studio — a massage salon in Veliko Tarnovo and Pavlikeni. It is a targeted, focused therapy that works intensively on the upper body — back, shoulders, neck, and lower back — for quick and effective relief of accumulated tension.

In today's digital world, where most of us spend hours in front of computers, smartphones, or behind the wheel, back and neck problems have reached epidemic proportions. "Tech Neck" — a condition caused by constantly leaning forward toward screens — affects millions of people and leads to chronic tension, headaches, and pain.

The 40-minute session begins with a brief discussion about problem areas, after which the therapist applies a combination of techniques: deep rubbing to warm and relax muscles, petrissage to break down muscle knots, shoulder joint mobilization to improve mobility, and point therapy on trigger points to relieve specific pains.

The focus is on the trapezius muscles (which are often overstrained during stress), shoulder girdles, muscles around the shoulder blades, neck muscles, and lumbar area. The therapist uses different intensity depending on muscle condition and client preferences.

Partial back massage is an ideal choice for people with limited time who seek a quick but effective solution to muscle tension. It can be done during a lunch break, after work, or as a complement to longer procedures.`,
      benefits: [
        'Immediate relief of tension in the upper back',
        'Reduces neck and shoulder pain caused by computer work',
        'Improves posture and reduces slouching',
        'Relieves headaches caused by muscle tension',
        'Improves shoulder joint mobility',
        'Reduces stiffness after prolonged sitting',
        'Quick procedure — only 40 minutes — ideal for a busy schedule',
      ],
      techniques: [
        'Deep rubbing — intensive warming and relaxation of tense areas',
        'Petrissage — kneading muscles to break down knots',
        'Joint mobilization — improving shoulder mobility',
        'Trigger point therapy — pressure on specific pain points',
        'Neck muscle stretching — to relieve stiffness',
      ],
      whoFor: [
        'Office workers and people with computer work',
        'Long-distance drivers',
        'People spending a lot of time on smartphones',
        'Anyone with chronic tension in the upper back',
        'People with limited time seeking quick results',
        'Clients wanting extra focus on the back',
      ],
      faqs: [
        { q: "What's the difference between partial back massage and full classical massage?", a: 'Partial back massage lasts 40 minutes and focuses only on the back, shoulders, neck, and lower back. Classical massage is 60 minutes and works on the entire body. Both procedures are professional and personalized.' },
        { q: 'Can partial back massage help with a herniated disc?', a: 'Massage can relieve muscle spasm around the affected area, but with a herniated disc, it is essential to consult a doctor before the procedure. Inform the therapist of all diagnosed conditions.' },
        { q: 'How often can I get a partial back massage?', a: 'You can get it as often as needed — even daily for severe tension. Many clients come once a week as part of their healthy back maintenance routine.' },
        { q: 'Do I need to fully undress for a partial back massage?', a: 'Not necessary. It is enough to remove the upper part of your clothing as we work only on the back and shoulders. The rest of the body remains covered.' },
        { q: 'Does partial back massage help with stiff neck and shoulder pain?', a: 'Yes, partial back massage is extremely effective for stiff neck and shoulder pain. The therapist works specifically on the trapezius muscles, neck muscles, and shoulder girdles, using deep rubbing and joint mobilization. Most clients feel significant relief after the very first session.' },
        { q: 'What is the best massage for office workers with a sedentary lifestyle?', a: 'Partial back massage is ideal for office workers — it is only 40 minutes (perfect for a lunch break), affordable (15 €), and works precisely on the areas that suffer from prolonged sitting — neck, shoulders, and lower back. For more complete relaxation, alternate partial back massage with a full classical massage once a month.' },
      ],
      relatedServices: ['klasicheski-masazh', 'sporten-masazh', 'aromaterapiya'],
      relatedBlogSlugs: ['chastichen-masazh-grab-oblekchavane-veliko-tarnovo', 'masazh-stres-oblekchavane-veliko-tarnovo', 'kolko-chesto-masazh-rutina-np-massage', 'pomaga-li-masazhat-pri-diskopatiya', 'kolko-vreme-trae-edin-masazh', 'koj-masazh-pri-bolki-v-krasta'],
    },
  },
];

export const serviceDetailMap: Record<string, ServiceDetail> = {};
serviceDetails.forEach((s) => { serviceDetailMap[s.slug] = s; });

export const serviceSlugToNameKey: Record<string, string> = {
  'klasicheski-masazh': 'serviceClassical',
  'sporten-masazh': 'serviceSport',
  'anticeluliten-masazh': 'serviceAnticellulite',
  'aromaterapiya': 'serviceAromatherapy',
  'masazh-na-grab': 'serviceBack',
};

export const serviceSlugToPriceKey: Record<string, string> = {
  'klasicheski-masazh': 'serviceClassicalPrice',
  'sporten-masazh': 'serviceSportPrice',
  'anticeluliten-masazh': 'serviceAnticellulitePrice',
  'aromaterapiya': 'serviceAromatherapyPrice',
  'masazh-na-grab': 'serviceBackPrice',
};