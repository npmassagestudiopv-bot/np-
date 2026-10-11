function formatDateBG(d: string | Date) {
  const date = typeof d === 'string' ? new Date(d + 'T00:00:00') : d;
  return date.toLocaleDateString('bg-BG', { year: 'numeric', month: 'long', day: 'numeric' });
}

// Кодовете, както реално се пазят в appointments.service / appointments.location,
// превърнати в пълни, четими имена за имейла. Ако дойде непознат код - показваме
// суровата стойност (fallback), за да не изчезне информация.
const SERVICE_LABELS: Record<string, string> = {
  classical: 'Класически и релаксиращ масаж',
  sport: 'Спортен и терапевтичен масаж',
  anticellulite: 'Антицелулитен масаж',
  aromatherapy: 'Ароматерапия',
  back: 'Частичен масаж на гръб',
};

const LOCATION_LABELS: Record<string, string> = {
  vt: 'Велико Търново',
  pv: 'Павликени',
  // "Студио" вече идва като пълен текст от базата - няма нужда от mapping.
};

function labelService(code: string): string {
  return SERVICE_LABELS[code] ?? code;
}

function labelLocation(code: string): string {
  return LOCATION_LABELS[code] ?? code;
}

// Escape helper - предпазва от счупен HTML, ако клиентско поле съдържа < > & и т.н.
function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

export function buildEmail({ name, appointment_date, appointment_time, service, location, message, businessName }: {
  name: string;
  appointment_date: string;
  appointment_time: string;
  service: string;
  location: string;
  message?: string | null;
  businessName: string;
}) {
  const safeName = (name ?? '').trim();
  const safeMessage = (message ?? '').trim();
  const dateFormatted = formatDateBG(appointment_date);
  const serviceLabel = labelService(service);
  const locationLabel = labelLocation(location);

  const subject = `Потвърдена резервация — ${dateFormatted}`;

  const messageBlock = safeMessage
    ? `\n\nБележка от Вас: ${safeMessage}`
    : '';

  const contactPhone = '+359 98 892 6120';

  // Plain-text версия (fallback за клиенти без HTML преглед)
  const text = `Здравейте, ${safeName}!\n\nС удоволствие потвърждаваме Вашата резервация в ${businessName}.\n\nДата: ${dateFormatted}\nЧас: ${appointment_time}\nУслуга: ${serviceLabel}\nМясто: ${locationLabel}${messageBlock}\n\nАко имате въпроси или желаете промяна, моля обадете се на ${contactPhone}.\n\nОчакваме Ви с грижа и внимание.\n\nС уважение,\n${businessName}`;

  const eName = escapeHtml(safeName || 'скъпи клиенти');
  const eService = escapeHtml(serviceLabel);
  const eLocation = escapeHtml(locationLabel);
  const eMessage = escapeHtml(safeMessage);
  const eBusiness = escapeHtml(businessName);

  const contactPhoneHref = contactPhone.replace(/\s+/g, '');

  // HTML версия - брандирана в стила на NP Massage Studio, оптимизирана за мобилни:
  // по-едри тап-зони, детайлите се "стекват" на тесен екран, кликаем телефонен номер.
  const html = `<!DOCTYPE html>
<html lang="bg">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: #f4efe6;
    font-family: Georgia, 'Times New Roman', serif;
    -webkit-font-smoothing: antialiased;
    -webkit-text-size-adjust: 100%;
  }
  .sans { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif; }
  .wrap { max-width: 600px; background: #ffffff; border: 1px solid #e7e0d3; }
  .section-pad { padding-left: 40px; padding-right: 40px; }
  .divider { height: 1px; background: linear-gradient(90deg, transparent, #d7cdb8, transparent); }
  .detail-label { color:#8a8272; font-size:11px; letter-spacing:1px; text-transform:uppercase; }
  .detail-value { color:#2b2b28; font-size:15px; font-weight:600; }
  .phone-btn {
    display:inline-block; background:#2f4a3c; color:#ffffff !important; text-decoration:none;
    padding:16px 30px; font-size:16px; font-weight:700; letter-spacing:0.3px;
  }
  @media only screen and (max-width: 600px) {
    .wrap { border: none !important; width: 100% !important; }
    .section-pad { padding-left: 22px !important; padding-right: 22px !important; }
    h1 { font-size: 22px !important; }
    .intro-text { font-size: 14px !important; max-width: none !important; }
    .detail-row-label, .detail-row-value { display:block !important; width:100% !important; text-align:left !important; }
    .detail-row-value { padding-top: 2px !important; padding-bottom: 12px !important; text-align:left !important; }
    .phone-btn { display:block !important; width:100% !important; text-align:center !important; padding:18px 0 !important; }
    .logo-circle { width:48px !important; height:48px !important; line-height:48px !important; font-size:19px !important; }
  }
</style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#f4efe6;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">
    Вашата резервация в ${eBusiness} е потвърдена — очакваме Ви с грижа и внимание.
  </div>
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
    <tr><td align="center" style="padding: 32px 12px;">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" class="wrap">

        <!-- LOGO / BRAND -->
        <tr><td style="padding: 36px 0 0; text-align: center;">
          <div class="logo-circle" style="display:inline-block; width:56px; height:56px; line-height:56px; border:1px solid #2f4a3c; color:#2f4a3c; font-size:22px; font-weight:700; letter-spacing:1px;">NP</div>
          <p class="sans" style="color:#8a8272; font-size:11px; letter-spacing:4px; text-transform:uppercase; margin-top:14px;">${eBusiness}</p>
        </td></tr>

        <!-- BADGE -->
        <tr><td style="padding: 24px 0 0; text-align:center;">
          <span class="sans" style="display:inline-block; padding:6px 16px; border:1px solid #d9cdae; color:#8a6d3b; font-size:11px; letter-spacing:1.5px; text-transform:uppercase;">Потвърдена резервация</span>
        </td></tr>

        <!-- HEADLINE -->
        <tr><td style="padding: 22px 0 0; text-align:center;" class="section-pad">
          <h1 style="color:#2b2b28; font-size:26px; font-weight:400; line-height:1.4; letter-spacing:-0.3px;">
            Здравейте, ${eName}
          </h1>
          <p class="sans intro-text" style="color:#6f6a5c; font-size:14px; line-height:1.8; margin-top:12px; max-width:440px; margin-left:auto; margin-right:auto;">
            С голямо удоволствие Ви уведомяваме, че Вашата резервация е потвърдена. Очакваме Ви с внимание и грижа.
          </p>
        </td></tr>

        <!-- DETAILS CARD -->
        <tr><td style="padding: 26px 0 0;" class="section-pad">
          <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#f9f6ef; border:1px solid #e7e0d3;">
            <tr><td style="padding:24px 24px;">
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                <tr>
                  <td class="sans detail-label detail-row-label" style="padding:11px 0; border-bottom:1px solid #ece5d5; width:40%;">Дата</td>
                  <td class="sans detail-value detail-row-value" style="padding:11px 0; border-bottom:1px solid #ece5d5; text-align:right;">${dateFormatted}</td>
                </tr>
                <tr>
                  <td class="sans detail-label detail-row-label" style="padding:11px 0; border-bottom:1px solid #ece5d5;">Час</td>
                  <td class="sans detail-value detail-row-value" style="padding:11px 0; border-bottom:1px solid #ece5d5; text-align:right;">${escapeHtml(appointment_time)}</td>
                </tr>
                <tr>
                  <td class="sans detail-label detail-row-label" style="padding:11px 0; border-bottom:1px solid #ece5d5;">Услуга</td>
                  <td class="sans detail-value detail-row-value" style="padding:11px 0; border-bottom:1px solid #ece5d5; text-align:right;">${eService}</td>
                </tr>
                <tr>
                  <td class="sans detail-label detail-row-label" style="padding:11px 0;">Място</td>
                  <td class="sans detail-value detail-row-value" style="padding:11px 0; text-align:right;">${eLocation}</td>
                </tr>
              </table>
            </td></tr>
          </table>
        </td></tr>

        ${eMessage ? `
        <!-- CLIENT NOTE -->
        <tr><td style="padding: 16px 0 0;" class="section-pad">
          <p class="sans" style="color:#8a8272; font-size:12px; font-style:italic;">Бележка от Вас: ${eMessage}</p>
        </td></tr>` : ''}

        <!-- CONTACT / CALL US -->
        <tr><td style="padding: 30px 0 0; text-align:center;" class="section-pad">
          <p class="sans" style="color:#8a8272; font-size:12px; line-height:1.7; max-width:420px; margin:0 auto 16px;">
            Ако имате въпроси или желаете промяна на часа, моля обадете се директно на:
          </p>
          <a href="tel:${contactPhoneHref}" class="phone-btn">📞 ${contactPhone}</a>
        </td></tr>

        <!-- FOOTER -->
        <tr><td style="padding: 34px 0 40px; text-align:center;" class="section-pad">
          <div class="divider" style="margin-bottom:22px;"></div>
          <p style="color:#2b2b28; font-size:15px; font-weight:400; margin-bottom:4px;">С уважение,</p>
          <p style="color:#2f4a3c; font-size:15px; font-weight:700; letter-spacing:0.5px;">${eBusiness}</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

// Помощна функция: PostgREST понякога връща вложената връзка като масив,
// понякога като директен обект - в зависимост от версията/конфигурацията.
// Тук нормализираме и в двата случая до един обект (или null).
