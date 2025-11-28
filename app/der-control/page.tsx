'use client';

import { useState } from 'react';
import DerCard from '@/components/scada/DerCard';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertCircle } from 'lucide-react';

interface DER {
  id: string;
  name: string;
  type: 'PV' | 'WIND' | 'BESS' | 'GENSET';
  status: 'ONLINE' | 'OFFLINE' | 'FAULT' | 'CURTAILED';
  pMax: number;
  pActual: number;
  qActual: number;
  curtailmentPercent: number;
  isEnabled: boolean;
  substation?: string;
  feeder?: string;
}

export default function DerControlPage() {
  const [ders, setDers] = useState<DER[]>([
    {
      id: '1',
      name: 'Solar Farm A',
      type: 'PV',
      status: 'ONLINE',
      pMax: 5000,
      pActual: 4250,
      qActual: 120,
      curtailmentPercent: 15,
      isEnabled: true,
      substation: 'SUB-01',
      feeder: 'F-123',
    },
    {
      id: '2',
      name: 'Wind Turbine 1',
      type: 'WIND',
      status: 'ONLINE',
      pMax: 3000,
      pActual: 2800,
      qActual: 80,
      curtailmentPercent: 0,
      isEnabled: true,
      substation: 'SUB-01',
      feeder: 'F-124',
    },
    {
      id: '3',
      name: 'BESS Unit 1',
      type: 'BESS',
      status: 'CURTAILED',
      pMax: 2000,
      pActual: 1000,
      qActual: 50,
      curtailmentPercent: 50,
      isEnabled: true,
      substation: 'SUB-02',
      feeder: 'F-125',
    },
    {
      id: '4',
      name: 'Solar Farm B',
      type: 'PV',
      status: 'ONLINE',
      pMax: 4000,
      pActual: 3800,
      qActual: 100,
      curtailmentPercent: 5,
      isEnabled: true,
      substation: 'SUB-02',
      feeder: 'F-126',
    },
    {
      id: '5',
      name: 'Wind Turbine 2',
      type: 'WIND',
      status: 'OFFLINE',
      pMax: 3000,
      pActual: 0,
      qActual: 0,
      curtailmentPercent: 0,
      isEnabled: false,
      substation: 'SUB-03',
      feeder: 'F-127',
    },
    {
      id: '6',
      name: 'BESS Unit 2',
      type: 'BESS',
      status: 'ONLINE',
      pMax: 2500,
      pActual: 2400,
      qActual: 60,
      curtailmentPercent: 0,
      isEnabled: true,
      substation: 'SUB-03',
      feeder: 'F-128',
    },
  ]);

  const [selectedDer, setSelectedDer] = useState<DER | null>(null);
  const [curtailmentValue, setCurtailmentValue] = useState(0);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  const handleControl = (id: string, action: string) => {
    const der = ders.find((d) => d.id === id);
    if (der) {
      setSelectedDer(der);
      setCurtailmentValue(der.curtailmentPercent);
    }
  };

  const applyCurtailment = () => {
    if (selectedDer) {
      setDers((prev) =>
        prev.map((d) =>
          d.id === selectedDer.id
            ? {
                ...d,
                curtailmentPercent: curtailmentValue,
                status: curtailmentValue > 0 ? 'CURTAILED' : 'ONLINE',
                pActual: d.pMax * (1 - curtailmentValue / 100),
              }
            : d
        )
      );
      setSelectedDer(null);
    }
  };

  const applyAiOptimal = () => {
    // Simulate AI-recommended curtailment
    const aiRecommendations = {
      '1': 20,
      '2': 0,
      '3': 30,
      '4': 10,
      '5': 0,
      '6': 5,
    };

    setDers((prev) =>
      prev.map((d) => {
        const recommended = aiRecommendations[d.id as keyof typeof aiRecommendations] || 0;
        return {
          ...d,
          curtailmentPercent: recommended,
          status: recommended > 0 ? 'CURTAILED' : d.status === 'OFFLINE' ? 'OFFLINE' : 'ONLINE',
          pActual: d.isEnabled ? d.pMax * (1 - recommended / 100) : 0,
        };
      })
    );
  };

  const filteredDers = ders.filter((der) => {
    const statusMatch = filterStatus === 'ALL' || der.status === filterStatus;
    const typeMatch = filterType === 'ALL' || der.type === filterType;
    return statusMatch && typeMatch;
  });

  const totalGeneration = ders.reduce((sum, der) => sum + der.pActual, 0);
  const totalCapacity = ders.reduce((sum, der) => sum + der.pMax, 0);
  const avgCurtailment =
    ders.reduce((sum, der) => sum + der.curtailmentPercent, 0) / ders.length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-scada-cyan neon-text">DER Control</h1>
          <p className="text-scada-blue/70 mt-1">
            Monitor and control Distributed Energy Resources
          </p>
        </div>

        {/* AI Optimal Button */}
        <button
          onClick={applyAiOptimal}
          className="scada-button-success flex items-center space-x-2"
        >
          <AlertCircle className="w-5 h-5" />
          <span>Apply AI-Optimal Curtailment</span>
        </button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="scada-panel">
          <div className="scada-label mb-2">Total Generation</div>
          <div className="scada-value">
            {totalGeneration.toFixed(0)} <span className="text-lg">kW</span>
          </div>
          <div className="text-xs text-scada-blue/70 mt-1">
            {((totalGeneration / totalCapacity) * 100).toFixed(1)}% of capacity
          </div>
        </div>

        <div className="scada-panel">
          <div className="scada-label mb-2">Total Capacity</div>
          <div className="scada-value">
            {totalCapacity.toFixed(0)} <span className="text-lg">kW</span>
          </div>
          <div className="text-xs text-scada-blue/70 mt-1">
            {ders.filter((d) => d.status === 'ONLINE' || d.status === 'CURTAILED').length} of{' '}
            {ders.length} online
          </div>
        </div>

        <div className="scada-panel">
          <div className="scada-label mb-2">Average Curtailment</div>
          <div
            className={`text-2xl font-bold ${
              avgCurtailment > 20
                ? 'text-scada-red'
                : avgCurtailment > 10
                ? 'text-scada-yellow'
                : 'text-scada-green'
            }`}
          >
            {avgCurtailment.toFixed(1)} <span className="text-lg">%</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="scada-panel">
        <div className="flex items-center space-x-4">
          <div>
            <label className="scada-label block mb-2">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="scada-input"
            >
              <option value="ALL">All Status</option>
              <option value="ONLINE">Online</option>
              <option value="OFFLINE">Offline</option>
              <option value="CURTAILED">Curtailed</option>
              <option value="FAULT">Fault</option>
            </select>
          </div>

          <div>
            <label className="scada-label block mb-2">Filter by Type</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="scada-input"
            >
              <option value="ALL">All Types</option>
              <option value="PV">Solar (PV)</option>
              <option value="WIND">Wind</option>
              <option value="BESS">Battery (BESS)</option>
              <option value="GENSET">Generator</option>
            </select>
          </div>

          <div className="flex-1"></div>

          <div className="text-sm text-scada-blue/70">
            Showing {filteredDers.length} of {ders.length} DERs
          </div>
        </div>
      </div>

      {/* DER Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDers.map((der) => (
          <DerCard key={der.id} {...der} onControl={handleControl} />
        ))}
      </div>

      {/* Control Modal */}
      <AnimatePresence>
        {selectedDer && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setSelectedDer(null)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 flex items-center justify-center z-50 p-4"
            >
              <div className="scada-panel max-w-md w-full">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-scada-cyan">
                      Set Curtailment
                    </h2>
                    <p className="text-scada-blue/70 mt-1">{selectedDer.name}</p>
                  </div>
                  <button
                    onClick={() => setSelectedDer(null)}
                    className="p-2 hover:bg-scada-red/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-scada-red" />
                  </button>
                </div>

                {/* Current values */}
                <div className="mb-6 p-4 bg-scada-blue/10 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="scada-label">Current Output</div>
                      <div className="text-scada-cyan font-bold">
                        {selectedDer.pActual.toFixed(1)} kW
                      </div>
                    </div>
                    <div>
                      <div className="scada-label">Current Curtailment</div>
                      <div className="text-scada-yellow font-bold">
                        {selectedDer.curtailmentPercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Curtailment slider */}
                <div className="mb-6">
                  <label className="scada-label block mb-3">
                    New Curtailment: {curtailmentValue}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={curtailmentValue}
                    onChange={(e) => setCurtailmentValue(Number(e.target.value))}
                    className="w-full h-2 bg-scada-darker rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #00ff88 0%, #ffdd00 50%, #ff3366 100%)`,
                    }}
                  />
                  <div className="flex justify-between text-xs text-scada-blue/70 mt-2">
                    <span>0% (Full Power)</span>
                    <span>100% (Off)</span>
                  </div>
                </div>

                {/* Projected output */}
                <div className="mb-6 p-4 bg-scada-green/10 rounded-lg border border-scada-green/30">
                  <div className="scada-label mb-2">Projected Output</div>
                  <div className="text-2xl font-bold text-scada-green">
                    {(selectedDer.pMax * (1 - curtailmentValue / 100)).toFixed(1)} kW
                  </div>
                  <div className="text-xs text-scada-blue/70 mt-1">
                    Reduction:{' '}
                    {(selectedDer.pMax * (curtailmentValue / 100)).toFixed(1)} kW
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedDer(null)}
                    className="flex-1 px-4 py-2 bg-scada-blue/10 border border-scada-blue/30 text-scada-blue rounded hover:bg-scada-blue/20 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={applyCurtailment}
                    className="flex-1 scada-button-success flex items-center justify-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
