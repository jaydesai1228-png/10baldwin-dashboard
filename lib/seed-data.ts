import { Task } from '@/types/punchlist';

export const INITIAL_TASKS: Task[] = [
  // ==========================================
  // 1. EXTERIOR, ENVELOPE & SITE (CLEAR FOR CO)
  // ==========================================
  {
    id: 'EXT-STUCCO-HVAC',
    title: 'Complete exterior stucco on HVAC side wall (drop scaffolding)',
    room: 'Exterior HVAC Side',
    trade: 'Stucco',
    outcome: 'Exterior Envelope',
    task_owner: 'Joe',
    status: 'in_progress',
    blocked_by: [],
    unlocks: ['EXT-CONDENSER-4', 'EXT-RADON', 'EXT-BASEMENT-LEAKS'],
    notes: [
      {
        id: 'n1',
        author: 'Joe',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Scaffolding on HVAC side must come down first before 4th condenser can be set.'
      }
    ]
  },
  {
    id: 'EXT-STUCCO-REAR',
    title: 'Complete exterior stucco on rear wall and remaining elevations',
    room: 'Exterior Rear',
    trade: 'Stucco',
    outcome: 'Exterior Envelope',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: ['EXT-BILCO', 'EXT-DECK-CO', 'EXT-COMCAST', 'EXT-GRADING'],
    notes: []
  },
  {
    id: 'EXT-CONDENSER-4',
    title: 'Set final (4th) HVAC condenser on HVAC side pad',
    room: 'Exterior HVAC Side',
    trade: 'HVAC',
    outcome: 'Exterior Envelope',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['EXT-STUCCO-HVAC'],
    unlocks: ['EXT-PSEG-GAS'],
    notes: []
  },
  {
    id: 'EXT-PSEG-GAS',
    title: 'Run PSE&G exterior gas line to house',
    room: 'Exterior',
    trade: 'Utility',
    outcome: 'Clear for CO',
    task_owner: 'External',
    status: 'blocked',
    blocked_by: ['EXT-CONDENSER-4'],
    unlocks: [],
    notes: [
      {
        id: 'n2',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Coordinate once trench path and condenser areas are fully clear.'
      }
    ]
  },
  {
    id: 'EXT-RADON',
    title: 'Radon remediation piping and system startup',
    room: 'Basement / Exterior',
    trade: 'Radon',
    outcome: 'Clear for CO',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['EXT-STUCCO-HVAC'],
    unlocks: [],
    notes: [
      {
        id: 'n3',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'If piping exits HVAC side, start once scaffold drops. If rear, wait for rear stucco.'
      }
    ]
  },
  {
    id: 'EXT-BASEMENT-LEAKS',
    title: 'Mitigate ongoing foundation leaks from exterior',
    room: 'Basement Exterior',
    trade: 'Waterproofing',
    outcome: 'Exterior Envelope',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['EXT-STUCCO-HVAC'],
    unlocks: [],
    notes: []
  },
  {
    id: 'EXT-BILCO',
    title: 'Complete Bilco basement door installation',
    room: 'Exterior Rear',
    trade: 'Carpentry',
    outcome: 'Exterior Envelope',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['EXT-STUCCO-REAR'],
    unlocks: ['EXT-GRADING'],
    notes: []
  },
  {
    id: 'EXT-DECK-CO',
    title: 'Build out rear deck area to clear building CO inspections',
    room: 'Exterior Rear',
    trade: 'Carpentry',
    outcome: 'Clear for CO',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['EXT-STUCCO-REAR'],
    unlocks: ['EXT-GRADING'],
    notes: []
  },
  {
    id: 'EXT-COMCAST',
    title: 'Pull incoming Comcast cable line into house',
    room: 'Exterior Rear',
    trade: 'Low-Voltage',
    outcome: 'Electrical & Smart',
    task_owner: 'External',
    status: 'blocked',
    blocked_by: ['EXT-STUCCO-REAR'],
    unlocks: [],
    notes: []
  },
  {
    id: 'EXT-DRAINAGE',
    title: 'Install underground downspout drainage to daylight away from foundation',
    room: 'Site',
    trade: 'Excavation',
    outcome: 'Exterior Envelope',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: ['EXT-GRADING', 'EXT-GUTTERS'],
    notes: [
      {
        id: 'n4',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Drainage piping must be completed before final surface grading.'
      }
    ]
  },
  {
    id: 'EXT-GRADING',
    title: 'Complete final property grading around foundation',
    room: 'Site',
    trade: 'Excavation',
    outcome: 'Exterior Envelope',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['EXT-STUCCO-REAR', 'EXT-DRAINAGE', 'EXT-BILCO', 'EXT-DECK-CO'],
    unlocks: [],
    notes: []
  },
  {
    id: 'EXT-GUTTERS',
    title: 'Install roof gutters and tie downspouts into drainage piping',
    room: 'Exterior',
    trade: 'Roofing/Gutters',
    outcome: 'Exterior Envelope',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['EXT-DRAINAGE'],
    unlocks: [],
    notes: []
  },
  {
    id: 'EXT-SEPTIC',
    title: 'Jet septic lines, pump tank, and inspect/replace distribution box',
    room: 'Site',
    trade: 'Septic',
    outcome: 'Clear for CO',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    waiting_on: {
      owner: 'Joe',
      description: 'Schedule septic contractor for water jetting, pumping, and D-box inspection'
    },
    notes: []
  },

  // ==========================================
  // 2. FLOORING, SUBFLOORS, DOORS & TRIM
  // ==========================================
  {
    id: 'FLR-THRESHOLDS-2ND',
    title: 'Set stone transition thresholds in Son, Daughter, and Laundry doorways',
    room: '2nd Floor Hallway',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: ['FLR-SUBFLOOR-BUILD', 'BATH-DAUGHTER-TILE-FLR', 'BATH-SON-TILE-FLR', 'LNDRY-TILE-FLR'],
    notes: [
      {
        id: 'n5',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Critical benchmark datum. Stone threshold sets exact finished height for subfloor buildup and bathroom tile cutoffs.'
      }
    ]
  },
  {
    id: 'FLR-SUBFLOOR-BUILD',
    title: 'Build up 2nd floor subfloor height in hallway/bedrooms to match stone thresholds',
    room: '2nd Floor Hallway',
    trade: 'Carpentry',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['FLR-THRESHOLDS-2ND'],
    unlocks: ['FLR-HARDWOOD-2ND'],
    notes: [
      {
        id: 'n6',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Goal: hardwood floor, stone threshold, and bathroom tile are 100% flush and level.'
      }
    ]
  },
  {
    id: 'FLR-HARDWOOD-2ND',
    title: 'Install 2nd floor hardwood flooring flush to stone thresholds',
    room: '2nd Floor',
    trade: 'Flooring',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['FLR-SUBFLOOR-BUILD'],
    unlocks: [],
    notes: []
  },
  {
    id: 'FLR-HARDWOOD-3RD',
    title: 'Install 3rd floor hardwood floors',
    room: '3rd Floor',
    trade: 'Flooring',
    outcome: 'Clear for CO',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'FLR-STAIRS-RAILINGS',
    title: 'Install temporary handrails for CO; prep for stair treads',
    room: 'Stairs',
    trade: 'Carpentry',
    outcome: 'Clear for CO',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: [
      {
        id: 'n7',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Treads ordered (delivery mid/late October). Need temp rails up for CO.'
      }
    ]
  },
  {
    id: 'DOORS-INTERIOR-ORDER',
    title: 'Finalize interior doors, jambs, casing profiles, hinges, and handles',
    room: 'Entire House',
    trade: 'Carpentry',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Jay',
    status: 'pending_external',
    blocked_by: [],
    unlocks: ['DOORS-INTERIOR-INSTALL'],
    waiting_on: {
      owner: 'Jay',
      description: 'Lock in door model, jambs, casing profiles, handles, and hinges'
    },
    notes: []
  },
  {
    id: 'DOORS-INTERIOR-INSTALL',
    title: 'Deliver, hang, and install all interior doors',
    room: 'Entire House',
    trade: 'Carpentry',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['DOORS-INTERIOR-ORDER'],
    unlocks: ['BATH-CASINGS-SET'],
    notes: []
  },
  {
    id: 'BATH-CASINGS-SET',
    title: 'Install bathroom door casings and trim (tile cutoff stops)',
    room: 'Bathrooms',
    trade: 'Carpentry',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['DOORS-INTERIOR-INSTALL'],
    unlocks: ['BATH-SON-WALLS', 'BATH-DAUGHTER-WALLS', 'BATH-PRIMARY-WALLS', 'BATH-GUEST-WALLS'],
    notes: [
      {
        id: 'n8',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Mandatory start/stop boundary for all bathroom wall tile.'
      }
    ]
  },

  // ==========================================
  // 3. BATHROOM EXECUTION MATRIX
  // ==========================================
  {
    id: 'BATH-SON-DELIVERY',
    title: 'Receive Son’s bathroom floor tile delivery on site',
    room: 'Son Bath',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Jay',
    status: 'pending_external',
    blocked_by: [],
    unlocks: ['BATH-SON-TILE-FLR'],
    waiting_on: {
      owner: 'Jay',
      description: 'Track shipment and confirm on-site delivery of Son bath floor tile'
    },
    notes: []
  },
  {
    id: 'BATH-SON-TILE-FLR',
    title: 'Install Son’s bathroom floor tile to stone threshold',
    room: 'Son Bath',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['FLR-THRESHOLDS-2ND', 'BATH-SON-DELIVERY'],
    unlocks: ['BATH-SON-WALLS'],
    notes: []
  },
  {
    id: 'BATH-DAUGHTER-TILE-FLR',
    title: 'Install Daughter’s bathroom floor tile to stone threshold',
    room: 'Daughter Bath',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['FLR-THRESHOLDS-2ND'],
    unlocks: ['BATH-DAUGHTER-WALLS'],
    notes: []
  },
  {
    id: 'BATH-GUEST-ORDER',
    title: 'Select and order Guest bathroom tiles',
    room: 'Guest Bath',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Jay',
    status: 'pending_external',
    blocked_by: [],
    unlocks: ['BATH-GUEST-FLR'],
    waiting_on: {
      owner: 'Jay',
      description: 'Select tile spec and submit purchase order for guest bath'
    },
    notes: []
  },
  {
    id: 'BATH-GUEST-FLR',
    title: 'Install Guest bathroom floor tile',
    room: 'Guest Bath',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['BATH-GUEST-ORDER'],
    unlocks: ['BATH-GUEST-WALLS'],
    notes: []
  },
  {
    id: 'BATH-PRIMARY-PREP',
    title: 'Level 5 sheetrock skim, shower pan waterproofing, and floor tile',
    room: 'Primary Bath',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: ['BATH-PRIMARY-WALLS'],
    notes: [
      {
        id: 'n9',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Level 5 drywall skim required in Primary Bath. Standard finish in other baths.'
      }
    ]
  },
  {
    id: 'BATH-DECISIONS-ROUGHIN',
    title: 'Finalize mirror dimensions; set sconce boxes, vanity positions, and shower valves',
    room: 'Bathrooms',
    trade: 'Electrical/Plumbing',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Jay',
    status: 'pending_external',
    blocked_by: [],
    unlocks: ['BATH-SON-WALLS', 'BATH-DAUGHTER-WALLS', 'BATH-PRIMARY-WALLS', 'BATH-GUEST-WALLS'],
    waiting_on: {
      owner: 'Jay',
      description: 'Lock mirror dimensions across all bathrooms to confirm sconce backbox spacing'
    },
    notes: [
      {
        id: 'n10',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Wall tile cuts cannot be made without exact fixture, sconce, and valve penetrations.'
      }
    ]
  },
  {
    id: 'BATH-SON-WALLS',
    title: 'Install wall tile, grout, and 100% silicone perimeter caulk in Son’s bath',
    room: 'Son Bath',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['BATH-SON-TILE-FLR', 'BATH-CASINGS-SET', 'BATH-DECISIONS-ROUGHIN'],
    unlocks: ['BATH-SON-TRIMOUT'],
    notes: []
  },
  {
    id: 'BATH-DAUGHTER-WALLS',
    title: 'Install wall tile, grout, and 100% silicone perimeter caulk in Daughter’s bath',
    room: 'Daughter Bath',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['BATH-DAUGHTER-TILE-FLR', 'BATH-CASINGS-SET', 'BATH-DECISIONS-ROUGHIN'],
    unlocks: ['BATH-DAUGHTER-TRIMOUT'],
    notes: []
  },
  {
    id: 'BATH-PRIMARY-WALLS',
    title: 'Install wall tile, grout, and 100% silicone perimeter caulk in Primary bath',
    room: 'Primary Bath',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['BATH-PRIMARY-PREP', 'BATH-CASINGS-SET', 'BATH-DECISIONS-ROUGHIN'],
    unlocks: ['BATH-PRIMARY-TRIMOUT'],
    notes: []
  },
  {
    id: 'BATH-GUEST-WALLS',
    title: 'Install wall tile, grout, and 100% silicone perimeter caulk in Guest bath',
    room: 'Guest Bath',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['BATH-GUEST-FLR', 'BATH-CASINGS-SET', 'BATH-DECISIONS-ROUGHIN'],
    unlocks: ['BATH-GUEST-TRIMOUT'],
    notes: []
  },
  {
    id: 'BATH-POWDER-TRIMOUT',
    title: 'Install powder room vanity, mirror, sconce, and toilet',
    room: 'Powder Room',
    trade: 'Plumbing',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: [
      {
        id: 'n11',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Level 5 drywall skim waived; standard finish.'
      }
    ]
  },
  {
    id: 'BATH-PLAYROOM-TRIMOUT',
    title: 'Finish playroom tub surround tile and trim-out plumbing fixtures',
    room: 'Playroom Bath',
    trade: 'Plumbing',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: [
      {
        id: 'n12',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Level 5 drywall skim waived; standard finish.'
      }
    ]
  },
  {
    id: 'BATH-SON-TRIMOUT',
    title: 'Son’s Bath: Install vanity, faucets, toilet, and measure custom glass enclosure',
    room: 'Son Bath',
    trade: 'Plumbing',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['BATH-SON-WALLS'],
    unlocks: [],
    notes: []
  },
  {
    id: 'BATH-DAUGHTER-TRIMOUT',
    title: 'Daughter’s Bath: Install vanity, faucets, toilet, and measure custom glass enclosure',
    room: 'Daughter Bath',
    trade: 'Plumbing',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['BATH-DAUGHTER-WALLS'],
    unlocks: [],
    notes: []
  },
  {
    id: 'BATH-PRIMARY-TRIMOUT',
    title: 'Primary Bath: Install double vanity, faucets, toilet, and measure custom glass',
    room: 'Primary Bath',
    trade: 'Plumbing',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['BATH-PRIMARY-WALLS'],
    unlocks: [],
    notes: []
  },
  {
    id: 'BATH-GUEST-TRIMOUT',
    title: 'Guest Bath: Install vanity, faucets, toilet, and measure custom glass',
    room: 'Guest Bath',
    trade: 'Plumbing',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['BATH-GUEST-WALLS'],
    unlocks: [],
    notes: []
  },

  // ==========================================
  // 4. KITCHEN, PANTRY & MILLWORK
  // ==========================================
  {
    id: 'KTCH-COUNTERS',
    title: 'Template, fabricate, and install kitchen countertops',
    room: 'Kitchen',
    trade: 'Stone',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: ['KTCH-ARCH-FRAMING'],
    notes: [
      {
        id: 'n13',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Give stone fabricators LED wire penetration specs before cutting.'
      }
    ]
  },
  {
    id: 'KTCH-ARCH-FRAMING',
    title: 'Frame decorative arch above the range oven',
    room: 'Kitchen',
    trade: 'Carpentry',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['KTCH-COUNTERS'],
    unlocks: [],
    notes: [
      {
        id: 'n14',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Requires kitchen counter installed first to align arch framing plumb to the countertop.'
      }
    ]
  },
  {
    id: 'KTCH-DRYWALL-L5',
    title: 'Complete Level 5 sheetrock skim on designated kitchen feature walls',
    room: 'Kitchen',
    trade: 'Drywall',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'PANTRY-CABINETS',
    title: 'Finalize pantry cabinet layout, purchase, and install',
    room: 'Pantry',
    trade: 'Carpentry',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Jay',
    status: 'ready',
    blocked_by: [],
    unlocks: ['PANTRY-COUNTER'],
    notes: []
  },
  {
    id: 'PANTRY-COUNTER',
    title: 'Select, order, and install pantry countertop',
    room: 'Pantry',
    trade: 'Stone',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Jay',
    status: 'blocked',
    blocked_by: ['PANTRY-CABINETS'],
    unlocks: [],
    notes: []
  },
  {
    id: 'PANTRY-FRIDGE',
    title: 'Select and order auxiliary refrigerator for pantry',
    room: 'Pantry',
    trade: 'Appliances',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Jay',
    status: 'pending_external',
    blocked_by: [],
    unlocks: [],
    waiting_on: {
      owner: 'Jay',
      description: 'Select and purchase pantry refrigerator'
    },
    notes: []
  },
  {
    id: 'LNDRY-CABINETS',
    title: 'Purchase and install laundry room base and upper cabinets',
    room: 'Laundry Room',
    trade: 'Carpentry',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Jay',
    status: 'ready',
    blocked_by: [],
    unlocks: ['LNDRY-COUNTER'],
    notes: []
  },
  {
    id: 'LNDRY-COUNTER',
    title: 'Visit butcher block fabricator and order laundry countertop slab',
    room: 'Laundry Room',
    trade: 'Millwork',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Jay',
    status: 'pending_external',
    blocked_by: ['LNDRY-CABINETS'],
    unlocks: [],
    waiting_on: {
      owner: 'Jay',
      description: 'Visit butcher block supplier to finalize laundry counter slab'
    },
    notes: []
  },
  {
    id: 'LNDRY-TILE-FLR',
    title: 'Install laundry room floor tile to stone threshold',
    room: 'Laundry Room',
    trade: 'Tile',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['FLR-THRESHOLDS-2ND'],
    unlocks: [],
    notes: []
  },
  {
    id: 'OFFICE-PURVI-CABS',
    title: 'Order and install custom cabinetry for Purvi’s office',
    room: 'Purvi\'s Office',
    trade: 'Millwork',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Purvi',
    status: 'pending_external',
    blocked_by: [],
    unlocks: [],
    waiting_on: {
      owner: 'Purvi',
      description: 'Finalize layout and place order for Purvi office cabinets'
    },
    notes: []
  },
  {
    id: 'PRIMARY-CROWN',
    title: 'Order crown molding for Primary Bedroom suite',
    room: 'Primary Suite',
    trade: 'Carpentry',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Jay',
    status: 'pending_external',
    blocked_by: [],
    unlocks: [],
    waiting_on: {
      owner: 'Jay',
      description: 'Verify if crown molding impacts closet or trim installations before ordering'
    },
    notes: []
  },

  // ==========================================
  // 5. ELECTRICAL, HVAC, LOW-VOLTAGE & MEP
  // ==========================================
  {
    id: 'FOYER-SCAFFOLD-CHANDELIER',
    title: 'Clean and reinstall foyer scaffold; hang foyer chandelier',
    room: 'Foyer',
    trade: 'Electrical',
    outcome: 'Electrical & Smart',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: ['FOYER-COFFERED-TRIM'],
    notes: [
      {
        id: 'n15',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Clean scaffold must be set to hang chandelier safely before ceiling trim.'
      }
    ]
  },
  {
    id: 'FOYER-COFFERED-TRIM',
    title: 'Complete coffered ceiling trim in 2-story foyer',
    room: 'Foyer',
    trade: 'Carpentry',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['FOYER-SCAFFOLD-CHANDELIER'],
    unlocks: [],
    notes: []
  },
  {
    id: 'FOYER-DRYWALL-L5',
    title: 'Complete Level 5 sheetrock skim in foyer for limewash finish prep',
    room: 'Foyer',
    trade: 'Drywall',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'FIREPLACE-PERMIT',
    title: 'Follow up on pending fireplace permit with Moorestown township',
    room: 'Living Room',
    trade: 'Township',
    outcome: 'Clear for CO',
    task_owner: 'External',
    status: 'pending_external',
    blocked_by: [],
    unlocks: ['FIREPLACE-CLEAN-INSTALL'],
    waiting_on: {
      owner: 'Joe',
      description: 'Follow up with Moorestown building department for permit sign-off'
    },
    notes: []
  },
  {
    id: 'FIREPLACE-CLEAN-INSTALL',
    title: 'Deep clean firebox and complete fireplace installation',
    room: 'Living Room',
    trade: 'Masonry/HVAC',
    outcome: 'Clear for CO',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: ['FIREPLACE-PERMIT'],
    unlocks: [],
    notes: [
      {
        id: 'n16',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Fireplace area needs thorough cleaning and debris removal.'
      }
    ]
  },
  {
    id: 'WATER-TREATMENT-INSTALL',
    title: 'Deliver and install water treatment system; complete certified test',
    room: 'Basement',
    trade: 'Plumbing',
    outcome: 'Clear for CO',
    task_owner: 'Joe',
    status: 'pending_external',
    blocked_by: [],
    unlocks: [],
    waiting_on: {
      owner: 'Joe',
      description: 'Demand installation date and equipment delivery schedule from water treatment contractor'
    },
    notes: []
  },
  {
    id: 'HVAC-DUCT-FITTINGS',
    title: 'Purchase and install all fitted register boxes and duct fittings',
    room: 'Entire House',
    trade: 'HVAC',
    outcome: 'Clear for CO',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'ELEC-SWITCHES-OUTLETS',
    title: 'Order, deliver, and trim out all wall switches, outlets, and plates',
    room: 'Entire House',
    trade: 'Electrical',
    outcome: 'Electrical & Smart',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'ELEC-RECESSED-LIGHTS',
    title: 'Order and install recessed canned lights (finalize missing layouts)',
    room: 'Entire House',
    trade: 'Electrical',
    outcome: 'Electrical & Smart',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: [
      {
        id: 'n17',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Lighting positions mostly set; electrician to flag any missing locations to Jay.'
      }
    ]
  },
  {
    id: 'ELEC-CENTER-LIGHTS-TEMP',
    title: 'Install temporary builder-grade flush lights for unpurchased center fixtures',
    room: 'Entire House',
    trade: 'Electrical',
    outcome: 'Clear for CO',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'ELEC-CABINET-LIGHTING',
    title: 'Order and install under-cabinet, toe-kick, and path lighting',
    room: 'Kitchen / Halls',
    trade: 'Electrical',
    outcome: 'Electrical & Smart',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'ELEC-EV-CHARGER',
    title: 'Order and install Level 2 EV charging station in garage',
    room: 'Garage',
    trade: 'Electrical',
    outcome: 'Electrical & Smart',
    task_owner: 'Jay',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'LOWVOLT-CAT6-TERMINATIONS',
    title: 'Punch down and wrap up all Cat6 low-voltage network runs',
    room: 'Entire House',
    trade: 'Low-Voltage',
    outcome: 'Electrical & Smart',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: ['LOWVOLT-HARDWARE-INSTALL'],
    notes: []
  },
  {
    id: 'LOWVOLT-HARDWARE-INSTALL',
    title: 'Install security cameras, PoE access points, amps, speakers, and patch panel',
    room: 'Entire House',
    trade: 'Low-Voltage',
    outcome: 'Electrical & Smart',
    task_owner: 'Jay',
    status: 'blocked',
    blocked_by: ['LOWVOLT-CAT6-TERMINATIONS'],
    unlocks: [],
    notes: []
  },

  // ==========================================
  // 6. MUDROOM, BASEMENT, GARAGE & CLEANUP
  // ==========================================
  {
    id: 'MUDROOM-DOOR-ORDER',
    title: 'Order mudroom exterior door (~6-week lead time)',
    room: 'Mudroom',
    trade: 'Carpentry',
    outcome: 'Exterior Envelope',
    task_owner: 'Jay',
    status: 'pending_external',
    blocked_by: [],
    unlocks: [],
    waiting_on: {
      owner: 'Jay',
      description: 'Lock in spec and place 6-week mudroom door order'
    },
    notes: [
      {
        id: 'n18',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Non-blocking for CO, but order needs to be placed now.'
      }
    ]
  },
  {
    id: 'MUDROOM-HEATED-FLOOR-TILE',
    title: 'Install heated floor wire kit and tile mudroom (hold for project end)',
    room: 'Mudroom',
    trade: 'Tile',
    outcome: 'Close Out Bathrooms',
    task_owner: 'Joe',
    status: 'blocked',
    blocked_by: [],
    unlocks: [],
    notes: [
      {
        id: 'n19',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'One of the last finish tasks. Do not tile early to avoid damage from trade foot traffic.'
      }
    ]
  },
  {
    id: 'CLEANUP-SPACKLE',
    title: 'Scrape and clean dried spackle off all doors, windows, and glass',
    room: 'Entire House',
    trade: 'General',
    outcome: 'Clear for CO',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'GARAGE-SLAB-REPAIR',
    title: 'Clean garage floor, fill concrete slab cracks, and apply epoxy coating',
    room: 'Garage',
    trade: 'General',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'BASEMENT-SEAL-PAINT',
    title: 'Clean basement, epoxy floor slab, and coat walls with moisture barrier masonry paint',
    room: 'Basement',
    trade: 'General',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Joe',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: []
  },
  {
    id: 'PLAYROOM-MATERIALS',
    title: 'Source monkey bars, rock climbing holds, and playroom mats',
    room: 'Playroom',
    trade: 'Specialty',
    outcome: 'Millwork & Surfaces',
    task_owner: 'Jay',
    status: 'ready',
    blocked_by: [],
    unlocks: [],
    notes: [
      {
        id: 'n20',
        author: 'Jay',
        timestamp: '2026-09-29T23:00:00.000Z',
        text: 'Nice to have / non-critical for CO.'
      }
    ]
  },
  {
    id: 'CHASE-HOMEDEPOT-SUBSTITUTES',
    title: 'Compile list of items Home Depot cannot source and order from alternate suppliers',
    room: 'Entire House',
    trade: 'Procurement',
    outcome: 'Clear for CO',
    task_owner: 'Jay',
    status: 'pending_external',
    blocked_by: [],
    unlocks: [],
    waiting_on: {
      owner: 'Jay',
      description: 'Review unfulfilled Home Depot items and source from alternative vendors'
    },
    notes: []
  }
];
