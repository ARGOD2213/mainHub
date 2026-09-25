import { profile as p } from '../constants/profile'

const mailto = (subject: string) => `mailto:${p.email}?subject=${encodeURIComponent(subject)}`

export default function Contact() {
  const intents = ['Feature sprint', 'New MVP', 'AI assistant', 'IoT project', 'Something else']
  return (
    <section id="contact" className="contact-section">
      <div className="wrap contact-grid">
        <div>
          <p className="eyebrow">06 / CONTACT</p>
          <h2>Tell me what you are building.</h2>
          <p className="lead">What helps me quote fast: what exists today, what needs to change, and your deadline.</p>
          <div className="contact-actions">
            {intents.map(intent => <a className="btn fill" key={intent} href={mailto(intent)}>{intent}</a>)}
          </div>
        </div>
        <div className="contact-console">
          <p><span>$</span> whoami</p>
          <strong>{p.name.toLowerCase().replace(/ /g, '_')}</strong>
          <p><span>$</span> contact --email --phone</p>
          <a href={`mailto:${p.email}`}>{p.email}</a>
          <a href={`tel:${p.phoneTel}`}>{p.phone}</a>
          <p><span>$</span> <i className="console-cursor" aria-hidden /></p>
        </div>
      </div>
      <div className="wrap contact-links">
        <a href={p.whatsapp}>WhatsApp ↗</a>
        <a href={p.github}>GitHub ↗</a>
        <a href={p.linkedin}>LinkedIn ↗</a>
        <a href={p.resumePdf} download>Resume PDF ↗</a>
      </div>
    </section>
  )
}
