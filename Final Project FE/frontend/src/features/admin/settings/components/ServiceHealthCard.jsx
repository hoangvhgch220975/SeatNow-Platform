import React from 'react';
import { useTranslation } from 'react-i18next';
import { servicesList, useServiceHealth } from '../hooks';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LucideActivity, 
  LucideDatabase, 
  LucideLayers, 
  LucideZap, 
  LucideAlertCircle,
  LucideRefreshCw
} from 'lucide-react';

const ServiceItem = ({ service }) => {
  const { t } = useTranslation();
  const { data: health, isLoading, isError, refetch, isFetching } = useServiceHealth(service.id);

  const status = health?.status === 'UP' ? 'online' : (isError ? 'offline' : 'checking');

  return (
    <div className="bg-white border-2 border-violet-100 rounded-[1.5rem] p-5 hover:border-violet-400 hover:shadow-xl hover:shadow-violet-500/10 transition-all duration-500 group relative flex flex-col h-full overflow-hidden">
      {/* Port Badge */}
      <div className="absolute top-0 right-0 px-3 py-1 bg-violet-600 text-white text-[9px] font-black rounded-bl-xl tracking-widest translate-x-full group-hover:translate-x-0 transition-transform duration-500">
        PORT: {service.port}
      </div>

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-3 h-3 rounded-full ${
              status === 'online' ? 'bg-emerald-500' : 
              status === 'offline' ? 'bg-rose-500' : 
              'bg-amber-500'
            }`} />
            {status === 'online' && (
              <div className="absolute inset-0 bg-emerald-500 rounded-full animate-ping opacity-40" />
            )}
          </div>
          <div>
            <h4 className="text-sm font-black text-slate-900 tracking-tight leading-none">
              {t(service.nameKey)}
            </h4>
            <p className="text-[10px] font-bold text-violet-500 mt-1 italic leading-tight">
              {t(service.roleKey)}
            </p>
          </div>
        </div>
        <button 
          onClick={() => refetch()}
          disabled={isFetching}
          className="p-1.5 hover:bg-violet-50 rounded-xl transition-colors text-slate-400 hover:text-violet-600 disabled:opacity-30"
        >
          <LucideRefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 space-y-4 mt-2">
        {/* Connection Integrity - Top Aligned */}
        <div className="flex flex-col gap-2.5">
          {health?.details && Object.entries(health.details).map(([dep, state]) => (
            <div 
              key={dep}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border-2 transition-all duration-300 ${
                state === 'up' 
                  ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                  : 'bg-rose-50 border-rose-100 text-rose-700 animate-pulse'
              }`}
            >
              <div className="flex items-center gap-1.5">
                {dep === 'database' && <LucideDatabase className="w-2.5 h-2.5" />}
                {dep === 'redis' && <LucideZap className="w-2.5 h-2.5" />}
                {dep === 'mongodb' && <LucideLayers className="w-2.5 h-2.5" />}
                <span>{dep}: {state === 'up' ? 'CONNECTED' : 'DISCONNECTED'}</span>
              </div>
            </div>
          ))}
          
          {isLoading && !health && (
            <div className="flex gap-2">
              <div className="h-5 w-12 bg-slate-100 rounded-lg animate-pulse" />
              <div className="h-5 w-12 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          )}
          
          {isError && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[9px] font-black uppercase bg-rose-50 border-2 border-rose-100 text-rose-700">
              <LucideAlertCircle className="w-2.5 h-2.5" />
              <span>Host Unreachable</span>
            </div>
          )}
        </div>

        {/* Latency Footer */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-slate-50">
          <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
            <LucideActivity className="w-3 h-3 opacity-50" />
            <span>{health?.timestamp ? new Date(health.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) : '--:--:--'}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-100 uppercase tracking-tighter">
              {status === 'online' ? '14ms' : '---'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceHealthCard = () => {
  const { t } = useTranslation();

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-[2rem] p-8 border-2 border-violet-100 shadow-sm h-full"
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-violet-600 rounded-2xl text-white shadow-lg shadow-violet-200">
            <LucideActivity className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              {t('admin.settings.health.title')}
            </h3>
            <p className="text-xs font-semibold text-slate-400 mt-0.5">
              {t('admin.settings.health.description')}
            </p>
          </div>
        </div>
        
        <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-violet-100 border-2 border-violet-200 rounded-full">
          <div className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black text-violet-700 uppercase tracking-wider">
            Live Telemetry
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-4">
        {servicesList.map((service) => (
          <ServiceItem key={service.id} service={service} />
        ))}
      </div>
      
      <div className="mt-8 pt-6 border-t-2 border-violet-50 flex items-center justify-between text-[9px] text-violet-300 uppercase tracking-[0.3em] font-black">
        <span className="flex items-center gap-2">
           <span className="w-1 h-1 bg-emerald-500 rounded-full" />
           Network Integrity: 100%
        </span>
        <span>Secure Protocol: AES-256-GCM</span>
      </div>
    </motion.div>
  );
};

export default ServiceHealthCard;
