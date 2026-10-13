import React, { useState, useEffect } from 'react';
import { 
  Activity, Server, Database, CheckCircle, AlertTriangle, 
  Clock, Play, RefreshCw, Terminal, Cpu, HardDrive, Filter, Search, Eye
} from 'lucide-react';

export default function App() {
  const [jobs, setJobs] = useState([
    { id: 'job-101', name: 'EmailNotificationBatch', queue: 'notifications', status: 'completed', attempts: 1, duration: '120ms', createdAt: '10:42:15', payload: '{"users": 450, "template": "weekly_newsletter"}' },
    { id: 'job-102', name: 'GenerateMonthlyReport', queue: 'reports', status: 'processing', attempts: 1, duration: '2.4s', createdAt: '10:44:00', payload: '{"month": "October", "format": "PDF"}' },
    { id: 'job-103', name: 'ImageResizeOptimizer', queue: 'media', status: 'pending', attempts: 0, duration: '-', createdAt: '10:45:10', payload: '{"image_id": "img_9874", "sizes": ["thumb", "hd"]}' },
    { id: 'job-104', name: 'SyncPaymentGatewayLogs', queue: 'payments', status: 'failed', attempts: 3, duration: '500ms', createdAt: '10:40:02', payload: '{"gateway": "Stripe", "transaction": "tx_3321"}' },
  ]);

  const [metrics, setMetrics] = useState({
    totalJobs: 1420,
    activeJobs: 18,
    successRate: '98.4%',
    avgDuration: '340ms',
    cpuUsage: 32,
    memoryUsage: 45
  });

  const [selectedLog, setSelectedLog] = useState(null);
  const [filterQueue, setFilterQueue] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Simulación de métricas dinámicas
  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        cpuUsage: Math.floor(25 + Math.random() * 30),
        memoryUsage: Math.floor(40 + Math.random() * 15)
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleRetry = (id) => {
    setJobs(prev => prev.map(job => 
      job.id === id ? { ...job, status: 'pending', attempts: job.attempts + 1 } : job
    ));
  };
  const handleDispatchJob = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'CustomScheduledTask',
          queue: 'default',
          payload: { task: 'manual_trigger', timestamp: new Date().toISOString() }
        })
      });

      if (!response.ok) throw new Error('Error al despachar la tarea en el servidor');

      const data = await response.json();
      
      const newJob = {
        id: data.jobId || `job-${Math.floor(100 + Math.random() * 900)}`,
        name: 'CustomScheduledTask',
        queue: 'default',
        status: 'pending',
        attempts: 0,
        duration: '-',
        createdAt: new Date().toLocaleTimeString(),
        payload: '{"task": "manual_trigger"}'
      };
      setJobs([newJob, ...jobs]);
      alert('¡Tarea despachada y encolada con éxito en BullMQ!');
    } catch (error) {
      console.error(error);
      alert('No se pudo conectar con el servidor backend. Asegúrate de que esté corriendo en el puerto 3000.');
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesQueue = filterQueue === 'all' || job.queue === filterQueue;
    const matchesSearch = job.name.toLowerCase().includes(searchQuery.toLowerCase()) || job.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesQueue && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 font-sans">
      {/* Top Bar / Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/20 text-indigo-400 rounded-lg border border-indigo-500/30">
              <Activity size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Distributed Job Scheduler</h1>
              <p className="text-xs text-slate-400">Node.js • Express • BullMQ • Redis • Docker</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Redis Engine Online
          </span>
          <button 
            onClick={() => {
              const newJob = {
                id: `job-${Math.floor(100 + Math.random() * 900)}`,
                name: 'CustomScheduledTask',
                queue: 'default',
                status: 'pending',
                attempts: 0,
                duration: '-',
                createdAt: new Date().toLocaleTimeString(),
                payload: '{"task": "manual_trigger"}'
              };
              setJobs([newJob, ...jobs]);
            }}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all shadow-lg shadow-indigo-600/20"
          >
            <Play size={14} /> Despachar Tarea
          </button>
        </div>
      </header>

      {/* Metrics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Trabajos Totales Processados</p>
            <p className="text-2xl font-bold text-slate-100">{metrics.totalJobs}</p>
          </div>
          <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg">
            <Server size={20} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">En Cola Activa (BullMQ)</p>
            <p className="text-2xl font-bold text-amber-400">{metrics.activeJobs}</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-lg">
            <Database size={20} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Tasa de Éxito</p>
            <p className="text-2xl font-bold text-emerald-400">{metrics.successRate}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-lg">
            <CheckCircle size={20} />
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-medium mb-1">Tiempo Promedio</p>
            <p className="text-2xl font-bold text-indigo-400">{metrics.avgDuration}</p>
          </div>
          <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-lg">
            <Clock size={20} />
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Jobs Table (2 Cols) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-indigo-400" /> Monitoreo de Tareas en Vivo
            </h2>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search size={14} className="absolute left-3 top-2.5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="Buscar trabajo..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
                />
              </div>

              <select 
                value={filterQueue}
                onChange={(e) => setFilterQueue(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 px-3 py-1.5 rounded-lg focus:outline-none focus:border-indigo-500"
              >
                <option value="all">Todas las colas</option>
                <option value="notifications">notifications</option>
                <option value="reports">reports</option>
                <option value="media">media</option>
                <option value="payments">payments</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-3">ID / Nombre</th>
                  <th className="py-3 px-3">Cola</th>
                  <th className="py-3 px-3">Estado</th>
                  <th className="py-3 px-3">Reintentos</th>
                  <th className="py-3 px-3">Duración</th>
                  <th className="py-3 px-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredJobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-200">{job.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{job.id} • {job.createdAt}</div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px]">
                        {job.queue}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      {job.status === 'completed' && <span className="text-emerald-400 font-medium">Completado</span>}
                      {job.status === 'processing' && <span className="text-amber-400 font-medium animate-pulse">Procesando...</span>}
                      {job.status === 'pending' && <span className="text-blue-400 font-medium">Pendiente</span>}
                      {job.status === 'failed' && <span className="text-rose-400 font-medium">Fallido</span>}
                    </td>
                    <td className="py-3 px-3 text-slate-400">{job.attempts}</td>
                    <td className="py-3 px-3 text-slate-400">{job.duration}</td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedLog(job)}
                          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded transition-colors"
                          title="Ver Payload / Log"
                        >
                          <Eye size={14} />
                        </button>
                        {job.status === 'failed' && (
                          <button 
                            onClick={() => handleRetry(job.id)}
                            className="p-1.5 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 rounded transition-colors"
                            title="Reintentar Trabajo"
                          >
                            <RefreshCw size={14} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* System Health & Docker Logs (1 Col) */}
        <div className="space-y-6">
          {/* Resource Usage */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Cpu size={16} className="text-emerald-400" /> Infraestructura Docker
            </h2>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Uso de CPU (Worker Cluster)</span>
                  <span className="font-mono text-slate-200">{metrics.cpuUsage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${metrics.cpuUsage}%` }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-slate-400 mb-1">
                  <span>Memoria RAM (Redis Engine)</span>
                  <span className="font-mono text-slate-200">{metrics.memoryUsage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${metrics.memoryUsage}%` }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Docker Terminal Logs */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
              <Terminal size={16} className="text-amber-400" /> System Logs
            </h2>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-400 space-y-1.5 h-48 overflow-y-auto">
              <p className="text-slate-500">[SYSTEM] Redis connection established on port 6379</p>
              <p className="text-emerald-400">[BULLMQ] Worker node #1 ready for queue "notifications"</p>
              <p className="text-slate-400">[JOB:101] Execution successful (120ms)</p>
              <p className="text-amber-400">[JOB:102] Processing payload chunk 1/2...</p>
              <p className="text-rose-400">[JOB:104] Error: Stripe API Timeout (Retry 3/3)</p>
              <p className="text-indigo-400">[DOCKER] Health check passed for container scheduler-api</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal / Log Inspector */}
      {selectedLog && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full p-5 shadow-2xl">
            <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
              <h3 className="text-sm font-semibold text-slate-200">Payload Detallado ({selectedLog.id})</h3>
              <button onClick={() => setSelectedLog(null)} className="text-slate-500 hover:text-slate-200 text-xs">Cerrar ✕</button>
            </div>
            <pre className="bg-slate-950 p-4 rounded-lg text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 mb-4">
              {JSON.stringify(JSON.parse(selectedLog.payload), null, 2)}
            </pre>
            <div className="flex justify-end">
              <button 
                onClick={() => setSelectedLog(null)}
                className="bg-slate-800 hover:bg-slate-700 text-xs font-semibold px-4 py-2 rounded-lg text-slate-200 transition-colors"
              >
                Aceptar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
