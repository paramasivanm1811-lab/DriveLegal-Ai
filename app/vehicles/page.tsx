import { AlertTriangle, Car, Truck, Bus, ShieldAlert } from "lucide-react";
import { PrismaClient } from "@prisma/client";
import defaultLawsData from '@/data/laws.json';

const prisma = new PrismaClient();

const VEHICLE_CONFIGS: Record<string, { title: string, icon: any, bg: string, text: string }> = {
  '2-Wheeler': {
    title: '2-Wheelers (Bikes & Scooters)',
    icon: AlertTriangle,
    bg: 'bg-blue-100',
    text: 'text-blue-600'
  },
  '4-Wheeler': {
    title: '4-Wheelers (Cars & SUVs)',
    icon: Car,
    bg: 'bg-indigo-100',
    text: 'text-indigo-600'
  },
  'Auto': {
    title: 'Auto Rickshaws',
    icon: ShieldAlert,
    bg: 'bg-yellow-100',
    text: 'text-yellow-600'
  },
  'Bus': {
    title: 'Buses & School Vans',
    icon: Bus,
    bg: 'bg-green-100',
    text: 'text-green-600'
  },
  'Lorry': {
    title: 'Commercial Lorries & Trucks',
    icon: Truck,
    bg: 'bg-orange-100',
    text: 'text-orange-600'
  }
};

export default async function VehiclesPage() {
  let laws: any[] = [];
  try {
    laws = await prisma.law.findMany({
      where: {
        AND: [
          { vehicleType: { not: 'All' } },
          { vehicleType: { not: null } }
        ]
      },
      orderBy: {
        title: 'asc'
      }
    });
  } catch (error) {
    console.error("Failed to fetch vehicle rules from database:", error);
  }

  // Fallback to static seed data if DB is empty or fails to query
  if (laws.length === 0) {
    laws = (defaultLawsData as any[]).filter(l => l.vehicleType && l.vehicleType !== 'All');
  }

  // Group rules by vehicleType
  const groupedRules: Record<string, any[]> = {};
  laws.forEach(law => {
    const type = law.vehicleType || 'Other';
    if (!groupedRules[type]) {
      groupedRules[type] = [];
    }
    groupedRules[type].push(law);
  });

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl flex-1">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Vehicle Specific Rules</h1>
        <p className="text-gray-600 max-w-xl mx-auto">Tamil Nadu traffic regulations categorized by vehicle type, fetched dynamically.</p>
      </div>
      
      <div className="space-y-6">
        {Object.entries(VEHICLE_CONFIGS).map(([type, config]) => {
          const rules = groupedRules[type] || [];
          if (rules.length === 0) return null;
          
          const Icon = config.icon;
          
          return (
            <div key={type} className="bg-white p-6 rounded-2xl border border-gray-200 flex items-start gap-4 hover:shadow-lg transition-all duration-300">
              <div className={`${config.bg} p-3 rounded-xl ${config.text} shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-3 text-gray-900">{config.title}</h3>
                <ul className="list-disc pl-5 text-gray-600 space-y-2 text-sm">
                  {rules.map((rule) => (
                    <li key={rule.id} className="leading-relaxed">
                      <span className="font-bold text-gray-800">{rule.title}</span>
                      {rule.category && rule.category !== 'General' && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                          {rule.category}
                        </span>
                      )}
                      {rule.district && rule.district !== 'All' && (
                        <span className="ml-2 text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                          {rule.district}
                        </span>
                      )}
                      : {rule.desc} 
                      <span className="ml-2 font-black text-red-600 whitespace-nowrap">({rule.penalty})</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
