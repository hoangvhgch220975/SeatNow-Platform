import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * @file ContactPage.jsx
 * @description Trang Liên hệ của SeatNow - Tích hợp gửi mail thực tế qua EmailJS và hỗ trợ đa ngôn ngữ.
 */
const ContactPage = () => {
  const { t } = useTranslation();
  const [isSending, setIsSending] = useState(false);
  const [formData, setFormData] = useState({
    from_name: '',
    from_email: '',
    phone: '',
    subject: 'general',
    message: ''
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.from_name || !formData.from_email || !formData.message) {
      toast.error(t('contact.messages.required_fields'));
      return;
    }
    const phoneRegex = /^(0|84|\+84)[35789][0-9]{8}$/;
    if (formData.phone && !phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      toast.error(t('contact.messages.invalid_phone'));
      return;
    }
    setIsSending(true);
    const loadingToast = toast.loading(t('contact.messages.sending'));
    try {
      const SERVICE_ID = 'service_7dl0kgf';
      const PUBLIC_KEY = 'mZjiHRIYclaK14awO';
      const TEMPLATE_ID = 'template_ajm6je2';
      const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, formData, PUBLIC_KEY);
      if (response.status === 200) {
        toast.success(t('contact.messages.success'), { id: loadingToast });
        setFormData({ from_name: '', from_email: '', phone: '', subject: 'general', message: '' });
      }
    } catch (error) {
      toast.error(t('contact.messages.error'), { id: loadingToast });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <main className="min-h-screen hero-gradient selection:bg-primary/10 -mt-16 pt-32 pb-40">
      {/* Hero Header */}
      <motion.section 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-screen-xl mx-auto px-8 mb-24 text-center md:text-left"
      >
        <span className="inline-block px-5 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em] mb-8">
           {t('contact.hero.badge') || 'Get in touch'}
        </span>
        <h1 className="text-8xl md:text-[9rem] font-black text-on-surface mb-8 tracking-tighter leading-[0.8] headline uppercase">
          {t('contact.hero.title')}
        </h1>
        <p className="text-2xl text-on-surface-variant/50 max-w-2xl leading-relaxed font-medium italic">
          {t('contact.hero.subtitle')}
        </p>
      </motion.section>

      {/* Main Content Grid */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-screen-xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-12 gap-20 mb-40"
      >
        {/* Contact Form */}
        <motion.div variants={itemVariants} className="lg:col-span-7 bg-white p-14 md:p-20 rounded-[4rem] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.05)] border border-outline/5">
          <h2 className="text-5xl font-black text-on-surface mb-12 headline tracking-tight">{t('contact.form.title')}</h2>
          <form className="space-y-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/30 ml-4">{t('contact.form.labels.full_name')}</label>
                <input 
                  name="from_name"
                  value={formData.from_name}
                  onChange={handleChange}
                  className="w-full bg-surface border-none rounded-3xl px-8 py-6 focus:ring-4 focus:ring-primary/5 text-on-surface placeholder:text-on-surface-variant/20 transition-all outline-none font-bold text-lg" 
                  placeholder={t('contact.form.placeholders.full_name')} 
                  type="text"
                  required
                />
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/30 ml-4">{t('contact.form.labels.email')}</label>
                <input 
                  name="from_email"
                  value={formData.from_email}
                  onChange={handleChange}
                  className="w-full bg-surface border-none rounded-3xl px-8 py-6 focus:ring-4 focus:ring-primary/5 text-on-surface placeholder:text-on-surface-variant/20 transition-all outline-none font-bold text-lg" 
                  placeholder={t('contact.form.placeholders.email')} 
                  type="email"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/30 ml-4">{t('contact.form.labels.phone')}</label>
                <input 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-surface border-none rounded-3xl px-8 py-6 focus:ring-4 focus:ring-primary/5 text-on-surface placeholder:text-on-surface-variant/20 transition-all outline-none font-bold text-lg" 
                  placeholder={t('contact.form.placeholders.phone')} 
                  type="tel"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/30 ml-4">{t('contact.form.labels.subject')}</label>
                <div className="relative">
                  <select 
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full bg-surface border-none rounded-3xl px-8 py-6 focus:ring-4 focus:ring-primary/5 text-on-surface appearance-none transition-all outline-none font-bold text-lg cursor-pointer pr-16"
                  >
                    <option value="general">{t('contact.form.subjects.general')}</option>
                    <option value="group">{t('contact.form.subjects.group')}</option>
                    <option value="corporate">{t('contact.form.subjects.corporate')}</option>
                    <option value="partnership">{t('contact.form.subjects.partnership')}</option>
                  </select>
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-primary">
                    <span className="material-symbols-outlined text-3xl">expand_more</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant/30 ml-4">{t('contact.form.labels.message')}</label>
              <textarea 
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-surface border-none rounded-[2.5rem] px-8 py-8 focus:ring-4 focus:ring-primary/5 text-on-surface placeholder:text-on-surface-variant/20 transition-all outline-none font-bold text-lg resize-none" 
                placeholder={t('contact.form.placeholders.message')} 
                rows="6"
                required
              ></textarea>
            </div>
            
            <div className="pt-6">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                disabled={isSending}
                className={`w-full md:w-auto bg-primary text-white px-20 py-7 rounded-full font-black text-xs uppercase tracking-[0.4em] hover:bg-primary-600 transition-all shadow-[0_30px_60px_-15px_rgba(var(--primary-rgb),0.3)] disabled:opacity-70 flex items-center justify-center gap-6`}
              >
                {isSending ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {t('contact.form.sending')}
                  </>
                ) : (
                  <>
                    {t('contact.form.submit')}
                    <span className="material-symbols-outlined text-xl">send</span>
                  </>
                )}
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Contact Info & Map */}
        <div className="lg:col-span-5 space-y-12">
          <div className="grid grid-cols-1 gap-6">
            <ContactInfoCard 
              variants={itemVariants}
              icon="call" 
              label={t('contact.info.hotline')} 
              value="(+0812823285)" 
            />
            <ContactInfoCard 
              variants={itemVariants}
              icon="mail" 
              label={t('contact.info.email')} 
              value="hoangvhgch220975@fpt.edu.vn" 
            />
            <ContactInfoCard 
              variants={itemVariants}
              icon="location_on" 
              label={t('contact.info.address')} 
              value={t('contact.info.address_value')} 
            />
            <ContactInfoCard 
              variants={itemVariants}
              icon="schedule" 
              label={t('contact.info.hours')} 
              value={`${t('contact.info.hours_mon_fri')} \n ${t('contact.info.hours_sat')}`} 
            />
          </div>

          {/* Map Container */}
          <motion.div 
            variants={itemVariants}
            className="relative h-96 w-full rounded-[4rem] overflow-hidden bg-white shadow-2xl border-8 border-white group"
          >
             <iframe 
               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.219920290671!2d105.7876374108942!3d21.02388468786508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135aba5c2abd13f%3A0xdf77997a38a7dba3!2zMiBQLiBQaOG6oW0gVsSDbiBC4bqhY2gsIFnDqm4gSMOyYSwgSMOgIE7hu5lpIDEwMDAwMCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1775202701999!5m2!1svi!2s" 
               width="100%" 
               height="100%" 
               style={{ border: 0 }} 
               allowFullScreen="" 
               loading="lazy" 
               referrerPolicy="no-referrer-when-downgrade"
               title="SeatNow Location"
               className="grayscale-[0.4] group-hover:grayscale-0 transition-all duration-1000 contrast-[1.1] brightness-[0.9] group-hover:brightness-100"
             ></iframe>
             <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-xl px-8 py-4 rounded-full text-[10px] font-black tracking-[0.3em] uppercase shadow-2xl border border-white/20">
                {t('contact.info.hq')}
             </div>
          </motion.div>
        </div>
      </motion.section>

      {/* FAQ Section */}
      <motion.section 
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="bg-surface py-40 rounded-t-[10rem] border-t border-outline/5 shadow-2xl"
      >
        <div className="max-w-screen-xl mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
            <div className="space-y-6">
              <p className="text-[11px] font-black uppercase tracking-[0.5em] text-primary">{t('contact.faq.badge')}</p>
              <h2 className="text-7xl font-black text-on-surface headline tracking-tighter">{t('contact.faq.title')}</h2>
            </div>
            <a className="text-primary font-black text-xs border-b-4 border-primary/10 hover:border-primary transition-all pb-2 uppercase tracking-[0.3em] mb-4" href="#">
              {t('contact.faq.view_all')}
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { q: t('contact.faq.q1'), a: t('contact.faq.a1') },
              { q: t('contact.faq.q2'), a: t('contact.faq.a2') },
              { q: t('contact.faq.q3'), a: t('contact.faq.a3') }
            ].map((item, idx) => (
              <motion.div 
                key={idx} 
                whileHover={{ y: -15 }}
                className="bg-white p-14 rounded-[3.5rem] shadow-sm border border-outline/5 hover:shadow-2xl transition-all duration-700 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-surface flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 mb-10">
                   <span className="material-symbols-outlined text-2xl font-bold">help</span>
                </div>
                <h3 className="text-2xl font-black mb-6 text-on-surface group-hover:text-primary transition-colors headline leading-tight">{item.q}</h3>
                <p className="text-on-surface-variant/50 leading-relaxed text-[15px] font-medium italic">
                  "{item.a}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </main>
  );
};

const ContactInfoCard = ({ icon, label, value, variants }) => (
  <motion.div 
    variants={variants}
    whileHover={{ x: 15 }}
    className="flex items-start gap-8 p-10 rounded-[3rem] bg-white border border-outline/5 hover:bg-surface transition-all duration-700 group shadow-sm hover:shadow-xl"
  >
    <div className="w-16 h-16 rounded-[1.5rem] bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 shadow-inner">
      <span className="material-symbols-outlined text-3xl font-bold">{icon}</span>
    </div>
    <div className="space-y-2 overflow-hidden">
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">{label}</p>
      <p className="text-xl font-black text-on-surface break-words leading-tight headline">{value}</p>
    </div>
  </motion.div>
);

export default ContactPage;
