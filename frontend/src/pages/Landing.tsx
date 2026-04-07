import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Zap, Users, MessageSquare, Clock, CheckCircle2, ArrowRight } from 'lucide-react';

// Advanced Spotlight Box Component
function SpotlightBox({ children, className = '', style = {} }: { children: React.ReactNode, className?: string, style?: any }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    setMousePosition({ x: clientX - left, y: clientY - top });
  }

  return (
    <div
      className={`spotlight-card ${className}`}
      onMouseMove={handleMouseMove}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--color-surface-1)',
        border: '1px solid var(--color-border)',
        borderRadius: 'var(--radius-xl)',
        ...style
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(204,255,0,0.1), transparent 40%)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
        className="spotlight-overlay"
      />
      <div style={{ position: 'relative', zIndex: 1, padding: 'var(--space-xl)' }}>
        {children}
      </div>
      <style>{`.spotlight-card:hover .spotlight-overlay { opacity: 1 !important; }`}</style>
    </div>
  );
}

function ScrollLine() {
  const ref = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "center center"]
  });
  
  return (
    <div ref={ref} style={{ display: 'flex', justifyContent: 'center', height: '120px', margin: '-40px 0', position: 'relative', zIndex: 10 }}>
      <motion.div 
        style={{ 
          width: '2px', 
          height: '100%', 
          background: 'linear-gradient(to bottom, rgba(204,255,0,0), rgba(204,255,0,1), rgba(204,255,0,0))', 
          scaleY: scrollYProgress,
          transformOrigin: 'top'
        }} 
      />
    </div>
  );
}

export function Landing() {
  const { scrollY } = useScroll();
  const opacityHero = useTransform(scrollY, [0, 600], [1, 0]);
  const yHero = useTransform(scrollY, [0, 600], [0, 50]);
  const scaleHero = useTransform(scrollY, [0, 600], [1, 0.98]);

  // Footer Parallax Animation
  const footerTextRef = React.useRef(null);
  const { scrollYProgress: footerScroll } = useScroll({
    target: footerTextRef,
    offset: ["start end", "end end"]
  });
  const footerTextScale = useTransform(footerScroll, [0, 1], [0.8, 1]);
  const footerTextY = useTransform(footerScroll, [0, 1], [150, 0]);

  // Framer Motion Variants for Staggered Load
  const containerVars = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemVars = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: 'spring' as const, stiffness: 100, damping: 15 } }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#000000', color: 'var(--color-text-main)', fontFamily: 'var(--font-body)', overflowX: 'hidden' }}>
      
      {/* ── Fixed Navbar ── */}
      <motion.nav 
        initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.6, ease: 'easeOut' }}
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ background: 'var(--color-accent-volt)', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={18} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            GymCRM
          </span>
        </div>
        
        <div style={{ display: 'flex', gap: 'var(--space-md)', alignItems: 'center' }}>
          <Link to="/login" className="btn-raw" style={{ color: 'var(--color-text-sub)', fontWeight: 600, fontSize: '0.9rem', padding: '0.5rem 1rem' }}>
            Log in
          </Link>
          <Link to="/register" className="btn btn--primary" style={{ padding: '0.5rem 1.25rem', borderRadius: '999px' }}>
            Start Free
          </Link>
        </div>
      </motion.nav>

      {/* ── Dynamic Hero Section ── */}
      <motion.section 
        style={{ opacity: opacityHero, y: yHero, scale: scaleHero }}
        className="hero-section"
      >
        <div style={{
          padding: '160px 2rem 60px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center',
          position: 'relative', maxWidth: '1000px', margin: '0 auto'
        }}>
          
          {/* Ambient Glow */}
          <div style={{
            position: 'absolute', top: '10%', left: '50%', transform: 'translateX(-50%)',
            width: '80vw', height: '80vw', maxWidth: '800px', maxHeight: '800px',
            background: 'radial-gradient(circle, rgba(204,255,0,0.12) 0%, rgba(0,0,0,0) 60%)',
            pointerEvents: 'none', zIndex: 0
          }} />

          <motion.div variants={containerVars} initial="hidden" animate="show" style={{ position: 'relative', zIndex: 1 }}>
            
            <motion.div variants={itemVars} style={{ 
              display: 'inline-flex', alignItems: 'center', gap: '8px', 
              background: 'rgba(204,255,0,0.06)', color: 'var(--color-accent-volt)', 
              padding: '6px 14px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 600,
              marginBottom: 'var(--space-xl)', border: '1px solid rgba(204,255,0,0.15)',
              boxShadow: '0 0 20px rgba(204,255,0,0.05)'
            }}>
              <span className="volt-dot" /> Introducing Broadcast Campaigns v2.0
            </motion.div>
            
            <motion.h1 variants={itemVars} style={{ 
              fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 7vw, 6.5rem)', 
              fontWeight: 800, lineHeight: 1, textTransform: 'uppercase', marginBottom: 'var(--space-lg)',
              letterSpacing: '-0.02em'
            }}>
              The Only WhatsApp <br /> CRM
              <span style={{ 
                background: 'linear-gradient(to right, #ccff00, #a0d800)', 
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                display: 'block'
              }}>
                Your Gym Needs.
              </span>
            </motion.h1>
            
            <motion.p variants={itemVars} style={{ 
              fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'var(--color-text-sub)', 
              maxWidth: '650px', margin: '0 auto var(--space-2xl)', lineHeight: 1.6 
            }}>
              Automate membership renewals, send bulk broadcasts, and manage your entire client roster. <b>Zero Meta Developer setup required.</b> You sign up, we handle the infrastructure.
            </motion.p>

            <motion.div variants={itemVars} style={{ display: 'flex', gap: 'var(--space-md)', justifyContent: 'center', flexWrap: 'wrap' }}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="btn btn--primary" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '999px', boxShadow: '0 10px 40px rgba(204,255,0,0.2)' }}>
                  Start for free <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="#pricing" className="btn btn--ghost" style={{ fontSize: '1.05rem', padding: '1rem 2.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '999px' }}>
                  View pricing
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Social Proof Marquee (CSS Driven) */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1, duration: 1 }}
            style={{ marginTop: '80px', width: '100%', overflow: 'hidden' }}
          >
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '20px' }}>
              Trusted by leading fitness studios
            </p>
            <div className="marquee-container" style={{ display: 'flex', whiteSpace: 'nowrap', opacity: 0.5 }}>
               <div className="marquee-content" style={{ display: 'flex', gap: '4rem', fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-text-muted)' }}>
                  <span>Gold's Legacy</span>
                  <span>CrossFit Meta</span>
                  <span>Iron Forge</span>
                  <span>Anytime Strength</span>
                  <span>Pulse Fitness</span>
                  <span>Gold's Legacy</span>
                  <span>CrossFit Meta</span>
                  <span>Iron Forge</span>
                  <span>Anytime Strength</span>
                  <span>Pulse Fitness</span>
               </div>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── Scroll Connecting Line ── */}
      <ScrollLine />

      {/* ── Features Bento Box ── */}
      <section style={{ padding: '40px 2rem 100px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
        <motion.div 
          initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
          style={{ textAlign: 'center', marginBottom: '80px' }}
        >
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
            Unreasonable Automation
          </h2>
          <p style={{ color: 'var(--color-text-sub)', fontSize: '1.15rem', maxWidth: '600px', margin: '0 auto' }}>
            We removed all the friction. Manage thousands of members and let the software ping them when their plan expires.
          </p>
        </motion.div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
          {/* Feature 1 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <SpotlightBox>
              <div style={{ background: 'rgba(204,255,0,0.1)', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-lg)', color: 'var(--color-accent-volt)', border: '1px solid rgba(204,255,0,0.2)' }}>
                <Clock size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>Auto Reminders</h3>
              <p style={{ color: 'var(--color-text-sub)', lineHeight: 1.6, fontSize: '1.05rem' }}>Our system automatically detects memberships expiring within 7 days and pings them on WhatsApp before they lapse.</p>
            </SpotlightBox>
          </motion.div>

          {/* Feature 2 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <SpotlightBox>
              <div style={{ background: 'rgba(204,255,0,0.1)', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-lg)', color: 'var(--color-accent-volt)', border: '1px solid rgba(204,255,0,0.2)' }}>
                <MessageSquare size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>Bulk Broadcasts</h3>
              <p style={{ color: 'var(--color-text-sub)', lineHeight: 1.6, fontSize: '1.05rem' }}>Send holiday updates, diet plans, or promotional offers instantly to hundreds of active gym members with a single click.</p>
            </SpotlightBox>
          </motion.div>

          {/* Feature 3 */}
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <SpotlightBox>
              <div style={{ background: 'rgba(204,255,0,0.1)', width: '56px', height: '56px', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 'var(--space-lg)', color: 'var(--color-accent-volt)', border: '1px solid rgba(204,255,0,0.2)' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '12px' }}>1-Click CSV Imports</h3>
              <p style={{ color: 'var(--color-text-sub)', lineHeight: 1.6, fontSize: '1.05rem' }}>Coming from Excel? No problem. Export your current roster and import it directly into GymCRM in under 10 seconds.</p>
            </SpotlightBox>
          </motion.div>
        </div>
      </section>

      {/* ── Pricing Section ── */}
      <section id="pricing" style={{ padding: '120px 2rem', background: '#050505', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '80px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>
              Transparent Pricing
            </h2>
            <p style={{ color: 'var(--color-text-sub)', fontSize: '1.15rem' }}>
              Everything you need. Zero setup required on your end.
            </p>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-xl)', alignItems: 'stretch' }}>
            
            {/* Starter Plan */}
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex' }}>
              <SpotlightBox style={{ opacity: 0.8, borderColor: 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', width: '100%' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Starter Tracker</h3>
                <div style={{ margin: 'var(--space-lg) 0' }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: 800 }}>$15</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-xl)', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><CheckCircle2 size={20} color="var(--color-accent-volt)" style={{ flexShrink: 0, marginTop: '2px' }}/> Unlimited member tracking</li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><CheckCircle2 size={20} color="var(--color-accent-volt)" style={{ flexShrink: 0, marginTop: '2px' }}/> 200 automated WhatsApp messages</li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', color: 'var(--color-text-muted)' }}><CheckCircle2 size={20} color="var(--color-text-muted)" style={{ flexShrink: 0, marginTop: '2px' }}/> No Bulk Broadcasts</li>
                </ul>
                <div style={{ marginTop: 'auto' }}>
                  <Link to="/register" className="btn btn--ghost btn--full" style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>Get Started</Link>
                </div>
              </SpotlightBox>
            </motion.div>

            {/* Pro Plan - Highlighted */}
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative', zIndex: 10, display: 'flex' }}>
              <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'var(--color-accent-volt)', color: '#000', padding: '6px 16px', borderRadius: '999px', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', zIndex: 20 }}>
                Most Popular
              </div>
              <SpotlightBox style={{ borderColor: 'var(--color-accent-volt)', boxShadow: '0 0 50px rgba(204,255,0,0.1)', display: 'flex', flexDirection: 'column', width: '100%' }}>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Pro Automator</h3>
                <div style={{ margin: 'var(--space-lg) 0' }}>
                  <span style={{ fontSize: '4rem', fontWeight: 800, color: 'var(--color-accent-volt)' }}>$49</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-2xl)', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><CheckCircle2 size={20} color="var(--color-accent-volt)" style={{ flexShrink: 0, marginTop: '2px' }}/> Everything in Starter</li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><CheckCircle2 size={20} color="var(--color-accent-volt)" style={{ flexShrink: 0, marginTop: '2px' }}/> <b>1,000 automated messages</b></li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><CheckCircle2 size={20} color="var(--color-accent-volt)" style={{ flexShrink: 0, marginTop: '2px' }}/> Full Broadcast Campaigns</li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><CheckCircle2 size={20} color="var(--color-accent-volt)" style={{ flexShrink: 0, marginTop: '2px' }}/> Priority Web Support</li>
                </ul>
                <div style={{ marginTop: 'auto' }}>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link to="/register" className="btn btn--primary btn--full" style={{ justifyContent: 'center', borderRadius: '12px', padding: '1.25rem 0', fontSize: '1.1rem' }}>Get Pro Now</Link>
                  </motion.div>
                </div>
              </SpotlightBox>
            </motion.div>

            {/* Enterprise Plan */}
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} style={{ display: 'flex' }}>
              <SpotlightBox style={{ opacity: 0.8, borderColor: 'rgba(255,255,255,0.05)', display: 'flex', flexDirection: 'column', width: '100%' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Gym Network</h3>
                <div style={{ margin: 'var(--space-lg) 0' }}>
                  <span style={{ fontSize: '3.5rem', fontWeight: 800 }}>$149</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>/mo</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 var(--space-xl)', display: 'flex', flexDirection: 'column', gap: '16px', flex: 1 }}>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><CheckCircle2 size={20} color="var(--color-accent-volt)" style={{ flexShrink: 0, marginTop: '2px' }}/> Everything in Pro</li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><CheckCircle2 size={20} color="var(--color-accent-volt)" style={{ flexShrink: 0, marginTop: '2px' }}/> <b>5,000 automated messages</b></li>
                  <li style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}><CheckCircle2 size={20} color="var(--color-accent-volt)" style={{ flexShrink: 0, marginTop: '2px' }}/> Multiple branch management</li>
                </ul>
                <div style={{ marginTop: 'auto' }}>
                  <Link to="/register" className="btn btn--ghost btn--full" style={{ justifyContent: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '12px' }}>Contact Sales</Link>
                </div>
              </SpotlightBox>
            </motion.div>

          </div>
        </div>
      </section>

      <ScrollLine />

      {/* ── Testimonials (Floating Orbit Layout) ── */}
      <section style={{ padding: '120px 2rem', position: 'relative', overflow: 'hidden', minHeight: '800px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        
        {/* Animated Dot-Wave Guidelines */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.1, zIndex: 0, maskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)', WebkitMaskImage: 'radial-gradient(circle at center, black 10%, transparent 60%)' }}>
          <svg width="100%" height="100%" viewBox="0 0 1000 1000" preserveAspectRatio="none">
            {[
              "M0,500 C300,300 700,700 1000,500",
              "M0,600 C300,800 700,200 1000,600",
              "M0,400 C300,600 700,400 1000,400",
              "M0,700 C300,500 700,900 1000,700",
              "M0,300 C300,100 700,500 1000,300",
              "M0,550 C300,350 700,750 1000,550",
              "M0,450 C300,650 700,250 1000,450"
            ].map((d, i) => (
              <motion.path
                key={i}
                d={d}
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="4 8"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 3, delay: i * 0.2, ease: "easeInOut" }}
              />
            ))}
          </svg>
        </div>

        {/* Ambient Center Glow */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '800px', height: '800px', background: 'radial-gradient(circle, rgba(204,255,0,0.03) 0%, rgba(0,0,0,0) 70%)', pointerEvents: 'none', zIndex: 1 }} />

        {/* Center Title */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', zIndex: 10, position: 'relative', maxWidth: '500px' }}>
          <div style={{ border: '1px solid rgba(255,255,255,0.1)', display: 'inline-flex', padding: '6px 16px', borderRadius: '999px', fontSize: '0.85rem', color: 'var(--color-text-sub)', marginBottom: 'var(--space-md)', alignItems: 'center', background: 'rgba(0,0,0,0.5)' }}>
            <MessageSquare size={14} style={{ marginRight: '8px' }} /> Testimonials
          </div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800, textTransform: 'uppercase', lineHeight: 1.1, letterSpacing: '-0.02em', color: 'var(--color-text-main)' }}>
            Hear from<br/> Gym Owners
          </h2>
        </motion.div>

        {/* Testimonials Data */}
        {(() => {
          const testimonials = [
            { quote: "GymCRM completely eliminated our manual WhatsApp follow-ups. Renewals are up 32% since we switched to using their automated ping system.", author: "Rahul D.", title: "Owner, Iron Forge Fitness", pos: { top: '15%', left: '10%' } },
            { quote: "Zero Facebook API setup was the killer feature. We just signed up and instantly broadcasted our offer to 800 members.", author: "Priya S.", title: "Manager, Pulse Studio", pos: { top: '30%', right: '5%' } },
            { quote: "Importing our old excel sheet took exactly 5 seconds. The interface is ridiculously fast and looks incredible on the gym iPad.", author: "Vikram K.", title: "Founder, Peak Gym", pos: { bottom: '20%', left: '5%' } },
            { quote: "Their process is clear, communication is fast, and the results speak for themselves. Highly recommended for any serious gym.", author: "Jason Ford", title: "Marketing Lead", pos: { bottom: '10%', right: '15%' } }
          ];

          return (
            <>
              {/* Desktop Absolute Orbits */}
              <div className="desktop-orbit" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 5 }}>
                {testimonials.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 + (i * 0.1) }} style={{ position: 'absolute', ...t.pos, width: '320px', pointerEvents: 'auto' }}>
                    <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
                      <p style={{ color: 'var(--color-text-sub)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>"{t.quote}"</p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent-volt), #a0d800)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                          {t.author.charAt(0)}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{t.author}</div>
                          <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t.title}</div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Mobile Fallback Grid */}
              <div className="mobile-only-grid" style={{ width: '100%', marginTop: '60px', zIndex: 10 }}>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {testimonials.map((t, i) => (
                      <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', padding: '24px' }}>
                          <p style={{ color: 'var(--color-text-sub)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '20px' }}>"{t.quote}"</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--color-accent-volt), #a0d800)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                              {t.author.charAt(0)}
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--color-text-main)' }}>{t.author}</div>
                              <div style={{ color: 'var(--color-text-muted)', fontSize: '0.8rem' }}>{t.title}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                   ))}
                 </div>
              </div>
            </>
          );
        })()}

      </section>

      <ScrollLine />

      {/* ── FAQ Section ── */}
      <section style={{ padding: '80px 2rem 120px', background: '#050505', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800, textTransform: 'uppercase' }}>
              Questions?
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { q: "Do I need to verify a Facebook Business Manager account?", a: "No! Unlike other WhatsApp CRMs, we operate as the platform provider. You use our master WhatsApp API pipeline, which means zero setup time and instant activation." },
              { q: "What number do the messages come from?", a: "Messages are sent from GymCRM's verified central broadcasting numbers. Your messages will clearly state the name of your gym inside the message body." },
              { q: "Can I import my existing members from Excel?", a: "Absolutely. Our 1-Click CSV importer allows you to dump your existing member roster immediately. Just ensure it has Name, Phone, and Expiry Date columns." },
              { q: "Can members reply to the messages?", a: "Currently, GymCRM is designed for one-way high-conversion notifications and broadcasts (Renewals, Announcements). For 2-way chat, they are directed to contact your front desk directly." }
            ].map((faq, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div style={{ background: 'var(--color-surface-1)', border: '1px solid var(--color-border)', borderRadius: '12px', padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ fontWeight: 700, fontSize: '1.1rem' }}>{faq.q}</h4>
                  </div>
                  <p style={{ color: 'var(--color-text-sub)', fontSize: '0.95rem', lineHeight: 1.6 }}>{faq.a}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <ScrollLine />

      {/* ── Pre-Footer CTA ── */}
      <section style={{ padding: '120px 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(204,255,0,0.1) 0%, rgba(0,0,0,0) 60%)', pointerEvents: 'none'
        }} />
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 800, textTransform: 'uppercase', marginBottom: 'var(--space-xl)', lineHeight: 1.1 }}>
            Ready to Automate <br/> Your Gym?
          </h2>
          <p style={{ color: 'var(--color-text-sub)', fontSize: '1.25rem', marginBottom: 'var(--space-2xl)', maxWidth: '500px', margin: '0 auto 40px' }}>
            Join 500+ gym owners who are saving hours every week with automated WhatsApp management.
          </p>
          <Link to="/register" className="btn btn--primary" style={{ fontSize: '1.2rem', padding: '1.25rem 3rem', borderRadius: '999px', display: 'inline-flex', boxShadow: '0 10px 40px rgba(204,255,0,0.2)' }}>
            Start your free trial now
          </Link>
        </motion.div>
      </section>

      {/* ── Fat Footer ── */}
      <footer style={{ padding: '80px 2rem 0', borderTop: '1px solid var(--color-border)', background: '#000', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px', paddingBottom: '60px' }}>
          
          <div style={{ gridColumn: '1 / -1', '@media (min-width: 768px)': { gridColumn: 'span 2' } } as any}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'var(--space-md)' }}>
              <Zap size={18} color="var(--color-accent-volt)" />
              <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--color-text-main)' }}>
                GymCRM
              </span>
            </div>
            <p style={{ color: 'var(--color-text-sub)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: '300px' }}>
              The modern operating system for gyms. We handle the WhatsApp infrastructure so you can focus on fitness.
            </p>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--color-text-main)' }}>Product</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link to="#features" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Features</Link></li>
              <li><Link to="#pricing" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Pricing</Link></li>
              <li><Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Integrations</Link></li>
              <li><Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--color-text-main)' }}>Resources</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Documentation</Link></li>
              <li><Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Help Center</Link></li>
              <li><Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Blog</Link></li>
              <li><Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>API Reference</Link></li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontWeight: 700, marginBottom: '20px', color: 'var(--color-text-main)' }}>Legal</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <li><Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Privacy Policy</Link></li>
              <li><Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Terms of Service</Link></li>
              <li><Link to="#" style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        {/* ── Giant Footer Brand Text ── */}
        <div ref={footerTextRef} style={{ textAlign: 'center', pointerEvents: 'none' }}>
           <motion.h1 
             style={{ 
               fontFamily: 'var(--font-display)', 
               fontSize: 'clamp(5rem, 18vw, 18rem)', 
               fontWeight: 900, 
               textTransform: 'uppercase', 
               lineHeight: 0.8,
               letterSpacing: '-0.04em',
               background: 'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.02) 100%)',
               WebkitBackgroundClip: 'text',
               WebkitTextFillColor: 'transparent',
               margin: 0,
               padding: 0,
               scale: footerTextScale,
               y: footerTextY,
               opacity: footerScroll
             }}
           >
             GymCRM
           </motion.h1>
        </div>

        <div style={{ maxWidth: '1200px', margin: '0 auto', borderTop: '1px solid rgba(255,255,255,0.05)', padding: '20px 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
            &copy; {new Date().getFullYear()} GymCRM Inc. All rights reserved.
          </div>
        </div>
      </footer>
      
      {/* ── Responsive Architecture Helpers ── */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .marquee-container { overflow: hidden; }
        .marquee-content {
          animation: marquee 30s linear infinite;
        }

        .desktop-orbit { display: none !important; }
        .mobile-only-grid { display: block !important; }
        @media (min-width: 1024px) {
          .desktop-orbit { display: block !important; }
          .mobile-only-grid { display: none !important; }
        }
      `}</style>
    </div>
  );
}
