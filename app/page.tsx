'use client';

import React, { useState, useMemo } from 'react';
import {
  LayoutDashboard, Kanban as KanbanIcon, FolderKanban, Bell, Search,
  ChevronRight, ChevronDown, Clock, AlertTriangle, CheckCircle2,
  Circle, Plus, Filter, X, FileText, MessageSquare, Users, History,
  Settings, LogOut, ChevronLeft, Camera, ShieldCheck, Wifi, Flame,
  Fuel, MapPin, Building2, DollarSign, Paperclip
} from 'lucide-react';

/* ============================================================
   Colores TOTEM
   ============================================================ */
const COLORS = {
  jordy: '#88AFF9',
  marian: '#2B3D8D',
  black: '#0A0A0A',
  champagne: '#DAC9BF',
  gray: '#BDBBBE',
  platinum: '#DBDFE2',
};

/* ---------- Datos de ejemplo ---------- */

const SOLUTION_ICONS: Record<string, React.ComponentType<any>> = {
  CCTV: Camera,
  CONTROL_ACCESO: ShieldCheck,
  REDES: Wifi,
  INCENDIO: Flame,
  COMBUSTIBLE: Fuel,
};

const SOLUTION_LABELS: Record<string, string> = {
  CCTV: 'CCTV',
  CONTROL_ACCESO: 'Control de Acceso',
  REDES: 'Redes',
  INCENDIO: 'Detección de Incendio',
  COMBUSTIBLE: 'Control de Combustible',
};

const STATUS_META: Record<string, any> = {
  BORRADOR: { label: 'Borrador', color: COLORS.gray, group: 'inicio' },
  REVISION_INICIAL: { label: 'Revisión inicial', color: COLORS.jordy, group: 'revision' },
  DEVUELTO_COMERCIAL: { label: 'Devuelto a Comercial', color: '#E0703A', group: 'revision' },
  EN_CHECKLIST: { label: 'En checklist', color: COLORS.jordy, group: 'checklist' },
  PREGUNTAS_INTERNAS: { label: 'Preguntas internas', color: '#D9A23B', group: 'checklist' },
  RESPUESTA_COMERCIAL: { label: 'Respuesta comercial', color: '#D9A23B', group: 'checklist' },
  REUNION_PENDIENTE: { label: 'Reunión pendiente', color: COLORS.marian, group: 'reunion' },
  REUNION_REALIZADA: { label: 'Reunión realizada', color: COLORS.marian, group: 'reunion' },
  AJUSTE_TECNICO: { label: 'Ajuste técnico', color: '#D9A23B', group: 'reunion' },
  EN_FASE_NINJA: { label: 'En Fase Ninja', color: COLORS.black, group: 'ninja' },
  APROBADO_FASE_NINJA: { label: 'Aprobado Fase Ninja', color: COLORS.black, group: 'ninja' },
  DOCUMENTO_FINAL_GENERADO: { label: 'Documento final generado', color: '#2F8F5B', group: 'ninja' },
  ENTREGADO_OPERACIONES: { label: 'Entregado a Operaciones', color: '#2F8F5B', group: 'fin' },
  SUSPENDIDO: { label: 'Suspendido', color: COLORS.gray, group: 'otros' },
  CANCELADO: { label: 'Cancelado', color: '#8A8A8A', group: 'otros' },
};

const KANBAN_COLUMNS = [
  { key: 'REVISION_INICIAL', label: 'Revisión inicial' },
  { key: 'EN_CHECKLIST', label: 'En checklist' },
  { key: 'REUNION_PENDIENTE', label: 'Reunión pendiente' },
  { key: 'EN_FASE_NINJA', label: 'Fase Ninja' },
  { key: 'ENTREGADO_OPERACIONES', label: 'Entregado' },
];

interface Project {
  id: string;
  name: string;
  client: string;
  executive: string;
  type: string;
  status: string;
  sla: string;
  value: number;
  locations: number;
  solutions: string[];
  progress: number;
  daysOpen: number;
  questionsOpen: number;
}

const PROJECTS: Project[] = [
  {
    id: 'PRY-2026-0114',
    name: 'CCTV + Monitoreo — Country Club Quito',
    client: 'Country Club Quito',
    executive: 'M. Vásconez',
    type: 'GRANDE',
    status: 'EN_CHECKLIST',
    sla: 'POR_VENCER',
    value: 84500,
    locations: 1,
    solutions: ['CCTV'],
    progress: 62,
    daysOpen: 9,
    questionsOpen: 2,
  },
  {
    id: 'PRY-2026-0118',
    name: 'VideoWall + Redes — CNT EP Matriz',
    client: 'CNT EP',
    executive: 'J. Saltos',
    type: 'ESPECIAL',
    status: 'REVISION_INICIAL',
    sla: 'DENTRO_TIEMPO',
    value: 132000,
    locations: 1,
    solutions: ['CCTV', 'REDES'],
    progress: 8,
    daysOpen: 1,
    questionsOpen: 0,
  },
  {
    id: 'PRY-2026-0109',
    name: 'Control de Acceso — Torre Corporativa Almar',
    client: 'Grupo Almar',
    executive: 'P. Endara',
    type: 'MEDIANO',
    status: 'REUNION_PENDIENTE',
    sla: 'DENTRO_TIEMPO',
    value: 46200,
    locations: 3,
    solutions: ['CONTROL_ACCESO'],
    progress: 100,
    daysOpen: 14,
    questionsOpen: 0,
  },
  {
    id: 'PRY-2026-0121',
    name: 'Detección de Incendio — Planta Promarisco',
    client: 'Promarisco',
    executive: 'M. Vásconez',
    type: 'GRANDE',
    status: 'EN_FASE_NINJA',
    sla: 'VENCIDO',
    value: 98700,
    locations: 2,
    solutions: ['INCENDIO'],
    progress: 100,
    daysOpen: 21,
    questionsOpen: 0,
  },
  {
    id: 'PRY-2026-0095',
    name: 'Control de Combustible — Estaciones CEMS',
    client: 'Grupo Almar Combustible',
    executive: 'J. Saltos',
    type: 'ESPECIAL',
    status: 'ENTREGADO_OPERACIONES',
    sla: 'DENTRO_TIEMPO',
    value: 210400,
    locations: 13,
    solutions: ['COMBUSTIBLE'],
    progress: 100,
    daysOpen: 38,
    questionsOpen: 0,
  },
  {
    id: 'PRY-2026-0116',
    name: 'CCTV — Bodega SENAE Guayaquil',
    client: 'SENAE',
    executive: 'P. Endara',
    type: 'MEDIANO',
    status: 'EN_CHECKLIST',
    sla: 'DENTRO_TIEMPO',
    value: 38900,
    locations: 1,
    solutions: ['CCTV', 'CONTROL_ACCESO'],
    progress: 34,
    daysOpen: 4,
    questionsOpen: 1,
  },
];

const CHECKLIST_SECTIONS = [
  {
    id: 'cctv',
    solution: 'CCTV',
    items: [
      { id: 1, label: 'Cantidad de cámaras', status: 'DONE', value: '48 cámaras' },
      { id: 2, label: 'Tipo de cámaras', status: 'DONE', value: 'Domo IP 4MP / Bullet IP 4MP' },
      { id: 3, label: 'Capacidad de grabación', status: 'DONE', value: '30 días, NVR 64ch' },
      { id: 4, label: 'Almacenamiento', status: 'DONE', value: '2x 16TB RAID 5' },
      { id: 5, label: 'Analítica de video', status: 'PENDING', value: '' },
      { id: 6, label: 'Infraestructura de red', status: 'DONE', value: 'Switch PoE+ 48p existente' },
      { id: 7, label: 'Respaldo de energía', status: 'PENDING', value: '' },
      { id: 8, label: 'Esquema de monitoreo 24/7', status: 'NOT_APPLICABLE', value: 'No aplica — venta sin monitoreo' },
      { id: 9, label: 'Planos de ubicación', status: 'DONE', value: 'Adjunto: planos_country_club_v2.pdf' },
      { id: 10, label: 'Licencias de software', status: 'PENDING', value: '' },
      { id: 11, label: 'Vigencia de equipos / garantía', status: 'DONE', value: '36 meses Hikvision' },
    ],
  },
  {
    id: 'fin',
    solution: 'APROBACION_FINANCIERA',
    label: 'Aprobación Financiera',
    items: [
      { id: 12, label: 'Margen estimado validado por Presupuesto', status: 'DONE', value: '22.4%' },
      { id: 13, label: 'Forma de pago confirmada con cliente', status: 'PENDING', value: '' },
      { id: 14, label: 'Aprobación de Gerencia (monto > USD 50,000)', status: 'PENDING', value: '' },
    ],
  },
];

/* ---------- Helper functions ---------- */

function slaBadge(sla: string) {
  const map: Record<string, any> = {
    DENTRO_TIEMPO: { label: 'Dentro de tiempo', color: '#2F8F5B', bg: '#EAF6EF' },
    POR_VENCER: { label: 'Por vencer', color: '#A87B12', bg: '#FBF3E1' },
    VENCIDO: { label: 'Vencido', color: '#C23B22', bg: '#FCEAE7' },
    SUSPENDIDO: { label: 'Suspendido', color: '#6B6B6B', bg: '#EDEDED' },
  };
  return map[sla] || map.DENTRO_TIEMPO;
}

function StatusDot({ color }: { color: string }) {
  return <span className="inline-block w-2 h-2 rounded-full" style={{ backgroundColor: color }} />;
}

function SlaPill({ sla }: { sla: string }) {
  const meta = slaBadge(sla);
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ color: meta.color, backgroundColor: meta.bg }}
    >
      <StatusDot color={meta.color} />
      {meta.label}
    </span>
  );
}

function fmtUSD(n: number) {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
}

/* ============================================================
   Componentes principales
   ============================================================ */

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'kanban', label: 'Proyectos', icon: KanbanIcon },
  { key: 'documentos', label: 'Documentos', icon: FolderKanban },
];

function KpiCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-white rounded-xl border border-[#E4E6EB] p-5 flex-1 min-w-[180px]">
      <p className="text-xs font-medium text-[#9B9EA6] uppercase tracking-wide mb-2">{label}</p>
      <p className="text-3xl font-extrabold tracking-tight" style={{ color: accent || '#16181D' }}>{value}</p>
      {sub && <p className="text-xs text-[#9B9EA6] mt-1">{sub}</p>}
    </div>
  );
}

function DashboardView({ projects, onSelect }: { projects: Project[]; onSelect: (p: Project) => void }) {
  const active = projects.filter((p) => !['ENTREGADO_OPERACIONES', 'CANCELADO'].includes(p.status));
  const overdue = projects.filter((p) => p.sla === 'VENCIDO');
  const slaCompliance = Math.round(
    (projects.filter((p) => p.sla !== 'VENCIDO').length / projects.length) * 100
  );
  const totalValue = active.reduce((s, p) => s + p.value, 0);

  const byPhase = useMemo(() => {
    const groups: Record<string, number> = {};
    KANBAN_COLUMNS.forEach((c) => (groups[c.key] = 0));
    projects.forEach((p) => {
      if (groups[p.status] !== undefined) groups[p.status] += 1;
    });
    return groups;
  }, [projects]);

  const maxPhase = Math.max(...Object.values(byPhase), 1);
  const upcoming = [...projects]
    .filter((p) => p.sla !== 'DENTRO_TIEMPO' && !['ENTREGADO_OPERACIONES'].includes(p.status))
    .sort((a) => (a.sla === 'VENCIDO' ? -1 : 1));

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 flex-wrap">
        <KpiCard label="Proyectos activos" value={active.length} sub={`${projects.length} totales`} />
        <KpiCard
          label="Cumplimiento SLA"
          value={`${slaCompliance}%`}
          accent={slaCompliance >= 80 ? '#2F8F5B' : '#C23B22'}
          sub="últimos 30 días"
        />
        <KpiCard label="Vencidos" value={overdue.length} accent={overdue.length > 0 ? '#C23B22' : '#2F8F5B'} sub="requieren atención" />
        <KpiCard label="Valor en pipeline" value={fmtUSD(totalValue)} sub="proyectos activos" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#E4E6EB] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm">Distribución por fase</h3>
            <button className="text-xs text-[#6B6F76] flex items-center gap-1 hover:text-[#16181D]">
              <Filter size={13} /> Filtros
            </button>
          </div>
          <div className="space-y-3">
            {KANBAN_COLUMNS.map((c) => {
              const count = byPhase[c.key] || 0;
              const pct = (count / maxPhase) * 100;
              return (
                <div key={c.key} className="flex items-center gap-3">
                  <span className="text-xs text-[#6B6F76] w-36 shrink-0">{c.label}</span>
                  <div className="flex-1 h-7 bg-[#F2F3F5] rounded-md overflow-hidden">
                    <div
                      className="h-full rounded-md flex items-center justify-end px-2 transition-all"
                      style={{ width: `${Math.max(pct, count > 0 ? 8 : 0)}%`, backgroundColor: COLORS.jordy }}
                    >
                      {count > 0 && <span className="text-xs font-semibold text-[#0A0A0A]">{count}</span>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#E4E6EB] p-5">
          <h3 className="font-semibold text-sm mb-4 flex items-center gap-2">
            <AlertTriangle size={15} style={{ color: '#C23B22' }} />
            Próximos a vencer
          </h3>
          <div className="space-y-3">
            {upcoming.map((p) => (
              <button
                key={p.id}
                onClick={() => onSelect(p)}
                className="w-full text-left p-3 rounded-lg border border-[#E4E6EB] hover:border-[#88AFF9] transition-colors"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-mono text-[#9B9EA6]">{p.id}</span>
                  <SlaPill sla={p.sla} />
                </div>
                <p className="text-sm font-medium leading-snug">{p.name}</p>
                <p className="text-xs text-[#9B9EA6] mt-1">{p.client} · {p.daysOpen} días abierto</p>
              </button>
            ))}
            {upcoming.length === 0 && (
              <p className="text-xs text-[#9B9EA6] text-center py-6">Sin proyectos en riesgo. Buen ritmo.</p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E4E6EB] overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-3">
          <h3 className="font-semibold text-sm">Todos los proyectos</h3>
          <button
            className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: COLORS.marian }}
          >
            <Plus size={14} /> Nuevo proyecto
          </button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs text-[#9B9EA6] border-t border-[#E4E6EB]">
              <th className="px-5 py-2 font-medium">Proyecto</th>
              <th className="px-5 py-2 font-medium">Cliente</th>
              <th className="px-5 py-2 font-medium">Estado</th>
              <th className="px-5 py-2 font-medium">SLA</th>
              <th className="px-5 py-2 font-medium">Valor</th>
              <th className="px-5 py-2 font-medium">Avance</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => {
              const meta = STATUS_META[p.status];
              return (
                <tr
                  key={p.id}
                  onClick={() => onSelect(p)}
                  className="border-t border-[#F2F3F5] hover:bg-[#FAFBFC] cursor-pointer"
                >
                  <td className="px-5 py-3">
                    <p className="font-medium">{p.name}</p>
                    <p className="text-xs font-mono text-[#9B9EA6]">{p.id}</p>
                  </td>
                  <td className="px-5 py-3 text-[#6B6F76]">{p.client}</td>
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs">
                      <StatusDot color={meta.color} /> {meta.label}
                    </span>
                  </td>
                  <td className="px-5 py-3"><SlaPill sla={p.sla} /></td>
                  <td className="px-5 py-3 text-[#6B6F76]">{fmtUSD(p.value)}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2 w-28">
                      <div className="flex-1 h-1.5 bg-[#F2F3F5] rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${p.progress}%`, backgroundColor: COLORS.jordy }} />
                      </div>
                      <span className="text-xs text-[#9B9EA6] w-8">{p.progress}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function KanbanView({ projects, onSelect }: { projects: Project[]; onSelect: (p: Project) => void }) {
  return (
    <div className="p-6 h-full">
      <div className="flex items-center justify-between mb-5">
        <p className="text-sm text-[#6B6F76]">{projects.length} proyectos en flujo</p>
        <button
          className="flex items-center gap-1.5 text-xs font-semibold text-white px-3 py-1.5 rounded-lg"
          style={{ backgroundColor: COLORS.marian }}
        >
          <Plus size={14} /> Nuevo proyecto
        </button>
      </div>
      <div className="flex gap-4 h-full overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => {
          const items = projects.filter((p) => p.status === col.key);
          return (
            <div key={col.key} className="w-72 shrink-0 flex flex-col">
              <div className="flex items-center justify-between px-2 mb-3">
                <h3 className="text-sm font-semibold">{col.label}</h3>
                <span className="text-xs text-[#9B9EA6] bg-[#F2F3F5] px-2 py-0.5 rounded-full">{items.length}</span>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto px-1">
                {items.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onSelect(p)}
                    className="w-full text-left bg-white rounded-xl border border-[#E4E6EB] p-4 hover:border-[#88AFF9] hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-mono text-[#9B9EA6]">{p.id}</span>
                      <SlaPill sla={p.sla} />
                    </div>
                    <p className="text-sm font-medium leading-snug mb-2">{p.name}</p>
                    <div className="flex items-center gap-2 mb-3">
                      {p.solutions.map((s) => {
                        const Icon = SOLUTION_ICONS[s];
                        return (
                          <span key={s} className="w-6 h-6 rounded-md flex items-center justify-center" style={{ backgroundColor: '#EEF2FE' }}>
                            <Icon size={13} style={{ color: COLORS.marian }} />
                          </span>
                        );
                      })}
                    </div>
                    <div className="flex items-center justify-between text-xs text-[#9B9EA6]">
                      <span className="flex items-center gap-1"><Building2 size={12} /> {p.client}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {p.daysOpen}d</span>
                    </div>
                    {p.questionsOpen > 0 && (
                      <div className="mt-2 pt-2 border-t border-[#F2F3F5] flex items-center gap-1.5 text-xs" style={{ color: '#A87B12' }}>
                        <MessageSquare size={12} /> {p.questionsOpen} pregunta{p.questionsOpen > 1 ? 's' : ''} abierta{p.questionsOpen > 1 ? 's' : ''}
                      </div>
                    )}
                  </button>
                ))}
                {items.length === 0 && (
                  <div className="text-center text-xs text-[#9B9EA6] py-8 border border-dashed border-[#E4E6EB] rounded-xl">
                    Sin proyectos
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ItemStatusIcon({ status }: { status: string }) {
  if (status === 'DONE') return <CheckCircle2 size={16} style={{ color: '#2F8F5B' }} />;
  if (status === 'NOT_APPLICABLE') return <X size={16} style={{ color: '#9B9EA6' }} />;
  return <Circle size={16} style={{ color: '#D9A23B' }} />;
}

function ChecklistSection({ section }: { section: any }) {
  const [open, setOpen] = useState(true);
  const done = section.items.filter((i: any) => i.status !== 'PENDING').length;
  const pct = Math.round((done / section.items.length) * 100);
  const Icon = SOLUTION_ICONS[section.solution];

  return (
    <div className="bg-white rounded-xl border border-[#E4E6EB] overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          {Icon ? (
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#EEF2FE' }}>
              <Icon size={16} style={{ color: COLORS.marian }} />
            </span>
          ) : (
            <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: COLORS.champagne }}>
              <DollarSign size={16} style={{ color: COLORS.marian }} />
            </span>
          )}
          <div className="text-left">
            <p className="text-sm font-semibold">{section.label || SOLUTION_LABELS[section.solution]}</p>
            <p className="text-xs text-[#9B9EA6]">{done} de {section.items.length} completados</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 bg-[#F2F3F5] rounded-full overflow-hidden hidden sm:block">
            <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: pct === 100 ? '#2F8F5B' : COLORS.jordy }} />
          </div>
          <span className="text-xs font-medium text-[#6B6F76] w-9 text-right">{pct}%</span>
          {open ? <ChevronDown size={16} className="text-[#9B9EA6]" /> : <ChevronRight size={16} className="text-[#9B9EA6]" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-[#F2F3F5]">
          {section.items.map((item: any) => (
            <div key={item.id} className="flex items-center gap-3 px-4 py-3 border-b border-[#F8F9FA] last:border-b-0 hover:bg-[#FAFBFC]">
              <ItemStatusIcon status={item.status} />
              <div className="flex-1">
                <p className="text-sm">{item.label}</p>
                {item.value && (
                  <p className={`text-xs mt-0.5 ${item.status === 'NOT_APPLICABLE' ? 'text-[#9B9EA6] italic' : 'text-[#6B6F76]'}`}>
                    {item.value.startsWith('Adjunto:') ? (
                      <span className="inline-flex items-center gap-1"><Paperclip size={11} />{item.value.replace('Adjunto: ', '')}</span>
                    ) : item.value}
                  </p>
                )}
              </div>
              {item.status === 'PENDING' && (
                <button className="text-xs font-medium px-2.5 py-1 rounded-md border border-[#E4E6EB] hover:border-[#88AFF9] shrink-0">
                  Completar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ChecklistTab({ project }: { project: Project }) {
  const allItems = CHECKLIST_SECTIONS.flatMap((s) => s.items);
  const totalDone = allItems.filter((i) => i.status !== 'PENDING').length;
  const totalPct = Math.round((totalDone / allItems.length) * 100);

  return (
    <div className="p-6 space-y-4 max-w-3xl">
      <div className="bg-white rounded-xl border border-[#E4E6EB] p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Avance total del checklist</p>
          <p className="text-xs text-[#9B9EA6]">{totalDone} de {allItems.length} ítems · obligatorios excluidos los marcados "no aplica"</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-40 h-2 bg-[#F2F3F5] rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${totalPct}%`, backgroundColor: totalPct === 100 ? '#2F8F5B' : COLORS.jordy }} />
          </div>
          <span className="text-sm font-bold" style={{ color: COLORS.marian }}>{totalPct}%</span>
        </div>
      </div>

      {CHECKLIST_SECTIONS.map((s) => (
        <ChecklistSection key={s.id} section={s} />
      ))}
    </div>
  );
}

function DetailView({ project, onBack }: { project: Project; onBack: () => void }) {
  const [tab, setTab] = useState('checklist');
  const meta = STATUS_META[project.status];

  const tabs = [
    { key: 'resumen', label: 'Resumen', icon: FileText },
    { key: 'checklist', label: 'Checklist', icon: CheckCircle2 },
    { key: 'preguntas', label: 'Preguntas', icon: MessageSquare },
    { key: 'reunion', label: 'Reunión', icon: Users },
    { key: 'documentos', label: 'Documentos', icon: FolderKanban },
    { key: 'bitacora', label: 'Bitácora', icon: History },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-[#E4E6EB] px-6 pt-5">
        <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-[#6B6F76] hover:text-[#16181D] mb-3">
          <ChevronLeft size={14} /> Volver a proyectos
        </button>
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-mono text-[#9B9EA6]">{project.id}</span>
              <span className="inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: '#F2F3F5' }}>
                <StatusDot color={meta.color} /> {meta.label}
              </span>
              <SlaPill sla={project.sla} />
            </div>
            <h2 className="text-lg font-bold">{project.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button className="text-xs font-semibold px-3 py-2 rounded-lg border border-[#E4E6EB] text-[#6B6F76] hover:border-[#88AFF9]">
              Devolver
            </button>
            <button className="text-xs font-semibold px-3 py-2 rounded-lg text-white" style={{ backgroundColor: COLORS.marian }}>
              Avanzar a Reunión
            </button>
          </div>
        </div>
        <div className="flex items-center gap-6 text-xs text-[#6B6F76] pb-4 flex-wrap">
          <span className="flex items-center gap-1.5"><Building2 size={13} /> {project.client}</span>
          <span className="flex items-center gap-1.5"><Users size={13} /> {project.executive}</span>
          <span className="flex items-center gap-1.5"><MapPin size={13} /> {project.locations} localidad{project.locations > 1 ? 'es' : ''}</span>
          <span className="flex items-center gap-1.5"><DollarSign size={13} /> {fmtUSD(project.value)}</span>
        </div>
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors shrink-0"
                style={{
                  borderColor: active ? COLORS.marian : 'transparent',
                  color: active ? COLORS.marian : '#9B9EA6',
                }}
              >
                <Icon size={14} /> {t.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {tab === 'checklist' && <ChecklistTab project={project} />}
        {tab !== 'checklist' && (
          <div className="flex items-center justify-center h-64 text-sm text-[#9B9EA6]">
            Sección "{tabs.find((t) => t.key === tab)?.label}" — fuera del alcance de este prototipo.
          </div>
        )}
      </div>
    </div>
  );
}

export default function TotemFlowApp() {
  const [view, setView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [collapsed, setCollapsed] = useState(false);

  const openDetail = (project: Project) => {
    setSelectedProject(project);
    setView('detail');
  };

  return (
    <div className="h-screen w-full flex bg-[#F5F6F8] text-[#16181D]">
      {/* Sidebar */}
      <aside
        className={`flex flex-col shrink-0 transition-all duration-200 ${collapsed ? 'w-[68px]' : 'w-[240px]'}`}
        style={{ backgroundColor: COLORS.black }}
      >
        <div className="flex items-center justify-between px-4 h-16 border-b border-white/10">
          {!collapsed && (
            <div className="flex items-baseline gap-1.5 overflow-hidden">
              <span className="text-white font-extrabold text-lg tracking-tight">TOTEM</span>
              <span className="font-medium text-sm" style={{ color: COLORS.jordy }}>Flow</span>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} className="text-white/50 hover:text-white p-1">
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        <nav className="flex-1 px-2 py-4 space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = view === item.key || (item.key === 'kanban' && view === 'detail');
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
                style={{
                  backgroundColor: active ? 'rgba(136,175,249,0.15)' : 'transparent',
                  color: active ? COLORS.jordy : 'rgba(255,255,255,0.65)',
                }}
              >
                <Icon size={18} strokeWidth={2} />
                {!collapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="px-2 py-4 border-t border-white/10 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white/80">
            <Settings size={18} />
            {!collapsed && <span>Configuración</span>}
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white/80">
            <LogOut size={18} />
            {!collapsed && <span>Salir</span>}
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-[#E4E6EB] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-2 text-sm text-[#6B6F76]">
            <span className="font-medium text-[#16181D]">
              {view === 'dashboard' && 'Dashboard'}
              {view === 'kanban' && 'Proyectos'}
              {view === 'detail' && selectedProject?.id}
              {view === 'documentos' && 'Documentos'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9B9EA6]" />
              <input
                placeholder="Buscar proyecto..."
                className="pl-9 pr-3 py-2 rounded-lg bg-[#F2F3F5] text-sm w-64 outline-none"
                style={{ '--tw-ring-color': COLORS.jordy } as React.CSSProperties}
              />
            </div>
            <button className="relative text-[#6B6F76] hover:text-[#16181D]">
              <Bell size={20} />
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[10px] flex items-center justify-center text-white font-semibold"
                style={{ backgroundColor: '#C23B22' }}
              >
                3
              </span>
            </button>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold"
              style={{ backgroundColor: COLORS.marian }}
            >
              JS
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto">
          {view === 'dashboard' && <DashboardView projects={PROJECTS} onSelect={openDetail} />}
          {view === 'kanban' && <KanbanView projects={PROJECTS} onSelect={openDetail} />}
          {view === 'detail' && selectedProject && (
            <DetailView project={selectedProject} onBack={() => setView('kanban')} />
          )}
          {view === 'documentos' && (
            <div className="flex items-center justify-center h-full text-sm text-[#9B9EA6]">
              Vista "Documentos" — fuera del alcance de este prototipo.
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
