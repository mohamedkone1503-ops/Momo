import "server-only";
import nodemailer, { type SendMailOptions } from "nodemailer";
import { getBarber } from "@/data/barbers";
import { bookingConfig } from "@/data/booking";
import { totals } from "@/data/services";
import { fullAddress, site } from "@/data/site";
import { buildIcs } from "./ics";
import type { Reservation } from "./reservations";
import { fmtTime, formatDateFr } from "./time";

/**
 * Envoi des e-mails via SMTP (variables SMTP_* dans .env.local).
 * Sans configuration SMTP, les e-mails sont simplement affichés dans la console.
 */
const configured = () => Boolean(process.env.SMTP_HOST);

function transport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
  });
}

async function send(msg: SendMailOptions) {
  if (!configured()) {
    console.info(`[e-mail non envoyé : SMTP non configuré] À : ${msg.to} — ${msg.subject}`);
    return false;
  }
  try {
    await transport().sendMail({ from: process.env.MAIL_FROM || `${site.name} <${site.email}>`, ...msg });
    return true;
  } catch (e) {
    console.error("Erreur d'envoi d'e-mail :", e);
    return false;
  }
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

function summary(r: Reservation) {
  const t = totals(r.serviceId, r.extraIds);
  return {
    service: t.label,
    when: `${formatDateFr(r.date)} à ${fmtTime(r.time)}`,
    barber: r.requestedBarberId ? getBarber(r.barberId)?.name ?? "" : `Peu importe (${getBarber(r.barberId)?.name ?? "?"})`,
    price: `${t.price} €`,
    duration: t.duration,
  };
}

const layout = (body: string) => `
<div style="background:#141414;padding:32px 16px;font-family:Montserrat,Arial,sans-serif;color:#F5F3EF">
  <div style="max-width:520px;margin:auto;background:#1F1F1F;border-radius:8px;padding:28px">
    <p style="font-family:'Playfair Display',Georgia,serif;font-style:italic;font-size:28px;margin:0">Flex</p>
    <p style="font-weight:800;letter-spacing:2px;margin:0 0 20px;font-size:12px">HAIR<span style="color:#C9A35B">STYLE</span></p>
    ${body}
    <p style="color:#A3A3A3;font-size:12px;margin-top:28px">${esc(fullAddress)} · ${esc(site.phone)}</p>
  </div>
</div>`;

export async function sendBookingEmails(r: Reservation) {
  const s = summary(r);
  const ics = buildIcs({ id: r.id, date: r.date, time: r.time, duration: s.duration, title: s.service });

  const toClient = send({
    to: r.email,
    subject: `Ton rendez-vous chez ${site.name} – ${s.when}`,
    text: `Bonjour ${r.firstName},\n\nTon rendez-vous est confirmé :\n${s.service} (${s.price})\n${s.when}\nCoiffeur : ${s.barber}\n\n${site.name}, ${fullAddress}\n\n${bookingConfig.rules}\n\nPour annuler : ${site.phone}`,
    html: layout(`
      <p>Bonjour ${esc(r.firstName)},</p>
      <p>Ton rendez-vous est confirmé :</p>
      <p style="border-left:3px solid #C9A35B;padding-left:12px">
        <strong>${esc(s.service)}</strong> · <span style="color:#C9A35B">${esc(s.price)}</span><br>
        ${esc(s.when)}<br>Coiffeur : ${esc(s.barber)}
      </p>
      <p style="color:#A3A3A3;font-size:13px">${esc(bookingConfig.rules)}</p>
      <p>Pour annuler, appelle-nous au <a style="color:#C9A35B" href="tel:${site.phoneHref}">${esc(site.phone)}</a>.</p>`),
    icalEvent: { filename: "rendez-vous.ics", method: "PUBLISH", content: ics },
  });

  const toSalon = send({
    to: process.env.SALON_NOTIFY_EMAIL || site.email,
    subject: `Nouveau RDV : ${r.firstName} ${r.lastName} – ${s.when}`,
    text: `${s.service} (${s.price})\n${s.when}\nCoiffeur : ${s.barber}\n\n${r.firstName} ${r.lastName}\n${r.phone}\n${r.email}\n${r.message ?? ""}`,
    replyTo: r.email,
  });

  const [client] = await Promise.all([toClient, toSalon]);
  return client;
}

export async function sendCancellationEmail(r: Reservation) {
  const s = summary(r);
  return send({
    to: r.email,
    subject: `Rendez-vous annulé – ${site.name}`,
    text: `Bonjour ${r.firstName},\n\nTon rendez-vous du ${s.when} (${s.service}) a été annulé.\nPour en reprendre un : ${site.url}/reservation ou ${site.phone}.`,
    html: layout(`
      <p>Bonjour ${esc(r.firstName)},</p>
      <p>Ton rendez-vous du <strong>${esc(s.when)}</strong> (${esc(s.service)}) a été annulé.</p>
      <p><a style="color:#C9A35B" href="${site.url}/reservation">Reprendre un rendez-vous</a> ou appelle-nous au ${esc(site.phone)}.</p>`),
  });
}
