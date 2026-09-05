/* ------------------------------------------------------------------
   Portfolio content model.

   Every page renders from ENTRIES below, so one change here updates
   the whole site.

   entry = {
     id      unique slug
     kind    'role' | 'project'
     cat     'work' | 'fsae' | 'uni' | 'personal'
     title, org
     from,to years for timeline sorting (9999 = ongoing)
     when    display label for the date
     skills  tags, drive the skill filter
     summary one line
     bullets resume points, each with its own skill tags
     photos  [{f: file, c: caption, d: capture date, wide: true}]
     link    optional {href, label}
   }

   Photo dates come from the EXIF capture date of the original file,
   read on 5 September 2026. Where a file was shared by someone else
   and carries no EXIF, the date is left off rather than guessed.
   ------------------------------------------------------------------ */

window.CATEGORIES = [
  { id: 'work', label: 'Professional work',
    note: 'Paid engineering work. Currently data and race engineering for a GT3 team.' },
  { id: 'fsae', label: 'Formula SAE',
    note: 'Three years with UTS Motorsports, member to Mechanical Lead, then advisor.',
    stats: [
      { n: '3 years', s: 'member to Mechanical Lead' },
      { n: '~20', s: 'engineers led across six subsystems' },
      { n: '1st since 2019', s: 'UTS endurance finish' },
      { n: '10th overall', s: 'EV class, Formula SAE-A 2025' }
    ] },
  { id: 'uni', label: 'University projects',
    note: 'Subject project work across the mechanical, mechatronic and embedded streams.' },
  { id: 'personal', label: 'Personal projects',
    note: 'Things I build because I want to know how they work.' }
];

window.SKILLS = [
  { id: 'all',         label: 'All work' },
  { id: 'design',      label: 'Design & CAD' },
  { id: 'analysis',    label: 'Analysis & testing' },
  { id: 'welding',     label: 'Welding & fabrication' },
  { id: 'machining',   label: 'Machining & CNC' },
  { id: 'electronics', label: 'Electronics & PCB' },
  { id: 'software',    label: 'Software & control' },
  { id: 'data',        label: 'Data & telemetry' },
  { id: 'hv',          label: 'High voltage systems' },
  { id: 'integration', label: 'Systems integration' },
  { id: 'teamwork',    label: 'Teamwork & leadership' },
  { id: 'project',     label: 'Project delivery' },
  { id: 'comms',       label: 'Communication & outreach' }
];

window.ENTRIES = [

/* ===================== PROFESSIONAL WORK ===================== */

{ id:'tigani-role', kind:'role', cat:'work',
  title:'Data and Race Engineer', org:'Tigani Motorsport',
  from:2025, to:9999, when:'2025 to present',
  skills:['data','software','integration','project','teamwork'],
  summary:'Trackside data, telemetry and systems engineering for a GT3 team running Mercedes-AMG GT3 cars in SRO GT World Challenge Australia and endurance events.',
  bullets:[
    { t:'Run trackside data acquisition and analysis across a GT3 programme, turning logged and live vehicle data into car setup changes and race strategy calls under time pressure.', s:['data','project'] },
    { t:'Configure Bosch MS6.2 engine control units in RaceCon, and build the MoTeC i2 Pro and Bosch WinDarab dashboards, maths channels and templates the engineers work from at the event.', s:['data','software'] },
    { t:'Own the Racelogic VBOX video and data installation, including scenes that switch driver identity automatically from CAN IDs broadcast by RFID chips in each driver radio plug, so stints are attributed correctly with no manual input.', s:['data','electronics','software'] },
    { t:'Designed and built the team network and server infrastructure, the trackside radio systems, and the pit and garage layouts used at events including the Bathurst 12 Hour.', s:['integration','electronics','design'] },
    { t:'Dyno and characterise dampers between setups, and prepare the car setup sheets that come out of that data.', s:['analysis','data'] }
  ],
  photos:[
    { f:'tig-hidden-valley.jpg', c:'Tigani Motorsport cars at Hidden Valley Raceway, Darwin.', d:'Jul 2026', wide:true },
    { f:'tig-pit-data-station.jpg', c:'The pit and data station I work from at an event.', d:'Jul 2025' },
    { f:'tig-shock-dyno.jpg', c:'Dyno testing dampers between setups.', d:'Jul 2025' },
    { f:'tig-podium.jpg', c:'On the podium at The Bend, Tailem Bend.', d:'Sep 2025' }
  ]
},

{ id:'tigani-server', kind:'project', cat:'work',
  title:'Team server, VPN and network infrastructure', org:'Tigani Motorsport',
  from:2026, to:9999, when:'2026 to present',
  skills:['software','integration','data','project'],
  summary:'A self-hosted server and private network carrying the team files, telemetry, video and trackside systems, replacing a set of locked-down vendor configurations.',
  bullets:[
    { t:'Specified, built and maintain the team server, from the hardware through to every service running on it.', s:['integration','project'] },
    { t:'Built a custom WireGuard VPN with its own control plane server, so every workshop machine, trackside laptop and remote engineer joins one private network from anywhere.', s:['software','integration'] },
    { t:'Moved telemetry onto that VPN instead of the vendor locked configurations, which removed the constraint on where data could be viewed and let engineers work on live data away from the pit wall.', s:['data','software'] },
    { t:'Run SMB file services so session data, logs and video are shared across the team from one place.', s:['software'] },
    { t:'Added live video streaming from the car and the garage over the same tunnel, alongside weather station feeds and other trackside systems.', s:['data','integration'] },
    { t:'Co-designed and built the team website with another engineer, hosted on the same infrastructure.', s:['software'] },
    { t:'Designed the security model rather than bolting it on: per user keys, role based access control so people reach only the systems they need, segmentation between car systems and general team traffic, and no service exposed directly to the public internet.', s:['software','project'] }
  ],
  photos:[ { f:'tig-server.jpg', c:'Building the team server.', d:'Jun 2026' } ]
},

{ id:'tigani-splitter', kind:'project', cat:'work',
  title:'Race video and data splitter', org:'Tigani Motorsport',
  from:2026, to:9999, when:'2026 to present',
  skills:['software','data','analysis'],
  summary:'A desktop application that reads the CAN data recorded alongside in-car video and cuts a whole session into the pieces an engineer actually wants to look at.',
  bullets:[
    { t:'Built a Python and PyQt6 desktop application that ingests Racelogic VBOX video and data, decodes the recorded CAN signals, and automatically splits a session into per driver stints and fastest laps.', s:['software','data'] },
    { t:'Detects pit stops and incidents from the same CAN data, and reports pit lane entry to stop, stop to exit and stationary time separately, which is the breakdown a strategist needs during a race rather than after it.', s:['data','analysis'] },
    { t:'Handles driver name mapping, clip extraction and clip sharing, so a driver gets their own laps back within minutes of coming in.', s:['software'] },
    { t:'Built as a persistent settings, dark UI desktop workflow so it can be driven quickly under race conditions.', s:['software'] }
  ],
  photos:[]
},

{ id:'tigani-gateway', kind:'project', cat:'work',
  title:'Raspberry Pi telemetry and video gateway', org:'Tigani Motorsport',
  from:2026, to:9999, when:'2026 to present',
  skills:['electronics','software','data','integration'],
  summary:'An in-car control system that collects CAN, serial telemetry and video from the car and pushes it to the pit over LTE.',
  bullets:[
    { t:'Designed an in-car gateway around a Raspberry Pi that reads the car CAN bus and serial telemetry, handles video, and forwards everything through an LTE modem to the team network.', s:['electronics','integration'] },
    { t:'Fed that stream into MoTeC T2 Server so live data can be viewed in i2 Pro alongside logged data, including getting third party channels into a toolchain that does not carry them natively.', s:['data','software'] },
    { t:'Set up MS6.2 to T2 UDP telemetry over serial, and reverse engineered the CAN IDs for the Dorian transponder channels (0x751 to 0x754) to get lap and sector data into the same stream.', s:['data','software'] },
    { t:'Built a combined transponder and GPS lap trigger so lap timing stays valid when either source drops out, and set up VBOX GPS lap triggers at circuit level.', s:['electronics','data'] },
    { t:'Wrote the MoTeC i2 Pro maths channels the team uses for pit stop timing.', s:['data','analysis'] }
  ],
  photos:[]
},

{ id:'tigani-radio', kind:'project', cat:'work',
  title:'Trackside radio systems and radio rack', org:'Tigani Motorsport',
  from:2025, to:9999, when:'2025 to present',
  skills:['electronics','integration','design'],
  summary:'Team communications for a full event weekend: driver, pit crew, engineering and spotter channels that have to work first time.',
  bullets:[
    { t:'Set up and run the team radio systems across Hytera and Riedel Bolero hardware, covering driver, pit crew, engineering and spotter channels.', s:['electronics','integration'] },
    { t:'Designed and built a purpose made radio rack so the whole system deploys and packs down as one unit instead of being rebuilt at every circuit.', s:['design','integration'] },
    { t:'Developing a custom push to talk system on LiveKit and WebRTC as a longer term replacement for the DMR and intercom setup.', s:['software'] }
  ],
  photos:[
    { f:'tig-radio-systems.jpg', c:'Hytera and Bolero radio systems set up for an event.', d:'Jul 2025' },
    { f:'tig-radio-rack.jpg', c:'The radio rack I built so the system deploys as one unit.', d:'Apr 2026' }
  ]
},

{ id:'tigani-pits', kind:'project', cat:'work',
  title:'Bathurst 12 Hour pit and garage layout', org:'Tigani Motorsport',
  from:2026, to:2026, when:'2026',
  skills:['design','project','teamwork'],
  summary:'The garage designed in CAD first, then built to that plan on arrival.',
  bullets:[
    { t:'Modelled the full pit and garage layout in CAD for the Bathurst 12 Hour, placing cars, benches, engineering stations, storage and awnings against the actual garage envelope.', s:['design'] },
    { t:'The team built to that layout on arrival, which removed the usual first day improvisation and gave the engineers and mechanics fixed, sensible positions for a twelve hour race.', s:['project','teamwork'] }
  ],
  photos:[
    { f:'tig-pit-layout-cad.jpg', c:'The pit layout modelled before the event.' },
    { f:'tig-pit-layout-built.jpg', c:'The same layout built at the circuit.', d:'Feb 2026' }
  ]
},

/* ===================== FORMULA SAE, ROLES ===================== */

{ id:'fsae-2026', kind:'role', cat:'fsae',
  title:'Mechanical and Team Advisor', org:'UTS Motorsports (Formula SAE)',
  from:2026, to:9999, when:'2026 to present',
  skills:['teamwork','design','project'],
  summary:'Handing the mechanical knowledge base to the next set of leads.',
  bullets:[
    { t:'Mentor the current mechanical leads and provide design continuity, technical review and guidance across the team.', s:['teamwork','design'] },
    { t:'Maintain the design documentation and manufacturing knowledge that lets a team with annual turnover start from the previous year rather than from scratch.', s:['project'] }
  ],
  photos:[ { f:'fsae-techlab.jpg', c:'One of the TechLab workshops at UTS where the team builds.', d:'Aug 2025' } ]
},

{ id:'fsae-2025', kind:'role', cat:'fsae',
  title:'Mechanical Lead', org:'UTS Motorsports (Formula SAE)',
  from:2025, to:2025, when:'2025',
  skills:['design','integration','project','teamwork','hv'],
  summary:'Overall responsibility for the mechanical design, build and integration of the 2025 electric competition car.',
  bullets:[
    { t:'Held overall responsibility for the mechanical design, build and integration of the 2025 Formula SAE-A electric vehicle.', s:['design','integration','project'] },
    { t:'Delivered the first UTS Motorsports car in years to pass all technical scrutineering and complete every dynamic event, achieving the team first endurance finish since 2019. The 2023 and 2024 cars did not clear scrutineering.', s:['project','hv'] },
    { t:'Placed 8th in Endurance, 8th in Autocross and 10th overall in the EV class at Formula SAE-A 2025, and drove the car personally in competition.', s:['project'] },
    { t:'Directed a multidisciplinary sub-team of around twenty active engineers across chassis, suspension, drivetrain, tractive system, braking, cooling and packaging; set the build schedule and ran design reviews.', s:['teamwork','integration'] },
    { t:'Owned rules compliance and safety critical sign-off, including the 600 V accumulator, working to the FSAE technical regulations and defending the design at scrutineering.', s:['hv','design','project'] },
    { t:'Ran procurement, lead time planning and supplier relationships across the sponsor network, including Schaeffler, Ansys, Altium, AWS, DigiKey, SBG Systems, Edcon Steel and Volt Safety.', s:['project','teamwork'] },
    { t:'Chaired weekly team meetings and managed timelines, deliverables and expectations with faculty and sponsors as project stakeholders.', s:['teamwork','project'] }
  ],
  photos:[
    { f:'fsae25-car-portrait.jpg', c:'With the finished 2025 car.', d:'Dec 2025' },
    { f:'about-on-track.jpg', c:'On track at Formula SAE-A 2025.' },
    { f:'comp-driver-prep.jpg', c:'Getting ready to run.' },
    { f:'fsae25-comp-celebrate.jpg', c:'After the endurance run.' },
    { f:'about-celebration.jpg', c:'After the endurance finish, the team first since 2019.', d:'Dec 2025', wide:true }
  ]
},

{ id:'fsae-2024', kind:'role', cat:'fsae',
  title:'Chassis Lead and Acting Mechanical Lead', org:'UTS Motorsports (Formula SAE)',
  from:2024, to:2024, when:'2024',
  skills:['design','welding','machining','integration','teamwork'],
  summary:'Chassis and spaceframe ownership, plus coordination of the wider mechanical effort.',
  bullets:[
    { t:'Led chassis and spaceframe design and analysis, covering CAD, FEA, tolerancing, jigging and welding supervision, and coordinated the wider mechanical effort.', s:['design','welding'] },
    { t:'Acted as the primary hands-on builder across the 2024 and 2025 programmes, fabricating and assembling major mechanical components.', s:['welding','machining','integration'] },
    { t:'Applied design for manufacture and design to the FSAE rule set throughout the chassis and subsystem designs.', s:['design','machining'] }
  ],
  photos:[ { f:'about-chassis-complete.jpg', c:'The completed 2024 spaceframe, out of the jig.', d:'Oct 2024', wide:true } ]
},

{ id:'fsae-2023', kind:'role', cat:'fsae',
  title:'Team Member, and Mechanical Lead for Autonomous', org:'UTS Motorsports (Formula SAE)',
  from:2023, to:2023, when:'2023',
  skills:['welding','machining','design','teamwork','comms'],
  summary:'First year on the team: learning the workshop, then leading the mechanical work on the Autonomous sub-team.',
  bullets:[
    { t:'Contributed to chassis and mechanical design and fabrication while building core engineering and workshop skills.', s:['welding','machining','design'] },
    { t:'Led the mechanical effort for the Autonomous sub-team and presented the team work at SXSW Sydney.', s:['teamwork','comms'] }
  ],
  photos:[
    { f:'int-rear-suspension.jpg', c:'Rear suspension and drivetrain on the 2023 car.', d:'Nov 2023' },
    { f:'mach-lathe.jpg', c:'Turning a part on the manual lathe.', d:'Nov 2023' },
    { f:'team-workshop.jpg', c:'The mechanical team at work.', d:'Dec 2023' }
  ]
},

/* ===================== FORMULA SAE, 2025 PROJECTS ===================== */

{ id:'fsae-chassis-2025', kind:'project', cat:'fsae',
  title:'2025 spaceframe chassis', org:'UTS Motorsports',
  from:2025, to:2025, when:'2025',
  skills:['design','welding','machining','analysis','integration','teamwork'],
  summary:'The 2025 chassis, from measuring the bender to a painted frame with suspension on it. Designed it, jigged it, welded it.',
  bullets:[
    { t:'Owned the 2025 spaceframe end to end: CAD, FEA against the FSAE structural equivalency requirements, tolerance stack-up, jig design, tube preparation, fixturing and TIG welding.', s:['design','analysis','welding'] },
    { t:'Characterised the manual tube bender and found its bend radius was 6.5 mm off the nominal three times diameter. Rather than accept the error or wait for better tooling, I measured it, compensated for it in the CAD, and the bent tubes then came out to spec first time.', s:['analysis','design','machining'] },
    { t:'Designed and cut the plywood locating boards that hold every node to position on the welding table, so the frame holds tolerance through welding rather than being corrected afterwards.', s:['design','welding'] },
    { t:'Welded the frame up over roughly six weeks, then supervised and taught the fabrication work of newer members alongside it.', s:['welding','teamwork'] }
  ],
  photos:[
    { f:'fsae25-tube-measure.jpg', c:'Measuring tube on the bench during bender characterisation.', d:'Jul 2025' },
    { f:'fsae-bender-tolerance.jpg', c:'The bend radius came out 6.5 mm off nominal, so I compensated in CAD.', d:'Jun 2025' },
    { f:'chassis-hoops.jpg', c:'Main and front roll hoops after bending.', d:'Jul 2025' },
    { f:'chassis-jig.jpg', c:'Building the jig that holds the frame to tolerance.', d:'Jul 2025' },
    { f:'fsae25-jig-boards.jpg', c:'Plywood locating boards set up on the welding table.', d:'Jul 2025' },
    { f:'fsae25-jig-boards2.jpg', c:'Frame taking shape between the locating boards.', d:'Jul 2025' },
    { f:'chassis-in-jig.jpg', c:'Frame tacked up in the jig.', d:'Jul 2025' },
    { f:'fsae25-frame-lower.jpg', c:'Lower structure out of the jig.', d:'Aug 2025' },
    { f:'fsae25-frame-table.jpg', c:'Back on the table for the upper structure.', d:'Aug 2025' },
    { f:'chassis-welded.jpg', c:'The frame closed out.', d:'Aug 2025' },
    { f:'fsae25-frame-front.jpg', c:'Front bulkhead and footwell detail.', d:'Aug 2025' },
    { f:'fsae25-frame-progress.jpg', c:'Nearly complete in the welding booth.', d:'Aug 2025' },
    { f:'chassis-workshop.jpg', c:'The frame back in the workshop for fit out.', d:'Aug 2025' },
    { f:'fsae25-frame-booth.jpg', c:'Stood up, finished.', d:'Aug 2025' },
    { f:'fsae25-frame-suspension.jpg', c:'Suspension mounts going on.', d:'Sep 2025' },
    { f:'chassis-welding-arc.jpg', c:'TIG welding chassis mounts.', d:'Sep 2025' },
    { f:'fsae25-weld-joint.jpg', c:'A finished joint, where the tolerancing shows up.', d:'Sep 2025' },
    { f:'fsae25-insert.jpg', c:'Fitting a threaded insert into the frame.', d:'Sep 2025' },
    { f:'fsae25-frame-painted.jpg', c:'Painted, with suspension fitted.', d:'Sep 2025' },
    { f:'fsae25-frame-acc-bay.jpg', c:'The accumulator bay in the finished frame.', d:'Sep 2025' }
  ]
},

{ id:'fsae-acc-2025', kind:'project', cat:'fsae',
  title:'2025 accumulator, aluminium 600 V enclosure', org:'UTS Motorsports',
  from:2025, to:2025, when:'2025',
  skills:['hv','welding','design','integration'],
  summary:'The 600 V tractive system battery, rebuilt in aluminium for 2025. The most safety critical assembly on the car and the one scrutineering looks at hardest.',
  bullets:[
    { t:'Designed and built the aluminium accumulator enclosure and internals for the 600 V tractive system, and defended the design at technical scrutineering.', s:['hv','design'] },
    { t:'Welded the enclosure myself. To hold a steady torch height along long thin wall seams I ran the torch on a toy car as a rolling slide, which gave consistent welds where a free hand would have wandered.', s:['welding','hv'] },
    { t:'Packaged the enclosure, its mounts and its service access into the chassis, and worked out the lift and installation sequence so a heavy high voltage assembly could go in and out safely.', s:['integration','hv'] }
  ],
  photos:[
    { f:'acc-lid.jpg', c:'Folded aluminium lid.', d:'Oct 2025' },
    { f:'fsae25-acc-shroud.jpg', c:'Enclosure panels folded and tacked.', d:'Oct 2025' },
    { f:'acc-enclosure-build.jpg', c:'Enclosure under construction.', d:'Oct 2025' },
    { f:'fsae25-acc-weld.jpg', c:'The weld bead along an enclosure seam.', d:'Oct 2025' },
    { f:'acc-internals.jpg', c:'Internals and management hardware.', d:'Oct 2025' },
    { f:'acc-complete.jpg', c:'Completed, on its transport trolley.', d:'Nov 2025' },
    { f:'fsae25-acc-lift.jpg', c:'Lifting the accumulator up to the car.', d:'Nov 2025' },
    { f:'fsae25-enclosure-steel.jpg', c:'A folded steel sub-enclosure for the tractive system.', d:'Nov 2025' },
    { f:'fsae25-cover.jpg', c:'Folded aluminium cover, made on the same fold and weld process.', d:'Nov 2025' }
  ]
},

{ id:'fsae-machining-2025', kind:'project', cat:'fsae',
  title:'2025 machined components', org:'UTS Motorsports',
  from:2025, to:2025, when:'2025',
  skills:['machining','design','analysis','hv'],
  summary:'Spindles, steering, brackets and the tractive system active light. Manual mill and lathe where it suited, CNC where tolerance demanded it.',
  bullets:[
    { t:'CNC milled the 2025 wheel spindles between setups, one of the few genuinely safety critical machined parts on the car.', s:['machining'] },
    { t:'Machined and assembled the steering column, shaft, universal joints and splined couplings for the 2025 car.', s:['machining','design'] },
    { t:'Machined the tractive system active light housing from solid aluminium. It is a rules mandated indicator that has to be visible and mechanically secure, and it gets checked at scrutineering.', s:['machining','hv'] },
    { t:'Made suspension and mounting hardware to drawing across the campaign.', s:['machining','design'] }
  ],
  photos:[
    { f:'fsae-wheel-spindles.jpg', c:'2025 wheel spindles being CNC milled between setups.', d:'Jun 2025' },
    { f:'fsae25-steering-parts.jpg', c:'Steering shaft, universal joint and splined coupling.', d:'Sep 2025' },
    { f:'mach-steering-parts.jpg', c:'Steering column components laid out.', d:'Sep 2025' },
    { f:'mach-steering-column.jpg', c:'Steering column assembled.', d:'Sep 2025' },
    { f:'fsae25-suspension-hw.jpg', c:'Machined and anodised suspension hardware.', d:'Sep 2025' },
    { f:'mach-bracket.jpg', c:'Machined mounting bracket.', d:'Nov 2025' },
    { f:'fsae25-tsal.jpg', c:'The tractive system active light, machined from solid aluminium.', d:'Dec 2025' }
  ]
},

{ id:'fsae-integration-2025', kind:'project', cat:'fsae',
  title:'2025 vehicle integration and driver ergonomics', org:'UTS Motorsports',
  from:2025, to:2025, when:'2025',
  skills:['integration','design','project','teamwork'],
  summary:'Packaging, cooling, drivetrain and suspension brought together into a running car. Integration is where subsystem decisions either fit or do not.',
  bullets:[
    { t:'Owned full vehicle packaging and the interfaces between chassis, suspension, drivetrain, tractive system, cooling, braking and bodywork.', s:['integration','design'] },
    { t:'Set the driver ergonomics package before the frame was drawn, measuring the driver envelope directly and feeding seat, pedal, steering and cockpit template dimensions into the chassis design.', s:['design','integration'] },
    { t:'Ran the build sequence from rolling chassis through to a complete car ready to load out.', s:['project','teamwork'] }
  ],
  photos:[
    { f:'fsae-ergonomics.jpg', c:'Measuring the driver envelope to set the ergonomic dimensions before the chassis was designed.', d:'Mar 2025' },
    { f:'int-rolling-wheels.jpg', c:'On wheels for the first time.', d:'Sep 2025' },
    { f:'int-car-hoist.jpg', c:'Up on the gantry for access.', d:'Nov 2025' },
    { f:'fsae25-car-hoist.jpg', c:'Complete, liveried and on the hoist.', d:'Dec 2025' }
  ]
},

{ id:'sxsw-2025', kind:'project', cat:'fsae',
  title:'SXSW Sydney 2025, technology showcase and live interview', org:'UTS Motorsports',
  from:2025, to:2025, when:'2025',
  skills:['comms','teamwork','project'],
  summary:'Two days presenting the UTS Motorsports car at the SXSW Sydney technology showcase, including a livestreamed radio interview about the car, the project and the team.',
  bullets:[
    { t:'Represented UTS Motorsports at the SXSW Sydney technology showcase at the ICC Sydney, spending two days explaining the car to a mixed public, industry and student audience.', s:['comms'] },
    { t:'Gave a livestreamed interview on TAFE Radio at the event, covering the design of the car, the engineering behind specific subsystems, and the project and the team as a whole.', s:['comms','teamwork'] }
  ],
  link:{ href:'https://www.youtube.com/watch?v=78w1_5fbSrw', label:'Watch the SXSW Sydney interview' },
  photos:[
    { f:'sxsw25-showcase.jpg', c:'At the technology showcase, ICC Sydney, where I spent most of two days talking about the car.', d:'Oct 2025' },
    { f:'sxsw25-radio.jpg', c:'Giving the livestreamed TAFE Radio interview at SXSW Sydney.', d:'Oct 2025' },
    { f:'sxsw25-interview.jpg', c:'The interview itself. Click through to watch it.' }
  ]
},

/* ===================== FORMULA SAE, 2024 PROJECTS ===================== */

{ id:'fsae-chassis-2024', kind:'project', cat:'fsae',
  title:'2024 spaceframe chassis', org:'UTS Motorsports',
  from:2024, to:2024, when:'2024',
  skills:['design','welding','machining','analysis','teamwork'],
  summary:'My first chassis as Chassis Lead: jig, tabs, tube preparation and the welded frame.',
  bullets:[
    { t:'Led design and analysis of the 2024 spaceframe, covering CAD, FEA, tolerancing, jigging and welding supervision.', s:['design','analysis','welding'] },
    { t:'Designed and made the jig tabs that locate every node, then built the jig around them.', s:['design','welding','machining'] },
    { t:'Prepared tube stock on a CNC plasma tube notcher, and hand notched with a die grinder where the profile or the access defeated the machine. Both methods on the same frame, because the schedule does not wait for the ideal process.', s:['machining','welding'] },
    { t:'Welded the frame and taught newer members to weld and fabricate alongside the build.', s:['welding','teamwork'] }
  ],
  photos:[
    { f:'fsae-jig-tabs.jpg', c:'Making the tabs that locate every node in the jig.', d:'Jul 2024' },
    { f:'fsae-plasma-notcher.jpg', c:'Cutting notch profiles into one inch tube on the CNC plasma tube notcher.' },
    { f:'fsae-notched-tubes.jpg', c:'The notched tubes, ready to fit.' },
    { f:'fsae-hand-notching.jpg', c:'Hand notching with a die grinder where the machine could not reach.' },
    { f:'fsae24-frame-jig.jpg', c:'Frame set up in the jig on the welding table.', d:'Aug 2024' },
    { f:'fsae24-frame-floor.jpg', c:'Out of the jig and standing.', d:'Sep 2024' },
    { f:'fsae24-frame-joints.jpg', c:'Joint and bracket detail.', d:'Oct 2024' },
    { f:'chassis-joints.jpg', c:'Finished joints, where the tolerancing shows up.', d:'Oct 2024' },
    { f:'fsae24-suspension-mock.jpg', c:'Suspension mocked up on the frame.', d:'Oct 2024' },
    { f:'fsae24-bent-tubes.jpg', c:'Bent tube sets laid out for fitting.', d:'Nov 2024' },
    { f:'fsae24-tube-fitting.jpg', c:'Fitting tube on the welding table.', d:'Nov 2024' },
    { f:'fsae24-joint-bung.jpg', c:'Welding a threaded bung into a tube node.', d:'Nov 2024' }
  ]
},

{ id:'fsae-acc-2024', kind:'project', cat:'fsae',
  title:'2024 accumulator, steel 600 V enclosure', org:'UTS Motorsports',
  from:2024, to:2024, when:'2024',
  skills:['hv','welding','design','integration'],
  summary:'The first accumulator I built: steel enclosure, printed nylon cell brackets, and the shutdown hardware that goes with a 600 V system.',
  bullets:[
    { t:'Designed and built the steel accumulator enclosure and internals for the 600 V tractive system.', s:['hv','design','welding'] },
    { t:'Designed and printed the nylon cell segment brackets that locate and isolate the cells, chosen for stiffness and temperature resistance in an enclosed high voltage space.', s:['design','hv'] },
    { t:'Made the shutdown button housing and the associated tractive system safety hardware, which are rules mandated and inspected at scrutineering.', s:['hv','machining'] },
    { t:'Developed the toy car torch slide here first, to hold a steady height along long thin wall seams, and reused it on the 2025 aluminium enclosure.', s:['welding'] }
  ],
  photos:[
    { f:'fsae-cell-brackets.jpg', c:'Nylon printed cell segment brackets, prepped for assembly.', d:'Sep 2024' },
    { f:'fsae24-acc-steel.jpg', c:'The steel enclosure folded and assembled.', d:'Nov 2024' },
    { f:'fsae24-acc-build.jpg', c:'Internal segment structure under construction.', d:'Nov 2024' },
    { f:'acc-cell-stack.jpg', c:'Cell stack on its assembly fixture.', d:'Nov 2024' },
    { f:'fsae24-shutdown-button.jpg', c:'Shutdown button in its machined housing.', d:'Nov 2024' },
    { f:'acc-installed.jpg', c:'Ready to go into the car.', d:'Nov 2024' },
    { f:'fsae-weld-slider.jpg', c:'A toy car used as a torch slide, to hold a steady height along long seams.' }
  ]
},

{ id:'fsae-machining-2024', kind:'project', cat:'fsae',
  title:'2024 machined components', org:'UTS Motorsports',
  from:2024, to:2024, when:'2024',
  skills:['machining','design'],
  summary:'Mill and lathe work across brackets, bushes, spacers and driveline hardware.',
  bullets:[
    { t:'Machined brackets, bushes, spacers and driveline hardware on manual mill and lathe throughout the 2024 build.', s:['machining','design'] },
    { t:'Designed lightweighted welded steel brackets where a machined-from-solid part would have been heavier or slower to make.', s:['design','machining'] }
  ],
  photos:[
    { f:'fsae24-bushes.jpg', c:'A batch of turned bushes.', d:'Sep 2024' },
    { f:'fsae24-uni-joint.jpg', c:'Universal joint and splined shaft assembly.', d:'Sep 2024' },
    { f:'fsae24-bracket.jpg', c:'Lightweighted welded steel bracket.', d:'Oct 2024' },
    { f:'mach-bushes.jpg', c:'More bushes and spacers.', d:'Nov 2024' },
    { f:'mach-mill.jpg', c:'Set up in the mill.', d:'Nov 2024' },
    { f:'fsae24-spacers.jpg', c:'Finished spacers.', d:'Nov 2024' }
  ]
},

{ id:'fsae-integration-2024', kind:'project', cat:'fsae',
  title:'2024 vehicle integration and cooling', org:'UTS Motorsports',
  from:2023, to:2024, when:'2023 to 2024',
  skills:['integration','design','machining'],
  summary:'Cooling package, packaging and the build up from bare frame to a complete car.',
  bullets:[
    { t:'Designed the radiator mounts and cooling hose routing, printed in ABS and nylon for strength and heat resistance, with a second revision of the mounts manufactured on a manual mill after the printed parts showed their limits in service.', s:['design','machining'] },
    { t:'Packaged the cooling system around the chassis, drivetrain and bodywork, and ran the build from rolling chassis to complete car.', s:['integration'] }
  ],
  photos:[
    { f:'int-radiator.jpg', c:'Cooling system, radiator and hose routing.', d:'Nov 2024' },
    { f:'int-rolling-chassis.jpg', c:'Rolling chassis.', d:'Nov 2024' },
    { f:'fsae24-car-workshop.jpg', c:'Assembled on wheels in the workshop.', d:'Nov 2024' },
    { f:'fsae24-car-lift.jpg', c:'On the lift for final fit out.', d:'Nov 2024' }
  ]
},

{ id:'fsae-comp-2024', kind:'project', cat:'fsae',
  title:'Formula SAE-A 2024 competition', org:'UTS Motorsports',
  from:2024, to:2024, when:'2024',
  skills:['project','teamwork','hv'],
  summary:'The campaign before I took over as Mechanical Lead. The car got to the event but did not clear technical scrutineering, and working out why is what shaped the 2025 approach.',
  bullets:[
    { t:'Took the 2024 car to Formula SAE-A. It did not clear technical scrutineering, which is the safety gate a car must pass before it is allowed to run.', s:['project','hv'] },
    { t:'The problem was not any single component. Integration, schedule and rules compliance had not been managed as a system, and that diagnosis is what I changed the following year.', s:['project','teamwork'] }
  ],
  photos:[
    { f:'fsae24-comp-garage.jpg', c:'In the garage at the event.', d:'Dec 2024' },
    { f:'comp-scrutineering.jpg', c:'Technical scrutineering, the gate every car must clear.' },
    { f:'comp-car-paddock.jpg', c:'The car in the paddock.' },
    { f:'fsae24-comp-team.jpg', c:'With the car at the circuit.', d:'Dec 2024' },
    { f:'fsae24-comp-hoist.jpg', c:'Working on the car at the event.', d:'Dec 2024' }
  ]
},

{ id:'fsae-team', kind:'project', cat:'fsae',
  title:'Recruitment, training and team leadership', org:'UTS Motorsports',
  from:2024, to:2025, when:'2024 to 2025',
  skills:['teamwork','project'],
  summary:'Building and keeping a team of around twenty engineers, most of whom arrived without workshop experience.',
  bullets:[
    { t:'Interviewed a large pool of applicants at each intake, then onboarded and trained new recruits, building and retaining a core team of around twenty effective contributors.', s:['teamwork'] },
    { t:'Allocated tasks, mentored junior members and supervised students completing their own internship requirements on the team.', s:['teamwork','project'] },
    { t:'Taught welding, machining and fabrication directly, because the team capability resets every year unless someone does.', s:['teamwork'] }
  ],
  photos:[
    { f:'team-panel.jpg', c:'Teaching the build is most of the job.', d:'Aug 2024' },
    { f:'comp-team-paddock.jpg', c:'Between events.' }
  ]
},

/* ===================== FORMULA SAE, 2023 PROJECTS ===================== */

{ id:'fsae-steering', kind:'project', cat:'fsae',
  title:'Electric steering column, Autonomous vehicle', org:'UTS Motorsports',
  from:2023, to:2023, when:'2023',
  skills:['machining','welding','design','integration'],
  summary:'The steering actuation for the autonomous car, made on manual machines and a waterjet.',
  bullets:[
    { t:'Designed and fabricated the electric steering column for the Autonomous FSAE vehicle using manual lathe work, waterjet cutting and welding.', s:['machining','welding'] },
    { t:'Packaged the motor, column and mounting into the existing chassis and steering geometry so the car could be driven by a person or by the autonomous stack.', s:['integration','design'] }
  ],
  photos:[
    { f:'fsae23-steering-bench.jpg', c:'The electric steering column assembly on the bench.', d:'Oct 2023' },
    { f:'fsae23-steering-fitted.jpg', c:'Fitted into the car.', d:'Oct 2023' }
  ]
},

{ id:'fsae-dampers', kind:'project', cat:'fsae',
  title:'Ohlins TTX25 damper rebuild', org:'UTS Motorsports',
  from:2023, to:2023, when:'2023',
  skills:['machining','analysis'],
  summary:'Stripping and rebuilding the team dampers so the suspension design was working against known behaviour rather than assumed behaviour.',
  bullets:[
    { t:'Rebuilt the team Ohlins TTX25 dampers: stripped, inspected, reshimmed and rebuilt them, then recorded the configuration so later suspension work started from a known damper state.', s:['machining','analysis'] }
  ],
  photos:[ { f:'fsae-ttx25-dampers.jpg', c:'Rebuilding the Ohlins TTX25 dampers.', d:'Oct 2023' } ]
},

{ id:'fsae-afrp', kind:'project', cat:'fsae',
  title:'Harness insert testing in AFRP honeycomb panel', org:'UTS Motorsports',
  from:2023, to:2023, when:'2023',
  skills:['analysis','design','hv'],
  summary:'Destructive mechanical testing of harness mounting inserts in an aramid fibre reinforced polymer and aluminium honeycomb sandwich panel.',
  bullets:[
    { t:'Ran destructive mechanical testing on harness mounting inserts in an aramid fibre reinforced polymer (AFRP) and aluminium honeycomb sandwich panel, to prove the restraint mounting met the FSAE structural requirements.', s:['analysis'] },
    { t:'Recorded the results as evidence for the structural equivalency documentation, so later revisions started from measured data rather than assumption.', s:['analysis','design'] }
  ],
  photos:[ { f:'fsae-afrp-insert-test.jpg', c:'Destructive testing of harness inserts in AFRP and aluminium honeycomb panel.', d:'Dec 2023' } ]
},

{ id:'sxsw-2023', kind:'project', cat:'fsae',
  title:'SXSW Sydney 2023, invited speaker', org:'UTS and UTS Motorsports',
  from:2023, to:2023, when:'2023',
  skills:['comms','teamwork'],
  summary:'Invited to speak on behalf of the university and the autonomous team at the first SXSW Sydney.',
  bullets:[
    { t:'Invited to give a speech and presentation on behalf of UTS and the UTS Motorsports Autonomous team at the first SXSW Sydney, at Tumbalong Park, presenting the 2023 autonomous vehicle.', s:['comms','teamwork'] }
  ],
  photos:[
    { f:'sxsw23-stage.jpg', c:'Speaking at SXSW Sydney 2023, Tumbalong Park.', d:'Oct 2023' },
    { f:'sxsw23-presenting.jpg', c:'Presenting the autonomous vehicle programme.' },
    { f:'sxsw23-car.jpg', c:'The 2023 autonomous car on display.' }
  ]
},

/* ===================== UNIVERSITY ===================== */

{ id:'uni-solar-bbq', kind:'project', cat:'uni',
  title:'Solar barbecue', org:'Mechanical Systems Design Studio 2, UTS',
  from:2026, to:2026, when:'2026',
  skills:['design','analysis','teamwork'],
  summary:'A group build of a solar concentrating barbecue. Not my best work, and included because a portfolio that only shows the wins is not a portfolio.',
  bullets:[
    { t:'Designed and built a solar concentrating barbecue in a group, covering the reflector geometry, the thermal sizing and the supporting structure.', s:['design','analysis'] },
    { t:'The finished unit underperformed against our own thermal predictions. The useful outcome was working out why: the reflector accuracy and tracking tolerance we could actually achieve in the workshop were well outside what the calculation had assumed.', s:['analysis','teamwork'] }
  ],
  photos:[ { f:'uni-solar-bbq.jpg', c:'The solar barbecue as built.', d:'May 2026' } ]
},

{ id:'uni-steptracker', kind:'project', cat:'uni',
  title:'Wearable step tracker, PCB and firmware', org:'41070 Embedded Mechatronic Studio, UTS',
  from:2025, to:2025, when:'2025',
  skills:['electronics','software','design','analysis'],
  summary:'A wrist worn step tracker built from scratch by a group: custom PCB, analogue signal conditioning, firmware and an enclosure. My part was the filtering, the display and support on the power and MCU work.',
  bullets:[
    { t:'Designed the analogue front end: a second order low pass Butterworth filter at 40 Hz per axis with a gain of 1.2, behind a 500 Hz anti-alias stage, laid out as a repeated modular block across the X, Y and Z channels of an ADXL335 accelerometer, with test points on each stage.', s:['electronics','analysis'] },
    { t:'Prototyped and verified the filter on the bench with a function generator and oscilloscope before committing it to the board, then confirmed the response on the assembled PCB.', s:['analysis','electronics'] },
    { t:'Brought up the OLED display and wrote the code that drives it, showing live per axis g force and step count.', s:['software','electronics'] },
    { t:'Supported the power circuit and the microcontroller development, and contributed to the enclosure design.', s:['electronics','design'] },
    { t:'Learned Altium on this project, taking the board from schematic through layout to a working assembled unit.', s:['electronics'] }
  ],
  photos:[
    { f:'uni-step-display.jpg', c:'The finished tracker, showing live per axis g force and step count.', d:'Jun 2025' },
    { f:'uni-step-filter-bench.jpg', c:'Prototyping the filter on the bench before committing it to the board.', d:'Mar 2025' },
    { f:'uni-step-filter-layout.jpg', c:'The filter section: 500 Hz anti-alias into a second order 40 Hz Butterworth, gain 1.2, repeated per axis with test points.' },
    { f:'uni-step-render.jpg', c:'The board layout in Altium.' },
    { f:'uni-step-adxl335.jpg', c:'The ADXL335 accelerometer and self test switch on the board.', d:'May 2025' },
    { f:'uni-step-filter-boards.jpg', c:'The three per axis filter blocks populated.', d:'May 2025' },
    { f:'uni-step-assembled.jpg', c:'The assembled board off the bench.', d:'May 2025' },
    { f:'uni-step-pcb.jpg', c:'Wired up for testing.', d:'Jun 2025' },
    { f:'uni-step-section.jpg', c:'CAD section through the enclosure, showing the board and display stack.' },
    { f:'uni-step-internals.jpg', c:'Internals during assembly.', d:'Jun 2025' },
    { f:'uni-step-worn.jpg', c:'On the wrist and running.', d:'Jun 2025' }
  ]
},

{ id:'uni-robotics', kind:'project', cat:'uni',
  title:'Multi degree of freedom robotic arm control', org:'41013 Industrial Robotics, UTS',
  from:2024, to:2024, when:'2024',
  skills:['software','analysis','design'],
  summary:'Programming, simulating and controlling multi degree of freedom robot manipulators.',
  bullets:[
    { t:'Programmed, simulated and controlled multi degree of freedom robotic arms using ROS and C++, with MATLAB for kinematic modelling and simulation.', s:['software','analysis'] },
    { t:'Worked through manipulator pose representation, forward and inverse kinematics, motion planning and safety around collaborative robot hardware.', s:['analysis','software'] }
  ],
  photos:[
    { f:'uni-robotics-bench.jpg', c:'Development bench, running control code against the arm.', d:'Oct 2024' },
    { f:'uni-robotics-arm.jpg', c:'Collaborative robot arm in the UTS robotics lab.', d:'Oct 2024' }
  ]
},

{ id:'uni-thermofluids', kind:'project', cat:'uni',
  title:'Heat exchanger performance verification', org:'Thermofluids A, UTS (subject name to confirm)',
  from:2024, to:2024, when:'2024',
  skills:['analysis'],
  summary:'Calculating heat exchanger performance, then measuring it on a service module to find out whether the calculation held.',
  bullets:[
    { t:'Calculated heat exchanger performance and verified it experimentally on a heat exchanger service module, comparing predicted against measured heat transfer and accounting for the difference.', s:['analysis'] }
  ],
  photos:[ { f:'uni-heat-exchanger.jpg', c:'Verifying calculations on the heat exchanger service module.', d:'Sep 2024' } ]
},

{ id:'uni-warman', kind:'project', cat:'uni',
  title:'Warman Design and Build Challenge robot', org:'Mechanical Design Fundamentals Studio, UTS',
  from:2024, to:2024, when:'2024',
  skills:['design','software','integration','teamwork'],
  summary:'A competition robot built by a group. I designed the extension boom and the multi axis grabber, and programmed the robot.',
  bullets:[
    { t:'Designed the mechanical extension and the multi axis grabber mechanism, including the worm and spur gear drive that lifts and rotates the boom, modelled in SolidWorks and then built.', s:['design'] },
    { t:'Programmed the robot: drive, boom actuation and grabber sequencing for the competition task.', s:['software'] },
    { t:'Integrated the mechanism, the drivetrain and the control into a working machine, and ran it in the end of semester competition.', s:['integration','teamwork'] }
  ],
  photos:[
    { f:'uni-warman-cad1.jpg', c:'Rotation and lift assembly: worm drive into a spur gear on the boom.', d:'Mar 2024' },
    { f:'uni-warman-cad2.jpg', c:'Drive detail through the lift gear train.', d:'Mar 2024' },
    { f:'uni-warman-cad3.jpg', c:'Chassis and extension boom layout.', d:'Apr 2024' },
    { f:'uni-warman-cad4.jpg', c:'Full assembly in SolidWorks.', d:'Apr 2024' },
    { f:'uni-warman-built.jpg', c:'The robot built, with the printed gear train and acrylic extension.', d:'May 2024' },
    { f:'uni-warman-comp.jpg', c:'Running the task in the competition arena.' }
  ]
},

{ id:'uni-embedded', kind:'project', cat:'uni',
  title:'FPGA and STM32 embedded platforms', org:'Embedded Mechatronic Systems, UTS',
  from:2024, to:2024, when:'2024',
  skills:['electronics','software'],
  summary:'Working directly with FPGA and microcontroller hardware and their toolchains.',
  bullets:[
    { t:'Worked with Intel Altera FPGA boards in Quartus Prime and STM32 microcontrollers in STM32CubeIDE, from toolchain setup through to running designs on hardware.', s:['electronics','software'] },
    { t:'Built a sensing project around a VL53L8CX time of flight array on an STM32, resolving an object into a live multi zone distance map rather than a single range reading.', s:['electronics','software'] }
  ],
  photos:[
    { f:'uni-fpga-stm32.jpg', c:'FPGA board on the bench with its programmer.', d:'Mar 2024' },
    { f:'uni-tof-array.jpg', c:'VL53L8CX time of flight array resolving a hand into a live zone map.' }
  ]
},

{ id:'uni-levelplate', kind:'project', cat:'uni',
  title:'Self levelling wheel alignment and setup plate', org:'Introduction to Mechatronics, UTS',
  from:2023, to:2023, when:'2023',
  skills:['electronics','software','design','integration'],
  summary:'A setup pad for a race car that finds level and aligns itself, with its own control software. First year mechatronics, pointed at a problem I actually had.',
  bullets:[
    { t:'Designed and built a flat plate that automatically levels and aligns itself, for setting up a race car, where a true and level reference plane is the precondition for every corner weight and alignment measurement.', s:['design','integration'] },
    { t:'Built on an Arduino Mega with an MPU6050 accelerometer for attitude, ultrasonic sensors for ranging and paired lasers and light sensors for alignment, driving three levelling screws through DC motors with planetary gearboxes.', s:['electronics'] },
    { t:'Wrote the control software from scratch, including a touchscreen operating interface showing per corner readings, front and rear orientation, and live alignment values.', s:['software'] }
  ],
  photos:[
    { f:'uni-levelplate-built.jpg', c:'The three arm levelling plate as built, with geared levelling screws.', d:'Nov 2023' },
    { f:'uni-levelplate-ui.jpg', c:'The control interface I wrote, showing per corner alignment and levelling values.', d:'Nov 2023' },
    { f:'uni-levelplate-cad.jpg', c:'CAD of the levelling screw housing.', d:'Nov 2023' },
    { f:'uni-levelplate-pads.jpg', c:'The real setup pads and string lines this was aimed at replacing.' }
  ]
},

{ id:'uni-waterpump', kind:'project', cat:'uni',
  title:'Double acting hand water pump', org:'UTS (subject name to confirm)',
  from:2023, to:2023, when:'2023',
  skills:['design','analysis'],
  summary:'A hand pump that delivers flow on both strokes rather than one.',
  bullets:[
    { t:'Designed and built a double acting hand water pump, so the piston delivers flow on both the up and the down stroke, using a valve arrangement built into a PVC body.', s:['design','analysis'] }
  ],
  photos:[ { f:'uni-water-pump.jpg', c:'The double acting hand pump as built.', d:'Oct 2023' } ]
},

{ id:'uni-traffic', kind:'project', cat:'uni',
  title:'Traffic light control system', org:'Introduction to Mechatronics, UTS',
  from:2023, to:2023, when:'2023',
  skills:['electronics','software'],
  summary:'An early Arduino project: state machine control of a signalled intersection.',
  bullets:[
    { t:'Built an Arduino traffic light control system, implementing the intersection sequencing and timing as a state machine. One of the first pieces of embedded work I did, and the starting point for everything mechatronic that followed.', s:['electronics','software'] }
  ],
  photos:[ { f:'uni-traffic-light.jpg', c:'Arduino traffic light control system on the bench.', d:'Aug 2023' } ]
},

{ id:'uni-bridge', kind:'project', cat:'uni',
  title:'Bridge design and load test', org:'Applied Mechanics and Design A, UTS (subject name to confirm)',
  from:2023, to:2023, when:'2023',
  skills:['design','analysis','teamwork'],
  summary:'A structure designed to a load and mass target, then tested to failure against everyone else.',
  bullets:[
    { t:'Designed and built a bridge with a partner, sizing members against the predicted load path and the mass limit, and tested it in the end of semester competition.', s:['design','analysis','teamwork'] }
  ],
  photos:[ { f:'uni-bridge.jpg', c:'Testing the bridge in the end of semester competition.' } ]
},

{ id:'uni-catapult', kind:'project', cat:'uni',
  title:'Calibrated catapult, group lead', org:'Introduction to Mechanical Engineering, UTS',
  from:2023, to:2023, when:'2023',
  skills:['design','analysis','teamwork'],
  summary:'A deliberately simple machine made accurate by doing the maths properly. Still kept by the subject as an example of building something simply but well.',
  bullets:[
    { t:'Led the group that designed and fabricated the catapult, from the kinematic analysis through to the finished machine.', s:['teamwork','design'] },
    { t:'Calculated the projectile kinematics and sized and specified the spring against the range requirements of the brief, rather than tuning by trial and error.', s:['analysis'] },
    { t:'Added a calibrated scale to the release arm, which turned the launch setting into a repeatable number and made the machine both accurate and quick to recalibrate between shots.', s:['design'] },
    { t:'The result substantially overachieved against the assessment criteria, and is still kept and shown to later cohorts as an example of a simple design executed well.', s:['design','teamwork'] }
  ],
  photos:[
    { f:'uni-catapult-frame.jpg', c:'The catapult as built.', d:'May 2023' },
    { f:'uni-catapult-scale.jpg', c:'The calibration scale on the release arm, which made it repeatable.', d:'May 2023' }
  ]
},

/* ===================== PERSONAL ===================== */

{ id:'pers-omni', kind:'project', cat:'personal',
  title:'Omni wheel', org:'Independent',
  from:2024, to:9999, when:'2024, ongoing',
  skills:['design','machining'],
  summary:'An independent design project: an omni wheel that is more durable and more capable than the conventional designs.',
  bullets:[
    { t:'Developing an omni wheel intended to be more durable than conventional designs, with capability beyond what the standard roller arrangements manage.', s:['design','machining'] }
  ],
  photos:[ { f:'pers-omni-wheel.jpg', c:'The omni wheel I made.', d:'Feb 2024' } ]
},

{ id:'pers-victa', kind:'project', cat:'personal',
  title:'Victa engine rebuild, Nomex gasket trial', org:'Independent',
  from:2025, to:2025, when:'2025',
  skills:['machining','analysis'],
  summary:'Rebuilding an old two stroke as a test bed for an unconventional gasket material.',
  bullets:[
    { t:'Rebuilt an old Victa lawnmower engine specifically to test whether Nomex works as a general purpose gasket material, using it on the carburettor, the crankcase and the head.', s:['machining','analysis'] },
    { t:'The point was not the mower. It was finding out how one material behaves across three joints with very different temperature, pressure and clamping conditions, on something where being wrong costs nothing.', s:['analysis'] }
  ],
  photos:[ { f:'pers-victa-nomex.jpg', c:'The Victa engine rebuilt with Nomex gaskets.', d:'Sep 2025' } ]
},

{ id:'pers-simrig', kind:'project', cat:'personal',
  title:'Sim racing rig', org:'Independent',
  from:2025, to:2025, when:'Year to confirm',
  skills:['design','welding','integration'],
  summary:'A sim racing rig designed and built from scratch.',
  bullets:[
    { t:'Designed and built a sim racing rig, covering the frame, the mounting geometry for wheel, pedals and seat, and the stiffness needed to take direct drive loads without flexing.', s:['design','welding','integration'] }
  ],
  photos:[]
},

{ id:'pers-shed24', kind:'project', cat:'personal',
  title:'Second shed build', org:'With my father',
  from:2024, to:2024, when:'2024',
  skills:['design','project'],
  summary:'A second workshop shed, built with my father.',
  bullets:[
    { t:'Designed and built a second shed with my father, covering the frame, cladding, roofing and openings.', s:['design','project'] }
  ],
  photos:[ { f:'pers-shed24.jpg', c:'The 2024 shed part way through cladding.', d:'Oct 2024' } ]
},

{ id:'pers-postie', kind:'project', cat:'personal',
  title:'Honda NBC110 refurbishment and remote start', org:'Independent',
  from:2022, to:2023, when:'2022 to 2023',
  skills:['machining','electronics','software','design'],
  summary:'A postie bike brought back from the dead, then given a phone operated start and an alarm that uses its own horns.',
  bullets:[
    { t:'Refurbished a Honda NBC110 postie bike mechanically, from a non running machine back to reliable road use.', s:['machining','design'] },
    { t:'Added wireless start from my phone using an ESP32, wired into the existing ignition and starter circuit.', s:['electronics','software'] },
    { t:'Wrote an automatic alarm on the same controller that detects the bike being moved while parked and sounds the bike own horns, so it needed no extra hardware to be audible.', s:['software','electronics'] }
  ],
  photos:[
    { f:'pers-postie-1.jpg', c:'The NBC110 during refurbishment.', d:'Oct 2022' },
    { f:'pers-postie-2.jpg', c:'Working through the mechanical rebuild.', d:'Oct 2022' },
    { f:'pers-postie-3.jpg', c:'Wiring the ESP32 into the ignition and starter circuit.', d:'Oct 2022' },
    { f:'pers-postie-4.jpg', c:'Back on the road.', d:'Jul 2023' }
  ]
},

{ id:'pers-vest', kind:'project', cat:'personal',
  title:'Motorcycle e-safety vest, Shape Exhibition', org:'Year 12 Design and Technology major project',
  from:2021, to:2021, when:'2021',
  skills:['design','electronics'],
  summary:'A haptic vest giving riders an extra sense of the traffic around them. Top in the state, and shown at the Powerhouse Museum.',
  bullets:[
    { t:'Designed and built a motorcycle safety vest using haptic pods to give riders an extra sense of surrounding vehicles.', s:['design','electronics'] },
    { t:'Recognised as top in the state for Design and Technology, selected for the Shape Exhibition and displayed at the Powerhouse Museum, Sydney.', s:['design'] }
  ],
  link:{ href:'https://drive.google.com/file/d/1DLDCAGlfcq-ss1LrwurLuEZlUPF1Zd0-/view', label:'Shape Exhibition project portfolio' },
  photos:[]
},

{ id:'pers-shed19', kind:'project', cat:'personal',
  title:'Shed build', org:'With my father',
  from:2019, to:2019, when:'2019',
  skills:['design','project'],
  summary:'The first shed my father and I built together, and the first thing I made that had to stand up on its own.',
  bullets:[
    { t:'Built a shed with my father: frame, cladding, roof and openings, from setting out through to finished structure.', s:['design','project'] }
  ],
  photos:[
    { f:'pers-shed19-1.jpg', c:'The 2019 shed during framing.', d:'Aug 2019' },
    { f:'pers-shed19-2.jpg', c:'Roof and cladding going on.' },
    { f:'pers-shed19-3.jpg', c:'Finished.', d:'Jul 2022' }
  ]
}

];

/* Landing page strip: a spread across the whole of it, not just Formula SAE. */
window.FEATURED = [
  'sxsw25-radio.jpg', 'fsae25-car-portrait.jpg', 'tig-pit-data-station.jpg',
  'chassis-welding-arc.jpg', 'uni-step-display.jpg', 'pers-postie-4.jpg',
  'tig-hidden-valley.jpg', 'about-celebration.jpg'
];
