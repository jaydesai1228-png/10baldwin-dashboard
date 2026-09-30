'use client';

import React from 'react';
import {
  X,
  Calendar,
  Layers,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  Home,
  Check,
  Zap,
} from 'lucide-react';

interface ConstructionSequencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  daysLeft: number;
}

export function ConstructionSequencesModal({
  isOpen,
  onClose,
  daysLeft,
}: ConstructionSequencesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden my-6 max-h-[90vh] flex flex-col text-slate-900">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black text-slate-900">
                  Key Construction Sequences & Rules
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900">
                  10 Baldwin Spec
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Mandatory trade execution chains, Level 5 boundaries, and CO milestones.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-8 text-sm">
          {/* 1. Move-In Milestone Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/5 border border-amber-300/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span>Move-In Milestone (Hard Deadline)</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">Sunday, November 15, 2026</h3>
              <p className="text-xs text-slate-600">
                All physical trade closeouts, township final inspections, and Certificate of Occupancy (CO) must be secured.
              </p>
            </div>

            <div className="text-right sm:text-center px-4 py-2 rounded-xl bg-white border border-amber-200 shadow-2xs shrink-0">
              <div className="text-2xl font-black text-amber-700">{daysLeft} Days</div>
              <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Remaining to Move-In
              </div>
            </div>
          </div>

          {/* 2. Drywall Scope Matrix (Level 5 vs Level 4) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">
                1. Drywall Scope & Finish Specifications
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Level 5 Skim Required */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wide text-amber-900">
                    Level 5 Skim Required
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/60 text-amber-900">
                    High Criticality
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Full surface skim coat required for seamless limewash paint prep and critical raking light surfaces:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-800 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Two-story Foyer (crucial limewash finish prep)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Primary Suite bedroom & vaulted ceilings</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Primary Bathroom dry walls</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>Designated Kitchen feature walls</span>
                  </li>
                </ul>
              </div>

              {/* Level 5 Waived (Standard Level 4) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs uppercase tracking-wide text-slate-700">
                    Level 5 Waived (Standard Level 4)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                    Standard Finish
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Standard Level 4 drywall finish is approved; do not incur extra cost or time:
                </p>
                <ul className="space-y-1.5 text-xs text-slate-700 font-medium">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Daughter&apos;s Bathroom</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Son&apos;s Bathroom</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Guest Bathroom</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Powder Room</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>Playroom Bathroom</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 3. 2nd Floor Threshold & Subfloor Benchmark */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Home className="w-4 h-4 text-sky-600" />
              <h3 className="text-base font-bold text-slate-900">
                2. 2nd Floor Threshold & Subfloor Benchmark Datum
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-sky-50/50 border border-sky-200 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                <strong>Goal:</strong> Achieve a completely flush, seamless plane across hardwood floors, stone thresholds, and bathroom tile without tripping lips or transition bevels.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-sky-100 space-y-1">
                  <div className="font-black text-sky-700 text-xs">Step 1</div>
                  <div className="font-bold text-slate-900">Set Stone Thresholds</div>
                  <div className="text-[11px] text-slate-500">
                    Set thresholds in Son Bath, Daughter Bath, and Laundry doorways.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sky-100 space-y-1">
                  <div className="font-black text-sky-700 text-xs">Step 2</div>
                  <div className="font-bold text-slate-900">Measure Datum</div>
                  <div className="text-[11px] text-slate-500">
                    Laser check finished threshold height as project master benchmark.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sky-100 space-y-1">
                  <div className="font-black text-sky-700 text-xs">Step 3</div>
                  <div className="font-bold text-slate-900">Subfloor Buildup</div>
                  <div className="text-[11px] text-slate-500">
                    Build up hallway/bedrooms with plywood underlayment to datum.
                  </div>
                </div>

                <div className="p-3 bg-white rounded-xl border border-sky-100 space-y-1">
                  <div className="font-black text-sky-700 text-xs">Step 4</div>
                  <div className="font-bold text-slate-900">Lay Hardwood Planks</div>
                  <div className="text-[11px] text-slate-500">
                    Lay 2nd floor hardwood planks 100% flush to stone thresholds.
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Mandatory Bathroom Execution Chain & 5-Day Cycle */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              <h3 className="text-base font-bold text-slate-900">
                3. Mandatory Bathroom Execution Chain & 5-Day Wet Cycle
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Tile installations must follow this strict sequence so tile stops plumb at casings and sconce boxes are centered on mirrors.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">Shower pan & floor tile first: </span>
                    <span className="text-slate-600">
                      Waterproof shower pans and set base floor tiles to stone thresholds.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">Door casings, vanities & rough-ins: </span>
                    <span className="text-slate-600">
                      Install door casings (tile cutoff stop) and verify mirror dimensions for sconce backboxes and shower valves.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">Install wall tile: </span>
                    <span className="text-slate-600">
                      Butt tile cleanly against installed casing profiles.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </span>
                  <div className="space-y-1">
                    <span className="font-bold text-slate-900">Mandatory 5-Day Cure Cycle per Wet Area:</span>
                    <div className="grid grid-cols-5 gap-1.5 pt-1 text-[11px] text-center font-medium">
                      <div className="p-1.5 bg-emerald-100/60 rounded-lg text-emerald-900 font-bold">
                        Day 1: Tile
                      </div>
                      <div className="p-1.5 bg-emerald-100/60 rounded-lg text-emerald-900 font-bold">
                        Day 2: Thinset
                      </div>
                      <div className="p-1.5 bg-emerald-100/60 rounded-lg text-emerald-900 font-bold">
                        Day 3: Grout
                      </div>
                      <div className="p-1.5 bg-emerald-100/60 rounded-lg text-emerald-900 font-bold">
                        Day 4: Cure
                      </div>
                      <div className="p-1.5 bg-emerald-100/60 rounded-lg text-emerald-900 font-bold">
                        Day 5: Caulk
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-2 bg-white rounded-xl border border-emerald-100">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0">
                    5
                  </span>
                  <div>
                    <span className="font-bold text-slate-900">Custom glass enclosures: </span>
                    <span className="text-slate-600">
                      Field-measure finished tiled openings and fabricate custom frameless glass.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 5. Exterior & Envelope Sequencing */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
              <ShieldAlert className="w-4 h-4 text-purple-600" />
              <h3 className="text-base font-bold text-slate-900">
                4. Exterior & Envelope Gating Sequencing
              </h3>
            </div>

            <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Critical gating chain for scaffolding drop, utility hookups, and grading inspection:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                  <div className="font-bold text-purple-900">1. Stucco on HVAC Side Wall</div>
                  <p className="text-[11px] text-slate-600">
                    Complete stucco first to drop scaffolding and clear the ground below.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                  <div className="font-bold text-purple-900">2. Set 4th HVAC Condenser</div>
                  <p className="text-[11px] text-slate-600">
                    Set final condenser on pad; enables PSE&G exterior gas service pull.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                  <div className="font-bold text-purple-900">3. Complete Rear Stucco</div>
                  <p className="text-[11px] text-slate-600">
                    Enables Bilco basement door install, deck build-out, and Comcast line drop.
                  </p>
                </div>

                <div className="p-3 bg-white rounded-xl border border-purple-100 space-y-1">
                  <div className="font-bold text-purple-900">4. Downspout Piping & Grading</div>
                  <p className="text-[11px] text-slate-600">
                    Bury downspout lines to daylight away from foundation, then finish final property grading.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
}
