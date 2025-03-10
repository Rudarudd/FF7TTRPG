// Global resource variables – starting with 25 HP and 10 MP
let max_hp = 25,
  current_hp = 25;
let max_mp = 10,
  current_mp = 10;
let max_stamina = 100,
  current_stamina = 100;
let max_atb = 100,
  current_atb = 0;

// Global stat variables – all start at 1
let stat_str = 1,
  stat_vit = 1,
  stat_dex = 1,
  stat_mag = 1,
  stat_wil = 1,
  stat_spr = 1,
  stat_lck = 1;
let level = 1,
  exp = 1,
  movement = 65; // Base movement starts at 65 ft
let statBonusElements = {};

// Player's starting inventory (populated initially)
let inventory = [];

// Add this near the top of your script with other constants
let inventoryCategories = ["Equipment", "Consumables", "Materials", "Miscellaneous"];

let categoryStates = {};

// Master list of available items with quantity and quality
let availableItems = {
  "Equipment": [
    { name: "Buster Sword", description: "A massive sword.", category: "Equipment", type: "On-Hand", crystalSlots: 2, quantity: 1, quality: "Rare" },
    { name: "Leather Armor", description: "Basic protection.", category: "Equipment", type: "Chest", quantity: 1, quality: "Common" }
  ],
  "Consumables": [
    { name: "Healing Potion", description: "Restores 20 HP.", category: "Consumables", quantity: 1, quality: "Common" }
  ],
  "Materials": [
    { name: "Green Materia", description: "Casts Cure.", category: "Materials", quantity: 1, quality: "Uncommon" },
    { name: "Fire Crystal", description: "Grants the ability to cast Fire.", category: "Materials", statBonuses: { MAG: 2 }, abilities: ["Fire"], statRequirements: { MAG: 5 }, quantity: 1, quality: "Rare" },
    { name: "Heal Crystal", description: "Grants the ability to cast Cure.", category: "Materials", statBonuses: { WIL: 1 }, abilities: ["Cure"], statRequirements: { WIL: 3 }, quantity: 1, quality: "Rare" }
  ],
  "Miscellaneous": [
    { name: "Old Key", description: "Rusty but functional.", category: "Miscellaneous", quantity: 1, quality: "Poor" }
  ]
};

// Initialize inventory with all items from availableItems
function initializeInventory() {
  console.log("Initializing inventory");
  const savedInventory = localStorage.getItem('inventory');
  if (savedInventory) {
    inventory = JSON.parse(savedInventory);
  } else {
    inventory = [];
    Object.values(availableItems).forEach(category => {
      category.forEach(item => inventory.push({ ...item }));
    });
  }
}

// Equipment-related globals
let equippedItems = {
  "On-Hand": null,
  "Off-Hand": null,
  Chest: null,
  Helm: null,
  Gloves: null,
  Greaves: null,
  "Accessory 1": null,
  "Accessory 2": null,
};

let availableEquipment = {
  "On-Hand": [],
  "Off-Hand": [],
  Chest: [],
  Helm: [],
  Gloves: [],
  Greaves: [],
  "Accessory 1": [],
  "Accessory 2": [],
};

let slotSelects = {};

let characterAbilities = [];

// Add currentTab to track the active tab
let currentTab = 'resources'; // Default tab

// p5.js setup function
function setup() {
  // Create canvas (optional, adjust size as needed)
  let cnv = createCanvas(800, 600);
  cnv.parent('resources'); // Attach to the Resources tab

  // Initial setup
  initializeInventory();
  updateAvailableEquipment();

  // Set up tab switching
  document.querySelectorAll('.tablink').forEach(button => {
    button.addEventListener('click', () => {
      switchTab(button.getAttribute('data-tab'));
    });
  });

  // Initial call to show the default tab
  switchTab('resources');
}

// p5.js draw function
function draw() {
  // Optional: Add background or other continuous updates
  background(255);
  // Render the current tab's content
  if (currentTab === 'inventory') {
    createInventoryUI();
  } else if (currentTab === 'equipment') {
    createEquipmentUI();
  } else if (currentTab === 'stats') {
    // Add stats UI function if defined
  } else if (currentTab === 'traits') {
    createTraitsUI();
  } else if (currentTab === 'talents') {
    // Add talents UI function if defined
  } else if (currentTab === 'abilities') {
    // Add abilities UI function if defined
  } else if (currentTab === 'resources') {
    // Add resources UI function if defined (e.g., createResourceUI if you have it)
  }
}

function switchTab(tabName) {
  console.log(`Switching to tab: ${tabName}`); // Debug
  // Hide all tab content
  document.querySelectorAll('.tabcontent').forEach(tab => {
    tab.style.display = 'none';
    tab.classList.remove('active');
  });

  // Show the selected tab
  let selectedTab = document.getElementById(tabName);
  selectedTab.style.display = 'block';
  selectedTab.classList.add('active');

  // Update active tablink style
  document.querySelectorAll('.tablink').forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-tab') === tabName) {
      btn.classList.add('active');
    }
  });

  // Update currentTab
  currentTab = tabName;

  // Render the tab content without resetting inventory
  if (tabName === 'inventory') {
    console.log("Before render, inventory:", JSON.stringify(inventory, null, 2)); // Debug before render
    createInventoryUI();
  } else if (tabName === 'equipment') {
    createEquipmentUI();
  } else if (tabName === 'stats') {
    // Add stats UI function if defined
  } else if (tabName === 'traits') {
    createTraitsUI();
  } else if (tabName === 'talents') {
    // Add talents UI function if defined
  } else if (tabName === 'abilities') {
    // Add abilities UI function if defined
  } else if (tabName === 'resources') {
    // Add resources UI function if defined
  }
}

// Ensure availableEquipment is updated based on inventory
function updateAvailableEquipment() {
  for (let slot in availableEquipment) {
    availableEquipment[slot] = inventory.filter(
      (item) => item.type === slot && item.category === "Equipment"
    );
  }
  console.log("Updated availableEquipment:", availableEquipment); // Debug
}
updateAvailableEquipment(); // Initial update

function updateAbilities() {
  characterAbilities = [];
  for (let slot in equippedItems) {
    let item = equippedItems[slot];
    if (item && item.equippedCrystals) {
      item.equippedCrystals.forEach(crystal => {
        if (crystal && crystal.abilities) {
          crystal.abilities.forEach(ability => {
            if (!characterAbilities.includes(ability)) {
              characterAbilities.push(ability);
            }
          });
        }
      });
    }
  }
  console.log("Current Abilities:", characterAbilities); // For now, log to console
  // Later, update Abilities page UI here
}

// UI elements for resource tracker (created in createResourceUI)
let maxHpInput, setMaxHpButton, maxMpInput, setMaxMpButton;
let maxStaminaInput, setMaxStaminaButton, maxAtbInput, setMaxAtbButton;
let hpPlus,
  hpMinus,
  mpPlus,
  mpMinus,
  staminaPlus,
  staminaMinus,
  atbPlus,
  atbMinus;
let resetButton;
let staminaAtbLink = false,
  staminaAtbLinkButton;
let cnv;
let modalDiv = null; // For modals

// Global container variables (set in setup)
let resourceUIContainer;
let skillsContainer;

// For description modals
let descriptionModal = null;

// For linking stats to skills
let statLabelElements = {};
let attributeCheckboxes = {};
let statLinkMapping = {};
let attributeLinkMapping = {};

// For talents
let talents = []; // Array to store talent objects

// For traits
let traits = [];
let maxTraits = 3;

// Stat descriptions
const statDescriptions = {
  STR: "Affects melee and ranged physical rolls (1d12 + STR vs DEF).",
  VIT: "Increases HP (+5 HP per point).",
  DEX: "Determines dodge rolls (1d12 + DEX to evade).",
  MAG: "Affects magical attack rolls (1d12 + MAG vs MDEF).",
  WIL: "Increases MP (+5 MP per point).",
  SPR: "Determines magic evasion (1d12 + SPR to evade magic attacks).",
  LCK: "Modifies loot rolls, critical hits, and grants rerolls (1 per 5 LCK).",
  Level: "Character Level.",
  EXP: "Experience Points (EXP) accumulated; formula for next level is TBD.",
  Movement: "Determines movement range per turn.",
};

// Additional attributes
const additionalAttributes = [
  {
    name: "Athletics",
    desc:
      "Your ability to exert physical strength and endurance to overcome obstacles. Used for climbing, swimming, jumping, grappling, and feats of raw power.",
    color: "#C0392B",
  },
  {
    name: "Endurance",
    desc:
      "Your capacity to withstand physical strain, pain, and adverse conditions. Used for resisting poisons, disease, exhaustion, and enduring extreme conditions.",
    color: "#27AE60",
  },
  {
    name: "Agility",
    desc:
      "Your speed, reflexes, and balance in movement and precision. Used for dodging, acrobatics, stealth, and precise motor control.",
    color: "#2980B9",
  },
  {
    name: "Willpower",
    desc:
      "Your mental resilience and determination to resist external influences. Used for resisting mind control, fear effects, psychic attacks, and maintaining focus under pressure.",
    color: "#FF69B4",
  },
  {
    name: "Awareness",
    desc:
      "Your ability to observe, sense, and interpret your surroundings. Used for noticing hidden details, tracking, detecting lies, and reacting to environmental threats.",
    color: "#F39C12",
  },
  {
    name: "Influence",
    desc:
      "Your ability to manipulate, persuade, or command others through words and body language. Friendly Influence is used for persuasion, bartering, and diplomacy; Hostile Influence is used for intimidation and coercion.",
    color: "#8E44AD",
  },
  {
    name: "Ingenuity",
    desc:
      "Your problem-solving ability and technical expertise in mechanical, electronic, and creative fields. Used for hacking, crafting, repairing technology, and improvising solutions.",
    color: "#2C3E50",
  },
];

// Default talents (shortened for brevity; full list can be added back)
const defaultTalents = [
  // Physical Combat
  {
    name: "Relentless Fighter - Level I",
    level: "I",
    category: "Physical Combat",
    description: "Recover 5 Stamina per turn.",
    maxLevel: "II",
  },
  {
    name: "Relentless Fighter - Level II",
    level: "II",
    category: "Physical Combat",
    description: "Recover 10 Stamina per turn.",
    maxLevel: "II",
  },
  {
    name: "Heavy Hitter - Level I",
    level: "I",
    category: "Physical Combat",
    description: "Gain +2 melee damage on critical hits.",
    maxLevel: "III",
  },
  {
    name: "Heavy Hitter - Level II",
    level: "II",
    category: "Physical Combat",
    description: "Gain +4 melee damage on critical hits.",
    maxLevel: "III",
  },
  {
    name: "Heavy Hitter - Level III",
    level: "III",
    category: "Physical Combat",
    description: "Gain +6 melee damage on critical hits.",
    maxLevel: "III",
  },
  {
    name: "Quick Reflexes - Level I",
    level: "I",
    category: "Physical Combat",
    description: "Dodging costs 20 Stamina instead of 25.",
    maxLevel: "III",
  },
  {
    name: "Quick Reflexes - Level II",
    level: "II",
    category: "Physical Combat",
    description: "Dodging costs 15 Stamina instead of 25.",
    maxLevel: "III",
  },
  {
    name: "Quick Reflexes - Level III",
    level: "III",
    category: "Physical Combat",
    description: "Dodging costs 10 Stamina instead of 25.",
    maxLevel: "III",
  },
  {
    name: "Enduring Block - Level I",
    level: "I",
    category: "Physical Combat",
    description: "If you fully block an attack, you recover 10 Stamina.",
    maxLevel: "III",
  },
  {
    name: "Enduring Block - Level II",
    level: "II",
    category: "Physical Combat",
    description: "If you fully block an attack, you recover 15 Stamina.",
    maxLevel: "III",
  },
  {
    name: "Enduring Block - Level III",
    level: "III",
    category: "Physical Combat",
    description: "If you fully block an attack, you recover 20 Stamina.",
    maxLevel: "III",
  },
  {
    name: "Battlefield Awareness - Level I",
    level: "I",
    category: "Physical Combat",
    description: "When an enemy misses you, gain 5 ATB.",
    maxLevel: "III",
  },
  {
    name: "Battlefield Awareness - Level II",
    level: "II",
    category: "Physical Combat",
    description: "When an enemy misses you, gain 10 ATB.",
    maxLevel: "III",
  },
  {
    name: "Battlefield Awareness - Level III",
    level: "III",
    category: "Physical Combat",
    description: "When an enemy misses you, gain 15 ATB.",
    maxLevel: "III",
  },
  {
    name: "Tactical Step - Level I",
    level: "I",
    category: "Physical Combat",
    description: "Moving an extra 10 ft per turn is free.",
    maxLevel: "II",
  },
  {
    name: "Tactical Step - Level II",
    level: "II",
    category: "Physical Combat",
    description: "Moving an extra 20 ft per turn is free.",
    maxLevel: "II",
  },
  {
    name: "Momentum Strike - Level I",
    level: "I",
    category: "Physical Combat",
    description:
      "If you move at least 15 ft before attacking, your attack deals +2 damage.",
    maxLevel: "I",
  },
  {
    name: "Shatter Guard - Level I",
    level: "I",
    category: "Physical Combat",
    description: "If an enemy is blocking, your attack ignores 2 DEF.",
    maxLevel: "I",
  },
  {
    name: "Grappling Mastery - Level I",
    level: "I",
    category: "Physical Combat",
    description: "Gain Advantage on all Grapple attempts.",
    maxLevel: "I",
  },

  // Magical
  {
    name: "Efficient Spellcasting - Level I",
    level: "I",
    category: "Magical",
    description: "Materia spells cost -5 MP (minimum 1MP cost per spell).",
    maxLevel: "III",
  },
  {
    name: "Efficient Spellcasting - Level II",
    level: "II",
    category: "Magical",
    description: "Materia spells cost -10 MP (minimum 1MP cost per spell).",
    maxLevel: "III",
  },
  {
    name: "Efficient Spellcasting - Level III",
    level: "III",
    category: "Magical",
    description: "Materia spells cost -15 MP (minimum 1MP cost per spell).",
    maxLevel: "III",
  },
  {
    name: "Arcane Conductor - Level I",
    level: "I",
    category: "Magical",
    description: "If you evade a magic attack, regain 5 MP.",
    maxLevel: "II",
  },
  {
    name: "Arcane Conductor - Level II",
    level: "II",
    category: "Magical",
    description: "If you evade a magic attack, regain 10 MP.",
    maxLevel: "II",
  },
  {
    name: "Elemental Mastery - Level I",
    level: "I",
    category: "Magical",
    description: "Choose one element; spells of that type deal +2 damage.",
    maxLevel: "II",
  },
  {
    name: "Elemental Mastery - Level II",
    level: "II",
    category: "Magical",
    description: "Choose one element; spells of that type deal +4 damage.",
    maxLevel: "II",
  },
  {
    name: "Mana Reservoir - Level I",
    level: "I",
    category: "Magical",
    description: "Max MP is increased by 5.",
    maxLevel: "II",
  },
  {
    name: "Mana Reservoir - Level II",
    level: "II",
    category: "Magical",
    description: "Max MP is increased by 10.",
    maxLevel: "II",
  },
  {
    name: "Overcharged Spellcasting - Level I",
    level: "I",
    category: "Magical",
    description:
      "If you spend double MP on a spell, its damage increases by +50%.",
    maxLevel: "I",
  },
  {
    name: "Dual Weave - Level I",
    level: "I",
    category: "Magical",
    description:
      "If you cast a spell, you may spend 25 ATB to cast a second spell as a bonus effect (must be a different spell).",
    maxLevel: "II",
  },
  {
    name: "Dual Weave - Level II",
    level: "II",
    category: "Magical",
    description:
      "If you cast a spell, you may spend 50 ATB to cast a second spell as a bonus effect (must be a different spell).",
    maxLevel: "II",
  },
  {
    name: "Weave Momentum - Level I",
    level: "I",
    category: "Magical",
    description: "If you cast a spell, your next attack deals +2 damage.",
    maxLevel: "I",
  },

  // Ranged Combat
  {
    name: "Sharpshooter - Level I",
    level: "I",
    category: "Ranged Combat",
    description: "Gain +1 damage on ranged attacks.",
    maxLevel: "III",
  },
  {
    name: "Sharpshooter - Level II",
    level: "II",
    category: "Ranged Combat",
    description: "Gain +2 damage on ranged attacks.",
    maxLevel: "III",
  },
  {
    name: "Sharpshooter - Level III",
    level: "III",
    category: "Ranged Combat",
    description: "Gain +3 damage on ranged attacks.",
    maxLevel: "III",
  },
  {
    name: "Cover Fire - Level I",
    level: "I",
    category: "Ranged Combat",
    description:
      "If an ally within 30 ft is attacked, you may spend 25 ATB to make a reaction shot at the attacker.",
    maxLevel: "I",
  },
  {
    name: "Eagle Eye - Level I",
    level: "I",
    category: "Ranged Combat",
    description: "Ignore half cover when making ranged attacks.",
    maxLevel: "I",
  },
  {
    name: "Deadly Precision - Level I",
    level: "I",
    category: "Ranged Combat",
    description:
      "When making a ranged attack, you may spend 10 ATB to increase your crit range by 1.",
    maxLevel: "III",
  },
  {
    name: "Deadly Precision - Level II",
    level: "II",
    category: "Ranged Combat",
    description:
      "When making a ranged attack, you may spend 20 ATB to increase your crit range by 2.",
    maxLevel: "III",
  },
  {
    name: "Deadly Precision - Level III",
    level: "III",
    category: "Ranged Combat",
    description:
      "When making a ranged attack, you may spend 30 ATB to increase your crit range by 3.",
    maxLevel: "III",
  },

  // Defensive
  {
    name: "Guardian’s Oath - Level I",
    level: "I",
    category: "Defensive",
    description: "When you block for an ally, gain +2 to your Block Roll.",
    maxLevel: "III",
  },
  {
    name: "Guardian’s Oath - Level II",
    level: "II",
    category: "Defensive",
    description: "When you block for an ally, gain +4 to your Block Roll.",
    maxLevel: "III",
  },
  {
    name: "Guardian’s Oath - Level III",
    level: "III",
    category: "Defensive",
    description: "When you block for an ally, gain +6 to your Block Roll.",
    maxLevel: "III",
  },
  {
    name: "Armor Mastery - Level I",
    level: "I",
    category: "Defensive",
    description: "Wearing Heavy Armor increases movement speed by 5 ft.",
    maxLevel: "III",
  },
  {
    name: "Armor Mastery - Level II",
    level: "II",
    category: "Defensive",
    description: "Wearing Heavy Armor increases movement speed by 10 ft.",
    maxLevel: "III",
  },
  {
    name: "Armor Mastery - Level III",
    level: "III",
    category: "Defensive",
    description: "Wearing Heavy Armor increases movement speed by 15 ft.",
    maxLevel: "III",
  },
  {
    name: "Defensive Momentum - Level I",
    level: "I",
    category: "Defensive",
    description:
      "After blocking an attack, your next dodge roll gains Advantage.",
    maxLevel: "I",
  },
  {
    name: "Reactive Parry - Level I",
    level: "I",
    category: "Defensive",
    description:
      "If an enemy attacks you in melee, you may spend 25 ATB to counterattack.",
    maxLevel: "I",
  },
  {
    name: "Iron Will - Level I",
    level: "I",
    category: "Defensive",
    description: "Start encounters with an additional 25 stamina.",
    maxLevel: "I",
  },
  {
    name: "Stalwart Wall - Level I",
    level: "I",
    category: "Defensive",
    description: "If you don’t move on your turn, you gain +2 DEF for 1 round.",
    maxLevel: "I",
  },

  // Utility & Tactical
  {
    name: "Tactician’s Instinct - Level I",
    level: "I",
    category: "Utility & Tactical",
    description:
      "Gain Advantage on Awareness rolls, and once per combat, you may reroll Initiative.",
    maxLevel: "II",
  },
  {
    name: "Tactician’s Instinct - Level II",
    level: "II",
    category: "Utility & Tactical",
    description:
      "Gain Advantage on Awareness rolls, and once per combat, you may reroll Initiative.",
    maxLevel: "II",
  },
  {
    name: "Quick Hands - Level I",
    level: "I",
    category: "Utility & Tactical",
    description: "Using items costs half Stamina.",
    maxLevel: "I",
  },
  {
    name: "Battle Medic - Level I",
    level: "I",
    category: "Utility & Tactical",
    description: "Healing grants an additional 2d4 HP.",
    maxLevel: "III",
  },
  {
    name: "Battle Medic - Level II",
    level: "II",
    category: "Utility & Tactical",
    description: "Healing grants an additional 2d6 HP.",
    maxLevel: "III",
  },
  {
    name: "Battle Medic - Level III",
    level: "III",
    category: "Utility & Tactical",
    description: "Healing grants an additional 2d8 HP.",
    maxLevel: "III",
  },
  {
    name: "Adrenaline Boost - Level I",
    level: "I",
    category: "Utility & Tactical",
    description: "When below half HP, immediately gain 25 Stamina.",
    maxLevel: "I",
  },
  {
    name: "Improvised Combatant - Level I",
    level: "I",
    category: "Utility & Tactical",
    description:
      "Gain Advantage when using the environment for attacks (throwing objects, knocking down obstacles).",
    maxLevel: "I",
  },
  {
    name: "Rushdown - Level I",
    level: "I",
    category: "Utility & Tactical",
    description: "Gain +5 ATB if you move at least 20 ft before attacking.",
    maxLevel: "II",
  },
  {
    name: "Rushdown - Level II",
    level: "II",
    category: "Utility & Tactical",
    description: "Gain +10 ATB if you move at least 20 ft before attacking.",
    maxLevel: "II",
  },
  {
    name: "Support Specialist - Level I",
    level: "I",
    category: "Utility & Tactical",
    description: "When assisting an ally, they gain +5 ATB.",
    maxLevel: "II",
  },
  {
    name: "Support Specialist - Level II",
    level: "II",
    category: "Utility & Tactical",
    description: "When assisting an ally, they gain +10 ATB.",
    maxLevel: "II",
  },
  {
    name: "Unbreakable Focus - Level I",
    level: "I",
    category: "Utility & Tactical",
    description:
      "Once per encounter, you may reroll a status effect affecting you.",
    maxLevel: "I",
  },
];

// Working copy of talents
let existingTalents = [...defaultTalents];

// Default traits (shortened for brevity; full list can be added back)
const defaultTraits = [
  {
    name: "Grafted Weapon",
    category: "Combat",
    positive: "Cannot be unwillingly disarmed.",
    negative: "Disadvantage on Agility checks.",
  },
  {
    name: "EX-SOLDIER",
    category: "Combat",
    positive: "Advantage on Athletics checks.",
    negative: "Disadvantage on Ingenuity checks.",
  },
  {
    name: "Ancient Echoes",
    category: "Magical",
    positive:
      "You can sense the presence of raw Materia and Lifestream energy within 60 feet, even through barriers (you do not sense refined Materia equipped to others).",
    negative: "Disadvantage on Awareness checks.",
  },
  {
    name: "Imposing Posture",
    category: "Utility",
    positive: "Advantage on all hostile Influence checks.",
    negative: "Disadvantage on all friendly Influence checks.",
  },
  {
    name: "Cybernetic Enhancements",
    category: "Utility",
    positive: "Start each battle with +25 ATB.",
    negative: "Start each battle with -25 Movement.",
  },
  {
    name: "Fractured Mind",
    category: "Utility",
    positive: "Advantage on Awareness checks.",
    negative: "Disadvantage on Willpower checks.",
  },
  {
    name: "Silver Tongue",
    category: "Utility",
    positive: "Advantage on Influence checks.",
    negative: "Disadvantage on Athletics checks.",
  },
  {
    name: "Wandering Spirit",
    category: "Physical",
    positive: "Advantage on Endurance checks.",
    negative: "Resting requires double the time for full benefits.",
  },
  {
    name: "Jenova’s Taint",
    category: "Combat",
    positive: "Once per turn, you can reroll an attack roll.",
    negative:
      "When using the reroll, make a Willpower check (DC 10); if failed, waste stamina without attacking.",
  },
  {
    name: "Glowing Eyes",
    category: "Physical",
    positive:
      "Your vision is enhanced beyond normal limits. You can see clearly in dim light and ignore visual obscurities such as smoke or fog.",
    negative: "Disadvantage on Stealth checks in darkness or shadowed areas.",
  },
  {
    name: "Reactive Reflexes",
    category: "Combat",
    positive: "Advantage on Dodge Rolls.",
    negative:
      "After Dodging, disadvantage on your next Attack (physical or magical).",
  },
  {
    name: "Weakened Flesh",
    category: "Magical",
    positive: "+10 Maximum MP.",
    negative: "-10 Maximum HP.",
  },
];

// Working copy of traits
let existingTraits = [...defaultTraits];

// ### Utility Functions ###
function canWieldItem(item) {
  if (!item || !item.statRequirements || Object.keys(item.statRequirements).length === 0) {
    return true; // No requirements, can wield
  }

  let totalStats = {
    STR: getTotalStat("STR"),
    VIT: getTotalStat("VIT"),
    DEX: getTotalStat("DEX"),
    MAG: getTotalStat("MAG"),
    WIL: getTotalStat("WIL"),
    SPR: getTotalStat("SPR"),
    LCK: getTotalStat("LCK")
  };

  for (let [stat, required] of Object.entries(item.statRequirements)) {
    if (totalStats[stat] < required) {
      return false; // Stat requirement not met
    }
  }
  return true; // All requirements met
}
function showConfirmationModal(message, onConfirm, isError = false) {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");
  createElement("p", message).parent(modalDiv);
  if (isError) {
    createButton("Close")
      .parent(modalDiv)
      .style("margin", "5px")
      .mousePressed(() => modalDiv.remove());
  } else {
    createButton("Confirm")
      .parent(modalDiv)
      .style("margin", "5px")
      .mousePressed(() => {
        onConfirm();
        modalDiv.remove();
      });
    createButton("Cancel")
      .parent(modalDiv)
      .style("margin", "5px")
      .mousePressed(() => modalDiv.remove());
  }
}
function getAvailableCrystals() {
  let equippedCrystals = [];
  for (let slot in equippedItems) {
    let item = equippedItems[slot];
    if (item && item.equippedCrystals) {
      item.equippedCrystals.forEach(crystal => {
        if (crystal) equippedCrystals.push(crystal);
      });
    }
  }
  return inventory.filter(item => item.category === "Materials" && !equippedCrystals.includes(item));
}
function showEditInventoryModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Edit Item").parent(modalDiv);

  let categoryDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Category:")
    .parent(categoryDiv)
    .style("display", "block");
  let categorySelect = createSelect()
    .parent(categoryDiv)
    .style("width", "100%");
  ["Consumables", "Materials", "Miscellaneous"].forEach((cat) =>
    categorySelect.option(cat)
  );
  createSpan("The type of item (for Equipment, use the Equipment tab).")
    .parent(categoryDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let itemDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Select Item:")
    .parent(itemDiv)
    .style("display", "block");
  let itemSelect = createSelect()
    .parent(itemDiv)
    .style("width", "100%");

  let nameDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Name:")
    .parent(nameDiv)
    .style("display", "block");
  let nameInput = createInput("")
    .parent(nameDiv)
    .style("width", "100%");

  let descDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Description:")
    .parent(descDiv)
    .style("display", "block");
  let descriptionInput = createElement("textarea")
    .parent(descDiv)
    .style("width", "100%")
    .style("height", "60px");

  let quantityDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Quantity:")
    .parent(quantityDiv)
    .style("display", "block");
  let quantityInput = createInput("1", "number")
    .parent(quantityDiv)
    .style("width", "100%")
    .attribute("min", "1");

  let qualityDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Quality:")
    .parent(qualityDiv)
    .style("display", "block");
  let qualitySelect = createSelect()
    .parent(qualityDiv)
    .style("width", "100%");
  ["Poor", "Common", "Uncommon", "Rare", "Legendary"].forEach(q => qualitySelect.option(q));

  function updateItemOptions() {
    let selectedCategory = categorySelect.value();
    itemSelect.html("");
    let categoryItems = inventory.filter(item => item.category === selectedCategory);
    if (categoryItems.length > 0) {
      categoryItems.forEach((item, idx) => itemSelect.option(item.name, idx));
      itemSelect.value(categoryItems[0].name);
      loadItemData();
    } else {
      itemSelect.option("No items available");
    }
  }

  function loadItemData() {
    let selectedCategory = categorySelect.value();
    let selectedName = itemSelect.value();
    let itemIdx = inventory.findIndex(item => item.name === selectedName && item.category === selectedCategory);
    if (itemIdx >= 0) {
      let item = inventory[itemIdx];
      nameInput.value(item.name);
      descriptionInput.value(item.description || "");
      quantityInput.value(item.quantity || 1);
      qualitySelect.value(item.quality || "Common");
    }
  }

  categorySelect.changed(updateItemOptions);
  itemSelect.changed(loadItemData);
  updateItemOptions();

  createButton("Save")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let selectedCategory = categorySelect.value();
      let selectedName = itemSelect.value();
      let itemIdx = inventory.findIndex(item => item.name === selectedName && item.category === selectedCategory);
      if (itemIdx >= 0) {
        inventory[itemIdx] = {
          name: nameInput.value(),
          description: descriptionInput.value(),
          category: selectedCategory,
          quantity: parseInt(quantityInput.value()) || 1,
          quality: qualitySelect.value()
        };
        createInventoryUI();
        modalDiv.remove();
      }
    });

  createButton("Cancel")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => modalDiv.remove());
}
function showRemoveInventoryModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Remove Item").parent(modalDiv);

  let categoryDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Category:")
    .parent(categoryDiv)
    .style("display", "block");
  let categorySelect = createSelect()
    .parent(categoryDiv)
    .style("width", "100%");
  inventoryCategories.forEach(cat => categorySelect.option(cat));
  createSpan("Select the item category.")
    .parent(categoryDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let itemDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Select Item:")
    .parent(itemDiv)
    .style("display", "block");
  let itemSelect = createSelect()
    .parent(itemDiv)
    .style("width", "100%");

  function updateItemOptions() {
    let selectedCategory = categorySelect.value();
    itemSelect.html("");
    let categoryItems = inventory.filter(item => item.category === selectedCategory);
    if (categoryItems.length > 0) {
      categoryItems.forEach((item, idx) => itemSelect.option(item.name, idx));
      itemSelect.value(categoryItems[0].name);
    } else {
      itemSelect.option("No items available");
    }
  }

  categorySelect.changed(updateItemOptions);
  updateItemOptions();

  createButton("Remove")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let selectedCategory = categorySelect.value();
      let selectedName = itemSelect.value();
      if (selectedName === "No items available") {
        showConfirmationModal("No item selected to remove.", () => {}, true);
        return;
      }
      let itemIdx = inventory.findIndex(item => item.name === selectedName && item.category === selectedCategory);
      if (itemIdx >= 0) {
        showConfirmationModal(`Are you sure you want to remove ${selectedName}?`, () => {
          inventory.splice(itemIdx, 1);
          updateAvailableEquipment();
          createInventoryUI();
          createEquipmentUI();
          modalDiv.remove();
        });
      }
    });

  createButton("Cancel")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => modalDiv.remove());
}
function showItemDetailsModal(item) {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", item.name).parent(modalDiv);
  createP(item.description || "No description available.").parent(modalDiv);

  createButton("Close")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => modalDiv.remove());
}
function showAddItemModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Add Item").parent(modalDiv);

  let errorMessage = createP("")
    .parent(modalDiv)
    .style("color", "red")
    .style("display", "none")
    .style("margin-bottom", "10px");

  let categoryDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let categoryLabel = createSpan("Category:")
    .parent(categoryDiv)
    .style("display", "block");
  let categorySelect = createSelect()
    .parent(categoryDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  createSpan("The type of item to add (for Equipment, use the Equipment tab).")
    .parent(categoryDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");
  ["Consumables", "Materials", "Miscellaneous"].forEach((cat) => {
    if (availableItems[cat].length > 0) categorySelect.option(cat);
  });

  let itemDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let itemLabel = createSpan("Select Item:")
    .parent(itemDiv)
    .style("display", "block");
  let itemSelect = createSelect()
    .parent(itemDiv)
    .style("width", "100%");
  createSpan("The item to add to your inventory.")
    .parent(itemDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let quantityDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let quantityLabel = createSpan("Quantity:")
    .parent(quantityDiv)
    .style("display", "block");
  let quantityInput = createInput("1", "number")
    .parent(quantityDiv)
    .style("width", "100%")
    .attribute("min", "1");
  createSpan("Number of items to add (1 or more).")
    .parent(quantityDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  function updateItemOptions() {
    let selectedCategory = categorySelect.value();
    itemSelect.html("");
    let categoryItems = availableItems[selectedCategory] || [];
    if (categoryItems.length > 0) {
      categoryItems.forEach((item) => itemSelect.option(item.name));
      itemSelect.value(categoryItems[0].name);
    } else {
      itemSelect.option("No items available");
    }
  }

  categorySelect.changed(updateItemOptions);
  updateItemOptions();

  createButton("Add")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let selectedCategory = categorySelect.value();
      let selectedName = itemSelect.value();
      let quantity = parseInt(quantityInput.value()) || 1;
      if (selectedName === "No items available" || quantity < 1) {
        errorMessage.html("Please select a valid item and quantity.");
        errorMessage.style("display", "block");
        return;
      }
      let itemTemplate = availableItems[selectedCategory].find((i) => i.name === selectedName);
      if (itemTemplate) {
        if (inventory.some(i => i.name === selectedName && i.category === selectedCategory)) {
          errorMessage.html(`An item with the name "${selectedName}" already exists in the "${selectedCategory}" category.`);
          errorMessage.style("display", "block");
          return;
        }
        let newItem = { ...itemTemplate, quantity: quantity };
        inventory.push(newItem);
        localStorage.setItem('inventory', JSON.stringify(inventory)); // Persist to localStorage
        updateAvailableEquipment();
        createInventoryUI();
        createEquipmentUI();
        modalDiv.remove();
        errorMessage.style("display", "none"); // Clear error on success
      }
    });

  createButton("Cancel")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      modalDiv.remove();
      errorMessage.style("display", "none"); // Clear error on cancel
    });
}
function showEquipmentDescription(slot, item, allowCrystalEquip = false) {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("max-width", "400px")
    .style("word-wrap", "break-word");

  if (!allowCrystalEquip) {
    // Display equipment details (unchanged behavior)
    createElement("h3", `${slot}: ${item ? item.name : "None"}`).parent(modalDiv);
    if (item) {
      let details = item.description ? `${item.description}<br>` : "No description provided.<br>";
      if (item.statRequirements && Object.keys(item.statRequirements).length > 0) {
        let reqs = Object.entries(item.statRequirements)
          .map(([stat, value]) => `${value} ${stat}`)
          .join(" & ");
        details += `Requirements: ${reqs}<br>`;
      }
      if (item.damageDice) {
        let modifierText = item.modifier && item.modifier !== 0 ? (item.modifier > 0 ? `+${item.modifier}` : item.modifier) : "";
        details += `Damage: ${item.damageDice}${modifierText}<br>`;
      } else if (item.defense) {
        details += `Defense: ${item.defense}${item.modifier && item.modifier !== 0 ? (item.modifier > 0 ? ` +${item.modifier}` : ` ${item.modifier}`) : ""}<br>`;
      } else if (item.modifier && item.modifier !== 0) {
        details += `Modifier: ${item.modifier > 0 ? `+${item.modifier}` : item.modifier}<br>`;
      }
      createP(details).parent(modalDiv);
    } else {
      createP("No description available.").parent(modalDiv);
    }
  } else {
    // Display crystal management (updated behavior)
    createElement("h3", `${slot}: Essence Crystal Slots`).parent(modalDiv);

    // Add inline error message
    let errorMessage = createP("")
      .parent(modalDiv)
      .style("color", "red")
      .style("display", "none")
      .style("margin-bottom", "10px");

    // Create a div for crystal descriptions that we can update dynamically
    let crystalDescriptions = createDiv().parent(modalDiv).style("margin-bottom", "10px");

    // Helper function to update crystal descriptions
    function updateCrystalDescriptions() {
      crystalDescriptions.html(""); // Clear existing content
      let hasCrystals = item.equippedCrystals.some(crystal => crystal !== null);
      if (!hasCrystals) {
        createSpan("No crystals equipped.").parent(crystalDescriptions);
      } else {
        item.equippedCrystals.forEach((crystal, idx) => {
          if (crystal) {
            let desc = `Slot ${idx + 1}: ${crystal.name}<br>`;
            desc += `${crystal.description || "No description provided."}<br>`;
            if (crystal.statBonuses && Object.keys(crystal.statBonuses).length > 0) {
              let bonuses = Object.entries(crystal.statBonuses)
                .map(([stat, value]) => `${value > 0 ? "+" : ""}${value} ${stat}`)
                .join(", ");
              desc += `Bonuses: ${bonuses}<br>`;
            }
            if (crystal.statRequirements && Object.keys(crystal.statRequirements).length > 0) {
              let reqs = Object.entries(crystal.statRequirements)
                .map(([stat, value]) => `${value} ${stat}`)
                .join(" & ");
              desc += `Requirements: ${reqs}<br>`;
            }
            if (crystal.abilities && crystal.abilities.length > 0) {
              desc += `Abilities: ${crystal.abilities.join(", ")}<br>`;
            }
            createP(desc)
              .parent(crystalDescriptions)
              .style("font-weight", "bold")
              .style("margin-bottom", "5px");
          }
        });
      }
    }

    // Initial display of crystal descriptions
    if (item.crystalSlots > 0) {
      // Ensure equippedCrystals array matches the number of crystal slots
      if (!item.equippedCrystals || item.equippedCrystals.length !== item.crystalSlots) {
        item.equippedCrystals = Array(item.crystalSlots).fill(null);
      }

      updateCrystalDescriptions(); // Initial render

      // Function to recalculate crystal usage
      function updateCrystalUsageCount() {
        let count = {};
        for (let otherSlot in equippedItems) {
          let otherItem = equippedItems[otherSlot];
          if (otherItem && otherItem.equippedCrystals) {
            otherItem.equippedCrystals.forEach(crystal => {
              if (crystal) {
                count[crystal.name] = (count[crystal.name] || 0) + 1;
              }
            });
          }
        }
        return count;
      }

      let crystalSelects = [];
      for (let i = 0; i < item.crystalSlots; i++) {
        let slotDiv = createDiv().parent(modalDiv).style("margin", "5px");
        createSpan(`Slot ${i + 1}: `).parent(slotDiv);
        let crystalSelect = createSelect().parent(slotDiv).style("width", "150px");
        crystalSelects.push(crystalSelect);
        crystalSelect.option("None");

        let allCrystals = inventory.filter(item => item.category === "Materials");
        let crystalUsageCount = updateCrystalUsageCount();
        allCrystals.forEach(crystal => {
          let equippedCount = crystalUsageCount[crystal.name] || 0;
          let totalQuantity = crystal.quantity || 1;
          let availableQuantity = totalQuantity - equippedCount;
          if (availableQuantity > 0 || (item.equippedCrystals[i] && item.equippedCrystals[i].name === crystal.name)) {
            let optionText = equippedCount > 0 ? `${crystal.name} (Equipped ${equippedCount}/${totalQuantity})` : crystal.name;
            crystalSelect.option(optionText, crystal.name);
          }
        });

        let currentCrystal = item.equippedCrystals[i];
        crystalSelect.value(currentCrystal ? currentCrystal.name : "None");
        crystalSelect.changed(function() {
          let selectedName = this.value();
          if (selectedName === "None") {
            item.equippedCrystals[i] = null;
          } else {
            let crystal = inventory.find(item => item.name === selectedName && item.category === "Materials");
            if (crystal) {
              let crystalUsageCount = updateCrystalUsageCount();
              let equippedCount = crystalUsageCount[crystal.name] || 0;
              let totalQuantity = crystal.quantity || 1;
              let availableQuantity = totalQuantity - equippedCount;
              if (availableQuantity <= 0 && !(currentCrystal && currentCrystal.name === crystal.name)) {
                errorMessage.html(`Cannot equip ${crystal.name}: no more available (already equipped ${equippedCount}/${totalQuantity}).`);
                errorMessage.style("display", "block");
                crystalSelect.value(currentCrystal ? currentCrystal.name : "None");
                return;
              }
              if (!canWieldItem(crystal)) {
                let totalStats = {
                  STR: getTotalStat("STR"), VIT: getTotalStat("VIT"), DEX: getTotalStat("DEX"),
                  MAG: getTotalStat("MAG"), WIL: getTotalStat("WIL"), SPR: getTotalStat("SPR"),
                  LCK: getTotalStat("LCK")
                };
                let missing = Object.entries(crystal.statRequirements || {})
                  .filter(([stat, req]) => totalStats[stat] < req)
                  .map(([stat, req]) => `${stat}: ${totalStats[stat]}/${req}`)
                  .join(", ");
                errorMessage.html(`Cannot equip ${selectedName}: ${missing}`);
                errorMessage.style("display", "block");
                crystalSelect.value(currentCrystal ? currentCrystal.name : "None");
                return;
              }
              item.equippedCrystals[i] = crystal;
            }
          }

          // Update all dropdowns after a change
          let crystalUsageCount = updateCrystalUsageCount();
          crystalSelects.forEach((select, index) => {
            let currentValue = select.value();
            select.html("");
            select.option("None");
            allCrystals.forEach(crystal => {
              let equippedCount = crystalUsageCount[crystal.name] || 0;
              let totalQuantity = crystal.quantity || 1;
              let availableQuantity = totalQuantity - equippedCount;
              if (availableQuantity > 0 || (item.equippedCrystals[index] && item.equippedCrystals[index].name === crystal.name)) {
                let optionText = equippedCount > 0 ? `${crystal.name} (Equipped ${equippedCount}/${totalQuantity})` : crystal.name;
                select.option(optionText, crystal.name);
              }
            });
            select.value(currentValue);
          });

          // Update crystal descriptions dynamically
          updateCrystalDescriptions();

          // Clear error message on successful change
          errorMessage.style("display", "none");
          updateStatBonusesDisplay();
          updateResourcesBasedOnStats();
          updateAbilities();
          createEquipmentUI();
        });
      }
    } else {
      createP("No crystal slots available.").parent(modalDiv);
    }
  }

  createButton("Close")
    .parent(modalDiv)
    .style("margin-top", "10px")
    .mousePressed(() => modalDiv.remove());
}
function showAddEditEquipmentModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Modify Equipment").parent(modalDiv); // Updated title

  // Add inline error message at the top
  let errorMessage = createP("")
    .parent(modalDiv)
    .style("color", "red")
    .style("display", "none")
    .style("margin-bottom", "10px");

  let typeDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Type:").parent(typeDiv).style("display", "block");
  let typeSelect = createSelect().parent(typeDiv).style("width", "100%");
  Object.keys(availableEquipment).forEach(slot => typeSelect.option(slot));
  createSpan("Equipment slot (e.g., On-Hand for weapons).")
    .parent(typeDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let equipmentDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Equipment:").parent(equipmentDiv).style("display", "block");
  let equipmentSelect = createSelect().parent(equipmentDiv).style("width", "100%");
  createSpan("Item to modify from inventory (select 'None' to add new).")
    .parent(equipmentDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let nameDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Name:").parent(nameDiv).style("display", "block");
  let nameInput = createInput("").parent(nameDiv).style("width", "100%");
  createSpan("The equipment's unique name (e.g., Buster Sword).")
    .parent(nameDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let descriptionDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Description:").parent(descriptionDiv).style("display", "block");
  let descriptionInput = createElement("textarea")
    .parent(descriptionDiv)
    .style("width", "100%")
    .style("height", "60px");
  createSpan("Describe the equipment or its lore.")
    .parent(descriptionDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let penaltyDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px").style("display", "none");
  createSpan("Mov. Penalty:").parent(penaltyDiv).style("display", "block");
  let penaltySelect = createSelect().parent(penaltyDiv).style("width", "100%");
  [0, -5, -10, -15, -20].forEach(val => penaltySelect.option(val));
  createSpan("Movement penalty in feet (for armor).")
    .parent(penaltyDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let slotsDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Crystal Slots:").parent(slotsDiv).style("display", "block");
  let slotsSelect = createSelect().parent(slotsDiv).style("width", "100%");
  [0, 1, 2, 3, 4].forEach(val => slotsSelect.option(val));
  createSpan("Number of slots for Essence Crystals (0-4).")
    .parent(slotsDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let linkedStatDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px").style("display", "none");
  createSpan("Linked Stat:").parent(linkedStatDiv).style("display", "block");
  let linkedStatSelect = createSelect().parent(linkedStatDiv).style("width", "100%");
  linkedStatSelect.option("STR");
  linkedStatSelect.option("MAG");
  createSpan("Stat used for weapon attacks (STR or MAG).")
    .parent(linkedStatDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let statBonusDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Stat Bonus:").parent(statBonusDiv).style("display", "block");
  let statBonusAmountInput = createInput("0", "number")
    .parent(statBonusDiv)
    .style("width", "50px")
    .style("margin-right", "5px");
  let statBonusStatSelect = createSelect()
    .parent(statBonusDiv)
    .style("width", "100px");
  ["None", "STR", "DEX", "VIT", "MAG", "WIL", "SPR", "LCK"].forEach(stat => statBonusStatSelect.option(stat));
  createSpan("Stat to boost (e.g., STR) and amount.")
    .parent(statBonusDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let statReqDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Stat Requirements (Optional):").parent(statReqDiv).style("display", "block");
  let statReq1Div = createDiv().parent(statReqDiv).style("margin-bottom", "5px");
  let statReq1Select = createSelect().parent(statReq1Div).style("width", "80px").style("margin-right", "5px");
  ["None", "STR", "DEX", "VIT", "MAG", "WIL", "SPR", "LCK"].forEach(stat => statReq1Select.option(stat));
  let statReq1Input = createInput("", "number").parent(statReq1Div).style("width", "50px");
  let statReq2Div = createDiv().parent(statReqDiv);
  let statReq2Select = createSelect().parent(statReq2Div).style("width", "80px").style("margin-right", "5px");
  ["None", "STR", "DEX", "VIT", "MAG", "WIL", "SPR", "LCK"].forEach(stat => statReq2Select.option(stat));
  let statReq2Input = createInput("", "number").parent(statReq2Div).style("width", "50px");
  createSpan("Minimum stats needed to equip (e.g., 5 STR).")
    .parent(statReqDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let damageDiceDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px").style("display", "none");
  createSpan("Damage Dice + Modifier (Weapons):").parent(damageDiceDiv).style("display", "block");
  let damageDiceInput = createInput("", "text").parent(damageDiceDiv).style("width", "80px").style("margin-right", "5px");
  let weaponModifierInput = createInput("0", "number").parent(damageDiceDiv).style("width", "50px");
  createSpan("Weapon damage (e.g., 1d8) and modifier (e.g., +2).")
    .parent(damageDiceDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let defenseDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px").style("display", "none");
  createSpan("Defense + Modifier (Armor):").parent(defenseDiv).style("display", "block");
  let defenseInput = createInput("0", "number").parent(defenseDiv).style("width", "50px").style("margin-right", "5px");
  let armorModifierInput = createInput("0", "number").parent(defenseDiv).style("width", "50px");
  createSpan("Armor defense value and modifier (e.g., 10 + 2).")
    .parent(defenseDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  function updateTypeVisibility() {
    let type = typeSelect.value();
    penaltyDiv.style("display", ["Chest", "Helm", "Gloves", "Greaves"].includes(type) ? "block" : "none");
    linkedStatDiv.style("display", ["On-Hand", "Off-Hand"].includes(type) ? "block" : "none");
    damageDiceDiv.style("display", ["On-Hand", "Off-Hand"].includes(type) ? "block" : "none");
    defenseDiv.style("display", ["Chest", "Helm", "Gloves", "Greaves"].includes(type) ? "block" : "none");
  }

  function loadEquipmentData() {
    let type = typeSelect.value();
    let equipmentList = availableEquipment[type] || [];
    let selectedName = equipmentSelect.value();

    if (selectedName === "No items available" || !equipmentList.length) {
      nameInput.value("");
      descriptionInput.value("");
      penaltySelect.value(0);
      slotsSelect.value(0);
      linkedStatSelect.value("STR");
      statBonusStatSelect.value("None");
      statBonusAmountInput.value(0);
      statReq1Select.value("None");
      statReq1Input.value("");
      statReq2Select.value("None");
      statReq2Input.value("");
      damageDiceInput.value("");
      defenseInput.value(0);
      weaponModifierInput.value(0);
      armorModifierInput.value(0);
      updateTypeVisibility();
      return;
    }

    let item = equipmentList.find(i => i.name === selectedName);
    if (item) {
      nameInput.value(item.name || "");
      descriptionInput.value(item.description || "");
      penaltySelect.value(item.movementPenalty !== undefined ? item.movementPenalty : 0);
      slotsSelect.value(item.crystalSlots !== undefined ? item.crystalSlots : 0);
      linkedStatSelect.value(item.linkedStat || "STR");
      statBonusStatSelect.value(item.statBonus ? item.statBonus.stat : "None");
      statBonusAmountInput.value(item.statBonus ? item.statBonus.amount : 0);
      
      let reqKeys = item.statRequirements ? Object.keys(item.statRequirements) : [];
      statReq1Select.value(reqKeys[0] || "None");
      statReq1Input.value(reqKeys[0] && item.statRequirements[reqKeys[0]] ? item.statRequirements[reqKeys[0]] : "");
      statReq2Select.value(reqKeys[1] || "None");
      statReq2Input.value(reqKeys[1] && item.statRequirements[reqKeys[1]] ? item.statRequirements[reqKeys[1]] : "");
      
      damageDiceInput.value(item.damageDice || "");
      defenseInput.value(item.defense !== undefined ? item.defense : 0);
      weaponModifierInput.value(item.modifier !== undefined ? item.modifier : 0);
      armorModifierInput.value(item.modifier !== undefined ? item.modifier : 0);
    }
    updateTypeVisibility();
  }

  function updateEquipmentOptions() {
    let type = typeSelect.value();
    let equipmentList = availableEquipment[type] || [];
    equipmentSelect.html("");
    equipmentSelect.option("No items available"); // Default option
    if (equipmentList.length > 0) {
      equipmentList.forEach((item) => equipmentSelect.option(item.name));
      equipmentSelect.value(equipmentList[0].name); // Select the first item if available
    } else {
      equipmentSelect.value("No items available");
    }
    console.log("equipmentSelect populated with:", equipmentSelect.elt.options);
  }

  typeSelect.changed(() => {
    updateEquipmentOptions();
    loadEquipmentData();
  });

  updateAvailableEquipment();
  console.log("availableEquipment:", availableEquipment);
  updateEquipmentOptions();
  loadEquipmentData();

  equipmentSelect.changed(() => {
    console.log("equipmentSelect changed to:", equipmentSelect.value());
    loadEquipmentData();
  });

  createButton("Add")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let type = typeSelect.value();
      let statReq1 = statReq1Select.value();
      let statReq2 = statReq2Select.value();
      let newEquipment = {
        name: nameInput.value().trim(),
        type: type,
        description: descriptionInput.value().trim(),
        category: "Equipment",
        crystalSlots: parseInt(slotsSelect.value()),
        statBonus: statBonusStatSelect.value() !== "None" ? { stat: statBonusStatSelect.value(), amount: parseInt(statBonusAmountInput.value()) || 0 } : null,
        statRequirements: {},
        movementPenalty: (type === "Chest" || type === "Helm" || type === "Gloves" || type === "Greaves") ? parseInt(penaltySelect.value()) : undefined,
        linkedStat: (type === "On-Hand" || type === "Off-Hand") ? linkedStatSelect.value() : undefined,
        damageDice: (type === "On-Hand" || type === "Off-Hand") ? damageDiceInput.value().trim() || undefined : undefined,
        defense: (type === "Chest" || type === "Helm" || type === "Gloves" || type === "Greaves") ? parseInt(defenseInput.value()) || 0 : undefined,
        modifier: (type === "On-Hand" || type === "Off-Hand") ? parseInt(weaponModifierInput.value()) || 0 : parseInt(armorModifierInput.value()) || 0,
        quantity: 1,
        quality: "Common"
      };
      if (statReq1 !== "None" && statReq1Input.value()) newEquipment.statRequirements[statReq1] = parseInt(statReq1Input.value());
      if (statReq2 !== "None" && statReq2Input.value()) newEquipment.statRequirements[statReq2] = parseInt(statReq2Input.value());

      if (!newEquipment.name) {
        errorMessage.html("Please provide a name for the equipment.");
        errorMessage.style("display", "block");
        return;
      }

      if (inventory.some(item => item.name === newEquipment.name)) {
        errorMessage.html(`An item with the name "${newEquipment.name}" already exists. Please choose a different name.`);
        errorMessage.style("display", "block");
        return;
      }

      inventory.push(newEquipment);
      localStorage.setItem('inventory', JSON.stringify(inventory)); // Persist to localStorage
      updateAvailableEquipment();
      createEquipmentUI();
      createInventoryUI();
      modalDiv.remove();
      errorMessage.style("display", "none");
    });

  createButton("Save")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let type = typeSelect.value();
      let selectedName = equipmentSelect.value();
      if (selectedName === "No items available") {
        errorMessage.html("No equipment selected to edit.");
        errorMessage.style("display", "block");
        return;
      }
      let itemIdx = inventory.findIndex(item => item.name === selectedName && item.type === type);
      if (itemIdx >= 0) {
        let oldItem = inventory[itemIdx];
        let newName = nameInput.value().trim();
        // Check for duplicate name (exclude the current item)
        if (newName !== oldItem.name && inventory.some(item => item.name === newName && item !== oldItem)) {
          errorMessage.html(`An item with the name "${newName}" already exists. Please choose a different name.`);
          errorMessage.style("display", "block");
          return;
        }

        let statReq1 = statReq1Select.value();
        let statReq2 = statReq2Select.value();
        let updatedItem = {
          name: newName,
          type: type,
          description: descriptionInput.value().trim(),
          category: "Equipment",
          crystalSlots: parseInt(slotsSelect.value()),
          statBonus: statBonusStatSelect.value() !== "None" ? { stat: statBonusStatSelect.value(), amount: parseInt(statBonusAmountInput.value()) || 0 } : null,
          statRequirements: {},
          movementPenalty: (type === "Chest" || type === "Helm" || type === "Gloves" || type === "Greaves") ? parseInt(penaltySelect.value()) : undefined,
          linkedStat: (type === "On-Hand" || type === "Off-Hand") ? linkedStatSelect.value() : undefined,
          damageDice: (type === "On-Hand" || type === "Off-Hand") ? damageDiceInput.value().trim() || undefined : undefined,
          defense: (type === "Chest" || type === "Helm" || type === "Gloves" || type === "Greaves") ? parseInt(defenseInput.value()) || 0 : undefined,
          modifier: (type === "On-Hand" || type === "Off-Hand") ? parseInt(weaponModifierInput.value()) || 0 : parseInt(armorModifierInput.value()) || 0,
          quantity: oldItem.quantity || 1,
          quality: oldItem.quality || "Common"
        };
        if (statReq1 !== "None" && statReq1Input.value()) updatedItem.statRequirements[statReq1] = parseInt(statReq1Input.value());
        if (statReq2 !== "None" && statReq2Input.value()) updatedItem.statRequirements[statReq2] = parseInt(statReq2Input.value());
        inventory[itemIdx] = updatedItem;

        for (let slot in equippedItems) {
          if (equippedItems[slot] && equippedItems[slot].name === oldItem.name) {
            equippedItems[slot] = { ...updatedItem, equippedCrystals: equippedItems[slot].equippedCrystals };
          }
        }

        localStorage.setItem('inventory', JSON.stringify(inventory)); // Persist to localStorage
        updateAvailableEquipment();
        updateStatBonusesDisplay();
        updateResourcesBasedOnStats();
        updateAbilities();
        createEquipmentUI();
        createInventoryUI();
        modalDiv.remove();
        errorMessage.style("display", "none");
      }
    });

  createButton("Remove")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let type = typeSelect.value();
      let selectedName = equipmentSelect.value();
      if (selectedName === "No items available") {
        errorMessage.html("No equipment selected to remove.");
        errorMessage.style("display", "block");
        return;
      }
      let itemIdx = inventory.findIndex(item => item.name === selectedName && item.type === type);
      if (itemIdx >= 0) {
        showConfirmationModal(`Are you sure you want to remove "${selectedName}"?`, () => {
          // Unequip the item if it's equipped
          for (let slot in equippedItems) {
            if (equippedItems[slot] && equippedItems[slot].name === selectedName) {
              equippedItems[slot] = null;
            }
          }
          inventory.splice(itemIdx, 1);
          localStorage.setItem('inventory', JSON.stringify(inventory)); // Update localStorage
          updateAvailableEquipment();
          updateAbilities();
          createEquipmentUI();
          createInventoryUI();
          modalDiv.remove();
          errorMessage.style("display", "none");
        });
      } else {
        errorMessage.html("Selected equipment not found in inventory.");
        errorMessage.style("display", "block");
      }
    });

  createButton("Close")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      modalDiv.remove();
      errorMessage.style("display", "none");
    });
}
// ### p5.js Setup and Draw ###

function setup() {
  let resourceBarsContainer = select("#resource-bars");
  if (!resourceBarsContainer) {
    console.error("No #resource-bars div found in HTML!");
    return;
  }
  let resourceControlsContainer = select("#resource-controls");
  if (!resourceControlsContainer) {
    console.error("No #resource-controls div found in HTML!");
    return;
  }
  let containerWidth = resourceBarsContainer.elt.clientWidth;
  let canvasWidth = min(containerWidth, 600);
  let canvasHeight = 150;
  cnv = createCanvas(canvasWidth, canvasHeight);
  cnv.parent(resourceBarsContainer);
  textFont("Arial");
  textSize(16);
  textAlign(LEFT, TOP);

  resourceUIContainer = createDiv()
    .parent(resourceControlsContainer)
    .id("resourceUIContainer");
  skillsContainer = createDiv().id("skillsContainer");

  // Initialize all UI components
createResourceUI();
  createStatsUI();
  createTalentsUI();
  createTraitsUI();
  updateAvailableEquipment(); // Moved up to sync availableEquipment first
  createEquipmentUI();        // Now uses the populated availableEquipment
  createInventoryUI();        // Keep this last if it depends on equipment

  // Tab functionality
  const tablinks = document.querySelectorAll(".tablink");
  const tabcontents = document.querySelectorAll(".tabcontent");
  tablinks.forEach((btn) => {
    btn.addEventListener("click", () => {
      // Hide all tabs and remove active class
      tablinks.forEach((b) => b.classList.remove("active"));
      tabcontents.forEach((tc) => {
        tc.classList.remove("active");
        tc.style.display = "none"; // Ensure CSS display is toggled
      });

      // Show the clicked tab
      btn.classList.add("active");
      const tabId = btn.getAttribute("data-tab");
      const activeTab = document.getElementById(tabId);
      activeTab.classList.add("active");
      activeTab.style.display = "block";

      // Refresh UI based on tab
      if (tabId === "inventory") {
        console.log("Switching to Inventory tab");
        createInventoryUI(); // Refresh inventory UI
      } else if (tabId === "resources") {
        redrawResourceBars(); // Redraw resource bars if needed
      }
    });
  });

  // Simulate click on the default active tab (Resources)
  document.querySelector(".tablink.active").click();
}

function windowResized() {
  let resourceBarsContainer = select("#resource-bars");
  let containerWidth = resourceBarsContainer.elt.clientWidth;
  let canvasWidth = min(containerWidth, 600);
  resizeCanvas(canvasWidth, 150);
}

function draw() {
  background(255);
  displayBars();
}

function displayBars() {
  let bar_width = width * 0.6;
  let bar_height = 20;
  let x = width * 0.1;
  let y_hp = 25,
    y_mp = 55,
    y_stamina = 85,
    y_atb = 115;

  stroke(0);
  fill(128);
  rect(x, y_hp, bar_width, bar_height);
  noStroke();
  fill(255, 0, 0);
  let hp_width = (current_hp / max_hp) * bar_width;
  rect(x, y_hp, hp_width, bar_height);
  textAlign(CENTER, CENTER);
  textStyle(BOLD);
  fill(255);
  textSize(16);
  text(`HP: ${current_hp}/${max_hp}`, x + bar_width / 2, y_hp + bar_height / 2);

  stroke(0);
  fill(128);
  rect(x, y_mp, bar_width, bar_height);
  noStroke();
  fill(128, 0, 128);
  let mp_width = (current_mp / max_mp) * bar_width;
  rect(x, y_mp, mp_width, bar_height);
  fill(255);
  text(`MP: ${current_mp}/${max_mp}`, x + bar_width / 2, y_mp + bar_height / 2);

  stroke(0);
  fill(128);
  rect(x, y_stamina, bar_width, bar_height);
  noStroke();
  fill(0, 150, 0);
  let stamina_width = (current_stamina / max_stamina) * bar_width;
  rect(x, y_stamina, stamina_width, bar_height);
  fill(255);
  text(
    `STMN: ${current_stamina}/${max_stamina}`,
    x + bar_width / 2,
    y_stamina + bar_height / 2
  );

  stroke(0);
  fill(128);
  rect(x, y_atb, bar_width, bar_height);
  noStroke();
  fill(0, 0, 255);
  let atb_width = (current_atb / max_atb) * bar_width;
  rect(x, y_atb, atb_width, bar_height);
  fill(255);
  text(
    `ATB: ${current_atb}/${max_atb}`,
    x + bar_width / 2,
    y_atb + bar_height / 2
  );
}

// ### Resource UI ###

function createResourceUI() {
  let rUI = resourceUIContainer;
  rUI.html("");

  let hpRow = createDiv().parent(rUI).class("resource-row");
  createSpan("HP:").parent(hpRow);
  maxHpInput = createInput(max_hp.toString(), "number")
    .parent(hpRow)
    .class("resource-input");
  setMaxHpButton = createButton("Set Max")
    .parent(hpRow)
    .class("resource-button")
    .mousePressed(setMaxHp);
  hpPlus = createButton("+10")
    .parent(hpRow)
    .class("resource-button small-button")
    .mousePressed(() => {
      current_hp = min(current_hp + 10, max_hp);
    });
  hpMinus = createButton("-10")
    .parent(hpRow)
    .class("resource-button small-button")
    .mousePressed(() => {
      current_hp = max(current_hp - 10, 0);
    });

  let mpRow = createDiv().parent(rUI).class("resource-row");
  createSpan("MP:").parent(mpRow);
  maxMpInput = createInput(max_mp.toString(), "number")
    .parent(mpRow)
    .class("resource-input");
  setMaxMpButton = createButton("Set Max")
    .parent(mpRow)
    .class("resource-button")
    .mousePressed(setMaxMp);
  mpPlus = createButton("+5")
    .parent(mpRow)
    .class("resource-button small-button")
    .mousePressed(() => {
      current_mp = min(current_mp + 5, max_mp);
    });
  mpMinus = createButton("-5")
    .parent(mpRow)
    .class("resource-button small-button")
    .mousePressed(() => {
      current_mp = max(current_mp - 5, 0);
    });

  let staminaRow = createDiv().parent(rUI).class("resource-row");
  createSpan("STMN:").parent(staminaRow);
  maxStaminaInput = createInput(max_stamina.toString(), "number")
    .parent(staminaRow)
    .class("resource-input");
  setMaxStaminaButton = createButton("Set Max")
    .parent(staminaRow)
    .class("resource-button")
    .mousePressed(setMaxStamina);
  staminaPlus = createButton("+25")
    .parent(staminaRow)
    .class("resource-button small-button")
    .mousePressed(() => {
      current_stamina = min(current_stamina + 25, max_stamina);
    });
  staminaMinus = createButton("-25")
    .parent(staminaRow)
    .class("resource-button small-button")
    .mousePressed(() => {
      current_stamina = max(current_stamina - 25, 0);
      if (staminaAtbLink) {
        current_atb = min(current_atb + 25, max_atb);
      }
    });

  let atbRow = createDiv().parent(rUI).class("resource-row");
  createSpan("ATB:").parent(atbRow);
  maxAtbInput = createInput(max_atb.toString(), "number")
    .parent(atbRow)
    .class("resource-input");
  setMaxAtbButton = createButton("Set Max")
    .parent(atbRow)
    .class("resource-button")
    .mousePressed(setMaxAtb);
  atbPlus = createButton("+25")
    .parent(atbRow)
    .class("resource-button small-button")
    .mousePressed(() => {
      current_atb = min(current_atb + 25, max_atb);
    });
  atbMinus = createButton("-50")
    .parent(atbRow)
    .class("resource-button small-button")
    .mousePressed(() => {
      current_atb = max(current_atb - 50, 0);
    });

  let adjustmentRow = createDiv().parent(rUI).class("resource-row");
  createSpan("Adjust: ").parent(adjustmentRow);
  let adjustmentInput = createInput("", "number")
    .parent(adjustmentRow)
    .class("resource-input")
    .style("width", "50px");
  let resourceSelect = createSelect()
    .parent(adjustmentRow)
    .style("margin-left", "5px");
  resourceSelect.option("HP");
  resourceSelect.option("MP");
  resourceSelect.option("STMN");
  resourceSelect.option("ATB");
  createButton("+")
    .parent(adjustmentRow)
    .class("resource-button small-button")
    .style("margin-left", "5px")
    .mousePressed(() =>
      adjustResource(
        resourceSelect.value(),
        parseInt(adjustmentInput.value()),
        true
      )
    );
  createButton("-")
    .parent(adjustmentRow)
    .class("resource-button small-button")
    .style("margin-left", "5px")
    .mousePressed(() =>
      adjustResource(
        resourceSelect.value(),
        parseInt(adjustmentInput.value()),
        false
      )
    );

  let linkRow = createDiv().parent(rUI).class("resource-row");
  staminaAtbLinkButton = createButton(staminaAtbLink ? "Link: ON" : "Link: OFF")
    .parent(linkRow)
    .class("resource-button")
    .mousePressed(toggleStaminaAtbLink)
    .style("background-color", staminaAtbLink ? "green" : "red");
  createSpan("When ON, using STMN adds to ATB").parent(linkRow);

  let resetRow = createDiv().parent(rUI).class("resource-row");
  resetButton = createButton("Reset All")
    .parent(resetRow)
    .class("resource-button")
    .mousePressed(resetResources);
}

function adjustResource(resource, value, isAddition) {
  if (isNaN(value)) {
    showConfirmationModal("Please enter a valid number.", () => {}, true);
    return;
  }
  let adjustment = isAddition ? value : -value;
  switch (resource) {
    case "HP":
      current_hp = constrain(current_hp + adjustment, 0, max_hp);
      break;
    case "MP":
      current_mp = constrain(current_mp + adjustment, 0, max_mp);
      break;
    case "STMN":
      current_stamina = constrain(current_stamina + adjustment, 0, max_stamina);
      if (!isAddition && staminaAtbLink) {
        current_atb = min(current_atb + value, max_atb);
      }
      break;
    case "ATB":
      current_atb = constrain(current_atb + adjustment, 0, max_atb);
      break;
  }
}

function setMaxHp() {
  let value = parseInt(maxHpInput.value());
  if (!isNaN(value) && value > 0) {
    max_hp = value;
    current_hp = min(current_hp, value);
  }
}

function setMaxMp() {
  let value = parseInt(maxMpInput.value());
  if (!isNaN(value) && value > 0) {
    max_mp = value;
    current_mp = min(current_mp, value);
  }
}

function setMaxStamina() {
  let value = parseInt(maxStaminaInput.value());
  if (!isNaN(value) && value > 0) {
    max_stamina = value;
    current_stamina = min(current_stamina, value);
  }
}

function setMaxAtb() {
  let value = parseInt(maxAtbInput.value());
  if (!isNaN(value) && value > 0) {
    max_atb = value;
    current_atb = min(current_atb, value);
  }
}

function resetResources() {
  current_hp = max_hp;
  current_mp = max_mp;
  current_stamina = max_stamina;
  current_atb = 0;
}

function toggleStaminaAtbLink() {
  staminaAtbLink = !staminaAtbLink;
  staminaAtbLinkButton.html(staminaAtbLink ? "Link: ON" : "Link: OFF");
  staminaAtbLinkButton.style(
    "background-color",
    staminaAtbLink ? "green" : "red"
  );
}

// Function to redraw the resource bars
function redrawResourceBars() {
  // Replace this with your actual code to draw the bars
  displayBars(); // Assuming this is your function to render the bars
}
// ### Stats UI ###

function createStatsUI() {
  let statsContainer = select("#stats");
  if (!statsContainer) {
    console.error("No #stats div found in HTML!");
    return;
  }
  statsContainer.html("");

  createElement("h2", "Stats").parent(statsContainer);
  let statsDesc = createP("Stats determine your character’s core abilities. Click a stat name for details.").parent(statsContainer);
  statsDesc.style("font-size", "12px").style("color", "#666").style("margin-top", "5px").style("margin-bottom", "10px");

  createStatInput("Level", "Level", level, statsContainer, "Level", false);
  createStatInput("EXP", "EXP", exp, statsContainer, "EXP", false);

  let movementDiv = createDiv().parent(statsContainer).style("margin", "5px");
  let movementLabel = createSpan("Movement: ").parent(movementDiv).style("cursor", "pointer");
  movementLabel.mouseClicked(() => showStatDescription("Movement", statDescriptions["Movement"] || "No description available."));
  statLabelElements["Movement"] = movementLabel;
  let movementInput = createInput(movement + " ft", "text").parent(movementDiv).style("width", "50px").attribute("readonly", "true").style("background-color", "#e0e0e0").id("movementInput");

  createStatInput("STR", "Strength", stat_str, statsContainer, "STR", true);
  createStatInput("VIT", "Vitality", stat_vit, statsContainer, "VIT", true);
  createStatInput("DEX", "Dexterity", stat_dex, statsContainer, "DEX", true);
  createStatInput("MAG", "Magic", stat_mag, statsContainer, "MAG", true);
  createStatInput("WIL", "Willpower", stat_wil, statsContainer, "WIL", true);
  createStatInput("SPR", "Spirit", stat_spr, statsContainer, "SPR", true);
  createStatInput("LCK", "Luck", stat_lck, statsContainer, "LCK", true, true);

  createAdditionalAttributesUI();
}

function createStatInput(abbrev, name, initialValue, container, statName, linkable, greyOutAtMax = false) {
  let div = createDiv().parent(container).style("margin", "5px");
  let label = createSpan(name + " (" + abbrev + "): ").parent(div).style("cursor", "pointer");
  label.mouseClicked(() => showStatDescription(name + " (" + abbrev + ")", statDescriptions[abbrev] || "No description available."));
  statLabelElements[abbrev] = label;

  let input = createInput(initialValue.toString(), "number").parent(div).style("width", "50px");
  input.changed(() => {
    let val = int(input.value());
    val = constrain(val, 1, 99);
    tryChangeStat(statName, val);
    // Update input to reflect current stat value
    let currentStatValue;
    switch (statName) {
      case "Level": currentStatValue = level; break;
      case "EXP": currentStatValue = exp; break;
      case "STR": currentStatValue = stat_str; break;
      case "VIT": currentStatValue = stat_vit; break;
      case "DEX": currentStatValue = stat_dex; break;
      case "MAG": currentStatValue = stat_mag; break;
      case "WIL": currentStatValue = stat_wil; break;
      case "SPR": currentStatValue = stat_spr; break;
      case "LCK": currentStatValue = stat_lck; break;
    }
    input.value(currentStatValue);
    if (greyOutAtMax && currentStatValue === 99) {
      input.attribute("disabled", "true").style("background-color", "#ccc");
    } else if (greyOutAtMax) {
      input.removeAttribute("disabled").style("background-color", "white");
    }
  });

  let bonusSpan = createSpan().parent(div).style("color", "green").style("margin-left", "5px");
  statBonusElements[abbrev] = bonusSpan;
}
function tryChangeStat(statName, newValue) {
  // Convert and constrain the new value
  let newValueInt = constrain(int(newValue), 1, 99);

  // Handle Level and EXP separately (no equipment checks needed)
  if (statName === "Level" || statName === "EXP") {
    if (statName === "Level") level = newValueInt;
    else if (statName === "EXP") exp = newValueInt;
    return true;
  }

  // Calculate the new total stat value (base + bonuses)
  let bonuses = getStatBonuses();
  let newTotal = newValueInt + (bonuses[statName] || 0);

  // Check all equipped items for stat requirements
  for (let slot in equippedItems) {
    let item = equippedItems[slot];
    if (item && item.statRequirements && item.statRequirements[statName]) {
      if (newTotal < item.statRequirements[statName]) {
        showConfirmationModal(
          `Cannot lower ${statName}: equipped item "${item.name}" requires ${item.statRequirements[statName]} ${statName}. Unequip the item first.`,
          () => {},
          true
        );
        return false;
      }
    }
  }

  // If all checks pass, update the stat
  switch (statName) {
    case "STR": stat_str = newValueInt; break;
    case "VIT": stat_vit = newValueInt; updateResourcesBasedOnStats(); break;
    case "DEX": stat_dex = newValueInt; break;
    case "MAG": stat_mag = newValueInt; break;
    case "WIL": stat_wil = newValueInt; updateResourcesBasedOnStats(); break;
    case "SPR": stat_spr = newValueInt; break;
    case "LCK": stat_lck = newValueInt; break;
  }
  return true;
}
function createAdditionalAttributesUI() {
  let statsContainer = select("#stats");
  if (!statsContainer) return;
  skillsContainer
    .parent(statsContainer)
    .style("padding", "5px")
    .style("margin-top", "20px")
    .style("width", "100%")
    .style("max-width", "600px");

  createElement("h3", "Skills").parent(skillsContainer);
  let skillsDesc = createP(
    "Skills enhance specific abilities. Link a Skill to a Stat (e.g., Athletics to STR) to tie its effectiveness to that Stat’s value. Click a skill name for details. Only one Skill can link to a Stat at a time."
  ).parent(skillsContainer);
  skillsDesc
    .style("font-size", "12px")
    .style("color", "#666")
    .style("margin-top", "5px")
    .style("margin-bottom", "10px");

  additionalAttributes.forEach((attr) => {
    let attrDiv = createDiv().parent(skillsContainer).class("resource-row");
    let btn = createButton(attr.name)
      .parent(attrDiv)
      .style("background-color", attr.color)
      .style("color", "#fff")
      .class("resource-button")
      .mousePressed(() => showStatDescription(attr.name, attr.desc));
    let statSelect = createSelect().parent(attrDiv);
    statSelect.option("None");
    ["STR", "VIT", "DEX", "MAG", "WIL", "SPR", "LCK"].forEach((stat) =>
      statSelect.option(stat)
    );
    statSelect.changed(() => linkStatToSkill(attr.name, statSelect.value()));
    attributeCheckboxes[attr.name] = statSelect;
  });

  updateSkillDropdowns();
}

function updateSkillDropdowns() {
  const allStats = ["STR", "VIT", "DEX", "MAG", "WIL", "SPR", "LCK"];
  let assignedStats = Object.values(attributeLinkMapping);

  additionalAttributes.forEach((attr) => {
    let dropdown = attributeCheckboxes[attr.name];
    let currentStat = attributeLinkMapping[attr.name] || "None";
    dropdown.elt.innerHTML = "";
    let noneOption = document.createElement("option");
    noneOption.value = "None";
    noneOption.text = "None";
    dropdown.elt.add(noneOption);

    allStats.forEach((stat) => {
      if (!assignedStats.includes(stat) || stat === currentStat) {
        let option = document.createElement("option");
        option.value = stat;
        option.text = stat;
        dropdown.elt.add(option);
      }
    });
    dropdown.elt.value = currentStat;
  });
}

function linkStatToSkill(skillName, selectedStat) {
  if (attributeLinkMapping[skillName]) {
    let oldStat = attributeLinkMapping[skillName];
    delete statLinkMapping[oldStat];
    statLabelElements[oldStat].style("color", "black");
  }

  if (selectedStat === "None") {
    delete attributeLinkMapping[skillName];
  } else {
    if (statLinkMapping[selectedStat]) {
      let oldSkill = statLinkMapping[selectedStat];
      delete attributeLinkMapping[oldSkill];
      attributeCheckboxes[oldSkill].value("None");
    }
    statLinkMapping[selectedStat] = skillName;
    attributeLinkMapping[skillName] = selectedStat;
    let skillColor = additionalAttributes.find((a) => a.name === skillName)
      .color;
    statLabelElements[selectedStat].style("color", skillColor);
  }

  updateSkillDropdowns();
}

// ### Equipment System ###

function calculateMovement() {
  let totalPenalty = 0;
  const armorSlots = ["Chest", "Helm", "Gloves", "Greaves"];
  armorSlots.forEach((slot) => {
    const item = equippedItems[slot];
    if (item && item.movementPenalty) {
      totalPenalty += item.movementPenalty; // Sum penalties (negative numbers)
    }
  });
  movement = Math.max(25, 65 + totalPenalty); // Base 65 ft, minimum 25 ft
  let movementInput = select("#movementInput");
  if (movementInput) movementInput.value(movement + " ft");
}

function createEquipmentUI() {
  // Check for the equipment container
  let equipmentContainerDiv = select("#equipment");
  if (!equipmentContainerDiv) {
    console.error("No #equipment div found in HTML! Please ensure your HTML includes <div id=\"equipment\"></div>");
    return;
  }
  equipmentContainerDiv.html(""); // Clear previous content

  // Header and instructions
  createElement("h2", "Equipment").parent(equipmentContainerDiv);
  createSpan("Use 'Modify Equipment' to add, edit, or remove equipment. Use 'Modify Crystals' to add, edit, or remove crystals. Click a Slot to view the equipped item’s details. Click Crystal Slots to equip crystals.")
    .parent(equipmentContainerDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("margin-top", "5px")
    .style("margin-bottom", "10px");

  // Button row with consolidated "Modify Crystals" button
  let buttonRow = createDiv().parent(equipmentContainerDiv).class("resource-row");
  createButton("Modify Equipment")
    .parent(buttonRow)
    .class("resource-button")
    .style("margin", "5px")
    .mousePressed(showAddEditEquipmentModal);
  createButton("Modify Crystals") // Consolidated button replacing the two crystal-related buttons
    .parent(buttonRow)
    .class("resource-button")
    .style("margin", "5px")
    .mousePressed(showModifyCrystalsModal);
 createButton("Default Equipment List")
    .parent(buttonRow)
    .class("resource-button")
    .style("margin", "5px")
    .mousePressed(() => {
      showConfirmationModal(
        "Are you sure you want to reset to the default equipment list? This will overwrite your current equipment.",
        () => {
          // Proceed with reset if confirmed
          inventory = inventory.filter(item => item.category !== "Equipment");
          availableItems["Equipment"].forEach(item => {
            inventory.push({ ...item });
          });
          localStorage.setItem('inventory', JSON.stringify(inventory)); // Persist to localStorage
          updateAvailableEquipment();
          createInventoryUI();
          createEquipmentUI();
        },
        false // Set to false if you want a cancel option; true if it's a forced confirmation
      );
    });

  // Equipment table setup
  let equipmentTable = createElement("table")
    .parent(equipmentContainerDiv)
    .id("equipmentTable")
    .style("width", "100%")
    .style("border-collapse", "collapse")
    .style("margin-top", "10px");
  let headerRow = createElement("tr").parent(equipmentTable);
  ["Slot", "Name", "Requirements", "Damage/Defense", "Mov. Penalty", "Crystal Slots", "Stat Bonus", "Linked Stat"].forEach((header) => {
    createElement("th", header)
      .parent(headerRow)
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("background", "#f2f2f2");
  });

  // Populate table rows
  Object.keys(equippedItems).forEach((slot) => {
    let row = createElement("tr").parent(equipmentTable);
    let slotCell = createElement("td")
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("cursor", "pointer");
    createSpan(slot)
      .parent(slotCell)
      .style("color", equippedItems[slot] ? "blue" : "black")
      .style("text-decoration", equippedItems[slot] ? "underline" : "none")
      .mousePressed(() => showEquipmentDescription(slot, equippedItems[slot], false));

    let nameCell = createElement("td")
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");
    let itemSelect = createSelect()
      .parent(nameCell)
      .style("width", "100%");
    itemSelect.option("None");
    if (availableEquipment[slot]) {
      availableEquipment[slot].forEach(item => itemSelect.option(item.name));
    }
    itemSelect.value(equippedItems[slot] ? equippedItems[slot].name : "None");
    itemSelect.changed(() => {
      let selectedName = itemSelect.value();
      if (selectedName === "None") {
        equippedItems[slot] = null;
      } else {
        let selectedItem = availableEquipment[slot].find(item => item.name === selectedName);
        if (selectedItem && canWieldItem(selectedItem)) {
          equippedItems[slot] = { ...selectedItem, equippedCrystals: equippedItems[slot]?.equippedCrystals || Array(selectedItem.crystalSlots || 0).fill(null) };
        } else {
          showConfirmationModal(`Cannot equip ${selectedName}: stat requirements not met.`, () => {}, true);
          itemSelect.value(equippedItems[slot] ? equippedItems[slot].name : "None");
          return;
        }
      }
      calculateMovement();
      updateStatBonusesDisplay();
      updateResourcesBasedOnStats();
      updateAbilities();
      createEquipmentUI();
    });

    let item = equippedItems[slot];
    let reqText = item && item.statRequirements ? Object.entries(item.statRequirements).map(([stat, val]) => `${val} ${stat}`).join(", ") : "-";
    createElement("td", reqText)
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");

    let dmgDefText = "-";
    if (item) {
      if (item.damageDice) dmgDefText = `${item.damageDice}${item.modifier ? (item.modifier > 0 ? `+${item.modifier}` : item.modifier) : ""}`;
      else if (item.defense) dmgDefText = `${item.defense}${item.modifier ? (item.modifier > 0 ? `+${item.modifier}` : item.modifier) : ""}`;
    }
    createElement("td", dmgDefText)
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");

    createElement("td", item && item.movementPenalty !== undefined ? item.movementPenalty.toString() : "-")
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");

    let crystalCell = createElement("td", item && item.crystalSlots !== undefined ? item.crystalSlots.toString() : "0")
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("cursor", item ? "pointer" : "default")
      .style("color", item ? "blue" : "black");
    if (item) {
      crystalCell.mousePressed(() => showEquipmentDescription(slot, item, true));
    }

    let bonusText = item && item.statBonus && item.statBonus.stat !== "None" ? `${item.statBonus.amount > 0 ? "+" : ""}${item.statBonus.amount} ${item.statBonus.stat}` : "-";
    createElement("td", bonusText)
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");

    createElement("td", item && item.linkedStat ? item.linkedStat : "-")
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");
  });
}
function showModifyCrystalsModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Modify Crystals").parent(modalDiv);

  let errorMessage = createP("")
    .parent(modalDiv)
    .style("color", "red")
    .style("display", "none")
    .style("margin-bottom", "10px");

  let crystalSelectDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Crystal:").parent(crystalSelectDiv).style("display", "block");
  let crystalSelect = createSelect().parent(crystalSelectDiv).style("width", "100%");
  createSpan("Select a crystal to edit or 'None' to add a new one.")
    .parent(crystalSelectDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let crystals = inventory.filter(item => item.category === "Materials");
  crystalSelect.option("None", -1);
  crystals.forEach((crystal, idx) => crystalSelect.option(crystal.name, idx));

  let nameDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Name:").parent(nameDiv).style("display", "inline-block").style("width", "100px");
  let nameInput = createInput("").parent(nameDiv).style("width", "180px");
  createSpan("The crystal’s unique identifier.").parent(nameDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  let descDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Description:").parent(descDiv).style("display", "inline-block").style("width", "100px");
  let descInput = createInput("").parent(descDiv).style("width", "180px");
  createSpan("What the crystal does or its lore.").parent(descDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  let statBonusDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Stat Bonus:").parent(statBonusDiv).style("display", "inline-block").style("width", "100px");
  let statSelect = createSelect().parent(statBonusDiv).style("width", "80px").style("margin-right", "5px");
  ["None", "STR", "VIT", "DEX", "MAG", "WIL", "SPR", "LCK"].forEach(stat => statSelect.option(stat));
  let amountInput = createInput("0", "number").parent(statBonusDiv).style("width", "50px");
  createSpan("Stat to boost (e.g., MAG) and amount.").parent(statBonusDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  let statReqDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Stat Requirement:").parent(statReqDiv).style("display", "inline-block").style("width", "100px");
  let statReqSelect = createSelect().parent(statReqDiv).style("width", "80px").style("margin-right", "5px");
  ["None", "STR", "VIT", "DEX", "MAG", "WIL", "SPR", "LCK"].forEach(stat => statReqSelect.option(stat));
  let statReqInput = createInput("0", "number").parent(statReqDiv).style("width", "50px");
  createSpan("Minimum stat needed to equip (e.g., 5 MAG).").parent(statReqDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  let abilitiesDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Abilities:").parent(abilitiesDiv).style("display", "inline-block").style("width", "100px");
  let abilitiesInput = createInput("").parent(abilitiesDiv).style("width", "180px").attribute("placeholder", "e.g., Fire, Cure");
  createSpan("Skills granted (comma-separated).").parent(abilitiesDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  function loadCrystalData() {
    let idx = parseInt(crystalSelect.value());
    if (idx === -1) { // "None" selected
      nameInput.value("");
      descInput.value("");
      statSelect.value("None");
      amountInput.value(0);
      statReqSelect.value("None");
      statReqInput.value(0);
      abilitiesInput.value("");
    } else if (idx >= 0 && idx < crystals.length) {
      let crystal = crystals[idx];
      nameInput.value(crystal.name || "");
      descInput.value(crystal.description || "");
      let statBonuses = crystal.statBonuses || {};
      let stat = Object.keys(statBonuses).length > 0 ? Object.keys(statBonuses)[0] : "None";
      statSelect.value(stat);
      amountInput.value(stat !== "None" && statBonuses[stat] ? statBonuses[stat] : 0);
      let statReqs = crystal.statRequirements || {};
      let reqStat = Object.keys(statReqs).length > 0 ? Object.keys(statReqs)[0] : "None";
      statReqSelect.value(reqStat);
      statReqInput.value(reqStat !== "None" && statReqs[reqStat] ? statReqs[reqStat] : 0);
      abilitiesInput.value(crystal.abilities && Array.isArray(crystal.abilities) ? crystal.abilities.join(", ") : "");
    }
  }

  crystalSelect.changed(loadCrystalData);
  loadCrystalData();

  createButton("Add")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let idx = parseInt(crystalSelect.value());
      if (idx !== -1) {
        errorMessage.html("Please select 'None' to add a new crystal.");
        errorMessage.style("display", "block");
        return;
      }

      let name = nameInput.value().trim();
      let desc = descInput.value().trim();
      let stat = statSelect.value();
      let amount = parseInt(amountInput.value()) || 0;
      let reqStat = statReqSelect.value();
      let reqAmount = parseInt(statReqInput.value()) || 0;
      let abilities = abilitiesInput.value().split(",").map(a => a.trim()).filter(a => a);

      if (!name || !desc) {
        errorMessage.html("Please provide a name and description.");
        errorMessage.style("display", "block");
        return;
      }

      if (inventory.some(item => item.name === name && item.category === "Materials")) {
        errorMessage.html(`A crystal with the name "${name}" already exists. Please choose a different name.`);
        errorMessage.style("display", "block");
        return;
      }

      let crystal = {
        name,
        description: desc,
        category: "Materials",
        statBonuses: stat !== "None" ? { [stat]: amount } : {},
        statRequirements: reqStat !== "None" ? { [reqStat]: reqAmount } : {},
        abilities: abilities.length > 0 ? abilities : [],
        quantity: 1,
        quality: "Common"
      };

      console.log("Adding new crystal:", crystal);
      inventory.push(crystal);
      localStorage.setItem('inventory', JSON.stringify(inventory));
      console.log("Updated inventory:", inventory);
      updateAvailableEquipment();
      createEquipmentUI();
      if (typeof createInventoryUI === "function") createInventoryUI();
      modalDiv.remove();
      errorMessage.style("display", "none");
    });

  createButton("Save")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let idx = parseInt(crystalSelect.value());
      if (idx === -1) {
        errorMessage.html("Please select a crystal to edit.");
        errorMessage.style("display", "block");
        return;
      }
      if (idx < 0 || idx >= crystals.length) {
        errorMessage.html("Invalid crystal selected.");
        errorMessage.style("display", "block");
        return;
      }

      let crystal = crystals[idx];
      let newName = nameInput.value().trim();
      let newDesc = descInput.value().trim();
      let stat = statSelect.value();
      let amount = parseInt(amountInput.value()) || 0;
      let reqStat = statReqSelect.value();
      let reqAmount = parseInt(statReqInput.value()) || 0;
      let abilities = abilitiesInput.value().split(",").map(a => a.trim()).filter(a => a);

      if (!newName || !newDesc) {
        errorMessage.html("Please provide a name and description.");
        errorMessage.style("display", "block");
        return;
      }

      if (newName !== crystal.name && inventory.some(item => item.name === newName && item.category === "Materials")) {
        errorMessage.html(`A crystal with the name "${newName}" already exists. Please choose a different name.`);
        errorMessage.style("display", "block");
        return;
      }

      let inventoryIdx = inventory.indexOf(crystal);
      let updatedCrystal = {
        name: newName,
        description: newDesc,
        category: "Materials",
        statBonuses: stat !== "None" ? { [stat]: amount } : {},
        statRequirements: reqStat !== "None" ? { [reqStat]: reqAmount } : {},
        abilities: abilities.length > 0 ? abilities : [],
        quantity: crystal.quantity || 1,
        quality: crystal.quality || "Common"
      };

      console.log("Updating crystal:", updatedCrystal);
      inventory[inventoryIdx] = updatedCrystal;

      // Sync equipped crystals
      for (let slot in equippedItems) {
        let item = equippedItems[slot];
        if (item && item.equippedCrystals) {
          item.equippedCrystals = item.equippedCrystals.map(c => (c && c.name === crystal.name ? updatedCrystal : c));
        }
      }

      localStorage.setItem('inventory', JSON.stringify(inventory));
      console.log("Updated inventory:", inventory);
      updateStatBonusesDisplay();
      updateResourcesBasedOnStats();
      updateAbilities();
      createEquipmentUI();
      modalDiv.remove();
      errorMessage.style("display", "none");
    });

  createButton("Remove")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let idx = parseInt(crystalSelect.value());
      if (idx === -1) {
        errorMessage.html("Please select a crystal to remove.");
        errorMessage.style("display", "block");
        return;
      }
      if (idx < 0 || idx >= crystals.length) {
        errorMessage.html("Invalid crystal selected.");
        errorMessage.style("display", "block");
        return;
      }

      let crystal = crystals[idx];
      showConfirmationModal(
        `Are you sure you want to remove "${crystal.name}"?`,
        () => {
          // Unequip the crystal from all equipment
          for (let slot in equippedItems) {
            let item = equippedItems[slot];
            if (item && item.equippedCrystals) {
              item.equippedCrystals = item.equippedCrystals.map(c => (c && c.name === crystal.name ? null : c));
            }
          }
          inventory.splice(inventory.indexOf(crystal), 1);
          localStorage.setItem('inventory', JSON.stringify(inventory));
          console.log("Removed crystal:", crystal.name, "Updated inventory:", inventory);
          updateStatBonusesDisplay();
          updateResourcesBasedOnStats();
          updateAbilities();
          createEquipmentUI();
          modalDiv.remove();
          errorMessage.style("display", "none");
        }
      );
    });

  createButton("Close")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      modalDiv.remove();
      errorMessage.style("display", "none");
    });
}
function createEquipmentFromModal(
  typeSelect,
  nameInput,
  penaltySelect,
  slotsSelect,
  linkedStatSelect,
  statBonusAmountInput,
  statBonusStatSelect,
  descriptionInput,
  statReq1Select,
  statReq1Input,
  statReq2Select,
  statReq2Input,
  damageDiceInput,
  defenseInput,
  modifierInput
) {
    let newEquipment = {
    name: nameInput.value(),
    type: typeSelect.value(),
    description: descriptionInput.value(),
    crystalSlots: parseInt(slotsSelect.value()),
    equippedCrystals: Array(parseInt(slotsSelect.value())).fill(null) // Initialize slots
  };
  let type = typeSelect.value();
  let name = nameInput.value().trim();
  if (!name) {
    alert("Please provide a name for the equipment.");
    return null;
  }
  let movementPenalty = ["Chest", "Helm", "Gloves", "Greaves"].includes(type)
    ? parseInt(penaltySelect.value())
    : 0;
  let crystalSlots = parseInt(slotsSelect.value());
  let linkedStat = ["On-Hand", "Off-Hand"].includes(type)
    ? linkedStatSelect.value()
    : null;
  let statBonusAmount = parseInt(statBonusAmountInput.value()) || 0;
  let statBonusStat =
    statBonusStatSelect.value() === "None" ? null : statBonusStatSelect.value();
  let description =
    descriptionInput.value().trim() || "No description provided.";
  // Stat Requirements
  let statRequirements = {};
  if (statReq1Select.value() !== "None" && statReq1Input.value()) {
    statRequirements[statReq1Select.value()] = parseInt(statReq1Input.value());
  }
  if (
    statReq2Select.value() !== "None" &&
    statReq2Input.value() &&
    statReq2Select.value() !== statReq1Select.value()
  ) {
    statRequirements[statReq2Select.value()] = parseInt(statReq2Input.value());
  }

  // Damage Dice or Defense with Modifier
  let damageDice = ["On-Hand", "Off-Hand"].includes(type)
    ? damageDiceInput.value().trim()
    : null;
  let defense = ["Chest", "Helm", "Gloves", "Greaves"].includes(type)
    ? parseInt(defenseInput.value()) || 0
    : null;
  let modifier = parseInt(modifierInput.value()) || 0;

  return {
    type: type,
    name: name,
    movementPenalty: movementPenalty,
    crystalSlots: crystalSlots,
    statBonus:
      statBonusAmount !== 0 && statBonusStat
        ? { amount: statBonusAmount, stat: statBonusStat }
        : null,
    modifier: modifier !== 0 ? modifier : null,
    linkedStat: linkedStat,
    description: description,
    statRequirements:
      Object.keys(statRequirements).length > 0 ? statRequirements : null,
    damageDice: damageDice || null,
    defense: defense,
    slottedCrystals: [],
  };
    return newEquipment;
}
function equipItem(slot, itemName) {
  let previousItem = equippedItems[slot] ? equippedItems[slot].name : "None";
  if (itemName === "None") {
    equippedItems[slot] = null;
  } else {
    let selectedItem = availableEquipment[slot].find(
      (item) => item.name === itemName
    );
    if (selectedItem) {
      if (canWieldItem(selectedItem)) {
        equippedItems[slot] = selectedItem;
      } else {
        let totalStats = {
          STR: getTotalStat("STR"),
          VIT: getTotalStat("VIT"),
          DEX: getTotalStat("DEX"),
          MAG: getTotalStat("MAG"),
          WIL: getTotalStat("WIL"),
          SPR: getTotalStat("SPR"),
          LCK: getTotalStat("LCK"),
        };
        let missingStats = [];
        for (let [stat, requiredValue] of Object.entries(
          selectedItem.statRequirements || {}
        )) {
          let currentValue = totalStats[stat];
          if (currentValue < requiredValue) {
            missingStats.push(`${stat}: ${currentValue}/${requiredValue}`);
          }
        }
        let errorMessage = `Cannot equip ${
          selectedItem.name
        }. Missing requirements: ${missingStats.join(", ")}.`;
        showConfirmationModal(errorMessage, () => {}, true);
        slotSelects[slot].value(previousItem);
        return;
      }
    }
  }
  calculateMovement();
  updateResourcesBasedOnStats();
  createEquipmentUI();
  updateStatBonusesDisplay();
}
function showRemoveEditEquipmentModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Remove / Edit Equipment").parent(modalDiv);
  let allEquipment = inventory.filter(
    (item) => item.category === "Weapons" || item.category === "Armor" || item.category === "Accessories"
  );
  if (allEquipment.length === 0) {
    createP("No equipment available to remove or edit.").parent(modalDiv);
    createButton("Close")
      .parent(modalDiv)
      .style("margin", "5px")
      .mousePressed(() => modalDiv.remove());
    return;
  }

  let typeDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let typeLabel = createSpan("Equipment Type:")
    .parent(typeDiv)
    .style("display", "block");
  let typeSelect = createSelect()
    .parent(typeDiv)
    .style("width", "100%");
  createSpan("The slot where the equipment is equipped.")
    .parent(typeDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");
  Object.keys(availableEquipment).forEach((slot) => {
    if (availableEquipment[slot].length > 0) typeSelect.option(slot);
  });

  let equipmentDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let equipmentLabel = createSpan("Select Equipment:")
    .parent(equipmentDiv)
    .style("display", "block");
  let equipmentSelect = createSelect()
    .parent(equipmentDiv)
    .style("width", "100%");
  createSpan("The equipment item to edit or remove.")
    .parent(equipmentDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let nameDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let nameLabel = createSpan("Name:")
    .parent(nameDiv)
    .style("display", "block");
  let nameInput = createInput("")
    .parent(nameDiv)
    .style("width", "100%")
    .attribute("placeholder", "Name");
  createSpan("The equipment’s unique identifier.")
    .parent(nameDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let descDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let descLabel = createSpan("Description:")
    .parent(descDiv)
    .style("display", "block");
  let descriptionInput = createElement("textarea")
    .parent(descDiv)
    .style("width", "100%")
    .style("height", "60px")
    .attribute("placeholder", "Description");
  createSpan("What the equipment does or its lore.")
    .parent(descDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let penaltyDiv = createDiv().parent(modalDiv);
  let penaltyLabel = createSpan("Movement Penalty (ft):")
    .parent(penaltyDiv)
    .style("display", "block");
  let penaltySelect = createSelect()
    .parent(penaltyDiv)
    .style("width", "100%");
  ["0", "-5", "-10", "-15"].forEach((penalty) => penaltySelect.option(penalty));
  createSpan("Movement reduction for armor.")
    .parent(penaltyDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let slotsDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let slotsLabel = createSpan("Essence Crystal Slots:")
    .parent(slotsDiv)
    .style("display", "block");
  let slotsSelect = createSelect()
    .parent(slotsDiv)
    .style("width", "100%");
  [0, 1, 2].forEach((slot) => slotsSelect.option(slot));
  createSpan("Number of slots for Essence Crystals.")
    .parent(slotsDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let linkedStatDiv = createDiv().parent(modalDiv);
  let linkedStatLabel = createSpan("Linked Stat (Weapons):")
    .parent(linkedStatDiv)
    .style("display", "block");
  let linkedStatSelect = createSelect()
    .parent(linkedStatDiv)
    .style("width", "100%");
  linkedStatSelect.option("STR");
  linkedStatSelect.option("MAG");
  createSpan("Stat for weapon damage (STR or MAG).")
    .parent(linkedStatDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let statBonusDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let statBonusLabel = createSpan("Stat Bonus:")
    .parent(statBonusDiv)
    .style("display", "block");
  let statBonusAmountInput = createInput("0", "number")
    .parent(statBonusDiv)
    .style("width", "50px")
    .style("margin-right", "5px");
  let statBonusStatSelect = createSelect()
    .parent(statBonusDiv)
    .style("width", "100px");
  ["None", "STR", "DEX", "VIT", "MAG", "WIL", "SPR", "LCK"].forEach((stat) =>
    statBonusStatSelect.option(stat)
  );
  createSpan("Stat to boost and amount.")
    .parent(statBonusDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

   let statReqDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let statReqLabel = createSpan("Stat Requirements (Optional):")
    .parent(statReqDiv)
    .style("display", "block");
  let statReq1Div = createDiv().parent(statReqDiv).style("margin-bottom", "5px");
  let statReq1Select = createSelect()
    .parent(statReq1Div)
    .style("width", "80px")
    .style("margin-right", "5px");
  ["None", "STR", "DEX", "VIT", "MAG", "WIL", "SPR", "LCK"].forEach((stat) =>
    statReq1Select.option(stat)
  );
  let statReq1Input = createInput("", "number")
    .parent(statReq1Div)
    .style("width", "50px");
  let statReq2Div = createDiv().parent(statReqDiv);
  let statReq2Select = createSelect()
    .parent(statReq2Div)
    .style("width", "80px")
    .style("margin-right", "5px");
  ["None", "STR", "DEX", "VIT", "MAG", "WIL", "SPR", "LCK"].forEach((stat) =>
    statReq2Select.option(stat)
  );
  let statReq2Input = createInput("", "number")
    .parent(statReq2Div)
    .style("width", "50px");
  createSpan("Minimum stats needed to equip (e.g., 5 STR).")
    .parent(statReqDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");
  let damageDiceDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let damageDiceLabel = createSpan("Damage Dice + Modifier (Weapons):")
    .parent(damageDiceDiv)
    .style("display", "block");
  let damageDiceInput = createInput("", "text")
    .parent(damageDiceDiv)
    .style("width", "80px")
    .style("margin-right", "5px");
  let weaponModifierInput = createInput("0", "number")
    .parent(damageDiceDiv)
    .style("width", "50px");
  createSpan("Weapon damage (e.g., 1d8) and modifier.")
    .parent(damageDiceDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let defenseDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let defenseLabel = createSpan("Defense + Modifier (Armor):")
    .parent(defenseDiv)
    .style("display", "block");
  let defenseInput = createInput("0", "number")
    .parent(defenseDiv)
    .style("width", "50px")
    .style("margin-right", "5px");
  let armorModifierInput = createInput("0", "number")
    .parent(defenseDiv)
    .style("width", "50px");
  createSpan("Armor defense value and modifier.")
    .parent(defenseDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  function loadEquipmentData() {
    let selectedType = typeSelect.value();
    let selectedName = equipmentSelect.value();
    let item = inventory.find(
      (i) => i.name === selectedName && i.type === selectedType && 
             (i.category === "Weapons" || i.category === "Armor" || i.category === "Accessories")
    );
    if (item) {
      nameInput.value(item.name || "");
      descriptionInput.value(item.description || "");
      penaltySelect.value(item.movementPenalty !== undefined ? String(item.movementPenalty) : "0");
      slotsSelect.value(item.crystalSlots !== undefined ? String(item.crystalSlots) : "0");
      linkedStatSelect.value(item.linkedStat || "STR");
      statBonusStatSelect.value(item.statBonus && item.statBonus.stat ? item.statBonus.stat : "None");
      statBonusAmountInput.value(item.statBonus && item.statBonus.amount ? item.statBonus.amount : "0");
      statReq1Select.value(item.statRequirements && Object.keys(item.statRequirements)[0] ? Object.keys(item.statRequirements)[0] : "None");
      statReq1Input.value(item.statRequirements && Object.values(item.statRequirements)[0] ? Object.values(item.statRequirements)[0] : "");
      statReq2Select.value(item.statRequirements && Object.keys(item.statRequirements)[1] ? Object.keys(item.statRequirements)[1] : "None");
      statReq2Input.value(item.statRequirements && Object.values(item.statRequirements)[1] ? Object.values(item.statRequirements)[1] : "");
      damageDiceInput.value(item.damageDice || "");
      defenseInput.value(item.defense !== undefined ? item.defense : "0");
      weaponModifierInput.value(item.modifier !== undefined ? item.modifier : "0");
      armorModifierInput.value(item.modifier !== undefined ? item.modifier : "0");

      let isWeapon = ["On-Hand", "Off-Hand"].includes(selectedType);
      let isArmor = ["Chest", "Helm", "Gloves", "Greaves"].includes(selectedType);
      penaltyDiv.style("display", isArmor ? "block" : "none");
      linkedStatDiv.style("display", isWeapon ? "block" : "none");
      damageDiceDiv.style("display", isWeapon ? "block" : "none");
      defenseDiv.style("display", isArmor ? "block" : "none");
    } else {
      nameInput.value("");
      descriptionInput.value("");
      penaltySelect.value("0");
      slotsSelect.value("0");
      linkedStatSelect.value("STR");
      statBonusStatSelect.value("None");
      statBonusAmountInput.value("0");
      statReq1Select.value("None");
      statReq1Input.value("");
      statReq2Select.value("None");
      statReq2Input.value("");
      damageDiceInput.value("");
      defenseInput.value("0");
      weaponModifierInput.value("0");
      armorModifierInput.value("0");
      penaltyDiv.style("display", "none");
      linkedStatDiv.style("display", "none");
      damageDiceDiv.style("display", "none");
      defenseDiv.style("display", "none");
    }
  }

  function updateEquipmentOptions() {
    let selectedType = typeSelect.value();
    equipmentSelect.html("");
    let typeItems = inventory.filter(
      (item) => item.type === selectedType && 
                (item.category === "Weapons" || item.category === "Armor" || item.category === "Accessories")
    );
    if (typeItems.length > 0) {
      typeItems.forEach((item) => equipmentSelect.option(item.name));
      equipmentSelect.value(typeItems[0].name); // Default to first item
      loadEquipmentData(); // Load data after setting options
    } else {
      equipmentSelect.option("No items available");
    }
  }

  typeSelect.changed(updateEquipmentOptions);
  equipmentSelect.changed(loadEquipmentData);
  updateAvailableEquipment(); // Sync before initial load
  updateEquipmentOptions(); // Initial population

  createButton("Edit")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let selectedType = typeSelect.value();
      let selectedName = equipmentSelect.value();
      if (selectedName === "No items available") {
        showConfirmationModal("No equipment selected to edit.", () => {}, true);
        return;
      }
      let index = inventory.findIndex(
        (item) => item.name === selectedName && item.type === selectedType && 
                  (item.category === "Weapons" || item.category === "Armor" || item.category === "Accessories")
      );
      if (index !== -1) {
        let modifierInput = ["On-Hand", "Off-Hand"].includes(selectedType) ? weaponModifierInput : armorModifierInput;
        let statReq1 = statReq1Select.value();
        let statReq2 = statReq2Select.value();
        let newEquipment = {
          name: nameInput.value(),
          type: selectedType,
          description: descriptionInput.value(),
          category: (selectedType === "On-Hand" || selectedType === "Off-Hand") ? "Weapons" :
                    (selectedType === "Accessory 1" || selectedType === "Accessory 2") ? "Accessories" : "Armor",
          crystalSlots: parseInt(slotsSelect.value()),
          statBonus: statBonusStatSelect.value() !== "None" ? { stat: statBonusStatSelect.value(), amount: parseInt(statBonusAmountInput.value()) || 0 } : null,
          statRequirements: {},
          movementPenalty: ["Chest", "Helm", "Gloves", "Greaves"].includes(selectedType) ? parseInt(penaltySelect.value()) : undefined,
          linkedStat: ["On-Hand", "Off-Hand"].includes(selectedType) ? linkedStatSelect.value() : undefined,
          damageDice: ["On-Hand", "Off-Hand"].includes(selectedType) ? damageDiceInput.value() || undefined : undefined,
          defense: ["Chest", "Helm", "Gloves", "Greaves"].includes(selectedType) ? parseInt(defenseInput.value()) || 0 : undefined,
          modifier: ["On-Hand", "Off-Hand"].includes(selectedType) ? parseInt(weaponModifierInput.value()) || 0 :
                    ["Chest", "Helm", "Gloves", "Greaves"].includes(selectedType) ? parseInt(armorModifierInput.value()) || 0 : undefined
        };
        if (statReq1 !== "None" && statReq1Input.value()) newEquipment.statRequirements[statReq1] = parseInt(statReq1Input.value());
        if (statReq2 !== "None" && statReq2Input.value()) newEquipment.statRequirements[statReq2] = parseInt(statReq2Input.value());

        if (!newEquipment.name) {
          showConfirmationModal("Please provide a name for the equipment.", () => {}, true);
          return;
        }

        if (equippedItems[selectedType] && equippedItems[selectedType].name === selectedName) {
          if (canWieldItem(newEquipment)) {
            equippedItems[selectedType] = { ...newEquipment, equippedCrystals: equippedItems[selectedType].equippedCrystals };
          } else {
            let totalStats = {
              STR: getTotalStat("STR"),
              VIT: getTotalStat("VIT"),
              DEX: getTotalStat("DEX"),
              MAG: getTotalStat("MAG"),
              WIL: getTotalStat("WIL"),
              SPR: getTotalStat("SPR"),
              LCK: getTotalStat("LCK"),
            };
            let missingStats = [];
            for (let [stat, requiredValue] of Object.entries(newEquipment.statRequirements || {})) {
              if (totalStats[stat] < requiredValue) {
                missingStats.push(`${stat}: ${totalStats[stat]}/${requiredValue}`);
              }
            }
            showConfirmationModal(
              `Cannot edit ${selectedName} as equipped item. New requirements not met: ${missingStats.join(", ")}.`,
              () => {},
              true
            );
            return;
          }
        }
        inventory[index] = newEquipment;
        updateAvailableEquipment();
        createEquipmentUI();
        // createInventoryUI(); // Uncomment if implemented
        modalDiv.remove();
      }
    });

  createButton("Remove")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let selectedType = typeSelect.value();
      let selectedName = equipmentSelect.value();
      if (selectedName === "No items available") {
        showConfirmationModal("No equipment selected to remove.", () => {}, true);
        return;
      }
      showConfirmationModal(
        `Remove ${selectedName} from ${selectedType}?`,
        () => {
          let index = inventory.findIndex(
            (item) => item.name === selectedName && item.type === selectedType && 
                      (item.category === "Weapons" || item.category === "Armor" || item.category === "Accessories")
          );
          if (index !== -1) {
            if (equippedItems[selectedType] && equippedItems[selectedType].name === selectedName) {
              equippedItems[selectedType] = null;
              calculateMovement();
              updateResourcesBasedOnStats();
              updateStatBonusesDisplay();
            }
            inventory.splice(index, 1);
            updateAvailableEquipment();
            createEquipmentUI();
            // createInventoryUI(); // Uncomment if implemented
            modalDiv.remove();
          }
        }
      );
    });

  createButton("Cancel")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => modalDiv.remove());
}
// ### Talents UI ###

function createTalentsUI() {
  let talentsContainerDiv = select("#talents");
  if (!talentsContainerDiv) {
    console.error("No #talents div found in HTML!");
    return;
  }
  talentsContainerDiv.html("");

  createElement("h2", "Talents").parent(talentsContainerDiv);
  let talentsDesc = createP(
    "Use buttons to add, edit, or remove talents. Click a talent's name to view its details. Use arrows to reorder."
  ).parent(talentsContainerDiv);
  talentsDesc
    .style("font-size", "12px")
    .style("color", "#666")
    .style("margin-top", "5px")
    .style("margin-bottom", "10px");

  createButton("Add Custom Talent")
    .parent(talentsContainerDiv)
    .style("margin", "5px")
    .mousePressed(showAddCustomTalentModal);
  createButton("Add / Edit Existing Talents")
    .parent(talentsContainerDiv)
    .style("margin", "5px")
    .mousePressed(showAddEditTalentsModal);
  createButton("Remove Existing Talent")
    .parent(talentsContainerDiv)
    .style("margin", "5px")
    .mousePressed(showRemoveExistingTalentModal);
  createButton("Default Talent List")
    .parent(talentsContainerDiv)
    .style("margin", "5px")
    .mousePressed(() =>
      showConfirmationModal(
        "Reset to default talent list?",
        resetToDefaultTalents
      )
    );

  let talentsTable = createElement("table")
    .parent(talentsContainerDiv)
    .id("talentsTable")
    .style("width", "100%")
    .style("border-collapse", "collapse")
    .style("margin-top", "10px");
  let headerRow = createElement("tr").parent(talentsTable);
  ["", "Name", "Level", "Category", "Actions"].forEach((header) => {
    createElement("th", header)
      .parent(headerRow)
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("background", "#f2f2f2");
  });

  updateTalentsTable();
}
function updateAvailableEquipment() {
  for (let slot in availableEquipment) {
    availableEquipment[slot] = inventory.filter(
      (item) => item.type === slot && item.category === "Equipment"
    );
  }
}
function showAddCustomTalentModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Add Custom Talent").parent(modalDiv);
  let nameLabel = createSpan("Talent Name:").parent(modalDiv);
  let nameInput = createInput("")
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");

  let levelLabel = createSpan("Levels (select highest desired):").parent(
    modalDiv
  );
  let levelsDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");

  let levelCheckboxes = {};
  let levelDescriptions = {};
  ["I", "II", "III"].forEach((lvl) => {
    let chkDiv = createDiv().parent(levelsDiv);
    let chk = createCheckbox(`Level ${lvl}`, false).parent(chkDiv);
    levelCheckboxes[lvl] = chk;
    let descDiv = createDiv().parent(levelsDiv).style("display", "none");
    let descLabel = createSpan(`Description ${lvl}:`).parent(descDiv);
    let descInput = createElement("textarea")
      .parent(descDiv)
      .style("width", "100%")
      .style("height", "60px")
      .style("margin-bottom", "5px");
    levelDescriptions[lvl] = { div: descDiv, input: descInput };
    chk.changed(() =>
      manageLevelDependencies(levelCheckboxes, levelDescriptions, lvl)
    );
  });

  let categoryLabel = createSpan("Category:").parent(modalDiv);
  let categorySelect = createSelect()
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  [
    "Physical Combat",
    "Magical",
    "Ranged Combat",
    "Defensive",
    "Utility & Tactical",
  ].forEach((cat) => categorySelect.option(cat));

  createButton("Save")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let name = nameInput.value();
      let category = categorySelect.value();
      if (!name || !category) {
        alert("Please provide a talent name and category.");
        return;
      }

      let checkedLevels = Object.keys(levelCheckboxes).filter((lvl) =>
        levelCheckboxes[lvl].checked()
      );
      if (checkedLevels.length === 0) {
        alert("Please select at least one level.");
        return;
      }

      let maxLevelIndex = checkedLevels.reduce(
        (max, lvl) =>
          ["I", "II", "III"].indexOf(lvl) > ["I", "II", "III"].indexOf(max)
            ? lvl
            : max,
        "I"
      );
      let requiredLevels = ["I", "II", "III"].slice(
        0,
        ["I", "II", "III"].indexOf(maxLevelIndex) + 1
      );
      for (let lvl of requiredLevels) {
        if (!checkedLevels.includes(lvl)) {
          alert(
            `Please ensure Level ${
              ["I", "II", "III"].indexOf(lvl) + 1
            } is selected and described.`
          );
          return;
        }
        let desc = levelDescriptions[lvl].input.value();
        if (!desc) {
          alert(`Please provide a description for Level ${lvl}.`);
          return;
        }
      }

      let newTalents = [];
      requiredLevels.forEach((lvl) => {
        let fullName = `${name} - Level ${lvl}`;
        let talent = {
          name: fullName,
          level: lvl,
          category: category,
          description: levelDescriptions[lvl].input.value(),
          maxLevel: maxLevelIndex,
        };
        existingTalents.push(talent);
        newTalents.push(talent);
      });

      talents = talents.filter((t) => !t.name.startsWith(name));
      let levelOneTalent = newTalents.find((t) => t.level === "I");
      if (levelOneTalent) talents.push(levelOneTalent);
      updateTalentsTable();
      modalDiv.remove();
    });

  createButton("Cancel")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => modalDiv.remove());
}

function showAddEditTalentsModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Add / Edit Existing Talents").parent(modalDiv);
  let talentNames = [
    ...new Set(existingTalents.map((t) => t.name.split(" - Level")[0])),
  ];
  let talentSelect = createSelect()
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  talentNames.forEach((name) => talentSelect.option(name));

  let categoryLabel = createSpan("Category:").parent(modalDiv);
  let categorySelect = createSelect()
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  [
    "Physical Combat",
    "Magical",
    "Ranged Combat",
    "Defensive",
    "Utility & Tactical",
  ].forEach((cat) => categorySelect.option(cat));

  let levelsDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  let levelCheckboxes = {};
  let levelDescriptions = {};

  function updateModal() {
    let selectedName = talentSelect.value();
    let talentLevels = existingTalents.filter((t) =>
      t.name.startsWith(selectedName)
    );
    levelsDiv.html("");

    ["I", "II", "III"].forEach((lvl) => {
      let chkDiv = createDiv().parent(levelsDiv);
      let isChecked = talentLevels.some((t) => t.level === lvl);
      let chk = createCheckbox(`Level ${lvl}`, isChecked).parent(chkDiv);
      levelCheckboxes[lvl] = chk;
      let descDiv = createDiv()
        .parent(levelsDiv)
        .style("display", isChecked ? "block" : "none");
      let descLabel = createSpan(`Description ${lvl}:`).parent(descDiv);
      let descInput = createElement("textarea")
        .parent(descDiv)
        .style("width", "100%")
        .style("height", "60px")
        .style("margin-bottom", "5px");
      let existingDesc =
        talentLevels.find((t) => t.level === lvl)?.description || "";
      descInput.value(existingDesc);
      levelDescriptions[lvl] = { div: descDiv, input: descInput };
      chk.changed(() =>
        manageLevelDependencies(levelCheckboxes, levelDescriptions, lvl)
      );
    });

    if (talentLevels.length > 0) categorySelect.value(talentLevels[0].category);
  }

  talentSelect.changed(updateModal);
  if (talentNames.length > 0) updateModal();

  createButton("Add to Character")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let selectedName = talentSelect.value();
      if (!selectedName) {
        alert("Please select a talent name.");
        return;
      }
      let checkedLevels = Object.keys(levelCheckboxes).filter((lvl) =>
        levelCheckboxes[lvl].checked()
      );
      if (checkedLevels.length === 0) {
        alert("Please select at least one level.");
        return;
      }
      talents = talents.filter((t) => !t.name.startsWith(selectedName));
      let initialLevel = "I";
      let desc = levelDescriptions[initialLevel].input.value();
      if (!desc) {
        alert(`Please provide a description for Level ${initialLevel}.`);
        return;
      }
      let fullName = `${selectedName} - Level ${initialLevel}`;
      talents.push({
        name: fullName,
        level: initialLevel,
        category: categorySelect.value(),
        description: desc,
      });
      updateTalentsTable();
    });

  createButton("Save")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let selectedName = talentSelect.value();
      let category = categorySelect.value();
      if (!selectedName) {
        alert("Please select a talent name.");
        return;
      }
      let checkedLevels = Object.keys(levelCheckboxes).filter((lvl) =>
        levelCheckboxes[lvl].checked()
      );
      if (checkedLevels.length > 0) {
        let maxLevelIndex = checkedLevels.reduce(
          (max, lvl) =>
            ["I", "II", "III"].indexOf(lvl) > ["I", "II", "III"].indexOf(max)
              ? lvl
              : max,
          "I"
        );
        let requiredLevels = ["I", "II", "III"].slice(
          0,
          ["I", "II", "III"].indexOf(maxLevelIndex) + 1
        );
        for (let lvl of requiredLevels) {
          if (!checkedLevels.includes(lvl)) {
            alert(
              `Please ensure Level ${
                ["I", "II", "III"].indexOf(lvl) + 1
              } is selected and described.`
            );
            return;
          }
          let desc = levelDescriptions[lvl].input.value();
          if (!desc) {
            alert(`Please provide a description for Level ${lvl}.`);
            return;
          }
        }
        for (let lvl in levelCheckboxes) {
          let fullName = `${selectedName} - Level ${lvl}`;
          if (levelCheckboxes[lvl].checked()) {
            let existingIndex = existingTalents.findIndex(
              (t) => t.name === fullName
            );
            if (existingIndex >= 0) {
              existingTalents[existingIndex].description = levelDescriptions[
                lvl
              ].input.value();
              existingTalents[existingIndex].category = category;
            } else {
              existingTalents.push({
                name: fullName,
                level: lvl,
                category,
                description: levelDescriptions[lvl].input.value(),
                maxLevel: maxLevelIndex,
              });
            }
          } else {
            let existingIndex = existingTalents.findIndex(
              (t) => t.name === fullName
            );
            if (existingIndex >= 0) existingTalents.splice(existingIndex, 1);
          }
        }
        updateTalentsTable();
      }
    });

  createButton("Close")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => modalDiv.remove());
}

function showRemoveExistingTalentModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Remove Existing Talent").parent(modalDiv);
  let talentLabel = createSpan("Select Talent to Remove:").parent(modalDiv);
  let talentSelect = createSelect()
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  let uniqueNames = [
    ...new Set(existingTalents.map((t) => t.name.split(" - Level")[0])),
  ];
  uniqueNames.forEach((name) => talentSelect.option(name));

  createButton("Remove")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let selectedName = talentSelect.value();
      existingTalents = existingTalents.filter(
        (t) => !t.name.startsWith(selectedName + " - Level")
      );
      talents = talents.filter(
        (t) => !t.name.startsWith(selectedName + " - Level")
      );
      updateTalentsTable();
      modalDiv.remove();
    });

  createButton("Cancel")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => modalDiv.remove());
}

function resetToDefaultTalents() {
  existingTalents = [...defaultTalents];
  talents = [];
  updateTalentsTable();
}

function moveTalentUp(index) {
  if (index > 0) {
    [talents[index - 1], talents[index]] = [talents[index], talents[index - 1]];
    updateTalentsTable();
  }
}

function moveTalentDown(index) {
  if (index < talents.length - 1) {
    [talents[index], talents[index + 1]] = [talents[index + 1], talents[index]];
    updateTalentsTable();
  }
}

function manageLevelDependencies(levelCheckboxes, levelDescriptions, lvl) {
  if (lvl === "I") {
    if (!levelCheckboxes["I"].checked()) {
      levelCheckboxes["II"].checked(false);
      levelCheckboxes["III"].checked(false);
      levelDescriptions["II"].div.style("display", "none");
      levelDescriptions["III"].div.style("display", "none");
    }
  } else if (lvl === "II") {
    if (levelCheckboxes["II"].checked()) {
      levelCheckboxes["I"].checked(true);
      levelDescriptions["I"].div.style("display", "block");
    } else {
      levelCheckboxes["III"].checked(false);
      levelDescriptions["III"].div.style("display", "none");
    }
  } else if (lvl === "III") {
    if (levelCheckboxes["III"].checked()) {
      // Fixed syntax error
      levelCheckboxes["I"].checked(true);
      levelCheckboxes["II"].checked(true);
      levelDescriptions["I"].div.style("display", "block");
      levelDescriptions["II"].div.style("display", "block");
    }
  }
  levelDescriptions[lvl].div.style(
    "display",
    levelCheckboxes[lvl].checked() ? "block" : "none"
  );
}
function updateTalentsTable() {
  let talentsTable = select("#talentsTable");
  if (!talentsTable) return;
  let rows = talentsTable.elt.getElementsByTagName("tr");
  while (rows.length > 1) rows[1].remove();

  talents.forEach((talent, index) => {
    let row = createElement("tr").parent(talentsTable);
    let arrowCell = createElement("td")
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");
    createButton("↑")
      .parent(arrowCell)
      .style("margin-right", "5px")
      .mousePressed(() => moveTalentUp(index));
    createButton("↓")
      .parent(arrowCell)
      .mousePressed(() => moveTalentDown(index));

    let nameCell = createElement("td", talent.name.split(" - Level")[0])
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("cursor", "pointer")
      .mousePressed(() =>
        showTalentDescription(talent.name, talent.description)
      );

    let levelCell = createElement("td")
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");
    let levelSelect = createSelect().parent(levelCell);
    let baseName = talent.name.split(" - Level")[0];
    let talentLevels = existingTalents.filter((t) =>
      t.name.startsWith(baseName + " - Level")
    );
    let availableLevels = talentLevels.map((t) => t.level);
    availableLevels.forEach((lvl) => levelSelect.option(lvl));
    levelSelect.value(talent.level);
    levelSelect.changed(() => {
      let newLevel = levelSelect.value();
      let newTalentData = existingTalents.find(
        (t) => t.name === `${baseName} - Level ${newLevel}`
      );
      if (newTalentData) {
        talents[index] = { ...newTalentData };
        updateTalentsTable();
      }
    });

    createElement("td", talent.category)
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");
    let actionCell = createElement("td")
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");
    createButton("Remove")
      .parent(actionCell)
      .style("margin", "5px")
      .mousePressed(() => {
        showConfirmationModal(`Remove ${talent.name}?`, () => {
          talents.splice(index, 1);
          updateTalentsTable();
        });
      });
  });
}

// ### Traits UI ###

function createTraitsUI() {
  let traitsContainerDiv = select("#traits");
  if (!traitsContainerDiv) {
    console.error("No #traits div found in HTML!");
    return;
  }
  traitsContainerDiv.html("");

  createElement("h2", "Traits").parent(traitsContainerDiv);
  let traitsDesc = createP(
    "Traits provide static positive and negative effects. A player can have a maximum of 3 traits by default. Adjust the max traits below if needed."
  ).parent(traitsContainerDiv);
  traitsDesc
    .style("font-size", "12px")
    .style("color", "#666")
    .style("margin-top", "5px")
    .style("margin-bottom", "10px");

  let maxTraitsDiv = createDiv()
    .parent(traitsContainerDiv)
    .class("resource-row");
  createSpan("Max Traits: ").parent(maxTraitsDiv);
  let maxTraitsInput = createInput(maxTraits.toString(), "number")
    .parent(maxTraitsDiv)
    .class("resource-input")
    .style("width", "50px")
    .changed(() => {
      let newMax = parseInt(maxTraitsInput.value());
      if (newMax < traits.length) {
        showConfirmationModal(
          `You currently have ${traits.length} traits. Reduce to ${newMax} by removing excess traits first.`,
          () => {},
          true
        );
      } else {
        maxTraits = newMax;
      }
    });

  createButton("Add Custom Trait")
    .parent(traitsContainerDiv)
    .style("margin", "5px")
    .mousePressed(showAddCustomTraitModal);
  createButton("Add / Edit Existing Traits")
    .parent(traitsContainerDiv)
    .style("margin", "5px")
    .mousePressed(showAddEditTraitsModal);
  createButton("Remove Existing Trait")
    .parent(traitsContainerDiv)
    .style("margin", "5px")
    .mousePressed(showRemoveExistingTraitModal);
  createButton("Default Trait List")
    .parent(traitsContainerDiv)
    .style("margin", "5px")
    .mousePressed(() =>
      showConfirmationModal(
        "Reset to default trait list?",
        resetToDefaultTraits
      )
    );

  let traitsTable = createElement("table")
    .parent(traitsContainerDiv)
    .id("traitsTable")
    .style("width", "100%")
    .style("border-collapse", "collapse")
    .style("margin-top", "10px");

  let headerRow = createElement("tr").parent(traitsTable);
  ["Name", "Category", "Actions"].forEach((header) => {
    createElement("th", header)
      .parent(headerRow)
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("background", "#f2f2f2");
  });

  updateTraitsTable();
} // Added closing brace
function showAddCustomTraitModal() {
  if (traits.length >= maxTraits) {
    showConfirmationModal(
      `You have reached the maximum number of traits (${maxTraits}). Remove a trait to add a new one.`,
      () => {},
      true
    );
    return;
  }
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Add Custom Trait").parent(modalDiv);
  let nameInput = createInput("")
    .parent(modalDiv)
    .attribute("placeholder", "Trait Name")
    .style("width", "100%")
    .style("margin-bottom", "10px");

  let categorySelect = createSelect()
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  categorySelect.option("Physical");
  categorySelect.option("Combat");
  categorySelect.option("Magical");
  categorySelect.option("Utility");

  let positiveLabel = createSpan("Positive Effect:")
    .parent(modalDiv)
    .style("display", "block");
  let positiveInput = createElement("textarea")
    .parent(modalDiv)
    .style("width", "100%")
    .style("height", "60px")
    .style("margin-bottom", "10px");

  let negativeLabel = createSpan("Negative Effect:")
    .parent(modalDiv)
    .style("display", "block");
  let negativeInput = createElement("textarea")
    .parent(modalDiv)
    .style("width", "100%")
    .style("height", "60px")
    .style("margin-bottom", "10px");

  let saveBtn = createButton("Save")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let name = nameInput.value();
      let category = categorySelect.value();
      let positive = positiveInput.value();
      let negative = negativeInput.value();
      if (!name || !category || !positive || !negative) {
        alert("Please fill in all fields.");
        return;
      }

      if (traits.some((t) => t.name === name)) {
        alert("This trait is already added!");
        return;
      }

      let newTrait = { name, category, positive, negative };
      existingTraits.push(newTrait);
      traits.push(newTrait);
      updateTraitsTable();
      modalDiv.remove();
    });

  createButton("Cancel")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => modalDiv.remove());
}

function showAddEditTraitsModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Add / Edit Existing Traits").parent(modalDiv);
  let traitSelect = createSelect()
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  existingTraits.forEach((trait, index) =>
    traitSelect.option(trait.name, index)
  );

  let nameLabel = createSpan("Trait Name:").parent(modalDiv);
  let nameInput = createInput("")
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");

  let categoryLabel = createSpan("Category:").parent(modalDiv);
  let categorySelect = createSelect()
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  categorySelect.option("Physical");
  categorySelect.option("Combat");
  categorySelect.option("Magical");
  categorySelect.option("Utility");

  let positiveLabel = createSpan("Positive Effect:")
    .parent(modalDiv)
    .style("display", "block");
  let positiveInput = createElement("textarea")
    .parent(modalDiv)
    .style("width", "100%")
    .style("height", "60px")
    .style("margin-bottom", "10px");

  let negativeLabel = createSpan("Negative Effect:")
    .parent(modalDiv)
    .style("display", "block");
  let negativeInput = createElement("textarea")
    .parent(modalDiv)
    .style("width", "100%")
    .style("height", "60px")
    .style("margin-bottom", "10px");

  let addToCharacterBtn = createButton("Add to Character")
    .parent(modalDiv)
    .style("margin", "5px");
  let saveBtn = createButton("Save").parent(modalDiv).style("margin", "5px");
  let closeBtn = createButton("Close").parent(modalDiv).style("margin", "5px");

  function loadTraitData() {
    let index = parseInt(traitSelect.value());
    if (index >= 0) {
      let trait = existingTraits[index];
      nameInput.value(trait.name);
      categorySelect.value(trait.category);
      positiveInput.value(trait.positive);
      negativeInput.value(trait.negative);
    }
  }

  traitSelect.changed(loadTraitData);
  if (existingTraits.length > 0) loadTraitData();

  addToCharacterBtn.mousePressed(() => {
    if (traits.length >= maxTraits) {
      alert(
        `You have reached the maximum number of traits (${maxTraits}). Remove a trait to add a new one.`
      );
      return;
    }
    let index = parseInt(traitSelect.value());
    if (index >= 0) {
      let traitToAdd = { ...existingTraits[index] };
      if (traits.some((t) => t.name === traitToAdd.name)) {
        alert("This trait is already added!");
        return;
      }
      traits.push(traitToAdd);
      updateTraitsTable();
    }
  });

  saveBtn.mousePressed(() => {
    let index = parseInt(traitSelect.value());
    if (index >= 0) {
      let oldName = existingTraits[index].name;
      let newName = nameInput.value();
      let newCategory = categorySelect.value();
      let newPositive = positiveInput.value();
      let newNegative = negativeInput.value();
      if (!newName || !newPositive || !newNegative) {
        alert("Please provide a name, positive effect, and negative effect.");
        return;
      }

      existingTraits[index] = {
        name: newName,
        category: newCategory,
        positive: newPositive,
        negative: newNegative,
      };
      let traitInTableIndex = traits.findIndex((t) => t.name === oldName);
      if (traitInTableIndex >= 0) {
        traits[traitInTableIndex] = { ...existingTraits[index] };
      }

      updateTraitsTable();
      traitSelect.html("");
      existingTraits.forEach((trait, idx) =>
        traitSelect.option(trait.name, idx)
      );
      traitSelect.value(index);
    }
  });

  closeBtn.mousePressed(() => modalDiv.remove());
}

function showRemoveExistingTraitModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Remove Existing Trait").parent(modalDiv);
  let traitLabel = createSpan("Select Trait to Remove:").parent(modalDiv);
  let traitSelect = createSelect()
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  let uniqueNames = [...new Set(existingTraits.map((t) => t.name))];
  uniqueNames.forEach((name) => traitSelect.option(name));

  createButton("Remove")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let selectedName = traitSelect.value();
      showConfirmationModal(`Remove ${selectedName}?`, () => {
        existingTraits = existingTraits.filter((t) => t.name !== selectedName);
        traits = traits.filter((t) => t.name !== selectedName);
        updateTraitsTable();
        modalDiv.remove();
      });
    });

  createButton("Cancel")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => modalDiv.remove());
}

function resetToDefaultTraits() {
  existingTraits = [...defaultTraits];
  traits = [];
  updateTraitsTable();
}

function updateTraitsTable() {
  let traitsTable = select("#traitsTable");
  if (!traitsTable) return;
  let rows = traitsTable.elt.getElementsByTagName("tr");
  while (rows.length > 1) rows[1].remove();

  traits.forEach((trait, index) => {
    let row = createElement("tr").parent(traitsTable);
    let nameCell = createElement("td", trait.name)
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px")
      .style("cursor", "pointer")
      .mousePressed(() =>
        showTraitDescription(trait.name, trait.positive, trait.negative)
      );
    createElement("td", trait.category)
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");
    let actionCell = createElement("td")
      .parent(row)
      .style("border", "1px solid #ccc")
      .style("padding", "5px");
    createButton("Remove")
      .parent(actionCell)
      .style("margin", "5px")
      .mousePressed(() => {
        showConfirmationModal(`Remove ${trait.name}?`, () => {
          traits.splice(index, 1);
          updateTraitsTable();
        });
      });
  });
}

// ### Stat and Resource Management ###

function getStatBonuses() {
  let bonuses = {};
  for (let slot in equippedItems) {
    let item = equippedItems[slot];
    if (item) {
      // Equipment bonuses
      if (item.statBonus) {
        let stat = item.statBonus.stat;
        let amount = item.statBonus.amount;
        bonuses[stat] = (bonuses[stat] || 0) + amount;
      }
      // Crystal bonuses
      if (item.equippedCrystals) {
        item.equippedCrystals.forEach(crystal => {
          if (crystal && crystal.statBonuses) {
            for (let stat in crystal.statBonuses) {
              bonuses[stat] = (bonuses[stat] || 0) + crystal.statBonuses[stat];
            }
          }
        });
      }
    }
  }
  return bonuses;
}

function getTotalStat(statName) {
  let baseStat;
  switch (statName) {
    case "STR":
      baseStat = stat_str;
      break;
    case "VIT":
      baseStat = stat_vit;
      break;
    case "DEX":
      baseStat = stat_dex;
      break;
    case "MAG":
      baseStat = stat_mag;
      break;
    case "WIL":
      baseStat = stat_wil;
      break;
    case "SPR":
      baseStat = stat_spr;
      break;
    case "LCK":
      baseStat = stat_lck;
      break;
    default:
      return 0;
  }
  let bonuses = getStatBonuses();
  return baseStat + (bonuses[statName] || 0);
}

function updateResourcesBasedOnStats() {
  let totalVIT = getTotalStat("VIT");
  max_hp = 25 + (totalVIT - 1) * 5;
  current_hp = min(current_hp, max_hp);
  maxHpInput.value(max_hp);

  let totalWIL = getTotalStat("WIL");
  max_mp = 10 + (totalWIL - 1) * 5;
  current_mp = min(current_mp, max_mp);
  maxMpInput.value(max_mp);
}

function updateStatBonusesDisplay() {
  let bonuses = getStatBonuses();
  for (let stat in statBonusElements) {
    let bonus = bonuses[stat] || 0;
    if (bonus > 0) {
      statBonusElements[stat].html(` (+${bonus})`);
    } else {
      statBonusElements[stat].html("");
    }
  }
}
// Inventory UI Creation
function createInventoryUI() {
  console.log("Creating Inventory UI, current inventory:", JSON.stringify(inventory, null, 2)); // Detailed logging
  let inventoryContainer = select("#inventory");
  if (!inventoryContainer) {
    console.error("No #inventory div found in HTML!");
    return;
  }
  inventoryContainer.html("");

  createElement("h2", "Inventory").parent(inventoryContainer);
  createSpan("Use buttons to add, edit, or remove items. Click an item’s name to view details. Adjust Quantity directly.")
    .parent(inventoryContainer)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block")
    .style("margin-bottom", "10px");

  let buttonRow = createDiv().parent(inventoryContainer).class("resource-row");
  createButton("Add Item")
    .parent(buttonRow)
    .class("resource-button")
    .mousePressed(showAddItemModal);
  createButton("Add Custom")
    .parent(buttonRow)
    .class("resource-button")
    .mousePressed(showAddCustomInventoryModal);
  createButton("Edit")
    .parent(buttonRow)
    .class("resource-button")
    .mousePressed(showEditInventoryModal);
  createButton("Remove")
    .parent(buttonRow)
    .class("resource-button")
    .mousePressed(showRemoveInventoryModal);
  createButton("Default List")
    .parent(buttonRow)
    .class("resource-button")
    .mousePressed(() => {
      showConfirmationModal("Are you sure you want to reset to the default inventory list? This will overwrite all changes.", () => {
        console.log("Resetting inventory to default list");
        inventory = [];
        ["Consumables", "Materials", "Miscellaneous"].forEach(cat => {
          availableItems[cat].forEach(item => {
            inventory.push({ ...item });
          });
        });
        localStorage.setItem('inventory', JSON.stringify(inventory)); // Save default state
        updateAvailableEquipment();
        createInventoryUI();
        createEquipmentUI();
      });
    });

  let categoryContainer = createDiv().parent(inventoryContainer).style("margin-top", "10px");

  let itemsByCategory = {};
  inventoryCategories.forEach(cat => itemsByCategory[cat] = []);
  inventory.forEach(item => {
    const category = item.category || "Miscellaneous";
    if (!itemsByCategory[category]) itemsByCategory[category] = [];
    itemsByCategory[category].push(item);
  });

  inventoryCategories.forEach(category => {
    const items = itemsByCategory[category];
    if (items.length === 0) return;

    let categoryDiv = createDiv().parent(categoryContainer).style("margin-bottom", "10px");
    let categoryHeader = createElement("h3", `${category} (${items.length})`)
      .parent(categoryDiv)
      .style("cursor", "pointer")
      .style("margin", "0")
      .style("background", "#f2f2f2")
      .style("padding", "5px");

    let contentDiv = createDiv().parent(categoryDiv);
    contentDiv.style("display", categoryStates[category] ? "block" : "none");
    let table = createElement("table").parent(contentDiv).class("rules-table");
    let header = createElement("tr").parent(table);
    createElement("th", "Item Name").parent(header).style("width", "20%");
    createElement("th", "Description").parent(header).style("width", "30%");
    createElement("th", "Quantity").parent(header).style("width", "15%");
    createElement("th", "Quality").parent(header).style("width", "15%"); // Added Quality column
    createElement("th", "Actions").parent(header).style("width", "20%");

    items.forEach((item, idx) => {
      let row = createElement("tr").parent(table);
      let nameCell = createElement("td").parent(row);
      let nameSpan = createSpan(item.name)
        .parent(nameCell)
        .style("cursor", "pointer")
        .style("color", "#0000EE")
        .style("text-decoration", "underline")
        .mousePressed(() => showItemDetailsModal(item));
      createElement("td", item.description || "-").parent(row);
      let quantityCell = createElement("td").parent(row);
      let qtyInput = createInput((item.quantity || 1).toString(), "number")
        .parent(quantityCell)
        .attribute("min", "1")
        .style("width", "50px")
        .value((item.quantity || 1).toString());
      qtyInput.changed(function() {
        let newQuantity = parseInt(this.value()) || 1;
        console.log(`Updating ${item.name} quantity from ${item.quantity} to ${newQuantity}`);
        let inventoryIdx = inventory.findIndex(i => i.name === item.name && i.category === item.category);
        if (inventoryIdx !== -1) {
          inventory[inventoryIdx].quantity = newQuantity;
          console.log("Updated inventory at index", inventoryIdx, ":", JSON.stringify(inventory, null, 2));
          localStorage.setItem('inventory', JSON.stringify(inventory)); // Persist to localStorage
          nameSpan.html(`${item.name}`);
          this.value(newQuantity.toString());
        } else {
          console.error(`Item ${item.name} not found in inventory!`);
        }
      });
      createElement("td", item.quality || "Common").parent(row); // Display quality as static text
      let actionCell = createElement("td").parent(row);
      createButton("Delete")
        .parent(actionCell)
        .class("resource-button small-button")
        .mousePressed(() => {
          let inventoryIdx = inventory.findIndex(i => i.name === item.name && i.category === item.category);
          if (inventoryIdx !== -1) {
            showConfirmationModal(`Are you sure you want to delete ${item.name}?`, () => {
              inventory.splice(inventoryIdx, 1);
              localStorage.setItem('inventory', JSON.stringify(inventory)); // Update localStorage
              updateAvailableEquipment();
              createInventoryUI();
              createEquipmentUI();
            });
          } else {
            console.error(`Item ${item.name} not found in inventory for deletion!`);
          }
        });
    });

    categoryHeader.mousePressed(() => {
      const isVisible = contentDiv.style("display") === "block";
      categoryStates[category] = !isVisible;
      contentDiv.style("display", isVisible ? "none" : "block");
    });
  });
}
function showAddCustomInventoryModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Add Custom Item").parent(modalDiv);

  let categoryDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Category:")
    .parent(categoryDiv)
    .style("display", "block");
  let categorySelect = createSelect()
    .parent(categoryDiv)
    .style("width", "100%");
  ["Consumables", "Materials", "Miscellaneous"].forEach((cat) =>
    categorySelect.option(cat)
  );
  createSpan("The type of item (for Equipment, use the Equipment tab).")
    .parent(categoryDiv)
    .style("font-size", "12px")
    .style("color", "#666")
    .style("display", "block");

  let nameDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Name:")
    .parent(nameDiv)
    .style("display", "block");
  let nameInput = createInput("")
    .parent(nameDiv)
    .style("width", "100%")
    .attribute("placeholder", "e.g., Custom Potion");

  let descDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Description:")
    .parent(descDiv)
    .style("display", "block");
  let descriptionInput = createElement("textarea")
    .parent(descDiv)
    .style("width", "100%")
    .style("height", "60px")
    .attribute("placeholder", "Describe the item...");

  let quantityDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Quantity:")
    .parent(quantityDiv)
    .style("display", "block");
  let quantityInput = createInput("1", "number")
    .parent(quantityDiv)
    .style("width", "100%")
    .attribute("min", "1");

  let qualityDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Quality:")
    .parent(qualityDiv)
    .style("display", "block");
  let qualitySelect = createSelect()
    .parent(qualityDiv)
    .style("width", "100%");
  ["Poor", "Common", "Uncommon", "Rare", "Legendary"].forEach(q => qualitySelect.option(q));

  createButton("Add")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let category = categorySelect.value();
      let name = nameInput.value();
      if (!name) {
        showConfirmationModal("Please provide a name for the item.", () => {}, true);
        return;
      }
      let newItem = {
        name: name,
        description: descriptionInput.value(),
        category: category,
        quantity: parseInt(quantityInput.value()) || 1,
        quality: qualitySelect.value() || "Common"
      };
      inventory.push(newItem);
      console.log("Added custom item:", newItem); // Debug
      updateAvailableEquipment();
      console.log("Updated availableEquipment:", availableEquipment); // Debug
      createEquipmentUI(); // Refresh Equipment table
      createInventoryUI(); // Refresh Inventory
      modalDiv.remove();
    });

  createButton("Cancel")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => modalDiv.remove());
}
function showAddEditInventoryModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv().class("modal");

  createElement("h3", "Edit or Remove Items").parent(modalDiv);

  inventory.forEach((item, index) => {
    let itemRow = createDiv().parent(modalDiv).class("resource-row");
    createSpan(`${item.name} (${item.category})`).parent(itemRow).style("flex", "1");
    createButton("Edit")
      .parent(itemRow)
      .class("resource-button small-button")
      .mousePressed(() => editInventoryItem(index));
    createButton("Remove")
      .parent(itemRow)
      .class("resource-button small-button")
      .mousePressed(() => {
        inventory.splice(index, 1);
        modalDiv.remove();
        createInventoryUI();
      });
  });

  createButton("Close")
    .parent(modalDiv)
    .style("margin-top", "10px")
    .mousePressed(() => modalDiv.remove());
}

function editInventoryItem(index) {
  if (modalDiv) modalDiv.remove();
  let item = inventory[index];
  modalDiv = createDiv().class("modal");

  createElement("h3", `Edit Item: ${item.name}`).parent(modalDiv);

  let descInput = createInput(item.description || "")
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  let categorySelect = createSelect()
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  inventoryCategories.forEach(cat => categorySelect.option(cat));
  categorySelect.value(item.category || "Miscellaneous");

  createButton("Save")
    .parent(modalDiv)
    .mousePressed(() => {
      inventory[index].description = descInput.value();
      inventory[index].category = categorySelect.value();
      modalDiv.remove();
      createInventoryUI();
    });

  createButton("Cancel")
    .parent(modalDiv)
    .mousePressed(() => modalDiv.remove());
}
function showCreateCustomCrystalModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Add Custom Crystal").parent(modalDiv);

  let errorMessage = createP("")
    .parent(modalDiv)
    .style("color", "red")
    .style("display", "none")
    .style("margin-bottom", "10px");

  let nameDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Name:").parent(nameDiv).style("display", "inline-block").style("width", "100px");
  let nameInput = createInput("").parent(nameDiv).style("width", "180px");
  createSpan("The crystal’s unique identifier.").parent(nameDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  let descDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Description:").parent(descDiv).style("display", "inline-block").style("width", "100px");
  let descInput = createInput("").parent(descDiv).style("width", "180px");
  createSpan("What the crystal does or its lore.").parent(descDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  let statBonusDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Stat Bonus:").parent(statBonusDiv).style("display", "inline-block").style("width", "100px");
  let statSelect = createSelect().parent(statBonusDiv).style("width", "80px").style("margin-right", "5px");
  ["None", "STR", "VIT", "DEX", "MAG", "WIL", "SPR", "LCK"].forEach(stat => statSelect.option(stat));
  let amountInput = createInput("0", "number").parent(statBonusDiv).style("width", "50px");
  createSpan("Stat to boost (e.g., MAG) and amount.").parent(statBonusDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  let statReqDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Stat Requirement:").parent(statReqDiv).style("display", "inline-block").style("width", "100px");
  let statReqSelect = createSelect().parent(statReqDiv).style("width", "80px").style("margin-right", "5px");
  ["None", "STR", "VIT", "DEX", "MAG", "WIL", "SPR", "LCK"].forEach(stat => statReqSelect.option(stat));
  let statReqInput = createInput("0", "number").parent(statReqDiv).style("width", "50px");
  createSpan("Minimum stat needed to equip (e.g., 5 MAG).").parent(statReqDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  let abilitiesDiv = createDiv().parent(modalDiv).style("margin-bottom", "10px");
  createSpan("Abilities:").parent(abilitiesDiv).style("display", "inline-block").style("width", "100px");
  let abilitiesInput = createInput("").parent(abilitiesDiv).style("width", "180px").attribute("placeholder", "e.g., Fire, Cure");
  createSpan("Skills granted (comma-separated).").parent(abilitiesDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  createButton("Save")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let name = nameInput.value().trim();
      let desc = descInput.value().trim();
      let stat = statSelect.value();
      let amount = parseInt(amountInput.value()) || 0;
      let reqStat = statReqSelect.value();
      let reqAmount = parseInt(statReqInput.value()) || 0;
      let abilities = abilitiesInput.value().split(",").map(a => a.trim()).filter(a => a);

      if (!name || !desc) {
        errorMessage.html("Please provide a name and description.");
        errorMessage.style("display", "block");
        return;
      }

      // Enhanced duplicate check with logging
      if (inventory.some(item => item.name === name && item.category === "Materials")) {
        errorMessage.html(`A crystal with the name "${name}" already exists. Please choose a different name.`);
        errorMessage.style("display", "block");
        return;
      }

      let crystal = {
        name,
        description: desc,
        category: "Materials",
        statBonuses: stat !== "None" ? { [stat]: amount } : {},
        statRequirements: reqStat !== "None" ? { [reqStat]: reqAmount } : {},
        abilities: abilities.length > 0 ? abilities : [],
        quantity: 1,
        quality: "Common"
      };

      console.log("Adding new crystal:", crystal); // Debug log
      inventory.push(crystal);
      localStorage.setItem('inventory', JSON.stringify(inventory)); // Persist to localStorage
      console.log("Updated inventory:", inventory); // Debug log
      updateAvailableEquipment();
      createEquipmentUI();
      if (typeof createInventoryUI === "function") createInventoryUI(); // Optional, if exists
      modalDiv.remove();
      errorMessage.style("display", "none");
    });

  createButton("Cancel")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      modalDiv.remove();
      errorMessage.style("display", "none");
    });
}
function showRemoveEditCrystalsModal() {
  if (modalDiv) modalDiv.remove();
  modalDiv = createDiv()
    .style("position", "absolute")
    .style("top", "50%")
    .style("left", "50%")
    .style("transform", "translate(-50%, -50%)")
    .style("background", "#fff")
    .style("padding", "20px")
    .style("border", "2px solid #000")
    .style("z-index", "1000")
    .style("width", "300px");

  createElement("h3", "Remove / Edit Crystals").parent(modalDiv);

  // Add inline error message at the top
  let errorMessage = createP("")
    .parent(modalDiv)
    .style("color", "red")
    .style("display", "none")
    .style("margin-bottom", "10px");

  let crystalSelect = createSelect()
    .parent(modalDiv)
    .style("width", "100%")
    .style("margin-bottom", "10px");
  let crystals = inventory.filter(item => item.category === "Materials");
  if (crystals.length === 0) {
    crystalSelect.option("No crystals available");
  } else {
    crystals.forEach((crystal, idx) => crystalSelect.option(crystal.name, idx));
  }

  createSpan("Name: The crystal's unique identifier.").parent(modalDiv).style("font-size", "12px").style("color", "#666").style("display", "block");
  let nameInput = createInput("").parent(modalDiv).style("width", "100%").style("margin-bottom", "10px");

  createSpan("Description: What the crystal does or its lore.").parent(modalDiv).style("font-size", "12px").style("color", "#666").style("display", "block");
  let descInput = createInput("").parent(modalDiv).style("width", "100%").style("margin-bottom", "10px");

  let statBonusDiv = createDiv().parent(modalDiv);
  createSpan("Stat Bonus: Which stat to boost (e.g., MAG for magic power).").parent(statBonusDiv).style("font-size", "12px").style("color", "#666").style("display", "block");
  let statSelect = createSelect().parent(statBonusDiv);
  ["None", "STR", "VIT", "DEX", "MAG", "WIL", "SPR", "LCK"].forEach(stat => statSelect.option(stat));
  let amountInput = createInput("0", "number").parent(statBonusDiv).style("width", "50px").style("margin-bottom", "10px");
  createSpan("Amount: How much to boost the stat (positive number).").parent(statBonusDiv).style("font-size", "12px").style("color", "#666").style("display", "block");

  let statReqDiv = createDiv().parent(modalDiv);
  createSpan("Stat Requirement: Minimum stat needed to equip (e.g., 5 MAG).").parent(statReqDiv).style("font-size", "12px").style("color", "#666").style("display", "block");
  let statReqSelect = createSelect().parent(statReqDiv);
  ["None", "STR", "VIT", "DEX", "MAG", "WIL", "SPR", "LCK"].forEach(stat => statReqSelect.option(stat));
  let statReqInput = createInput("0", "number").parent(statReqDiv).style("width", "50px").style("margin-bottom", "10px");

  createSpan("Abilities: Skills granted (comma-separated, e.g., Fire, Cure).").parent(modalDiv).style("font-size", "12px").style("color", "#666").style("display", "block");
  let abilitiesInput = createInput("").parent(modalDiv).style("width", "100%").style("margin-bottom", "10px");

  function loadCrystalData() {
    let idx = parseInt(crystalSelect.value());
    if (idx >= 0 && idx < crystals.length) {
      let crystal = crystals[idx];
      nameInput.value(crystal.name || "");
      descInput.value(crystal.description || "");
      let statBonuses = crystal.statBonuses || {};
      let stat = Object.keys(statBonuses).length > 0 ? Object.keys(statBonuses)[0] : "None";
      statSelect.value(stat);
      amountInput.value(stat !== "None" && statBonuses[stat] ? statBonuses[stat] : 0);
      let statReqs = crystal.statRequirements || {};
      let reqStat = Object.keys(statReqs).length > 0 ? Object.keys(statReqs)[0] : "None";
      statReqSelect.value(reqStat);
      statReqInput.value(reqStat !== "None" && statReqs[reqStat] ? statReqs[reqStat] : 0);
      abilitiesInput.value(crystal.abilities && Array.isArray(crystal.abilities) ? crystal.abilities.join(", ") : "");
    }
  }

  crystalSelect.changed(loadCrystalData);
  if (crystals.length > 0) loadCrystalData();

  createButton("Save")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let idx = parseInt(crystalSelect.value());
      if (crystals.length === 0 || idx < 0 || idx >= crystals.length) {
        errorMessage.html("No crystal selected to edit.");
        errorMessage.style("display", "block");
        return;
      }

      let crystal = crystals[idx];
      let newName = nameInput.value().trim();
      let newDesc = descInput.value().trim();
      let stat = statSelect.value();
      let amount = parseInt(amountInput.value()) || 0;
      let reqStat = statReqSelect.value();
      let reqAmount = parseInt(statReqInput.value()) || 0;
      let abilities = abilitiesInput.value().split(",").map(a => a.trim()).filter(a => a);

      if (!newName || !newDesc) {
        errorMessage.html("Please provide a name and description.");
        errorMessage.style("display", "block");
        return;
      }

      // Check for duplicate name (excluding the current crystal)
      if (newName !== crystal.name && inventory.some(item => item.name === newName && item.category === "Materials")) {
        errorMessage.html(`A crystal with the name "${newName}" already exists. Please choose a different name.`);
        errorMessage.style("display", "block");
        return;
      }

      let inventoryIdx = inventory.indexOf(crystal);
      let updatedCrystal = {
        name: newName,
        description: newDesc,
        category: "Materials",
        statBonuses: stat !== "None" ? { [stat]: amount } : {},
        statRequirements: reqStat !== "None" ? { [reqStat]: reqAmount } : {},
        abilities: abilities.length > 0 ? abilities : [],
        quantity: crystal.quantity || 1,
        quality: crystal.quality || "Common"
      };

      console.log("Updating crystal:", updatedCrystal); // Debug log
      inventory[inventoryIdx] = updatedCrystal;

      // Sync equipped crystals
      for (let slot in equippedItems) {
        let item = equippedItems[slot];
        if (item && item.equippedCrystals) {
          item.equippedCrystals = item.equippedCrystals.map(c => (c && c.name === crystal.name ? updatedCrystal : c));
        }
      }

      localStorage.setItem('inventory', JSON.stringify(inventory)); // Persist to localStorage
      console.log("Updated inventory:", inventory); // Debug log
      updateStatBonusesDisplay();
      updateResourcesBasedOnStats();
      updateAbilities();
      createEquipmentUI();
      modalDiv.remove();
      errorMessage.style("display", "none");
    });

  createButton("Remove")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      let idx = parseInt(crystalSelect.value());
      if (crystals.length === 0 || idx < 0 || idx >= crystals.length) {
        errorMessage.html("No crystal selected to remove.");
        errorMessage.style("display", "block");
        return;
      }

      let crystal = crystals[idx];
      showConfirmationModal(
        `Are you sure you want to remove "${crystal.name}"?`,
        () => {
          // Unequip the crystal from all equipment
          for (let slot in equippedItems) {
            let item = equippedItems[slot];
            if (item && item.equippedCrystals) {
              item.equippedCrystals = item.equippedCrystals.map(c => (c && c.name === crystal.name ? null : c));
            }
          }
          inventory.splice(inventory.indexOf(crystal), 1);
          localStorage.setItem('inventory', JSON.stringify(inventory)); // Persist to localStorage
          console.log("Removed crystal:", crystal.name, "Updated inventory:", inventory); // Debug log
          updateStatBonusesDisplay();
          updateResourcesBasedOnStats();
          updateAbilities();
          createEquipmentUI();
          modalDiv.remove();
          errorMessage.style("display", "none");
        }
      );
    });

  createButton("Close")
    .parent(modalDiv)
    .style("margin", "5px")
    .mousePressed(() => {
      modalDiv.remove();
      errorMessage.style("display", "none");
    });
}
