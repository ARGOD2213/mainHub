import { services, steps } from '../constants/services'

export default function Services() {
  return (
    <section id="services" className="section-light">
      <div className="wrap">
        <div className="section-heading">
          <div><p className="eyebrow">03 / CAPABILITIES</p><h2>What I can build</h2></div>
          <p>Focused engineering work for products that need a dependable backend, cloud path or AI application layer.</p>
        </div>
        <div className="service-list">
          {services.map((service, index) => (
            <article className="service-row" key={service.t}>
              <span className="service-index">0{index + 1}</span>
              <div><h3>{service.t}</h3><p>{service.d}</p></div>
              <p className="service-outcome"><span>DELIVERABLE</span>{service.g}</p>
            </article>
          ))}
        </div>
        <div className="process-strip">
          {steps.map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong></div>)}
        </div>
      </div>
    </section>
  )
}
